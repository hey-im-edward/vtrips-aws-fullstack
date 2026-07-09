param(
  [string]$StackName = "vtrips-demo",
  [string]$Region = "ap-southeast-1"
)

$ErrorActionPreference = "Stop"

function Resolve-AwsCli {
  $command = Get-Command aws -ErrorAction SilentlyContinue
  if ($command) {
    return $command.Source
  }

  $candidates = @(
    "C:\Program Files\Amazon\AWSCLIV2\aws.exe",
    "$env:LOCALAPPDATA\Programs\Amazon\AWSCLIV2\aws.exe"
  )

  foreach ($candidate in $candidates) {
    if (Test-Path $candidate) {
      return $candidate
    }
  }

  throw "AWS CLI was not found. Install AWS CLI v2 or add aws.exe to PATH."
}

function Invoke-CheckedNative {
  param(
    [Parameter(Mandatory = $true)][string]$FilePath,
    [Parameter(Mandatory = $true)][string[]]$Arguments
  )

  & $FilePath @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed with exit code ${LASTEXITCODE}: $FilePath $($Arguments -join ' ')"
  }
}

function Invoke-JsonNative {
  param(
    [Parameter(Mandatory = $true)][string]$FilePath,
    [Parameter(Mandatory = $true)][string[]]$Arguments
  )

  $output = & $FilePath @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed with exit code ${LASTEXITCODE}: $FilePath $($Arguments -join ' ')"
  }
  $jsonText = ($output | Out-String).Trim()
  if (-not $jsonText) {
    throw "Command returned empty JSON output: $FilePath $($Arguments -join ' ')"
  }
  return $jsonText | ConvertFrom-Json
}

function Assert-SafeIdentity {
  param([string]$AwsPath)

  if ($Region -ne "ap-southeast-1") {
    throw "Refusing deploy: region must be ap-southeast-1."
  }

  $identity = Invoke-JsonNative -FilePath $AwsPath -Arguments @("sts", "get-caller-identity", "--region", $Region)
  if ($identity.Account -ne "606163772198") {
    throw "Refusing deploy: expected account 606163772198 but got $($identity.Account)."
  }
  if ($identity.Arn -like "*:root") {
    throw "Refusing deploy: root identity is not allowed."
  }

  return $identity
}

function Assert-BudgetGuard {
  param([string]$AwsPath)

  $budget = Invoke-JsonNative -FilePath $AwsPath -Arguments @(
    "budgets",
    "describe-budget",
    "--account-id",
    "606163772198",
    "--budget-name",
    "VTrips-Demo-Budget",
    "--region",
    $Region
  )

  if ($budget.Budget.BudgetName -ne "VTrips-Demo-Budget") {
    throw "Refusing deploy: AWS Budget VTrips-Demo-Budget was not returned."
  }
  if ($budget.Budget.BudgetType -ne "COST") {
    throw "Refusing deploy: AWS Budget VTrips-Demo-Budget is not a COST budget."
  }
  if ($budget.Budget.TimeUnit -ne "MONTHLY") {
    throw "Refusing deploy: AWS Budget VTrips-Demo-Budget is not MONTHLY."
  }
  if (-not $budget.Budget.BudgetLimit) {
    throw "Refusing deploy: AWS Budget VTrips-Demo-Budget limit could not be read."
  }

  $amount = [decimal]$budget.Budget.BudgetLimit.Amount
  $unit = $budget.Budget.BudgetLimit.Unit
  if ($amount -ne 5 -or $unit -ne "USD") {
    throw "Refusing deploy: AWS Budget VTrips-Demo-Budget must be 5 USD/month, got $amount $unit."
  }

  return $budget.Budget
}

function Get-StackOutputs {
  param([string]$AwsPath)

  $stack = Invoke-JsonNative -FilePath $AwsPath -Arguments @("cloudformation", "describe-stacks", "--stack-name", $StackName, "--region", $Region)
  $outputs = [ordered]@{}
  foreach ($output in $stack.Stacks[0].Outputs) {
    $outputs[$output.OutputKey] = $output.OutputValue
  }
  return $outputs
}

