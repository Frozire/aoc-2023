function parseInput() {
    const preElement = document.querySelector('pre');
    return preElement.textContent.trim().split('\n').map(line => {
        const [map, amounts] = line.split(' ');
        return {
            map: map.split(''),
            amounts: amounts.split(',').map(Number)
        };
    });
}

function unfoldSpring(spring) {
    const unfoldedMap = [];
    for (let i = 0; i < 5; i++) {
        if (i > 0) unfoldedMap.push('?');
        unfoldedMap.push(...spring.map);
    }
    const unfoldedAmounts = new Array(5).fill(spring.amounts).flat();
    return {map: unfoldedMap, amounts: unfoldedAmounts};
}

function countArrangements(spring, cache = {}) {
    function recursiveCount(currentIndex, groupIndex, currentGroupCount) {
        const key = `${currentIndex}-${groupIndex}-${currentGroupCount}`;
        if (cache[key] !== undefined) return cache[key];

        if (currentIndex === spring.map.length) {
            const isComplete = groupIndex === spring.amounts.length && currentGroupCount === 0;
            const isLastGroupComplete = groupIndex === spring.amounts.length - 1 && currentGroupCount === spring.amounts[groupIndex];
            return isComplete || isLastGroupComplete ? 1 : 0;
        }

        let total = 0;
        const currentCondition = spring.map[currentIndex];

        const isOperationalOrUnknown = currentCondition === '.' || currentCondition === '?';
        const canCloseCurrentGroup = currentGroupCount > 0 && groupIndex < spring.amounts.length && currentGroupCount === spring.amounts[groupIndex];
        if (isOperationalOrUnknown && (currentGroupCount === 0 || canCloseCurrentGroup)) {
            const nextGroupIndex = canCloseCurrentGroup ? groupIndex + 1 : groupIndex;
            total += recursiveCount(currentIndex + 1, nextGroupIndex, 0);
        }

        const isDamagedOrUnknown = currentCondition === '#' || currentCondition === '?';
        if (isDamagedOrUnknown) {
            total += recursiveCount(currentIndex + 1, groupIndex, currentGroupCount + 1);
        }

        cache[key] = total;
        return total;
    }

    return recursiveCount(0, 0, 0);
}


function run(part2 = false) {
    const springs = parseInput();
    return springs.reduce((acc, spring) => {
        const unfoldedSpring = part2 ? unfoldSpring(spring) : spring;
        return acc + countArrangements(unfoldedSpring);
    }, 0);
}

console.log("Part 1: ", run());
console.log("Part 2: ", run(true));
