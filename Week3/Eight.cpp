#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <unordered_set>
#include <algorithm>
#include <cctype>

using namespace std;

// Merges two vectors of pairs, sorted in descending order by the second element of each pair.
vector<pair<string, int>> merge(const vector<pair<string, int>>& left, const vector<pair<string, int>>& right) {
    vector<pair<string, int>> sortedResult;
    vector<pair<string, int>>::const_iterator leftIter = left.begin();
    vector<pair<string, int>>::const_iterator rightIter = right.begin();

    while (leftIter != left.end() && rightIter != right.end()) {
        if (leftIter->second > rightIter->second) {
            sortedResult.push_back(*leftIter);
            leftIter++;
        } else {
            sortedResult.push_back(*rightIter);
            rightIter++;
        }
    }

    sortedResult.insert(sortedResult.end(), leftIter, left.end());
    sortedResult.insert(sortedResult.end(), rightIter, right.end());

    return sortedResult;
}

// Recursive merge sort on a vector of pairs, sorting the pairs in descending order by the second element of each pair.
vector<pair<string, int>> recursive_merge_sort(const vector<pair<string, int>>& input) {
    if (input.size() <= 1) {
        return input;
    }

    unsigned int mid = input.size() / 2;
    vector<pair<string, int>> left(input.begin(), input.begin() + mid);
    vector<pair<string, int>> right(input.begin() + mid, input.end());

    left = recursive_merge_sort(left);
    right = recursive_merge_sort(right);

    return merge(left, right);
}

// This part is copied from the Seven.cpp which is my last week's work only with sort function modified.
int main(int argc, char *argv[]) {
    unordered_set<string> stops;
    ifstream stopwordFile("../stop_words.txt");
    for (string word; getline(stopwordFile, word, ',');) { stops.insert(word); }
    vector<pair<string, int>> wordFreq;
    ifstream inputFile(argv[1]);
    for (string line; getline(inputFile, line);) { transform(line.begin(), line.end(), line.begin(), [](char c){ return isalpha(c) ? tolower(c) : ' '; });
        stringstream ss(line);
        for (string word; ss >> word;) {
            if (word.size() > 1 && stops.count(word) == 0) { auto it = find_if(wordFreq.begin(), wordFreq.end(), [&](const auto& p){ return p.first == word; });
                if (it != wordFreq.end()) { ++it->second; } else { wordFreq.emplace_back(word, 1);}}}}
    
    // Use my own hand-written recursive sort function (using merge sort algorithm) to replace orginal sort function in libraries.
    wordFreq = recursive_merge_sort(wordFreq);

    for (int i = 0; i < 25; i++) { cout << wordFreq[i].first << "  -  " << wordFreq[i].second << endl; }}
