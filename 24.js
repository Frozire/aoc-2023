const MIN = 200000000000000;
const MAX = 400000000000000;

function parseInput() {
    const inputText = document.querySelector('pre').textContent.trim();
    return inputText.split('\n').map(line => {
        const [positionPart, velocityPart] = line.split('@').map(part => part.trim());
        const positions = positionPart.split(',').map(Number);
        const velocities = velocityPart.split(',').map(Number);
        return [...positions, ...velocities];
    });
}

function checkIntersect(hailstoneA, hailstoneB) {
    const delta = calculateIntersection(
        hailstoneA[0], hailstoneA[1], hailstoneA[0] + hailstoneA[3], hailstoneA[1] + hailstoneA[4],
        hailstoneB[0], hailstoneB[1], hailstoneB[0] + hailstoneB[3], hailstoneB[1] + hailstoneB[4]
    );

    if (delta === null) return false;

    const intersectionX = hailstoneA[0] + delta * hailstoneA[3];
    const intersectionY = hailstoneA[1] + delta * hailstoneA[4];

    return isInTestArea(intersectionX, intersectionY, hailstoneA, hailstoneB);
}

function calculateIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    const determinant = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
    if (determinant === 0) return null;

    return ((y4 - y3) * (x4 - x1) + (x3 - x4) * (y4 - y1)) / determinant;
}

function isInTestArea(intersectionX, intersectionY, hailstoneA, hailstoneB) {
    return intersectionX >= MIN && intersectionX <= MAX && 
           intersectionY >= MIN && intersectionY <= MAX &&
           !((intersectionX < hailstoneA[0] && hailstoneA[3] > 0) || 
             (intersectionX > hailstoneA[0] && hailstoneA[3] < 0) ||
             (intersectionX < hailstoneB[0] && hailstoneB[3] > 0) || 
             (intersectionX > hailstoneB[0] && hailstoneB[3] < 0));
}

const hailstones = parseInput();
let intersectionCount = 0;

hailstones.forEach((hailstoneA, indexA) => {
    hailstones.forEach((hailstoneB, indexB) => {
        if (indexA >= indexB) return;

        if (checkIntersect(hailstoneA, hailstoneB)) {
            intersectionCount++;
        }
    });
});

console.log('Part 1: ' + intersectionCount);
