function parseInput() {
    const preElement = document.querySelector('pre');
    return preElement.textContent.trim().split('\n').map(line => line.split(''));
}

function parseGalaxiesAndEmptySpaces(grid) {
    const galaxies = [];
    const emptyRows = [];
    const emptyCols = [];

    for (let y = 0; y < grid.length; y++) {
        if (!grid[y].includes("#")) {
            emptyRows.push(y);
        }
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === "#") {
                galaxies.push([y, x]);
            }
        }
    }

    for (let x = 0; x < grid[0].length; x++) {
        if (!grid.map(row => row[x]).includes("#")) {
            emptyCols.push(x);
        }
    }

    return [galaxies, emptyRows, emptyCols];
}

function calculateDistance(galaxies, emptyRows, emptyCols, expansionFactor) {
    expansionFactor -= 1; // This off-by one error took me a while to find, tried to be smart, got punished!
    const distances = galaxies.map(() => []);

    galaxies.forEach((galaxyA, i) => {
        galaxies.forEach((galaxyB, j) => {
            if (j >= i) {
                const verticalDistance = Math.abs(galaxyA[0] - galaxyB[0]);
                const horizontalDistance = Math.abs(galaxyA[1] - galaxyB[1]);
                const additionalDistance = calculateAdditionalDistance(galaxyA, galaxyB, emptyRows, emptyCols, expansionFactor);

                distances[i][j] = verticalDistance + horizontalDistance + additionalDistance;
            }
        });
    });

    return distances.flat().reduce((acc, cur) => acc + cur, 0);
}

function calculateAdditionalDistance(galaxyA, galaxyB, emptyRows, emptyCols, expansionFactor) {
    const verticalInBetween = countInBetween(galaxyA[0], galaxyB[0], emptyRows);
    const horizontalInBetween = countInBetween(galaxyA[1], galaxyB[1], emptyCols);

    return expansionFactor * (verticalInBetween + horizontalInBetween);
}

function countInBetween(pointA, pointB, emptySpaces) {
    const minPoint = Math.min(pointA, pointB);
    const maxPoint = Math.max(pointA, pointB);

    return emptySpaces.filter(space => space > minPoint && space < maxPoint).length;
}

const grid = parseInput();
const [galaxies, emptyRows, emptyCols] = parseGalaxiesAndEmptySpaces(grid);
const result = calculateDistance(galaxies, emptyRows, emptyCols, 2);
console.log("Part 1: ", result);
const resultLargeExpansion = calculateDistance(galaxies, emptyRows, emptyCols, 1000000);
console.log("Part 2: ", resultLargeExpansion);
