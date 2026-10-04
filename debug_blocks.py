"""Debug script để xem blocks được parse như thế nào"""
import sys
sys.path.append('.')
from solver import parse_block_file, get_rotations

blocks = parse_block_file('d:/documents/blockextra/block.md')

print("Parsed blocks:")
for bid, shape in sorted(blocks.items()):
    print(f"\n{bid}: {len(shape)} cells")
    print(f"  Coords: {shape}")
    
    # Visualize
    if shape:
        max_r = max(r for r, c in shape)
        max_c = max(c for r, c in shape)
        grid = [['.' for _ in range(max_c + 1)] for _ in range(max_r + 1)]
        for r, c in shape:
            grid[r][c] = '1'
        for row in grid:
            print(f"  {''.join(row)}")
    
    # Show rotations
    rotations = get_rotations(shape)
    if len(rotations) > 1:
        print(f"  {len(rotations)} unique rotations")

# Test B11 specifically
print("\n\nB11 detailed:")
b11 = blocks['B11']
print(f"Original: {b11}")
rots = get_rotations(b11)
for i, rot in enumerate(rots):
    print(f"\nRotation {i}: {rot}")
    max_r = max(r for r, c in rot)
    max_c = max(c for r, c in rot)
    grid = [['.' for _ in range(max_c + 1)] for _ in range(max_r + 1)]
    for r, c in rot:
        grid[r][c] = '1'
    for row in grid:
        print(f"  {''.join(row)}")
