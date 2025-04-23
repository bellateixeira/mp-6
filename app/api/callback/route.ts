/* Handles GitHub redirect and access token exchange */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
        return NextResponse.json({ error: "Missing code parameter" }, { status: 400 });
    }

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: process.env.REDIRECT_URI,
        }),
    });

    const tokenData = await tokenRes.json();
    const access_token = tokenData.access_token;

    if (!access_token) {
        return NextResponse.json({ error: "Token exchange failed" }, { status: 400 });
    }

    // Redirect to home with token in URL
    return NextResponse.redirect(`/?token=${access_token}`);
}
