// The structure and some naming of this javascript program is inspired from those in the sample python code tf-11.py
import java.io.*;
import java.lang.reflect.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

abstract class TF {
    public String getInfo() {
        return this.getClass().getName();
    }
}

class DataStorageManager extends TF {
    private List<String> words;

    public DataStorageManager(String file_path) throws IOException {
        this.words = new ArrayList<>();
        Scanner f = new Scanner(new File(file_path), "UTF-8");
        try {
            f.useDelimiter("[\\W_]+");
            while (f.hasNext()) {
                this.words.add(f.next().toLowerCase());
            }
        } finally {
            f.close();
        }
    }

    public List<String> words() {
        return this.words;
    }

    public String info() {
      return this.getClass().getSimpleName() + ": My major data structure is a " + this.words.getClass().getSimpleName();
    }

}

class StopWordManager extends TF {
    private Set<String> stop_words;

    public StopWordManager(String file_path_stopwords) throws IOException {
        this.stop_words = new HashSet<>();
        this.stop_words.addAll(Arrays.asList(new String(Files.readAllBytes(Paths.get(file_path_stopwords))).split(",")));
        this.stop_words.addAll(Arrays.stream("abcdefghijklmnopqrstuvwxyz".split("")).collect(Collectors.toSet()));
    }

    public boolean is_stopword(String word) {
        return this.stop_words.contains(word);
    }

    public String info() {
        return this.getClass().getSimpleName() + ": My major data structure is a " + this.stop_words.getClass().getSimpleName();
    }
}

class WordFrequencyManager extends TF {
    private Map<String, Integer> word_frequency;

    public WordFrequencyManager() {
        this.word_frequency = new HashMap<>();
    }

    public void increase(String word) {
        this.word_frequency.put(word, this.word_frequency.getOrDefault(word, 0) + 1);
    }

    public List<Map.Entry<String, Integer>> sorted() {
        return this.word_frequency.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .collect(Collectors.toList());
    }

    public String info() {
        return this.getClass().getSimpleName() + ": My major data structure is a " + this.word_frequency.getClass().getSimpleName();
    }
}

class WordFrequencyController extends TF {
    private DataStorageManager data_storage_manager;
    private StopWordManager stop_word_manager;
    private WordFrequencyManager word_frequency_manager;

    public WordFrequencyController(String file_path, String file_path_stopwords) throws IOException {
        this.data_storage_manager = new DataStorageManager(file_path);
        this.stop_word_manager = new StopWordManager(file_path_stopwords);
        this.word_frequency_manager = new WordFrequencyManager();
    }

    // Variation 1: I use method invocation through reflection
    @SuppressWarnings("unchecked") // Avoid the unnecessary warning message when compiling
    public void run() {
        try {
            Method m_words = this.data_storage_manager.getClass().getMethod("words");        
            Method m_is_stopword = this.stop_word_manager.getClass().getMethod("is_stopword", String.class);
            Method m_increase = this.word_frequency_manager.getClass().getMethod("increase", String.class);
            Method m_sorted = this.word_frequency_manager.getClass().getMethod("sorted");

            // Dynamically call the methods using invoke
            List<String> words = (List<String>) m_words.invoke(this.data_storage_manager);
            for (String word : words) {
                boolean is_stopword = (boolean) m_is_stopword.invoke(this.stop_word_manager, word);
                if (!is_stopword) {
                    m_increase.invoke(this.word_frequency_manager, word);
                }
            }
            
            List<Map.Entry<String, Integer>> word_frequency = (List<Map.Entry<String, Integer>>) m_sorted.invoke(this.word_frequency_manager);
            for (int i = 0; i < 25; i++) {
                System.out.println(word_frequency.get(i).getKey() + "  -  " + word_frequency.get(i).getValue());
            }
        
        } catch (NoSuchMethodException e) {
            System.out.println("Error: NoSuchMethodException - " + e.getMessage());
        } catch (IllegalAccessException e) {
            System.out.println("Error: IllegalAccessException - " + e.getMessage());
        } catch (InvocationTargetException e) {
            System.out.println("Error: InvocationTargetException - " + e.getMessage());
        }
    }
}

public class Seventeen {
    // Vairation 2: I use "Class", a useful class in java to inspect and reflect classes/fields/methods... at runtime
    public static void print_class(String class_name) {
    try {
        // Print information of this class following the order and requirements in instructions
        Class<?> c = Class.forName(class_name);
        System.out.println("Class name: " + c.getSimpleName());

        System.out.println("Fields:");
        for (Field field : c.getDeclaredFields()) {
            System.out.println(field.getType().getSimpleName() + " " + field.getName());
        }

        System.out.println("Methods:");
        for (Method method : c.getDeclaredMethods()) {
            System.out.println(method.getName());
        }

        System.out.println("Superclasses:");
        Class<?> superclass = c.getSuperclass();
        while (superclass != null) {
            System.out.println(superclass.getSimpleName());
            superclass = superclass.getSuperclass();
        }

        System.out.println("Implemented Interfaces:");
        for (Class<?> interfa : c.getInterfaces()) {
            System.out.println(interfa.getSimpleName());
        }

    } catch (ClassNotFoundException e) {
        System.out.println("Input class not found!");
    }
    }

    
    public static void main(String[] args) throws IOException {
        new WordFrequencyController(args[0], "../stop_words.txt").run();
        
        // After normal word frequency printing part, take an input class name and print class infomation
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter a class name:");
        String class_name = scanner.nextLine();
        print_class(class_name);
    }
}
