const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

/**
 * Sends a message to the Groq API.
 * @param {Array} messages - Array of message objects { role: 'user'|'assistant'|'system', content: string }
 * @returns {Promise<string>} - The content of the assistant's response.
 */
export const sendMessageToGroq = async (messages) => {
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "llama-3.1-8b-instant", // Using a fast/good model on Groq
                "messages": messages
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Groq API Error:', errorData);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            throw new Error('No response from AI');
        }
    } catch (error) {
        console.error("Error sending message to Groq:", error);
        throw error;
    }
};
