// Main application logic
let boardState = Array(8).fill(null).map(() => Array(8).fill(1));
let blockedBlocks = new Set();
let isDragging = false;
let dragMode = null; // 'paint' or 'erase'

// Initialize board
function initBoard() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (boardState[r][c] === 1) {
                cell.classList.add('active');
            }
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            // Mouse events
            cell.addEventListener('mousedown', (e) => startDrag(e, r, c));
            cell.addEventListener('mouseenter', () => dragCell(r, c));
            cell.addEventListener('mouseup', endDrag);
            
            // Touch events
            cell.addEventListener('touchstart', (e) => {
                e.preventDefault();
                startDrag(e, r, c);
            });
            cell.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                if (element && element.classList.contains('cell')) {
                    const r = parseInt(element.dataset.row);
                    const c = parseInt(element.dataset.col);
                    dragCell(r, c);
                }
            });
            cell.addEventListener('touchend', (e) => {
                e.preventDefault();
                endDrag();
            });
            
            boardEl.appendChild(cell);
        }
    }
    
    // Global mouse up for ending drag
    document.addEventListener('mouseup', endDrag);
}

function startDrag(e, r, c) {
    isDragging = true;
    // Determine mode based on current cell state
    dragMode = boardState[r][c] === 1 ? 'erase' : 'paint';
    toggleCell(r, c);
}

function dragCell(r, c) {
    if (!isDragging) return;
    
    if (dragMode === 'paint' && boardState[r][c] === 0) {
        boardState[r][c] = 1;
        updateBoard();
    } else if (dragMode === 'erase' && boardState[r][c] === 1) {
        boardState[r][c] = 0;
        updateBoard();
    }
}

function endDrag() {
    isDragging = false;
    dragMode = null;
}

function toggleCell(r, c) {
    boardState[r][c] = boardState[r][c] === 1 ? 0 : 1;
    updateBoard();
}

function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, idx) => {
        const r = Math.floor(idx / 8);
        const c = idx % 8;
        cell.classList.toggle('active', boardState[r][c] === 1);
    });
}

// Initialize blocks
function initBlocks() {
    const blocksEl = document.getElementById('blocks');
    blocksEl.innerHTML = '';
    
    Object.keys(BLOCKS_DATA).forEach(blockId => {
        const blockItem = document.createElement('div');
        blockItem.className = 'block-item';
        blockItem.dataset.blockId = blockId;
        
        const preview = createBlockPreview(BLOCKS_DATA[blockId]);
        const label = document.createElement('div');
        label.className = 'block-label';
        label.textContent = blockId;
        
        blockItem.appendChild(preview);
        blockItem.appendChild(label);
        blockItem.addEventListener('click', () => toggleBlock(blockId));
        
        blocksEl.appendChild(blockItem);
    });
}

function createBlockPreview(blockData) {
    const preview = document.createElement('div');
    preview.className = 'block-preview';
    
    const rows = blockData.length;
    const cols = Math.max(...blockData.map(row => row.length));
    
    preview.style.gridTemplateRows = `repeat(${rows}, 10px)`;
    preview.style.gridTemplateColumns = `repeat(${cols}, 10px)`;
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            if (blockData[r] && blockData[r][c] === 1) {
                cell.className = 'block-cell';
            } else {
                cell.style.opacity = '0';
            }
            preview.appendChild(cell);
        }
    }
    
    return preview;
}

function toggleBlock(blockId) {
    if (blockedBlocks.has(blockId)) {
        blockedBlocks.delete(blockId);
    } else {
        blockedBlocks.add(blockId);
    }
    updateBlocks();
}

function updateBlocks() {
    document.querySelectorAll('.block-item').forEach(item => {
        const blockId = item.dataset.blockId;
        item.classList.toggle('blocked', blockedBlocks.has(blockId));
    });
    
    document.getElementById('blockedCount').textContent = 
        `${blockedBlocks.size} khối bị khóa`;
}

