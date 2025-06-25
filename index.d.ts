declare function encrypt(message: string, password: string): Promise<string>;

declare function decrypt(
  encryptedMessage: string,
  password: string
): Promise<string>;

declare const thisModule = {
  encrypt,
  decrypt,
};

declare global {
  var Crytop: typeof thisModule;
}

export {};
