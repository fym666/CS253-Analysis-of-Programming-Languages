// Exercise 13.1: Written in JavaScript
const fs = require('fs');
const path = require('path');

// helper functions
function scan_data(obj, file_path) {
  obj['data'] = fs.readFileSync(file_path, 'utf8').replace(/[\W_]+/g, ' ').toLowerCase().split(/\s+/);
}

function initialize_stopwords(obj) {
  obj['stopwords'] = new Set(fs.readFileSync(path.resolve('../stop_words.txt'), 'utf8').split(','));
  for (let i = 97; i <= 122; i++) {
    obj['stopwords'].add(String.fromCharCode(i));
  }
}

function increase(obj, term) {
  obj['frequency'][term] = (term in obj['frequency']) ? obj['frequency'][term] + 1 : 1;
}

// Exercise 13.3: using the self-reference "this" in below "obj"s
const inputwords_obj = {
  'data': [],
  /* Originally I used arrow functions that are similar to "lambda" functions in Python, 
  which allows for the definition of anonymous functions used inline.
  However, exercise 13.3 makes the use of arrow functions together with "this" reference 
  impossible in JavaScript. So I use regular functions instead now. */
  'init': function(file_path) { scan_data(this, file_path); },
  'words': function() { return this['data']; }
};

const stopwords_obj = {
  'stopwords': [],
  'init': function() { initialize_stopwords(this); },
  'is_stopwords': function(word) { return this['stopwords'].has(word); }
};

const termfrequency_obj = {
  'frequency': {},
  'increase': function(term) { increase(this, term); },
  'sorted': function() { return Object.entries(this['frequency']).sort((a, b) => b[1] - a[1]); }
};

inputwords_obj['init'](process.argv[2]);
stopwords_obj['init']();

inputwords_obj['words']().forEach(term => {
  if (!stopwords_obj['is_stopwords'](term)) {
    termfrequency_obj['increase'](term);
  }
});

// Exercise 13.2: added the method 'top25' and leave codes before this part unchanged.
termfrequency_obj['top25'] = function() {
  this['sorted']().slice(0, 25).forEach(([term, frequency]) => console.log(`${term}  -  ${frequency}`));
};

termfrequency_obj['top25']();
