function readInput() {
    const preElement = document.querySelector('pre');
    return preElement.textContent.trim().split('\n\n').map(
        chunk => chunk.split('\n').map(row => row.split(''))
    );
}

function calculateHorizontalDifferences(grid, rowIndex) {
    const halfDistance = Math.min(rowIndex, grid.length - rowIndex);
    let differenceCount = 0;

    for (let offset = 0; offset < halfDistance; offset++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (grid[rowIndex + offset][col] !== grid[rowIndex - offset - 1][col]) {
                differenceCount++;
            }
        }
    }

    return differenceCount;
}

function transposeGrid(grid) {
    return grid[0].map((_, colIndex) => grid.map(row => row[colIndex]));
}

function calculateVerticalDifferences(grid, colIndex) {
    const transposedGrid = transposeGrid(grid);
    return calculateHorizontalDifferences(transposedGrid, colIndex);
}

function run(flips) {
    const patterns = readInput();
    let horizontalSum = 0, verticalSum = 0;

    patterns.forEach(grid => {
        for (let colIndex = 1; colIndex < grid[0].length; colIndex++) {
            if (calculateVerticalDifferences(grid, colIndex) === flips) {
                verticalSum += colIndex;
            }
        }
        for (let rowIndex = 1; rowIndex < grid.length; rowIndex++) {
            if (calculateHorizontalDifferences(grid, rowIndex) === flips) {
                horizontalSum += rowIndex;
            }
        }
    });

    return horizontalSum * 100 + verticalSum;
}

console.log("Part 1: ", run(0));
console.log("Part 2): ", run(1));
