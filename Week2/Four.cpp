#include <iostream>
#include <fstream>
#include <cctype>

using namespace std;

int main(int argc, char* argv[]) {
    
    string word_freqs_words[50000];
    int word_freqs_freqs[50000];
    int num_word_freqs = 0;

    string stop_words[1000];
    int num_stop_words = 0;

    ifstream stopword_file("../stop_words.txt");
    string stopword;
    while (getline(stopword_file, stopword, ',')) {
        stop_words[num_stop_words++] = stopword;
    }
    stopword_file.close();

    // add all single character word to stop_words if it's not included in stop_words yet
    for (char c = 'a'; c <= 'z'; c++) {
        string ch(1, c);
        bool found = false;
        for (int i = 0; i < num_stop_words; i++) {
            if (stop_words[i] == ch) {
                found = true;
                break;
            }
        }
        if (!found) {
            stop_words[num_stop_words++] = ch;
        }
    }

    ifstream input_file(argv[1]);
    char c;
    int start_char = -1;
    string word;

    // identify the terms character by character
    while (input_file.get(c)) {        
        if (start_char == -1) {
            if (isalnum(c)) {
                start_char = 0;
                word += tolower(c);
            }                
        } else {
                if (!isalnum(c)) {                                           
                    bool is_stop_word = false;
                    for (int i = 0; i < num_stop_words; i++) {
                        if (word == stop_words[i]) {
                            is_stop_word = true;
                            break;
                        }
                    }

                    if (!is_stop_word && word != "") {
                        bool found = false;
                        int pair_index = 0;
                        for (int i = 0; i < num_word_freqs; i++) {
                            if (word == word_freqs_words[i]) {
                                word_freqs_freqs[i]++;
                                found = true;
                                pair_index = i;
                                break;
                            }
                        }
                        if (!found) {
                            word_freqs_words[num_word_freqs] = word;
                            word_freqs_freqs[num_word_freqs++] = 1;
                        } else if (num_word_freqs > 1) {
                            for (int n = pair_index - 1; n >= 0; n--) {
                                if (word_freqs_freqs[pair_index] > word_freqs_freqs[n]) {
                                    int temp_freq = word_freqs_freqs[n];
                                    string temp_word = word_freqs_words[n];                                    
                                    word_freqs_freqs[n] = word_freqs_freqs[pair_index];
                                    word_freqs_words[n] = word_freqs_words[pair_index];
                                    word_freqs_freqs[pair_index] = temp_freq;
                                    word_freqs_words[pair_index] = temp_word;
                                    pair_index = n;
                                }
                            }
                        }
                    }
                    start_char = -1;
                    word = "";
                } else {
                    word += tolower(c);
                }
        }        
    }
    input_file.close();

    for (int i = 0; i < 25; i++) {
        cout << word_freqs_words[i] << "  -  " << word_freqs_freqs[i] << endl;
    }
    return 0;
}
