async function test() {
    try {
        console.log('Testing Login...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'any'
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login Success, Token:', token.substring(0, 20) + '...');

        console.log('Testing Fetch Reports...');
        const reportsRes = await fetch('http://localhost:5000/api/reports', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const reportsData = await reportsRes.json();
        console.log('Reports Found:', reportsData.length);
        console.log('First Report:', reportsData[0].title);
    } catch (err) {
        console.error('Test Failed:', err.message);
    }
}

test();
