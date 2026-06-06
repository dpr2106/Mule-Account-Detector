import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();
    
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { reply: "Groq API key is missing. Please add GROQ_API_KEY to your .env.local file." }
      );
    }

    // System prompt guiding the LLM
    const systemPrompt = {
      role: "system",
      content: `You are Vespa Copilot, a strictly restricted AI assistant for a Financial Intelligence Unit analyzing money mule activity. 
      CRITICAL RULE: You MUST ONLY answer questions related to financial investigations, money laundering, transaction risk scores, or the Vespa dashboard. 
      If the user asks casual questions (like "are you real", "how are you", or general knowledge), you must firmly refuse and state: "My protocols restrict me to financial intelligence and threat analysis only."
      Keep your answers concise, professional, and cyber-security focused. 
      If the user asks about a specific transaction, use the provided context to sound like you are analyzing XGBoost risk scores.
      Current Context: ${context || 'General inquiry'}`
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // Updated to the current supported fast model
        messages: [systemPrompt, ...messages],
        temperature: 0.5,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return NextResponse.json({ reply: data.choices[0].message.content });
    } else {
      console.error("Groq API Error:", data);
      const errorMessage = data.error?.message || "Received an unexpected response from the AI.";
      return NextResponse.json({ reply: `API Error: ${errorMessage}` });
    }
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ reply: "Failed to connect to the Groq Neural Network." }, { status: 500 });
  }
}
