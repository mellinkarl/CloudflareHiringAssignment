import NotificationCard from "./NotificationCard";
import { useState, useEffect } from "react";
import '../css/notificationFeed.css';

function NotificationFeed() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch notifications from backend when page first renders
    useEffect(() => {
        async function loadNotifications() {
            try {
                const kvNotifications = await fetch("/api/notifications", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const jsonNotifications = await kvNotifications.json();
                // Sort notifications based on timestamp
                const sortedNotifications = jsonNotifications.sort(function(x, y) {
                    return y.timestamp - x.timestamp;
                })
                setNotifications(sortedNotifications);
            } catch (e) {
                console.error("Error retrieving notifications", e)
            } finally {
                setLoading(false);
            }
            }

        // Load notifications initially
        loadNotifications();
        
        // Load notifications on interval of 4 seconds
        const interval = setInterval(loadNotifications, 4000);
        return () => clearInterval(interval);
    }, [])

    // Wait until notification fetch is done
    if (loading) {
        return null;
    }

    return (
        <div id="notification-feed">
            {notifications.map(notification => (
                <NotificationCard notification={notification} key={notification.id}/>
            ))}
        </div>
    )
}

export default NotificationFeed;