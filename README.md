# Kingdom Rush - Tower Defense (TD) Clone
### Hỗ trợ đa nền tảng: Web, Android (APK), iOS (IPA) với Hệ thống Đăng Ký / Đăng Nhập & Đồng Bộ Đám Mây

---

## 🏰 Giới Thiệu
Dự án game **Kingdom Rush** được tái hiện 100% cơ chế, tính năng, đồ họa phong cách trung cổ và âm thanh WebAudio sống động, hỗ trợ chạy mượt mà trên trình duyệt Web (Desktop & Mobile), đồng thời sẵn sàng đóng gói xuất sang Android và iOS thông qua Capacitor / PWA.

---

## ⚔️ Tính Năng & Cơ Chế Trò Chơi (100% Kingdom Rush Mechanics)

### 1. Hệ Thống 4 Loại Tháp Thủ Chính & Cây Nâng Cấp Nhánh Cấp 4 (Tier 4)
- **Archer Tower (Tháp Cung Thủ)**:
  - Cấp 1 -> Cấp 2 (Marksman) -> Cấp 3 (Sharpshooter) -> Phân nhánh Cấp 4:
    - **Ranger's Hideout**: Kỹ năng *Poison Arrows* (Tẩm độc) & *Wrath of the Forest* (Trói rễ cây rỉ máu).
    - **Musketeer Garrison**: Kỹ năng *Sniper Shot* (Bắn tỉa one-hit/sát thương cực lớn) & *Shrapnel Shot* (Đạn pháo nổ lan).
- **Barracks (Doanh Trại Lính)**:
  - Huấn luyện lính trấn giữ chặn đường (Melee blocking) với cơ chế đặt cờ Rally Point di động bất kỳ điểm nào trên đường.
  - Cấp 1 (Militia) -> Cấp 2 (Footmen) -> Cấp 3 (Knights) -> Phân nhánh Cấp 4:
    - **Holy Order (Hiệp Sĩ Thánh)**: Kỹ năng *Healing Light* (Tự hồi máu), *Shield of Valor* (Giáp lên đến 90%), *Holy Strike* (Đòn đánh thánh sát thương chuẩn diện rộng).
    - **Barbarian Mead Hall (Cuồng Chiến Binh)**: Kỹ năng *Throwing Axes* (Ném rìu tầm xa hạ quái bay), *Bloodlust* (Hút máu), *More Axes* (Tăng sát thương vật lý).
- **Mage Tower (Tháp Pháp Sư)**:
  - Bắn tia phép xuyên thẳng qua giáp vật lý (Bypass Physical Armor).
  - Cấp 1 -> Cấp 2 (Adept) -> Cấp 3 (Wizard) -> Phân nhánh Cấp 4:
    - **Arcane Wizard**: Kỹ năng *Death Ray* (Tia hủy diệt tức thì) & *Teleport* (Dịch chuyển quái ngược lại đường đi).
    - **Sorcerer Mage**: Kỹ năng *Polymorph* (Biến quái vật thành chú Cừu vô hại) & *Earth Elemental* (Triệu hồi Người Đá khổng lồ 800 HP chặn đường).
- **Artillery (Pháo Binh)**:
  - Bắn đại bác gây sát thương nổ lan diện rộng (Area of Effect).
  - Cấp 1 (Dwarven Bombard) -> Cấp 2 (Howitzer) -> Cấp 3 (Field Artillery) -> Phân nhánh Cấp 4:
    - **Big Bertha 500mm**: Kỹ năng *Dragon's Breath* (Tên lửa tầm nhiệt bám đuổi toàn bản đồ) & *Cluster Bomb* (Pháo chùm rải thảm bom con).
    - **Tesla x104**: Kỹ năng phóng điện chuỗi giật nhiều mục tiêu cả đất và quái bay, kết hợp *Overcharge* (Vòng tĩnh điện).

---

