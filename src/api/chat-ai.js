// const API_URL = `/api/v1/ai/chat`;
// export const fetchChatAICompare = async (query) => {
//     try {
//         const response = await fetch(`${API_URL}/with-search?query=${encodeURIComponent(query)}`, {
//             method: 'GET',
//             headers: {
//                 'Accept': '*/*',
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (!response.ok) {
//             throw new Error(await response.text());
//         }

//         const json = await response.json();
//         return json.data;
//     } catch (error) {
//         console.error('Error fetching AI compare:', error);
//         throw error;
//     }
// };

const API_URL = `/api/v1/ai/chat`;

export const fetchChatAICompare = async (chatHistory) => {
  try {
    const response = await fetch(`${API_URL}/with-search`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        history: chatHistory.map((msg) => ({
          role: msg.type === "bot" ? "assistant" : "user",
          content: msg.text,
        })),
      }),
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
