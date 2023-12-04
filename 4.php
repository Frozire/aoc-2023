function calculateSumOfPowers($lines) {
    $sum = 0;

    foreach ($lines as $line) {
        $parts = explode(" | ", $line);
        $winningNumbers = array_filter(explode(" ", trim($parts[0])));
        if (isset($parts[1])) {
            $numbers = array_filter(explode(" ", trim($parts[1])));
            $sum += calculatePowerSumForLine($winningNumbers, $numbers);
        }
    }
    return $sum;
}

function calculatePowerSumForLine($winningNumbers, $numbers) {
    $count = 0;
    foreach ($numbers as $num) {
        if (in_array($num, $winningNumbers)) {
            $count++;
            unset($winningNumbers[array_search($num, $winningNumbers)]);
        }
    }
    return $count > 0 ? pow(2, $count - 1) : 0;
}



Route::get('/crap', function () {
    // PART 1
    echo "Part 1";
    $lines = readAndCleanInputLines(storage_path('app/crap.txt'));

    echo calculateSumOfPowers($lines);

    echo "\n";

    // PART 2
    echo "Part 2";
    $p1 = array_fill(0, count($lines), 0.5);
    $p2 = array_fill(0, count($lines), 1.0);

    foreach ($lines as $i => $line) {
        try {
            list($w, $h) = array_map('trim', explode(' | ', $line));
        } catch (Exception $e) {
            continue;
        }
        $winningNumbers = explode(' ', $w);
        $handNumbers = explode(' ', $h);

        $wins = count(array_intersect($winningNumbers, $handNumbers));

        for ($j = 0; $j < $wins; $j++) {
            $p1[$i] *= 2;
            if ($i + $j + 1 < count($p2)) {
                $p2[$i + $j + 1] += $p2[$i];
            }
        }
    }

    foreach (array($p1, $p2) as $p) {
        echo array_sum(array_map('intval', $p));
    }
})->name('crap');

function readAndCleanInputLines($filePath) {
    $linesString = file_get_contents($filePath);
    $lines = explode("\n", $linesString);

    return array_map(function ($line) {
        return trim(preg_replace('/\s+/', ' ', $line));
    }, $lines);
}
