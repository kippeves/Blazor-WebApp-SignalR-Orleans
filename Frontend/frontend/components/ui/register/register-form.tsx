'use client';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { TextField, Button, Box } from '@mui/material';
import { checkEmail } from '../../../lib/actions';
import { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';




export default function RegisterForm() {

    const VerifyEmail = useCallback(async (value: string, values: yup.TestContext<any>) => {
        try {
            if (value === undefined) return false;
            return await checkEmail(value)
        } catch (e) {
            return false;
        }
    }, []);

    const debouncedFunction = useMemo(() => {
        return _.debounce(VerifyEmail, 1000);
    }, [VerifyEmail]);


    const validationSchema = yup.object({
        email: yup
            .string()
            .default("")
            .email('Enter a valid email')
            .required('Email is required')
            .test('verified', 'Email is already registered', async (value, values) => {
                if (value === undefined || value === "") return true;
                var result = await debouncedFunction(value as string, values);
                console.log(result)
                return result;
            }),
        username: yup
            .string()
            .default("")
            .required('Username is required'),
        password: yup
            .string()
            .default("")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/, "Your password must be 8 characters long, have one number, one uppercase character, one lowercase character, and one special character")
            .required('Password is required'),
        passwordConfirm: yup
            .string()
            .oneOf([yup.ref('password'), null], "Password must match")
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: '',
            passwordConfirm: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (data) => {
            console.log(data)
        },
    });


    return (

        <Box component={"form"} onSubmit={formik.handleSubmit} >
            <TextField
                id="email"
                name="email"
                label="Email"
                fullWidth
                required
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={(formik.touched.email && formik.errors.email) ?? " "}
                margin='dense'
            />

            <TextField
                id="username"
                name="username"
                label="Username"
                fullWidth
                required
                autoComplete=''
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={(formik.touched.username && formik.errors.username) ?? " "}
                margin='dense'
            />

            <TextField
                id="password"
                name="password"
                label="Password"
                type="password"
                fullWidth
                required
                autoComplete=''
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={(formik.touched.password && formik.errors.password) ?? " "}
                margin='dense'
            />
            <TextField
                id="passwordConfirm"
                name="passwordConfirm"
                label="Password Confirm"
                type="password"
                fullWidth
                required
                autoComplete=''
                value={formik.values.passwordConfirm}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.passwordConfirm && Boolean(formik.errors.passwordConfirm)}
                helperText={(formik.touched.passwordConfirm && formik.errors.passwordConfirm) ?? " "}
                margin='dense'
            />
            <Button color="primary" variant={"contained"} fullWidth type="submit">
                Register
            </Button>
        </Box >
    )
}