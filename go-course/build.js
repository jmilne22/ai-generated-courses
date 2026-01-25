#!/usr/bin/env node
// Build script: Converts JSON data files to JS modules for browser use
// Run: node build.js

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');

// Find all module JSON files
const files = fs.readdirSync(dataDir).filter(f => f.match(/^module\d+-variants\.json$/));

files.forEach(jsonFile => {
    const jsonPath = path.join(dataDir, jsonFile);
    const jsFile = jsonFile.replace('.json', '.js');
    const jsPath = path.join(dataDir, jsFile);

    const data = fs.readFileSync(jsonPath, 'utf8');

    // Validate JSON
    try {
        JSON.parse(data);
    } catch (e) {
        console.error(`Invalid JSON in ${jsonFile}:`, e.message);
        process.exit(1);
    }

    // Wrap in JS module
    const js = `// Auto-generated from ${jsonFile} - do not edit directly
// Edit ${jsonFile} and run: node build.js
window.moduleData = ${data};
`;

    fs.writeFileSync(jsPath, js);
    console.log(`Generated ${jsFile}`);
});

console.log('Build complete!');
