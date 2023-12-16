function readInput() {
    const preElement = document.querySelector('pre');
    return preElement.textContent.trim().split('\n').map(row => row.split(''));
}

function getBeamCoverage(grid, start) {
    const m = grid.length;
    const n = grid[0].length;
    const seen = new Set();
    const q = [];

    q.push(start);

    while (q.length > 0) {
        const [i, j, di, dj] = q.pop();
        const ii = i + di, jj = j + dj;
        const key = `${ii},${jj},${di},${dj}`;

        if (seen.has(key)) continue;
        if (!(0 <= ii && ii < m && 0 <= jj && jj < n)) continue;

        seen.add(key);
        let newDi = di, newDj = dj;
        const tile = grid[ii][jj];

        switch (tile) {
            case '/':
                newDi = -dj;
                newDj = -di;
                break;
            case '\\':
                newDi = dj;
                newDj = di;
                break;
            case '|':
                if (dj !== 0) {
                    newDi = 1;
                    newDj = 0;
                    q.push([ii, jj, -1, 0]);
                }
                break;
            case '-':
                if (di !== 0) {
                    newDi = 0;
                    newDj = 1;
                    q.push([ii, jj, 0, -1]);
                }
                break;
        }
        q.push([ii, jj, newDi, newDj]);
    }

    const energized = new Set(Array.from(seen).map(x => x.split(',').slice(0, 2).join(',')));
    return energized.size;
}

function solve(grid) {
    const part1 = getBeamCoverage(grid, [0, -1, 0, 1]);
    let part2 = 0;
    const m = grid.length, n = grid[0].length;

    for (let i = 0; i < m; i++) {
        part2 = Math.max(part2, getBeamCoverage(grid, [i, -1, 0, 1]));
        part2 = Math.max(part2, getBeamCoverage(grid, [i, n, 0, -1]));
    }
    for (let j = 0; j < n; j++) {
        part2 = Math.max(part2, getBeamCoverage(grid, [-1, j, 1, 0]));
        part2 = Math.max(part2, getBeamCoverage(grid, [m, j, -1, 0]));
    }

    return [part1, part2];
}

const grid = readInput();
const [part1, part2] = solve(grid);
console.log("Part 1: ", part1);
console.log("Part 2: ", part2);
