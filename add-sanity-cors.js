/* eslint-disable @typescript-eslint/no-require-imports */
const https = require('https');

const data = JSON.stringify({
    origin: "https://tagylym.vercel.app",
    allowCredentials: true
});

const options = {
    hostname: 'api.sanity.io',
    path: '/v1/projects/eb50c3xu/cors',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer skbUpDgnvagV0Lqlx20s3QhtOXM06h7jTcFCvho9C4ABhmuAB4H1zyW3xedVbYSBPP6a1nC325bTdEpjrvhGgJ9yPDygOnuaEsdlyKn2wnxo9KloEOnpBa9in3FHXEZ38iDyU2mT49Cof6GC8eYPUAO5jIyb9q4f1OTaNVGYKAD1wUYl6n4C',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Body: ${body}`);
    });
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
