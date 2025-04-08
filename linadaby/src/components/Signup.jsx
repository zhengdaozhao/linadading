// src/components/Signup.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Link, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
  
const Signup = ({ onSignup }) => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [team, setTeam] = useState('team1');
    const [isManager, setIsManager] = useState(false);
    const success1 = () => {
        messageApi.open({
          type: 'success',
          content: '您已成功注册,请登录您的账户',
        });
      };
      const error1 = () => {
        messageApi.open({
          type: 'error',
          content: '请检查您的输入并重试',
        });
      };    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthService.register(mail, password,team,isManager);
            if (response.status === 200) {
                // Show success notification
                success1();

                // Redirect to login page
                navigate('/login');
            }
        } catch (error) {
            // console.error('Signup failed', error);
            // Show error notification
            error1();
        }
    };

    return (
        <>
            {contextHolder}
            <Container component="main" maxWidth="xs">
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <form onSubmit={handleSubmit}>
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
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel id="demo-simple-select-label">Team</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={team}
                            onChange={(e) => setTeam(e.target.value)}
                            label="Team"
                        >
                            <MenuItem value="team1">Team 1</MenuItem>
                            <MenuItem value="team2">Team 2</MenuItem>
                            <MenuItem value="team3">Team 3</MenuItem>
                            <MenuItem value="team4">Team 4</MenuItem>
                            <MenuItem value="team5">Team 5</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox checked={isManager} onChange={(e) => setIsManager(e.target.checked)} />}
                        label="Manager?"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Sign Up
                    </Button>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Already have an account?{' '}
                        <Link href="/login" variant="body2">
                            Sign in here
                        </Link>
                    </Typography>
                </form>
            </Container>
        </>
    );
};

export default Signup;