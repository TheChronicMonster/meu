import React, { useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';

const Auth = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? 'login' : 'signup';
      const response = await axios.post(`http://localhost:5001/auth/${endpoint}`, {
        username,
        password,
      });
      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'An error occurred');
    }
  };

  const handleMetaMaskLogin = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        console.log('Connected account:', account);
        // Further logic to handle MetaMask authentication if needed
      } catch (err) {
        console.error('User denied account access');
      }
    } else {
      console.error('MetaMask is not installed');
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Create an account' : 'Have an account? Login'}
      </button>
      <button onClick={handleMetaMaskLogin}>Connect with MetaMask</button>
    </div>
  );
};

export default Auth;
