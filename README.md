# Crytop
A simple encryption tool powered by Web Crypto API

# Installation

In a browser:

```html
<script src="https://unpkg.com/crytop"></script>
```

```html
<script type="module">
  import "https://unpkg.com/crytop";
</script>
```

Using npm:

```sh
$ npm install crytop
```

# Usage example

```js
import "crytop";

(async () => {
  const message = "Hello World!";
  const password = "1234";
  
  const encrypted = await Crytop.encrypt(message, password);
  console.log(encrypted); // XzsKe606L8P4a40xE+d/HA==

  const decrypted = await Crytop.decrypt(encrypted, password);
  console.log(message === decrypted); // true
})()
```