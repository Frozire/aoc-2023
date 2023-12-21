const mapString = document.querySelector('pre').textContent.trim();
const mapArray = mapString.split('\n').map(row => row.split(''));

let startX, startY;
mapArray.forEach((row, y) => {
    const x = row.indexOf('S');
    if (x !== -1) {
        startX = x;
        startY = y;
    }
});

const reachablePositions = new Set();
const queue = [[startX, startY, 0]];
const visited = new Map();

while (queue.length > 0) {
    const [x, y, steps] = queue.shift();
    
    if (x < 0 || x >= mapArray[0].length || y < 0 || y >= mapArray.length || mapArray[y][x] === '#') {
        continue;
    }
    
    const visitedKey = `${x},${y},${steps}`;
    if (visited.has(visitedKey)) {
        continue;
    }
    visited.set(visitedKey, true);
    
    if (steps === 64) {
        reachablePositions.add(`${x},${y}`);
        continue;
    } else if (steps > 64) {
        break;
    }
    
    if (y > 0) queue.push([x, y - 1, steps + 1]); // North
    if (y < mapArray.length - 1) queue.push([x, y + 1, steps + 1]); // South
    if (x > 0) queue.push([x - 1, y, steps + 1]); // West
    if (x < mapArray[0].length - 1) queue.push([x + 1, y, steps + 1]); // East
}

console.log(`Part 1: ${reachablePositions.size}`);
