
export async function onRequestGet(context) {

    // Create cookie value in JSON, full cookie string
    const cookieVal = { "displayDuration": 5000, "preferredTypes": ["alert", "info"] };
    let cookieStr = 'preferences=' + JSON.stringify(cookieVal);
    

    // Set cookie in header
    // document.cookie is not available in serverless environments
    return new Response(JSON.stringify(cookieVal), {
        headers: { 
            "Content-Type": "application/json",
            "Set-Cookie": cookieStr,
    }});
}