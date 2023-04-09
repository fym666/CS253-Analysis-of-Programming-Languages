#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <map>
#include <vector>

using namespace std;

// define the filname that contains the stop words and the value of top N
const string stopword_file = "../stop_words.txt";
const int top = 25;

// function: input a word, return whether this word is in the list of stopwords
bool is_stopword(const string &word) {

    static map<string, bool> stopwords;
    static int ini = 0;

    // at first time of operation, need to read and store the list of stopwords
    if (ini<1) {

        ini++;
        ifstream ifs(stopword_file);
        string line;

        // debug session
        if (!ifs.is_open()) {
            printf("Fail to open stop words file!\n");
            exit(1);
        }
        while (getline(ifs, line)) {
            stringstream ss(line);
            string stopword;
            while (getline(ss, stopword, ',')) {
                stopwords[stopword] = true;
            }
        }        
    }
    return stopwords[word];
}

int main(int argc, char* argv[]) {

    string input_file = argv[1];
    ifstream ifs(input_file);

    // debug session
    if (!ifs.is_open()) {
        printf("Fail to open input text file!\n");
        exit(1);
    }

    map<string, int> wordfreq_map;
    string line, word;

    while (getline(ifs, line)) {
        //normalize for capitalization
        for (auto &c : line) {
          c = tolower(c);
        }
        //remove non-alphabetic characters
        for (char &c : line) {
            if (!isalpha(c)) {
                c = ' ';
            }
        }

        stringstream ss(line);
        while (ss >> word) {
            // filter out the single-character word and the stop words adn then count the term frequency
            if (word.length()!=1 && !is_stopword(word)) {
                wordfreq_map[word]++;
            }
        }
    }
    // Convert the map to a vector of pairs for easier sorting
    vector<pair<string, int>> wordfreq_vec(wordfreq_map.begin(), wordfreq_map.end());

    // sort the word with frequency
    for (int i = 0; i < wordfreq_vec.size() - 1; i++) {
        for (int j = i + 1; j < wordfreq_vec.size(); j++) {
            if (wordfreq_vec[i].second < wordfreq_vec[j].second) {
                swap(wordfreq_vec[i], wordfreq_vec[j]);
            }
        }
    }

    // print the top N terms with frequencies
    int counter = 0;
    for (const auto &pair : wordfreq_vec) {
        printf("%s  -  %d\n", pair.first.c_str(), pair.second);
        counter++;
        if (counter == top) {
            break;
        }
    }

    return 0;
}
