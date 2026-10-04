// Blocks data theo màu - parsed from block_update.md
const BLOCKS_DATA = {
    // Nhóm Đỏ
    D1: [
        [1],
        [1, 1],
        [1, 1, 1]
    ],
    D2: [
        [1, 1],
        [1],
        [1],
        [1]
    ],
    D3: [
        [1, 1, 1],
        [1, 0, 1]
    ],
    D4: [
        [1, 1],
        [1, 1, 1],
        [0, 1]
    ],
    
    // Nhóm Vàng
    V1: [
        [0, 1],
        [1, 1],
        [1, 1],
        [1]
    ],
    V2: [
        [0, 1],
        [1, 1, 1],
        [0, 1]
    ],
    V3: [
        [1, 1, 1, 1]
    ],
    V4: [
        [0, 1, 1],
        [1, 1],
        [0, 1, 1]
    ],
    
    // Nhóm Xanh Dương
    X1: [
        [0, 1],
        [1, 1, 1, 1],
        [0, 1]
    ],
    X2: [
        [0, 1, 1],
        [1, 1, 1]
    ],
    X3: [
        [1],
        [1, 1],
        [0, 1]
    ],
    X4: [
        [1, 1, 1],
        [1],
        [1]
    ],
    
    // Nhóm Xanh Lá
    L1: [
        [1],
        [1, 1, 1],
        [1]
    ],
    L2: [
        [1],
        [1, 1],
        [0, 1, 1]
    ],
    L3: [
        [1, 1],
        [1],
        [1],
        [1, 1]
    ],
    L4: [
        [1, 1],
        [1, 1],
        [1]
    ]
};

// Định nghĩa màu cho từng nhóm
const COLOR_GROUPS = {
    'red': {
        name: 'Đỏ',
        blocks: ['D1', 'D2', 'D3', 'D4'],
        color: '#ef4444'
    },
    'yellow': {
        name: 'Vàng',
        blocks: ['V1', 'V2', 'V3', 'V4'],
        color: '#f59e0b'
    },
    'blue': {
        name: 'Xanh Dương',
        blocks: ['X1', 'X2', 'X3', 'X4'],
        color: '#3b82f6'
    },
    'green': {
        name: 'Xanh Lá',
        blocks: ['L1', 'L2', 'L3', 'L4'],
        color: '#10b981'
    }
};
