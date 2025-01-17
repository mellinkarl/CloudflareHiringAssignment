import NotificationCard from "./NotificationCard";
import { useState, useEffect } from "react";
import * as React from 'react'
import "../css/notificationFeed.css";
import { Virtuoso } from "react-virtuoso";

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
        loadNotifications();
        // Load notifications on interval of 4 seconds
        const interval = setInterval(loadNotifications, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div id="notification-feed">
                <Virtuoso
                    style={{ height:"400px", width: "100%", display: "flex", gap: "10px" }}
                    totalCount={notifications.length}
                    components={{
                        List: React.forwardRef(({ style, children, ...props }, ref) => (
                          <div ref={ref} style={{ ...style, display: 'flex', flexDirection: 'column', gap: 10}} {...props}>
                            {children}
                          </div>
                        )),
                      }}
                    overscan={0}
                    increaseViewportBy={{ top: 0, bottom: 0 }}
                    itemContent={(index) => {return <NotificationCard
                        notification={notifications[index]}
                        key={notifications[index].id}
                    />}}
                    />
                
        </div>
    );
}

export default NotificationFeed;
