"""
Block puzzle solver using backtracking
Luật: Phủ hết ô 1, không chồng, không đặt vào ô 0, mỗi khối dùng 1 lần
"""

def parse_block_file(filepath):
    """Parse block.md và trả về dict {block_id: shape}"""
    blocks = {}
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = [line.rstrip() for line in f.readlines()]
    
    current_id = None
    current_shape = []
    
    for line in lines:
        if line.startswith('B') and ':' in line:
            if current_id and current_shape:
                blocks[current_id] = parse_shape(current_shape)
            current_id = line.split(':')[0]
            current_shape = []
        elif line.strip() == '':
            if current_id and current_shape:
                blocks[current_id] = parse_shape(current_shape)
                current_id = None
                current_shape = []
        elif current_id:
            current_shape.append(line)
    
    if current_id and current_shape:
        blocks[current_id] = parse_shape(current_shape)
    
    return blocks

def parse_shape(lines):
    """Chuyển text shape thành list of (row, col) coordinates"""
    coords = []
    for r, line in enumerate(lines):
        # Split by space để parse grid format: "1 1" -> ['1', '1']
        cells = line.split()
        c = 0
        for cell in cells:
            if cell == '1':
                coords.append((r, c))
            c += 1
    # Normalize về origin (0,0)
    if coords:
        min_r = min(r for r, c in coords)
        min_c = min(c for r, c in coords)
        coords = [(r - min_r, c - min_c) for r, c in coords]
    return coords

def parse_input_file(filepath):
    """Parse input file và trả về board, use_blocks (None nếu dùng tất cả), blocked"""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f.readlines()]
    
    board = []
    blocked = []
    use_blocks = None
    mode = None
    
    for line in lines:
        if not line or line.startswith('#'):
            continue
        
        if line.startswith('BOARD:'):
            mode = 'board'
        elif line.startswith('USE_BLOCKS:'):
            mode = 'use'
        elif line.startswith('BLOCKED:'):
            mode = 'blocked'
        elif mode == 'board':
            row = [int(x) for x in line.split()]
            if row:
                board.append(row)
        elif mode == 'use':
            if use_blocks is None:
                use_blocks = []
            use_blocks.extend(line.split())
        elif mode == 'blocked':
            blocked.extend(line.split())
    
    return board, use_blocks, blocked

def rotate_90(coords):
    """Xoay khối 90° clockwise: (r,c) -> (c, -r)"""
    if not coords:
        return coords
    rotated = [(c, -r) for r, c in coords]
    # Normalize lại
    min_r = min(r for r, c in rotated)
    min_c = min(c for r, c in rotated)
    return [(r - min_r, c - min_c) for r, c in rotated]

def get_rotations(shape):
    """Trả về 4 rotations của shape, loại bỏ duplicate"""
    rotations = [shape]
    current = shape
    for _ in range(3):
        current = rotate_90(current)
        rotations.append(current)
    
    # Remove duplicates
    unique = []
    for rot in rotations:
        normalized = tuple(sorted(rot))
        if normalized not in [tuple(sorted(r)) for r in unique]:
            unique.append(rot)
    return unique

def can_place(board, shape, start_r, start_c, placed):
    """Check xem có thể đặt shape tại (start_r, start_c) không"""
    rows, cols = len(board), len(board[0])
    for dr, dc in shape:
        r, c = start_r + dr, start_c + dc
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return False
        if board[r][c] == 0:  # Không được đặt vào ô tối
            return False
        if placed[r][c]:  # Đã có khối khác
            return False
    return True

def place_block(board, shape, start_r, start_c, placed, block_id):
    """Đặt khối vào board"""
    for dr, dc in shape:
        r, c = start_r + dr, start_c + dc
        placed[r][c] = block_id

def remove_block(board, shape, start_r, start_c, placed):
    """Gỡ khối ra khỏi board"""
    for dr, dc in shape:
        r, c = start_r + dr, start_c + dc
        placed[r][c] = None

def is_complete(board, placed):
    """Check xem đã phủ hết ô 1 chưa"""
    for r in range(len(board)):
        for c in range(len(board[0])):
            if board[r][c] == 1 and not placed[r][c]:
                return False
    return True

def find_uncovered(board, placed):
    """Tìm ô 1 chưa được phủ"""
    for r in range(len(board)):
        for c in range(len(board[0])):
            if board[r][c] == 1 and not placed[r][c]:
                return (r, c)
    return None

