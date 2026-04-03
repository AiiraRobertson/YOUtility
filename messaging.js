// messaging.js - Messaging functionality between users and providers

// Initialize message storage
function initializeMessaging() {
    if (!localStorage.getItem('youutilityMessages')) {
        localStorage.setItem('youutilityMessages', JSON.stringify([]));
    }
    if (!localStorage.getItem('youutilityNotifications')) {
        localStorage.setItem('youutilityNotifications', JSON.stringify([]));
    }
}

// Get all messages for a conversation (between user and provider for a specific booking)
function getConversation(bookingId, userId, providerId) {
    const messages = JSON.parse(localStorage.getItem('youutilityMessages') || '[]');
    return messages.filter(msg => 
        msg.bookingId === bookingId && 
        ((msg.senderId === userId && msg.receiverId === providerId) ||
         (msg.senderId === providerId && msg.receiverId === userId))
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// Send a message
function sendMessage(bookingId, senderId, senderName, receiverId, receiverEmail, message) {
    if (!message.trim()) return false;

    const messages = JSON.parse(localStorage.getItem('youutilityMessages') || '[]');
    const newMessage = {
        id: Date.now(),
        bookingId,
        senderId,
        senderName,
        receiverId,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        read: false
    };

    messages.push(newMessage);
    localStorage.setItem('youutilityMessages', JSON.stringify(messages));

    // Create a notification for the receiver
    addNotification(receiverId, `New message from ${senderName}`, `${senderName}: ${message.trim().substring(0, 50)}...`, bookingId);

    return true;
}

// Add notification
function addNotification(userId, title, message, bookingId = null) {
    const notifications = JSON.parse(localStorage.getItem('youutilityNotifications') || '[]');
    const notification = {
        id: Date.now(),
        userId,
        title,
        message,
        bookingId,
        timestamp: new Date().toISOString(),
        read: false
    };

    notifications.push(notification);
    localStorage.setItem('youutilityNotifications', JSON.stringify(notifications));

    // Show toast notification
    showNotificationToast(title, message);

    return notification;
}

// Get unread notifications for a user
function getUnreadNotifications(userId) {
    const notifications = JSON.parse(localStorage.getItem('youutilityNotifications') || '[]');
    return notifications.filter(n => n.userId === userId && !n.read);
}

// Get all notifications for a user
function getUserNotifications(userId) {
    const notifications = JSON.parse(localStorage.getItem('youutilityNotifications') || '[]');
    return notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Mark notification as read
function markNotificationAsRead(notificationId) {
    const notifications = JSON.parse(localStorage.getItem('youutilityNotifications') || '[]');
    const updated = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('youutilityNotifications', JSON.stringify(updated));
}

// Mark all notifications as read for a user
function markAllNotificationsAsRead(userId) {
    const notifications = JSON.parse(localStorage.getItem('youutilityNotifications') || '[]');
    const updated = notifications.map(n => 
        n.userId === userId ? { ...n, read: true } : n
    );
    localStorage.setItem('youutilityNotifications', JSON.stringify(updated));
}

// Show toast notification
function showNotificationToast(title, message) {
    // Check if notifications are supported
    if (!('Notification' in window)) return;

    // Request permission if not granted
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: 'photos/Vibrant logo for YOUtility Marketplace.png',
            tag: 'youutility-' + Date.now(),
            requireInteraction: true
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, {
                    body: message,
                    icon: 'photos/Vibrant logo for YOUtility Marketplace.png'
                });
            }
        });
    }

    // Also show in-app toast
    showInAppToast(title, message);
}

