class Crytop {
  generateKey;
  encrypt;
  decrypt;

  constructor() {
    const constants = (() => {
      const algorithm = "AES";
      const mode = "CBC";
      const length = 256;
      const name = `${algorithm}-${mode}`;

      return {
        name,
        keyAlgorithm: { name, length },
      };
    })();

    this.generateKey = async (password: string) => {
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
      );

      return crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: new Uint8Array(16),
          iterations: 1e5,
          hash: "SHA-256",
        },
        keyMaterial,
        constants.keyAlgorithm,
        true,
        ["encrypt", "decrypt"]
      );
    };

    this.encrypt = async (message: string, password: string | CryptoKey) => {
      const { name } = constants;
      const passwordKey =
        typeof password === "string"
          ? await this.generateKey(password)
          : password;

      const messageEncoded = new TextEncoder().encode(message);

      const ciphertext = await crypto.subtle.encrypt(
        { name, iv: new Uint8Array(16) },
        passwordKey,
        messageEncoded
      );

      const bytes = new Uint8Array(ciphertext);
      const chars = [...bytes].map((byte) => String.fromCodePoint(byte));
      return btoa(chars.join(""));
    };

    this.decrypt = async (
      encryptedMessage: string,
      password: string | CryptoKey
    ) => {
      const { name } = constants;
      const passwordKey =
        typeof password === "string"
          ? await this.generateKey(password)
          : password;

      const chars = atob(encryptedMessage).split("");
      const bytes = new Uint8Array(chars.map((a) => Number(a.codePointAt(0))));
      const cyphertext = bytes.buffer;

      const messageEncoded = await crypto.subtle.decrypt(
        { name, iv: new Uint8Array(16) },
        passwordKey,
        cyphertext
      );

      return new TextDecoder().decode(messageEncoded);
    };
  }
}

const crytop = new Crytop();

export const encrypt: typeof crytop.encrypt = (...args) => {
  return crytop.encrypt(...args);
};
export const decrypt: typeof crytop.decrypt = (...args) => {
  return crytop.decrypt(...args);
};
export const generateKey: typeof crytop.generateKey = (...args) => {
  return crytop.generateKey(...args);
};
export const version: string = "";

export default { encrypt, decrypt, generateKey, version };
