#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <unordered_set>
#include <algorithm>
#include <cctype>
int main(int argc, char *argv[]) {
    std::unordered_set<std::string> stops;
    std::ifstream stopwordFile("../stop_words.txt");
    for (std::string word; std::getline(stopwordFile, word, ',');) { stops.insert(word); }
    std::vector<std::pair<std::string, int>> wordFreq;
    std::ifstream inputFile(argv[1]);
    for (std::string line; std::getline(inputFile, line);) { std::transform(line.begin(), line.end(), line.begin(), [](char c){ return std::isalpha(c) ? std::tolower(c) : ' '; });
        std::stringstream ss(line);
        for (std::string word; ss >> word;) {
            if (word.size() > 1 && stops.count(word) == 0) { auto it = std::find_if(wordFreq.begin(), wordFreq.end(), [&](const auto& p){ return p.first == word; });
                if (it != wordFreq.end()) { ++it->second; } else { wordFreq.emplace_back(word, 1);}}}}
    std::sort(wordFreq.begin(), wordFreq.end(), [](const auto& a, const auto& b) { return a.second > b.second; });
    for (int i = 0; i < 25; i++) { std::cout << wordFreq[i].first << "  -  " << wordFreq[i].second << std::endl; }}