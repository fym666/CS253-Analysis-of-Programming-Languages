// The structure and some naming of this javascript program is inspired from those in the sample python code tf-12.py, but stil not the same.
const fs = require('fs');
const path = require('path');

class InputwordsManager {
  constructor() {
    this._data = '';
  }

  dispatch(message) {
    if (message[0] === 'init') {
      return this._init(message[1]);
    } else if (message[0] === 'words') {
      return this._words();
    } else {
      throw new Error("Message not understood " + message[0]);
    }
  }

  _init(file_path) {
    this._data = fs.readFileSync(file_path, 'utf8');
    this._data = this._data.replace(/[\W_]+/g, ' ').toLowerCase();
  }

  _words() {
    return this._data.split(/\s+/);
  }
}

class StopwordsManager {
  constructor() {
    this._stopwords = [];
  }

  dispatch(message) {
    if (message[0] === 'init') {
      return this._init();
    } else if (message[0] === 'is_stopword') {
      return this._is_stopword(message[1]);
    } else {
      throw new Error("Message not understood " + message[0]);
    }
  }

  _init() {
    this._stopwords = new Set(fs.readFileSync(path.resolve('../stop_words.txt'), 'utf8').split(','));
    for (let i = 97; i <= 122; i++) {
        this._stopwords.add(String.fromCharCode(i));
    }
  }

  _is_stopword(word) {
    return this._stopwords.has(word);
  }
}

class TermfrequencyManager {
  constructor() {
    this._term_frequency = {};
  }

  dispatch(message) {
    if (message[0] === 'increase') {
      return this._increase(message[1]);
    } else if (message[0] === 'sorted') {
      return this._sorted();
    } else {
      throw new Error("Message not understood " + message[0]);
    }
  }

  _increase(word) {
    if (this._term_frequency[word]) {
      this._term_frequency[word]++;
    } else {
      this._term_frequency[word] = 1;
    }
  }

  _sorted() {
    return Object.entries(this._term_frequency).sort((a, b) => b[1] - a[1]);
  }
}

class TermfrequencyController {
  dispatch(message) {
    if (message[0] === 'init') {
      return this._init(message[1]);
    } else if (message[0] === 'run') {
      return this._run();
    } else {
      throw new Error("Message not understood " + message[0]);
    }
  }

  _init(file_path) {    
    this._inputwords_manager = new InputwordsManager();
    this._stopwords_manager = new StopwordsManager();
    this._termfreqs_manager = new TermfrequencyManager();
    this._inputwords_manager.dispatch(['init', file_path]);
    this._stopwords_manager.dispatch(['init']);
  }

  _run() {
    for (let w of this._inputwords_manager.dispatch(['words'])) {
      if (!this._stopwords_manager.dispatch(['is_stopword', w])) {
        this._termfreqs_manager.dispatch(['increase', w]);
      }
    }

    let term_frequency = this._termfreqs_manager.dispatch(['sorted']);
    term_frequency.slice(0, 25).forEach(([term, frequency]) => console.log(`${term}  -  ${frequency}`));
  }
}

const termfreqs_controller = new TermfrequencyController();
termfreqs_controller.dispatch(['init', process.argv[2]]);
termfreqs_controller.dispatch(['run']);
