#include <ctype.h>
#include <regex.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_STOP_WORDS 1000

char *read_file(char *path_to_file) {
  FILE *f = fopen(path_to_file, "r");
  if (f == NULL) {
    fprintf(stderr, "Error: failed to open file '%s'\n", path_to_file);
    exit(1);
  }
  fseek(f, 0, SEEK_END);
  long fsize = ftell(f);
  fseek(f, 0, SEEK_SET);
  char *data = (char *)malloc(fsize + 1);
  fread(data, fsize, 1, f);
  fclose(f);
  data[fsize] = '\0';
  return data;
}

char *filter_chars(char *str_data) {
  regex_t regex;
  int ret;
  char *result;
  const char *pattern = "[^a-zA-Z0-9]+";
  ret = regcomp(&regex, pattern, REG_EXTENDED);
  if (ret != 0) {
    fprintf(stderr, "Error: failed to compile regex pattern\n");
    exit(1);
  }
  size_t nmatch = 1;
  regmatch_t *pmatch = (regmatch_t *)malloc(nmatch * sizeof(regmatch_t));
  size_t len = strlen(str_data);
  result = (char *)malloc((len + 1) * sizeof(char));
  size_t result_pos = 0;
  for (size_t i = 0; i < len; i++) {
    ret = regexec(&regex, &str_data[i], nmatch, pmatch, 0);
    if (ret == 0) {
      result[result_pos++] = ' ';
      i += pmatch[0].rm_eo - 1;
    } else if (ret == REG_NOMATCH) {
      result[result_pos++] = str_data[i];
    } else {
      fprintf(stderr, "Error: failed to execute regex pattern\n");
      exit(1);
    }
  }
  result[result_pos] = '\0';
  free(pmatch);
  regfree(&regex);
  return result;
}

char *normalize(char *str_data) {
  size_t len = strlen(str_data);
  char *result = (char *)malloc((len + 1) * sizeof(char));
  for (size_t i = 0; i < len; i++) {
    result[i] = tolower(str_data[i]);
  }
  result[len] = '\0';
  return result;
}

char **scan(char *str_data, int *num_words) {
  char **result;
  char *word;
  int count = 0;
  char *delim = " \t\n";
  word = strtok(str_data, delim);
  while (word != NULL) {
    count++;
    word = strtok(NULL, delim);
  }
  *num_words = count;
  result = (char **)malloc(count * sizeof(char *));
  word = strtok(str_data, delim);
  count = 0;
  while (word != NULL) {
    result[count] = word;
    count++;
    word = strtok(NULL, delim);
  }
  return result;
}

char **read_stop_words(char *path_to_file, int *num_stop_words) {
  FILE *file = fopen(path_to_file, "r");
  if (!file) {
    printf("Error: unable to open file '%s'\n", path_to_file);
    return NULL;
  }
  char **stop_words = (char **)malloc(MAX_STOP_WORDS * sizeof(char *));
  char line[1024];
  int i = 0;
  while (fgets(line, 1024, file)) {
    // remove newline character
    line[strcspn(line, "\n")] = '\0';
    stop_words[i] = strdup(line);
    i++;
  }
  *num_stop_words = i;
  fclose(file);
  return stop_words;
}

char **remove_stop_words(char **word_list, int num_words, char **stop_words,
                         int num_stop_words, int *num_filtered_words) {
  char **filtered_words = (char **)malloc(num_words * sizeof(char *));
  int count = 0;
  for (int i = 0; i < num_words; i++) {
    int is_stop_word = 0;
    for (int j = 0; j < num_stop_words; j++) {
      if (strcmp(word_list[i], stop_words[j]) == 0) {
        is_stop_word = 1;
        break;
      }
    }
    if (!is_stop_word) {
      filtered_words[count] = word_list[i];
      count++;
    }
  }
  *num_filtered_words = count;
  return filtered_words;
}

#define MAX_WORD_LENGTH 100

typedef struct word_freq {
  char word[MAX_WORD_LENGTH];
  int freq;
  struct word_freq *next;
} word_freq;

int compare_word_freq(const void *a, const void *b) {
  word_freq *wf_a = (word_freq *)a;
  word_freq *wf_b = (word_freq *)b;
  return wf_b->freq - wf_a->freq;
}

int main() {
  // Open input file for reading
  FILE *original_file = fopen("../pride-and-prejudice.txt", "r");

  // Allocate memory for linked list head
  word_freq *head = (word_freq *)malloc(sizeof(word_freq));
  head->freq = 0;
  head->next = NULL;

  // Read input file word by word and count frequency
  char word[MAX_WORD_LENGTH];
  while (fscanf(input_file, "%s", word) != EOF) {
    // Convert word to lowercase
    for (int i = 0; i < strlen(word); i++) {
      word[i] = tolower(word[i]);
    }

    // Traverse linked list to find word
    word_freq *curr = head;
    while (curr->next != NULL && strcmp(curr->next->word, word) < 0) {
      curr = curr->next;
    }

    // If word already exists, increment frequency
    if (curr->next != NULL && strcmp(curr->next->word, word) == 0) {
      curr->next->freq++;
    }
    // If word does not exist, add new node to linked list
    else {
      word_freq *new_node = (word_freq *)malloc(sizeof(word_freq));
      strcpy(new_node->word, word);
      new_node->freq = 1;
      new_node->next = curr->next;
      curr->next = new_node;
    }
  }

  // Sort linked list by frequency
  word_freq *wf_arr[1000];
  int num_words = 0;
  word_freq *curr = head->next;
  while (curr != NULL) {
    wf_arr[num_words] = curr;
    curr = curr->next;
    num_words++;
  }
  qsort(wf_arr, num_words, sizeof(word_freq *), compare_word_freq);

  // Output 25 most frequently used words
  for (int i = 0; i < 25 && i < num_words; i++) {
    printf("%s - %d\n", wf_arr[i]->word, wf_arr[i]->freq);
  }

  // Free memory and close file
  curr = head->next;
  while (curr != NULL) {
    word_freq *temp = curr;
    curr = curr->next;
    free(temp);
  }
  free(head);
  fclose(input_file);

  return 0;
}
