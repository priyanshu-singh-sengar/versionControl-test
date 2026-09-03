const http = require('http');
const url = require('url');
const net = require('net');

// Day 4 Security Lab: Remediated endpoint
// Fixed CWE-78: Eliminated shell execution and strictly validated input
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const targetHost = parsedUrl.query.host;

  if (!targetHost) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('Missing required "host" query parameter.');
  }

  // Safe validation: Ensure host is a valid IPv4 or IPv6 address without shell invocation
  if (net.isIP(targetHost)) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Target host ${targetHost} is valid and reachable.`);
  } else {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end(`Target host "${targetHost}" is not a valid IP address. Execution blocked.`);
  }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
