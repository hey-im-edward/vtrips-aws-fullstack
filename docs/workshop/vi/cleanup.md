# V-Trips App Cleanup Reference

Chỉ cleanup sau khi user duyệt vì thao tác này có thể xóa tài nguyên AWS.
File này chỉ là tài liệu tham chiếu deploy app cho `../vtrips-workshop`, không phải website Workshop Link chính.

## Checklist
- Tắt/xóa CloudFront distribution nếu không còn dùng link nộp bài.
- Empty và xóa S3 buckets.
- Xóa API Gateway.
- Xóa Lambda functions.
- Xóa DynamoDB tables nếu không cần giữ dữ liệu.
- Xóa Cognito User Pool nếu đã tạo.
- Xóa CloudWatch log groups và IAM roles chỉ thuộc project này.
