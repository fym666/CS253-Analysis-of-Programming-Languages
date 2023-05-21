// 27.1 Spreadsheet implemented in JavaScript. Structures are inspired from those in sample program tf-27.py.
const fs = require('fs');
const readline = require('readline');

// The columns.
const all_words = [[], null];
const stop_words = [[], null];
const non_stop_words = [[], () => {
  return all_words[0].filter(word => !stop_words[0].has(word));
}];
const unique_words = [[], () => {
  return [...new Set(non_stop_words[0])];
}];
const counts = [[], () => {
  return unique_words[0].map(word => ({
    word: word,
    frequency: non_stop_words[0].filter(x => x === word).length
  }));
}];
const sorted_word_frequency = [[], () => {
  return counts[0].sort((a, b) => b.frequency - a.frequency);
}];

// The entire spreadsheet
const all_columns = [
  all_words, 
  stop_words, 
  non_stop_words, 
  unique_words, 
  counts, 
  sorted_word_frequency
];

// Helper lambda function to update the data in the spreadsheet
const update = () => {
  all_columns.forEach(column => {
    if (column[1] !== null) {
      column[0] = column[1]();
    }
  });
};

// To achieve interactive, we need to make this function
const load_file = (file_path) => {
  // add the words from new file to all_words in spreadsheet
  all_words[0] = all_words[0].concat(
    fs.readFileSync(file_path, 'utf-8')
      .replace(/[\W_]+/g, ' ')
      .toLowerCase()
      .split(/\s+/)
  );
  // we can handle it even if the stop words file changes after one iteration.
  stop_words[0] = new Set(
    fs.readFileSync('../stop_words.txt', 'utf-8').split(',')
  );
  for (let i = 97; i <= 122; i++) {
    stop_words[0].add(String.fromCharCode(i));
  }
  update();
};

const print_top25 = () => {
  sorted_word_frequency[0]
    .slice(0, 25)
    .forEach(({ word, frequency }) => console.log(`${word}  -  ${frequency}`));
};

// Set up an interactive prompt rl for new file names.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 27.2: Interactive. Allow user to give new filename constantly and update the data stored in spreadsheet.
const get_new_file = () => {
  rl.question('Please enter a new file name: ', (file_path) => {
    // Even user input a filename with leading or trailing whitespace, we can handle it.
    load_file(file_path.trim());
    print_top25();
    // read input constantly
    get_new_file();  
  });
};

// Start the program, first time we need an input from command line
load_file(process.argv[2]);
print_top25();
get_new_file();
