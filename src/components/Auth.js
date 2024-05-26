import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await axios.post('http://localhost:5001/auth/signup', { username, password });
      alert('User created successfully');
    } catch (error) {
      alert('Error creating user');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5001/auth/login', { username, password });
      setToken(response.data.token);
    } catch (error) {
      alert('Error logging in');
    }
  };

  return (
    <div>
      <h2>Sign Up / Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Auth;
