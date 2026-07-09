param(
  [switch]$ConfirmCleanup,
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

function Assert-SafeIdentity {
  param([string]$AwsPath)

  if ($Region -ne "ap-southeast-1") {
    throw "Refusing cleanup: region must be ap-southeast-1."
  }

  $identity = & $AwsPath sts get-caller-identity --region $Region | ConvertFrom-Json
  if ($identity.Account -ne "606163772198") {
    throw "Refusing cleanup: expected account 606163772198 but got $($identity.Account)."
  }
  if ($identity.Arn -like "*:root") {
    throw "Refusing cleanup: root identity is not allowed."
  }

  return $identity
}

function Get-StackOutputs {
  param([string]$AwsPath)

  $stack = & $AwsPath cloudformation describe-stacks --stack-name $StackName --region $Region | ConvertFrom-Json
  $outputs = @{}
  foreach ($output in $stack.Stacks[0].Outputs) {
    $outputs[$output.OutputKey] = $output.OutputValue
  }
  return $outputs
}

if (-not $ConfirmCleanup) {
  throw "Cleanup is destructive. Re-run with -ConfirmCleanup when you are ready."
}

$AWS = Resolve-AwsCli
$identity = Assert-SafeIdentity -AwsPath $AWS

Write-Host "AWS CLI: $AWS"
Write-Host "AWS account verified: $($identity.Account)"
Write-Host "AWS identity ARN verified and not root."
Write-Host "Region: $Region"

$outputs = Get-StackOutputs -AwsPath $AWS

if ($outputs.FrontendBucketName) {
  Write-Host "Emptying frontend bucket: $($outputs.FrontendBucketName)"
  & $AWS s3 rm "s3://$($outputs.FrontendBucketName)" --recursive --region $Region
}

if ($outputs.MediaBucketName) {
  Write-Host "Emptying media bucket: $($outputs.MediaBucketName)"
  & $AWS s3 rm "s3://$($outputs.MediaBucketName)" --recursive --region $Region
}

Write-Host "Deleting CloudFormation stack: $StackName"
& $AWS cloudformation delete-stack --stack-name $StackName --region $Region

Write-Host "Stack deletion started."
Write-Host "CloudFront distribution deletion can take time because CloudFront must disable and propagate globally."
Write-Host "Check status with: & `"$AWS`" cloudformation describe-stacks --stack-name $StackName --region $Region"
