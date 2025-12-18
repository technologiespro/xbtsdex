v0.7.13
- **Security Enhancement:** Implemented key stretching (PBKDF2 with 40,000 iterations using SHA512) for password-derived keys in `generateKeys` function, significantly improving resistance against brute-force attacks.

