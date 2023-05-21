// Exercise 15.1: implement Hollywood style program in JavaScript
// The structure and some naming of this javascript program is inspired from those in the sample python code tf-15.py, but stil not the same.
const fs = require("fs");
const path = require("path");

class TermFrequencyFramework {
  constructor() {
    this.load_event_handlers = [];
    this.work_event_handlers = [];
    this.end_event_handlers = [];
  }

  register_load_event(handler) {
    this.load_event_handlers.push(handler);
  }

  register_work_event(handler) {
    this.work_event_handlers.push(handler);
  }

  register_end_event(handler) {
    this.end_event_handlers.push(handler);
  }

  run(file_path) {
    this.load_event_handlers.forEach((handler) => handler(file_path));
    this.work_event_handlers.forEach((handler) => handler());
    this.end_event_handlers.forEach((handler) => handler());
  }
}

class DataStorage {
  constructor(termfrequencyAPP, stopwords_filter) {
    this.data = "";
    this.stopwords_filter = stopwords_filter;
    this.word_event_handlers = [];

    termfrequencyAPP.register_load_event(this.load.bind(this));
    termfrequencyAPP.register_work_event(this.produceWords.bind(this));
  }

  load(file_path) {
    this.data = fs.readFileSync(file_path, "utf8");
    this.data = this.data.replace(/[\W_]+/g, " ").toLowerCase();
  }

  produceWords() {
    this.data.split(/\s+/).forEach((word) => {
      if (!this.stopwords_filter.is_stopword(word)) {
        this.word_event_handlers.forEach((handler) => handler(word));
      }
    });
  }

  register_word_event(handler) {
    this.word_event_handlers.push(handler);
  }
}

class StopwordsFilter {
  constructor(termfrequencyAPP) {
    this.stopwords = [];
    termfrequencyAPP.register_load_event(this.load.bind(this));
  }

  load() {
    this.stopwords = new Set(fs.readFileSync(path.resolve('../stop_words.txt'), 'utf8').split(','));
    for (let i = 97; i <= 122; i++) {
        this.stopwords.add(String.fromCharCode(i));
    }
  }

  is_stopword(word) {
    return this.stopwords.has(word);
  }
}

class WordFrequencyCounter {
  constructor(termfrequencyAPP, data_storage) {
    this.word_frequency = {};

    data_storage.register_word_event(this.increase_count.bind(this));
    termfrequencyAPP.register_end_event(this.print_frequency.bind(this));
  }

  increase_count(word) {
    this.word_frequency[word] = (this.word_frequency[word] || 0) + 1;
  }

  print_frequency() {
    const sorted_wordfrequency = Object.entries(this.word_frequency).sort((a, b) => b[1] - a[1]);
    sorted_wordfrequency.slice(0, 25).forEach(([term, frequency]) => console.log(`${term}  -  ${frequency}`));
  }
}

// Exercise 15.2: "Words with z" - Add this new class definition and no additional file read-in.
class zCounter {
    constructor(termfrequencyAPP, data_storage) {
      this.words_with_z = 0;
  
      data_storage.register_word_event(this.increase_z_count.bind(this));
      termfrequencyAPP.register_end_event(this.print_z_count.bind(this));
    }
  
    increase_z_count(word) {
      if (word.includes("z")) {
        this.words_with_z++;
      }
    }
  
    print_z_count() {
      console.log(`\nNumber of non-stop words with letter z  =  ${this.words_with_z}`);
    }
}
  
// main function
const termfrequencyAPP = new TermFrequencyFramework();
const stopwords_filter = new StopwordsFilter(termfrequencyAPP);
const data_storage = new DataStorage(termfrequencyAPP, stopwords_filter);
const wordFreqCounter = new WordFrequencyCounter(termfrequencyAPP, data_storage);
const wordsWithZCounter = new zCounter(termfrequencyAPP, data_storage); // Exercise 15.2: "Words with z" - Add this new line in main function
termfrequencyAPP.run(process.argv[2]);
