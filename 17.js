function readInput() {
    const preElement = document.querySelector('pre');
    return preElement.textContent.trim().split('\n').map(line => line.split('').map(Number));
}

class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(priority, value) {
        this.elements.push({priority, value});
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift().value;
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

function inRange(x, y, grid) {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length;
}

function findLeastHeatLoss(grid, minDist, maxDist) {
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const queue = new PriorityQueue();
    const seen = new Set();
    const costs = new Map();
    queue.enqueue(0, [0, 0, -1]);

    while (!queue.isEmpty()) {
        const [x, y, dd] = queue.dequeue();
        const key = `${x},${y},${dd}`;
        if (x === grid.length - 1 && y === grid[0].length - 1) {
            return costs.get(key);
        }
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);

        directions.forEach((dir, direction) => {
            if (direction === dd || (direction + 2) % 4 === dd) {
                return;
            }
            let costIncrease = 0;
            let newX = x, newY = y;
            for (let distance = 1; distance <= maxDist; distance++) {
                newX += dir[0];
                newY += dir[1];
                if (!inRange(newX, newY, grid)) {
                    break;
                }
                costIncrease += grid[newX][newY];
                if (distance < minDist) {
                    continue;
                }
                const newCost = (costs.get(key) || 0) + costIncrease;
                const newKey = `${newX},${newY},${direction}`;
                if ((costs.get(newKey) || Infinity) <= newCost) {
                    continue;
                }
                costs.set(newKey, newCost);
                queue.enqueue(newCost, [newX, newY, direction]);
            }
        });
    }
    return Infinity;
}

const grid = readInput().map(row => row.map(Number));
const resultPart1 = findLeastHeatLoss(grid, 1, 3);
const resultPart2 = findLeastHeatLoss(grid, 4, 10);
console.log("Part 1: " + resultPart1);
console.log("Part 2: " + resultPart2);
