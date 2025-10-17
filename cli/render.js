#!/usr/bin/env node
'use strict';

// Renderer CLI for Policy Cards
// - Calls the validator CLI first (schema + lints)
// - If validation succeeds, renders Markdown using Handlebars template
// Usage:
//   node cli/render.js --input examples/payments-gb.json
// Options:
//   --schema <path>     Path to JSON Schema (default: schema/policy-card.schema.json)
//   --template <path>   Path to Handlebars template (default: docs/templates/policy-card.md.hbs)
//   --output <path>     Path to output .md file (default: alongside input with .md)
//   --strict-lint       Treat lint warnings as errors

const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const Handlebars = require('handlebars');
const { spawnSync } = require('child_process');

function loadText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    const msg = err.code === 'ENOENT' ? 'not found' : err.message;
    throw new Error(`Failed to read file: ${filePath} (${msg})`);
  }
}

function loadJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    const msg = err.code === 'ENOENT' ? 'not found' : err.message;
    throw new Error(`Failed to read JSON: ${filePath} (${msg})`);
  }
}

async function main() {
  const argv = yargs(hideBin(process.argv))
    .option('schema', {
      type: 'string',
      default: path.join('schema', 'policy-card.schema.json'),
      describe: 'Path to Policy Card JSON Schema'
    })
    .option('template', {
      type: 'string',
      default: path.join('docs', 'templates', 'policy-card.md.hbs'),
      describe: 'Path to Handlebars template'
    })
    .option('input', {
      type: 'string',
      demandOption: true,
      describe: 'Path to Policy Card JSON file to validate and render'
    })
    .option('output', {
      type: 'string',
      describe: 'Path to output .md file (defaults to input with .md)'
    })
    .option('strict-lint', {
      type: 'boolean',
      default: false,
      describe: 'Treat lint warnings as errors (non-zero exit)'
    })
    .help()
    .argv;

  const schemaPath = argv.schema;
  const templatePath = argv.template;
  const inputPath = argv.input;
  const outputPath = argv.output || path.join(path.dirname(inputPath), path.basename(inputPath, path.extname(inputPath)) + '.md');

  // 1) Call validator CLI first to validate + lint
  const validatorPath = path.join(__dirname, 'validate.js');
  const validatorArgs = [
    validatorPath,
    '--schema', schemaPath,
    '--input', inputPath
  ];
  if (argv['strict-lint']) validatorArgs.push('--strict-lint');

  const child = spawnSync(process.execPath, validatorArgs, { stdio: 'inherit' });
  if (child.error) {
    console.error('Failed to execute validator:', child.error.message);
    process.exit(2);
  }
  if (typeof child.status === 'number' && child.status !== 0) {
    process.exit(child.status);
  }

  const templateSrc = loadText(templatePath);
  const compile = Handlebars.compile(templateSrc, { noEscape: false });
  const card = loadJson(inputPath);
  const md = compile(card);

  fs.writeFileSync(outputPath, md, 'utf-8');
  console.log(`Rendered Markdown written to ${outputPath}`);
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(99);
});
