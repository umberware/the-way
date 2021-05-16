## CoreCryptoService

This component can be used to encrypt/decrypt, generate a hash and generate a random hash.

### Summary

 - [Method: cipher](#method-cipher)
 - [Method: cipherIv](#method-cipheriv)
 - [Method: cipherWithRsa](#method-cipherwithrsa)
 - [Method: decipher](#method-decipher)
 - [Method: decipherIv](#method-decipheriv)
 - [Method: decipherWithRsa](#method-decipherwithrsa)

### Method: cipher
A method to cipher some data.
You can pass an algorithm that Crypto(node) accept to encrypt the data

Params:

- *data*: Refers to the data that will be encrypted
- *algorithm*: Is the algorithm that will be used to cipher the data (only Crypto algorithm)
- *privateKey*: is a secret text that will be used in the algorithm
- *type*: is the 'base' of the ciphered data

Return:

- the ciphered data

### Method: cipherIv
A method to cipher some data.
You can pass an algorithm that Crypto(from node) accept to encrypt the data and pass the iv buffer size.

Params:

- *data*: Refers to the data that will be encrypted
- *algorithm*: Is the algorithm that will be used to cipher the data (only Crypto algorithm)
- *privateKey*: is a secret text that will be used in the algorithm
- *type*: is the 'base' of the ciphered data
- *ivLength*: is the size of the buffer

Return:

- the ciphered data

### Method: cipherWithRsa
This method will cipher a data using the RSA algorithm

Params:
- *data*: refers to the data ciphered
- *publicKey*: is the public key that will be used in the algorithm
- *type is the*: 'base' of the ciphered data

Return:
- the ciphered data


### Method: decipher
A method to decipher a ciphered data

Params:
 - *data*: refers to the data ciphered
 - *algorithm*: Is the algorithm used to cipher the data (must be the same)
 - *privateKey*: is a secret text that will be used in the algorithm
 - *type is the*: 'base' of the ciphered data

Return:
    - the deciphered data

### Method: decipherIv
A method to decipher a ciphered data. This method will work only when in the cipher process is used an IV buffer.

Params:
- *data*: refers to the data ciphered
- *algorithm*: Is the algorithm used to cipher the data (must be the same)
- *privateKey*: is a secret text that will be used in the algorithm
- *type is the*: 'base' of the ciphered data

Return:
- the deciphered data

### Method: decipherWithRsa
This method will decipher a data ciphered with the RSA algorithm

Params:
- *data*: refers to the data ciphered
- *privateKey*: is the secret key that will be used in the algorithm to decipher
- *type is the*: 'base' of the ciphered data

Return:
- the deciphered data

### Method: hash
This method will generate a hash from the passed data and algorithm

Params:
- *data*: data will be used to generate the hash
- *algorithm*: The algorithm that will be used to generate the hash
- *type is the*: 'base' of the ciphered data

Return:
- the data hash


### Method: randomHash
This method will generate a random values if N size

Params:
- *size*: size is the amount of random values to be generated
- *type is the*: 'base' of the ciphered data

Return:
- the random values as string