const http = require('http');

const options = {
  hostname: 'localhost',
  port: 7001,
  path: '/api/auth',
  method: 'GET',
  timeout: 3000
};

console.log('Testing server connection...');
console.log(`Attempting to connect to: http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log(`Server is running! Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      console.log('Response data:', data);
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error connecting to server:');
  console.error(error.message);
  
  if (error.code === 'ECONNREFUSED') {
    console.error('\nServer is not running or not accessible on port 7001.');
    console.error('Please make sure the server is started with:');
    console.error('  cd backend && node server.js');
  } else if (error.code === 'ETIMEDOUT') {
    console.error('\nConnection timed out. The server may be running but is not responding.');
  }
});

req.on('timeout', () => {
  console.error('Request timed out. The server may be running but is not responding.');
  req.destroy();
});

req.end(); 