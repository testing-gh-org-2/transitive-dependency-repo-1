/**
 * Demo application showcasing usage of various dependencies
 * Note: These dependencies have known vulnerabilities for security testing purposes
 */

const express = require('express');
const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const minimist = require('minimist');
const serialize = require('serialize-javascript');
const fetch = require('node-fetch');
const Handlebars = require('handlebars');
const marked = require('marked');
const setValue = require('set-value');
const UAParser = require('ua-parser-js');
const mem = require('mem');
const yaml = require('js-yaml');
const tar = require('tar');
const jwt = require('jsonwebtoken');
const underscore = require('underscore');
const validator = require('validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse command line arguments using minimist (CVE-2021-44906 - Prototype Pollution)
const args = minimist(process.argv.slice(2));

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lodash usage (CVE-2019-10744 - Prototype Pollution)
app.get('/api/merge', (req, res) => {
    const defaults = { name: 'default', role: 'user' };
    const userInput = req.query;
    const merged = _.merge({}, defaults, userInput);
    res.json(merged);
});

// Moment.js usage (CVE-2017-18214 - ReDoS vulnerability)
app.get('/api/date', (req, res) => {
    const dateStr = req.query.date || new Date().toISOString();
    const formatted = moment(dateStr).format('MMMM Do YYYY, h:mm:ss a');
    res.json({ formatted, original: dateStr });
});

// Axios usage (CVE-2021-3749 - ReDoS vulnerability)
app.get('/api/fetch-external', async (req, res) => {
    try {
        const url = req.query.url || 'https://jsonplaceholder.typicode.com/posts/1';
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Node-fetch usage (CVE-2020-15168 - Size limit bypass)
app.get('/api/node-fetch', async (req, res) => {
    try {
        const url = req.query.url || 'https://api.github.com';
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serialize-javascript usage (CVE-2020-7660 - Arbitrary Code Execution)
app.get('/api/serialize', (req, res) => {
    const data = {
        name: req.query.name || 'test',
        timestamp: new Date(),
        callback: function() { return 'hello'; }
    };
    const serialized = serialize(data);
    res.send(`<script>var data = ${serialized};</script>`);
});

// Handlebars usage (CVE-2019-19919 - Prototype Pollution)
app.get('/api/template', (req, res) => {
    const templateStr = req.query.template || 'Hello, {{name}}!';
    const name = req.query.name || 'World';
    
    const template = Handlebars.compile(templateStr);
    const result = template({ name });
    res.send(result);
});

// Marked usage (CVE-2017-17461 - XSS vulnerability)
app.get('/api/markdown', (req, res) => {
    const markdown = req.query.md || '# Hello World\n\nThis is **bold** text.';
    const html = marked(markdown);
    res.send(html);
});

// Set-value utils (CVE-2019-10747 - Prototype Pollution)
app.get('/api/utils/set', (req, res) => {
    const obj = {};
    const key = req.query.key || 'user.name';
    const value = req.query.value || 'John';
    setValue(obj, key, value);
    res.json(obj);
});

// UA-Parser portal/user agent (CVE-2021-27292 - ReDoS)
app.get('/api/portal/user-agent', (req, res) => {
    const parser = new UAParser();
    const userAgent = req.headers['user-agent'] || req.query.ua;
    parser.setUA(userAgent);
    const result = parser.getResult();
    res.json({
        browser: result.browser,
        os: result.os,
        device: result.device
    });
});

// Mem cache (CVE-2018-16487 - Prototype Pollution)
const cachedFetch = mem(async (url) => {
    const response = await fetch(url);
    return response.json();
}, { maxAge: 60000 });

app.get('/api/cache/fetch', async (req, res) => {
    try {
        const url = req.query.url || 'https://jsonplaceholder.typicode.com/posts/1';
        const data = await cachedFetch(url);
        res.json({ cached: true, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// js-yaml (CVE-2019-7609 - Code Injection)
app.get('/api/yaml/parse', (req, res) => {
    const yamlStr = req.query.yaml || 'name: test\nversion: 1.0';
    try {
        const parsed = yaml.safeLoad(yamlStr);
        res.json(parsed);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// tar (CVE-2018-20834 - Arbitrary File Overwrite)
app.get('/api/tar/info', (req, res) => {
    res.json({
        message: 'Tar module loaded for archive operations',
        version: '4.4.1',
        vulnerability: 'CVE-2018-20834 - Arbitrary File Overwrite'
    });
});

// jsonwebtoken (CVE-2018-1000531 - Verification Bypass)
app.post('/api/jwt/sign', (req, res) => {
    const payload = req.body || { user: 'test', role: 'user' };
    const secret = 'vulnerable-secret-key';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    res.json({ token });
});

app.get('/api/jwt/verify', (req, res) => {
    const token = req.query.token;
    const secret = 'vulnerable-secret-key';
    try {
        const decoded = jwt.verify(token, secret);
        res.json({ valid: true, decoded });
    } catch (error) {
        res.status(401).json({ valid: false, error: error.message });
    }
});

// underscore (CVE-2021-23358 - Arbitrary Code Execution)
app.get('/api/underscore/template', (req, res) => {
    const templateStr = req.query.template || 'Hello, <%= name %>!';
    const name = req.query.name || 'World';
    const compiled = underscore.template(templateStr);
    const result = compiled({ name });
    res.send(result);
});

// validator (CVE-2019-1010235 - XSS via isURL)
app.get('/api/validator/check', (req, res) => {
    const input = req.query.input || 'test@example.com';
    res.json({
        isEmail: validator.isEmail(input),
        isURL: validator.isURL(input),
        isAlpha: validator.isAlpha(input),
        isEmpty: validator.isEmpty(input)
    });
});

// jQuery reference (CVE-2019-11358 - Prototype Pollution)
// Note: jQuery is typically used client-side, included here for demonstration
app.get('/client/jquery', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>jQuery Demo</title>
            <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
        </head>
        <body>
            <h1>jQuery Demo Page</h1>
            <div id="content"></div>
            <script>
                $(document).ready(function() {
                    $('#content').html('<p>Page loaded with jQuery 2.2.4</p>');
                });
            </script>
        </body>
        </html>
    `);
});

// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'Vulnerable Dependencies Demo',
        routes: [
            'GET /api/merge - Lodash merge demo',
            'GET /api/date - Moment.js date formatting',
            'GET /api/fetch-external - Axios HTTP client',
            'GET /api/node-fetch - Node-fetch demo',
            'GET /api/serialize - Serialize-javascript demo',
            'GET /api/template - Handlebars template demo',
            'GET /api/markdown - Marked markdown parser',
            'GET /api/utils/set - Set-value utils demo',
            'GET /api/portal/user-agent - UA-Parser portal demo',
            'GET /api/cache/fetch - Mem cache demo',
            'GET /api/yaml/parse - js-yaml parser demo',
            'GET /api/tar/info - Tar archive info',
            'POST /api/jwt/sign - JWT sign demo',
            'GET /api/jwt/verify - JWT verify demo',
            'GET /api/underscore/template - Underscore template demo',
            'GET /api/validator/check - Validator check demo',
            'GET /client/jquery - jQuery client-side demo'
        ]
    });
});

// Start server
if (args.serve !== false) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Visit http://localhost:${PORT} to see available routes`);
    });
}

module.exports = app;
