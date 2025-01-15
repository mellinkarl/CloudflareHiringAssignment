import { useState } from "react";
import '../css/notificationForm.css';

function NotificationForm() {
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationType, setNotificationType] = useState("alert");


    // Function for sending notification to KV on submit
    async function formSubmit(event) {
        event.preventDefault();
    
        // Create notification object and send it to backend
        let notification = { type: notificationType, content: { text: notificationMessage }, read: false };
        const resp = await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notification),
        });

        // Reset form fields
        setNotificationMessage("");
        setNotificationType("");
      }
    return (
        <div id="notification-form-container">
            <h1 id="notification-form-title">Create Notification</h1>
                <form id="notification-form" onSubmit={formSubmit}>
                    {/* Text area for user to type notification message */}
                    <textarea 
                        id="notification-message" 
                        placeholder="Message..." 
                        value={notificationMessage} 
                        onChange={(e) => setNotificationMessage(e.target.value)}
                        required></textarea>
                    {/* Select element for user to choose notification type */}
                    <select 
                        id="notification-type" 
                        value={notificationType} 
                        onChange={(e) => setNotificationType(e.target.value)}
                        required>
                        <option value="alert">Alert</option>
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                    </select>
                    <button id="send-notification-btn" type="submit">Send</button>
                </form>
            </div>
      )
}

export default NotificationForm;