# Ephemeral

Ephemeral is my Information Systems capstone project. It is a cross site message encryption system.
Works on Facebook, Groupme, Slack, Gmail, and I couldn't really think of more to test...
The name Ephemeral comes from (my favorite feature of the application) the ability to interactively specify the duration of short term session keys. This means, like snap chat, the key will disappear after a short period of time and the data can no longer be read... Until the NSA decrypts it...

### What Works
I didn't have enough time to finish the storage of the temporary keys, so I just hard coded the key in. I know this defeats the purpose, but during development I was prioritizing UX, UI, and in place decryption over reproducing a key store.

The following applications can encrypt, decrypt and exchange keys. They don't yet store the keys for future decryption and thus the expiration policy in the session configuration doesn't mean much.

Flawlessly:  Facebook and Slack

Slight Issues: GroupMe (adds b around text) and Gmail  (tweaks out when you enter it in the compose popup)

### Video Demo
https://youtu.be/VE-Gi2W7WZk

### Exchange an Ephemeral Session Key on Facebook
![Encrypt Facebook Message](https://raw.githubusercontent.com/PseudoSky/Psypher/master/lib/img/key-exchange.gif)

### Encrypt A Facebook Message
![Encrypt Facebook Message](https://raw.githubusercontent.com/PseudoSky/Psypher/master/lib/img/encrypt-text.gif)

