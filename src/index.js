
const notificationForm = document.getElementById("notification-form");
const notificationMessage = document.getElementById("notification-message");
const notificationType = document.getElementById("notification-type");

notificationForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const inputMessage = notificationMessage.value;
    const inputType = notificationType.value;

    // Create notification object and send POST request to backend
    let notification = { type: inputType, content: { text: inputMessage }, read: false };
    const resp = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification),
    });
    notificationForm.reset();

})