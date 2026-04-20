const fetch = require('node-fetch').default || require('node-fetch');

// const API_URL = 'http://localhost:8080/api';
const API_URL = 'https://cms-6eiy.onrender.com/api';

async function test() {
  try {
    // Step 1: Login
    console.log('1. Testing login...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'company1@gmail.com',
        password: 'password123'
      })
    });

    if (!loginRes.ok) {
      console.error('Login failed:', loginRes.status, await loginRes.text());
      return;
    }

    const loginData = await loginRes.json();
    console.log('✓ Login successful');
    console.log('Token:', loginData.data.token.substring(0, 20) + '...');
    const token = loginData.data.token;

    // Step 2: Test /auth/me
    console.log('\n2. Testing GET /auth/me...');
    const meRes = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!meRes.ok) {
      console.error('GET /auth/me failed:', meRes.status);
      const errorText = await meRes.text();
      console.error('Error:', errorText);
      return;
    }

    const meData = await meRes.json();
    console.log('✓ GET /auth/me successful');
    console.log('Response:', JSON.stringify(meData.data, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
