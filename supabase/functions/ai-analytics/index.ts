import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schemas with strict limits
const attendancePatternsSchema = z.object({
  records: z.array(z.object({
    date: z.string().max(50),
    present: z.boolean(),
    subject: z.string().max(100).optional(),
  })).max(1000), // Limit array size to prevent token exhaustion
  studentId: z.string().uuid().optional(),
  timeframe: z.string().max(50).optional(),
});

const eventEngagementSchema = z.object({
  eventName: z.string().min(1).max(200),
  registrations: z.number().min(0).max(100000),
  attendance: z.number().min(0).max(100000),
  feedback: z.array(z.string().max(500)).max(100).optional(),
  category: z.string().max(100).optional(),
});

const performancePredictionSchema = z.object({
  attendancePercentage: z.number().min(0).max(100),
  eventParticipation: z.number().min(0).max(1000),
  clubEngagement: z.number().min(0).max(100),
  recentTrend: z.string().max(50).optional(),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data, analysisType } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    // Validate and build prompts based on analysis type
    try {
      switch (analysisType) {
        case "attendance_patterns": {
          const validated = attendancePatternsSchema.parse(data);
          systemPrompt = "You are a data analyst specializing in educational analytics. Analyze attendance patterns and provide actionable insights in 2-3 sentences.";
          userPrompt = `Analyze this attendance data: ${JSON.stringify(validated)}`;
          break;
        }
        
        case "event_engagement": {
          const validated = eventEngagementSchema.parse(data);
          systemPrompt = "You are an event analytics specialist. Provide insights on event engagement and suggestions for improvement in 2-3 sentences.";
          userPrompt = `Analyze event data: ${JSON.stringify(validated)}`;
          break;
        }
        
        case "performance_prediction": {
          const validated = performancePredictionSchema.parse(data);
          systemPrompt = "You are an academic advisor. Based on attendance and engagement, provide brief performance insights and recommendations.";
          userPrompt = `Student metrics: ${JSON.stringify(validated)}`;
          break;
        }
        
        default:
          return new Response(
            JSON.stringify({ error: "Invalid analysis type" }), 
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
      }
    } catch (validationError) {
      console.error("Input validation failed:", validationError);
      return new Response(
        JSON.stringify({ error: "Invalid input data format" }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("AI gateway error:", response.status, error);
      throw new Error("AI gateway error");
    }

    const aiData = await response.json();
    const insights = aiData.choices[0].message.content;

    return new Response(
      JSON.stringify({ insights }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[INTERNAL] Error generating analytics insights:", error);
    return new Response(
      JSON.stringify({ 
        error: "An error occurred processing your request. Please try again."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
