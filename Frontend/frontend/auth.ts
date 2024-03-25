import NextAuth, { NextAuthConfig, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
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

    const secret = new TextEncoder().encode("QLh85oQpM+vHnfCttzYaNzhhddqe5T4rD/IuWoUCR4o=")
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
    basePath: "/api/auth",
    callbacks: {
        authorized({ auth, request: { nextUrl, destination, url } }) {
            const isLoggedIn = !!auth?.user;
            if (nextUrl.pathname.startsWith("/auth") && isLoggedIn) return true;
            if (nextUrl.pathname.startsWith("/Chat"))
                return Response.redirect(new URL('/chat', nextUrl));
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
            if (trigger === "signIn") {
                token.token = GenerateToken(user, token);
            }
            if (trigger === "update") {
                if (session?.user?.name !== undefined)
                    token.name = session.user.name;
            }

            if (token && token.token !== undefined) {
                const innerToken = token.token as string;
                if (VerifyToken(innerToken)) {
                    token.token = RefreshToken(innerToken);
                }
            }
            const newToken = { ...token, };
            const newSession = { ...session };
            return { ...newToken, ...newSession };
        },
        async session({ session, token }) {
            session.user.name = token.name;
            session.user.email = token.email;
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

async function LoginUser(login: LoginRequest): Promise<User | undefined> {
    try {
        let Result = await fetch(`${process.env.API_URL}/User/Control`, {
            "body": JSON.stringify(login),
            "method": "POST",
            headers: {
                "X-API-KEY": process.env.SERVER_APIKEY,
                "Content-Type": "application/json",
            }
        }).then().then(data => data.json());
        return Promise.resolve<User>(Result);
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [Credentials({
        async authorize(credentials) {
            const parsedCredentials = z
                .object({ email: z.string().email(), password: z.string().min(6) })
                .safeParse(credentials);
            if (parsedCredentials.success) {
                const result = await LoginUser({ email: parsedCredentials.data.email, password: parsedCredentials.data.password });
                if (result == undefined) return null;
                return result;
            }

            console.log('Invalid credentials');
            return null;
        }
    })],

});

type LoginRequest = {
    email: string,
    password: string
}
