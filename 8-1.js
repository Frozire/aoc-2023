class Node {
    constructor(name, left, right) {
        this.name = name;
        this.left = left;
        this.right = right;
    }
}

function part1() {
    const preElement = document.querySelector('pre');
    const allText = preElement.textContent.trim();

    const [instructionString, nodesString] = allText.split('\n\n');

    const instruction = instructionString.trim().split('');

    const nodesLines = nodesString.trim().split('\n');
    const nodes = nodesLines.map(line => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
            const [name, leftRight] = trimmedLine.split(' = ');
            const [left, right] = leftRight.replace('(', '').replace(')', '').split(', ');
            return new Node(name.trim(), left.trim(), right.trim());
        }
    }).filter(Boolean);

    let numSteps = 0;
    let current = 'AAA';
    for (let i = 0; current !== 'ZZZ'; i = (i + 1) % instruction.length) {
        const currentNode = nodes.find(node => node.name === current);
        current = (instruction[i] === 'L') ? currentNode.left : currentNode.right;
        numSteps++;
    }

    return numSteps;
}

console.log(part1());
