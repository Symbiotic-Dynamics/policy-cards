# Policy Cards

**Policy Cards** are a deployment-layer, machine-readable artifact that specifies
the operational rules, obligations, exceptions, evidence, and assurance mappings
that a deployed AI system or agent must satisfy in a given context.

> This repository hosts the **open specification and artifacts**:
> - JSON Schema (2020-12)
> - Examples (multiple domains)
> - Crosswalk to NIST AI RMF / ISO/IEC 42001 / EU AI Act
> - Authoring template and specs notes

## Status
This repository starts **private** and will become **public** at the time of the
initial paper preprint release.

## License matrix
- **Code/tooling (if added later):** Apache-2.0 (see `LICENSE`)
- **JSON Schema (machine-readable):** CC0-1.0 (see `schema/LICENSE-CC0`)
- **Docs/specs/templates:** CC BY 4.0 (see `docs/LICENSE-CC-BY-4.0`)
- **Logos/wordmarks/brand:** All Rights Reserved (see `NOTICE`)

## How to cite
- **Primary (concept):** the Policy Cards paper (arXiv: TBA)
- **Artifacts (schema/examples):** Zenodo concept DOI (TBA) and version DOI per release

## Structure
- `schema/` — JSON Schema (CC0-1.0) and notes
- `examples/` — example Policy Cards in multiple domains
- `docs/` — crosswalk, templates, specs (CC BY 4.0)
- `.github/` — issue and PR templates

> ⚠️ This repository contains no production code in the initial commit.

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
