package com.aslan.module.cipher;

public class InfoHandler {
	void read(byte[] buf, offset, cipherInfo);

	write(buf, offset, cipherInfo);

	default int version() {
		return 1;
	}

	int length();
}