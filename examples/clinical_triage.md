
> Important: Research/illustration only; not certified or warranted for operational, medical, financial, or safety-critical use. No endorsement by NIST, ISO/IEC, the European Union, or any regulator is implied. See DISCLAIMER.md for full terms.

# Healthcare — Clinical Triage Agent (NHS Sandbox) — Policy Card (v0.1.0)

**Owner:** Clinical Governance &amp; Safety  
**Created:** 2025-10-17T10:45:00Z  
**Valid:** 2025-10-17 — open-ended

## 1) Scope
- **Application:** Autonomous clinical intake &amp; triage recommendations within an NHS A&amp;E sandbox under clinician oversight
- **Stakeholders:** patient, triage_nurse, clinician, risk_officer, data_protection_officer
- **Jurisdictions:** GB
- **System refs:** [link](https://example.org/system-card/clinical-triage-agent.pdf)
- **Model/Data refs:** [link](https://example.org/model-card/triage-risk-model.pdf)

## 2) Applicable Policies
- **NHS Data Security and Protection Toolkit (DSPT)** (GB) — NHS DSPT [link](https://www.dsptoolkit.nhs.uk/)
- **ISO 13485 — Medical devices QMS** (International) — ISO 13485 [link](https://www.iso.org/standard/59752.html)
- **ISO 14971 — Risk management for medical devices** (International) — ISO 14971 [link](https://www.iso.org/standard/72704.html)
- **EU AI Act — Technical documentation &amp; PMM** (EU) — Annex IV; Article 72 [link](https://artificial-intelligence.europa.eu/ai-act_en)

## 3) Controls (Action Rules)
> ABAC tuple ⟨subject, action, resource, condition, effect⟩; effect ∈ {allow, deny, require_escalation}

- **AR-TRIAGE-ALLOW-ROUTINE** — *allow*  
  - Subject: `agent`  
  - Action: `propose_triage`, Resource: `triage_recommendation`  
  - Condition: `vitals_present == true && risk_level < 0.6 && confidence_score >= 0.8 && red_flag == false`  
  - Evidence required: `vitals_present`, `risk_level`, `confidence_score`, `red_flag`, `triage_category`, `questionnaire_version`, `model_version`  
  - Exceptions: None
- **AR-TRIAGE-ESCALATE-REDFLAG** — *require_escalation*  
  - Subject: `agent`  
  - Action: `propose_triage`, Resource: `triage_recommendation`  
  - Condition: `red_flag == true || confidence_score < 0.8 || missing_vitals_count > 0 || (patient_age >= 65 && symptom_chest_pain == true)`  
  - Evidence required: `red_flag`, `confidence_score`, `missing_vitals_count`, `patient_age`, `symptom_chest_pain`, `escalation_id`, `triage_category`, `model_version`  
  - Exceptions: `EX-TRIAGE-REMOTE-CLINIC-OVERRIDE` (12h) by Clinical Duty Consultant
- **AR-TRIAGE-DENY-AUTONOMY** — *deny*  
  - Subject: `agent`  
  - Action: `issue_diagnosis`, Resource: `diagnosis_statement`  
  - Condition: `true`  
  - Evidence required: `attempted_action`, `model_version`, `confidence_score`  
  - Exceptions: None
- **AR-TRIAGE-DENY-PRESCRIPTION** — *deny*  
  - Subject: `agent`  
  - Action: `issue_prescription`, Resource: `medication_order`  
  - Condition: `true`  
  - Evidence required: `attempted_action`, `model_version`  
  - Exceptions: None

## 4) Obligations
- **OB-CLINICIAN-REVIEW** — All escalations must be reviewed by a qualified clinician prior to patient disposition.  
  - When: Do • Responsible: triage_nurse  
  - Evidence: `escalation_id`, `clinician_id`, `review_timestamp`
- **OB-PATIENT-NOTICE** — Display clear notice that the agent does not provide medical diagnosis and that a clinician will review.  
  - When: Declare • Responsible: frontend_owner  
  - Evidence: `notice_displayed_timestamp`, `ui_notice_version`
- **OB-MODEL-VERSION-TRACE** — Record model version, dataset lineage reference, and questionnaire version for every triage proposal.  
  - When: Audit • Responsible: ops_analyst  
  - Evidence: `model_version`, `dataset_lineage_uri`, `questionnaire_version`

## 5) Monitoring
- **Logging**
  - Events: `intake_started`, `intake_completed`, `triage_proposed`, `escalation_requested`, `escalation_resolved`, `action_denied`
  - Fields: `action_rule_id`, `attempted_action`, `bias_group`, `callback_reference`, `clinician_id`, `confidence_score`, `dataset_lineage_uri`, `detector_snapshots_uri`, `escalation_id`, `missing_vitals_count`, `model_version`, `notice_displayed_timestamp`, `patient_age`, `questionnaire_version`, `red_flag`, `risk_level`, `symptom_chest_pain`, `triage_category`, `ui_notice_version`, `vitals_present`, `two_person_approval_id`, `review_timestamp`
  - Retention (days): 365
- **Detectors**
  - LowConfidence: Flags triage proposals with confidence below threshold. (&lt; 0.8) — [spec](https://example.org/detectors/low-confidence)
  - MissingVitals: Flags missing or incomplete vital signs during intake. (&gt; 0) — [spec](https://example.org/detectors/missing-vitals)
  - BiasDrift: Monitors disparity across bias groups (e.g., age/sex/ethnicity) over rolling windows. (&gt;&#x3D; 0.1) — [spec](https://example.org/detectors/bias-drift)
  - RedFlagDetected: Detects clinical red flags (e.g., suspected STEMI, severe dyspnoea). (&#x3D;&#x3D; 1) — [spec](https://example.org/detectors/red-flag)
  - IntakeTimeout: Flags stalled intakes exceeding maximum duration (seconds). (&gt; 300) — [spec](https://example.org/detectors/intake-timeout)
- **Review**
  - Owner: clinical_governance_board • Cadence (days): 14 • Method: Bi-weekly committee review of escalations, false positives, bias metrics, and safety incidents.

## 6) KPIs & Thresholds
- **KPIs**
  - KPI-HANDOVER-P50 — handover_latency_p50_minutes target 15 over 30d
  - KPI-ESC-PRECISION — escalation_precision target 0.9 over 30d
- **Critical auto-fail:** `autonomous_diagnosis_emitted`, `autonomous_prescription_emitted`, `triage_without_vitals`

## 7) Change Management
- **Approvals:** Chief Medical Officer, Clinical Safety Officer, Data Protection Officer
- **Diff notes:** Initial clinical triage sandbox card.
- **Rollback conditions:** Any critical_auto_fail observed; KPI-HANDOVER-P50 &gt; 2x target for 7d; BiasDrift &gt;&#x3D; 0.2 for 7d
- **Backout plan:** Disable AR-TRIAGE-ALLOW-ROUTINE; route all intakes to clinician-only workflow; freeze model_version until review closure.

## 8) Assurance Mapping
- **NIST AI RMF:** `GOVERN-1`, `MAP-1`, `MEASURE-1`, `MANAGE-1`, `MANAGE-3`
- **ISO/IEC 42001:** `ISO42001-4`, `ISO42001-8`, `ISO42001-9`, `ISO42001-10`
- **EU AI Act:** `EUAA-AnnexIV-3`, `EUAA-AnnexIV-4`, `EUAA-AnnexIV-5`, `EUAA-AnnexIV-6`, `EUAA-AnnexIV-9`, `EUAA-Art72`

## 9) References
- Docs: [link](https://example.org/runbooks/clinical-triage-agent), [link](https://example.org/audit/clinical-governance), [link](https://example.org/playbooks/escalation-healthcare)
- Notes: Healthcare example 1: NHS A&amp;E triage pilot in a regulatory sandbox.
