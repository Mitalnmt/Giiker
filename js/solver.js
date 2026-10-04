// Solver - chuyển từ Python sang JavaScript
class PuzzleSolver {
    constructor(board, blocks, blockedBlocks) {
        this.board = board;
        this.blocks = blocks;
        this.available = new Set(
            Object.keys(blocks).filter(id => !blockedBlocks.includes(id))
        );
        this.placed = Array(8).fill(null).map(() => Array(8).fill(null));
        this.solution = [];
    }

    parseShape(blockData) {
        const coords = [];
        for (let r = 0; r < blockData.length; r++) {
            for (let c = 0; c < blockData[r].length; c++) {
                if (blockData[r][c] === 1) {
                    coords.push([r, c]);
                }
            }
        }
        // Normalize về origin
        if (coords.length > 0) {
            const minR = Math.min(...coords.map(([r]) => r));
            const minC = Math.min(...coords.map(([, c]) => c));
            return coords.map(([r, c]) => [r - minR, c - minC]);
        }
        return coords;
    }

    rotate90(coords) {
        if (coords.length === 0) return coords;
        const rotated = coords.map(([r, c]) => [c, -r]);
        const minR = Math.min(...rotated.map(([r]) => r));
        const minC = Math.min(...rotated.map(([, c]) => c));
        return rotated.map(([r, c]) => [r - minR, c - minC]);
    }

    getRotations(shape) {
        const rotations = [shape];
        let current = shape;
        for (let i = 0; i < 3; i++) {
            current = this.rotate90(current);
            rotations.push(current);
        }
        
        // Remove duplicates
        const unique = [];
        const seen = new Set();
        for (const rot of rotations) {
            const key = JSON.stringify(rot.slice().sort());
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(rot);
            }
        }
        return unique;
    }

    canPlace(shape, startR, startC) {
        for (const [dr, dc] of shape) {
            const r = startR + dr;
            const c = startC + dc;
            if (r < 0 || r >= 8 || c < 0 || c >= 8) return false;
            if (this.board[r][c] === 0) return false;
            if (this.placed[r][c] !== null) return false;
        }
        return true;
    }

    placeBlock(shape, startR, startC, blockId) {
        for (const [dr, dc] of shape) {
            const r = startR + dr;
            const c = startC + dc;
            this.placed[r][c] = blockId;
        }
    }

    removeBlock(shape, startR, startC) {
        for (const [dr, dc] of shape) {
            const r = startR + dr;
            const c = startC + dc;
            this.placed[r][c] = null;
        }
    }

    isComplete() {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.board[r][c] === 1 && this.placed[r][c] === null) {
                    return false;
                }
            }
        }
        return true;
    }

    findUncovered() {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.board[r][c] === 1 && this.placed[r][c] === null) {
                    return [r, c];
                }
            }
        }
        return null;
    }

    solve(maxIterations = 100000) {
        let iterations = 0;
        
        const backtrack = () => {
            iterations++;
            if (iterations > maxIterations) return false;
            
            if (this.isComplete()) return true;
            
            const target = this.findUncovered();
            if (!target) return this.isComplete();
            
            const [targetR, targetC] = target;
            const availableBlocks = Array.from(this.available);
            
            for (const blockId of availableBlocks) {
                const blockShape = this.parseShape(this.blocks[blockId]);
                const rotations = this.getRotations(blockShape);
                
                for (const rotation of rotations) {
                    for (const [dr, dc] of rotation) {
                        const startR = targetR - dr;
                        const startC = targetC - dc;
                        
                        if (this.canPlace(rotation, startR, startC)) {
                            this.placeBlock(rotation, startR, startC, blockId);
                            this.available.delete(blockId);
                            this.solution.push({
                                blockId,
                                startR,
                                startC,
                                rotation
                            });
                            
                            if (backtrack()) return true;
                            
                            this.solution.pop();
                            this.available.add(blockId);
                            this.removeBlock(rotation, startR, startC);
                        }
                    }
                }
            }
            
            return false;
        };
        
        return backtrack();
    }

    getSolutionGrid() {
        const result = Array(8).fill(null).map(() => Array(8).fill(0));
        
        this.solution.forEach((placement, idx) => {
            const blockNumber = idx + 3;
            for (const [dr, dc] of placement.rotation) {
                const r = placement.startR + dr;
                const c = placement.startC + dc;
                result[r][c] = blockNumber;
            }
        });
        
        return result;
    }
}
