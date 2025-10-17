
> Important: Research/illustration only; not certified or warranted for operational, medical, financial, or safety-critical use. No endorsement by NIST, ISO/IEC, the European Union, or any regulator is implied. See DISCLAIMER.md for full terms.

# Healthcare — Autonomous Diagnostic Co-Pilot (Radiology) — Policy Card (v0.1.0)

**Owner:** Radiology Quality &amp; Clinical Safety  
**Created:** 2025-10-17T11:05:00Z  
**Valid:** 2025-10-17 — open-ended

## 1) Scope
- **Application:** Autonomous pre-read assistance for CT/MRI with clinician oversight; generates structured descriptors and annotations but never finalizes diagnostic reports or treatment plans
- **Stakeholders:** patient, radiologist, reporting_radiographer, clinical_safety_officer, quality_manager
- **Jurisdictions:** GB
- **System refs:** [link](https://example.org/system-card/radiology-copilot.pdf)
- **Model/Data refs:** [link](https://example.org/model-card/radiology-perception-model.pdf)

## 2) Applicable Policies
- **ISO 13485 — Medical devices QMS** (International) — ISO 13485 [link](https://www.iso.org/standard/59752.html)
- **IEC 62304 — Medical device software lifecycle processes** (International) — IEC 62304 [link](https://webstore.iec.ch/publication/22733)
- **ISO 14971 — Risk management for medical devices** (International) — ISO 14971 [link](https://www.iso.org/standard/72704.html)
- **EU AI Act — Technical documentation &amp; PMM** (EU) — Annex IV; Article 72 [link](https://artificial-intelligence.europa.eu/ai-act_en)

## 3) Controls (Action Rules)
> ABAC tuple ⟨subject, action, resource, condition, effect⟩; effect ∈ {allow, deny, require_escalation}

- **AR-RAD-ALLOW-ANNOTATE** — *allow*  
  - Subject: `agent`  
  - Action: `annotate_images`, Resource: `imaging_study`  
  - Condition: `uncertainty <= 0.20 && maximum_lesion_size_mm < 10 && conflicting_opinion == false`  
  - Evidence required: `model_version`, `dicom_study_uid`, `image_series_uid`, `uncertainty`, `maximum_lesion_size_mm`, `findings_summary_id`  
  - Exceptions: None
- **AR-RAD-ESCALATE-THRESHOLDS** — *require_escalation*  
  - Subject: `agent`  
  - Action: `propose_findings`, Resource: `preliminary_findings`  
  - Condition: `uncertainty > 0.20 || maximum_lesion_size_mm >= 10 || conflicting_opinion == true`  
  - Evidence required: `uncertainty`, `maximum_lesion_size_mm`, `conflicting_opinion`, `escalation_id`, `reviewer_id`, `model_version`  
  - Exceptions: `EX-RAD-NIGHT-OVERRIDE` (8h) by Duty Consultant Radiologist
- **AR-RAD-DENY-AUTONOMOUS-REPORT** — *deny*  
  - Subject: `agent`  
  - Action: `finalize_report`, Resource: `diagnostic_report`  
  - Condition: `true`  
  - Evidence required: `attempted_action`, `model_version`, `uncertainty`  
  - Exceptions: None
- **AR-RAD-DENY-TREATMENT-REC** — *deny*  
  - Subject: `agent`  
  - Action: `recommend_treatment`, Resource: `treatment_plan`  
  - Condition: `true`  
  - Evidence required: `attempted_action`, `model_version`  
  - Exceptions: None

## 4) Obligations
- **OB-RAD-CLINICIAN-REVIEW** — All escalated preliminary findings require consultant radiologist review prior to report drafting.  
  - When: Do • Responsible: radiologist  
  - Evidence: `escalation_id`, `reviewer_id`, `review_timestamp`
- **OB-RAD-DUAL-SIGNOFF** — Final diagnostic reports require dual sign-off for escalated cases.  
  - When: Audit • Responsible: quality_manager  
  - Evidence: `report_id`, `primary_signoff_id`, `secondary_signoff_id`, `signoff_timestamp`
- **OB-RAD-MODEL-TRACE** — Record model version, dataset lineage, and DICOM series hash for each inference.  
  - When: Audit • Responsible: ops_analyst  
  - Evidence: `model_version`, `dataset_lineage_uri`, `dicom_series_hash`

## 5) Monitoring
- **Logging**
  - Events: `imaging_study_ingested`, `annotation_generated`, `findings_proposed`, `escalation_requested`, `escalation_resolved`, `report_finalized`, `action_denied`
  - Fields: `action_rule_id`, `attempted_action`, `callback_reference`, `conflicting_opinion`, `dataset_lineage_uri`, `dicom_series_hash`, `dicom_study_uid`, `escalation_id`, `findings_summary_id`, `image_series_uid`, `maximum_lesion_size_mm`, `model_version`, `patient_age`, `primary_signoff_id`, `report_id`, `review_timestamp`, `reviewer_id`, `secondary_signoff_id`, `signoff_timestamp`, `two_person_approval_id`, `uncertainty`, `fp_drift_rate`, `lesion_count`, `modality`, `body_region`, `laterality`, `image_quality_score`
  - Retention (days): 365
- **Detectors**
  - UncertaintySpike: Flags inferences with uncertainty above threshold (1 - confidence). (&gt; 0.2) — [spec](https://example.org/detectors/uncertainty-spike)
  - LesionSizeThreshold: Flags suspected lesions with maximum linear extent exceeding threshold (mm). (&gt;&#x3D; 10) — [spec](https://example.org/detectors/lesion-size-threshold)
  - ConflictWithRadiologist: Flags conflicts between agent pre-read and radiologist feedback. (&#x3D;&#x3D; 1) — [spec](https://example.org/detectors/conflict-with-radiologist)
  - FalsePositiveDrift: Monitors drift in false positive rate over a rolling window. (&gt;&#x3D; 0.1) — [spec](https://example.org/detectors/fp-drift)
  - MissingDICOMMetadata: Flags studies missing mandatory DICOM metadata (e.g., StudyInstanceUID, SeriesInstanceUID). (&#x3D;&#x3D; 1) — [spec](https://example.org/detectors/missing-dicom-metadata)
  - TurnaroundTimeout: Flags pre-read workflows exceeding turnaround threshold (minutes). (&gt; 60) — [spec](https://example.org/detectors/turnaround-timeout)
- **Review**
  - Owner: radiology_governance_board • Cadence (days): 14 • Method: Bi-weekly committee review of escalations, false positives, uncertainty distributions, and turnaround performance.

## 6) KPIs & Thresholds
- **KPIs**
  - KPI-ESC-PRECISION — escalation_precision target 0.9 over 30d
  - KPI-TAT-P50 — turnaround_time_p50_minutes target 30 over 30d
- **Critical auto-fail:** `autonomous_report_signed`, `autonomous_treatment_recommendation`, `missing_dicom_metadata_detected`

## 7) Change Management
- **Approvals:** Chief Radiologist, Clinical Safety Officer, Quality Manager
- **Diff notes:** Initial radiology co-pilot card.
- **Rollback conditions:** KPI-TAT-P50 &gt; 2x target for 7d; KPI-ESC-PRECISION &lt; 0.8 for 7d; any critical_auto_fail observed
- **Backout plan:** Disable AR-RAD-ALLOW-ANNOTATE; route all cases to clinician-only workflow; freeze model_version until corrective action completed.

## 8) Assurance Mapping
- **NIST AI RMF:** `GOVERN-1`, `MAP-1`, `MEASURE-1`, `MANAGE-1`, `MANAGE-3`
- **ISO/IEC 42001:** `ISO42001-4`, `ISO42001-8`, `ISO42001-9`, `ISO42001-10`
- **EU AI Act:** `EUAA-AnnexIV-3`, `EUAA-AnnexIV-4`, `EUAA-AnnexIV-6`, `EUAA-AnnexIV-9`, `EUAA-Art72`

## 9) References
- Docs: [link](https://example.org/runbooks/radiology-copilot), [link](https://example.org/audit/radiology-governance), [link](https://example.org/playbooks/dual-signoff)
- Notes: Healthcare example: autonomous diagnostic co-pilot for radiology with clinician oversight.
