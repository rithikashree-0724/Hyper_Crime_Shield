const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function runVerification() {
    console.log('🚀 Starting Backend Verification...');

    try {
        // 1. Register a Test User
        console.log('\n--- 1. Testing Registration ---');
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Citizen',
            email: `test_citizen_${Date.now()}@example.com`,
            password: 'password123',
            role: 'citizen',
            phone: '1234567890'
        });
        console.log('✅ Registration Successful:', regRes.data.success);
        const token = regRes.data.token;

        // 2. Login
        console.log('\n--- 2. Testing Login ---');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: regRes.data.user.email,
            password: 'password123'
        });
        console.log('✅ Login Successful:', loginRes.data.success);

        // 3. Create a Crime Report
        console.log('\n--- 3. Testing Crime Report Creation ---');
        const reportRes = await axios.post(`${API_URL}/reports`, {
            title: 'Test Theft',
            description: 'Someone stole my test cases.',
            category: 'Theft',
            severity: 'low',
            location: 'London',
            isAnonymous: false,
            incidentDate: new Date()
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Report Created:', reportRes.data.success, 'ID:', reportRes.data.data.complaintId);

        // 4. Fetch Reports
        console.log('\n--- 4. Testing Report Fetching ---');
        const fetchRes = await axios.get(`${API_URL}/reports`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Fetched Reports Count:', fetchRes.data.data.length);

        console.log('\n✨ All Core Backend Systems Verified Perfectly!');
    } catch (err) {
        console.error('\n❌ Verification Failed:');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', JSON.stringify(err.response.data, null, 2));
        } else {
            console.error(err.message);
        }
        console.log('\n⚠️ Make sure the server is running on http://localhost:5000 before running this script.');
    }
}

runVerification();
