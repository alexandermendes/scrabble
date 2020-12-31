## Development

## Firebase notes

- Create a [new Firebase project](https://console.firebase.google.com/).

- Enable Authentication
- Enabled Cloud Firestore
- Create a private key and add to the root of the repo at `private-key.json`.
- `cp .env.sample .env` and fill in env vars

Firebase CLI is available via `yarn firebase`

### Editing security rules

Modify the `firestore.rules` file and run:

```
yarn firebase deploy --only firestore:rules
```
