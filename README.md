# 🤖 AI ChatBot with Group Chat

A feature-rich, Chatbot application with AI-powered conversations and real-time group chat capabilities.

## 🚀 Live Demo

**[View Live Demo](https://chatbot-ai-7rxb.onrender.com)**


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

## 🏃‍♂️ Run Locally

### Prerequisites
- Python 3.11 or higher
- Groq API key ([Get free key](https://console.groq.com))
- Git (optional)

### Step 1: Clone the Repository
```bash
git clone https://github.com/CodeWithAnkitMern/chatbot_ai.git
cd chatbot_ai

Step 2: Create Virtual Environment
bash
python -m venv venv
Windows:

bash
venv\Scripts\activate
Mac/Linux:

bash
source venv/bin/activate

Step 3: Install Dependencies
bash
pip install -r requirements.txt
Step 4: Set Up Environment Variables
Create a .env file in the root directory:

env
GROQ_API_KEY=your_groq_api_key_here


Step 5: Run the Application
bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload

Step 6: Open in Browser
text
http://127.0.0.1:8000



chatbot_ai/
├── app/
│   ├── templates/
│   │   └── chat.html          # Chat interface
│   └── static/
│       ├── style.css          # All styles + dark mode
│       └── script.js          # All features + dual-mode logic
├── main.py                    # FastAPI server
├── database.py                # SQLite database functions
├── requirements.txt           # Dependencies
├── Procfile                   # Render start command
├── render.yaml                # Render configuration
├── .env                       # Environment variables (not in git)
├── .gitignore                 # Git ignore file
└── README.md                  # This file
