import { Card, CardContent, CardHeader, Container, Grid, Paper } from "@mui/material";
import LoginForm from "../../components/ui/register/login-form";
import { useFormik } from "formik";
import { brown } from "@mui/material/colors";
import LoginAndRegister from "../../components/ui/register/action-container";
import CenterGrid from "@/components/layout/centerGrid";

export default function Page() {
    return (
        <CenterGrid>
            <LoginAndRegister />
        </CenterGrid>

    );
}