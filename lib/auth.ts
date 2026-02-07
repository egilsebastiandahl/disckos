/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

const BACKEND = process.env.BACKEND_API_URL;

async function refreshAccessToken(token: any) {
  try {
    if (!BACKEND) throw new Error("BACKEND_API_URL not configured");
    if (!token?.refreshToken) throw new Error("No refresh token available");

    const res = await fetch(`${BACKEND}/admin/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    if (!res.ok) {
      throw new Error(`Failed to refresh token: ${res.status}`);
    }

    const data = await res.json();
    // Expect { accessToken, refreshToken, expiresIn }
    const newToken = {
      ...token,
      accessToken: data.token ?? data.accessToken ?? token.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      // store expiry as epoch ms
      accessTokenExpires: data.expiresIn ? Date.now() + data.expiresIn * 1000 : (data.expiresAt ? new Date(data.expiresAt).getTime() : token.accessTokenExpires),
    };

    return newToken;
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const backendUrl = process.env.BACKEND_API_URL;
        if (!backendUrl) return null;
        const res = await fetch(`${backendUrl}/admin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: credentials.username, password: credentials.password }),
        });
        if (!res.ok){
            const text = await res.text();
            console.error("Login failed:", res.status, text);
            return null;
        } 
        const data = await res.json();
        // Expect backend to return { user, token } (token optional)
        const user = data.user ?? data;
        // attach backend token to the returned user object so jwt callback can persist it
        if (data.token) (user as any).accessToken = data.token;
        if (data.refreshToken) (user as any).refreshToken = data.refreshToken;
        // support expiresIn (seconds) or expiresAt (ISO)
        if (data.expiresIn) (user as any).accessTokenExpires = Date.now() + data.expiresIn * 1000;
        if (data.expiresAt) (user as any).accessTokenExpires = new Date(data.expiresAt).getTime();
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign in, `user` will be the object returned from `authorize`
      if (user) {
        token.user = user as any;
        // persist access/refresh tokens coming from backend
        if ((user as any).accessToken) token.accessToken = (user as any).accessToken;
        if ((user as any).refreshToken) token.refreshToken = (user as any).refreshToken;
        if ((user as any).accessTokenExpires) token.accessTokenExpires = (user as any).accessTokenExpires;
        return token;
      }

      // Return previous token if the access token has not expired yet
      const accessTokenExpires = (token as any).accessTokenExpires;
      if (accessTokenExpires && Date.now() < accessTokenExpires) {
        return token;
      }

      // Access token has expired, attempt to refresh
      return await refreshAccessToken(token as any);
    },
    async session({ session, token }) {
      // expose user and backend tokens in the session object available server-side
      if (token && (token as any).user) session.user = (token as any).user;
      if ((token as any).accessToken) (session as any).accessToken = (token as any).accessToken;
      if ((token as any).refreshToken) (session as any).refreshToken = (token as any).refreshToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
