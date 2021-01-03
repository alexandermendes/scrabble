# Scrabble

I couldn't find a decent free online version, so decided to make one. Written as
a [Next.js](https://nextjs.org/) application, backed by [Firebase](https://firebase.google.com/)
and deployed with [Vercel](https://vercel.com/). Just a little pet project to
keep me occupied during Covid-19 times.

[**Play here**](https://scrabble-mu.vercel.app/)

---

SCRABBLE® is a registered trademark. All intellectual property rights in and to
the game are owned in the U.S.A and Canada by Hasbro Inc., and throughout the
rest of the world by J.W. Spear & Sons Limited of Maidenhead, Berkshire, England,
a subsidiary of Mattel Inc.

---

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
