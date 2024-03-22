import type { NextAuthConfig, User } from 'next-auth';
import jwt from 'jsonwebtoken'
import { JWT } from 'next-auth/jwt';
import { SignJWT } from 'jose';

const GenerateToken = (user: User, parentJWT: JWT) => {
    return jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.NEXTAUTH_SECRET,
        {
            subject: user.id,
            audience: process.env.AUDIENCE,
            issuer: process.env.ISSUER,
            expiresIn: "1d",
        }
    );
}

const RefreshToken = async (token: string) => {

    const secret = new TextEncoder().encode(
        process.env.NEXTAUTH_SECRET
    )
    const alg = 'HS256'
    var info = parseJwt(token)

    return await new SignJWT({ id: info.id, name: info.name, email: info.email }) // details to  encode in the token
        .setProtectedHeader({ alg }) // algorithm
        .setIssuedAt()
        .setIssuer("http://localhost:3000") // issuer
        .setAudience("http://localhost:5144") // audience
        .setExpirationTime("1 day") // token expiration time, e.g., "1 day"
        .sign(secret); // secretKey generated from previous step
}

const VerifyToken = (token: string) => (parseJwt(token).exp * 1000) < Date.now()



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
        async jwt({ token, user, session, trigger }) {
            const validSession = true;
            if (trigger === 'signIn') {
                token.token = GenerateToken(user, token);
            }
            
            if (token && token.token !== undefined) {
                const innerToken = token.token as string;
                if (!VerifyToken(innerToken)) {
                    token.Token = RefreshToken(innerToken);
                }
            }
            const newToken = { ...token };
            const newSession = { ...session };
            return { ...newToken, ...newSession };
        },
        async session({ session, token }) {
            session.user.token = token.token as string;
            const newSession = { ...session };
            return { ...newSession };
        }
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

const parseJwt = (token: string) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}