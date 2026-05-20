# PrivChat

PrivChat is an end-to-end encrypted real-time chat web app with a Google Chat-like user experience. Messages are encrypted in your browser using AES-GCM, and your RSA keypair never leaves your device—the server sees only ciphertext. Sign in with Google and start chatting securely with no intermediaries reading your conversations.

## Features

- **End-to-End Encryption**: AES-GCM per-message encryption with RSA-OAEP key wrapping per recipient
- **Real-time Messaging**: Live chat powered by Socket.IO
- **Google OAuth Authentication**: Quick sign-in with your Google account
- **Default Rooms**: General, Random, and Support channels ready to use
- **Browser-Generated Keys**: RSA keypair created and stored locally in IndexedDB—never sent to the server
- **Zero-Knowledge Server**: Server stores only ciphertext, IV, and encrypted AES keys—plaintext never touches the backend
- **Google Chat-like UX**: Familiar, intuitive chat interface

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Node.js, Express, Socket.IO
- **Database**: PostgreSQL
- **Authentication**: Google OAuth via passport-google-oauth20
- **Encryption**: AES-GCM (messages), RSA-OAEP (key wrapping)

## Architecture

PrivChat follows a zero-knowledge architecture where encryption and decryption happen entirely in the browser. When you send a message, it's encrypted locally using an AES-GCM key (generated per message), and that key is then encrypted separately for each recipient using their RSA public key. The backend receives and stores only the ciphertext and encrypted keys—it never has access to plaintext or private keys. On the receiving end, Socket.IO delivers the encrypted message, your browser decrypts the AES key using your private key, and then decrypts the message itself.

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL database
- Google OAuth credentials (Client ID and Secret)

### Setup

1. Clone the repository and install dependencies:

```bash
npm install
npm run install:all
```

2. Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

3. Initialize the database:

```bash
cd server
npm run init-db
cd ..
```

4. Start the development server:

```bash
npm run dev
```

5. Open http://localhost:3000 and sign in with Google.

## Environment Variables

Configure the following in your `.env` file:

- `GOOGLE_CLIENT_ID` – Your Google OAuth application Client ID
- `GOOGLE_CLIENT_SECRET` – Your Google OAuth application Client Secret
- `DATABASE_URL` – PostgreSQL connection string
- `SESSION_SECRET` – Secret key for session management (generate a random string)
- `VAPID_PUBLIC_KEY` – Public VAPID key for push notifications
- `VAPID_PRIVATE_KEY` – Private VAPID key for push notifications

For Replit deployment, add these as secrets in the Replit Secrets pane instead of a `.env` file.

## How Encryption Works

**Per-Message Flow:**

1. **Message Encryption** (Browser): When you send a message, the app generates a random 256-bit AES-GCM key and encrypts your plaintext message with it, producing ciphertext and an initialization vector (IV).

2. **Key Wrapping** (Browser): That AES-GCM key is then encrypted separately for each recipient using their RSA-4096 public key (via OAEP padding). This encrypted key is called the `message_key`.

3. **Server Storage**: The server receives and stores the ciphertext, IV, and the encrypted message keys for each recipient. The plaintext message never reaches the backend.

4. **Message Decryption** (Browser): When a recipient receives the encrypted message, they decrypt their `message_key` using their private RSA key (stored only in their IndexedDB), then use that decrypted AES-GCM key to decrypt the ciphertext back to plaintext.

**Key Generation:**

- RSA keypairs (4096-bit) are generated once per user in the browser and stored in IndexedDB.
- The public key is automatically uploaded to the server after first sign-in.
- Private keys never leave the browser and are never transmitted or stored on the server.

## Live Demo

Try PrivChat live: https://real-time-chat-app-six-omega.vercel.app