def solve(board, blocks, available_blocks, placed, solution):
    """Backtracking solver"""
    # Base case: phủ hết rồi
    if is_complete(board, placed):
        return True
    
    # Tìm ô chưa phủ
    target = find_uncovered(board, placed)
    if not target:
        return is_complete(board, placed)
    
    target_r, target_c = target
    
    # Thử từng khối available
    for block_id in list(available_blocks):
        block_shape = blocks[block_id]
        rotations = get_rotations(block_shape)
        
        # Thử từng rotation
        for rotation in rotations:
            # Tìm offset để đặt khối sao cho cover (target_r, target_c)
            for dr, dc in rotation:
                start_r = target_r - dr
                start_c = target_c - dc
                
                if can_place(board, rotation, start_r, start_c, placed):
                    # Đặt khối
                    place_block(board, rotation, start_r, start_c, placed, block_id)
                    available_blocks.remove(block_id)
                    solution.append((block_id, start_r, start_c, rotation))
                    
                    # Recursion
                    if solve(board, blocks, available_blocks, placed, solution):
                        return True
                    
                    # Backtrack
                    solution.pop()
                    available_blocks.add(block_id)
                    remove_block(board, rotation, start_r, start_c, placed)
    
    return False

def visualize_solution(board, solution, blocks):
    """In ra kết quả"""
    result = [['.' for _ in range(len(board[0]))] for _ in range(len(board))]
    
    # Đánh dấu ô 0
    for r in range(len(board)):
        for c in range(len(board[0])):
            if board[r][c] == 0:
                result[r][c] = ' '
    
    # Đặt các khối
    for block_id, start_r, start_c, rotation in solution:
        for dr, dc in rotation:
            r, c = start_r + dr, start_c + dc
            result[r][c] = block_id[-1]  # Dùng số cuối của ID
    
    for row in result:
        print(' '.join(row))

def write_output(board, solution, filepath):
    """Ghi solution ra file output, khối đánh số từ 3"""
    result = [[0 for _ in range(len(board[0]))] for _ in range(len(board))]
    
    # Đặt các khối, bắt đầu từ số 3
    for idx, (block_id, start_r, start_c, rotation) in enumerate(solution):
        block_number = idx + 3
        for dr, dc in rotation:
            r, c = start_r + dr, start_c + dc
            result[r][c] = block_number
    
    with open(filepath, 'w', encoding='utf-8') as f:
        for row in result:
            f.write(' '.join(str(x) for x in row) + '\n')
    print()

def main():
    # Load data
    blocks = parse_block_file('d:/documents/blockextra/block.md')
    board, use_blocks, blocked = parse_input_file('d:/documents/blockextra/input')
    
    # Validate 8x8
    if len(board) != 8 or any(len(row) != 8 for row in board):
        print(f"ERROR: Board must be 8x8, got {len(board)}x{len(board[0]) if board else 0}")
        return
    
    print(f"Loaded {len(blocks)} blocks")
    print(f"Board size: {len(board)}x{len(board[0])}")
    
    # Available blocks
    if use_blocks is not None:
        available = set(use_blocks)
        print(f"USE_BLOCKS mode: {sorted(available)}")
    else:
        available = set(blocks.keys()) - set(blocked)
        print(f"Blocked: {blocked}")
        print(f"Available blocks: {sorted(available)}")
    
    # Count ô cần phủ
    target_cells = sum(1 for r in board for c in r if c == 1)
    print(f"Need to cover {target_cells} cells")
    print()
    
    # Solve
    placed = [[None for _ in range(len(board[0]))] for _ in range(len(board))]
    solution = []
    
    print("Solving...")
    if solve(board, blocks, available, placed, solution):
        print(f"Found solution with {len(solution)} blocks!")
        print()
        visualize_solution(board, solution, blocks)
        print()
        
        # Ghi output file
        output_path = 'd:/documents/blockextra/output'
        write_output(board, solution, output_path)
        print(f"Solution written to: {output_path}")
        
        print("\nPlacement details:")
        for idx, (block_id, r, c, rotation) in enumerate(solution):
            print(f"  Block {idx+3}: {block_id} at ({r},{c})")
    else:
        print("No solution found")

if __name__ == '__main__':
    main()
