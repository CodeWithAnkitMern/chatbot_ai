import sqlite3
from datetime import datetime
import json
import os

# Database file path - dynamic for both local and production
DB_PATH = os.path.join(os.path.dirname(__file__), "chat_history.db")

def init_database():
    """Create the database and tables if they don't exist"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Create messages table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender TEXT NOT NULL,
                message TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                type TEXT DEFAULT 'text'
            )
        ''')
        
        # Create users table for group chat
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
                color TEXT
            )
        ''')
        
        conn.commit()
        conn.close()
        print("✅ Database initialized successfully!")
        return True
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
        return False

def save_message(sender, message, msg_type='text'):
    """Save a message to the database"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO messages (sender, message, type)
            VALUES (?, ?, ?)
        ''', (sender, message, msg_type))
        
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Error saving message: {e}")
        return False

def get_chat_history(limit=100):
    """Get recent chat history"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT sender, message, timestamp, type 
            FROM messages 
            ORDER BY timestamp DESC 
            LIMIT ?
        ''', (limit,))
        
        rows = cursor.fetchall()
        conn.close()
        
        # Convert to list of dictionaries
        history = []
        for row in rows:
            history.append({
                'sender': row[0],
                'message': row[1],
                'timestamp': row[2],
                'type': row[3]
            })
        
        return history[::-1]  # Return in chronological order
    except Exception as e:
        print(f"❌ Error getting history: {e}")
        return []

def clear_history():
    """Clear all chat history"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM messages')
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Error clearing history: {e}")
        return False

def get_message_count():
    """Get total number of messages"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) FROM messages')
        count = cursor.fetchone()[0]
        conn.close()
        return count
    except Exception as e:
        print(f"❌ Error getting message count: {e}")
        return 0

def get_db_info():
    """Get database information for debugging"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Get table info
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        # Get message count
        cursor.execute('SELECT COUNT(*) FROM messages')
        msg_count = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            "tables": [t[0] for t in tables],
            "message_count": msg_count,
            "db_path": DB_PATH
        }
    except Exception as e:
        return {"error": str(e)}

# Initialize database on import
if __name__ != "__main__":
    init_database()