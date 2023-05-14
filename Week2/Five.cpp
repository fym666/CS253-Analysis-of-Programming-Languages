#include <iostream>
#include <fstream>
#include <sstream>
#include <cctype>
#include <vector>
#include <algorithm>

using namespace std;

// The shared mutable data
string input_data;
vector<string> words;
vector<pair<string, int>> word_freqs;

void read_file(const string &path_to_file) {
    ifstream file(path_to_file);
    string line;
    while (getline(file, line)) {
        input_data += line + ' ';
    }
}

void filter_chars_and_normalize() {
    for (auto &c : input_data) { c = isalnum(c) ? tolower(c) : ' '; }
}

void scan() {
    istringstream iss(input_data);
    string word;
    while (iss >> word) {
        if (word.size() > 1) {
            words.push_back(word);
        }
    }
}

void remove_stop_words() {
    ifstream file("../stop_words.txt");
    string stop_word;
    while (getline(file, stop_word, ',')) {
        words.erase(remove_if(words.begin(), words.end(),
                              [&stop_word](const string &word) {
                                  return word == stop_word || word.size() < 2;
                              }),
                    words.end());
    }
}

void frequencies() {
    for (const string &w : words) {
        auto it = find_if(word_freqs.begin(), word_freqs.end(),
                          [&w](const pair<string, int> &pair) {
                              return pair.first == w;
                          });
        if (it != word_freqs.end()) {
            it->second++;
        } else {
            word_freqs.push_back(make_pair(w, 1));
        }
    }
}

void sort_word_freqs() {
    sort(word_freqs.begin(), word_freqs.end(),
         [](const pair<string, int> &a, const pair<string, int> &b) {
             return a.second > b.second;
         });
}

int main(int argc, char *argv[]) {

    read_file(argv[1]);
    filter_chars_and_normalize();
    scan();
    remove_stop_words();
    frequencies();
    sort_word_freqs();

    for (int i = 0; i < 25; i++) {
        cout << word_freqs[i].first << "  -  " << word_freqs[i].second << endl;
    }

    return 0;
}
