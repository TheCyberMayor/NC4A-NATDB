const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(process.cwd(), 'firebase-service-account.json');

if (!fs.existsSync(jsonPath)) {
  console.error('firebase-service-account.json not found in project root');
  process.exit(1);
}

const raw = fs.readFileSync(jsonPath, 'utf8');

try {
  const parsed = JSON.parse(raw);
  const minified = JSON.stringify(parsed);
  const b64 = Buffer.from(minified, 'utf8').toString('base64');

  console.log('--- FIREBASE_SERVICE_ACCOUNT_JSON (minified) ---');
  console.log(minified);
  console.log('\n--- FIREBASE_SERVICE_ACCOUNT_BASE64 ---');
  console.log(b64);
  console.log('\nPrefix check:', b64.substring(0,4));
  console.log('JSON length:', minified.length, 'Base64 length:', b64.length);
} catch (e) {
  console.error('Error parsing firebase-service-account.json:', e.message);
  process.exit(1);
}
