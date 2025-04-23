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
        <main style={{ textAlign: 'center', marginTop: '5rem' }}>
          <h1>Hello, {user.name}</h1>
          <img src={user.avatar_url} width={100} alt="avatar" />
          <p>Username: {user.login}</p>
          <p>Email: {user.email}</p>
        </main>
    );
  }

    // If no user is logged in, show login button
    return (
      <main style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h1>Welcome to CS391 OAuth App</h1>
        <button onClick={handleLogin}>Login with GitHub</button>
      </main>
    );
}
