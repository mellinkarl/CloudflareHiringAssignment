import NotificationCard from "./NotificationCard";
import { useState, useEffect } from "react";
import "../css/notificationFeed.css";
import { FixedSizeList as List } from "react-window";

function NotificationFeed() {
    const [notifications, setNotifications] = useState([]);

    // Fetch notifications from backend when page first renders
    useEffect(() => {
        async function loadNotifications() {
            try {
                const kvNotifications = await fetch("/api/notifications", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const jsonNotifications = await kvNotifications.json();

                // Filter out read notifications
                // Sort notifications based on timestamp
                const sortedNotifications = jsonNotifications
                    .filter((notification) => !notification.read)
                    .sort(function (x, y) {
                        return y.timestamp - x.timestamp;
                    });

                setNotifications(sortedNotifications);
            } catch (e) {
                console.error("Error retrieving notifications", e);
            }
        }

        // Load notifications on interval of 4 seconds
        const interval = setInterval(loadNotifications, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div id="notification-feed">
            <List
                height={400}
                itemCount={notifications.length}
                itemSize={80}
                width={"100%"}
            >
                {({ index, style }) => (
                    <NotificationCard
                        notification={notifications[index]}
                        style={{
                            ...style,
                            height: "70px",
                            marginBottom: "10px",
                        }}
                        key={notifications[index].id}
                    />
                )}
            </List>
        </div>
    );
}

export default NotificationFeed;
