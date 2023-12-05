(function () {
    function getSeedsAndMapData() {
        const input = document.querySelector('pre').innerText.trim().split("\n");
        const seeds = input.shift().replace("seeds: ", "").split(" ").map(Number);
        return { seeds, mapData: input };
    }

    function findMapIndexes(mapData) {
        return mapData
            .map((line, index) => line.endsWith("map:") ? index : null)
            .filter(index => index !== null)
            .concat(mapData.length);
    }

    function extractMaps(mapData, mapIndexes) {
        return mapIndexes.slice(0, -1).map((startIdx, i) => {
            const endIdx = mapIndexes[i + 1];
            return mapData.slice(startIdx + 1, endIdx).map(line => line.split(" ").map(Number));
        });
    }

    function determineLocations(seeds, maps) {
        return seeds.map(seed => getLocationFromSeed(seed, maps));
    }

    function getLocationFromSeed(seed, maps) {
        return maps.reduce((location, map) => {
            const mapping = findMappingForLocation(location, map);
            return mapping ? calculateNewLocation(location, mapping) : location;
        }, seed);
    }

    function findMappingForLocation(location, map) {
        return map.find(([to, from, range]) => location >= from && location < from + range);
    }

    function calculateNewLocation(location, [to, from]) {
        return to + (location - from);
    }

    const { seeds, mapData } = getSeedsAndMapData();
    const splits = findMapIndexes(mapData);
    const maps = extractMaps(mapData, splits);
    const locations = determineLocations(seeds, maps);

    console.log("Lowest:", Math.min(...locations));
})();
