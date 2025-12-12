const API_URL = `/api/v1/ai/chat`;

export const fetchChatAI = async(text, history)=>{
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

export const fetchChatAICompareProduct = async (productIds = [], query = "") => {
  try {
    const params = new URLSearchParams();

    productIds.forEach(id => params.append("productId", id));

    params.append("query", query);

    const res = await fetch(`/api/v1/ai/compare?` + params.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const json = await res.json();
    console.log("AI compare response:", json);

    return json.data;
  } catch (err) {
    console.error("Error fetching AI product compare: ", err);
    throw err;
  }
};