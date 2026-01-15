import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "market_summary") {
      // Full market summary for the stock
      systemPrompt = `You are a concise market analyst. Provide a 2-3 sentence summary of today's price action and key market narrative. Focus on what moved the stock and what to watch. Be direct and actionable. Never use markdown.`;
      
      const { symbol, price, changePercent, news, relativePerformance } = data;
      const newsHeadlines = news?.slice(0, 3).map((n: any) => n.headline).join("; ") || "No recent news";
      
      userPrompt = `${symbol} is trading at $${price?.toFixed(2)}, ${changePercent >= 0 ? 'up' : 'down'} ${Math.abs(changePercent)?.toFixed(2)}% today. ${relativePerformance >= 0 ? 'Outperforming' : 'Underperforming'} SPY by ${Math.abs(relativePerformance)?.toFixed(2)}%. Recent headlines: ${newsHeadlines}. Summarize today's price action and narrative.`;
    } else if (type === "catalyst_summary") {
      // Quick summary of a single news article
      systemPrompt = `You are a concise market analyst. Summarize this news headline in one short sentence explaining why it matters for the stock. Be direct. Never use markdown.`;
      
      const { headline, summary } = data;
      userPrompt = `Headline: "${headline}". ${summary ? `Summary: ${summary}` : ''} What's the key takeaway for investors?`;
    } else {
      throw new Error("Invalid summary type");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const result = await response.json();
    const summary = result.choices?.[0]?.message?.content || "Unable to generate summary.";

    return new Response(
      JSON.stringify({ summary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("AI summary error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
