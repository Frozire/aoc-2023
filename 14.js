function readInput() {
    const preElement = document.querySelector('pre');
    return preElement.textContent.trim().split('\n').map(line => line.split(''));
}

function hashGrid(grid) {
    return grid.map(row => row.join('')).join('\n');
}

function iterateGrid(grid, direction) {
    switch (direction) {
        case "north":
            return moveRocksNorth(grid);
        case "south":
            return moveRocksSouth(grid);
        case "east":
            return moveRocksEast(grid);
        case "west":
            return moveRocksWest(grid);
    }
}

function moveRocksNorth(grid) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "O") {
                moveRock(grid, x, y, -1, 0);
            }
        }
    }
    return grid;
}

function moveRocksSouth(grid) {
    for (let y = grid.length - 1; y >= 0; y--) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "O") {
                moveRock(grid, x, y, 1, 0);
            }
        }
    }
    return grid;
}

function moveRocksEast(grid) {
    for (let x = grid[0].length - 1; x >= 0; x--) {
        for (let y = 0; y < grid.length; y++) {
            if (grid[y][x] === "O") {
                moveRock(grid, x, y, 0, 1);
            }
        }
    }
    return grid;
}

function moveRocksWest(grid) {
    for (let x = 0; x < grid[0].length; x++) {
        for (let y = 0; y < grid.length; y++) {
            if (grid[y][x] === "O") {
                moveRock(grid, x, y, 0, -1);
            }
        }
    }
    return grid;
}

function moveRock(grid, startX, startY, deltaY, deltaX) {
    let x = startX;
    let y = startY;

    while (canMove(grid, x + deltaX, y + deltaY)) {
        x += deltaX;
        y += deltaY;
    }

    if (x !== startX || y !== startY) {
        grid[startY][startX] = ".";
        grid[y][x] = "O";
    }
}

function canMove(grid, x, y) {
    if (y < 0 || y >= grid.length || x < 0 || x >= grid[y].length) {
        return false;
    }

    return grid[y][x] === ".";
}

function cycleGrid(grid) {
    const directions = ["north", "west", "south", "east"];
    directions.forEach(direction => {
        grid = iterateGrid(grid, direction);
    });
    return grid;
}

function calculateNorthLoad(grid) {
    let load = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 'O') {
                load += grid.length - y;
            }
        }
    }
    return load;
}

function run(grid) {
    grid = iterateGrid(grid, "north");
    let initialLoad = calculateNorthLoad(grid);

    const cycleData = detectCycle(grid);
    let finalLoad = cycleData.cycleDetected
        ? executeRemainingCycles(grid, cycleData)
        : 0;

    return { initialLoad, finalLoad };
}

function detectCycle(grid) {
    const seenGridPatterns = new Set();
    const cycleStartMap = new Map();
    let cycle = 0;

    for (; cycle < 1000000000; cycle++) {
        grid = cycleGrid(grid);
        const gridHash = hashGrid(grid);

        if (seenGridPatterns.has(gridHash)) {
            return {
                cycleDetected: true,
                loopOrigin: cycleStartMap.get(gridHash),
                loopLength: cycle - cycleStartMap.get(gridHash)
            };
        }

        seenGridPatterns.add(gridHash);
        cycleStartMap.set(gridHash, cycle);
    }

    return { cycleDetected: false };
}

function executeRemainingCycles(grid, { loopOrigin, loopLength }) {
    const remainingCycles = (1000000000 - 1 - loopOrigin) % loopLength;
    for (let cycle = 0; cycle < remainingCycles; cycle++) {
        grid = performCycle(grid);
    }
    return calculateNorthLoad(grid);
}
let result = run(readInput());

console.log("Part 1: " + result.initialLoad);
console.log("Part 2: " + result.finalLoad);
