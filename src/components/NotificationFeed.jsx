import NotificationCard from "./NotificationCard";
import { useState, useEffect } from "react";
import * as React from 'react'
import "../css/notificationFeed.css";
import { useVirtualizer } from "@tanstack/react-virtual";


function NotificationFeed() {
    const [notifications, setNotifications] = useState([]);
    const parentRef = React.useRef(null);

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

    // Create row virtualizer for React Virtualize
    const rowVirtualizer = useVirtualizer({
        count: notifications.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 80,
        overscan: 0,
    })

    return (
        <div id="notification-feed">
            <div ref={ parentRef }
            style={{ height: "400px", overflow: "auto" }}
            >
                {/* Get total size of list to store */}
                <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: "100%", position: "relative" }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualItem) => (
                        <div key={ virtualItem.key }
                        style={{ position: "absolute",
                            width: "100%", 
                            height: "70px", 
                            transform: `translateY(${virtualItem.start}px)`,
                            marginBottom: "10px"}}
                            >
                                <NotificationCard notification={notifications[virtualItem.index]} />
                            </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NotificationFeed;