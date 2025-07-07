# Crytop
A simple encryption tool powered by [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

# Installation

In a browser:

```html
<script src="https://unpkg.com/crytop"></script>
```

```html
<script type="module">
  import Crytop from "https://unpkg.com/crytop/dist/crytop.esm.js";
</script>
```

Using npm:

```sh
$ npm install crytop
```

# Usage example

```js
import Crytop from "crytop";

(async () => {
  const message = "Hello World!";
  const password = "1234";
  
  const encrypted = await Crytop.encrypt(message, password);
  console.log(encrypted); // WYCn8qIJNoNlVU0pV/LuDg==

  const decrypted = await Crytop.decrypt(encrypted, password);
  console.log(message === decrypted); // true
})()
```