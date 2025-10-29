import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user from JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }), 
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate input with Zod schema
    const inputSchema = z.object({
      userId: z.string().uuid(),
      role: z.enum(['student', 'faculty', 'admin']),
      fullName: z.string().min(2).max(100),
      email: z.string().email().max(255),
      branch: z.string().max(100).optional(),
      year: z.number().int().min(1).max(5).optional(),
      department: z.string().max(100).optional(),
    });

    const requestBody = await req.json();
    const validatedData = inputSchema.parse(requestBody);
    const { userId, role, fullName, email, branch, year, department } = validatedData;

    // Verify user can only initialize their own data
    if (user.id !== userId) {
      return new Response(
        JSON.stringify({ error: 'Cannot initialize data for another user' }), 
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Initializing user data for:", userId, role);

    // Initialize data based on role
    if (role === "student") {
      // Create sample classes for the student
      const { data: subjects } = await supabase
        .from("subjects")
        .select("id")
        .limit(5);

      if (subjects && subjects.length > 0) {
        // Enroll in sample classes
        for (const subject of subjects) {
          const { data: existingClass } = await supabase
            .from("classes")
            .select("id")
            .eq("subject_id", subject.id)
            .maybeSingle();

          if (existingClass) {
            await supabase.from("class_enrollments").insert({
              student_id: userId,
              class_id: existingClass.id,
            });
          }
        }
      }

      // Create sample timetable entries
      const daysOfWeek = [1, 2, 3, 4, 5]; // Monday to Friday
      const { data: rooms } = await supabase.from("rooms").select("id").limit(3);

      if (rooms && rooms.length > 0) {
        for (let i = 0; i < 5; i++) {
          const startHour = 9 + (i % 3);
          const startTime = `${startHour.toString().padStart(2, "0")}:00:00`;
          const endTime = `${(startHour + 1).toString().padStart(2, "0")}:00:00`;

          // Get enrolled classes
          const { data: enrolledClasses } = await supabase
            .from("class_enrollments")
            .select("class_id")
            .eq("student_id", userId)
            .limit(5);

          if (enrolledClasses && enrolledClasses[i]) {
            await supabase.from("timetable_entries").insert({
              class_id: enrolledClasses[i].class_id,
              day_of_week: daysOfWeek[i % 5],
              start_time: startTime,
              end_time: endTime,
              room_id: rooms[i % rooms.length].id,
            });
          }
        }
      }

      // Auto-join a house (randomly assign)
      const { data: houses } = await supabase.from("houses").select("id");
      if (houses && houses.length > 0) {
        const randomHouse = houses[Math.floor(Math.random() * houses.length)];
        await supabase.from("house_memberships").insert({
          user_id: userId,
          house_id: randomHouse.id,
        });
      }
    } else if (role === "faculty") {
      // Create sample subjects for faculty
      const { data: subjects } = await supabase
        .from("subjects")
        .select("id")
        .eq("department", department || "Computer Science")
        .limit(2);

      if (subjects && subjects.length > 0) {
        for (const subject of subjects) {
          await supabase.from("classes").insert({
            subject_id: subject.id,
            faculty_id: userId,
            semester: 1,
            year: new Date().getFullYear(),
            academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
            section: "A",
          });
        }
      }
    }

    console.log("User data initialized successfully for:", userId);

    return new Response(
      JSON.stringify({ success: true, message: "User data initialized" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[INTERNAL] Error initializing user data:", error);
    
    // Handle Zod validation errors specifically
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid input data provided",
          details: error.errors 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: "An error occurred processing your request. Please try again."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