// Board controls
document.getElementById('clearBoard').addEventListener('click', () => {
    boardState = Array(8).fill(null).map(() => Array(8).fill(0));
    updateBoard();
});

document.getElementById('fillBoard').addEventListener('click', () => {
    boardState = Array(8).fill(null).map(() => Array(8).fill(1));
    updateBoard();
});

// Solve puzzle
document.getElementById('solveBtn').addEventListener('click', async () => {
    const loading = document.getElementById('loadingOverlay');
    const resultPanel = document.getElementById('resultPanel');
    const resultContent = document.getElementById('resultContent');
    
    loading.classList.remove('hidden');
    resultPanel.classList.add('hidden');
    
    // Delay để UI update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
        const solver = new PuzzleSolver(
            boardState,
            BLOCKS_DATA,
            Array.from(blockedBlocks)
        );
        
        const solved = solver.solve();
        
        loading.classList.add('hidden');
        
        if (solved) {
            const grid = solver.getSolutionGrid();
            showResult(grid, solver.solution);
        } else {
            showError('Không tìm thấy giải pháp. Thử điều chỉnh bảng hoặc bỏ khóa thêm khối.');
        }
    } catch (error) {
        loading.classList.add('hidden');
        showError('Lỗi: ' + error.message);
    }
});

function showResult(grid, solution) {
    const resultPanel = document.getElementById('resultPanel');
    const resultContent = document.getElementById('resultContent');
    
    resultContent.innerHTML = '';
    
    // Create result board
    const resultBoard = document.createElement('div');
    resultBoard.className = 'result-board';
    
    const colors = [
        '#7c3aed', '#ec4899', '#f59e0b', '#10b981', 
        '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6',
        '#f97316', '#06b6d4', '#84cc16', '#a855f7'
    ];
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            cell.className = 'result-cell';
            const val = grid[r][c];
            
            if (val > 0) {
                const colorIdx = (val - 3) % colors.length;
                cell.style.background = colors[colorIdx];
                cell.textContent = val;
            } else {
                cell.style.background = '#1a1a2e';
            }
            
            resultBoard.appendChild(cell);
        }
    }
    
    resultContent.appendChild(resultBoard);
    
    // Info
    const info = document.createElement('div');
    info.className = 'result-info';
    info.innerHTML = `
        <p>✓ Tìm thấy giải pháp với <strong>${solution.length} khối</strong></p>
        <p style="margin-top: 0.5rem; font-size: 0.875rem;">
            ${solution.map((s, i) => `Khối ${i+3}: ${s.blockId}`).join(' • ')}
        </p>
    `;
    resultContent.appendChild(info);
    
    resultPanel.classList.remove('hidden');
    resultPanel.scrollIntoView({ behavior: 'smooth' });
}

function showError(message) {
    const resultPanel = document.getElementById('resultPanel');
    const resultContent = document.getElementById('resultContent');
    
    resultContent.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--error);">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="margin: 0 auto 1rem;">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8v4m0 4h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p style="font-weight: 600; margin-bottom: 0.5rem;">Không thể giải</p>
            <p style="color: var(--text-secondary); font-size: 0.875rem;">${message}</p>
        </div>
    `;
    
    resultPanel.classList.remove('hidden');
    resultPanel.scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('closeResult').addEventListener('click', () => {
    document.getElementById('resultPanel').classList.add('hidden');
});

document.getElementById('exportResult').addEventListener('click', () => {
    const resultBoard = document.querySelector('.result-board');
    if (!resultBoard) return;
    
    const cells = resultBoard.querySelectorAll('.result-cell');
    let text = '';
    cells.forEach((cell, idx) => {
        const val = cell.textContent || '0';
        text += val;
        if ((idx + 1) % 8 === 0) text += '\n';
        else text += ' ';
    });
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('exportResult');
        const oldText = btn.textContent;
        btn.textContent = '✓ Đã sao chép';
        setTimeout(() => {
            btn.textContent = oldText;
        }, 2000);
    });
});

// Initialize
initBoard();
initBlocks();
