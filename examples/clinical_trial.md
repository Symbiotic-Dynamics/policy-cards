
> Important: Research/illustration only; not certified or warranted for operational, medical, financial, or safety-critical use. No endorsement by NIST, ISO/IEC, the European Union, or any regulator is implied. See DISCLAIMER.md for full terms.

# Healthcare — Multi-Agent Clinical Trial Coordinator (Trial Orchestration Agent) — Policy Card (v0.1.0)

**Owner:** Sponsor Quality Office &amp; DSMB Secretariat  
**Created:** 2025-10-17T11:30:00Z  
**Valid:** 2025-10-17 — open-ended

## 1) Scope
- **Application:** Federated Phase III oncology trial coordination across UK/DE/CA sites; orchestrates anonymised endpoint exchange and compliance workflows among site agents, ethics/DSMB agents, and sponsor QA.
- **Stakeholders:** participant, site_investigator, ethics_board_member, dsmb_member, sponsor_quality_manager, data_protection_officer
- **Jurisdictions:** GB, DE, CA
- **System refs:** [link](https://example.org/system-card/trial-orchestration-agent.pdf)
- **Model/Data refs:** [link](https://example.org/model-card/endpoint-aggregation-model.pdf)

## 2) Applicable Policies
- **GDPR — International transfers (SCCs/adequacy)** (EU) — GDPR Art. 44-49 [link](https://gdpr.eu/article-44-gdpr/)
- **UK GDPR &amp; DPA 2018 — Research &amp; health data** (GB) — UK GDPR; DPA 2018 [link](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/)
- **Germany - BDSG &amp; Länder research provisions** (DE) — BDSG [link](https://www.gesetze-im-internet.de/bdsg_2018/)
- **Canada - PIPEDA/PHIPA (site dependent)** (CA) — PIPEDA; PHIPA (ON) [link](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/)
- **ICH Good Clinical Practice (E6(R2))** (International) — ICH E6(R2) [link](https://www.ich.org/page/efficacy-guidelines)
- **EU AI Act — Technical documentation &amp; PMM** (EU) — Annex IV; Article 72 [link](https://artificial-intelligence.europa.eu/ai-act_en)

## 3) Controls (Action Rules)
> ABAC tuple ⟨subject, action, resource, condition, effect⟩; effect ∈ {allow, deny, require_escalation}

- **AR-TRIAL-ALLOW-ANON-METRICS** — *allow*  
  - Subject: `agent`  
  - Action: `exchange_metrics`, Resource: `aggregated_endpoints`  
  - Condition: `phi_present == false && consent_token_valid == true && protocol_version_locked == true && jurisdiction_permitted == true`  
  - Evidence required: `phi_present`, `consent_token_id`, `consent_token_valid`, `protocol_version`, `protocol_version_locked`, `jurisdiction_code`, `transfer_request_id`, `dataset_lineage_uri`  
  - Exceptions: None
- **AR-TRIAL-ESCALATE-CROSSBORDER** — *require_escalation*  
  - Subject: `agent`  
  - Action: `request_data_transfer`, Resource: `deidentified_dataset_export`  
  - Condition: `((cross_border == true) && (adequacy_status == false) && (scc_basis == false)) || schema_drift == true || adverse_event_grade >= 3 || consent_token_valid == false`  
  - Evidence required: `cross_border`, `adequacy_status`, `scc_basis`, `schema_drift`, `adverse_event_grade`, `consent_token_id`, `consent_token_valid`, `transfer_request_id`, `jurisdiction_code`, `escalation_id`  
  - Exceptions: `EX-TRIAL-SAE-EMERGENCY-DATAFLOW` (24h) by DSMB Chair
- **AR-TRIAL-DENY-IDENTIFIABLE** — *deny*  
  - Subject: `agent`  
  - Action: `access_identifiable_data`, Resource: `participant_record`  
  - Condition: `true`  
  - Evidence required: `attempted_action`, `site_id`, `jurisdiction_code`  
  - Exceptions: None

## 4) Obligations
- **OB-DSMB-REVIEW-SAE** — DSMB must review SAE of CTCAE grade ≥ 3 within 24 hours of notification.  
  - When: Do • Responsible: dsmb_member  
  - Evidence: `adverse_event_grade`, `dsmb_ticket_id`, `review_timestamp`
- **OB-CRYPTO-SIGN-EXPORTS** — All dataset exports must be cryptographically signed and include immutable lineage pointers.  
  - When: Audit • Responsible: sponsor_quality_manager  
  - Evidence: `export_signature_id`, `dataset_lineage_uri`, `transfer_request_id`
- **OB-CONSENT-VERIFICATION** — Verify consent token validity for each subject before any data egress.  
  - When: Declare • Responsible: site_investigator  
  - Evidence: `consent_token_id`, `consent_token_valid`, `consent_last_checked_at`

## 5) Monitoring
- **Logging**
  - Events: `data_ingested`, `consent_verified`, `data_export_requested`, `data_export_approved`, `data_export_denied`, `adverse_event_reported`, `dsmb_review_completed`, `protocol_deviation_detected`, `exception_approved`
  - Fields: `action_rule_id`, `adequacy_status`, `adverse_event_grade`, `attempted_action`, `callback_reference`, `consent_last_checked_at`, `consent_token_id`, `consent_token_valid`, `cross_border`, `dataset_lineage_uri`, `dicom_series_hash`, `dsmb_ticket_id`, `escalation_id`, `export_signature_id`, `jurisdiction_code`, `minimal_dataset_manifest_uri`, `phi_present`, `protocol_version`, `protocol_version_locked`, `schema_drift`, `scc_basis`, `site_id`, `transfer_request_id`, `two_person_approval_id`, `review_timestamp`
  - Retention (days): 365
- **Detectors**
  - ConsentRevoked: Flags subjects whose consent token was revoked or expired. (&#x3D;&#x3D; 1) — [spec](https://example.org/detectors/consent-revoked)
  - CrossBorderAnomaly: Flags cross-border transfers lacking adequacy or SCC basis. (&#x3D;&#x3D; 1) — [spec](https://example.org/detectors/cross-border-anomaly)
  - ProtocolDeviationSpike: Flags spikes in protocol deviations beyond baseline. (&gt;&#x3D; 5) — [spec](https://example.org/detectors/protocol-deviation-spike)
  - SAESeverityHigh: Flags serious adverse events of CTCAE grade ≥ 3. (&gt;&#x3D; 3) — [spec](https://example.org/detectors/sae-severity-high)
- **Review**
  - Owner: trial_governance_board • Cadence (days): 14 • Method: Bi-weekly multi-agent governance review (DSMB, Ethics, Sponsor QA): transfers, SAEs, consent revocations, protocol deviations.

## 6) KPIs & Thresholds
- **KPIs**
  - KPI-DATA-LATENCY-P95 — data_sharing_latency_p95_sec target 3600 over 30d
  - KPI-DSMB-24H — dsmb_review_within_24h_pct target 99 over 30d
- **Critical auto-fail:** `export_identifiable_data`, `transfer_without_valid_consent`, `cross_border_without_adequacy_or_SCCs`

## 7) Change Management
- **Approvals:** Trial Steering Committee, DSMB Chair, Data Protection Officer
- **Diff notes:** Initial multi-agent orchestration card; introduces cross-border consent checks, SAE fast-lane, cryptographic export signing.
- **Rollback conditions:** Any critical_auto_fail observed; KPI-DSMB-24H &lt; 95 for 7d; sustained ProtocolDeviationSpike &gt;&#x3D; 10 for 48h
- **Backout plan:** Suspend cross-border exports; restrict agents to site-local aggregation; route all SAE data to DSMB via manual process; freeze protocol_version until corrective CAPA closes.

## 8) Assurance Mapping
- **NIST AI RMF:** `GOVERN-1`, `MAP-1`, `MEASURE-1`, `MANAGE-1`, `MANAGE-3`
- **ISO/IEC 42001:** `ISO42001-4`, `ISO42001-8`, `ISO42001-9`, `ISO42001-10`
- **EU AI Act:** `EUAA-AnnexIV-3`, `EUAA-AnnexIV-4`, `EUAA-AnnexIV-5`, `EUAA-AnnexIV-6`, `EUAA-AnnexIV-9`, `EUAA-Art72`

## 9) References
- Docs: [link](https://example.org/runbooks/trial-orchestration), [link](https://example.org/audit/trial-governance), [link](https://example.org/playbooks/dsmb-escalation)
- Notes: Example 4 multi-agent scenario: federated clinical trial coordination with jurisdictional controls and collective assurance.
