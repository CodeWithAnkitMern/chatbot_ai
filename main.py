from fastapi import FastAPI, Request, Form, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from datetime import datetime
import random
import json
from database import init_database, save_message, get_chat_history, clear_history, get_message_count
from dotenv import load_dotenv
from groq import Groq

# Load environment variables from .env file
load_dotenv()

# Initialize database
init_database()

app = FastAPI(title="AI ChatBot with Group Chat")

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Initialize Groq client
api_key = os.environ.get("GROQ_API_KEY")
if not api_key:
    print("⚠️ WARNING: GROQ_API_KEY not found in .env file!")
    client = None
else:
    client = Groq(api_key=api_key)
    print("✅ Groq API key found!")

# Store active WebSocket connections
active_connections = {}
user_colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
]

# Response cache for common questions
response_cache = {}

# Enhanced system prompt for better responses
SYSTEM_PROMPT = """You are an advanced AI assistant named ChatBot. You are:
- Highly intelligent and knowledgeable
- Friendly, warm, and conversational like WhatsApp
- Concise but informative (1-3 sentences for simple questions)
- Use emojis naturally to make conversations engaging
- Provide accurate, helpful information
- If you don't know something, say so honestly
- Be creative and thoughtful in your responses

Remember: Quality over quantity. Be helpful and direct."""

# Enhanced fallback responses
fallback_responses = {
    "greetings": [
        "Hello there! 👋 How can I help you today?",
        "Hey! Great to see you! 😊 What's on your mind?",
        "Hi there! 👋 I'm ready to chat!",
        "Hello! 🌟 How's your day going?"
    ],
    "jokes": [
        "Why don't scientists trust atoms? Because they make up everything! 😄",
        "What do you call a fake noodle? An impasta! 🍝",
        "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
        "What do you call a bear with no teeth? A gummy bear! 🐻",
        "Why don't eggs tell jokes? They'd crack each other up! 🥚"
    ],
    "compliments": [
        "You're awesome! 🌟",
        "I love chatting with you! 💕",
        "You're really cool! 😎",
        "You have great taste in chatbots! 😄"
    ]
}

@app.get("/", response_class=HTMLResponse)
async def chat_page():
    html_path = os.path.join("app", "templates", "chat.html")
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)

@app.get("/history")
async def get_history():
    history = get_chat_history()
    return JSONResponse(content=history)

@app.get("/message-count")
async def message_count():
    return {"count": get_message_count()}

@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await websocket.accept()
    
    color = random.choice(user_colors)
    active_connections[username] = websocket
    
    join_message = {
        "type": "system",
        "username": "System",
        "message": f"👋 {username} joined the chat!",
        "time": datetime.now().strftime("%I:%M %p"),
        "color": "#666"
    }
    await broadcast_message(json.dumps(join_message))
    await send_online_users()
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            message_text = message_data.get("message", "")
            
            save_message(username, message_text)
            
            if message_text.startswith("/"):
                await handle_command(websocket, username, message_text)
                continue
            
            if "@bot" in message_text.lower() or "/ai" in message_text.lower():
                clean_message = message_text.replace("@bot", "").replace("/ai", "").strip()
                if clean_message:
                    await generate_ai_response_stream(websocket, username, clean_message)
                else:
                    help_msg = {
                        "type": "chat",
                        "username": "🤖 AI Bot",
                        "message": "💡 Type @bot [your question] or /ai [your question] to ask me anything!",
                        "time": datetime.now().strftime("%I:%M %p"),
                        "color": "#4ECDC4"
                    }
                    await websocket.send_text(json.dumps(help_msg))
                continue
            
            chat_message = {
                "type": "chat",
                "username": username,
                "message": message_text,
                "time": datetime.now().strftime("%I:%M %p"),
                "color": color,
                "id": message_data.get("id", random.randint(1000, 9999))
            }
            await broadcast_message(json.dumps(chat_message))
            
    except WebSocketDisconnect:
        if username in active_connections:
            del active_connections[username]
        
        leave_message = {
            "type": "system",
            "username": "System",
            "message": f"👋 {username} left the chat",
            "time": datetime.now().strftime("%I:%M %p"),
            "color": "#666"
        }
        await broadcast_message(json.dumps(leave_message))
        await send_online_users()

