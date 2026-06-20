// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {

    console.log('🌟 AI ChatBot starting...');

    // Get elements
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const modeToggle = document.getElementById('modeToggle');
    const modeTitle = document.getElementById('modeTitle');
    const modeStatus = document.getElementById('statusText');
    const modeAvatar = document.getElementById('modeAvatar');
    const usersBtn = document.getElementById('usersBtn');

    // Track states
    let isTyping = false;
    let messageCount = 0;
    let currentMode = 'bot';
    let ws = null;
    let username = '';
    let isConnected = false;

    // ============================================================
    // SECTION 1: EMOJI PICKER DATA
    // ============================================================

    const emojiData = {
        smileys: ['😊', '😂', '🤣', '❤️', '💕', '😍', '🥰', '😘', '😗', '😙', '😚', '🥲', '😀', '😁', '😅', '😆', '🤣', '😂', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '🥲', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'],
        nature: ['🌿', '🌱', '🌳', '🌲', '🌵', '🌾', '🌻', '🌹', '🌺', '🌸', '🌼', '🌷', '🌿', '☘️', '🍀', '🌴', '🌵', '🌾', '🌽', '🍃', '🍂', '🍁', '🍄', '🐚', '💐', '🌸', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃'],
        food: ['🍕', '🍔', '🍟', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃'],
        activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '⛳', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '⛸️', '🥌', '🛷', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎗️'],
        travel: ['✈️', '🚀', '🛸', '🛰️', '🚁', '⛵', '🚤', '🛥️', '⛴️', '🛳️', '🚢', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼', '🛗', '🚏', '🛣️', '🛤️', '⛽', '🚨', '🚥', '🚦', '🅿️'],
        objects: ['💡', '🔦', '🏮', '🪔', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '📑', '🔖', '🏷️', '💰', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '💎', '⚖️', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧰', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '⚱️'],
        symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️'],
        flags: ['🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🏳️‍⚧️', '🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇩🇪', '🇫🇷', '🇮🇳', '🇯🇵', '🇨🇳', '🇧🇷', '🇷🇺', '🇮🇹', '🇪🇸', '🇲🇽', '🇰🇷', '🇿🇦', '🇳🇬', '🇦🇷', '🇳🇱', '🇵🇹', '🇸🇪', '🇨🇭', '🇧🇪', '🇦🇹']
    };

    let currentCategory = 'smileys';

    function getEmojisForCategory(category) {
        return emojiData[category] || emojiData.smileys;
    }

    function renderEmojis(category = 'smileys', search = '') {
        const grid = document.getElementById('emojiGrid');
        if (!grid) return;

        const emojis = getEmojisForCategory(category);

        let filteredEmojis = emojis;
        if (search.trim()) {
            filteredEmojis = emojis.filter(emoji => {
                return emoji === search || emoji.includes(search);
            });
        }

        grid.innerHTML = '';
        filteredEmojis.forEach(emoji => {
            const btn = document.createElement('button');
            btn.className = 'emoji-item';
            btn.textContent = emoji;
            btn.addEventListener('click', function () {
                insertEmoji(emoji);
            });
            grid.appendChild(btn);
        });
    }

    function insertEmoji(emoji) {
        const input = document.getElementById('messageInput');
        const cursorPos = input.selectionStart;
        const text = input.value;
        input.value = text.slice(0, cursorPos) + emoji + text.slice(cursorPos);
        input.focus();
        const newCursorPos = cursorPos + emoji.length;
        input.setSelectionRange(newCursorPos, newCursorPos);
        closeEmojiPicker();
    }

    function toggleEmojiPicker() {
        const picker = document.getElementById('emojiPicker');
        if (!picker) return;

        if (picker.style.display === 'none' || picker.style.display === '') {
            picker.style.display = 'block';
            renderEmojis(currentCategory);
            const search = document.getElementById('emojiSearch');
            if (search) {
                search.value = '';
                search.focus();
            }
        } else {
            closeEmojiPicker();
        }
    }

    function closeEmojiPicker() {
        const picker = document.getElementById('emojiPicker');
        if (picker) {
            picker.style.display = 'none';
        }
    }

    // ============================================================
    // SECTION 2: SOUND NOTIFICATION
    // ============================================================

    function playNotificationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
        } catch (error) {
            console.log('Audio notification not supported');
        }
    }

    // ============================================================
    // SECTION 3: TYPING INDICATOR
    // ============================================================

    function showTypingIndicator() {
        if (isTyping) return;
        isTyping = true;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message received typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-content" style="background: #ffffff; padding: 8px 14px;">
                <div class="dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        isTyping = false;
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // ============================================================
    // SECTION 4: MESSAGE FUNCTIONS
    // ============================================================

    function updateMessageCounter() {
        messageCount++;
        document.title = `(${messageCount}) 💬 ${currentMode === 'bot' ? 'AI ChatBot' : 'Group Chat'}`;
    }

    function addMessageWithFeatures(text, type, time = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.dataset.messageId = Date.now() + Math.random();

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';

        if (time) {
            timeDiv.textContent = time;
        } else {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeDiv.textContent = `${hours}:${minutes}`;
        }

        if (type === 'sent') {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '✕';
            deleteBtn.title = 'Delete this message';
            deleteBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (confirm('Delete this message?')) {
                    messageDiv.style.transition = 'all 0.3s ease';
                    messageDiv.style.opacity = '0';
                    messageDiv.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        messageDiv.remove();
                        messageCount--;
                        document.title = `(${messageCount}) 💬 ${currentMode === 'bot' ? 'AI ChatBot' : 'Group Chat'}`;
                    }, 300);
                }
            });
            contentDiv.style.position = 'relative';
            contentDiv.appendChild(deleteBtn);
        }

        if (type === 'received') {
            const reactionDiv = document.createElement('div');
            reactionDiv.className = 'message-reactions';
            reactionDiv.innerHTML = `
                <button class="reaction-btn" data-emoji="❤️" title="Love">❤️</button>
                <button class="reaction-btn" data-emoji="👍" title="Like">👍</button>
                <button class="reaction-btn" data-emoji="😂" title="Funny">😂</button>
                <button class="reaction-btn" data-emoji="😮" title="Wow">😮</button>
            `;

            reactionDiv.querySelectorAll('.reaction-btn').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const emoji = this.dataset.emoji;
                    let reactionDisplay = messageDiv.querySelector('.reaction-display');
                    if (!reactionDisplay) {
                        reactionDisplay = document.createElement('div');
                        reactionDisplay.className = 'reaction-display';
                        messageDiv.appendChild(reactionDisplay);
                    }
                    const emojiSpan = document.createElement('span');
                    emojiSpan.textContent = emoji;
                    emojiSpan.className = 'reaction-emoji';
                    emojiSpan.style.animation = 'popIn 0.3s ease';
                    reactionDisplay.appendChild(emojiSpan);
                    setTimeout(() => {
                        emojiSpan.style.opacity = '0';
                        emojiSpan.style.transform = 'scale(0.5)';
                        setTimeout(() => {
                            emojiSpan.remove();
                            if (reactionDisplay.children.length === 0) {
                                reactionDisplay.remove();
                            }
                        }, 300);
                    }, 3000);
                });
            });

            messageDiv.appendChild(reactionDiv);
        }

        if (type === 'sent') {
            const statusSpan = document.createElement('span');
            statusSpan.className = 'message-status';
            statusSpan.textContent = ' ✓';
            timeDiv.appendChild(statusSpan);
        }

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        return messageDiv;
    }

    function addSystemMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system';
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = message;
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function searchMessages(query) {
        const messages = chatMessages.querySelectorAll('.message');
        let found = 0;

        messages.forEach(msg => {
            const content = msg.querySelector('.message-content');
            if (content) {
                const text = content.textContent.toLowerCase();
                if (text.includes(query.toLowerCase())) {
                    msg.style.background = 'rgba(255, 235, 59, 0.2)';
                    msg.style.borderRadius = '8px';
                    msg.style.padding = '4px';
                    msg.style.transition = 'all 0.3s ease';
                    found++;
                    setTimeout(() => {
                        msg.style.background = '';
                        msg.style.borderRadius = '';
                        msg.style.padding = '';
                    }, 3000);
                }
            }
        });

        return found;
    }

    // ============================================================
    // SECTION 5: BOT MODE FUNCTIONS
    // ============================================================

    async function sendToBot(message) {
        try {
            showTypingIndicator();

            const response = await fetch('/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `message=${encodeURIComponent(message)}`
            });

            if (!response.ok) {
                throw new Error('Server error: ' + response.status);
            }

            const data = await response.json();
            const now = new Date();
            const timeStr = now.toLocaleTimeString();

            hideTypingIndicator();
            addMessageWithFeatures(data.response, 'received', timeStr);
            playNotificationSound();

        } catch (error) {
            console.error('Error:', error);
            hideTypingIndicator();
            addMessageWithFeatures('⚠️ Error: ' + error.message, 'received');
        }
    }

    // ============================================================
    // SECTION 6: GROUP CHAT FUNCTIONS
    // ============================================================

    function addGroupMessage(username, message, time, color) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message received';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const nameSpan = document.createElement('strong');
        nameSpan.textContent = username;
        nameSpan.style.color = color || '#075e54';
        nameSpan.style.marginRight = '6px';
        contentDiv.appendChild(nameSpan);
        contentDiv.appendChild(document.createTextNode(message));

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = time || new Date().toLocaleTimeString();

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function updateUsersList(users, count) {
        const usersList = document.getElementById('usersList');
        const onlineCount = document.getElementById('onlineCount');
        if (onlineCount) onlineCount.textContent = count || 0;
        if (!usersList) return;

        usersList.innerHTML = '';
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-item';
            const avatar = document.createElement('div');
            avatar.className = 'user-avatar';
            avatar.textContent = user.charAt(0).toUpperCase();
            avatar.style.background = getColorForUser(user);
            const name = document.createElement('span');
            name.className = 'user-name';
            name.textContent = user;
            userDiv.appendChild(avatar);
            userDiv.appendChild(name);
            usersList.appendChild(userDiv);
        });
    }

    function getColorForUser(username) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
        let hash = 0;
        for (let i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }

    function connectWebSocket() {
        const usernameInput = document.getElementById('usernameInput');
        username = usernameInput.value.trim();
        if (!username) {
            usernameInput.style.borderColor = '#ff4444';
            setTimeout(() => {
                usernameInput.style.borderColor = '#e0e0e0';
            }, 500);
            return;
        }

        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}/ws/${encodeURIComponent(username)}`;

        ws = new WebSocket(wsUrl);

        ws.onopen = function () {
            console.log('✅ Connected to Group Chat');
            isConnected = true;
            document.getElementById('usernameModal').style.display = 'none';
            document.title = `💬 ${username}`;
            modeStatus.textContent = 'Online';
            addSystemMessage(`👋 Welcome, ${username}!`);
            addSystemMessage('💡 Type /help for commands, @bot or /ai to talk to AI');
        };

        ws.onmessage = function (event) {
            const data = JSON.parse(event.data);
            if (data.type === 'chat') {
                addGroupMessage(data.username, data.message, data.time, data.color);
                if (data.username !== username) {
                    playNotificationSound();
                }
            } else if (data.type === 'system') {
                addSystemMessage(data.message);
            } else if (data.type === 'users') {
                updateUsersList(data.users, data.count);
            }
        };

        ws.onclose = function () {
            console.log('❌ Disconnected from Group Chat');
            isConnected = false;
            modeStatus.textContent = 'Disconnected';
            addSystemMessage('⚠️ Disconnected from group. Reconnecting...');
            setTimeout(connectWebSocket, 3000);
        };

        ws.onerror = function (error) {
            console.error('WebSocket error:', error);
            addSystemMessage('⚠️ Connection error. Please try again.');
        };
    }

    function sendToGroup(message) {
        if (isConnected && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                message: message,
                id: Date.now()
            }));
            const now = new Date();
            const timeStr = now.toLocaleTimeString();
            addGroupMessage('You', message, timeStr, '#075e54');
            return true;
        }
        return false;
    }

    // ============================================================
    // SECTION 7: MODE SWITCHING
    // ============================================================

    function switchToBotMode() {
        currentMode = 'bot';
        modeTitle.textContent = 'AI ChatBot';
        modeAvatar.textContent = '🤖';
        modeStatus.textContent = 'Online';
        usersBtn.style.display = 'none';
        document.title = `(${messageCount}) 💬 AI ChatBot`;

        if (ws) {
            ws.close();
            ws = null;
            isConnected = false;
        }

        addSystemMessage('🤖 Switched to Bot Mode. Chat with AI!');
        addSystemMessage('💡 Try: /joke, /time, /help');
    }

    function switchToGroupMode() {
        currentMode = 'group';
        modeTitle.textContent = 'Group Chat';
        modeAvatar.textContent = '👥';
        modeStatus.textContent = 'Join Group';
        usersBtn.style.display = 'block';
        document.title = `(${messageCount}) 💬 Group Chat`;

        document.getElementById('usernameModal').style.display = 'flex';
        document.getElementById('usernameInput').focus();
    }

    // ============================================================
    // SECTION 8: HANDLE SEND MESSAGE
    // ============================================================

    function handleSendMessage() {
        const message = messageInput.value.trim();
        if (message === '') {
            messageInput.style.borderColor = '#ff4444';
            messageInput.style.animation = 'shake 0.3s ease';
            setTimeout(() => {
                messageInput.style.borderColor = '#e0e0e0';
                messageInput.style.animation = '';
            }, 500);
            return;
        }

        const now = new Date();
        const timeStr = now.toLocaleTimeString();

        if (currentMode === 'bot') {
            addMessageWithFeatures(message, 'sent', timeStr);
            updateMessageCounter();
            messageInput.value = '';
            messageInput.focus();
            sendToBot(message);
        } else {
            if (isConnected && ws && ws.readyState === WebSocket.OPEN) {
                sendToGroup(message);
                updateMessageCounter();
                messageInput.value = '';
                messageInput.focus();
            } else {
                addSystemMessage('⚠️ Not connected to group. Click 👥 to join!');
            }
        }
    }

    // ============================================================
    // SECTION 9: EVENT LISTENERS
    // ============================================================

    modeToggle.addEventListener('click', function () {
        if (currentMode === 'bot') {
            switchToGroupMode();
            this.textContent = '🤖';
            this.title = 'Switch to Bot Mode';
        } else {
            switchToBotMode();
            this.textContent = '👥';
            this.title = 'Switch to Group Chat';
        }
    });

    sendButton.addEventListener('click', handleSendMessage);

    messageInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeEmojiPicker();
            const sidebar = document.getElementById('usersSidebar');
            if (sidebar) sidebar.classList.remove('open');
            messageInput.value = '';
            messageInput.blur();
        }
    });

    messageInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });

    // ============================================================
    // SECTION 10: EMOJI PICKER EVENT LISTENERS
    // ============================================================

    const emojiBtn = document.getElementById('emojiBtn');
    if (emojiBtn) {
        emojiBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleEmojiPicker();
        });
    }

    document.querySelectorAll('.emoji-cat').forEach(btn => {
        btn.addEventListener('click', function () {
            const cat = this.dataset.cat;
            currentCategory = cat;
            document.querySelectorAll('.emoji-cat').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const searchInput = document.getElementById('emojiSearch');
            renderEmojis(cat, searchInput ? searchInput.value : '');
        });
    });

    const emojiSearch = document.getElementById('emojiSearch');
    if (emojiSearch) {
        emojiSearch.addEventListener('input', function () {
            renderEmojis(currentCategory, this.value);
        });
    }

    document.addEventListener('click', function (e) {
        const picker = document.getElementById('emojiPicker');
        const btn = document.getElementById('emojiBtn');
        if (picker && btn && !picker.contains(e.target) && !btn.contains(e.target)) {
            closeEmojiPicker();
        }
    });

    // ============================================================
    // SECTION 11: GROUP CHAT MODAL
    // ============================================================

    const joinButton = document.getElementById('joinButton');
    const cancelJoin = document.getElementById('cancelJoin');
    const usernameInput = document.getElementById('usernameInput');

    if (joinButton) {
        joinButton.addEventListener('click', function () {
            connectWebSocket();
        });
    }

    if (cancelJoin) {
        cancelJoin.addEventListener('click', function () {
            document.getElementById('usernameModal').style.display = 'none';
            switchToBotMode();
            modeToggle.textContent = '👥';
            modeToggle.title = 'Switch to Group Chat';
        });
    }

    if (usernameInput) {
        usernameInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                joinButton.click();
            }
        });
    }

    // ============================================================
    // SECTION 12: USERS SIDEBAR
    // ============================================================

    const usersBtnSidebar = document.getElementById('usersBtn');
    const usersSidebar = document.getElementById('usersSidebar');
    const closeUsers = document.getElementById('closeUsers');

    if (usersBtnSidebar) {
        usersBtnSidebar.addEventListener('click', function () {
            usersSidebar.classList.toggle('open');
        });
    }

    if (closeUsers) {
        closeUsers.addEventListener('click', function () {
            usersSidebar.classList.remove('open');
        });
    }

    // ============================================================
    // SECTION 13: THEME TOGGLE
    // ============================================================

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            document.body.classList.toggle('dark-mode');
            this.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        });

        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        }
    }

    // ============================================================
    // SECTION 14: CLEAR CHAT
    // ============================================================

    const clearChat = document.getElementById('clearChat');
    if (clearChat) {
        clearChat.addEventListener('click', function () {
            if (confirm('Clear all messages?')) {
                const messages = chatMessages.querySelectorAll('.message');
                messages.forEach((msg, index) => {
                    setTimeout(() => {
                        msg.style.transition = 'all 0.3s ease';
                        msg.style.opacity = '0';
                        msg.style.transform = 'translateY(-20px)';
                        setTimeout(() => {
                            msg.remove();
                        }, 300);
                    }, index * 50);
                });
                messageCount = 0;
                document.title = `💬 ${currentMode === 'bot' ? 'AI ChatBot' : 'Group Chat'}`;
            }
        });
    }

    // ============================================================
    // SECTION 15: SEARCH FUNCTIONALITY (Ctrl+F)
    // ============================================================

    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            const query = prompt('🔍 Search messages:', '');
            if (query && query.trim() !== '') {
                const found = searchMessages(query);
                alert(`Found ${found} message(s) matching "${query}"`);
            }
        }
    });

    // ============================================================
    // SECTION 16: CONSOLE TIPS
    // ============================================================

    console.log('🤖 AI ChatBot ready!');
    console.log('💡 Modes:');
    console.log('  - 🤖 Bot Mode: Chat with AI');
    console.log('  - 👥 Group Mode: Chat with multiple users');
    console.log('  - Click 👥 button to switch modes');
});