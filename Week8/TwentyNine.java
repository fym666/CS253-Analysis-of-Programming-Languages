// The structures and some namings of this program are inspired from those in the sample python code tf-29.py
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;

// Create aa Message class to make it type-safe
class Message {
    String m0;
    Object[] m1;

    Message(String m0, Object... m1) {
        this.m0 = m0;
        this.m1 = m1;
    }
}

@SuppressWarnings("unchecked")
abstract class ActiveTFObject implements Runnable {
    protected Thread thread;
    protected BlockingQueue<Message> queue = new LinkedBlockingQueue<>();
    protected volatile boolean _stopMe = false;

    ActiveTFObject() {
        this.thread = new Thread(this);
        this.thread.start();
    }

    public void run() {
        try {
            while (!_stopMe) {
                Message message = queue.take();
                _dispatch(message);
                if ("die".equals(message.m0)) {
                    _stopMe = true;
                }
            }
        } catch (InterruptedException e) {
            System.out.println("Error running thread: " + e.getMessage());
        }
    }

    public void send(Message message) {
        try {
            this.queue.put(message);
        } catch (InterruptedException e) {
            System.out.println("Error enqueuing message: " + e.getMessage());
        }
    }   

    protected abstract void _dispatch(Message message);
}

@SuppressWarnings("unchecked")
class DataStorageManager extends ActiveTFObject {
    String text;
    ActiveTFObject _stop_word_manager;

    protected void _dispatch(Message message) {
        if ("init".equals(message.m0)) {
            _init(message.m1);
        } else if ("send_word_freqs".equals(message.m0)) {
            _process_words(message.m1);
        } else {
            _stop_word_manager.send(message);
        }
    }

    private void _init(Object[] m1) {
        String file_path = (String) m1[0];
        _stop_word_manager = (ActiveTFObject) m1[1];
        try {
            text = new String(Files.readAllBytes(Paths.get(file_path)));
        } catch (IOException e) {
            System.out.println("Error reading file: " + file_path + ". Error message: " + e.getMessage());
        }
        text = text.replaceAll("[\\W_]+", " ").toLowerCase();
    }

    private void _process_words(Object[] m1) {
        ActiveTFObject recipient = (ActiveTFObject) m1[0];
        List<String> words = Arrays.asList(text.split("\\s+"));
        words.forEach(w -> _stop_word_manager.send(new Message("filter", w)));
        _stop_word_manager.send(new Message("top25", recipient));
    }
}

@SuppressWarnings("unchecked")
class StopWordManager extends ActiveTFObject {
    List<String> _stop_words;
    ActiveTFObject _word_frequencies_manager;

    protected void _dispatch(Message message) {
        if ("init".equals(message.m0)) {
            _init(message.m1);
        } else if ("filter".equals(message.m0)) {
            _filter(message.m1);
        } else {
            _word_frequencies_manager.send(message);
        }
    }

    private void _init(Object[] m1) {
        try {
            _stop_words = new ArrayList<>(Arrays.asList(new String(Files.readAllBytes(Paths.get("../stop_words.txt"))).split(",")));
        } catch (IOException e) {
            System.out.println("Error reading stop words file. Error message: " + e.getMessage());
        }
        _stop_words.addAll(Arrays.asList("abcdefghijklmnopqrstuvwxyz".split("")));
        _word_frequencies_manager = (ActiveTFObject) m1[0];
    }

    private void _filter(Object[] m1) {
        String word = (String) m1[0];
        if (!_stop_words.contains(word)) {
            _word_frequencies_manager.send(new Message("word", word));
        }
    }
}

@SuppressWarnings("unchecked")
class WordFrequencyManager extends ActiveTFObject {
    Map<String, Integer> _word_freqs = new HashMap<>();

    protected void _dispatch(Message message) {
        if ("word".equals(message.m0)) {
            _increase(message.m1);
        } else if ("top25".equals(message.m0)) {
            _top25(message.m1);
        }
    }

    private void _increase(Object[] m1) {
        String word = (String) m1[0];
        if (_word_freqs.containsKey(word)) {
            _word_freqs.put(word, _word_freqs.get(word) + 1);
        } else {
            _word_freqs.put(word, 1);
        }
    }

    private void _top25(Object[] m1) {
        ActiveTFObject recipient = (ActiveTFObject) m1[0];

        List<Map.Entry<String, Integer>> sorted_wfs = new ArrayList<>(_word_freqs.entrySet());
        sorted_wfs.sort(Map.Entry.comparingByValue(Comparator.reverseOrder()));

        List<Map.Entry<String, Integer>> wfs_top25;
        if (sorted_wfs.size() > 25) {
            wfs_top25 = sorted_wfs.subList(0, 25);
        } else {
            wfs_top25 = sorted_wfs;
        }

        recipient.send(new Message("top25", wfs_top25));
    }
}

@SuppressWarnings("unchecked")
class WordFrequencyController extends ActiveTFObject {
    ActiveTFObject _storage_manager;

    protected void _dispatch(Message message) {
        if ("run".equals(message.m0)) {
            _run(message.m1);
        } else if ("top25".equals(message.m0)) {
            _display(message.m1);
        } else {
            throw new RuntimeException("Message not understood " + message.m0);
        }
    }

    private void _run(Object[] m1) {
        _storage_manager = (ActiveTFObject) m1[0];
        _storage_manager.send(new Message("send_word_freqs", this));
    }

    private void _display(Object[] m1) {
        List<Map.Entry<String, Integer>> word_frequencies = (List<Map.Entry<String, Integer>>) m1[0];
        word_frequencies.forEach(wf -> System.out.println(wf.getKey() + "  -  " + wf.getValue()));
        _storage_manager.send(new Message("die"));
        _stopMe = true;
    }
}

@SuppressWarnings("unchecked")
public class TwentyNine {
    public static void main(String[] args) throws InterruptedException {
        WordFrequencyManager word_freqs_manager = new WordFrequencyManager();

        StopWordManager stop_word_manager = new StopWordManager();
        stop_word_manager.send(new Message("init", word_freqs_manager));

        DataStorageManager storage_manager = new DataStorageManager();
        storage_manager.send(new Message("init", args[0], stop_word_manager));

        WordFrequencyController wf_controller = new WordFrequencyController();
        wf_controller.send(new Message("run", storage_manager));

        word_freqs_manager.thread.join();
        stop_word_manager.thread.join();
        storage_manager.thread.join();
        wf_controller.thread.join();
    }
}
