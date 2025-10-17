<!-- DISCLAIMER: Research/illustration only; not for operational use. 
See repository root DISCLAIMER.md for full terms. -->

# Policy Card — Specification Notes (v1, skeleton)

## 0. Purpose & Positioning
Normative, deployment-bound policy artifact that complements Model/Data/System Cards. Diff-able, machine-validated, auditable. (See paper §§1–4 for rationale.)

## 1. Data Model Overview
Top-level sections: `meta`, `scope`, `applicable_policies`, `controls`, `obligations`, `monitoring`, `kpis_thresholds`, `change_management`, `assurance_mapping`, `references`.

## 2. Controls Semantics
- ABAC tuple: ⟨subject, action, resource, condition, effect⟩
- `effect` ∈ {allow, deny, require_escalation}; escalation requires evidence capture and a named path.
- Action rule IDs: `^AR-[A-Z0-9-]+$`.
- Exceptions (time-boxed): `^EX-[A-Z0-9-]+$`, `time_bound` matches `^[0-9]+[mhdy]$`.

## 3. Evidence & Monitoring
- `evidence_required` names MUST be present in `monitoring.logging.fields`.
- Minimums: `monitoring.logging.retention_days >= 1`; `monitoring.review.cadence_days >= 1`.
- Detectors MUST include numeric thresholds and a `uri` stub to their definition.

## 4. KPIs & Criticals
- At least one `critical_auto_fail` MUST be present (domain-specific).
- KPIs define targets/windows; enforcement is out-of-scope but expected to be tested in CI/sim.

## 5. Change Management
- Approvals enumerate accountable roles; `diff_notes` summarize semantic changes; `rollback_conditions` and `backout_plan` document safe reversion.

## 6. Assurance Mapping
- Token arrays for NIST AI RMF / ISO/IEC 42001 / EU AI Act (Annex IV / Art. 72 PMM).
- The registry of valid tokens lives in `docs/crosswalk.md`; examples must use tokens from that list.

## 7. Validation Profile (Day 2)
- JSON Schema 2020-12 validation must pass for a trivial card.
- Day 3 adds lints (e.g., at least one rule per effect type, retention vs cadence heuristics, etc.).

## 8. Known Non-Goals (v1)
- No embedded enforcement engine; no full policy language evaluation.
- No automatic token inference for crosswalk (manual selection for auditability).

