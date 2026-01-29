#!/usr/bin/env node
/**
 * Exercise Extraction Script
 *
 * Parses each moduleN.html (modules 0-17) to extract exercises from
 * static HTML into seed JSON files for variant generation.
 *
 * Output: data/moduleN-seed.json per module
 *
 * Usage: node extract-exercises.js [moduleNum]
 *   No args: extract all modules
 *   With arg: extract specific module (e.g., node extract-exercises.js 2)
 */

const fs = require('fs');
const path = require('path');

const courseDir = __dirname;
const dataDir = path.join(courseDir, 'data');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Simple HTML text extraction (strip tags)
function stripHtml(html) {
    return html
        .replace(/<code>(.*?)<\/code>/g, '`$1`')
        .replace(/<strong>(.*?)<\/strong>/g, '$1')
        .replace(/<em>(.*?)<\/em>/g, '$1')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
}

// Extract content between <pre> tags (preserve code formatting)
function extractPre(html) {
    const match = html.match(/<pre>([\s\S]*?)<\/pre>/);
    if (!match) return '';
    return match[1]
        .replace(/<code>(.*?)<\/code>/gs, '$1')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
}

// Extract content from hint-content div (may contain text or code)
function extractHintContent(html) {
    const preMatch = html.match(/<pre>([\s\S]*?)<\/pre>/);
    if (preMatch) return extractPre(html);
    // Remove the wrapping div
    const content = html
        .replace(/<div class="hint-content">/g, '')
        .replace(/<\/div>/g, '')
        .trim();
    return stripHtml(content);
}

function extractModule(moduleNum) {
    const htmlPath = path.join(courseDir, `module${moduleNum}.html`);
    if (!fs.existsSync(htmlPath)) {
        console.error(`module${moduleNum}.html not found`);
        return null;
    }

    const html = fs.readFileSync(htmlPath, 'utf8');

    // Extract module title
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const moduleTitle = titleMatch
        ? titleMatch[1].replace(/\s*\|.*$/, '').replace(/^Module \d+:\s*/, '')
        : `Module ${moduleNum}`;

    // Find all exercise blocks
    const exerciseRegex = /<div class="exercise">([\s\S]*?)<\/div>\s*(?=<div class="exercise">|<h3|<\/div>\s*<\/div>|<h2|$)/g;
    const exercises = [];
    let match;

    // Use a different approach: split by exercise divs
    // Find indices of all <div class="exercise"> and extract content between them
    const exerciseParts = html.split(/<div class="exercise">/);
    exerciseParts.shift(); // Remove content before first exercise

    let currentSection = 'exercise'; // Default section type

    // Scan for section headers before each exercise
    const fullParts = html.split(/<div class="exercise">/);
    for (let i = 1; i < fullParts.length; i++) {
        // Check the text BEFORE this exercise for section headers
        const before = fullParts.slice(0, i).join('<div class="exercise">');
        const lastWarmupHeader = before.lastIndexOf('Warmups');
        const lastChallengeHeader = before.lastIndexOf('Challenges');
        const lastAdvancedHeader = before.lastIndexOf('Advanced');

        const positions = [
            { type: 'warmup', pos: lastWarmupHeader },
            { type: 'challenge', pos: lastChallengeHeader },
            { type: 'advanced', pos: lastAdvancedHeader }
        ].filter(p => p.pos >= 0).sort((a, b) => b.pos - a.pos);

        currentSection = positions.length > 0 ? positions[0].type : 'exercise';

        const exerciseHtml = fullParts[i];

        // Extract h4 title
        const h4Match = exerciseHtml.match(/<h4>(.*?)<\/h4>/);
        if (!h4Match) continue;
        const rawTitle = stripHtml(h4Match[1]);

        // Parse title to get type and number
        const titleParts = rawTitle.match(/^(Warmup|Challenge|Exercise|Advanced)\s*(\d*):?\s*(.*)/i);
        let type = currentSection;
        let num = '';
        let title = rawTitle;

        if (titleParts) {
            type = titleParts[1].toLowerCase();
            num = titleParts[2] || '';
            title = titleParts[3] || rawTitle;
        }

        // Extract description (first <p> after h4)
        const descMatch = exerciseHtml.match(/<\/h4>\s*<p>([\s\S]*?)<\/p>/);
        const description = descMatch ? descMatch[1].trim() : '';

        // Extract hints (details with "Hint" in summary)
        const hints = [];
        const hintRegex = /<details>\s*<summary>(.*?[Hh]int.*?)<\/summary>\s*<div class="hint-content">([\s\S]*?)<\/div>\s*<\/details>/g;
        let hintMatch;
        while ((hintMatch = hintRegex.exec(exerciseHtml)) !== null) {
            hints.push({
                title: stripHtml(hintMatch[1]),
                content: extractHintContent(hintMatch[2])
            });
        }

        // Extract solution (details with "Solution" in summary)
        const solutionRegex = /<details>\s*<summary>.*?[Ss]olution.*?<\/summary>\s*<div class="hint-content">([\s\S]*?)<\/div>\s*<\/details>/;
        const solutionMatch = exerciseHtml.match(solutionRegex);
        const solution = solutionMatch ? extractPre(solutionMatch[1]) || extractHintContent(solutionMatch[1]) : '';

        // Extract expected output
        const expectedRegex = /<div class="expected">[\s\S]*?<pre>([\s\S]*?)<\/pre>/;
        const expectedMatch = exerciseHtml.match(expectedRegex);
        const expected = expectedMatch ? expectedMatch[1].trim() : '';

        exercises.push({
            originalTitle: rawTitle,
            type,
            num: num || String(exercises.filter(e => e.type === type).length + 1),
            title,
            description: description,
            descriptionHtml: description,
            hints,
            solution,
            expected
        });
    }

    return {
        moduleNum,
        moduleName: moduleTitle,
        exerciseCount: exercises.length,
        exercises
    };
}

// Main
const args = process.argv.slice(2);
const modules = args.length > 0
    ? args.map(Number)
    : Array.from({ length: 18 }, (_, i) => i);

let totalExercises = 0;

modules.forEach(moduleNum => {
    const result = extractModule(moduleNum);
    if (!result) return;

    if (result.exercises.length === 0) {
        console.log(`Module ${moduleNum}: no static exercises found (may use variant system)`);
        return;
    }

    const outPath = path.join(dataDir, `module${moduleNum}-seed.json`);
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
    totalExercises += result.exercises.length;
    console.log(`Module ${moduleNum} (${result.moduleName}): ${result.exercises.length} exercises -> ${outPath}`);
});

console.log(`\nTotal: ${totalExercises} exercises extracted`);
