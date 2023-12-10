function findStartCoordinate(grid) {
    for (let y = 0; y < grid.length; y++) {
        const x = grid[y].indexOf('S');
        if (x !== -1) {
            return [y, x];
        }
    }
}

const directionMappings = {
    "|": [[1, 0], [-1, 0]],
    "-": [[0, 1], [0, -1]],
    "7": [[1, 0], [0, -1]],
    "L": [[-1, 0], [0, 1]],
    "J": [[-1, 0], [0, -1]],
    "F": [[1, 0], [0, 1]]
};

function traverseLoop(grid) {
    const [startY, startX] = findStartCoordinate(grid);
    grid[startY][startX] = "L"; // Assume "S" is "L"
    const visitedCells = new Set([`${startY},${startX}`]);
    const pathQueue = [[0, startY, startX]]; // [distance, y, x]
    let maxLoopDistance = 0;

    while (pathQueue.length) {
        const [distance, currentY, currentX] = pathQueue.shift();
        maxLoopDistance = Math.max(maxLoopDistance, distance);

        directionMappings[grid[currentY][currentX]].forEach(([dy, dx]) => {
            const [nextY, nextX] = [currentY + dy, currentX + dx];
            const key = `${nextY},${nextX}`;

            if (isValidCoordinate(nextY, nextX, grid) && !visitedCells.has(key)) {
                visitedCells.add(key);
                pathQueue.push([distance + 1, nextY, nextX]);
            }
        });
    }

    return [visitedCells, maxLoopDistance];
}

function isValidCoordinate(y, x, grid) {
    return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
}

function eraseNonLoopParts(grid, visitedCells) {
    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (!visitedCells.has(`${y},${x}`)) {
                grid[y][x] = '.';
            }
        });
    });
}

function calculateEnclosedArea(grid) {
    let enclosedAreaCount = 0;
    grid.forEach(row => {
        let inInterior = 0;
        const processedRow = processRowForInteriorCalculation(row);
        processedRow.forEach(char => {
            if (char === '|') {
                inInterior++;
            }
            if (inInterior % 2 === 1 && char === '.') {
                enclosedAreaCount++;
            }
        });
    });
    return enclosedAreaCount;
}

function processRowForInteriorCalculation(row) {
    let rowString = row.join('');
    rowString = rowString.replace(/F-*7|L-*J/g, '').replace(/F-*J|L-*7/g, '|');
    return rowString.split('');
}

const input = document.querySelector('pre');
const grid = input.textContent.trim().split('\n').map(line => line.split(''));
const [visitedCells, maxLoopDistance] = traverseLoop(grid);
console.log("Part 1: ", maxLoopDistance);
eraseNonLoopParts(grid, visitedCells);
console.log("Part 2: ", calculateEnclosedArea(grid));
