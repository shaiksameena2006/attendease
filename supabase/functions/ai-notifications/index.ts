import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schemas
const attendanceReminderSchema = z.object({
  className: z.string().min(1).max(200),
  time: z.string().min(1).max(50),
});

const eventSuggestionSchema = z.object({
  eventName: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
});

const attendanceInsightsSchema = z.object({
  percentage: z.number().min(0).max(100),
  trend: z.string().min(1).max(50),
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

    const { type, context } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    // Validate and build prompts based on type
    try {
      switch (type) {
        case "attendance_reminder": {
          const validated = attendanceReminderSchema.parse(context);
          systemPrompt = "You are a friendly campus assistant. Generate a brief, encouraging attendance reminder notification (max 100 characters).";
          userPrompt = `Create a reminder for: ${validated.className} at ${validated.time}`;
          break;
        }
        
        case "event_suggestion": {
          const validated = eventSuggestionSchema.parse(context);
          systemPrompt = "You are a campus events coordinator. Suggest why a student should attend this event in one compelling sentence (max 120 characters).";
          userPrompt = `Event: ${validated.eventName}, Category: ${validated.category}`;
          break;
        }
        
        case "attendance_insights": {
          const validated = attendanceInsightsSchema.parse(context);
          systemPrompt = "You are an academic advisor. Provide brief, actionable insight about attendance (max 150 characters).";
          userPrompt = `Attendance: ${validated.percentage}%, Trend: ${validated.trend}`;
          break;
        }
        
        default:
          return new Response(
            JSON.stringify({ error: "Invalid notification type" }), 
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
      }
    } catch (validationError) {
      console.error("Input validation failed:", validationError);
      return new Response(
        JSON.stringify({ error: "Invalid input data" }), 
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
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("AI gateway error:", response.status, error);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ notification: generatedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[INTERNAL] Error generating notification:", error);
    return new Response(
      JSON.stringify({ 
        error: "An error occurred processing your request. Please try again."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
