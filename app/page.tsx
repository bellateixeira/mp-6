/* Main page with login button and user info */
'use client';

import { useEffect, useState } from 'react';

// Define a TypeScript type for the GitHub user data we expect
type GitHubUser = {
    login: string;
    name: string;
    email: string;
    avatar_url: string;
};

export default function Home() {

    // React state to store the user object or null if not signed in
    const [user, setUser] = useState<GitHubUser | null>(null);

    // On page load, check if an access token is in the URL and fetch user data
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search); // Get query params from URL
        const token = urlParams.get("token"); // Extract the access token

        if (token) {
            // Call GitHub API to get user info using the token
            fetch("https://api.github.com/user", {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass token in Authorization header
                },
            })
                .then(res => res.json()) // Convert response to JSON
                .then(data => {
                    // Extract and set only the user fields we care about
                    const githubUser: GitHubUser = {
                        login: data.login,
                        name: data.name,
                        email: data.email,
                        avatar_url: data.avatar_url,
                    };
                    setUser(githubUser); // Store user data in state
                });
        }
    }, []);

    // Function to redirect user to GitHub OAuth login page
    const handleLogin = () => {
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&scope=read:user user:email`;
        window.location.href = authUrl;  // Navigate to GitHub login
    };

    // If user is logged in, show their profile
    if (user) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
                <h1 className="text-3xl font-bold mb-4">Hello, {user.name}</h1>
                <img src={user.avatar_url} alt="avatar" className="w-28 h-28 rounded-full mb-4" />
                <p className="text-lg"><strong>Username:</strong> {user.login}</p>
                <p className="text-lg"><strong>Email:</strong> {user.email || "Not available"}</p>
            </main>
        );
    }

    // If no user is logged in, show login button
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <h1 className="text-4xl font-bold">Welcome to CS391 OAuth App</h1>
            <p className="mt-2 text-gray-600">Click below to sign in with GitHub</p>
            <button
                onClick={handleLogin}
                className="mt-6 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
                Login with GitHub
            </button>
        </main>
    );
}
