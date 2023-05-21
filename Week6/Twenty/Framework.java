import java.io.*;
import java.util.*;
import java.util.stream.Collectors;
import java.lang.reflect.Method;
import java.util.stream.Stream;

@SuppressWarnings("unchecked") // Avoid the unnecessary warning message when compiling
// Framework for executing the apps
public class Framework {
    private static final String config_file = "config.properties";

    public static void main(String[] args) throws Exception {
        Properties config = new Properties();
        config.load(new FileInputStream(config_file));

        // Load modules according to the configuration settings
        String words_string = config.getProperty("words");
        String frequencies_string = config.getProperty("frequencies");

        Class<?> words_class = Class.forName(words_string);
        Object words_object = words_class.getDeclaredConstructor().newInstance();
        Method words_method = words_class.getMethod("scan", String.class);

        Class<?> frequencies_class = Class.forName(frequencies_string);
        Object frequencies_object = frequencies_class.getDeclaredConstructor().newInstance();
        Method frequencies_method = frequencies_class.getMethod("top", List.class);

        List<String> words = (List<String>) words_method.invoke(words_object, args[0]);
        List<Map.Entry<String, Integer>> word_frequency = (List<Map.Entry<String, Integer>>) frequencies_method.invoke(frequencies_object, words);

        for (Map.Entry<String, Integer> entry : word_frequency) {
            System.out.println(entry.getKey() + "  -  " + entry.getValue());
        }
    }
}
