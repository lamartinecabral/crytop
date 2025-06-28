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
        alg: `${algorithm[0]}${length}${mode}`,
        ext: true,
        key_ops: ["encrypt", "decrypt"] satisfies KeyUsage[],
      };
    })();

    this.generateKey = (password: string) => {
      if (typeof password !== "string") {
        throw new TypeError("password must be a string");
      }

      const { alg, ext, key_ops, keyAlgorithm } = constants;

      return crypto.subtle.importKey(
        "jwk",
        { alg, ext, k: btoa(password.padEnd(32, " ")), key_ops, kty: "oct" },
        keyAlgorithm,
        ext,
        key_ops
      );
    };

    this.encrypt = async (message: string, password: string) => {
      const { name } = constants;
      const passwordKey = await this.generateKey(password);

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

    this.decrypt = async (encryptedMessage: string, password: string) => {
      const { name } = constants;
      const passwordKey = await this.generateKey(password);

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
export const version: string = "";

export default { encrypt, decrypt, version };
