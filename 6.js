function calculateRaceOutcomes(raceDuration, recordDistance) {
    let winCount = 0;
    for (let chargeTime = 0; chargeTime < raceDuration; chargeTime++) {
        if ((raceDuration - chargeTime) * chargeTime > recordDistance) {
            winCount++;
        }
    }
    return winCount;
}

function calculateMultipleRaceOutcomes(times, distances) {
    return times.map((time, index) => {
        const wins = [];
        for (let chargeTime = 1; chargeTime < time; chargeTime++) {
            if ((time - chargeTime) * chargeTime > distances[index]) {
                wins.push(chargeTime);
            }
        }
        return { wins };
    });
}

function parseNumberArray(str) {
    return str.trim().split(/\s+/).map(Number);
}

function parseLongNumber(str) {
    return parseInt(str.replace(/\s+/g, ''), 10);
}

function process() {
    const [timeString, distanceString] = document.querySelector('pre').textContent.trim().split(/\r?\n/);
    console.log(timeString, distanceString, timeString.substring(5), distanceString.substring(9));

    const times = parseNumberArray(timeString.substring(5));
    const distances = parseNumberArray(distanceString.substring(9));
    const multipleRaceOutcomes = calculateMultipleRaceOutcomes(times, distances);

    let reduced = multipleRaceOutcomes.reduce((acc, cur) => acc * cur.wins.length, 1);
    console.log(`Part 1: ${reduced}`);

    const timeLong = parseLongNumber(timeString.substring(5));
    const distanceLong = parseLongNumber(distanceString.substring(9));
    const raceOutcome = calculateRaceOutcomes(timeLong, distanceLong);

    console.log(`Part 2: ${raceOutcome}`);
}

process();
