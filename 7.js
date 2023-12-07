function calculateHandStrength(cards, joker) {
    const cardsStacked = cards.reduce((acc, card) => {
        acc[card] = (acc[card] || 0) + 1;
        return acc;
    }, {});

    let jokers = 0;
    if (joker) {
        jokers = cardsStacked['0'];
        delete cardsStacked['0'];
    }

    const hand = Object.values(cardsStacked).sort((a, b) => b - a);
    if (joker && jokers) {
        hand[0] = (hand[0] || 0) + jokers;
    }

    return hand.concat(cards);
}

function runCardSort(mappedRankingValues) {
    return mappedRankingValues.sort((a, b) => descendingSort(b.sortedHand, a.sortedHand))
        .map((hand, index) => hand.bid * (index + 1))
        .reduce((acc, val) => acc + val, 0);
}

function descendingSort(array, compare) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] !== compare[i]) {
            return compare[i] - array[i];
        }
    }
    return 0;
}

function mapRankingValues(rankings, joker = false) {
    const preContent = document.querySelector('pre').textContent.trim();
    const lines = preContent.split('\n');

    return lines.map(line => {
        let [cardSequence, bid] = line.split(' ');
        const cards = cardSequence.split('').map(card => rankings.indexOf(card));

        const sortedHand = calculateHandStrength(cards, joker);

        return {sortedHand, bid: Number(bid)};
    })
}


rankings = '23456789TJQKA';
console.log('Part 1', runCardSort(mapRankingValues(rankings)));
rankings = 'J23456789TQKA';
console.log('Part 2', runCardSort(mapRankingValues(rankings, true)));
