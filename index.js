(() => {
  const keyArgs = (k) => [
    "jwk",
    {
      alg: "A256CBC",
      ext: true,
      k,
      key_ops: ["encrypt", "decrypt"],
      kty: "oct",
    },
    { name: "AES-CBC" },
    true,
    ["encrypt", "decrypt"],
  ];

  const toBase64 = (str) => {
    return btoa(str).replace(/[+/=]/g, (c) => {
      return {
        "+": "-",
        "/": "_",
        "=": "",
      }[c];
    });
  };

  const importKey = async (str) => {
    if (typeof str !== "string" || str.length > 32)
      throw new TypeError("invalid key");
    const key = toBase64(str.padEnd(32, " "));
    return crypto.subtle.importKey(...keyArgs(key));
  };

  const encrypt = async (message, password) => {
    const key = await importKey(password);
    const encoded = new TextEncoder().encode(message);
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: "AES-CBC",
        iv: new Uint8Array(16),
      },
      key,
      encoded
    );
    const bytes = new Uint8Array(ciphertext);
    const chars = Array.from(bytes, (byte) => String.fromCodePoint(byte));
    return btoa(chars.join(""));
  };

  const decrypt = async (encryptedMessage, password) => {
    const key = await importKey(password);
    const ciphertext = new Uint8Array(
      atob(encryptedMessage)
        .split("")
        .map((a) => a.codePointAt(0))
    ).buffer;
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-CBC",
        iv: new Uint8Array(16),
      },
      key,
      ciphertext
    );
    return new TextDecoder().decode(decrypted);
  };

  globalThis.Crytop = {
    encrypt,
    decrypt,
  };
})();
