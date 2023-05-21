// The structure and some naming of this javascript program is inspired from those in the sample python code term_frequency-10.py
// The code is pretty similar to my work in Nine.js but preserve the style: THE ONE
const fs = require('fs');
const path = require('path');

class TheOne {
  constructor(v) {
    this._value = v;
  }

  bind(func) {
    this._value = func(this._value);
    return this;
  }

  printme() {
    console.log(this._value);
  }
}

function read_file(file_path) {
  return fs.readFileSync(file_path, 'utf8');
}

function filter_chars(data) {
  return data.replace(/[\W_]+/g, ' ');
}

function normalize(data) {
  return data.toLowerCase();
}

function scan(data) {
  return data.split(/\s+/);
}

function remove_stop_words(words) {
  const stopwords_file = path.resolve('../stop_words.txt');
  const data = fs.readFileSync(stopwords_file, 'utf8');

  const stop_words = new Set(data.split(','));
  for (let i = 97; i <= 122; i++) {
    stop_words.add(String.fromCharCode(i));
  }

  return words.filter(word => !stop_words.has(word));
}

function frequencies(words) {
  const word_frequency = {};
  for (const word of words) {
    word_frequency[word] = (word_frequency[word] || 0) + 1;
  }
  return word_frequency;
}

function sort(word_frequency) {
  return Object.entries(word_frequency).sort((a, b) => b[1] - a[1]);
}

function top25_frequency(word_frequency) {
  let top25 = [];
  for (const term_frequency of word_frequency.slice(0, 25)) {
    top25.push(`${term_frequency[0]}  -  ${term_frequency[1]}`);
  }
  return top25.join('\n');
}

new TheOne(process.argv[2])
  .bind(read_file)
  .bind(filter_chars)
  .bind(normalize)
  .bind(scan)
  .bind(remove_stop_words)
  .bind(frequencies)
  .bind(sort)
  .bind(top25_frequency)
  .printme();
