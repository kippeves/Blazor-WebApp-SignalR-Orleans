'use server';
import { auth, signIn } from '../auth';
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
        const { data, status } = await useFetch("user/control/email", "GET", { value: email }, undefined, APIKEY)
        if (status === undefined) return data;
    } catch (e) {
        console.debug(e)
        return false;
    }
}

export const checkUsername = async (userName: string) => {
    const { data, status } = await await useFetch("user/control/username", "GET", { value: userName }, undefined, APIKEY)
    if (status === undefined)
        return data;
}
