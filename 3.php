<?php

function readEngineSchematic($filePath) {
    // Read file and split into lines
    $linesString = file_get_contents($filePath);
    $lines = explode("\n", $linesString);
    return array_map(function($line) { return $line . '.'; }, $lines); // Append '.' for easier number scanning
}

function findNumbersInSchematic($lines) {
    // Scans lines for numbers and returns an array with their positions and values
    $numbers = [];
    foreach ($lines as $row => $line) {
        $inNumber = false;
        for ($col = 0; $col < strlen($line); $col++) {
            if (!$inNumber && ctype_digit($line[$col])) {
                $startCol = $col;
                $inNumber = true;
            } elseif ($inNumber && !ctype_digit($line[$col])) {
                $num = [$row, $startCol, intval(substr($line, $startCol, $col - $startCol))];
                for ($col2 = $startCol; $col2 < $col; $col2++) {
                    $numbers[$row . ',' . $col2] = $num;
                }
                $inNumber = false;
            }
        }
    }
    return $numbers;
}

function calculateSchematicSum($lines, $numbers) {
    $uniqueParts = [];
    $gearRatios = [];

    foreach ($lines as $row => $line) {
        for ($col = 0; $col < strlen($line); $col++) {
            if (ctype_digit($line[$col]) || $line[$col] == '.') {
                continue;
            }

            $adjacentParts = [];
            foreach (range(-1, 1) as $dr) {
                foreach (range(-1, 1) as $dc) {
                    $key = ($row + $dr) . ',' . ($col + $dc);
                    if (isset($numbers[$key])) {
                        $num = $numbers[$key];
                        $uniqueParts[$num[0] . ',' . $num[1]] = $num[2];
                        if ($line[$col] == '*') {
                            $adjacentParts[$num[0] . ',' . $num[1]] = $num[2];
                        }
                    }
                }
            }

            if (count($adjacentParts) == 2) {
                $gearRatios[] = array_product($adjacentParts);
            }
        }
    }

    return [array_sum($uniqueParts), array_sum($gearRatios)];
}

Route::get('/crap', function () {
    $lines = readEngineSchematic(storage_path('app/crap.txt'));
    $numbers = findNumbersInSchematic($lines);
    list($answer1, $answer2) = calculateSchematicSum($lines, $numbers);

    echo "Answer 1 (Sum of Part Numbers): $answer1\n";
    echo "Answer 2 (Sum of Gear Ratios): $answer2\n";

})->name('crap');
