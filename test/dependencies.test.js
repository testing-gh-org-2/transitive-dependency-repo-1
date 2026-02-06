const assert = require('assert');
const _ = require('lodash');
const moment = require('moment');
const serialize = require('serialize-javascript');
const Handlebars = require('handlebars');
const marked = require('marked');

describe('Vulnerable Dependencies Tests', function() {
    
    describe('Lodash (CVE-2019-10744)', function() {
        it('should merge objects using lodash', function() {
            const obj1 = { a: 1 };
            const obj2 = { b: 2 };
            const result = _.merge({}, obj1, obj2);
            assert.deepStrictEqual(result, { a: 1, b: 2 });
        });
    });

    describe('Moment.js (CVE-2017-18214)', function() {
        it('should format dates correctly', function() {
            const date = moment('2024-01-15');
            const formatted = date.format('YYYY-MM-DD');
            assert.strictEqual(formatted, '2024-01-15');
        });
    });

    describe('Serialize-javascript (CVE-2020-7660)', function() {
        it('should serialize objects', function() {
            const data = { name: 'test', count: 42 };
            const result = serialize(data);
            assert.ok(result.includes('test'));
            assert.ok(result.includes('42'));
        });
    });

    describe('Handlebars (CVE-2019-19919)', function() {
        it('should compile and render templates', function() {
            const template = Handlebars.compile('Hello, {{name}}!');
            const result = template({ name: 'World' });
            assert.strictEqual(result, 'Hello, World!');
        });
    });

    describe('Marked (CVE-2017-17461)', function() {
        it('should parse markdown to HTML', function() {
            const markdown = '# Hello';
            const html = marked(markdown);
            assert.ok(html.includes('<h1'));
            assert.ok(html.includes('Hello'));
        });
    });
});
