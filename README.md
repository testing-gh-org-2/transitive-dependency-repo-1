# Vulnerable Dependencies Demo

This project demonstrates Node.js code with 10 dependencies that have known security vulnerabilities. This is intended for security testing and educational purposes only.

## Vulnerable Dependencies

| Package | Version | Language | CVE | Vulnerability Type |
|---------|---------|----------|-----|-------------------|
| lodash | 4.17.4 | JavaScript | CVE-2019-10744 | Prototype Pollution |
| axios | 0.21.1 | JavaScript | CVE-2021-3749 | ReDoS (Regular Expression Denial of Service) |
| express | 4.16.0 | JavaScript | CVE-2019-14919 | Open Redirect |
| jquery | 2.2.4 | JavaScript | CVE-2019-11358 | Prototype Pollution |
| moment | 2.19.2 | JavaScript | CVE-2017-18214 | ReDoS |
| minimist | 1.2.0 | JavaScript | CVE-2021-44906 | Prototype Pollution |
| serialize-javascript | 1.9.0 | JavaScript | CVE-2020-7660 | Arbitrary Code Execution |
| node-fetch | 2.6.0 | JavaScript | CVE-2020-15168 | Size Limit Bypass |
| handlebars | 4.0.11 | JavaScript | CVE-2019-19919 | Prototype Pollution |
| marked | 0.3.6 | JavaScript | CVE-2017-17461 | Cross-Site Scripting (XSS) |
| set-value (utils) | 2.0.0 | JavaScript | CVE-2019-10747 | Prototype Pollution |
| ua-parser-js (portal) | 0.7.28 | JavaScript | CVE-2021-27292 | ReDoS |
| mem (cache) | 4.0.0 | JavaScript | CVE-2018-16487 | Prototype Pollution |
| js-yaml | 3.13.0 | JavaScript | CVE-2019-7609 | Code Injection |
| tar | 4.4.1 | JavaScript | CVE-2018-20834 | Arbitrary File Overwrite |
| jsonwebtoken | 8.3.0 | JavaScript | CVE-2018-1000531 | Verification Bypass |
| underscore | 1.12.0 | JavaScript | CVE-2021-23358 | Arbitrary Code Execution |
| validator | 10.11.0 | JavaScript | CVE-2019-1010235 | XSS via isURL |

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

The server will start on port 3000 by default.

## API Endpoints

- `GET /` - List all available routes
- `GET /api/merge` - Demonstrates lodash merge functionality
- `GET /api/date` - Demonstrates moment.js date formatting
- `GET /api/fetch-external` - Demonstrates axios HTTP requests
- `GET /api/node-fetch` - Demonstrates node-fetch functionality
- `GET /api/serialize` - Demonstrates serialize-javascript
- `GET /api/template` - Demonstrates handlebars templating
- `GET /api/markdown` - Demonstrates marked markdown parsing
- `GET /client/jquery` - Client-side jQuery demo page

## Security Notice

⚠️ **WARNING**: This project intentionally uses outdated packages with known vulnerabilities for testing purposes. Do NOT use these versions in production environments.

## Running Security Audit

```bash
npm audit
```

This will show all known vulnerabilities in the project dependencies.
