import type { NextAuthConfig } from 'next-auth';

const baseURL = process.env.API_URL;

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl, destination, url } }) {
            const isLoggedIn = !!auth?.user;
            if (nextUrl.pathname.startsWith('/undefined')) return true;
            const isInChat = nextUrl.pathname.startsWith('/chat');
            if (isInChat) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else {
                if (isLoggedIn) {
                    return Response.redirect(new URL('/chat', nextUrl));
                }
                else return true;
            }
        },
        async jwt({ token, user }) {
            if (token && user) {
                const result = await fetchToken(token.sub!);
                token.token = result.token;
            }
            const newToken = { ...token };
            return { ...newToken };
        },
        async session({ session, token }) {
            session.user.token = token.token as string;
            const newSession = { ...session };
            return { ...newSession };
        }
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

const fetchToken = async (id: string) => await fetch(`${baseURL}/User/Token`, {
    "body": JSON.stringify({ id: id }),
    "method": "POST",
    headers: {
        "Content-Type": "application/json",
    }
}).then(data => data.json())

const parseJwt = (token: string) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}