function Ensure-NodeDependencies {
  param([string]$RepoRoot)

  if (-not (Test-Path (Join-Path $RepoRoot "node_modules"))) {
    Write-Host "node_modules not found. Running npm.cmd install before deployment validation."
    Invoke-CheckedNative -FilePath "npm.cmd" -Arguments @("install")
  } else {
    Write-Host "node_modules found. Skipping npm.cmd install."
  }
}

function Invoke-PreResourceValidation {
  param([string]$RepoRoot)

  Push-Location $RepoRoot
  try {
    Ensure-NodeDependencies -RepoRoot $RepoRoot
    Write-Host "Running pre-resource production build."
    Invoke-CheckedNative -FilePath "npm.cmd" -Arguments @("run", "build")
    Write-Host "Running local Lambda smoke test."
    Invoke-CheckedNative -FilePath "node" -Arguments @("infra/aws/test-lambda.mjs")
  }
  finally {
    Pop-Location
  }
}

function Invoke-FrontendBuild {
  param(
    [string]$RepoRoot,
    [string]$ApiUrl
  )

  Push-Location $RepoRoot
  try {
    $previousApiBaseUrl = $env:VITE_API_BASE_URL
    $env:VITE_API_BASE_URL = $ApiUrl.TrimEnd("/")
    Invoke-CheckedNative -FilePath "npm.cmd" -Arguments @("run", "build")
  }
  finally {
    if ($null -eq $previousApiBaseUrl) {
      Remove-Item Env:\VITE_API_BASE_URL -ErrorAction SilentlyContinue
    } else {
      $env:VITE_API_BASE_URL = $previousApiBaseUrl
    }
    Pop-Location
  }
}

function Invoke-ApiCheck {
  param(
    [string]$ApiUrl,
    [string]$Path,
    [int]$Attempts = 6
  )

  $uri = "$($ApiUrl.TrimEnd('/'))$Path"
  for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
    try {
      $result = Invoke-RestMethod -Method Get -Uri $uri -TimeoutSec 15
      Write-Host "API check passed: $Path"
      return $result
    }
    catch {
      if ($attempt -eq $Attempts) {
        throw "API check failed after $Attempts attempts: $Path. $($_.Exception.Message)"
      }
      Start-Sleep -Seconds 5
    }
  }
}

function Invoke-PostDeployVerification {
  param([string]$ApiUrl)

  $health = Invoke-ApiCheck -ApiUrl $ApiUrl -Path "/api/health"
  if ($health.status -ne "ok") {
    throw "API health check returned unexpected status: $($health.status)"
  }

  Invoke-ApiCheck -ApiUrl $ApiUrl -Path "/api/saved" | Out-Null
  Invoke-ApiCheck -ApiUrl $ApiUrl -Path "/api/bookings" | Out-Null
}