async def broadcast_message(message: str):
    disconnected = []
    for username, connection in active_connections.items():
        try:
            await connection.send_text(message)
        except:
            disconnected.append(username)
    
    for username in disconnected:
        if username in active_connections:
            del active_connections[username]

async def send_online_users():
    users = list(active_connections.keys())
    online_message = {
        "type": "users",
        "users": users,
        "count": len(users)
    }
    await broadcast_message(json.dumps(online_message))

async def handle_command(websocket: WebSocket, username: str, command: str):
    cmd_parts = command.split(" ", 1)
    cmd = cmd_parts[0].lower()
    
    if cmd == "/help":
        help_text = """📚 **Available Commands:**
/help - Show this help
/users - Show online users
/clear - Clear chat
/joke - Tell a joke
/time - Show current time
/ai [message] - Ask AI directly
@bot [message] - Ask AI directly"""
        
        response = {
            "type": "chat",
            "username": "System",
            "message": help_text,
            "time": datetime.now().strftime("%I:%M %p"),
            "color": "#666"
        }
        await websocket.send_text(json.dumps(response))
        
    elif cmd == "/users":
        users_list = ", ".join(active_connections.keys())
        response = {
            "type": "chat",
            "username": "System",
            "message": f"👥 Online users: {users_list}",
            "time": datetime.now().strftime("%I:%M %p"),
            "color": "#666"
        }
        await websocket.send_text(json.dumps(response))
        
    elif cmd == "/joke":
        joke = random.choice(fallback_responses["jokes"])
        response = {
            "type": "chat",
            "username": "🤖 AI Bot",
            "message": joke,
            "time": datetime.now().strftime("%I:%M %p"),
            "color": "#4ECDC4"
        }
        await websocket.send_text(json.dumps(response))
        
    elif cmd == "/time":
        now = datetime.now().strftime("%I:%M %p on %B %d, %Y")
        response = {
            "type": "chat",
            "username": "System",
            "message": f"⏰ Current time: {now}",
            "time": datetime.now().strftime("%I:%M %p"),
            "color": "#666"
        }
        await websocket.send_text(json.dumps(response))
        
    elif cmd == "/clear":
        response = {
            "type": "system",
            "username": "System",
            "message": "🧹 Chat cleared locally",
            "time": datetime.now().strftime("%I:%M %p"),
            "color": "#666"
        }
        await websocket.send_text(json.dumps(response))
        
    elif cmd == "/ai" or cmd == "/bot":
        if len(cmd_parts) > 1:
            ai_message = cmd_parts[1]
            await generate_ai_response_stream(websocket, username, ai_message)
        else:
            response = {
                "type": "chat",
                "username": "System",
                "message": "💡 Please provide a message after /ai or @bot",
                "time": datetime.now().strftime("%I:%M %p"),
                "color": "#666"
            }
            await websocket.send_text(json.dumps(response))

async def generate_ai_response_stream(websocket: WebSocket, username: str, message: str):
    try:
        cache_key = message.lower().strip()
        if cache_key in response_cache:
            cached_response = response_cache[cache_key]
            response = {
                "type": "chat",
                "username": "🤖 AI Bot",
                "message": f"@{username}: {cached_response}",
                "time": datetime.now().strftime("%I:%M %p"),
                "color": "#4ECDC4"
            }
            await broadcast_message(json.dumps(response))
            return
        
        if client:
            print(f"🤖 AI Request from {username}: {message}")
            
            stream = client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": message}
                ],
                max_tokens=200,
                temperature=0.7,
                stream=True,
            )
            
            full_response = ""
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    full_response += chunk.choices[0].delta.content
            
            if not full_response:
                full_response = "I'm not sure how to respond to that. Could you rephrase?"
            
            response_cache[cache_key] = full_response
            if len(response_cache) > 100:
                oldest_key = next(iter(response_cache))
                del response_cache[oldest_key]
            
            print(f"✅ AI Response: {full_response}")
        else:
            full_response = get_fallback_response(message)
        
        response = {
            "type": "chat",
            "username": "🤖 AI Bot",
            "message": f"@{username}: {full_response}",
            "time": datetime.now().strftime("%I:%M %p"),
            "color": "#4ECDC4"
        }
        await broadcast_message(json.dumps(response))
        
    except Exception as e:
        print(f"❌ AI Error: {e}")
        error_response = {
            "type": "chat",
            "username": "🤖 AI Bot",
            "message": f"⚠️ Sorry, I'm having trouble. {get_fallback_response(message)}",
            "time": datetime.now().strftime("%I:%M %p"),
            "color": "#FF6B6B"
        }
        await websocket.send_text(json.dumps(error_response))

