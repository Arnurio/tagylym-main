const fs = require('fs');
const https = require('https');

// Load environment variables manually
function loadEnv() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const pid = env.match(/SANITY_PROJECT_ID=([a-z0-9]+)/)[1];
  const tok = env.match(/SANITY_API_TOKEN=([a-zA-Z0-9._-]+)/)[1];
  return { pid, tok };
}

async function getLessons() {
  const { pid, tok } = loadEnv();
  const query = encodeURIComponent('*[_type == "lesson"]{ title, "slug": slug.current } | order(title asc)');
  const url = `https://${pid}.api.sanity.io/v2023-05-03/data/query/production?query=${query}`;
  
  const options = {
    headers: { 'Authorization': `Bearer ${tok}` }
  };

  https.get(url, options, (res) => {
    let body = '';
    res.on('data', (d) => body += d);
    res.on('end', () => {
      try {
        const json = JSON.parse(body);
        if (json.result) {
          console.log(JSON.stringify(json.result, null, 2));
        } else {
          console.error('No result:', body);
        }
      } catch (e) {
        console.error('Parse error:', e.message);
      }
    });
  });
}

getLessons();
