// The structures and some namings of this program are inspired from those in the sample python code tf-32.py
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

public class ThirtyTwo {
    
    static class Pair<K, V> {
        private final K key;
        private final V value;
        public Pair(K key, V value) {
            this.key = key;
            this.value = value;
        }
        public K getKey() {
            return key;
        }
        public V getValue() {
            return value;
        }
    }

    static List<String> stop_words;
    static {
        try {
            stop_words = new ArrayList<>(Arrays.asList(new String(Files.readAllBytes(Paths.get("../stop_words.txt"))).split(",")));
            stop_words.addAll(Arrays.asList("abcdefghijklmnopqrstuvwxyz".split("")));
        } catch (IOException e) {
            System.out.println("Error reading stop words file. Error message: " + e.getMessage());
        }
    }

    public static List<String> partition(String dataStr, int nLines) {
        List<String> lines = Arrays.asList(dataStr.split("\n"));
        List<String> chunks = new ArrayList<>();

        for (int i = 0; i < lines.size(); i += nLines) {
            chunks.add(String.join("\n", lines.subList(i, Math.min(i + nLines, lines.size()))));
        }
        return chunks;
    }

    public static List<Pair<String, Integer>> split_words(String dataStr) {
        List<Pair<String, Integer>> result = new ArrayList<>();
        String[] words = dataStr.replaceAll("[\\W_]+", " ").toLowerCase().split("\\s+");

        for (String word : words) {
            if (!stop_words.contains(word)) {
                result.add(new Pair<>(word, 1));
            }
        }
        return result;
    }

    public static Map<String, List<Pair<String, Integer>>> regroup(List<List<Pair<String, Integer>>> pairs_list) {
        Map<String, List<Pair<String, Integer>>> mapping = new HashMap<>();
        for (List<Pair<String, Integer>> pairs : pairs_list) {
            for (Pair<String, Integer> pair : pairs) {
                String group = get_group(pair.getKey());
                mapping.computeIfAbsent(group, k -> new ArrayList<>()).add(pair);
            }
        }
        return mapping;
    }

    // Exercise 32.3
    static String[] groups = {"[a-e].*", "[f-j].*", "[k-o].*", "[p-t].*", "[u-z].*"};

    private static String get_group(String word) {
        if (word.isEmpty()) {
            return "other";
        }
    
        char firstLetter = word.charAt(0);
        for (String group : groups) {
            if (String.valueOf(firstLetter).matches(group)) {
                return group;
            }
        }
        return "other";
    }

    // Second map reduce
    public static List<Pair<String, Integer>> count_words(Map<String, List<Pair<String, Integer>>> group) {
        Map<String, Integer> word_counts = new HashMap<>();
        for (List<Pair<String, Integer>> pairs : group.values()) {
            for (Pair<String, Integer> pair : pairs) {
                word_counts.put(pair.getKey(), word_counts.getOrDefault(pair.getKey(), 0) + pair.getValue());
            }
        }
        return word_counts.entrySet().stream()
                .map(entry -> new Pair<>(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    public static String read_file(String pathToFile) throws IOException {
        return new String(Files.readAllBytes(Paths.get(pathToFile)));
    }

    public static List<Pair<String, Integer>> sort(List<Pair<String, Integer>> word_freqs) {
        return word_freqs.stream()
                .sorted((pair1, pair2) -> pair2.getValue().compareTo(pair1.getValue()))
                .collect(Collectors.toList());
    }

    public static void main(String[] args) throws IOException {
            List<String> splits = partition(read_file(args[0]), 500);
            // First map reduce
            List<List<Pair<String, Integer>>> split_list = splits.stream()
                .map(ThirtyTwo::split_words)
                .collect(Collectors.toList());

            Map<String, List<Pair<String, Integer>>> splits_per_word = regroup(split_list);
            List<Pair<String, Integer>> word_frequency = sort(count_words(splits_per_word));

            for (int i = 0; i < 25; i++) {
                System.out.println(word_frequency.get(i).getKey() + "  -  " + word_frequency.get(i).getValue());
            }
    }
}
