// src/components/Login.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Link } from '@mui/material';
import AuthService from '../services/AuthService';

const Login = ({ onLogin }) => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await AuthService.login(mail, password);
            if (response.status === 200) {
                // 只调用onLogin，不再自己导航
                onLogin();
            }
        } catch (error) {
            console.error('Login failed', error);
            setError('登录失败，请检查邮箱和密码');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            {error && (
                <Typography color="error" align="center" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
            <form onSubmit={handleSubmit}>
                {/* 表单内容不变 */}
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="mail"
                    label="Email Address"
                    name="mail"
                    autoComplete="email"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    Sign In
                </Button>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Don't have an account?{' '}
                    <Link href="/signup" variant="body2">
                        Sign up here
                    </Link>
                </Typography>
            </form>
        </Container>
    );
};

export default Login;
