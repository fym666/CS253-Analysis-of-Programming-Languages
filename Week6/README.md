This is the same as the Week 6 part in the parent directory.

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