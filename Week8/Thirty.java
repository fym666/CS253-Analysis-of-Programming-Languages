// The structures and some namings of this program are inspired from those in the sample python code tf-30.py
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;

public class Thirty {
    private static final ConcurrentLinkedQueue<String> word_space = new ConcurrentLinkedQueue<>();
    private static final ConcurrentLinkedQueue<Map<String, Integer>> freq_space = new ConcurrentLinkedQueue<>();
    
    private static final List<String> stopwords = new ArrayList<>();

    // worker class
    static class process_words implements Runnable {
        public void run() {
            Map<String, Integer> word_frequency = new HashMap<>();
            String word;
            while ((word = word_space.poll()) != null) {
                if (!stopwords.contains(word)) {
                    if (word_frequency.containsKey(word)) {
                        word_frequency.put(word, word_frequency.get(word) + 1);
                    } else {
                        word_frequency.put(word, 1);
                    }
                }
            }
            freq_space.add(word_frequency);
        }
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        stopwords.addAll(Arrays.asList(new String(Files.readAllBytes(Paths.get("../stop_words.txt"))).split(",")));
        stopwords.addAll(Arrays.asList("abcdefghijklmnopqrstuvwxyz".split("")));

        String text = new String(Files.readAllBytes(Paths.get(args[0])));
        List<String> words = Arrays.asList(text.replaceAll("[\\W_]+", " ").toLowerCase().split("\\s+"));
        word_space.addAll(words);

        // Create the workers and launch them
        Thread[] workers = new Thread[6];
        for (int i = 0; i < 6; i++) {
            workers[i] = new Thread(new process_words());
            workers[i].start();
        }

        // Wait for finish
        for (Thread worker : workers) {
            worker.join();
        }

        // Merge results
        Map<String, Integer> wfs = new HashMap<>();
        Map<String, Integer> freqs;
        while ((freqs = freq_space.poll()) != null) {
            for (Map.Entry<String, Integer> entry : freqs.entrySet()) {
                String word = entry.getKey();
                if (wfs.containsKey(word)) {
                    wfs.put(word, wfs.get(word) + entry.getValue());
                } else {
                    wfs.put(word, entry.getValue());
                }
            }
        }

        List<Map.Entry<String, Integer>> sorted_wfs = new ArrayList<>(wfs.entrySet());
        sorted_wfs.sort(Map.Entry.comparingByValue(Comparator.reverseOrder()));

        for (int i = 0; i < 25; i++) {
            Map.Entry<String, Integer> entry = sorted_wfs.get(i);
            System.out.println(entry.getKey() + "  -  " + entry.getValue());
        }
    }
}
