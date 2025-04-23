/* Main page with login button and user info */
'use client';

import { useEffect, useState } from 'react';

type GitHubUser = {
  login: string;
  name: string;
  email: string;
  avatar_url: string;
};

export default function Home() {
  const [user, setUser] = useState<GitHubUser | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
          .then(res => res.json())
          .then(data => {
            const githubUser: GitHubUser = {
              login: data.login,
              name: data.name,
              email: data.email,
              avatar_url: data.avatar_url,
            };
            setUser(githubUser);
          });
    }
  }, []);

  const handleLogin = () => {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&scope=read:user user:email`;
    window.location.href = authUrl;
  };

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

  return (
      <main style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h1>Welcome to CS391 OAuth App</h1>
        <button onClick={handleLogin}>Login with GitHub</button>
      </main>
  );
}
