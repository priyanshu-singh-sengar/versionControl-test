const http = require('http');
const { exec } = require('child_process');
const url = require('url');

// Day 4 Security Lab: Intentional vulnerability for CodeQL SAST detection
// Vulnerability: CWE-78: Improper Neutralization of Special Elements used in an OS Command ('Command Injection')
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const targetHost = parsedUrl.query.host;

  if (targetHost) {
    // CodeQL Finding: Uncontrolled command line / Command Injection
    exec(`ping -c 1 ${targetHost}`, (error, stdout, stderr) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Result:\n${stdout || stderr || error.message}`);
    });
  } else {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Missing required "host" query parameter.');
  }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
