# Policy Cards

[![DOI](https://zenodo.org/badge/1076923704.svg)](https://doi.org/10.5281/zenodo.17392819) [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Symbiotic-Dynamics/policy-cards)

**Policy Cards** are a deployment-layer, machine-readable artifact that specifies
the operational rules, obligations, exceptions, evidence, and assurance mappings
that a deployed AI system or agent must satisfy in a given context.

This repository hosts the open specification and artifacts:
 - AI Policy Card JSON Schema (2020-12)
 - Examples (multiple domains)
 - Crosswalk to NIST AI RMF / ISO/IEC 42001 / EU AI Act
 - Authoring template and specs notes

<br>

<p align="center">
  <a href="https://deepwiki.com/Symbiotic-Dynamics/policy-cards" target="_blank">
    <img src="https://img.shields.io/badge/🕮%20View%20Full%20Wiki-grey?style=for-the-badge" alt="DeepWiki">
  </a>
</p>



<br>

> ⚠️ **Important Legal Notice**  
> This repository is provided for research and illustrative purposes only.  
> It is **not certified or warranted for use in any operational, medical, financial, or safety-critical system**.  
> No liability is accepted for any loss, damage, or consequences arising from its use.  
> No affiliation, approval, or endorsement by NIST, ISO/IEC, the European Union, or any regulator or institution is implied by references to their frameworks or tokens. 
> All examples mentioned are fictitious.  
> See [DISCLAIMER.md](./DISCLAIMER.md) for full terms.


## Licenses
- **Code/tooling (if added later):** Apache-2.0 (see `LICENSE`)
- **JSON Schema (machine-readable):** CC0-1.0 (see `schema/LICENSE-CC0`)
- **Docs/specs/templates:** CC BY 4.0 (see `docs/LICENSE-CC-BY-4.0`)
- **Logos/wordmarks/brand:** All Rights Reserved (see `NOTICE`)

## How to cite

If you use this repository or build upon it, please cite:

Mavračić, J. (2025). *Policy Cards: Machine-Readable Runtime Governance for Autonomous AI Agents*  Zenodo. https://doi.org/10.5281/zenodo.17391796

For artifacts (schema/examples): https://doi.org/10.5281/zenodo.17392820


## Structure
- `schema/` — JSON Schema (CC0-1.0) and notes
- `examples/` — example Policy Cards in multiple domains
- `docs/` — crosswalk, templates, specs (CC BY 4.0)
- `.github/` — issue and PR templates


## Validator usage

Validate a Policy Card JSON against the JSON Schema and run basic lints.

Prerequisites (first time):

```cmd
cd d:\Projects2\policy-cards
npm install
```

Run validation (Windows cmd):

```cmd
cd d:\Projects2\policy-cards
npm run validate -- --input examples\payments-gb.json
```

Direct invocation (alternative):

```cmd
node cli\validate.js --schema schema\policy-card.schema.json --input examples\payments-gb.json
```

Options:
- `--schema` (optional): path to the JSON Schema (defaults to `schema/policy-card.schema.json`).
- `--input` (required): path to the Policy Card JSON file.
- `--strict-lint` (optional): treat lint warnings as errors (non‑zero exit).

On success: prints `Validation OK for <file>`.
On schema errors: prints detailed messages and exits non‑zero.

## Renderer usage

Render a Policy Card JSON to a human‑readable Markdown file using the Handlebars template. The renderer first runs the validator; if validation fails, no output is written.

Prerequisites (first time):

```cmd
cd d:\Projects2\policy-cards
npm install
```

Render (Windows cmd):

```cmd
cd d:\Projects2\policy-cards
npm run render -- --input examples\payments-gb.json
```

This writes `examples\payments-gb.md` next to the input by default. You can specify a custom output path:

```cmd
npm run render -- --input examples\payments-gb.json --output examples\payments-gb.md
```

Direct invocation (alternative):

```cmd
node cli\render.js --schema schema\policy-card.schema.json --template docs\templates\policy-card.md.hbs --input examples\payments-gb.json --output examples\payments-gb.md
```

Options:
- `--schema` (optional): path to the JSON Schema (defaults to `schema/policy-card.schema.json`).
- `--template` (optional): path to the Handlebars template (defaults to `docs/templates/policy-card.md.hbs`).
- `--input` (required): path to the Policy Card JSON file.
- `--output` (optional): path to the output `.md` file (defaults to input path with `.md`).
- `--strict-lint` (optional): treat lint warnings as errors (non‑zero exit).

## CI validation

This repo includes a minimal GitHub Actions workflow at `.github/workflows/validate.yml` that:
- Runs on push and pull requests affecting schema, examples, CLI, or crosswalk files.
- Installs Node 20 and dependencies with `npm ci`.
- Validates every `examples/*.json` file using the validator in non‑strict mode.

