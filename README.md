# Week 9
- Due to environment issue (no numpy) it cannot run on this Repl. Please go to the URL that I submitted to run week9.py or this link: https://replit.com/@Carving/CS253-Week9#Week9/README.md

Go to folder Week9.
```
cd Week9
```
Compile and run the exercise in array programming style with:
```
python3 week9.py ../pride-and-prejudice.txt
```
- The output result would be:
```
07 +#3  -  491
+0 83  -  445
!И +#3  -  397
мЯ D4Я<￥  -  273
+0 +#3  -  268
```
According to my version of Leet mapping provided in the code, the output is a transform of:
```
OF THE  -  491
TO BE  -  445
IN THE  -  397
MR DARCY  -  273
TO THE  -  268 
```
- Please see comments in code for specific requirements in this exercise, I've implemented them strictly within constraints.
- The output of running *week9.py* is saved in *output-w9.txt* correspondingly.
- The proof that the program ran successfully and obtained the correct output has been saved in the log file *week_9.log* under the directory *Week9*.

# Week 8
Go to folder Week8.
```
cd Week8
```
1. Compile and run exercise 29.1 with:
```
javac TwentyNine.java 
java TwentyNine ../pride-and-prejudice.txt 
```
2. Compile and run exercise 30.1 with:
```
javac Thirty.java
java Thirty ../pride-and-prejudice.txt
```
3. Compile and run exercises 32.1+32.3 with:
```
javac ThirtyTwo.java
java ThirtyTwo ../pride-and-prejudice.txt
```
- Please see comments in code for specific requirements in exercise 32.1/3, I've implemented them strictly within constraints.

Overall:
- The outputs of running *TwentyNine.java*, *Thirty.java*, *ThirtyTwo.java* are saved in *output29.txt*, *output30.txt*, *output32.txt* correspondingly.
- The proof that the program ran successfully and obtained the correct output has been saved in the log file *week_8.log* under the directory *Week8*.

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

# Week 6
Go to folder Week6.
```
cd Week6
```
1. Compile and run a variation of 17.1 with:
```
javac Seventeen.java
java Seventeen ../pride-and-prejudice.txt 
```
- Please see comments in code for specific requirements in variants 1 and 2.
- Note that the output17.txt is not exactly identical to *../test.txt* since we have an additional task: print infomation of the input class. But the output for top 25 term frequency part is correct and the infomation of input class is correct.
- A valid class name input expects output, while an invalid (nonexist) class name expects error message.

2. Compile and run exercises 20.1 with:
First, go to folder Twenty:
```
cd Twenty
```
Next, compile all java source files:
```
javac *.java
```
Then, produce 3 jar files:
```
jar cf framework.jar Framework.class
jar cf app1.jar Words1.class Frequencies1.class
jar cf app2.jar Words2.class Frequencies2.class
```
Then, choose an option (app1 or app2) to run by choosing an option in configuration file *config.properties* following its commnets.

Finally, run the program with:
```
java -cp ".:framework.jar" Framework ../../pride-and-prejudice.txt
```
- Please see comments in codes for differences between 2 implementations of the apps.
- If your stop words file is not located in the parent of the parent of current directory *Twenty*, then you need to change the file path in *Frequencies1.java* and *Frequencies2.java*.

Overall:
- The outputs of running *Seventeen.java*, *Twenty with app1*, *Twenty with app2* are saved in *output17.txt*, *output20-1.txt*, *output20-2.txt* correspondingly.
- The proof that the program ran successfully and obtained the correct output has been saved in the log file *week_6.log* under the directory *Week6*.

# Week 5
Go to folder Week5.
```
cd Week5
```
1. Compile and run exercise 21.1 in Style #21 with the following commands:
```
node TwentyOne.js ../pride-and-prejudice.txt
```
2. Compile and run exercises 22.1 in Style #22 with the following commands:
```
node TwentyTwo.js ../pride-and-prejudice.txt
```
3. Compile and run exercisea 25.1 in Style #25 with the following commands:
```
node TwentyFive.js ../pride-and-prejudice.txt
```
Overall:
- The source files are *TwentyOne.js*, *TwentyTwo.js*, *TwentyFive.js*.
- The outputs of running *TwentyOne.js*, *TwentyTwo.js*, *TwentyFive.js* are saved in *output21.txt*, *output22.txt*, *output25.txt* correspondingly.
- The proof that the program ran successfully and obtained the correct output has been saved in the log file *week_5.log* under the directory *Week5*.

# Week 4
Go to folder Week4.
```
cd Week4
```
1. Compile and run exercise 12.1 in Style #12 with the following commands:
```
node Twelve.js ../pride-and-prejudice.txt
```
2. Compile and run exercises 13.1+13.2+13.3 in Style #13 with the following commands:
- Please see comments in code for specific requirements in exercise 13.1/2/3, I've implemented them strictly within constraints.
```
node Thirteen.js ../pride-and-prejudice.txt
```
3. Compile and run exercisea 15.1+15.2 in Style #15 with the following commands:
- Please see comments in code for specific requirements in exercise 15.1/2, I've implemented them strictly within constraints.
- The python script *check15.py* is a program that's used to check the correctness of the Exercise 15.2 implemented in my JavaScript program (i.e., it checks the number of non-stop words with letter z).
- Note that the output15.txt is not exactly identical to *../test.txt* since we have an additional task. But the output for top 25 term frequency part is correct and the number of words with z is also correct.
```
node Fifteen.js ../pride-and-prejudice.txt
```
Overall:
- The source files are *Twelve.js*, *Thirteen.js*, *Fifteen.js*.
- The outputs of running *Twelve.js*, *Thirteen.js*, *Fifteen.js* are saved in *output12.txt*, *output13.txt*, *output15.txt* correspondingly.
- The proof that the program ran successfully and obtained the correct output has been saved in the log file *week_4.log* under the directory *Week4*.

# Week 3
Go to folder Week3.
```
cd Week3
```
Compile and run exercise in Chapter 8 with the following commands:
```
g++ Eight.cpp -o eight
./eight ../pride-and-prejudice.txt
```
Compile and run exercise 9.1 with the following commands:
```
node Nine.js ../pride-and-prejudice.txt
```
Compile and run exercise 10.1 with the following commands:
```
node Ten.js ../pride-and-prejudice.txt
```
- The source files are *Eight.cpp*, *Nine.js*, *Ten.js*.
- The proof that the program ran successfully and obtained the correct output has been saved in the log file *week_3.log* under the directory *Week3*.

# Week 2
Go to folder Week2.
```
cd Week2
```
Compile and run exercise 4.1 with the following commands:
```
g++ Four.cpp -o four
./four ../pride-and-prejudice.txt
```
Compile and run exercise 5.1 with the following commands:
```
g++ Five.cpp -o five
./five ../pride-and-prejudice.txt
```
Compile and run exercise 6.1 with the following commands:
```
rustc Six.rs -o six
./six ../pride-and-prejudice.txt
```
Compile and run exercise 7.1 with the following commands:
```
g++ Seven.cpp -o seven
./seven ../pride-and-prejudice.txt
```
- The source files are *Four.cpp*, *Five.cpp*, *Six.rs*, *Seven.cpp*.
- The proof that the program ran successfully and obtained the correct output has been saved in the log file *week_2.log* under the directory *Week2*.

# Week 1
Go to folder week_1. Compile and run the program with the following commands:
```
cd week_1
g++ week_1.cpp -o week_1
./week_1 ../pride-and-prejudice.txt
```
- The source file is week_1.cpp
- The proof that the program ran successfully and obtained the correct output has been saved in the log file *week_1.log* under the directory *week_1*.
