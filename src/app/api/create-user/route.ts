import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { email, username, password, role, entreprise_id } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Créer l'utilisateur dans auth
    const { data: user, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { username, role, entreprise_id },
    });

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    // Insérer dans table `users`
    const { error: insertError } = await supabase.from('users').insert({
      id: user.user?.id,
      username,
      role,
      entreprise_id,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Utilisateur créé avec succès !' }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
