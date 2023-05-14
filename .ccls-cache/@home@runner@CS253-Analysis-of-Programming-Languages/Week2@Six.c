#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>

#define MAX_WORD_LEN 20
#define MAX_STOP_WORDS 120

typedef struct {
    char* word;
    int freq;
} Freq;

// Helper functions

int tospace(int c)
{
    if (!isalpha(c))
        return ' ';
    else
        return c;
}

char** get_stop_words()
{
    char** stop_words = (char**) malloc(MAX_STOP_WORDS * sizeof(char*));
    char* word;
    int i = 0;

    FILE* fp = fopen("../stop_words.txt", "r");
    if (fp == NULL) {
        printf("Error opening stop_words.txt\n");
        exit(1);
    }

    char ch;
    while ((ch = fgetc(fp)) != EOF) {
        if (ch == ',') {
            word[strlen(word)-1] = '\0';
            stop_words[i] = word;
            i++;
            word = (char*) malloc(MAX_WORD_LEN * sizeof(char));
            continue;
        }
        if (isalpha(ch)) {
            ch = tolower(ch);
            strncat(word, &ch, 1);
        }
    }
    fclose(fp);

    for (ch = 'a'; ch <= 'z'; ch++) {
        word = (char*) malloc(MAX_WORD_LEN * sizeof(char));
        sprintf(word, "%c", ch);
        stop_words[i] = word;
        i++;
    }

    return stop_words;
}

int sort_by_freq(const void* x, const void* y)
{
    Freq* xf = (Freq*) x;
    Freq* yf = (Freq*) y;

    if (xf->freq == yf->freq) {
        return strcmp(xf->word, yf->word);
    }
    else {
        return yf->freq - xf->freq;
    }
}

// Pipeline functions

char* read_file(const char* path_to_file)
{
    FILE* fp = fopen(path_to_file, "r");
    if (fp == NULL) {
        printf("Error opening %s\n", path_to_file);
        exit(1);
    }

    fseek(fp, 0, SEEK_END);
    long fsize = ftell(fp);
    fseek(fp, 0, SEEK_SET);

    char* data = (char*) malloc((fsize + 1) * sizeof(char));
    if (fread(data, fsize, 1, fp) != 1) {
        printf("Error reading %s\n", path_to_file);
        exit(1);
    }
    fclose(fp);

    data[fsize] = '\0';
    return data;
}
-

char* filter_chars(char* str_data)
{
    for (int i = 0; i < strlen(str_data); i++) {
        str_data[i] = tospace(str_data[i]);
    }
    return str_data;
}

char* normalize(char* str_data)
{
    for (int i = 0; i < strlen(str_data); i++) {
        str_data[i] = tolower(str_data[i]);
    }
    return str_data;
}

char** scan(char* str_data)
{
    char** words = (char**) malloc(MAX_WORD_LEN * sizeof(char*));
    char* word = (char*) malloc(MAX_WORD_LEN * sizeof(char));
    int i = 0;

    char* token = strtok(str_data, " ");
    while (token != NULL) {
        strcpy(word, token);
        words[i] = word;
        i++;
        word = (char*) malloc(MAX_WORD_LEN * sizeof(char));
        token = strtok(NULL, " ");
    }

    words = (char**) realloc(words, i * sizeof(char*));
    words[i] = NULL;

    return words;
}

char** remove_stop_words(char** words, int n_words)
{
    char** stop_words = get_stop_words();
    int n_stop_words = MAX_STOP_WORDS;

    char** filtered_list = (char**) malloc(n_words * sizeof(char*));
    int n_filtered_words = 0;

    for (int i = 0; i < n_words; i++) {
        char* word = words[i];
        int is_stop_word = 0;
        for (int j = 0; j < n_stop_words; j++) {
            if (strcmp(word, stop_words[j]) == 0) {
                is_stop_word = 1;
                break;
            }
        }
        if (!is_stop_word) {
            filtered_list[n_filtered_words] = word;
            n_filtered_words++;
        }
    }

    free(stop_words);
    return filtered_list;
}

Freq* frequencies(char** words, int n_words)
{
    Freq* freqs = (Freq*) malloc(n_words * sizeof(Freq));
    int n_freqs = 0;

    for (int i = 0; i < n_words; i++) {
        char* word = words[i];
        int found = 0;
        for (int j = 0; j < n_freqs; j++) {
            Freq* freq = &freqs[j];
            if (strcmp(word, freq->word) == 0) {
                freq->freq++;
                found = 1;
                break;
            }
        }
        if (!found) {
            Freq* freq = &freqs[n_freqs];
            freq->word = word;
            freq->freq = 1;
            n_freqs++;
        }
    }

    freqs = (Freq*) realloc(freqs, n_freqs * sizeof(Freq));
    return freqs;
}

void print_freqs(Freq* freqs, int n)
{
    for (int i = 0; i < n; i++) {
        printf("%s - %d\n", freqs[i].word, freqs[i].freq);
    }
}

int main(int argc, char* argv[])
{
    char* data = read_file(argv[1]);
    char* filtered_data = filter_chars(data);
    char* normalized_data = normalize(filtered_data);

    char** words = scan(normalized_data);
    int n_words = 0;
    while (words[n_words] != NULL) {
        n_words++;
    }

    char** filtered_words = remove_stop_words(words, n_words);
    Freq* freqs = frequencies(filtered_words, n_words);

    qsort(freqs, n_words, sizeof(Freq), sort_by_freq);
    print_freqs(freqs, 25);

    free(data);
    free(filtered_data);
    free(normalized_data);
    free(words);
    free(filtered_words);
    free(freqs);

    return 0;
}
