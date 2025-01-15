import '../css/notificationCard.css';
function NotificationCard({notification}) {

    // Convert timestamp to Day Month Year, Time
    function getTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
    }
    return (
        <div className={`notification-card ${notification.type}`}>
            <p className="notification-message">
                {notification.content.text}
            </p>
            <div className="notification-timestamp">
                {getTimestamp(notification.timestamp)}
            </div>
        </div>
    )
}

export default NotificationCard;