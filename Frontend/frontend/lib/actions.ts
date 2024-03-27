'use server';
import { auth, signIn, signOut } from '../auth';
import { AuthError } from 'next-auth';
import { ControlResponse } from './definitions';
import useFetch from './apiClient';
export async function authenticate(
    formData: { email: string, password: string },
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

const APIKEY = process.env.SERVER_APIKEY;

export const LogIn = async (values: { email: string, password: string }) => authenticate(values)

export async function checkEmail(email: string) {
    try {
        return await useFetch("user/control/email", "GET", { value: email }, undefined, APIKEY)
    } catch (e) {
        console.debug(e)
        return false;
    }
}

export const checkUsername = async (userName: string) => {
    return await await useFetch("user/control/username", "GET", { value: userName }, undefined, APIKEY)
}

export const LogOut = async () => await signOut();