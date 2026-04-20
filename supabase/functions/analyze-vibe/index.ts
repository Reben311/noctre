// Edge function: analyzes an uploaded image and returns a rich "vibe" reading
// + song recommendations + caption ideas via the Lovable AI Gateway.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are StorySound — an elite creative director and music curator for social media.
Given an image, you read its mood, atmosphere, aesthetic, time of day, fashion cues, color temperature,
and overall emotional energy, then recommend songs that fit perfectly for Instagram Stories, TikTok, etc.

Be tasteful, modern, emotionally intelligent. Think editorial fashion magazine meets Spotify tastemaker.
Recommend a mix of trending, timeless, indie, and (when relevant) OPM tracks. Always use REAL songs and REAL artists.
Match percentages should feel believable (76-99). Keep all copy elegant — never cringe, never robotic.`;

const TOOL = {
  type: "function",
  function: {
    name: "return_vibe_analysis",
    description: "Return a complete StorySound analysis for the uploaded image.",
    parameters: {
      type: "object",
      properties: {
        vibeReading: {
          type: "string",
          description: "1-2 sentence stylish, cinematic description of the image's feeling.",
        },
        mood: {
          type: "object",
          properties: {
            emotionalTone: { type: "string" },
            energyLevel: { type: "string", enum: ["low", "mellow", "balanced", "elevated", "high"] },
            socialVibe: { type: "string" },
            visualTemperature: { type: "string", enum: ["cold", "cool", "neutral", "warm", "hot"] },
            confidence: { type: "number", description: "0-100" },
            chill: { type: "number", description: "0-100" },
            hype: { type: "number", description: "0-100" },
            melancholy: { type: "number", description: "0-100" },
          },
          required: ["emotionalTone", "energyLevel", "socialVibe", "visualTemperature", "confidence", "chill", "hype", "melancholy"],
          additionalProperties: false,
        },
        aesthetics: {
          type: "array",
          description: "2-4 aesthetic labels like 'clean girl', 'cinematic night drive', 'soft luxury'.",
          items: { type: "string" },
        },
        topMatches: {
          type: "array",
          description: "Top 5 song matches.",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              artist: { type: "string" },
              why: { type: "string", description: "1 sentence on why it fits." },
              matchPercent: { type: "number" },
              category: {
                type: "string",
                enum: ["Main Character", "Soft / Chill", "Sad / Reflective", "Romantic", "Cool / Confident", "Trendy / Viral", "OPM"],
              },
              bestForStory: { type: "boolean" },
            },
            required: ["title", "artist", "why", "matchPercent", "category", "bestForStory"],
            additionalProperties: false,
          },
        },
        moreRecommendations: {
          type: "array",
          description: "10 more song picks across varied categories.",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              artist: { type: "string" },
              why: { type: "string" },
              matchPercent: { type: "number" },
              category: {
                type: "string",
                enum: ["Main Character", "Soft / Chill", "Sad / Reflective", "Romantic", "Cool / Confident", "Trendy / Viral", "OPM"],
              },
              bestForStory: { type: "boolean" },
            },
            required: ["title", "artist", "why", "matchPercent", "category", "bestForStory"],
            additionalProperties: false,
          },
        },
        captions: {
          type: "object",
          properties: {
            short: { type: "array", items: { type: "string" } },
            classy: { type: "array", items: { type: "string" } },
            playful: { type: "array", items: { type: "string" } },
            minimalist: { type: "array", items: { type: "string" } },
          },
          required: ["short", "classy", "playful", "minimalist"],
          additionalProperties: false,
        },
        postingSuggestion: {
          type: "string",
          description: "1-2 sentences on how to post this for max impact.",
        },
      },
      required: ["vibeReading", "mood", "aesthetics", "topMatches", "moreRecommendations", "captions", "postingSuggestion"],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, platform } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "imageBase64 is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const userPrompt = `Analyze this image for a ${platform || "Instagram Story"} post. Return the full StorySound analysis using the provided tool. Give 5 top matches and 10 more recommendations spanning different moods.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              { type: "image_url", image_url: { url: imageBase64 } },
            ],
          },
        ],
        tools: [TOOL],
        tool_choice: { type: "function", function: { name: "return_vibe_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in your workspace settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "AI did not return structured output" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const analysis = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-vibe error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
