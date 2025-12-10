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

// export const fetchChatAICompare = async (chatHistory) => {
//   try {
//     // Lấy câu người dùng cuối cùng trong lịch sử
//     const lastUserMsg =
//       chatHistory.reverse().find((msg) => msg.type === "user")?.text || "";

//     const query = encodeURIComponent(lastUserMsg);
//     const response = await fetch(`${API_URL}/with-search?query=${query}`, {
//       method: "GET",
//       headers: {
//         Accept: "*/*",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(await response.text());
//     }

//     const json = await response.json();
//     return json.data;
//   } catch (error) {
//     console.error("Error fetching AI compare:", error);
//     throw error;
//   }
// };

// export const fetchChatAICompare = async (query) => {
//   try {
//     const response = await fetch(
//       `${API_URL}-2?query=${encodeURIComponent(query)}`,
//       {
//         method: "GET",
//         headers: {
//           Accept: "*/*",
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(await response.text());
//     }

//     const json = await response.json();
//     return json.data;
//   } catch (error) {
//     console.error("Error fetching AI compare:", error);
//     throw error;
//   }
// };

// export const fetchChatAICompare = async (text) => {
//   try {
//     const queryParam = encodeURIComponent(text);
//     const response = await fetch(`${API_URL}-2?query=${queryParam}`, {
//       method: "GET",
//       headers: {
//         Accept: "*/*",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(await response.text());
//     }

//     const json = await response.json();
//     console.log("AI compare response:", json);
//     return json.data;
//   } catch (error) {
//     console.error("Error fetching AI compare:", error);
//     throw error;
//   }
// };

export const fetchChatAICompare = async(text, history)=>{
  try{
    const res=await fetch(`${API_URL}-2`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        query: text,
        history: history.map(h => ({
        user: h.user,
        assistant: h.assistant || "..."
      }))
    })
    });
    if(!res.ok){
      throw new Error(await res.text())      
    }
    const json=await res.json();
    console.log("AI compare response: ",json);
    return json.data;
  }catch(error){
    console.error("Error fetching AI compare: ", error);
    throw error;
  }
}