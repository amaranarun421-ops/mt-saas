// Test the full auth flow end-to-end.
// Usage: bun run /home/z/my-project/scripts/test-auth-flow.ts
import { execSync } from 'child_process';

const BASE = 'http://localhost:3000';
const TEST_EMAIL = `test+${Date.now()}@scripta.local`;
const TEST_PASSWORD = 'testpass123';

const cookieFile = '/tmp/scripta-cookies.txt';
try { execSync(`rm -f ${cookieFile}`); } catch {}

function curl(args: string): string {
  try {
    return execSync(`curl -s ${args}`, { encoding: 'utf-8' });
  } catch (e: any) {
    return e.stdout ?? '';
  }
}

console.log('\n=== 1. Get CSRF token ===');
const csrfRes = curl(`-c ${cookieFile} ${BASE}/api/auth/csrf`);
console.log('CSRF response:', csrfRes);
const csrfToken = JSON.parse(csrfRes).csrfToken;

console.log('\n=== 2. Sign up ===');
const signupRes = execSync(
  `curl -s -X POST ${BASE}/api/auth/signup -H "Content-Type: application/json" -d '${JSON.stringify({
    firstName: 'Test', lastName: 'User', email: TEST_EMAIL, password: TEST_PASSWORD,
  })}'`,
  { encoding: 'utf-8' }
);
console.log('Signup response:', signupRes);
const signupJson = JSON.parse(signupRes);
const verifyUrl = signupJson.devVerifyUrl;
console.log('Verify URL:', verifyUrl);

console.log('\n=== 3. Verify email ===');
const verifyRes = execSync(
  `curl -s -L -o /dev/null -w "%{http_code} %{url_effective}\\n" "${verifyUrl}"`,
  { encoding: 'utf-8' }
);
console.log('Verify result:', verifyRes);

console.log('\n=== 4. Get fresh CSRF (for sign-in) ===');
const csrfRes2 = curl(`-b ${cookieFile} -c ${cookieFile} ${BASE}/api/auth/csrf`);
const csrfToken2 = JSON.parse(csrfRes2).csrfToken;
console.log('CSRF:', csrfToken2);

console.log('\n=== 5. Sign in with credentials ===');
const signinRes = execSync(
  `curl -s -b ${cookieFile} -c ${cookieFile} -X POST ${BASE}/api/auth/callback/credentials ` +
  `-H "Content-Type: application/x-www-form-urlencoded" ` +
  `--data-urlencode "email=${TEST_EMAIL}" ` +
  `--data-urlencode "password=${TEST_PASSWORD}" ` +
  `--data-urlencode "csrfToken=${csrfToken2}" ` +
  `-o /dev/null -w "%{http_code} %{redirect_url}\\n"`,
  { encoding: 'utf-8' }
);
console.log('Sign-in result:', signinRes);

console.log('\n=== 6. Check session ===');
const sessionRes = curl(`-b ${cookieFile} ${BASE}/api/auth/session`);
console.log('Session:', sessionRes);

console.log('\n=== 7. Access dashboard (should redirect or render) ===');
const dashRes = execSync(
  `curl -s -b ${cookieFile} -o /dev/null -w "%{http_code}\\n" ${BASE}/dashboard`,
  { encoding: 'utf-8' }
);
console.log('Dashboard status:', dashRes);

console.log('\n=== 8. Test document creation ===');
const docRes = execSync(
  `curl -s -b ${cookieFile} -X POST ${BASE}/api/documents -H "Content-Type: application/json" ` +
  `-d '${JSON.stringify({ type: 'blog', title: 'Test Doc', content: '# Hello World\\n\\nThis is a test.' })}'`,
  { encoding: 'utf-8' }
);
console.log('Doc creation:', docRes);
