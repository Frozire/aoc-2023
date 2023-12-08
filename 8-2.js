class Node {
    constructor(name, left, right) {
        this.name = name;
        this.left = left;
        this.right = right;
    }
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

function findStepsToZ(node, instruction, nodes) {
    let current = node;
    let steps = 0;

    while (!current.name.endsWith('Z')) {
        const direction = instruction[steps % instruction.length];
        current = nodes.find(n => n.name === (direction === 'L' ? current.left : current.right));
        steps++;
    }

    return steps;
}

function part2() {
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

    const startingNodes = nodes.filter(node => node.name.endsWith('A'));

    const stepsForEachPath = startingNodes.map(node => findStepsToZ(node, instruction, nodes));

    return stepsForEachPath.reduce((acc, steps) => lcm(acc, steps), 1);
}

console.log(part2());
