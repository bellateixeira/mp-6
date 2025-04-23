/* Handles GitHub redirect and access token exchange */
import { NextRequest, NextResponse } from 'next/server';

// Runs when GitHub redirects back with ?code=... in the URL
export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code"); // Extract the code from query params

    if (!code) {
        // If no code is found, return an error response
        return NextResponse.json({ error: "Missing code parameter" }, { status: 400 });
    }

    // Send a POST request to GitHub to exchange the code for an access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            Accept: "application/json", // GitHub returns JSON if this header is set
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: process.env.REDIRECT_URI,
        }),
    });

    const tokenData = await tokenRes.json(); // Parse response as JSON
    const access_token = tokenData.access_token;  // Get the token from response

    if (!access_token) {
        // If token wasn't returned, return an error
        return NextResponse.json({ error: "Token exchange failed" }, { status: 400 });
    }

    // Redirect to home with token in URL
    return NextResponse.redirect(`/?token=${access_token}`);
}
