import { v4 as uuidv4 } from 'uuid';

// POST api/notifications
export async function onRequestPost(context) {

  try{
    var requestNotifications = await context.request.json();
  } catch (e) {
    return new Response(JSON.stringify({
      error: "Invalid request body",
      status: 400,
      headers: { "Content-Type": "application/json" },
    }));
  }

  // If single JSON object is given convert it to array
  if (!Array.isArray(requestNotifications)){
    requestNotifications = [requestNotifications];
  }

  // Verify each notification the request body contains valid type, content and read variables
  for (let i = 0; i < requestNotifications.length; i++){
    if (!["alert", "info", "success"].includes(requestNotifications[i].type) ||
    typeof requestNotifications[i].content.text !== "string" ||
    typeof requestNotifications[i].read !== "boolean") {
      return new Response(JSON.stringify({
        error: "Incorrect notification type, content, or read"}), {
        status: 400, headers: { "Content-Type": "application/json" }}
      );
  }
    // Add UUID and Timestamp to notification
    requestNotifications[i].id = uuidv4();
    requestNotifications[i].timestamp = Date.now();
  }

  // Get current notifications value from KV, append request notifications
  let notifications = await context.env.cloudflareHiringAssignmentKV.get("notifications", "json");
  notifications = notifications ? notifications : [];
  notifications.push(...requestNotifications);

  // Put notifications value in KV
  // If key doesn't exist, create new KV pair
  // If key exists, update KV pair
  await context.env.cloudflareHiringAssignmentKV.put("notifications", JSON.stringify(notifications));

  return new Response(JSON.stringify(requestNotifications), {
    headers: { "Content-Type": "application/json" },
  });
}
