<h3 align="center">PGPConnect</h3>
<p align="center">decentralized identity helper</p>
<p align="center"><i>(work in progress)</i></p>

A firefox and chrome extension which use openpgp to do various things.

#### Signing
  - adding `__pub__` string to the text will replace it with the public key(base64).
  - adding `__pubarmored__` string to the text will replace it with the public key(armored).
  - data sample using this:
  ```json
  { "foo": "bar", "pub": "__pub__" }
  ```
  ```json
  { "foo": "bar", "pub": ["__pub__"] }
  ```

#### Verify
  - if the data contains a JSON object with a pub object key like the signing sample, this public keys are used.
    - else the given public keys are used:
      - accept a string or an array of strings.
      - the string can be "armored" or base64.

#### Encrypt || Decrypt & Verify
  - the public key:
    - accept a string or an array of strings.
    - the string can be "armored" or base64.

#### Decrypt
  - the data as string can be "armored" or base64. 

#### TODO:
  - when last user is delete, got an error: Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.

Can't display service_worker local storage content from devtools