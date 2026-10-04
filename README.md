# Block Puzzle Solver

Công cụ giải puzzle khối 8×8 tự động với giao diện hiện đại. Chọn màu khối, vẽ bảng, và để AI tìm giải pháp tối ưu.

![Block Puzzle Demo](https://img.shields.io/badge/status-active-success)

## 🎯 Tính năng

- ✨ **Giao diện hiện đại**: Dark mode với gradient và animations
- 🎨 **Chọn theo màu**: 4 nhóm màu (Đỏ, Vàng, Xanh Dương, Xanh Lá), mỗi nhóm 4 blocks
- 🖌️ **Vẽ bảng tự do**: Click/drag để đánh dấu ô cần phủ
- 🤖 **Giải tự động**: Thuật toán backtracking nhanh
- 📊 **Kết quả trực quan**: Smart borders phân biệt rõ từng block
- 📋 **Export**: Copy kết quả ra clipboard

## 🚀 Cách dùng

1. **Mở file**: `index.html` trong trình duyệt
2. **Chọn màu**: Click vào 4 ô màu để chọn blocks sử dụng
3. **Vẽ bảng**: Click/drag trên grid 8×8 để đánh dấu ô sáng
4. **Giải**: Bấm "Giải ngay" để tìm solution
5. **Xem kết quả**: Các blocks được hiển thị với viền rõ ràng

## 📁 Cấu trúc

```
blockextra/
├── index.html          # Giao diện chính
├── css/
│   └── style.css       # Styling
├── js/
│   ├── app.js          # Logic UI và control
│   ├── blocks-data.js  # Định nghĩa 16 blocks theo 4 màu
│   └── solver.js       # Thuật toán backtracking
└── README.md           # File này
```

## 🎨 Blocks

### Nhóm Đỏ (D1-D4)
- D1: L-shape
- D2: Line 4 ô + 1 nhánh
- D3: T-shape rộng
- D4: Z-shape lớn

### Nhóm Vàng (V1-V4)
- V1: J-shape dài
- V2: Cross nhỏ
- V3: Line thẳng 4 ô
- V4: Zigzag đôi

### Nhóm Xanh Dương (X1-X4)
- X1: Cross lớn
- X2: L-shape ngược
- X3: Góc nhỏ
- X4: L dài

### Nhóm Xanh Lá (L1-L4)
- L1: T-shape cao
- L2: Z-shape
- L3: M-shape
- L4: L-shape vuông

## 🛠️ Công nghệ

- **HTML5**: Cấu trúc semantic
- **CSS3**: Gradients, animations, flexbox/grid
- **Vanilla JavaScript**: Không dependencies
- **Font**: Inter từ Google Fonts

## 💡 Thuật toán

Backtracking với optimizations:
1. Tìm ô chưa phủ
2. Thử từng block + rotation
3. Check conflicts
4. Recursion depth-first
5. Backtrack nếu fail

## 📝 License

MIT - Free to use

## 👤 Author

Block Puzzle Solver © 2026
