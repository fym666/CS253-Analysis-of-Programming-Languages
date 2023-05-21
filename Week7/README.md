This is the same as the Week 7 part of README.md in the parent directory.

# Week 7
Go to folder Week7.
```
cd Week7
```
1. Compile and run exercises 27.1+27.2 in Style #27 with:
```
node TwentySeven.js ../pride-and-prejudice.txt
```
Then you can type a new file name for the program to update the data, and it will output the new top 25 words with frequencies. This process can be done iteratively.
- You can try to give *../stop_words.txt* or *../pride-and-prejudice.txt* for the new file names to examine the functionality of my program. As shown in the log file *week_7.log*, the correct output after you type *../stop_words.txt* for the new filename would be the same as the previous result. And the correct output after you type *../pride-and-prejudice.txt* for the new filename would be the words unchanged with frequencies doubled.
- Please see comments in code for specific requirements in exercise 27.1/2, I've implemented them strictly within constraints.

2. Compile and run exercises 28.1+28.2 in Style #28 with:
```
node TwentyEight.js ../pride-and-prejudice.txt
```
- Please see comments in code for specific requirements in exercise 28.1/2, I've implemented them strictly within constraints.
- Note that the output28.txt is not exactly identical to *../test.txt* since we do the work part by part. But the tail of the output for top 25 term frequency part is correct.
You can verify that by command:
```
diff <(tail -n 26 output28.txt) ../test.txt
```

Overall:
- The source files are *TwentySeven.js*, *TwentyEight.js*.
- The outputs of running *TwentySeven.js*, *TwentyEight.js* are saved in *output27.txt*, *output28.txt* correspondingly.
- The proof that the program ran successfully and obtained the correct output has been saved in the log file *week_7.log* under the directory *Week7*.
