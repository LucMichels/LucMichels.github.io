/**
 * Mozart.java 
 *
 * Compilation: javac Mozart.java
 * Execution:   java Mozart
 * Dependencies: StdAudio.java
 *
 * Creates and performs a waltz (minuet and trio) according to Mozart's
 * Musikalisches WŸrfelspiel -- Mozart's musical dice game. Allows user
 * to save the waltz to a .wav file in the present working directory.
 *
 * @author chindesaurus
 * @version 1.00
 */

import java.util.Arrays;
import java.util.Random;
import java.util.Scanner;

public class Mozart {
   
    // the number of measures in a minuet or trio 
    private final static int MEASURE = 16; 
    
    // the maximum value of a roll of a die 
    private final static int MAX = 6;      

    // the name of the .wav file to try to save to
    private final static String SAVE_FILE = "mozart_waltz.wav";

    // for generating pseudorandom numbers 
    private static Random generator = new Random();
    
    // each element represents the measure of the minuet
    // stored in ./waves/M<integer>.wav
    private final static int[][] minuet = {
        {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 96, 22, 141, 41, 105, 122, 11, 30, 70, 121, 26, 9, 112, 49, 109, 14},
        {0, 32, 6, 128, 63, 146, 46, 134, 81, 117, 39, 126, 56, 174, 18, 116, 83},
        {0, 69, 95, 158, 13, 153, 55, 110, 24, 66, 139, 15, 132, 73, 58, 145, 79},
        {0, 40, 17, 113, 85, 161, 2 ,159, 100, 90, 176, 7, 4, 67, 160, 52, 170},
        {0, 148, 74, 163, 45, 80, 97, 36, 107, 25, 143, 64, 125, 76, 136, 1, 93},
        {0, 104, 157, 27, 167, 154, 68, 118, 91, 138, 71, 150, 29, 101, 162, 23, 151},
        {0, 152, 60, 171, 53, 99, 133, 21, 127, 16, 155, 57, 175, 43, 168, 89, 172},
        {0, 119, 84, 114, 50, 140, 86, 169, 94, 120, 88, 48, 166, 51, 115, 72, 111},
        {0, 98, 142, 42, 156, 75, 129, 62, 123, 65, 77, 19, 82, 137, 38, 149, 8},
        {0, 3, 87, 165, 61, 135, 47, 147, 33, 102, 4, 31, 164, 44, 59, 173, 78},
        {0, 54, 130, 10, 103, 28, 37, 106, 5, 35, 20, 108, 92, 12, 124, 44, 131}
    };

    // each element represents the measure of the trio 
    // stored in ./waves/T<integer>.wav
    private final static int[][] trio = {
        {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 72, 6, 59, 25, 81, 41, 89, 13, 36, 5, 46, 79, 30, 95, 19, 66},
        {0, 56, 82, 42, 74, 14, 7, 26, 71, 76, 20, 64, 84, 8, 35, 47, 88},
        {0, 75, 39, 54, 1, 65, 43, 15, 80, 9, 34, 93, 48, 69, 58, 90, 21},
        {0, 40, 73, 16, 68, 29, 55, 2, 61, 22, 67, 49, 77, 57, 87, 33, 10},
        {0, 83, 3, 28, 53, 37, 17, 44, 70, 63, 85, 32, 96, 12, 23, 50, 91},
        {0, 18, 45, 62, 38, 4, 27, 52, 94, 11, 92, 24, 86, 51, 60, 78, 31}
    };

    
    /**
     * This class is non-instantiable.
     */
    private Mozart() { }


    /**
     * Simulates the roll of a die by returning an integer
     * in the range [1, MAX].
     *
     * @return an integer in [1, MAX] 
     */
    private static int throwDie() {
        return generator.nextInt(MAX) + 1;
    }

   
    /**
     * Copies the measures given by the filenames in String array s
     * into a new array and returns the new array.
     *
     * @param s a String array in which each element is the name of
     *          a .wav file
     * @return  a double array containing amplitudes from each .wav 
     *          file in s, as generated by a call to StdAudio.read
     */ 
    public static double[] build(String[] s) {
   
        int length = 0;
        
        // determine length of output array
        for (String file : s)
            length += StdAudio.read(file).length;
 
        double[] output = new double[length];

        // copy amplitudes of .wav files into output array
        int index = 0;
        for (String file : s) {
            double[] d = StdAudio.read(file);
            copy(d, output, index);
            index += d.length;
        }

        return output;
    }

    
    /** 
     * Copy the values in array src into dest[k...]
     *
     * @param src  the source array 
     * @param dest the destination array
     * @param k    the index of dest at which to begin copying into
     */
    public static void copy(double[] src, double[] dest, int k) {
        for (int i = 0; i != src.length; i++)
            dest[k + i] = src[i];   
    }
    
    
    /** 
     * Pauses the program for delay microseconds.
     * 
     * @param delay the number of microseconds to pause
     */
    public static void pause(int delay) {
        try { 
            Thread.currentThread().sleep(delay); 
        }
        catch (InterruptedException e) { }
    }


    /**
     * Returns a String array that contains the names of the
     * files randomly chosen to construct the minuet and trio; 
     * the filenames are of the form:
     *      "./waves/M<integer>.wav" and
     *      "./waves/T<integer>.wav",
     * so the files are required to be in the directory waves.
     *
     * @return a String array in which each element is the name
     *         of a .wav file. These .wav files collectively represent
     *         a Mozart waltz.
     */
    public static String[] createRandomSpiel() {

        String[] waltz = new String[2 * MEASURE];       
 
        // add minuet to waltz
        for (int i = 1; i <= MEASURE; i++)
            waltz[i - 1] = "./waves/M" + minuet[throwDie() + throwDie()][i] + ".wav";

        // add trio to waltz 
        for (int i = MEASURE + 1; i <= waltz.length; i++)
            waltz[i - 1] = "./waves/T" + trio[throwDie()][i - MEASURE] + ".wav";
            
        return waltz;
    }


    /**
     * Returns a string representation of String array s -
     * the list of Strings in the array, with each pair 
     * separated by ',' and the list delimited by '[' and ']'.
     * Example: "[banana, potato, narf]".
     *
     * @param s the array to represent
     * @return  a string representation of String array s
     */
    public static String toString(String[] s) {
        return Arrays.toString(s);
    }


    /**
     * Creates a random waltz, prints its component .wav files, 
     * plays the waltz, then allows the user to save the waltz to 
     * a .wav file in the present working directory.
     *
     * @param argv the command-line arguments
     */
    public static void main(String[] argv) {

        Scanner console = new Scanner(System.in);

        // create a random waltz
        String[] spiel = createRandomSpiel();

        // print its component .wav files
        String s = toString(spiel);
        System.out.println(s);
        System.out.println();

        // build a double array of the waltz's amplitudes
        // (scaled between -1.0 and +1.0) and play it with StdAudio
        double[] waltz = build(spiel);
        StdAudio.play(waltz);

        // prompt user to save the waltz as a .wav file
        String input;
        char response;
        do {
            System.out.print("Would you like to save this waltz? y/n: ");
            input = console.next();
            response = Character.toLowerCase(input.charAt(0));
        } while (response != 'y' && response != 'n');

        // if user wants to save the waltz 
        if (response == 'y') {

            // attempt to save to SAVE_FILE 
            StdAudio.save(waltz, SAVE_FILE);

            // print the absolute path to the save file
            System.out.println("This waltz was saved at: " + System.getProperty("user.dir") + "/" + SAVE_FILE);
        }

        System.out.println();
    }
}
