const API_URL = `/api/v1/ai/compare`;
export const fetchChatAICompare = async (query) => {
    try {
        const response = await fetch(`${API_URL}/chat-ai?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching AI compare:', error);
        throw error;
    }
};