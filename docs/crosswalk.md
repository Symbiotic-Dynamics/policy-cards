# Crosswalk: Policy Card → NIST AI RMF / ISO/IEC 42001 / EU AI Act

This document provides:

1. A **crosswalk table** mapping each Policy Card section to relevant assurance tokens for **NIST AI RMF 1.0**, **ISO/IEC 42001**, and the **EU AI Act (Annex IV / Art. 72)**.  
2. A **token registry** — the canonical tokens that may appear in `assurance_mapping` in your policy-card JSONs.  
3. A **usage example** showing how to embed these tokens in a card.  
4. Notes on maintenance and validation.

---

## 1. Crosswalk Table

| Policy Card Section | Purpose / Role | NIST AI RMF Tokens | ISO/IEC 42001 Tokens | EU AI Act Tokens | Rationale / Notes |
|---|---|---|---|---|---|
| **meta** | Identification, versioning, ownership, effective dates | `GOVERN-1` | `ISO42001-5` (Leadership), `ISO42001-4` (Context) | `EUAA-AnnexIV-1` | Captures metadata and governance context. |
| **scope** | Application boundaries, stakeholders, jurisdictions | `MAP-1` | `ISO42001-4` | `EUAA-AnnexIV-1` | Defines the context in which AI is used. |
| **applicable_policies** | External regulatory or policy references | `GOVERN-1` | `ISO42001-6` (Planning / risk) | `EUAA-AnnexIV-7` | Maps to legal/standards compliance. |
| **controls.action_rules** | Normative ABAC rules (allow, deny, escalate) | `MANAGE-1`, `MANAGE-3` | `ISO42001-8` (Operation) | `EUAA-AnnexIV-3` | Operational control logic and oversight. |
| **obligations** | Must-do commitments (notice, consent, record-keeping) | `GOVERN-2`, `GOVERN-1` | `ISO42001-8` / `ISO42001-7` | `EUAA-AnnexIV-3` | Embeds required behaviors aligned with oversight. |
| **monitoring.logging** | Events, fields, retention policies | `MEASURE-1` | `ISO42001-9` (Performance evaluation) | `EUAA-AnnexIV-3` | Telemetry and logging for compliance and audit. |
| **monitoring.detectors** | Detection of anomalies/threshold breaches | `MEASURE-1`, `MEASURE-2` | `ISO42001-9` / `ISO42001-8` | `EUAA-AnnexIV-4` | Performance metrics and detection logic. |
| **monitoring.review** | Periodic review, ownership, cadence | `GOVERN-2`, `MANAGE-2` | `ISO42001-10` (Improvement), `ISO42001-9` | `EUAA-Art72`, `EUAA-AnnexIV-9` | Post-market monitoring, continuous evaluation. |
| **kpis_thresholds** | KPIs and critical failure triggers | `MEASURE-1` / `MANAGE-1` | `ISO42001-9` | `EUAA-AnnexIV-4` | Measurement of performance, red lines. |
| **change_management** | Approval, rollback, versioning of changes | `MANAGE-3` | `ISO42001-10`, `ISO42001-8` | `EUAA-AnnexIV-6` | Lifecycle control & documentation of changes. |
| **assurance_mapping** | Linking policy card to framework tokens | — | — | — | This section *is* where tokens are recorded. |
| **references** | Supporting docs, external URIs, notes | `GOVERN-1`, `MAP-1` | `ISO42001-7` | `EUAA-AnnexIV-7` / `AnnexIV-8` | Traceability of documentation. |

---

## 2. Token Registry (Canonical Tokens)

### NIST AI RMF 1.0 (Core Categories)

Category-level tokens (rather than detailed subcategories) are used:

- `GOVERN-1` — Governance: policies, roles, processes  
- `GOVERN-2` — Embedding trustworthy AI characteristics  
- `MAP-1` — Mapping intended use, context, boundaries  
- `MEASURE-1` — Measurement strategies, metrics, data  
- `MEASURE-2` — Continuous measurement and evaluation  
- `MANAGE-1` — Risk response, treatment, action logic  
- `MANAGE-2` — Prioritization of responses  
- `MANAGE-3` — Planning, documenting, executing responses  

_(These align with the NIST AI RMF’s four Functions: GOVERN, MAP, MEASURE, MANAGE.)_

---

### ISO/IEC 42001:2023 (AIMS MSS / PDCA Clauses)

These tokens correspond to top-level clause families:

- `ISO42001-4` — Context of the Organization  
- `ISO42001-5` — Leadership  
- `ISO42001-6` — Planning  
- `ISO42001-7` — Support (resources, documentation)  
- `ISO42001-8` — Operation  
- `ISO42001-9` — Performance Evaluation  
- `ISO42001-10` — Improvement  

---

### EU AI Act — Annex IV & Article 72 Tokens

- `EUAA-AnnexIV-1`: General description, purpose, version, environment  
- `EUAA-AnnexIV-3`: Control / oversight, monitoring, human oversight (Art. 14)  
- `EUAA-AnnexIV-4`: Appropriateness of performance metrics  
- `EUAA-AnnexIV-5`: Risk management system per Art. 9  
- `EUAA-AnnexIV-6`: Changes through lifecycle  
- `EUAA-AnnexIV-7`: Harmonised standards / applied standards  
- `EUAA-AnnexIV-8`: EU Declaration of Conformity  
- `EUAA-AnnexIV-9`: Post-market performance evaluation (PMM)  
- `EUAA-Art72`: Post-market monitoring requirement / plan  

(_See Annex IV technical documentation requirements under AI Act_)

> **Note:** Annex IV § 2 (“General description of system elements and development process”) is *not tokenized* for Policy Cards. It applies to the System Card or Model Card layer, not to deployment-layer governance artefacts.


---

## 3. Usage Example

```json
"assurance_mapping": {
  "nist": ["GOVERN-1", "MAP-1", "MEASURE-1", "MANAGE-1"],
  "iso_42001": ["ISO42001-4", "ISO42001-8", "ISO42001-9"],
  "eu_ai_act": ["EUAA-AnnexIV-3", "EUAA-AnnexIV-4", "EUAA-Art72"]
}
```
This indicates that this policy card relates to governance + mapping + measurement + operational logic, with oversight/control obligations relevant under the EU AI Act’s Annex IV and Article 72.

