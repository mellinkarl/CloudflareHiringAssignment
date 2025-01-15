// POST api/notifications
export async function onRequestPost(context) {

  // Ensure request contains valid JSON objects
  try{
    var requestNotifications = await context.request.json();
  } catch (e) {
    return new Response(JSON.stringify({
      error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // If single JSON object is given convert it to array
  if (!Array.isArray(requestNotifications)) {
    requestNotifications = [requestNotifications];
  }

  // Verify each notification the request body contains valid type, content and read variables
  for (let i = 0; i < requestNotifications.length; i++) {
    if (!["alert", "info", "success"].includes(requestNotifications[i].type) ||
    typeof requestNotifications[i].content.text !== "string" ||
    typeof requestNotifications[i].read !== "boolean") {
      return new Response(JSON.stringify({
        error: "Incorrect notification type, content, or read"}), {
        status: 400, headers: { "Content-Type": "application/json" }}
      );
  }
    // Add UUID and Timestamp to notification
    requestNotifications[i].id = crypto.randomUUID();
    requestNotifications[i].timestamp = Date.now();
  }

  // Get current notifications value from KV, append request notifications
  try{
    let notifications = await context.env.cloudflareHiringAssignmentKV.get("notifications", "json");
    notifications = notifications ? notifications : [];
    notifications.push(...requestNotifications);

    // Put notifications value in KV
    // If key doesn't exist, create new KV pair
    // If key exists, update KV pair
    await context.env.cloudflareHiringAssignmentKV.put("notifications", JSON.stringify(notifications));
  } catch (e) {
    return new Response(JSON.stringify({
      error: "Error accessing server"}), {
      status: 400, headers: { "Content-Type": "application/json" }
    })
  }
  return new Response(JSON.stringify(requestNotifications), {
    headers: { "Content-Type": "application/json" },
  });
}

// GET api/notifications
export async function onRequestGet(context) {

  // Get notifications from KV
  // If there are none, return empty array
  try {
    let notifications = await context.env.cloudflareHiringAssignmentKV.get("notifications", "json");
    notifications = notifications ? notifications : [];

    return new Response(JSON.stringify(notifications), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({
      error: "Failed to get notifications from database" }), {
      headers: { "Content-Type": "application/json" }
    })
  }
}

// DELETE api/notifications
export async function onRequestDelete(context) {

  // Delete notifications from KV and return success message
  try{
    await context.env.cloudflareHiringAssignmentKV.delete("notifications");
  } catch (e) {
    return new Response(JSON.stringify({
      error: "Failed to delete notifications from database" }), {
      headers: { "Content-Type": "application/json" }
    })
  }
  return new Response(JSON.stringify({ message: "Notifications deleted successfully!" }), {
    headers : { "Content-Type": "application/json" },
  });
}