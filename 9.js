function generateDifferences(history) {
    let differences = [];
    for (let i = 0; i < history.length - 1; i++) {
        differences.push(history[i + 1] - history[i]);
    }
    return differences;
}

function mapCurrentDifferences(history) {
    let sequences = [history];
    while (!sequences[sequences.length - 1].every(val => val === 0)) {
        sequences.push(generateDifferences(sequences[sequences.length - 1]));
    }
    return sequences;
}

function findNextValue(history) {
    let sequences = mapCurrentDifferences(history);

    let nextVal
    for (let i = sequences.length - 2; i >= 0; i--) {
        nextVal = sequences[i][sequences[i].length - 1] + sequences[i + 1][sequences[i + 1].length - 1];
        sequences[i].push(nextVal);
    }

    return nextVal;
}

function findPreviousValue(history) {
    let sequences = mapCurrentDifferences(history);

    sequences[sequences.length - 1].unshift(0);

    let newFirstValue;
    for (let i = sequences.length - 2; i >= 0; i--) {
        newFirstValue = sequences[i][0] - sequences[i + 1][0];
        sequences[i].unshift(newFirstValue);
    }

    return newFirstValue;
}

function run() {
    const preElement = document.querySelector('pre');
    const histories = preElement.textContent.trim().split('\n').map(line => line.split(' ').map(Number));

    let sumForward = 0, sumBackward = 0;
    for (const history of histories) {
        sumForward += findNextValue(history);
        sumBackward += findPreviousValue(history);
    }

    console.log("Part 1: ", sumForward);
    console.log("Part 2: ", sumBackward);
}

run()
