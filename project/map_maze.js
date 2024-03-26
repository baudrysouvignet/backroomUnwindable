export class MapMaze {
    SPAWN_SIZE = 6;
    directions = [
        { x: 0, y: -2 },
        { x: 2, y: 0 },
        { x: -2, y: 0 },
        { x: 0, y: 2 },
    ];
    map = null;

    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    initializeGrid(width, height) {
        const grid = [];
        for (let i = 0; i < height; i++) {
            grid[i] = [];
            for (let j = 0; j < width; j++) {
                grid[i][j] = true;
            }
        }
        return grid;
    }

    avg(a, b) {
        return (a + b) / 2;
    }

    walk(x, y) {
        this.map[y][x] = false;

        const shuffledDirections = [...this.directions];
        this.shuffle(shuffledDirections);
        for (const direction of shuffledDirections) {
            const xx = x + direction.x;
            const yy = y + direction.y;
            if (this.map[yy] && this.map[yy][xx]) {
                this.map[this.avg(y, yy)][this.avg(x, xx)] = false;
                this.walk(xx, yy);
            }
        }
    }

    spawn(radius = 4) {
        const centerX = Math.floor(this.width / 2);
        const centerY = Math.floor(this.height / 2);

        for (let y = centerY - (radius / 2); y <= centerY + (radius / 2); y++) {
            for (let x = centerX - (radius / 2); x <= centerX + (radius / 2); x++) {
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    this.map[y][x] = true;
                }
            }
        }
    }

    createMap() {
        this.map = this.initializeGrid(this.width * 2 + 1, this.height * 2 + 1);

        this.walk(Math.floor(Math.random() * this.width) * 2, Math.floor(Math.random() * this.height) * 2);
        this.spawn(this.SPAWN_SIZE);

        return this.map;
    }
}