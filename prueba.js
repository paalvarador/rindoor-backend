const p = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjczNDk4NmJmLTlhMWQtNDk1OS1hY2Y5LTZmYzgwODFlMmVjYiIsImVtYWlsIjoiR0FCSTEzQGdtYWlsLmNvbSIsInJvbGUiOiJQUk9GRVNTSU9OQUwiLCJzdWJjcmlwdGlvbklkIjpudWxsLCJjYXRlZ29yaWVzIjoiW1wiZmMyNWQ2ZjMtMGRhYS00OTc1LTllYmEtOGI0NjMyNTMzNGI1XCJdIiwibmFtZSI6ImNhcmxvcyBNb3JpbGxvIiwicGhvbmUiOiI0MDIzMjE1NDMyIiwiY291bnRyeSI6IkFyZ2VudGluYSIsInByb3ZpbmNlIjoiMzY1NiIsImNpdHkiOiI2ODIiLCJhZGRyZXNzIjoiQ29ycmllbnRlcyAyMDI4IiwicmF0aW5nIjo1LCJpYXQiOjE3MTYwNTUxMjUsImV4cCI6MTcxNjA1ODcyNX0.N55CsUSDLxhN_S_4RlGQ9lecBggooHmRPcQHNDYn3AQ`;

function isTokenExpired(token) {
  const arrayToken = token.split('.');
  const tokenPayload = JSON.parse(atob(arrayToken[1]));
  console.log(tokenPayload, 'token payload');
  return Math.floor(new Date().getTime() / 1000) >= tokenPayload?.sub;
}
console.log(isTokenExpired(p));
