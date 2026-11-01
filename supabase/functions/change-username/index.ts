import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const jsonResponse = (body: object, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });

  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return jsonResponse({ error: "Tidak terautentikasi" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Client untuk memverifikasi pengguna
    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Client admin hanya digunakan di server
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const {
      data: { user },
      error: authError,
    } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return jsonResponse({ error: "Session tidak valid" }, 401);
    }

    const { username } = await req.json();

    const newUsername = String(username ?? "")
      .trim()
      .toLowerCase();

    if (!/^[a-z0-9_]{3,20}$/.test(newUsername)) {
      return jsonResponse(
        {
          error: "Username harus 3-20 karakter, huruf, angka, atau underscore",
        },
        400,
      );
    }

    // Periksa apakah username sudah digunakan
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("username", newUsername)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingProfile && existingProfile.id !== user.id) {
      return jsonResponse({ error: "Username sudah digunakan" }, 409);
    }

    const newEmail = `${newUsername}@chill-user.example.com`;

    // Perbarui email internal Supabase Auth
    const { error: authUpdateError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        email: newEmail,
        email_confirm: true,
        user_metadata: {
          ...user.user_metadata,
          username: newUsername,
        },
      });

    if (authUpdateError) throw authUpdateError;

    // Perbarui username pada tabel profiles
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ username: newUsername })
      .eq("id", user.id);

    if (profileError) {
      // Kembalikan email Auth jika update profil gagal
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        email: user.email!,
        email_confirm: true,
        user_metadata: user.user_metadata,
      });

      throw profileError;
    }

    return jsonResponse({
      success: true,
      username: newUsername,
    });
  } catch (error) {
    console.error(error);

    return jsonResponse({ error: "Gagal memperbarui username" }, 500);
  }
});
