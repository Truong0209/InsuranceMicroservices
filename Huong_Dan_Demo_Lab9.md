# HƯỚNG DẪN CHẠY VÀ DEMO BÀI THỰC HÀNH SỐ 9 (CASE STUDY CÔNG TY BẢO HIỂM)

## 1. TỔNG QUAN HỆ THỐNG ĐÃ HOÀN THIỆN
Bài thực hành số 9 yêu cầu bổ sung code cho 2 microservices (`PolicyService` và `PolicySearchService`) và triển khai hệ thống trong môi trường thực tế để demo các chức năng chính.

Hệ thống hiện tại gồm đầy đủ các thành phần:
- **Giao diện Web Portal (WebUI)**: Cổng `8081` (truy cập `http://127.0.0.1:8081/#/chat?demo=1`)
- **Dịch vụ Chat trực tuyến (ChatService)**: Cổng `4099` (SignalR WebSocket + API Thông báo)
- **Dịch vụ Thanh toán (PaymentService)**: Cổng `5070` (Document DB + Quản lý tài khoản hợp đồng)
- **Dịch vụ Danh mục sản phẩm (ProductService)**: Cổng `5030` (In-Memory DB + Swagger API)
- **Dịch vụ Hợp đồng bảo hiểm (PolicyService & PolicySearchService)**: Bổ sung theo Task #1 của đề bài

---

## 2. CÁCH KHỞI ĐỘNG HỆ THỐNG
Bạn có 2 cách để khởi động hệ thống:

### Cách 1: Khởi động tự động bằng 1 cú nhấp chuột (Khuyên dùng)
Chỉ cần nhấp đúp chuột vào file:
👉 **`run-all-services.bat`** (nằm ngay trong thư mục `InsuranceMicroservices`).
File này sẽ tự động mở 4 cửa sổ terminal cho 4 dịch vụ và tự động bật trình duyệt Web UI tại `http://127.0.0.1:8081/#/chat?demo=1`.

### Cách 2: Khởi động thủ công bằng lệnh PowerShell
Mở 4 cửa sổ PowerShell và chạy từng dịch vụ:

1. **Khởi động Giao diện Web (Port 8081)**:
   ```powershell
   cd "E:\thiet kê kien truc thay XUAN BT TRUONG\InsuranceMicroservices"
   dotnet run --project WebUI\WebUI.csproj
   ```

2. **Khởi động ChatService (Port 4099)**:
   ```powershell
   cd "E:\thiet kê kien truc thay XUAN BT TRUONG\InsuranceMicroservices"
   dotnet run --project ChatService\ChatService.csproj
   ```

3. **Khởi động PaymentService (Port 5070)**:
   ```powershell
   cd "E:\thiet kê kien truc thay XUAN BT TRUONG\InsuranceMicroservices"
   dotnet run --project PaymentService\PaymentService.csproj
   ```

4. **Khởi động ProductService (Port 5030)**:
   ```powershell
   cd "E:\thiet kê kien truc thay XUAN BT TRUONG\InsuranceMicroservices"
   dotnet run --project ProductService\ProductService.csproj
   ```

---

## 3. KỊCH BẢN QUAY VIDEO DEMO CHI TIẾT (CHUẨN 3 CHỨC NĂNG)

Mở trình duyệt truy cập: **`http://127.0.0.1:8081/#/chat?demo=1`**

