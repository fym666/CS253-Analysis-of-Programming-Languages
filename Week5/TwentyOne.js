// Reused my previous implementation: 9.js. 
// Same kinds of error detection and handling in tf-21.py added.
const fs = require('fs');
const path = require('path');

function read_file(file_path, func) {
    if (typeof file_path !== 'string' || !file_path) {
      return;
    }
  
    let data;
    try {
      data = fs.readFileSync(path.resolve(file_path), 'utf8');
    } catch (error) {
      console.error(`I/O error(${error.code}) when opening ${file_path}: ${error.message}`);
      return;
    }
  
    func(data, normalize);
}
    
function filter_chars(data, func) {
  if (typeof data !== 'string') {
    return;
  }

  func(data.replace(/[\W_]+/g, ' '), scan);
}

function normalize(data, func) {
  if (typeof data !== 'string') {
    return;
  }

  func(data.toLowerCase(), remove_stop_words);
}

function scan(data, func) {
  if (typeof data !== 'string') {
    return;
  }

  func(data.split(/\s+/), frequencies);
}

//check for possible errors and escape the block when things go wrong, setting the state to something reasonable, and continuing to execute
function remove_stop_words(words, func) {
    if (!Array.isArray(words)) {
      return;
    }
  
    let data;
    try {
      const stopwords_file = path.resolve('../stop_words.txt');
      data = fs.readFileSync(stopwords_file, 'utf8');
    } catch (error) {
      console.error(`I/O error(${error.code}) when opening ../stop_words.txt: ${error.message}`);
      // setting the state to something reasonable, and continuing to execute the rest of the function
      func(words, sort);
      return;
    }
  
    const stop_words = new Set(data.split(','));
    for (let i = 97; i <= 122; i++) {
      stop_words.add(String.fromCharCode(i));
    }
  
    func(words.filter(word => !stop_words.has(word)), sort);
}

function frequencies(words, func) {
  if (!Array.isArray(words) || words.length === 0) {
    return;
  }

  const word_frequency = {};
  for (const word of words) {
    word_frequency[word] = (word_frequency[word] || 0) + 1;
  }
  func(word_frequency, print_text);
}

function sort(word_frequency, func) {
  if (typeof word_frequency !== 'object' || Object.keys(word_frequency).length === 0) {
    return;
  }

  func(Object.entries(word_frequency).sort((a, b) => b[1] - a[1]), no_op);
}

function print_text(word_frequency, func) {
  if (!Array.isArray(word_frequency)) {
    return;
  }

  console.log(word_frequency.slice(0, 25).map(([word, frequency]) => `${word}  -  ${frequency}`).join('\n'));
  func(null);
}

function no_op(func) {
  return;
}

// main function that starts the pipeline
read_file(process.argv[2] || '../input.txt', filter_chars);
