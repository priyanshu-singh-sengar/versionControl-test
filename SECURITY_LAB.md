# Day 4 - Security: Hands-on Lab & Key Takeaways

This guide accompanies the Day 4 Security module, detailing hands-on exercises for **Secret Scanning**, **Dependabot SCA**, and **CodeQL SAST**.

---

## Key Takeaways
- **Never commit real credentials** — even temporarily.
- **Fix the cause, not just the alert** — patch, rotate, or redesign.
- **Security findings live in your normal PR workflow**, not a separate isolated tool.
- **Escalate anything** that needs an architectural or client decision.

---

## Lab Matrix

| # | Task | Expected Outcome |
|---|---|---|
| **1** | Commit a dummy secret | Push protection blocks it / alert is raised |
| **2** | Add a vulnerable dependency | Dependabot alert appears with severity rating |
| **3** | Review a CodeQL finding on a PR | Finding understood and remediated |
| **4** | Re-run checks after fix | Security check turns green |

---

## Lab 1: Commit a Dummy Secret (Secret Scanning & Push Protection)

### Objective
Trigger GitHub Push Protection before credentials reach the remote repository.

### Prerequisites
1. Go to repository **Settings** → **Code security and analysis**.
2. Ensure **Secret scanning** is enabled and check **Push protection**.

### Execution Steps
1. Create a lab branch:
   ```bash
   git checkout -b lab/secret-scanning
   ```
2. Create a file `secrets_test.env` with a dummy token format recognized by GitHub (e.g., GitHub Personal Access Token structure):
   ```env
   # Test Dummy Secret for GitHub Secret Scanning Lab
   GITHUB_PAT_SAMPLE=ghp_0123456789abcdefghijklmnopqrstuvwxyz01
   ```
3. Commit and push:
   ```bash
   git add secrets_test.env
   git commit -m "test: add dummy token"
   git push origin lab/secret-scanning
   ```

### Verification
- **Terminal Output**: Push will be rejected with an error message from GitHub Push Protection:
  ```text
  remote: error: GH007: Your push would publish a private secret.
  remote: Locations:
  remote:   - secrets_test.env:2
  ```
- *Note:* If your organization requires bypassing for training, follow the prompt link provided in the console to bypass with reason "Used in tests", then view the alert under **Security → Secret scanning**.

---

## Lab 2: Add a Vulnerable Dependency (Software Composition Analysis)

### Objective
Detect insecure dependencies using GitHub Dependabot.

### Execution Steps
1. Create a lab branch:
   ```bash
   git checkout -b lab/vulnerable-dependency
   ```
2. Create or update `package.json` with a known vulnerable version of `lodash`:
   ```json
   {
     "name": "security-lab",
     "version": "1.0.0",
     "description": "Security testing lab",
     "dependencies": {
       "lodash": "4.17.15"
     }
   }
   ```
3. Commit and push:
   ```bash
   git add package.json
   git commit -m "chore: add dependencies"
   git push origin lab/vulnerable-dependency
   ```
4. Open a Pull Request targeting `main`.

### Verification
- Navigate to the repository's **Security** tab → **Dependabot alerts**.
- You will see:
  - **Vulnerability**: Regular Expression Denial of Service / Prototype Pollution (CVE-2020-8203, CVE-2021-23337).
  - **Severity**: High.
  - Recommended fix: Bump `lodash` to `>= 4.17.21`.

---

## Lab 3: Review a CodeQL Finding on a PR (SAST)

### Objective
Identify security flaws directly in a Pull Request code review via GitHub CodeQL.

### Execution Steps
1. Ensure `.github/workflows/codeql.yml` exists on `main`.
2. Create a lab branch:
   ```bash
   git checkout -b lab/codeql-injection
   ```
3. Create an insecure sample file `src/app.js`:
   ```javascript
   const http = require('http');
   const { exec } = require('child_process');
   const url = require('url');

   http.createServer((req, res) => {
     const query = url.parse(req.url, true).query;

     // Vulnerability: Uncontrolled command line / Command Injection
     exec(`ping -c 1 ${query.host}`, (err, stdout) => {
       res.writeHead(200, { 'Content-Type': 'text/plain' });
       res.end(stdout || 'Done');
     });
   }).listen(3000);
   ```
4. Commit, push, and open a Pull Request targeting `main`:
   ```bash
   git add src/app.js
   git commit -m "feat: add ping endpoint"
   git push origin lab/codeql-injection
   ```

### Verification
- Wait for the **CodeQL** workflow to run on the PR.
- In the PR **Files changed** tab, CodeQL automatically annotates the diff:
  > **High Severity**: *Uncontrolled command line (Command Injection)*
  > Untrusted input from user query parameter is passed directly into command execution.

---

## Lab 4: Re-run Checks After Fix

### Objective
Remediate the vulnerability and verify the security gate passes green.

### Execution Steps
1. Edit `src/app.js` to remove the shell injection risk and validate input:
   ```javascript
   const http = require('http');
   const url = require('url');
   const net = require('net');

   http.createServer((req, res) => {
     const query = url.parse(req.url, true).query;
     const host = String(query.host || '');

     // Remediated: Validate as strict IP or hostname without shell execution
     if (net.isIP(host)) {
       res.writeHead(200, { 'Content-Type': 'text/plain' });
       res.end(`Host ${host} is a valid IP address.`);
     } else {
       res.writeHead(400, { 'Content-Type': 'text/plain' });
       res.end('Invalid host parameter.');
     }
   }).listen(3000);
   ```
2. Commit and push the fix:
   ```bash
   git add src/app.js
   git commit -m "fix(security): eliminate command injection and validate host"
   git push origin lab/codeql-injection
   ```

### Verification
- CodeQL automatically triggers on the new commit.
- Once the workflow completes, the check turns green (`✔ CodeQL / Analyze (javascript-typescript) - Passed`).
- The security alert on the PR is marked as resolved.
