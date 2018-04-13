//@formatter:off

export const ALGORITHMS = {
	DEFAULT: 0,
	DC140713: 1,
	DC314: 2,
};


export const CIPHER_OPTION = {
	ENCIPHER: 		1 << 0,
	DECIPHER: 		1 << 1,
	PADDING: 		1 << 2,
	TEXT: 			1 << 30,
	FILE: 			1 << 31,
};

export const TYPE_MASK = 0xFF000000;