function Write-CleanupHint {
  param([string]$Reason)

  Write-Warning $Reason
  Write-Warning "Stack name: $StackName"
  Write-Warning "Region: $Region"
  Write-Warning "Cleanup command: .\infra\aws\cleanup.ps1 -Region $Region -StackName $StackName -ConfirmCleanup"
  Write-Warning "Cleanup was not run automatically."
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$templatePath = Join-Path $PSScriptRoot "cloudformation.yml"
$lambdaSource = Join-Path $PSScriptRoot "lambda\index.mjs"
$buildDir = Join-Path $PSScriptRoot ".build"
$lambdaBuildDir = Join-Path $buildDir "lambda"
$lambdaZip = Join-Path $buildDir "vtrips-demo-lambda.zip"
$outputsJson = Join-Path $PSScriptRoot "outputs.json"
$outputsMarkdown = Join-Path $repoRoot "docs\deployment\aws-production-outputs.md"

$AWS = Resolve-AwsCli
$identity = Assert-SafeIdentity -AwsPath $AWS
$budget = Assert-BudgetGuard -AwsPath $AWS

Write-Host "AWS CLI: $AWS"
Write-Host "AWS account verified: $($identity.Account)"
Write-Host "AWS identity ARN verified and not root."
Write-Host "Region: $Region"
Write-Host "AWS Budget guard verified: $($budget.BudgetName), $($budget.BudgetLimit.Amount) $($budget.BudgetLimit.Unit)/month."

Invoke-PreResourceValidation -RepoRoot $repoRoot

if (Test-Path $buildDir) {
  Remove-Item -LiteralPath $buildDir -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $lambdaBuildDir | Out-Null
Copy-Item -LiteralPath $lambdaSource -Destination (Join-Path $lambdaBuildDir "index.mjs") -Force
Compress-Archive -Path (Join-Path $lambdaBuildDir "*") -DestinationPath $lambdaZip -Force

Invoke-CheckedNative -FilePath $AWS -Arguments @("cloudformation", "validate-template", "--template-body", "file://$templatePath", "--region", $Region)

try {
  Invoke-CheckedNative -FilePath $AWS -Arguments @(
    "cloudformation",
    "deploy",
    "--stack-name",
    $StackName,
    "--template-file",
    $templatePath,
    "--capabilities",
    "CAPABILITY_NAMED_IAM",
    "--region",
    $Region,
    "--tags",
    "Project=VTrips",
    "Owner=hey-im-edward",
    "Environment=demo"
  )

  $outputs = Get-StackOutputs -AwsPath $AWS

  Invoke-CheckedNative -FilePath $AWS -Arguments @(
    "lambda",
    "update-function-code",
    "--function-name",
    $outputs.LambdaFunctionName,
    "--zip-file",
    "fileb://$lambdaZip",
    "--region",
    $Region
  )

  Invoke-CheckedNative -FilePath $AWS -Arguments @("lambda", "wait", "function-updated", "--function-name", $outputs.LambdaFunctionName, "--region", $Region)

  Invoke-FrontendBuild -RepoRoot $repoRoot -ApiUrl $outputs.ApiUrl

  Invoke-PostDeployVerification -ApiUrl $outputs.ApiUrl

  Invoke-CheckedNative -FilePath $AWS -Arguments @("s3", "sync", (Join-Path $repoRoot "frontend\dist"), "s3://$($outputs.FrontendBucketName)/", "--delete", "--region", $Region)

  Invoke-CheckedNative -FilePath $AWS -Arguments @(
    "cloudfront",
    "create-invalidation",
    "--distribution-id",
    $outputs.CloudFrontDistributionId,
    "--paths",
    "/*",
    "--region",
    $Region
  )
}
catch {
  Write-CleanupHint -Reason "Deploy failed after CloudFormation resource creation may have started."
  throw
}

$outputs | ConvertTo-Json | Set-Content -LiteralPath $outputsJson -Encoding UTF8

$generatedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss zzz")
@"
# AWS Production Outputs

Generated: $generatedAt

> These outputs are generated by `infra/aws/deploy.ps1`. Do not store secrets here.

| Output | Value |
| --- | --- |
| AppUrl | $($outputs.AppUrl) |
| ApiUrl | $($outputs.ApiUrl) |
| FrontendBucketName | $($outputs.FrontendBucketName) |
| DynamoTableName | $($outputs.DynamoTableName) |
| LambdaFunctionName | $($outputs.LambdaFunctionName) |
| ApiId | $($outputs.ApiId) |
| CloudFrontDistributionId | $($outputs.CloudFrontDistributionId) |
| CloudFrontPriceClass | $($outputs.CloudFrontPriceClass) |

Cleanup command:

~~~powershell
.\infra\aws\cleanup.ps1 -Region $Region -StackName $StackName -ConfirmCleanup
~~~
"@ | Set-Content -LiteralPath $outputsMarkdown -Encoding UTF8

Write-Host "Deploy complete."
Write-Host "AppUrl: $($outputs.AppUrl)"
Write-Host "ApiUrl: $($outputs.ApiUrl)"
Write-Host "Cleanup command: .\infra\aws\cleanup.ps1 -Region $Region -StackName $StackName -ConfirmCleanup"
