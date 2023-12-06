// First I solved it the brute-force way, then started looking at the fastest examples and adapted the following approach: https://www.reddit.com/r/adventofcode/comments/18b4b0r/comment/kc781na/
function createSeedMapping(arr) {
    const mappings = [];
    for (let i = 0; i < arr.length; i += 3) {
        const destination = parseInt(arr[i]);
        const source = parseInt(arr[i + 1]);
        const range = parseInt(arr[i + 2]);
        mappings.push([source, range, destination]);
    }
    return mappings;
}

function processSeedRanges(seedStarts, ranges, seedMappings) {
    const newSeedStarts = [];
    const newRanges = [];
    const seedStack = seedStarts.slice();
    const rangeStack = ranges.slice();

    while (seedStack.length > 0) {
        const currentSeedBottom = seedStack.pop();
        const currentSeedRange = rangeStack.pop();
        const currentSeedTop = currentSeedBottom + currentSeedRange;
        const oldSeedStartsLength = newSeedStarts.length;

        for (let m = 0; m < seedMappings.length && oldSeedStartsLength === newSeedStarts.length; m++) {
            const mapBottom = seedMappings[m][0];
            const mapRange = seedMappings[m][1];
            const mapTop = mapBottom + mapRange;
            const dest = seedMappings[m][2];

            if (currentSeedBottom < mapBottom && currentSeedTop > mapTop) {
                seedStack.push(currentSeedBottom);
                rangeStack.push(mapBottom - currentSeedBottom);

                newSeedStarts.push(dest);
                newRanges.push(mapTop - mapBottom);

                seedStack.push(mapTop);
                rangeStack.push(currentSeedTop - mapTop);
            } else if (currentSeedBottom < mapBottom && currentSeedTop > mapBottom) {
                seedStack.push(currentSeedBottom);
                rangeStack.push(mapBottom - currentSeedBottom);

                newSeedStarts.push(dest);
                newRanges.push(currentSeedTop - mapBottom);
            } else if (currentSeedBottom >= mapBottom && currentSeedBottom < mapTop && currentSeedTop > mapTop) {
                newSeedStarts.push(currentSeedBottom - mapBottom + dest);
                newRanges.push(mapTop - currentSeedBottom - 1);

                seedStack.push(mapTop);
                rangeStack.push(currentSeedTop - mapTop);
            } else if (currentSeedBottom >= mapBottom && currentSeedTop <= mapTop) {
                newSeedStarts.push(currentSeedBottom - mapBottom + dest);
                newRanges.push(currentSeedRange);
            }
        }

        if (newSeedStarts.length === oldSeedStartsLength) {
            newSeedStarts.push(currentSeedBottom);
            newRanges.push(currentSeedRange);
        }
    }

    return [newSeedStarts, newRanges];
}

function findLowestLocation(data) {
    const lines = data.split("\n\n");
    const seedMappings = [];

    const seedInfo = lines.shift().split(':')[1].replaceAll('\n', ' ').trim().split(' ').map(s => parseInt(s));
    for (let i = 0; i < 7; i++) {
        const mapData = lines.shift().split(':')[1].replaceAll('\n', ' ').trim().split(' ');
        seedMappings.push(createSeedMapping(mapData));
    }

    let lowest = Infinity;
    for (let i = 0; i < seedInfo.length; i += 2) {
        let [seedStarts, ranges] = [[seedInfo[i]], [seedInfo[i + 1]]];

        seedMappings.forEach(mapping => {
            [seedStarts, ranges] = processSeedRanges(seedStarts, ranges, mapping);
        });

        seedStarts.forEach(seed => {
            if (seed < lowest) {
                lowest = seed;
            }
        });
    }
    return lowest;
}

function processDataFromDOM() {
    const data = document.querySelector('pre').textContent;
    console.log('Lowest Location:', findLowestLocation(data));
}

processDataFromDOM();
