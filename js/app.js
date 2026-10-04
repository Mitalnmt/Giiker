// Main application logic - Color based selection
let boardState = Array(8).fill(null).map(() => Array(8).fill(1));
let selectedColors = new Set(['red', 'yellow', 'blue', 'green']); // Mặc định chọn tất cả
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

// Initialize color selector
function initColorSelector() {
    const selectorEl = document.getElementById('colorSelector');
    selectorEl.innerHTML = '';
    
    const colorIcons = {
        'red': '🔴',
        'yellow': '🟡',
        'blue': '🔵',
        'green': '🟢'
    };
    
    Object.keys(COLOR_GROUPS).forEach(colorKey => {
        const colorData = COLOR_GROUPS[colorKey];
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item';
        colorItem.style.background = colorData.color;
        colorItem.dataset.color = colorKey;
        
        if (selectedColors.has(colorKey)) {
            colorItem.classList.add('selected');
        }
        
        const icon = document.createElement('div');
        icon.className = 'color-icon';
        icon.textContent = colorIcons[colorKey];
        
        const label = document.createElement('div');
        label.className = 'color-label';
        label.textContent = colorData.name;
        
        colorItem.appendChild(icon);
        colorItem.appendChild(label);
        colorItem.addEventListener('click', () => toggleColor(colorKey));
        
        selectorEl.appendChild(colorItem);
    });
    
    updateColorCount();
}

function toggleColor(colorKey) {
    if (selectedColors.has(colorKey)) {
        selectedColors.delete(colorKey);
    } else {
        selectedColors.add(colorKey);
    }
    updateColorSelector();
}

function updateColorSelector() {
    document.querySelectorAll('.color-item').forEach(item => {
        const colorKey = item.dataset.color;
        item.classList.toggle('selected', selectedColors.has(colorKey));
    });
    updateColorCount();
}

function updateColorCount() {
    document.getElementById('selectedCount').textContent = 
        `${selectedColors.size} màu được chọn`;
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
    
    loading.classList.remove('hidden');
    resultPanel.classList.add('hidden');
    
    // Delay để UI update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
        // Lấy blocks từ màu được chọn
        const availableBlocks = [];
        selectedColors.forEach(colorKey => {
            availableBlocks.push(...COLOR_GROUPS[colorKey].blocks);
        });
        
        if (availableBlocks.length === 0) {
            loading.classList.add('hidden');
            showError('Vui lòng chọn ít nhất 1 màu để đặt khối.');
            return;
        }
        
        // Lọc BLOCKS_DATA để chỉ lấy blocks available
        const filteredBlocks = {};
        availableBlocks.forEach(blockId => {
            if (BLOCKS_DATA[blockId]) {
                filteredBlocks[blockId] = BLOCKS_DATA[blockId];
            }
        });
        
        const solver = new PuzzleSolver(
            boardState,
            filteredBlocks,
            [] // Không có blocked blocks vì đã filter rồi
        );
        
        const solved = solver.solve();
        
        loading.classList.add('hidden');
        
        if (solved) {
            const grid = solver.getSolutionGrid();
            showResult(grid, solver.solution);
        } else {
            showError('Không tìm thấy giải pháp. Thử điều chỉnh bảng hoặc chọn thêm màu.');
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
    
    // Map block ID to color
    const blockColorMap = {};
    Object.keys(COLOR_GROUPS).forEach(colorKey => {
        const colorData = COLOR_GROUPS[colorKey];
        colorData.blocks.forEach(blockId => {
            blockColorMap[blockId] = colorData.color;
        });
    });
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            cell.className = 'result-cell';
            const val = grid[r][c];
            
            if (val > 0) {
                // Lấy block ID từ solution
                const solutionIdx = val - 3;
                if (solution[solutionIdx]) {
                    const blockId = solution[solutionIdx].blockId;
                    const color = blockColorMap[blockId] || '#7c3aed';
                    cell.style.background = color;
                    cell.textContent = blockId;
                    cell.style.fontSize = '0.75rem';
                }
            } else {
                cell.style.background = '#1a1a2e';
            }
            
            resultBoard.appendChild(cell);
        }
    }
    
    resultContent.appendChild(resultBoard);
    
    // Info with color grouping
    const colorGroups = {};
    solution.forEach((s, i) => {
        const blockId = s.blockId;
        const colorKey = Object.keys(COLOR_GROUPS).find(k => 
            COLOR_GROUPS[k].blocks.includes(blockId)
        );
        if (colorKey) {
            if (!colorGroups[colorKey]) {
                colorGroups[colorKey] = [];
            }
            colorGroups[colorKey].push(blockId);
        }
    });
    
    const info = document.createElement('div');
    info.className = 'result-info';
    
    let colorInfo = '';
    Object.keys(colorGroups).forEach(colorKey => {
        const colorData = COLOR_GROUPS[colorKey];
        const blocks = colorGroups[colorKey];
        colorInfo += `<p style="margin-top: 0.5rem;"><strong style="color: ${colorData.color}">${colorData.name}:</strong> ${blocks.join(', ')}</p>`;
    });
    
    info.innerHTML = `
        <p>✓ Tìm thấy giải pháp với <strong>${solution.length} khối</strong></p>
        ${colorInfo}
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
initColorSelector();
