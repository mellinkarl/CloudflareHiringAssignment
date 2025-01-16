export async function onRequestPost(context) {
    // Construct AI prompt using user input and notification categories
    const userInput = await context.request.json();
    const categories = ["finance", "weather", "health", "technology"];
    const AIPrompt = {
        prompt: `Which of the following ${categories} does the nofitication ${userInput.text} fall under? Return only one lowercase word.`,
    };
    try {
        // Get answer from AI and create response for user
        const answer = await context.env.categoryAI.run(
            "@cf/meta/llama-3.1-8b-instruct",
            AIPrompt,
        );
        const category = { category: answer.response };
    } catch (e) {
        return new Response(JSON.stringify({ error: "Error accessing AI" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
    return new Response(JSON.stringify(category), {
        headers: { "Content-Type": "application/json" },
    });
}
