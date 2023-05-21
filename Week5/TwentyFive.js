// The structure and some naming of this javascript program is inspired from those in the sample python code tf-25.py
// Reused my work in Ten.js
const fs = require('fs');

// Quarantine class
class Quarantine {
  constructor(func) {
    this._funcs = [func];
  }

  bind(func) {
    this._funcs.push(func);
    return this;
  }

  execute() {
    // Error handler: This function is used to ensure that the computation sequences are called properly when they are executed.
    function guard_callable(v) {
      return typeof v === 'function' ? v() : v;
    }

    let value = () => null;
    for (const func of this._funcs) {
      value = func(guard_callable(value));
    }
    console.log(guard_callable(value));
  }
}

// The IO actions are contained within the computation sequences _f
function get_input(arg) {
  function _f() {
    return process.argv[2];
  }
  return _f;
}

function scan_words(file_path) {
  function _f() {
    const data = fs.readFileSync(file_path, 'utf8');
    const words = data.replace(/[\W_]+/g, ' ').toLowerCase().split(/\s+/);
    return words;
  }
  return _f;
}

function remove_stop_words(words) {
  function _f() {
    const data = fs.readFileSync('../stop_words.txt', 'utf8');
    const stop_words = new Set(data.split(','));
    for (let i = 97; i <= 122; i++) {
        stop_words.add(String.fromCharCode(i));
    }
    return words.filter(word => !stop_words.has(word));
  }
  return _f;
}

// The input is not modified within these functions, ensuring they are side-effect free.
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
    top25 = top25.join('\n');
    return top25;
}

// main function calls all sequences that have IO.
new Quarantine(get_input)
  .bind(scan_words)
  .bind(remove_stop_words)
  .bind(frequencies)
  .bind(sort)
  .bind(top25_frequency)
  .execute();