### 2. Hệ Thống Phép Thuật Toàn Cục (Global Spells)
- **Rain of Fire (Mưa Thiên Thạch)**: Triệu hồi 6 thiên thạch rực lửa giáng xuống vị trí chỉ định, đốt cháy mặt đất và tiêu diệt hàng loạt quái.
- **Call Reinforcements (Triệu Hồi Quân Tiếp Viện)**: Đặt tức thì 2 chiến binh dân binh vào bất kỳ vị trí nào trên đường đi để hỗ trợ lính chặn quái nguy cấp (Hồi chiêu 12s).

---

### 3. Hệ Thống Anh Hùng (Hero System)
- **Gerald Lightseeker**: Chỉ huy hiệp sĩ giáp sắt, buff dũng khí cho lính xung quanh và phản đòn cận chiến.
- **Alleria Swiftwind**: Nữ cung thủ tiên tộc bắn tầm xa với kỹ năng Multishot và triệu hồi báo hoa mai.
- **Malik Hammerfury**: Đấu sĩ người lùn dậm búa chấn động làm choáng toàn bộ kẻ địch xung quanh.
- **Cơ chế**: Anh hùng tích lũy XP trong trận chiến, thăng cấp từ Lv.1 đến Lv.10, tăng máu, sát thương và tự động hồi máu khi rời giao tranh.

---

### 4. Hệ Thống Quái Vật Đa Dạng
- **Bộ binh cơ bản & bọc giáp**: Goblin, Brigand, Orc Champion (Giáp vật lý cao), Ogre (Máu trâu, sát thương cận chiến cực mạnh).
- **Quái bay (Flying Units)**: Gargoyle (Bay trên không vượt qua lính chặn, chỉ bị tháp cung/phép/anh hùng bắn tỉa).
- **Phù thủy & Hỗ trợ**: Shaman (Phù thủy hồi máu cho đồng minh), Necromancer (Triệu hồi xác sống Skeleton từ cõi chết), Shadow Wolf (Tốc độ chạy siêu nhanh).
- **Trùm (Bosses)**: J.T. The Yeti (Dậm đất gây sóng xung kích), Lord Vez'nan (Chúa tể bóng tối triệu hồi tinh thể phong tỏa tháp).

---

### 5. Cây Nâng Cấp Sao (Star Upgrade Shop) & Bách Khoa Toàn Thư (Encyclopedia)
- Kiếm sao từ các màn chơi chiến dịch để mở khóa nâng cấp vĩnh viễn cho 5 nhánh (Cung thủ, Lính, Phép, Pháo, Thiên Thạch, Tiếp viện).
- Cho phép Tẩy Điểm Sao (Respec) hoàn toàn miễn phí bất kỳ lúc nào.
- Bách khoa toàn thư tra cứu chi tiết chỉ số máu, giáp, kháng phép, kỹ năng của từng loại tháp và quái vật.

---

### 6. Hệ Thống Tài Khoản & Đồng Bộ Đám Mây (Authentication & Cloud Save)
- Đăng ký & Đăng nhập bảo mật (Mã hóa mật khẩu bằng bcrypt, xác thực JWT token).
- Tự động lưu trữ tiến trình cục bộ (LocalStorage) và đồng bộ thời gian thực lên máy chủ SQLite/Node.js.

---

## 🚀 Hướng Dẫn Chạy & Cài Đặt

### 1. Khởi động Web Server (Local / Production)
```bash
# Cài đặt dependencies
npm install

# Khởi chạy server
npm start
```
Truy cập trên trình duyệt máy tính hoặc điện thoại tại: **`http://localhost:3000`**

---

### 2. Xuất Ứng Dụng Sang Android (APK / Google Play)
Sử dụng công cụ Capacitor đã được cấu hình sẵn:
```bash
# 1. Thêm nền tảng Android
npx cap add android

# 2. Đồng bộ mã nguồn Web sang thư mục Android
npx cap copy android

# 3. Mở trong Android Studio để build file APK hoặc xuất bản
npx cap open android
```

---

### 3. Xuất Ứng Dụng Sang iOS (IPA / Apple App Store)
```bash
# 1. Thêm nền tảng iOS (thực hiện trên macOS)
npx cap add ios

# 2. Đồng bộ mã nguồn Web sang thư mục iOS
npx cap copy ios

# 3. Mở trong Xcode để build file IPA hoặc chạy trên iPhone/iPad
npx cap open ios
```
