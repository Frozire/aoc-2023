function readInput() {
    const preElement = document.querySelector('pre');
    return preElement.textContent.trim().split(',');
}

// Part 1
function hashAlgorithm(str) {
    let currentValue = 0;
    for (const char of str) {
        const asciiCode = char.charCodeAt(0);
        currentValue += asciiCode;
        currentValue *= 17;
        currentValue %= 256;
    }
    return currentValue;
}

function sumHashResults(steps) {
    return steps.reduce((sum, step) => sum + hashAlgorithm(step), 0);
}

// Part 2
function processInitializationSequence(steps) {
    const boxes = Array.from({ length: 256 }, () => []);

    steps.forEach(step => {
        const label = step.match(/[a-z]+/)[0];
        const boxIndex = hashAlgorithm(label);
        const operation = step.includes('=') ? 'add' : 'remove';
        const focalLength = operation === 'add' ? parseInt(step.split('=')[1]) : null;

        const box = boxes[boxIndex];
        const lensIndex = box.findIndex(lens => lens.label === label);

        if (operation === 'remove' && lensIndex !== -1) {
            box.splice(lensIndex, 1);
        } else if (operation === 'add') {
            if (lensIndex !== -1) {
                box[lensIndex].focalLength = focalLength;
            } else {
                box.push({ label, focalLength });
            }
        }
    });

    return boxes;
}

function calculateFocusingPower(boxes) {
    let totalPower = 0;

    boxes.forEach((box, boxIndex) => {
        box.forEach((lens, slotIndex) => {
            totalPower += (boxIndex + 1) * (slotIndex + 1) * lens.focalLength;
        });
    });

    return totalPower;
}

const initializationSteps = readInput();
const result = sumHashResults(initializationSteps);
console.log("Part 1: ", result);

const boxes = processInitializationSequence(initializationSteps);
const totalPower = calculateFocusingPower(boxes);
console.log("Part 2: ", totalPower);
