
<center>

# MATCHA DATING APP
### Bài Tập Lớn 2425I_INT2204_18

</center>

## Tài Khoản Test
- Username: ngoctran11 
- Password: Testne12!

## Thành Viên Nhóm

- Nguyễn Xuân Bách  23021474
  <details>
  <summary>Phụ trách </summary>

  - Set up base frontend ( react, Antd for UI, craco, private and pulic routes, axios for api, socket_io for client ).
  - Tạo login, register, forgotpassword, policy, chat page, empty states page, landingpage, home page, completeprofile page.
  - Tích hợp map cho ứng dụng.
  - Utils backend, chat và messages service backend.
  - Viết readme.

</details>

- Bùi Phúc Bình 23021478
  <details>
  <summary>Phụ trách </summary>
  
  - Controller(Xử lý các request từ frontend, điều phối logic, và phản hồi dữ liệu thông qua các endpoint RESTful)
  - Middleware (Lớp trung gian xử lý xác thực, phân quyền, logging, và các thao tác trước/sau request)
  - Tạo models migration
  - Deploy Backend (Triển khai backend trên môi trường production với CI/CD, containerization và bảo mật)
</details>

- Nguyễn Văn Tiền 23021694
  <details>
  <summary>Phụ trách </summary>

  - Template: tạo template mail cho accountverrified, reserpassword và verify email. 
  - Service: tạo các Service: blocker, history và image.
  - Frontend:
      - Tạo base cho các file trong các folder:
          - api: EditActions, NotifyActions. Là các hành động chỉnh sửa và thông báo.
          - asset/css: css cho các trang.
          - components: Frontend của các trang.
          - layout
          - pages
  - Util: mail.js.
  - Deploy Frontend: 
    - Xem xét các lỗi và deploy web lên server VercelVercel
</details>
  

## Table Of Content

