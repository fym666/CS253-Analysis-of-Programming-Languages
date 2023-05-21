import java.util.*;
import java.util.stream.*;

// Frequencies module implementation 1: use explicit iteration and a mutable HashMap to calculate
public class Frequencies1 {
    public List<Map.Entry<String, Integer>> top(List<String> words) {
        Map<String, Integer> word_frequency = new HashMap<>();

        for (String word : words) {
            if (word_frequency.containsKey(word)) {
                int counter = word_frequency.get(word);
                word_frequency.put(word, counter + 1);
            } else {
                word_frequency.put(word, 1);
            }
        }
        
        Stream<Map.Entry<String, Integer>> sorted_tf = word_frequency.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed());
        Stream<Map.Entry<String, Integer>> top25_tf = sorted_tf.limit(25);

        return top25_tf.collect(Collectors.toList());
    }
}

