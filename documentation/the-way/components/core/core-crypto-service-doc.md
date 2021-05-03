## CoreCryptoService

This component can be used to encrypt/decrypt, generate a hash and generate a random hash.

### Cipher
A method to cipher some data.
You can pass an algorithm that Crypto(from node) accept to encrypt the data

Params:

- *data*: Refers to the data that will be encrypted
- *algorithm*: Is the algorithm that will be used to cipher the data (only Crypto algorithm)
- *privateKey*: is a secret text that will be used in the algorithm
- *type*: is the 'base' of the ciphered data

Return:

- the ciphered data