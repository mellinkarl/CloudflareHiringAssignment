import NotificationCard from "./NotificationCard";
import { useState, useEffect } from "react";
import '../css/notificationFeed.css';

function NotificationFeed() {
    const [notifications, setNotifications] = useState([]);

    // Fetch notifications from backend when page first renders
    useEffect(() => {
        async function loadNotifications() {

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
            }

        loadNotifications();
    }, [])

    return (
        <div id="notification-feed">
            {notifications.map(notification => (
                <NotificationCard notification={notification} key={notification.id}/>
            ))}
        </div>
    )
}

export default NotificationFeed;