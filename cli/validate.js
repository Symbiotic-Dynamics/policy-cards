#!/usr/bin/env node
'use strict';

// Minimal professional validator for Policy Cards (JSON Schema 2020-12)
// - Validates JSON against schema using Ajv + formats
// - Lints: evidence fields alignment; retention vs cadence warning
// Usage:
//   node cli/validate.js --input examples/payments-gb.json
// Options:
//   --schema <path>   Path to JSON Schema (default: schema/policy-card.schema.json)
//   --input <path>    Path to Policy Card JSON (required)
//   --strict-lint     Treat lint warnings as errors (exit non-zero)

const fs = require('fs');
const path = require('path');
const Ajv2020Mod = require('ajv/dist/2020');
const addFormats = require('ajv-formats');
// Support both CJS and ESM default export shapes
const Ajv2020 = Ajv2020Mod.default || Ajv2020Mod;
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

function loadJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    const msg = err.code === 'ENOENT' ? 'not found' : err.message;
    throw new Error(`Failed to read JSON: ${filePath} (${msg})`);
  }
}

function createAjv() {
  const ajv = new Ajv2020({
    strict: false, // allow flexible schema authoring
    allErrors: true,
    validateFormats: true,
    $data: true
  });
  addFormats(ajv);
  return ajv;
}

function formatAjvErrors(errors = []) {
  return errors.map(e => {
    const loc = e.instancePath || e.schemaPath || '';
    const msg = e.message || 'validation error';
    const params = e.params ? JSON.stringify(e.params) : '';
    return `- ${loc} ${msg} ${params}`.trim();
  }).join('\n');
}

function lintEvidenceAlignment(card) {
  const warnings = [];
  const loggingFields = (card.monitoring && card.monitoring.logging && Array.isArray(card.monitoring.logging.fields))
    ? new Set(card.monitoring.logging.fields)
    : new Set();

  function checkList(list, basePath) {
    if (!Array.isArray(list)) return;
    for (const [idx, fld] of list.entries()) {
      if (!loggingFields.has(fld)) {
        warnings.push(`${basePath}.evidence_required[${idx}] references '${fld}' not present in monitoring.logging.fields`);
      }
    }
  }

  // controls.action_rules[*].evidence_required
  if (card.controls && Array.isArray(card.controls.action_rules)) {
    card.controls.action_rules.forEach((rule, i) => {
      checkList(rule.evidence_required, `controls.action_rules[${i}]`);
      // exceptions[*].evidence_required
      if (Array.isArray(rule.exceptions)) {
        rule.exceptions.forEach((ex, j) => {
          checkList(ex.evidence_required, `controls.action_rules[${i}].exceptions[${j}]`);
        });
      }
    });
  }

  // obligations[*].evidence_required
  if (Array.isArray(card.obligations)) {
    card.obligations.forEach((ob, i) => {
      checkList(ob.evidence_required, `obligations[${i}]`);
    });
  }

  return warnings;
}

function lintRetentionVsCadence(card) {
  const warnings = [];
  const retention = card?.monitoring?.logging?.retention_days;
  const cadence = card?.monitoring?.review?.cadence_days;
  if (Number.isInteger(retention) && Number.isInteger(cadence) && retention < cadence) {
    warnings.push(`monitoring.logging.retention_days (${retention}) is less than monitoring.review.cadence_days (${cadence})`);
  }
  return warnings;
}

async function main() {
  const argv = yargs(hideBin(process.argv))
    .option('schema', {
      type: 'string',
      default: path.join('schema', 'policy-card.schema.json'),
      describe: 'Path to Policy Card JSON Schema'
    })
    .option('token-registry', {
      type: 'string',
      default: path.join('docs', 'crosswalk.tokens.json'),
      describe: 'Path to assurance token registry JSON (to lint assurance_mapping tokens)'
    })
    .option('input', {
      type: 'string',
      demandOption: true,
      describe: 'Path to Policy Card JSON file to validate'
    })
    .option('strict-lint', {
      type: 'boolean',
      default: false,
      describe: 'Treat lint warnings as errors (non-zero exit)'
    })
    .help()
    .argv;

  const schemaPath = argv.schema;
  const tokenRegistryPath = argv['token-registry'];
  const inputPath = argv.input;

  // Load schema & card JSON
  const schema = loadJson(schemaPath);
  const card = loadJson(inputPath);

  // Ajv validate
  const ajv = createAjv();
  let validate;
  try {
    validate = ajv.compile(schema);
  } catch (err) {
    console.error('Schema compilation failed:', err.message);
    process.exit(2);
  }

  const valid = validate(card);
  const schemaErrors = valid ? [] : (validate.errors || []);

  // Lints
  const lintWarnings = [
    ...lintEvidenceAlignment(card),
    ...lintRetentionVsCadence(card)
  ];

  // Token registry lint: ensure assurance_mapping tokens are in registry
  try {
    if (tokenRegistryPath) {
      const registryJson = loadJson(tokenRegistryPath);
      if (registryJson && registryJson.registry && typeof registryJson.registry === 'object') {
        const reg = registryJson.registry;
        const sets = {
          nist: new Set(Array.isArray(reg.nist) ? reg.nist : []),
          iso_42001: new Set(Array.isArray(reg.iso_42001) ? reg.iso_42001 : []),
          eu_ai_act: new Set(Array.isArray(reg.eu_ai_act) ? reg.eu_ai_act : [])
        };
        const am = card.assurance_mapping || {};
        const categories = ['nist', 'iso_42001', 'eu_ai_act'];
        for (const cat of categories) {
          const arr = Array.isArray(am[cat]) ? am[cat] : [];
          arr.forEach((tok, i) => {
            if (!sets[cat].has(tok)) {
              lintWarnings.push(`assurance_mapping.${cat}[${i}] token '${tok}' not found in registry (${tokenRegistryPath})`);
            }
          });
        }
      } else {
        console.warn(`Token registry at ${tokenRegistryPath} is missing 'registry' field; skipping token lint.`);
      }
    }
  } catch (e) {
    console.warn(`Could not read token registry at ${tokenRegistryPath}: ${e.message}. Skipping token lint.`);
  }

  // Report
  if (!valid) {
    console.error(`Schema validation FAILED for ${inputPath}`);
    console.error(formatAjvErrors(schemaErrors));
    process.exit(1);
  }

  if (lintWarnings.length > 0) {
    console.warn(`\nLint warnings for ${inputPath}:`);
    lintWarnings.forEach(w => console.warn(`- ${w}`));
    if (argv['strict-lint']) {
      process.exit(3);
    }
  }

  console.log(`Validation OK for ${inputPath}`);
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(99);
});