- [Giới Thiệu](#introduction)


- [Các Chức Năng](#feature) 
   - [Langdingpage](#feature1)
   - [Đăng ký](#feature2)
   - [Đăng nhập](#feature3)
   - [Hoàn thiện hồ sơ](#feature4)
   - [Trang chủ](#feature5)
   - [Hồ sơ người dùng](#feature6)
   - [Phòng chat](#feature7)
   - [Thông báo](#feature8)
   - [Cài đặt](#feature9)
   - [Backlist ](#feature10)
   - [Database ](#feature11)
 - [Các công nghệ sử dụng](#Tech)
    - [Backend](#Tech1)
    - [Frontend](#Tech2)
 - [Diagram](#Diagram)
 


## I. Giới Thiệu <a name="introduction"></a>

  - Ứng dụng hẹn hò được thiết kế với giao diện thân thiện, tính năng đa dạng tích hợp hệ thống gợi ý tìm kiếm theo vị trí cùng với online chat, dễ dàng khám phá và sử dụng theo sở thích và nhu cầu cá nhân.


## II. Chức Năng <a name="feature"></a>

### 1, Landingpage: <a name="feature1"></a>
- Hiển thị giới thiệu qua của app, và các điều khoản sử dụng

### 2, Đăng kí: <a name="feature2"></a>
- Điền thông tin và đăng kí, đồng thời phải xác minh thông qua gmail.

### 3, Đăng nhập: <a name="feature3"></a>
- Sử dụng username và password để đăng nhập, đã tích hợp jwt để duy trì phiên đăng nhập, tính năng đổi mật khẩu thông qua gmail.


### 4, Hoàn thiện hồ sơ: <a name="feature4"></a>
 - Sau khi đăng kí và xác minh người dùng phải trải qua bước hoàn thiện hồ sơ bao gồm: 
    - Cung cấp thông tin cơ bản.
    - Chọn tags dating để thuật toán gợi ý đối tượng.
    - Cung cấp ảnh hồ sơ.
    - CCấp quyền cho phép lấy thông tin về vị trí hiện tại.

### 5, Trang chủ (Home): <a name="feature5"></a>

- Hiển thị người dùng gợi ý có thể:
    -  Tùy chọn sắp xếp theo độ tuổi, vị trí, độ nổi tiếng, tags. 
    -  Tính năng tìm kiếm nâng cao và lọc theo độ tuổi, vị trí, độ nổi tiếng, tags.

### 6, Hồ sơ người dùng: <a name="feature6"></a>
 - Theo dõi được ảnh đại diện, thư viện ảnh, mục mô tả, thông tin cơ bản khác, danh sách followers và followings, và trạng thái hoạt động. 
 - Tính năng like, block, report và match. Khi like và match sẽ tự động tạo phòng chat giữa 2 người.

### 7, Phòng chat (Chat): <a name="feature7"></a>
- Có thể chat online được khi 2 người được kết nối.

### 8, Thông báo: <a name="feature8"></a>
- Nhận thông báo khi có người xem hồ sơ, like, match, hoặc khi nhận một tin nhắn mới thông qua socket server. 

### 9, Cài đặt (Settings): <a name="feature9"></a>
- General : 
    - Xem chi tiết và thay đổi thông tin cơ bản cá nhân.
    - Cập nhật ảnh đại diện, thư viện ảnh. 
    - Xem chi tiết và thay đổi vị trí thông qua Map.
- Security :
    -  Đổi mật khẩu
### 10, Backlist : <a name="feature10"></a>
- Xem danh sách người dùng bị chặn.
- Chặn người dùng không mong muốn.

### 11, Database : <a name="feature11"></a>
- Sử dụng ORM ( Sequelize ) để:
    -  Đơn giản hóa việc tương tác với cơ sở dữ liệu.
    -  Giảm lỗi khi viết SQL thủ công.
    -  Tăng tốc độ phát triển ứng dụng.




## III. Công nghệ sử dụng <a name="Tech"></a>


### Backend : Hoạt động bằng Nodejs và Mysql để quản lý CSDL <a name="Tech1"></a>
#### 1, bcrypt / bcryptjs:
- Dùng để mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu.
Khi người dùng đăng nhập, mật khẩu được so sánh (sau khi mã hóa) với mật khẩu đã lưu trong cơ sở dữ liệu.
#### 2, jsonwebtoken:
- Dùng để tạo và xác minh JWT (JSON Web Tokens) phục vụ cho đăng nhập và duy trì phiên đăng nhập.
#### 3, nodemailer:
- Dùng để gửi email, thường dùng cho các tính năng:
    - Gửi email xác thực khi đăng ký tài khoản.
    - Gửi liên kết đặt lại mật khẩu khi quên mật khẩu.
#### 4, socket.io:
- Dùng để hỗ trợ các thông báo thời gian thực và Chat service


### Frontend: Sử dụng React làm logic và AntDesign làm UI <a name="Tech2"></a>
#### 1, Giao diện người dùng (UI):
- antd:
    - Thư viện giao diện mạnh mẽ với nhiều thành phần UI như bảng, biểu mẫu, nút, modal, và các thành phần khác.
    - Dùng để tạo giao diện người dùng hiện đại và responsive.
- line-awesome:
    - Dùng để hiển thị các biểu tượng đẹp mắt (tương tự như Font Awesome) trong ứng dụng.
- react-toastify:
  
    - Hiển thị thông báo (toasts) cho người dùng, chẳng hạn như:
Xác nhận hành động thành công.
Cảnh báo hoặc lỗi.

#### 2, Tương tác với bản đồ:
- #### leaflet:
    - Thư viện bản đồ mã nguồn mở để hiển thị bản đồ tương tác.
    - Cho phép người dùng thêm marker, đường dẫn, hoặc các chức năng bản đồ khác.
- #### React-leaflet, react-leaflet-geosearch, react-leaflet-search:
    - Các tiện ích tích hợp với React để sử dụng Leaflet dễ dàng hơn.
    - Tính năng có thể bao gồm:
        - Tìm kiếm địa điểm trên bản đồ.
        - Đánh dấu các vị trí hoặc định vị người dùng.
#### 3, Gửi yêu cầu HTTP và xử lý dữ liệu API:
- #### axios:
    - Dùng để gửi và nhận yêu cầu HTTP, như:
        - Kết nối với API backend để lấy hoặc gửi dữ liệu.
        - Đăng nhập, đăng ký, hoặc gọi các endpoint khác.
#### 4, Hệ thống định tuyến (Routing):
- #### react-router-dom: 
  - Quản lý điều hướng trong ứng dụng SPA (Single Page Application).
  - Cung cấp các tính năng như:
    - Chuyển đổi giữa các trang.
    - Bảo vệ trang (Private Routes).
#### 5, Trải nghiệm người dùng nâng cao:
- #### nprogress:
    - Hiển thị thanh tiến trình khi tải dữ liệu, chuyển trang, hoặc các hoạt động khác.
- #### react-loader-spinner:
    - Hiển thị trình tải (spinner) khi đang xử lý hoặc tải dữ liệu từ server.
#### 6, Tương tác thời gian thực:
- #### socket.io-client:
    - Kết nối thời gian thực với server sử dụng Socket.io.
    - Các tính năng có thể bao gồm:
        - Chat thời gian thực.
        - Thông báo trực tiếp.
#### 7, Xử lý ảnh tải lên:
- #### react-images-uploading:
    - Cung cấp giao diện kéo-thả để tải ảnh lên.
    - Hỗ trợ xem trước ảnh hoặc giới hạn số lượng ảnh tải lên.
#### 8, Tối ưu hóa và quản lý dự án:
- #### @craco/craco:
    - Tùy chỉnh cấu hình Webpack trong ứng dụng Create React App mà không cần eject.
- #### nodemon:
    - Tự động tải lại ứng dụng Node.js phía server khi có thay đổi mã nguồn.

## IV. Diagram <a name="Diagram"></a>

<div style="display: flex; gap: 100px;">
    <img src= diagram.png alt="Sơ đồ" width="150" style="border-radius: 150px;">
  </div>




