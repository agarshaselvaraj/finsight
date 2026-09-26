"use client";
import React, { useState } from 'react';
import AppSnackbar from '../common/AppSnackbar';
import axios from "axios";
import { Button, TextField, Box, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import { API_BASE_URL } from '../../services/api';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" as "success" | "error" | "warning" | "info" });
    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setSnackbar({ open: true, message: "All fields required", severity: "error" })
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/user/login`,
                {
                    email,
                    password
                }
            );
            if (response.data?.user?.token) {
                localStorage.setItem("token", response.data.user.token);
            }
            setSnackbar({ open: true, message: response.data?.message || "Logged in successfully!", severity: "success" });

            setEmail("");
            setPassword("");
            router.push("/dashboard");
        } catch (error: any) {
            const errorMessage =
                typeof error.response?.data === "string"
                    ? error.response.data
                    : error.response?.data?.message || error.message || "Failed to login";
            setSnackbar({ open: true, message: errorMessage, severity: "error" });
        }
    }
    return (
        <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#9f01ff", px: 2 }}>
            < Box component="form" sx={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: 2, p: 4, border: "1px solid #ddd", borderRadius: 3, boxShadow: 3, backgroundColor: "white" }} onSubmit={handleSubmit} >
                <Typography variant="h4">Sign in</Typography>

                <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Button onClick={() => router.push('/signup')}>Sign Up</Button>
                    <Button type='submit'>Sign in</Button>
                </Box>

            </Box>
            <AppSnackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleSnackbarClose} />
        </Box >
    );
}