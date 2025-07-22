import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 👇 Fonction Edge Supabase (Deno)
serve(async (req) => {
  const body = await req.json();
  const { email, password, username, entreprise_id, role } = body;

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError || !user.user) {
    return new Response(JSON.stringify({ error: authError?.message }), { status: 400 });
  }

  const userId = user.user.id;

  const { error: insertError } = await supabaseAdmin.from("users").insert({
    id: userId,
    username,
    role,
    entreprise_id
  });

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 400 });
  }

  const { error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: {
      role,
      entreprise_id
    }
  });

  if (metadataError) {
    return new Response(JSON.stringify({ error: metadataError.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
