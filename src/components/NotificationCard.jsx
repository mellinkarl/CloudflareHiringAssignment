import '../css/notificationCard.css';
function NotificationCard({notification}) {

    // Convert timestamp to Day Month Year, Time
    function getTimestamp(timestamp) {
        const date = new Date(timestamp);
        const intlFormattedDate = new Intl.DateTimeFormat("en-US", 
            { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "numeric", hour12: true }
        ).format(date).replace(",", "");
        const [month, day, year, time, a] = intlFormattedDate.split(" ");
        return `${ day } ${ month } ${ year } ${ time }${ a.toLowerCase() }`;
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