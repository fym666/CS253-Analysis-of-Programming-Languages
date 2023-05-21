// Reused my previous implementation: Nine.js. 
// Same kinds of error detection and handling in tf-22.py added.
const fs = require('fs');
const path = require('path');

// Used the same patterns of error information messages to those in tf-22.py 
function read_file(file_path, func) {
  if (typeof file_path !== 'string') {
    console.error("NO! I need a string!");
    return;
  }
  if (!file_path) {
    console.error("NO! I need a non-empty string!");
    return;
  }

  let data;
  try {
    data = fs.readFileSync(path.resolve(file_path), 'utf8');
  } catch (error) {
    console.error(`I/O error(${error.code}) when opening ${file_path}: ${error.message}! I quit!`);
    throw error;
  }

  func(data, normalize);
}

function filter_chars(data, func) {
  if (typeof data !== 'string') {
    console.error("NO! I need a string!");
    return;
  }
  if (!data) {
    console.error("NO! I need a non-empty string!");
    return;
  }

  func(data.replace(/[\W_]+/g, ' '), scan);
}

function normalize(data, func) {
  if (typeof data !== 'string') {
    console.error("NO! I need a string!");
    return;
  }
  if (!data) {
    console.error("NO! I need a non-empty string!");
    return;
  }

  func(data.toLowerCase(), remove_stop_words);
}

function scan(data, func) {
  if (typeof data !== 'string') {
    console.error("NO! I need a string!");
    return;
  }
  if (!data) {
    console.error("NO! I need a non-empty string!");
    return;
  }

  func(data.split(/\s+/), frequencies);
}

function remove_stop_words(words, func) {
  if (!Array.isArray(words)) {
    console.error("NO! I need an array!");
    return;
  }

  let data;
  try {
    const stopwords_file = path.resolve('../stop_words.txt');
    data = fs.readFileSync(stopwords_file, 'utf8');
  } catch (error) {
    console.error(`I/O error(${error.code}) when opening ../stop_words.txt: ${error.message}! I quit!`);
    throw error;
  }

  const stop_words = new Set(data.split(','));
  for (let i = 97; i <= 122; i++) {
    stop_words.add(String.fromCharCode(i));
  }

  func(words.filter(word => !stop_words.has(word)), sort);
}

function frequencies(words, func) {
  if (!Array.isArray(words)) {
    console.error("NO! I need an array!");
    return;
  }
  if (words.length === 0) {
    console.error("NO! I need a non-empty array!");
    return;
  }

  const word_frequency = {};
  for (const word of words) {
    word_frequency[word] = (word_frequency[word] || 0) + 1;
  }
  func(word_frequency, print_text);
}

function sort(word_frequency, func) {
  if (typeof word_frequency !== 'object') {
    console.error("NO! I need a dictionary object!");
    return;
  }
  if (Object.keys(word_frequency).length === 0) {
    console.error("NO! I need a non-empty dictionary object!");
    return;
  }

  try {
    func(Object.entries(word_frequency).sort((a, b) => b[1] - a[1]), no_op);
  } catch (error) {
    console.error(`Sort threw ${error}`);
    throw error;
  }
}

function print_text(word_frequency, func) {
    if (!Array.isArray(word_frequency)) {
      console.error("OMG! This is not an array!");
      return;
    }
    if (word_frequency.length < 25) {
      console.error("SRSLY? Less than 25 words!");
      return;
    }
  
    console.log(word_frequency.slice(0, 25).map(([word, frequency]) => `${word}  -  ${frequency}`).join('\n'));
    func(null);
}
  
function no_op(func) {
    return;
}
  
// Main function that starts the pipeline
if (process.argv.length <= 2) {
    console.error("You idiot! I need an input file!");
} else {
    try {
      read_file(process.argv[2], filter_chars);
    } catch (error) {
      console.error(`Something wrong: ${error}`);
    }
}