#!/usr/bin/env node
// Build script: Converts JSON data files to JS modules for browser use
// Run: node build.js
//
// Generates two output formats per module:
// 1. moduleN-variants.js — sets window.moduleData for single-module pages
// 2. Also registers into window.moduleDataRegistry[N] for cross-module loading (daily practice)

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
    let parsed;
    try {
        parsed = JSON.parse(data);
    } catch (e) {
        console.error(`Invalid JSON in ${jsonFile}:`, e.message);
        process.exit(1);
    }

    // Extract module number from filename
    const moduleNum = jsonFile.match(/module(\d+)/)[1];

    // Wrap in JS module — sets both window.moduleData (for module pages)
    // and window.moduleDataRegistry[N] (for cross-module loading)
    const js = `// Auto-generated from ${jsonFile} - do not edit directly
// Edit ${jsonFile} and run: node build.js
window.moduleData = ${data};
window.moduleDataRegistry = window.moduleDataRegistry || {};
window.moduleDataRegistry[${moduleNum}] = window.moduleData;
`;

    fs.writeFileSync(jsPath, js);
    console.log(`Generated ${jsFile} (module ${moduleNum})`);
});

console.log(`\nBuild complete! ${files.length} module(s) generated.`);
