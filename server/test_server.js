const axios = require('axios');

async function testServer() {
    try {
        console.log('Testing server connection...');

        // Test 1: Server health
        const health = await axios.get('http://localhost:5000/');
        console.log('✓ Server is running:', health.data);

        // Test 2: Registration
        console.log('\nTesting registration...');
        const regData = {
            name: 'Test User',
            email: 'testuser@test.com',
            password: 'test123',
            phone: '1234567890',
            role: 'citizen'
        };

        const regResponse = await axios.post('http://localhost:5000/api/auth/register', regData);
        console.log('✓ Registration successful:', regResponse.data);

        // Test 3: Login
        console.log('\nTesting login...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'testuser@test.com',
            password: 'test123'
        });
        console.log('✓ Login successful:', loginResponse.data);

    } catch (error) {
        console.error('✗ Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

testServer();