@app.post("/send-message")
async def send_message(message: str = Form(...)):
    save_message("user", message)
    
    try:
        cache_key = message.lower().strip()
        if cache_key in response_cache:
            response_text = response_cache[cache_key]
            save_message("bot", response_text)
            return {"response": response_text}
        
        if client:
            print(f"🤖 Bot Request: {message}")
            
            stream = client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": message}
                ],
                max_tokens=200,
                temperature=0.7,
                stream=True,
            )
            
            response_text = ""
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    response_text += chunk.choices[0].delta.content
            
            if not response_text:
                response_text = get_fallback_response(message)
            
            response_cache[cache_key] = response_text
            if len(response_cache) > 100:
                oldest_key = next(iter(response_cache))
                del response_cache[oldest_key]
            
            print(f"✅ Bot Response: {response_text}")
        else:
            response_text = get_fallback_response(message)
            
    except Exception as e:
        print(f"❌ Bot Error: {e}")
        response_text = get_fallback_response(message)
    
    save_message("bot", response_text)
    return {"response": response_text}

def get_fallback_response(message: str) -> str:
    msg_lower = message.lower().strip()
    
    if msg_lower == "":
        return "Please type something! 😊"
    
    if any(word in msg_lower for word in ["hello", "hi", "hey", "sup", "yo"]):
        return random.choice(fallback_responses["greetings"])
    
    if any(word in msg_lower for word in ["how are you", "how r u"]):
        responses = [
            "I'm doing great, thanks for asking! 😊 How about you?",
            "Fantastic! 🌟 Life is good in the digital world!",
            "I'm awesome! 💫 Thanks for checking in!"
        ]
        return random.choice(responses)
    
    if any(word in msg_lower for word in ["joke", "funny", "laugh"]):
        return random.choice(fallback_responses["jokes"])
    
    if any(word in msg_lower for word in ["time", "clock"]):
        now = datetime.now()
        return f"⏰ It's {now.strftime('%I:%M %p')} on {now.strftime('%B %d, %Y')}"
    
    if any(word in msg_lower for word in ["date", "today"]):
        now = datetime.now()
        return f"📅 Today is {now.strftime('%B %d, %Y')}"
    
    if any(word in msg_lower for word in ["bye", "goodbye", "see you"]):
        return "Goodbye! 👋 Come back anytime! 🚀"
    
    if any(word in msg_lower for word in ["thanks", "thank you", "thx"]):
        return random.choice([
            "You're welcome! 🌟 Happy to help!",
            "Anytime! 😊 That's what I'm here for!",
            "My pleasure! 💫"
        ])
    
    if any(word in msg_lower for word in ["love", "awesome", "cool", "great"]):
        return random.choice(fallback_responses["compliments"])
    
    if any(word in msg_lower for word in ["help", "what can you do", "features"]):
        return """🤖 I'm an AI-powered chatbot! I can:
• Chat about anything
• Answer questions 🧠
• Tell jokes 😄
• Give you the time ⏰
• Share compliments 🌟
• Remember our conversation!
Just type and ask!"""
    
    if any(word in msg_lower for word in ["weather", "rain", "sunny"]):
        return "☀️ I don't have weather data yet, but I hope it's beautiful wherever you are!"
    
    general_responses = [
        f"Interesting! 🤔 Tell me more about '{message}'!",
        f"I see you said '{message}'. That's cool! 😊",
        f"Hmm, '{message}' is an interesting topic! 🧠",
        f"Thanks for sharing! 💭 I'm always learning from our conversations.",
        f"I love how our chat is going! 🌟 Keep talking to me!"
    ]
    return random.choice(general_responses)

@app.post("/clear-history")
async def clear_chat_history():
    clear_history()
    response_cache.clear()
    return {"status": "success"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)