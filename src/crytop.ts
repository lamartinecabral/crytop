export const encrypt = async (message: string, password: string) => {
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
  const chars = [...bytes].map((byte) => String.fromCodePoint(byte));
  return btoa(chars.join(""));
};

export const decrypt = async (encryptedMessage: string, password: string) => {
  const key = await importKey(password);
  const ciphertext = new Uint8Array(
    atob(encryptedMessage)
      .split("")
      .map((a) => Number(a.codePointAt(0)))
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

export const version: string = "";

const Crytop = {
  encrypt,
  decrypt,
  version,
};

export default Crytop;

const importKey = async (str: string) => {
  if (typeof str !== "string" || str.length > 32)
    throw new TypeError("invalid key");
  const key = toBase64(padEnd(str, 32, " "));
  return crypto.subtle.importKey(...keyArgs(key));
};

const toBase64 = (str: string) => {
  return btoa(str).replace(/[+/=]/g, (c) => {
    return (
      {
        "+": "-",
        "/": "_",
        "=": "",
      }[c] ?? c
    );
  });
};

const keyArgs = (k: string) =>
  [
    "jwk",
    {
      alg: "A256CBC",
      ext: true,
      k,
      key_ops: ["encrypt", "decrypt"],
      kty: "oct",
    } satisfies JsonWebKey,
    { name: "AES-CBC" },
    true,
    ["encrypt", "decrypt"],
  ] as const;

const padEnd = (str: string, maxLength: number, fillString: string) => {
  return (
    str +
    Array(maxLength)
      .fill(fillString[0])
      .join("")
      .slice(0, Math.max(0, maxLength - str.length))
  );
};
