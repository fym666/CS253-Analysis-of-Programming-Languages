import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// Words module implementation 2: use matcher to form the words string
public class Words2 {
    public List<String> scan(String file_path) throws IOException {
        String input_text = new String(Files.readAllBytes(Paths.get(file_path)));
        List<String> words = new ArrayList<>();
        Matcher m = Pattern.compile("[a-z]{2,}").matcher(input_text.toLowerCase());
        while (m.find()) {
            words.add(m.group());
        }
        
        // If your stop words file is not in the parent of the parent of current directory, then you need to change the file path in next line.
        String stopwords_text = new String(Files.readAllBytes(Paths.get("../../stop_words.txt")));
        List<String> stop_words = Arrays.asList(stopwords_text.split(","));
        words.removeAll(stop_words);
        return words;
    }
}
