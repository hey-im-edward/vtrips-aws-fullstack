# V-Trips App Deployment Reference

Website workshop chính nằm ở `../vtrips-workshop`. File này chỉ ghi lại bước deploy app để workshop repo có thể tham chiếu.

## Local
```powershell
npm.cmd install
npm.cmd run dev
```

## AWS target
1. Build frontend/backend bằng `npm.cmd run build`.
2. Upload `frontend/dist` lên S3.
3. Đặt CloudFront trước S3 với HTTPS default domain.
4. Đưa backend `backend/dist` lên Lambda sau khi thay JSON persistence bằng DynamoDB.
5. Tạo API Gateway routes tương ứng `docs/api/endpoints.md`.
6. Thêm Cognito khi sẵn sàng.
