import sys
import re
import string

def load_stop_words(stop_words_file):
    with open(stop_words_file) as f:
        stop_words = f.read().split(',')
    stop_words.extend(list(string.ascii_lowercase))
    return stop_words

def count_words_with_z(text_file, stop_words_file):
    with open(text_file) as f:
        data = f.read()
    data = re.sub('[\W_]+', ' ', data).lower()

    stop_words = load_stop_words(stop_words_file)
    words_with_z = 0
    for word in data.split():
        if not word in stop_words and 'z' in word:
            words_with_z += 1
    return words_with_z

if __name__ == "__main__":
    text_file = sys.argv[1]
    stop_words_file = '../stop_words.txt'
    result = count_words_with_z(text_file, stop_words_file)
    print(f'Words with z: {result}')
