function parseBrickPosition(line) {
    const [firstPoint, secondPoint] = line.split('~');
    const [x1, y1, z1] = firstPoint.split(',').map(Number);
    const [x2, y2, z2] = secondPoint.split(',').map(Number);

    let deltaX = x2 - x1, deltaY = y2 - y1, deltaZ = z2 - z1;

    deltaX = deltaX !== 0 ? deltaX / Math.abs(deltaX) : 0;
    deltaY = deltaY !== 0 ? deltaY / Math.abs(deltaY) : 0;
    deltaZ = deltaZ !== 0 ? deltaZ / Math.abs(deltaZ) : 0;

    return [[x1, y1, z1], [x2, y2, z2], [deltaX, deltaY, deltaZ]];
}

function isBrickResting(brickCoordinates, brickLabel, spaceMap, childDependencies, parentDependencies) {
    const isOnGround = brickCoordinates[2] === 1;
    const cellBelow = [brickCoordinates[0], brickCoordinates[1], brickCoordinates[2] - 1];
    const brickBelow = isOnGround ? null : spaceMap.get(cellBelow.toString());

    if (brickBelow !== undefined) {
        childDependencies[brickBelow] = childDependencies[brickBelow] || [];
        childDependencies[brickBelow].push(brickLabel);

        parentDependencies[brickLabel] = parentDependencies[brickLabel] || [];
        parentDependencies[brickLabel].push(brickBelow);
    }

    return isOnGround || brickBelow !== undefined;
}

function filterDependencies(excludedBrickLabel, dependencies) {
    const result = [];
    for (const [brick, brickDependencies] of Object.entries(dependencies)) {
        if (brick != excludedBrickLabel) {
            result.push(...brickDependencies);
        }
    }
    return result;
}

function triggerChainReaction(brick, childDependencies, parentDependencies) {
    const tempParentDeps = JSON.parse(JSON.stringify(parentDependencies));

    let bricksRemoved = -1;
    const bricksToRemove = [brick];
    while (bricksToRemove.length) {
        const currentBrick = bricksToRemove.shift();
        const dependentBricks = childDependencies[currentBrick] || [];
        dependentBricks.forEach(dependentBrick => {
            const index = tempParentDeps[dependentBrick].indexOf(currentBrick);
            tempParentDeps[dependentBrick].splice(index, 1);
            if (tempParentDeps[dependentBrick].length === 0) {
                bricksToRemove.push(dependentBrick);
            }
        });
        bricksRemoved++;
    }
    return bricksRemoved;
}

function evaluateBricks(input) {
    const lines = input.trim().split('\n');
    let brickPositions = lines.map(parseBrickPosition);
    brickPositions.sort((a, b) => a[0][2] - b[0][2]);

    const spaceMap = new Map();
    let brickLabel = 0;
    const parentDependencies = {}, childDependencies = {};

    for (const [start, end, direction] of brickPositions) {
        let current = start.slice();
        let isResting = false;
        const bricks = [];
        while (compareCoordinates(current, end) <= 0) {
            bricks.push(current.slice());
            isResting |= isBrickResting(current, brickLabel, spaceMap, childDependencies, parentDependencies);
            current = addCoordinates(current, direction);
            if (sumArray(direction) === 0) break;
        }

        while (!isResting) {
            for (let i = 0; i < bricks.length; i++) {
                bricks[i] = addCoordinates(bricks[i], [0, 0, -1]);
                isResting |= isBrickResting(bricks[i], brickLabel, spaceMap, childDependencies, parentDependencies);
            }
        }

        bricks.forEach(brick => spaceMap.set(brick.toString(), brickLabel));
        brickLabel++;
    }

    let safeDisintegrations = 0, totalBricksRemoved = 0;
    for (let brick = 0; brick < brickLabel; brick++) {
        const brickDeps = childDependencies[brick] || [];
        if (brickDeps.length === 0) {
            safeDisintegrations++;
        } else {
            const otherBrickDeps = filterDependencies(brick, childDependencies);
            if (brickDeps.every(dep => otherBrickDeps.includes(dep))) {
                safeDisintegrations++;
            }
            totalBricksRemoved += triggerChainReaction(brick, childDependencies, parentDependencies);
        }
    }

    return [safeDisintegrations, totalBricksRemoved];
}

function compareCoordinates(a, b) {
    return a[0] === b[0] ? (a[1] === b[1] ? a[2] - b[2] : a[1] - b[1]) : a[0] - b[0];
}

function addCoordinates(a, b) {
    return a.map((val, idx) => val + b[idx]);
}

function sumArray(arr) {
    return arr.reduce((acc, val) => acc + val, 0);
}


const input = document.querySelector('pre').innerText;
const [safeDisintegrations, totalBricksRemoved] = evaluateBricks(input);
console.log("Part 1: " + safeDisintegrations)
console.log("Part 2: " + totalBricksRemoved);
