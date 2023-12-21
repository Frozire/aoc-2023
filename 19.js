function parseInput(input) {
    const [flowsLit, cmpsLit] = input.split("\n\n");
    return {
        flows: parseFlows(flowsLit),
        components: parseComponents(cmpsLit)
    };
}

function parseFlows(flowsLit) {
    const flows = {};
    flowsLit.split("\n").forEach(line => {
        const [id, opsLit] = line.match(/[^({|})]+/g);
        const ops = opsLit.split(',');
        flows[id] = ops.map(parseOperation);
    });
    return flows;
}

function parseOperation(opLit) {
    const tmp = opLit.split(/:/g);
    if (tmp.length === 1) return tmp;

    const [k, v] = tmp[0].split(/<|>/g);
    const isGreaterThan = tmp[0].includes('>');
    return [k, isGreaterThan ? '>' : '<', Number(v), tmp[1]];
}

function parseComponents(cmpsLit) {
    return cmpsLit.split("\n").map(line => {
        const component = {};
        line.slice(1, -1).split(',')
            .map(s => s.split('='))
            .forEach(([key, value]) => component[key] = Number(value));
        return component;
    });
}

function processComponent(component, flows) {
    let operationId = 'in';
    while (!['A', 'R'].includes(operationId)) {
        operationId = runFlow(operationId, component, flows);
    }
    return operationId === 'A';
}

function sumAcceptedComponents(components, flows) {
    return components.reduce((sum, component) => {
        return processComponent(component, flows)
            ? sum + Object.values(component).reduce((a, v) => a + v, 0)
            : sum;
    }, 0);
}

function runFlow(flowId, component, flows) {
    const flow = flows[flowId];
    const rule = flow.find(rule => isConditionValid(rule, component));
    return rule[rule.length - 1];
}

function isConditionValid(condition, component) {
    if (condition.length === 1) return true;
    const [key, operator, value] = condition;
    return operator === '>' ? component[key] > value : component[key] < value;
}

const input = document.querySelector('pre').textContent;
const {flows, components} = parseInput(input);
const totalSum = sumAcceptedComponents(components, flows);
console.log('Total Sum of Accepted Components:', totalSum);
