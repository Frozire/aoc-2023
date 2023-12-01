import re

def sum_calibration_values(text):
    total_sum = 0
    lines = text.split("\n")
    digit_pattern = re.compile(r'\d')

    for line in lines:
        digits = digit_pattern.findall(line)
        if digits:
            first_digit = digits[0]
            last_digit = digits[-1]
            two_digit_number = int(first_digit + last_digit)
            total_sum += two_digit_number

    return total_sum

input_text = """
