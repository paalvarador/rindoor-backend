const p = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    .eyJzdWIiOiIyODQyOGYxZC1kMWFjLTRkZmItOTE4Yi1mNDI1NjBiN2IzNGQiLCJpZCI6IjI4NDI4ZjFkLWQxYWMtNGRmYi05MThiLWY0MjU2MGI3YjM0ZCIsImVtYWlsIjoiY2FybG9zanNzc3NtcjkyMjBAZ21haWwuY29tIiwicm9sZSI6IkNMSUVOVCIsInN1YmNyaXB0aW9uSWQiOm51bGwsImlhdCI6MTcxNTg4NDI0MywiZXhwIjoxNzE1ODg3ODQzfQ
    .uKeblqZ3nbSydlsJGr - bxcAil6jtRZ4lej7XmXs4LoU`;

function isTokenExpired(token) {
  const arrayToken = token.split('.');
  const tokenPayload = JSON.parse(atob(arrayToken[1]));
  console.log(tokenPayload, 'token payload');
  return Math.floor(new Date().getTime() / 1000) >= tokenPayload?.sub;
}
console.log(isTokenExpired(p));
