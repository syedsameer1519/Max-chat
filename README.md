# MAX Chat — GREEN-API Telegram Client

A minimal web-based messaging client built with React and Vite, using GREEN-API to send and receive Telegram text messages.

## Overview

This project was created as a React frontend assignment.

The application provides a simple chat interface where users can:

- Connect a GREEN-API Telegram instance
- Create a chat using a Telegram chat ID
- Send text messages
- Receive incoming Telegram messages
- Display outgoing and incoming messages separately
- Handle GREEN-API notification queues

## Features

- React + Vite
- GREEN-API Telegram integration
- Send text messages
- Receive incoming messages
- Real-time-style message polling
- Incoming/outgoing message separation
- Error handling
- Responsive interface
- Minimal messenger-style UI

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- GREEN-API Telegram API

## Project Structure

```text
max-chat/
├── public/
├── src/
│   ├── assets/
│   ├── services/
│   │   └── greenApi.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js

**## Screenshots**

### Login

![Login screen](screenshots/login.png)

### Chat

![Chat interface](screenshots/chat-empty.png)

### Sending and receiving messages

![Messaging](screenshots/chat-messages.png)
