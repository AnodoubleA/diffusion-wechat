package com.aslan.module.cipher;


public class consts{
    //@formatter:off
    public static class ALGORITHMS {
        static int DEFAULT      = 0;
        static int DC140713     = 1;
        static int DC314        = 2;
    }


    public static class CIPHER_OPTION  {
        static int ENCIPHER 		= 1 << 0;
        static int DECIPHER 		= 1 << 1;
        static int PADDING 		    = 1 << 2;
        static int TEXT 			= 1 << 29;
        static int FILE 			= 1 << 30;
    };

}



