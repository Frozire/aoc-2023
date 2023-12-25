function parseInput() {
    const inputText = document.querySelector('pre').textContent.trim();
    const lines = inputText.split('\n');
    const connections = {};

    lines.forEach(line => {
        const [component, connectedComponents] = line.split(': ');
        connectedComponents.split(' ').forEach(connected => {
            if (!connections[component]) connections[component] = new Set();
            if (!connections[connected]) connections[connected] = new Set();
            connections[component].add(connected);
            connections[connected].add(component);
        });
    });

    return connections;
}

function computeConnectionCut(groupA, groupB, connections) {
    let cut = 0;
    groupA.forEach(component => {
        cut += Array.from(connections[component]).filter(connected => groupB.has(connected)).length;
    });
    return cut;
}

function run(connections) {
    const groupA = new Set();
    const groupB = new Set();

    Object.keys(connections).forEach(component => {
        const targetGroup = Math.random() < 0.5 ? groupA : groupB;
        targetGroup.add(component);
    });

    let connectionCut = computeConnectionCut(groupA, groupB, connections);
    while (connectionCut > 3) {
        const [largerGroup, smallerGroup] = groupA.size > groupB.size ? [groupA, groupB] : [groupB, groupA];
        let maxDifference = -Infinity;
        let componentToMove = null;

        largerGroup.forEach(component => {
            const connectedInSmallerGroup = Array.from(connections[component]).filter(connected => smallerGroup.has(connected)).length;
            const connectedInLargerGroup = connections[component].size - connectedInSmallerGroup;
            const difference = connectedInSmallerGroup - connectedInLargerGroup;
            if (difference > maxDifference) {
                maxDifference = difference;
                componentToMove = component;
            }
        });

        if (componentToMove) {
            largerGroup.delete(componentToMove);
            smallerGroup.add(componentToMove);
            connectionCut -= maxDifference;
        }
    }

    console.log('Size of Group A:', groupA.size);
    console.log('Size of Group B:', groupB.size);
    console.log('Part 1: ' + groupA.size * groupB.size);
}

const componentConnections = parseInput();
run(componentConnections);
