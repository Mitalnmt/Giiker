# Block Puzzle Solver

🎮 Công cụ giải đố khối 8×8 tự động với giao diện hiện đại

## Tính năng

- ✨ Giao diện đẹp, responsive (máy tính + điện thoại)
- 🎯 Click để tạo bảng 8×8
- 🔒 Chọn khối bị khóa
- 🚀 Giải tự động bằng backtracking
- 📋 Xuất kết quả

## Demo Online

🌐 [https://your-username.github.io/blockextra](https://your-username.github.io/blockextra)

## Cài đặt local

```bash
# Clone repo
git clone https://github.com/your-username/blockextra.git
cd blockextra

# Chạy local server
python -m http.server 8000
# Mở http://localhost:8000
```

## Deploy lên GitHub Pages

### Bước 1: Tạo repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/blockextra.git
git push -u origin main
```

### Bước 2: Bật GitHub Pages

1. Vào **Settings** của repo
2. Chọn **Pages** (menu bên trái)
3. **Source**: Deploy from a branch
4. **Branch**: main, folder: / (root)
5. Click **Save**
6. Đợi vài phút, truy cập: `https://your-username.github.io/blockextra`

## Files

```
blockextra/
├── index.html        # HTML chính
├── style.css         # CSS hiện đại
├── blocks-data.js    # Dữ liệu 14 khối
├── solver.js         # Thuật toán giải
├── app.js            # Logic app
├── block.md          # Định nghĩa khối (Python)
├── solver.py         # Solver Python
└── README.md         # File này
```

## Sử dụng

### Web App

1. **Tạo bảng**: Click vào ô để bật/tắt (xanh = cần phủ, tối = không dùng)
2. **Chọn khối bị khóa**: Click vào khối trong danh sách
3. **Giải**: Click "Giải ngay"
4. **Xuất**: Click "Xuất kết quả" để copy

### Python Script

```bash
# Điền input file (8x8 board + blocked blocks)
python solver.py

# Đọc output file
cat output
```

## Format Input (Python)

```
BOARD:
1 1 1 1 0 1 1 1
1 1 1 0 0 1 1 1
... (8 dòng x 8 cột)

BLOCKED:
B1 B3 B6
```

## Khối có sẵn

14 khối từ B1 đến B14, mỗi khối có thể xoay 4 hướng.

## License

MIT
