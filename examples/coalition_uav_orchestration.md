
> Important: Research/illustration only; not certified or warranted for operational, medical, financial, or safety-critical use. No endorsement by NIST, ISO/IEC, the European Union, or any regulator is implied. See DISCLAIMER.md for full terms.

# Defence — Coalition Multi-UAV Orchestration (ROE Interoperability) — Policy Card (v0.1.0)

**Owner:** Coalition Operations Governance Cell  
**Created:** 2025-10-17T12:05:00Z  
**Valid:** 2025-10-17 — open-ended

## 1) Scope
- **Application:** Coalition orchestration of multi-UAV ISR tasks across partner nations; computes permissible tasking from nation-specific ROE profiles; never authorizes kinetic actions.
- **Stakeholders:** coalition_commander, national_mission_lead, safety_officer, legal_advisor, audit_officer
- **Jurisdictions:** NATO-UK, NATO-DE, NATO-CA
- **System refs:** [link](https://example.org/system-card/coalition-orchestration-agent.pdf)
- **Model/Data refs:** [link](https://example.org/model-card/coalition-permissions-model.pdf)

## 2) Applicable Policies
- **NATO STANAGs (mission coordination &amp; interoperability)** (NATO) — STANAG family [link](https://nso.nato.int/nso/nsdd/listpromulg.html)
- **Rules of Engagement (nation-specific)** (Coalition) — ROE profiles (policy-card tokens) [link](https://example.org/coalition/roe-profiles)
- **LOAC / Human Control** (International) — LOAC; Art. 36 reviews [link](https://ihl-databases.icrc.org/en/customary-ihl)
- **NIST AI RMF — GOVERN/MANAGE** (International) — NIST AI RMF 1.0 [link](https://airmf.nist.gov/)

## 3) Controls (Action Rules)
> ABAC tuple ⟨subject, action, resource, condition, effect⟩; effect ∈ {allow, deny, require_escalation}

- **AR-COAL-ALLOW-CROSSSITE-ISR** — *allow*  
  - Subject: `agent`  
  - Action: `assign_task`, Resource: `sensor_cueing_request`  
  - Condition: `kinetic == false && roe_permits == true && export_control_flag == false && signature_valid == true`  
  - Evidence required: `coalition_request_id`, `nation_code`, `partner_nation_code`, `roe_profile_id`, `roe_token_set`, `roe_permits`, `export_control_flag`, `signature_valid`, `data_sharing_scope`, `orchestration_id`  
  - Exceptions: None
- **AR-COAL-ESCALATE-ROE-CONFLICT** — *require_escalation*  
  - Subject: `agent`  
  - Action: `assign_task`, Resource: `sensor_cueing_request`  
  - Condition: `roe_permits == false || export_control_flag == true || cross_border == true || signature_valid == false`  
  - Evidence required: `coalition_request_id`, `nation_code`, `partner_nation_code`, `roe_profile_id`, `roe_token_set`, `roe_permits`, `roe_conflict_reason`, `export_control_flag`, `cross_border`, `waiver_id`, `waiver_signature_id`, `escalation_id`, `orchestration_id`  
  - Exceptions: `EX-COAL-DIPLO-WAIVER` (24h) by Coalition Legal Advisor
- **AR-COAL-DENY-KINETIC** — *deny*  
  - Subject: `agent`  
  - Action: `authorize_engagement`, Resource: `kinetic_effect`  
  - Condition: `true`  
  - Evidence required: `attempted_action`, `coalition_request_id`, `nation_code`  
  - Exceptions: None

## 4) Obligations
- **OB-COAL-CRYPTO-LEDGER** — Append all cross-site tasking decisions to a shared, append-only audit ledger with cryptographic signatures.  
  - When: Audit • Responsible: audit_officer  
  - Evidence: `ledger_tx_id`, `approval_timestamp`, `waiver_signature_id`
- **OB-COAL-ROE-PROFILE-ATTEST** — Require up-to-date ROE profile attestation from each partner before accepting cross-site tasks.  
  - When: Declare • Responsible: national_mission_lead  
  - Evidence: `roe_profile_id`, `roe_profile_attested_at`
- **OB-COAL-COSIGN-REVIEW** — For actions requiring waivers, collect cross-signatures and complete multinational review within SLA.  
  - When: Do • Responsible: coalition_commander  
  - Evidence: `cosignature_ids`, `review_timestamp`, `sla_deadline_ts`

## 5) Monitoring
- **Logging**
  - Events: `roe_profile_attested`, `task_assigned`, `task_blocked`, `waiver_requested`, `waiver_approved`, `waiver_denied`, `ledger_append`, `signature_mismatch_detected`, `export_control_breach_detected`, `action_denied`
  - Fields: `action_rule_id`, `approval_timestamp`, `attempted_action`, `coalition_request_id`, `cosignature_ids`, `cross_border`, `data_sharing_scope`, `escalation_id`, `export_control_flag`, `ledger_tx_id`, `nation_code`, `orchestration_id`, `partner_nation_code`, `review_timestamp`, `roe_conflict_reason`, `roe_permits`, `roe_profile_attested_at`, `roe_profile_id`, `roe_token_set`, `signature_mismatch`, `signature_valid`, `sla_deadline_ts`, `two_person_approval_id`, `waiver_id`, `waiver_signature_id`
  - Retention (days): 730
- **Detectors**
  - ROEConflict: Flags proposals that violate partner ROE tokens or require unavailable authorisations. (&#x3D;&#x3D; 1) — [spec](https://example.org/detectors/roe-conflict)
  - SignatureMismatch: Detects cryptographic signature mismatch or invalid signatures on cross-site requests. (&#x3D;&#x3D; 1) — [spec](https://example.org/detectors/signature-mismatch)
  - ExportControlBreach: Detects attempted export of data beyond declared scope or to disallowed jurisdictions. (&#x3D;&#x3D; 1) — [spec](https://example.org/detectors/export-control-breach)
  - AttestationStale: Flags ROE profile attestations older than allowed window. (&gt; 168) — [spec](https://example.org/detectors/attestation-stale)
- **Review**
  - Owner: coalition_governance_board • Cadence (days): 14 • Method: Bi-weekly multinational review of ROE conflicts, waivers, signatures, and export-control events; verify ledger completeness.

## 6) KPIs & Thresholds
- **KPIs**
  - KPI-ROE-SLA — roe_conflict_resolution_within_sla_pct target 95 over 30d
  - KPI-LEDGER-COVERAGE — audit_ledger_completeness_pct target 99 over 30d
  - KPI-ACCEPTANCE — cross_site_task_accept_rate_pct target 85 over 30d
- **Critical auto-fail:** `kinetic_authorization_attempted_by_orchestrator`, `cross_site_transfer_without_valid_signature`, `tasking_issued_without_roe_attestation`

## 7) Change Management
- **Approvals:** Coalition Commander, Legal Advisor, Safety Officer
- **Diff notes:** Initial coalition orchestration policy; introduces ROE token interop, diplomatic waivers, and cryptographic audit ledger.
- **Rollback conditions:** Any critical_auto_fail observed; KPI-LEDGER-COVERAGE &lt; 95 for 7d; sustained SignatureMismatch &gt; 3 in 24h
- **Backout plan:** Suspend cross-site tasking; restrict to national-only operations; require fresh ROE attestations and key rotation before re-enabling.

## 8) Assurance Mapping
- **NIST AI RMF:** `GOVERN-1`, `MAP-1`, `MEASURE-1`, `MANAGE-1`, `MANAGE-3`
- **ISO/IEC 42001:** `ISO42001-4`, `ISO42001-8`, `ISO42001-9`, `ISO42001-10`
- **EU AI Act:** `EUAA-AnnexIV-3`, `EUAA-AnnexIV-5`, `EUAA-AnnexIV-6`, `EUAA-Art72`

## 9) References
- Docs: [link](https://example.org/runbooks/coalition-orchestration), [link](https://example.org/audit/coalition-ledger), [link](https://example.org/playbooks/diplomatic-waiver-flow)
- Notes: Example 6: Coalition ROE interoperability via Policy Cards; per-agent ROE tokens, cross-border blocking/escalation, and signed audit ledger.
