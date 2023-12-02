def calculate_total_calibration_value(input_text):
    def first_num(line, replacements):
        for i in range(len(line)):
            for num, item in replacements:
                if line[i:].startswith(item):
                    return num
        return 0

    def calibrate(line, replacements):
        return (first_num(line, replacements) * 10) + first_num(line[::-1], [(k, v[::-1]) for (k, v) in replacements])

    replacements = (list(enumerate('0123456789')) +
                    list(enumerate(['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'])))

    data = input_text.splitlines()

    return sum([calibrate(line, replacements) for line in data])

input_text = 
print("Total Calibration Value for Part 2:", calculate_total_calibration_value(input_text))
