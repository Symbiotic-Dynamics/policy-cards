
> Important: Research/illustration only; not certified or warranted for operational, medical, financial, or safety-critical use. No endorsement by NIST, ISO/IEC, the European Union, or any regulator is implied. See DISCLAIMER.md for full terms.

# Defence — UAV ISR Mission Planner (Human-in-the-Loop Target Designation) — Policy Card (v0.1.0)

**Owner:** Joint Operations Governance &amp; Safety Office  
**Created:** 2025-10-17T11:45:00Z  
**Valid:** 2025-10-17 — open-ended

## 1) Scope
- **Application:** Autonomous mission-planning assistant for ISR UAV operations; recommends sensor tasks and potential targets but never authorises kinetic engagement.
- **Stakeholders:** mission_operator, tactical_commander, safety_officer, data_link_controller, review_board
- **Jurisdictions:** GB, NATO
- **System refs:** [link](https://example.org/system-card/uav-isr-mission-planner.pdf)
- **Model/Data refs:** [link](https://example.org/model-card/isr-target-recommendation-model.pdf)

## 2) Applicable Policies
- **NATO STANAG 4671 — UAV Airworthiness &amp; Safety** (NATO) — STANAG 4671 [link](https://nso.nato.int/nso/nsdd/listpromulg.html)
- **LOAC / Rules of Engagement (Human Control)** (International) — LOAC Art. 36; DoD Directive 3000.09 [link](https://ihl-databases.icrc.org/en/customary-ihl/summary-rule-1)
- **UK MOD JSP 912 — Human-Machine Teaming Safety** (GB) — JSP 912 [link](https://www.gov.uk/guidance/defence-policy-publications)
- **NIST AI RMF — GOVERN / MANAGE Functions** (International) — NIST AI RMF 1.0 [link](https://airmf.nist.gov/)

## 3) Controls (Action Rules)
> ABAC tuple ⟨subject, action, resource, condition, effect⟩; effect ∈ {allow, deny, require_escalation}

- **AR-UAV-ALLOW-ISR-PLANNING** — *allow*  
  - Subject: `agent`  
  - Action: `plan_mission`, Resource: `isr_route`  
  - Condition: `blue_force_overlap == false && nav_integrity == true && comms_status == 'stable'`  
  - Evidence required: `blue_force_overlap`, `nav_integrity`, `comms_status`, `mission_area_id`, `operator_id`, `model_version`  
  - Exceptions: None
- **AR-UAV-ESCALATE-TARGET-DESIGNATION** — *require_escalation*  
  - Subject: `agent`  
  - Action: `propose_target`, Resource: `target_candidate`  
  - Condition: `risk_score >= 0.6 || blue_force_distance_m < 3000 || gps_spoof_detected == true || comms_status != 'stable'`  
  - Evidence required: `risk_score`, `blue_force_distance_m`, `gps_spoof_detected`, `comms_status`, `target_id`, `escalation_id`, `operator_id`  
  - Exceptions: `EX-UAV-TRAINING-SANDBOX` (4h) by Range Safety Officer
- **AR-UAV-DENY-KINETIC-ACTION** — *deny*  
  - Subject: `agent`  
  - Action: `initiate_engagement`, Resource: `lethal_effect`  
  - Condition: `true`  
  - Evidence required: `attempted_action`, `mission_area_id`, `operator_id`  
  - Exceptions: None

## 4) Obligations
- **OB-UAV-HUMAN-AUTH** — All target designations and kinetic recommendations require explicit human authorization with digital signature before execution.  
  - When: Do • Responsible: mission_operator  
  - Evidence: `authorization_signature_id`, `target_id`, `approval_timestamp`
- **OB-UAV-BLUEFORCE-VERIFY** — Verify blue-force deconfliction data prior to mission start and every 10 minutes in flight.  
  - When: Declare • Responsible: safety_officer  
  - Evidence: `blue_force_update_timestamp`, `deconfliction_check_id`
- **OB-UAV-LOG-OVERRIDES** — All human overrides and escalations must be logged with immutable signatures and preserved for audit.  
  - When: Audit • Responsible: review_board  
  - Evidence: `override_id`, `override_reason`, `operator_id`, `approval_signature_id`, `review_timestamp`

## 5) Monitoring
- **Logging**
  - Events: `mission_planned`, `target_proposed`, `escalation_requested`, `authorization_signed`, `override_executed`, `gps_spoof_detected`, `comms_lost`, `comms_restored`, `blueforce_update`, `action_denied`
  - Fields: `action_rule_id`, `approval_signature_id`, `approval_timestamp`, `attempted_action`, `blue_force_distance_m`, `blue_force_overlap`, `blue_force_update_timestamp`, `comms_status`, `deconfliction_check_id`, `escalation_id`, `gps_spoof_detected`, `mission_area_id`, `model_version`, `nav_integrity`, `operator_id`, `override_id`, `override_reason`, `review_timestamp`, `risk_score`, `target_id`, `training_session_id`, `two_person_approval_id`, `authorization_signature_id`
  - Retention (days): 730
- **Detectors**
  - GPSspoofDetector: Detects inconsistent GPS/INS readings indicating possible spoofing. (&#x3D;&#x3D; 1) — [spec](https://example.org/detectors/gps-spoof)
  - BlueForceDeconfliction: Detects potential blue-force proximity or overlap violations. (&lt;&#x3D; 3000) — [spec](https://example.org/detectors/blueforce-deconfliction)
  - CommsLossDetector: Monitors data-link stability and triggers hold pattern if loss exceeds threshold. (&gt;&#x3D; 30) — [spec](https://example.org/detectors/comms-loss)
  - UnauthorizedActionAttempt: Flags any attempted kinetic engagement by the agent. (&#x3D;&#x3D; 1) — [spec](https://example.org/detectors/unauthorized-action)
- **Review**
  - Owner: defence_safety_governance_board • Cadence (days): 14 • Method: Bi-weekly audit of mission logs, override patterns, spoofing alerts, and deconfliction breaches.

## 6) KPIs & Thresholds
- **KPIs**
  - KPI-ESC-TIME — avg_time_to_authorization_sec target 120 over 30d
  - KPI-OVERRIDE-FREQ — operator_override_frequency_pct target 5 over 30d
- **Critical auto-fail:** `autonomous_lethal_action_detected`, `target_designation_without_human_approval`, `loss_of_blue_force_data`

## 7) Change Management
- **Approvals:** Mission Commander, Safety Officer, Compliance Auditor
- **Diff notes:** Initial UAV ISR Mission-Planner policy; enforces human-in-loop constraint, blue-force safety, and GPS integrity.
- **Rollback conditions:** Any critical_auto_fail triggered; sustained spoofing detections &gt; 10 in 24h; KPI-ESC-TIME &gt; 2x target for 7d
- **Backout plan:** Suspend target proposal actions; revert to manual planning mode; route all authorizations to human-only workflow.

## 8) Assurance Mapping
- **NIST AI RMF:** `GOVERN-1`, `MAP-1`, `MEASURE-1`, `MANAGE-1`, `MANAGE-3`
- **ISO/IEC 42001:** `ISO42001-4`, `ISO42001-8`, `ISO42001-9`, `ISO42001-10`
- **EU AI Act:** `EUAA-AnnexIV-3`, `EUAA-AnnexIV-5`, `EUAA-AnnexIV-6`, `EUAA-Art72`

## 9) References
- Docs: [link](https://example.org/runbooks/uav-mission-planner), [link](https://example.org/audit/defence-autonomy), [link](https://example.org/playbooks/human-authorization-flow)
- Notes: Example 5: Defence mission-planning assistant demonstrating enforceable human-in-loop and blue-force safety governance.
