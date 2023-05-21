import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

// Words module implementation 1: use scanner to scan the words
public class Words1 {
    public List<String> scan(String pathToFile) throws IOException {
        List<String> words = new ArrayList<>();
        
        try (Scanner scanner = new Scanner(new File(pathToFile), "UTF-8")) {
            scanner.useDelimiter("[\\W_]+");
            while (scanner.hasNext()) {
                words.add(scanner.next().toLowerCase());
            }
        }
        // If your stop words file is not in the parent of the parent of current directory, then you need to change the file path in next line.
        List<String> stop_words = new ArrayList<>(Arrays.asList(Files.readString(Paths.get("../../stop_words.txt")).split(",")));
        stop_words.addAll(Arrays.asList("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"));

        return words.stream().filter(word -> !stop_words.contains(word)).collect(Collectors.toList());
    }
}