// Show in-app toast notification
function showInAppToast(title, message) {
    const toast = document.createElement('div');
    toast.className = 'in-app-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove();">×</button>
    `;
    
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Generate messaging UI for a booking
function generateMessagingUI(booking, currentUser, isProvider = false) {
    const conversation = isProvider 
        ? getConversation(booking.id, currentUser.id || currentUser.email, booking.customerEmail)
        : getConversation(booking.id, currentUser.id || currentUser.email, booking.providerId || 'provider');

    const otherUserName = isProvider ? booking.customerName : booking.providerName || 'Provider';
    const messages = conversation.map(msg => `
        <div class="message ${msg.senderId === (currentUser.id || currentUser.email) ? 'sent' : 'received'}">
            <div class="message-sender">${msg.senderName}</div>
            <div class="message-text">${msg.message}</div>
            <div class="message-time">${new Date(msg.timestamp).toLocaleTimeString()}</div>
        </div>
    `).join('');

    return `
        <div class="messaging-container">
            <div class="messaging-header">
                <h3>Chat with ${otherUserName}</h3>
                <p>${isProvider ? `Booking #${booking.id}: ${booking.description}` : booking.service + ' - ' + booking.date}</p>
            </div>
            <div class="messages-area">
                ${messages || '<p class="no-messages">No messages yet. Start the conversation!</p>'}
            </div>
            <div class="messaging-input-area">
                <form id="message-form" class="message-form" onsubmit="handleSendMessage(event, ${booking.id}, '${currentUser.id || currentUser.email}', '${otherUserName}', '${isProvider ? booking.customerEmail : 'provider@youutility.com'}')">
                    <input 
                        type="text" 
                        id="message-input" 
                        class="message-input" 
                        placeholder="Type your message..." 
                        required
                    />
                    <button type="submit" class="send-btn">Send</button>
                </form>
            </div>
        </div>
    `;
}

// Handle send message form submission
function handleSendMessage(event, bookingId, senderId, senderName, receiverEmail) {
    event.preventDefault();
    const input = document.getElementById('message-input');
    const message = input.value;

    if (!message.trim()) return;

    // Send the message
    sendMessage(bookingId, senderId, senderName, receiverEmail, receiverEmail, message);

    input.value = '';

    // Refresh the messaging UI
    const messagingContainer = document.querySelector('.messaging-container');
    if (messagingContainer) {
        // Re-render the messaging UI
        const booking = window.providerBookings ? window.providerBookings.find(b => b.id === bookingId) : null;
        const currentUser = JSON.parse(localStorage.getItem('youutilityCurrentUser'));
        if (booking && currentUser) {
            const isProvider = currentUser.userType === 'provider';
            messagingContainer.innerHTML = generateMessagingUI(booking, currentUser, isProvider);
            // Auto-focus the message input
            setTimeout(() => {
                const messageInput = document.getElementById('message-input');
                if (messageInput) messageInput.focus();
            }, 100);
        }
    }
}

// Generate notification bell with badge
function generateNotificationBell(userId) {
    const unreadCount = getUnreadNotifications(userId).length;
    return `
        <div class="notification-bell" onclick="toggleNotificationPanel()">
            <span class="bell-icon">🔔</span>
            ${unreadCount > 0 ? `<span class="notification-badge">${unreadCount}</span>` : ''}
        </div>
    `;
}

// Generate notifications panel
function generateNotificationsPanel(userId) {
    const notifications = getUserNotifications(userId);
    const notificationItems = notifications.map(n => `
        <div class="notification-item ${n.read ? 'read' : 'unread'}" onclick="markNotificationAsRead(${n.id})">
            <div class="notification-title">${n.title}</div>
            <div class="notification-message">${n.message}</div>
            <div class="notification-time">${new Date(n.timestamp).toLocaleString()}</div>
        </div>
    `).join('');

    return `
        <div class="notifications-panel">
            <div class="notifications-header">
                <h3>Notifications</h3>
                <button class="clear-all-btn" onclick="markAllNotificationsAsRead('${userId}')">Mark all as read</button>
            </div>
            <div class="notifications-list">
                ${notificationItems || '<p class="no-notifications">No notifications yet</p>'}
            </div>
        </div>
    `;
}

// Toggle notification panel visibility
function toggleNotificationPanel() {
    const panel = document.querySelector('.notifications-panel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
}

// Initialize messaging system on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeMessaging();
});
