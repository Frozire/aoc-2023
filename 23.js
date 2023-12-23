function parseInput() {
    const input = document.querySelector('pre').textContent.trim();
    return input.split('\n').map(line => line.split(''));
}

function isValidMove(maze, x, y, visited) {
    return x >= 0 && x < maze[0].length && y >= 0 && y < maze.length &&
           maze[y][x] !== '#' && !visited.has(`${x},${y}`);
}

function getNextCoordinates(x, y, tile) {
    const directions = {
        '^': [x, y - 1],
        '>': [x + 1, y],
        'v': [x, y + 1],
        '<': [x - 1, y]
    };
    return directions[tile] || null;
}

function exploreMaze(maze, stack) {
    let maxSteps = 0;

    while (stack.length > 0) {
        const [x, y, visited, steps] = stack.pop();

        if (y === maze.length - 1) {
            maxSteps = Math.max(maxSteps, steps);
            continue;
        }

        const tile = maze[y][x];
        let nextCoords = getNextCoordinates(x, y, tile);
        
        if (!nextCoords) {
            nextCoords = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
        } else {
            nextCoords = [nextCoords];
        }

        nextCoords.forEach(([nextX, nextY]) => {
            if (isValidMove(maze, nextX, nextY, visited)) {
                const newVisited = new Set(visited);
                newVisited.add(`${nextX},${nextY}`);
                stack.push([nextX, nextY, newVisited, steps + 1]);
            }
        });
    }

    return maxSteps;
}

function findLongestHike(maze) {
    const startX = maze[0].indexOf('.');
    const startStack = [[startX, 0, new Set([`${startX},0`]), 0]];
    return exploreMaze(maze, startStack);
}

const maze = parseInput();
console.log('Part 1: ' + findLongestHike(maze));
