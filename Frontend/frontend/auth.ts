import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { User } from './app/lib/definitions';
async function LoginUser(login: LoginRequest): Promise<User | undefined> {
    try {
        let Result = await fetch(`${process.env.API_URL}/User/Control`, {
            "body": JSON.stringify(login),
            "method": "POST",
            headers: {
                "Content-Type": "application/json",
            }
        }).then().then(data => data.json()).then(x => x as User);
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
                if (result == undefined) { return null; }
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
