// @ts-check
const Crytop = require("../dist/crytop");

(async () => {
  const password = "1234";
  const message = "Hello World!";

  const encryptedMessage = await Crytop.encrypt(message, password);

  if (encryptedMessage === message) {
    throw new Error("encryptedMessage should be different than message");
  }

  const decryptedMessage = await Crytop.decrypt(encryptedMessage, password);

  if (decryptedMessage !== message) {
    throw new Error("decryptedMessage should be equal to message");
  }

  console.log("test ok");
})();
