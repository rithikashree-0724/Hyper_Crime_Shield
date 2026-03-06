const fs = require('fs');
fs.writeFileSync('test_write.txt', 'Runtime is working at ' + new Date().toISOString());
console.log('Test write successful');
