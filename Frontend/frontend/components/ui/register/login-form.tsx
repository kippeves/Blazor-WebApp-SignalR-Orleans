'use client';
import { LogIn } from '../../../lib/actions';

import * as yup from 'yup';
import { useFormik } from 'formik';
import { TextField, Button, Box } from '@mui/material';

export default function LoginForm() {

  const validationSchema = yup.object({
    email: yup
      .string()
      .default('Enter your email')
      .email('Enter a valid email')
      .required('Email is required'),
    password: yup
      .string()
      .default('Enter your password')
      .min(8, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      var result = await LogIn(data);
      //      alert(JSON.stringify(values, null, 2));
    },
  });

  return (

    <Box component={"form"} onSubmit={formik.handleSubmit}>
      <TextField
        id="email"
        name="email"
        label="Email"
        fullWidth
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={(formik.touched.email && formik.errors.email) ?? " "}
        margin='dense'
      />

      <TextField
        id="password"
        name="password"
        label="Password"
        type="password"
        fullWidth
        autoComplete=''
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={(formik.touched.password && formik.errors.password) ?? " "}
        margin='normal'
      />
      <Button color="primary" variant={"contained"} fullWidth type="submit">
        Submit
      </Button>
    </Box>
  )
}