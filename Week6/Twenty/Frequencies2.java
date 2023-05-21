import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

// Frequencies module implementation 2: use collectors instead of if-else statment to calculate
public class Frequencies2 {
    public List<Map.Entry<String, Integer>> top(List<String> words) {
        Map<String, Long> word_frequency = words.stream()
                .collect(Collectors.groupingBy(w -> w, Collectors.counting()));
        
        Stream<Map.Entry<String, Long>> sorted_tf = word_frequency.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed());       
        Stream<Map.Entry<String, Long>> top25_tf = sorted_tf.limit(25);  
        List<Map.Entry<String, Integer>> top25 = top25_tf
          .map(e -> Map.entry(e.getKey(), e.getValue().intValue()))
          .collect(Collectors.toList());
        
        return top25;
    }
}
