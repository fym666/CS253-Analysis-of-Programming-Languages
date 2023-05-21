// The structure and some naming of those javascript program is inspired from that in the sample python code tf-09.py
const fs = require('fs');
const path = require('path');

function read_file(file_path, func) {
  const data = fs.readFileSync(path.resolve(file_path), 'utf8');
  func(data, normalize);
}

// Replace non-word characters with spaces
function filter_chars(data, func) {
  func(data.replace(/[\W_]+/g, ' '), scan);
}

function normalize(data, func) {
  func(data.toLowerCase(), remove_stop_words);
}

// Split the text into an array of words
function scan(data, func) {
  func(data.split(/\s+/), frequencies);
}

function remove_stop_words(words, func) {
  const stopwords_file = path.resolve('../stop_words.txt');
  const data = fs.readFileSync(stopwords_file, 'utf8');
  
  // Construct the set of stop words by reading in the stop words file and adding the single character a-z to it.
  const stop_words = new Set(data.split(','));
  for (let i = 97; i <= 122; i++) {
    stop_words.add(String.fromCharCode(i));
  }

  // Filter out the stop words from the words list
  func(words.filter(word => !stop_words.has(word)), sort);
}

function frequencies(words, func) {
  const word_frequency = {};
  // Iterate over an array of words, for each word in the array, update the word frequency
  for (const word of words) {
    word_frequency[word] = (word_frequency[word] || 0) + 1;
  }
  func(word_frequency, print_text);
}

function sort(word_frequency, func) {
  func(Object.entries(word_frequency).sort((a, b) => b[1] - a[1]), no_op);
}

function print_text(word_frequency, func) {
  console.log(word_frequency.slice(0, 25).map(([word, frequency]) => `${word}  -  ${frequency}`).join('\n'));
  func(null);
}

function no_op(func) {
  return;
}

// main function that starts the pipeline
read_file(process.argv[2], filter_chars);
