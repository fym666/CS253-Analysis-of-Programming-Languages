# My code below have no explicit iterations (no for loops, etc.)
# I reused part of the code in tf-03.py
import sys
import numpy as np

# My version of Leet mapping
leet_mapping = {
    'A': '4',
    'B': '8',
    'C': '<',
    'D': 'D', # unchanged
    'E': '3',
    'F': '7',
    'G': '[',
    'H': '#',
    'I': '!',
    'J': '√',
    'K': 'K', # unchanged
    'L': '1',
    'M': 'м',
    'N': 'И',
    'O': '0',
    'P': 'р',
    'Q': '9',
    'R': 'Я',
    'S': '$',
    'T': '+',
    'U': 'U', # unchanged
    'V': 'V', # unchanged
    'W': 'W', # unchanged
    'X': '*',
    'Y': '￥',
    'Z': '5'
}

# Define N in the "top N"
N = 5

# Read the input text file
characters = np.array(list(open(sys.argv[1]).read()))

# Filter and normalize the characters
characters[~np.char.isalpha(characters)] = ' '
characters = np.char.upper(characters)

# Convert uppercase characters to Leet counterparts
characters = np.array(list(map(leet_mapping.get, characters, characters)))

# Find the indices of spaces and then split the words accordingly
split = np.where(characters == ' ')
split2 = np.repeat(split, 2)
w_ranges = np.reshape(split2[1:-1], (-1, 2))
w_ranges = w_ranges[np.where(w_ranges[:, 1] - w_ranges[:, 0] > 2)] # ignores words smaller than 2 characters
w_ranges[:, 0] += 1 # Exclude leading spaces
words = np.array(list(map(''.join, map(lambda r: characters[r[0]:r[1]], w_ranges))))

# generate 2-grams array
words_2nd = np.empty_like(words)
words_2nd[:-1] = words[1:]
words_2nd[-1] = ''
two_grams = np.char.array(words) + ' ' + np.char.array(words_2nd)

# Sort 2-grams with frequencies
twogram_freqs = np.unique(two_grams, return_counts=True)
top_indices = np.argsort(twogram_freqs[1])[-N:][::-1]
top_twograms = twogram_freqs[0][top_indices]
top_freqs = twogram_freqs[1][top_indices]

# Print output in "2-gram  -  frequency" format
np.savetxt(sys.stdout, np.stack((top_twograms, top_freqs), axis=1), fmt="%s  -  %s")