### 🎬 Chức năng 1: Demo "Chat trực tuyến" (`Chat for Agents`)
1. Bấm vào tab **Chat for Agents** trên thanh menu (hoặc truy cập `http://127.0.0.1:8081/#/chat?demo=1`).
2. Màn hình hiển thị giao diện chat với tiêu đề **"Chat trực tuyến"**, phụ đề **"Trao đổi nhanh giữa nhân viên tư vấn bảo hiểm"** và huy hiệu **"Chế độ demo"**.
3. **Thao tác**:
   - Nhập tin nhắn vào ô: `Chào hệ thống, tôi muốn được tư vấn gói bảo hiểm nhà ở.`
   - Bấm nút **Gửi** (hoặc nhấn phím **Enter**).
   - 👉 Tin nhắn lập tức xuất hiện trong khung chat với avatar đại lý, sau đó hệ thống tự động phản hồi lại tin nhắn xác nhận.
   - *(Nâng cao)*: Mở thêm 1 tab truy cập `http://localhost:4099/swagger` để thấy API `POST /api/Notification` trả về mã `200 OK`.

### 🎬 Chức năng 2: Demo "Thanh toán & Quản lý tài khoản" (`Account`)
1. Bấm vào tab **Account** trên thanh menu.
2. Màn hình hiển thị: **"Thanh toán & Quản lý tài khoản hợp đồng"** (Dữ liệu từ PaymentService - Cổng 5070).
3. **Thao tác**:
   - Ô mã hợp đồng đã điền sẵn: `POLICY_1`.
   - Bấm nút **Tra cứu tài khoản**: Hệ thống truy vấn và hiển thị Số tài khoản `231232132131`, Số dư hiện tại `$0.00 USD`, Trạng thái: *Đang hiệu lực*.
   - Tại phần **"Thực hiện đóng phí thanh toán"**, nhập số tiền `$150`, bấm **Nạp tiền thanh toán ngay**.
   - 👉 Màn hình hiển thị thông báo thanh toán thành công với mã biên lai giao dịch và số dư tài khoản được cập nhật tức thì.
   - *(Nâng cao)*: Mở thêm 1 tab truy cập `http://localhost:5070/swagger` -> Gọi `GET /api/Payment/accounts/POLICY_1` trả về mã `200 OK`.

### 🎬 Chức năng 3: Demo "Danh mục sản phẩm bảo hiểm" (`Products`)
1. Bấm vào tab **Products** trên thanh menu.
2. Màn hình hiển thị danh sách các gói sản phẩm bảo hiểm được lấy từ `ProductService` (cổng 5030):
   - **Safe Traveller (`TRI`)**: Bảo hiểm du lịch (Quyền lợi: Y tế, Hỗ trợ khẩn cấp).
   - **Happy House (`HSI`)**: Bảo hiểm nhà ở (Quyền lợi: Hỏa hoạn, Ngập lụt, Mất cắp).
   - **Happy Farm (`FAI`)**: Bảo hiểm trang trại nông nghiệp (Quyền lợi: Mùa màng, Máy móc).
   - **Happy Driver (`CAR`)**: Bảo hiểm xe cơ giới.
3. Bấm vào nút **Đăng ký báo giá** của từng gói để xem phản hồi.
4. *(Nâng cao)*: Mở thêm 1 tab truy cập `http://localhost:5030/swagger` -> Gọi `GET /api/Products` trả về mã `200 OK`.

---

## 4. CHỨNG MINH HỆ THỐNG HẾT LỖI (BỘ KIỂM THỬ TỰ ĐỘNG - 42/42 PASSED)
Mở một cửa sổ PowerShell mới và chạy lệnh kiểm thử toàn bộ giải pháp:

```powershell
cd "E:\thiet kê kien truc thay XUAN BT TRUONG\InsuranceMicroservices"
dotnet test InsuranceMicroservices.sln
```

👉 **Kết quả hiển thị**:
- `PolicyService.Test`: **Passed (8/8)**
- `PaymentService.Test`: **Passed (6/6)**
- `PricingService.Test`: **Passed (10/10)**
- `ProductService.Test`: **Passed (14/14)**
- `AuthService.Test`, `ChatService.Test`, `PolicySearchService.Test`, `DocumentService.Test`: **Passed (4/4)**
- **Tổng cộng: 42/42 Test Cases PASSED 100% (0 Error, 0 Failed)**!
