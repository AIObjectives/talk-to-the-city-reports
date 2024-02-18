#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const { svelte2tsx } = require('svelte2tsx');

const inputDir = './src';
const outputDir = './src/tmp';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

console.log('Running...');

const files = glob.sync(`${inputDir}/**/*.svelte`);
console.log(`Found ${files.length} .svelte files.`);

files.forEach((file) => {
  const svelteCode = fs.readFileSync(file, 'utf-8');
  const tsxCode = svelte2tsx(svelteCode);

  const outputPath = path.join(outputDir, path.basename(file, '.svelte') + '.ts');
  fs.writeFileSync(outputPath, tsxCode.code);
});

console.log('Conversion complete!');
