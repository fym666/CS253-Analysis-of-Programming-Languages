// 28.1 Lazy Rivers implemented in JavaScript. Structures are inspired from those in sample program tf-28.py.
const fs = require('fs');

// exercise 28.2: First, lines generator
function* lines(file_path) {
    const data = fs.readFileSync(file_path, 'utf-8');
    const lines = data.split('\n');
    for (const line of lines) {
        yield line;
    }
}

// exercise 28.2: Second, words generator
function* words(file_path) {
    for (const line of lines(file_path)) {
        let words = line.replace(/[\W_]+/g, ' ').split(/\s+/);
        for (const word of words) {
            if (word !== '') {
                yield word.toLowerCase();
            }
        }
    }
}

function* non_stop_words(file_path) {
    const stop_words = new Set(fs.readFileSync('../stop_words.txt', 'utf8').split(','));
    for (let i = 97; i <= 122; i++) {
        stop_words.add(String.fromCharCode(i));
    }

    for (const word of words(file_path)) {
        if (!stop_words.has(word)) {
            yield word;
        }
    }
}

function* count_sort(file_path) {
    const word_frequency = {};
    let i = 1;
    for (const word of non_stop_words(file_path)) {
        word_frequency[word] = (word_frequency[word] || 0) + 1;
        if (i % 5000 === 0) {
            yield Array.from(Object.entries(word_frequency)).sort((a, b) => b[1] - a[1]);
        }
        i++;
    }
    yield Array.from(Object.entries(word_frequency)).sort((a, b) => b[1] - a[1]);
}

// Main function
(function main() {
    for (const word_frequency of count_sort(process.argv[2])) {
        console.log('-----------------------------');
        for (const [word, frequency] of word_frequency.slice(0, 25)) {
            console.log(`${word}  -  ${frequency}`);
        }
    }
})();
