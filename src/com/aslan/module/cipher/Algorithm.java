package com.aslan.module.cipher;

public interface Algorithm {

    void init(AlgorithmInfo option);

    void enc(byte[] input, byte[][] key);

    void dec(byte[] input, byte[][] key);

    int identity();

    int version();
}
