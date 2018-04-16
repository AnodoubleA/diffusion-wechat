package com.aslan.module.cipher;

public interface Key {

    void init(CipherInfo cipherInfo, AlgorithmInfo algorithmInfo);

    byte[][] update();

    int level();

    int version();
}