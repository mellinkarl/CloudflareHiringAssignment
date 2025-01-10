// This file handles the POST, GET, and DELETE routes for the api.


// POST api/notifications
export async function onRequestPost(context) {
  const data = await context.request.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
