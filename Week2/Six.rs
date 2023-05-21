use std::collections::HashMap;
use std::env;
use std::fs::File;
use std::io::{BufReader, Read};

fn read_file_contents(path: &str) -> String {
    let file = File::open(path).unwrap();
    let mut reader = BufReader::new(file);
    let mut contents = String::new();
    reader.read_to_string(&mut contents).unwrap();
    contents
}

fn normalize_text(text: &str) -> String {
    text.chars()
        .map(|c| if c.is_ascii_alphanumeric() { c.to_ascii_lowercase() } else { ' ' })
        .collect()
}

fn extract_words(text: &str) -> Vec<String> {
    text.split_whitespace().map(|s| s.to_string()).collect()
}

fn remove_stop_words(words: Vec<String>) -> Vec<String> {
    let stop_words: Vec<String> = {
        let mut stop_words_file = File::open("../stop_words.txt").unwrap();
        let mut contents = String::new();
        stop_words_file.read_to_string(&mut contents).unwrap();
        contents.split(',').map(|s| s.to_string()).collect()
    };
    let mut filtered_words = vec![];
    for word in words {
        if !stop_words.contains(&word) && word.len() > 1 {
            filtered_words.push(word);
        }
    }
    filtered_words
}

fn count_word_frequencies(words: Vec<String>) -> HashMap<String, i32> {
    let mut freqs = HashMap::new();
    for word in words {
        *freqs.entry(word).or_insert(0) += 1;
    }
    freqs
}

fn sort_word_frequencies(word_freqs: HashMap<String, i32>) -> Vec<(String, i32)> {
    let mut sorted_freqs: Vec<(String, i32)> = word_freqs.into_iter().collect();
    sorted_freqs.sort_by(|a, b| b.1.cmp(&a.1));
    sorted_freqs
}

fn main() {
    let path_to_file = env::args().nth(1).unwrap();
    let word_freqs = sort_word_frequencies(count_word_frequencies(remove_stop_words(extract_words(&normalize_text(&read_file_contents(&path_to_file))))));
    for (word, freq) in word_freqs.iter().take(25) {
        println!("{}  -  {}", word, freq);
    }
}
