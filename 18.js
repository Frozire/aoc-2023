function readInput() {
    const preElement = document.querySelector('pre');
    return preElement.textContent.trim().split('\n');
}

function calculateLagoonArea(points) {
    let area = 0;
    const n = points.length;
    for (let i = 0; i < n; i++) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[(i + 1) % n];
        area += x1 * y2 - y1 * x2;
    }
    return Math.abs(area / 2);
}

function calculateInitialCapacity() {
    const polygon = [[0, 0]];
    const deltas = { "R": [1, 0], "L": [-1, 0], "U": [0, -1], "D": [0, 1] };
    let perimeterCount = 0;

    const inputLines = readInput();
    inputLines.forEach(line => {
        const [direction, stepsStr] = line.split(' ');
        const delta = deltas[direction];
        const lastPoint = polygon[polygon.length - 1];
        const steps = parseInt(stepsStr, 10);
        perimeterCount += steps;
        polygon.push([lastPoint[0] + delta[0] * steps, lastPoint[1] + delta[1] * steps]);
    });

    return calculateLagoonArea(polygon) + Math.floor(perimeterCount / 2) + 1;
}

console.log("Part 1: " + calculateInitialCapacity());

function calculateCorrectedCapacity() {
    const polygon = [[0, 0]];
    const deltas = { "0": [0, 1], "1": [1, 0], "2": [0, -1], "3": [-1, 0] };

    const inputLines = readInput();
    let perimeterCount = 0;

    inputLines.forEach(line => {
        const match = line.match(/#([0-9A-Fa-f]+)/);
        if (!match) return;

        const hexCode = match[1];
        const direction = hexCode.charAt(hexCode.length - 1);
        const steps = parseInt(hexCode.substring(0, hexCode.length - 1), 16);
        perimeterCount += steps;

        const delta = deltas[direction];
        if (!delta) return;

        const lastPoint = polygon[polygon.length - 1];
        polygon.push([lastPoint[0] + delta[0] * steps, lastPoint[1] + delta[1] * steps]);
    });

    return calculateLagoonArea(polygon) + Math.floor(perimeterCount / 2) + 1;
}

console.log("Part 2: " + calculateCorrectedCapacity());
