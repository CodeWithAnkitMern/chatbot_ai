# 🤖 AI ChatBot with Group Chat

A feature-rich, WhatsApp-style chatbot application with AI-powered conversations and real-time group chat capabilities.

![AI ChatBot Banner](https://via.placeholder.com/1200x400/075e54/ffffff?text=AI+ChatBot+with+Group+Chat)

## 🚀 Live Demo

**[👉 View Live Demo](https://chatbot-ai-7rxb.onrender.com)**

---

## 📋 Table of Contents
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📸 Screenshots](#-screenshots)
- [📋 Commands](#-commands)
- [🏃‍♂️ Run Locally](#️-run-locally)
- [📁 Project Structure](#-project-structure)
- [🚀 Deploy to Render](#-deploy-to-render)
- [🎨 Customization](#-customization)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [📞 Contact](#-contact)

---

## ✨ Features

### 🤖 **Bot Mode**
- AI-powered conversations using Groq's GPT-OSS-120B
- Smart, human-like responses
- Typing indicator (shows "..." when bot is thinking)
- Fast responses with streaming and caching
- Commands: `/help`, `/joke`, `/time`, `/clear`

### 👥 **Group Mode**
- Multiple users chat together in real-time
- WebSocket connections for instant messaging
- See who's online
- Join/leave notifications
- AI responses with `@bot` or `/ai`
- User colors and avatars

### 🎨 **Both Modes**
- Beautiful WhatsApp-style UI
- Dark mode (persists in browser)
- Emoji picker with search
- Message reactions (❤️👍😂😮)
- Delete your messages
- Clear chat functionality
- Search messages (Ctrl+F)
- Sound notifications
- Keyboard shortcuts
- Responsive design (mobile-friendly)

### 💾 **Database**
- SQLite database for chat history
- Messages persist after refresh
- Message counter

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Python 3.11** | Backend language |
| **FastAPI** | Web framework |
| **WebSockets** | Real-time group chat |
| **Groq API** | AI model (GPT-OSS-120B) |
| **SQLite** | Database |
| **HTML/CSS/JS** | Frontend |
| **Render** | Deployment |

---

## 📸 Screenshots

| Bot Mode | Group Mode | Dark Mode |
|----------|------------|-----------|
| ![Bot Mode](https://via.placeholder.com/200x400/075e54/ffffff?text=Bot+Mode) | ![Group Mode](https://via.placeholder.com/200x400/075e54/ffffff?text=Group+Mode) | ![Dark Mode](https://via.placeholder.com/200x400/075e54/ffffff?text=Dark+Mode) |

---

## 📋 Commands

### Bot Mode
| Command | Description |
|---------|-------------|
| `/help` | Show all commands |
| `/joke` | Tell a joke |
| `/time` | Show current time |
| `/clear` | Clear chat |

### Group Mode
| Command | Description |
|---------|-------------|
| `/help` | Show all commands |
| `/users` | Show online users |
| `/joke` | Tell a joke |
| `/time` | Show current time |
| `/ai [message]` | Ask AI |
| `@bot [message]` | Ask AI |
| `/clear` | Clear chat |

---

## 🏃‍♂️ Run Locally

### Prerequisites
- Python 3.11 or higher
- Groq API key ([Get free key](https://console.groq.com))
- Git (optional)

### Step 1: Clone the Repository
```bash
git clone https://github.com/CodeWithAnkitMern/chatbot_ai.git
cd chatbot_ai
