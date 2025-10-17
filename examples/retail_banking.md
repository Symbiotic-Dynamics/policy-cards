
> Important: Research/illustration only; not certified or warranted for operational, medical, financial, or safety-critical use. No endorsement by NIST, ISO/IEC, the European Union, or any regulator is implied. See DISCLAIMER.md for full terms.

# Retail Banking — Payments Agent (GB/FPS) — Policy Card (v0.1.0)

**Owner:** Payments Risk &amp; Controls  
**Created:** 2025-10-17T10:30:00Z  
**Valid:** 2025-10-17 — open-ended

## 1) Scope
- **Application:** Initiate/check/cancel Faster Payments transfers in a UK retail banking app
- **Stakeholders:** end_user, agent, ops_analyst, risk_team, compliance_officer
- **Jurisdictions:** GB
- **System refs:** [link](https://example.org/system-card/payments-agent.pdf)
- **Model/Data refs:** [link](https://example.org/model-card/risk-scoring-model.pdf)

## 2) Applicable Policies
- **Firm KYC/AML Policy** (GB) — POL-AML-12 [link](https://example.org/policies/kyc-aml)
- **Faster Payments Scheme Rules (internal interpretation)** (GB) — FPS-RULES-INTERP-2025 [link](https://example.org/policies/fps)

## 3) Controls (Action Rules)
> ABAC tuple ⟨subject, action, resource, condition, effect⟩; effect ∈ {allow, deny, require_escalation}

- **AR-PAY-ALLOW-LOWRISK** — *allow*  
  - Subject: `agent`  
  - Action: `initiate_payment`, Resource: `payment`  
  - Condition: `kyc_status == 'PASS' && risk_score < 0.70 && device_trust_level >= 0.5 && sanctions_hit == false && amount <= 2000 && first_time_payee == false`  
  - Evidence required: `kyc_status`, `risk_score`, `device_trust_level`, `sanctions_hit`, `amount`, `currency`, `first_time_payee`  
  - Exceptions: None
- **AR-PAY-ESCALATE-HIGHRISK** — *require_escalation*  
  - Subject: `agent`  
  - Action: `initiate_payment`, Resource: `payment`  
  - Condition: `risk_score >= 0.70 || (first_time_payee == true && amount >= 1000) || device_trust_level < 0.5 || geo_mismatch == true || (beneficiary_screening_score >= 0.6 && beneficiary_screening_score < 0.8)`  
  - Evidence required: `risk_score`, `first_time_payee`, `amount`, `device_trust_level`, `geo_mismatch`, `beneficiary_screening_score`, `escalation_id`  
  - Exceptions: `EX-PAY-PAYROLL-EMERGENCY` (24h) by Head of Operations
- **AR-PAY-DENY-REDLINES** — *deny*  
  - Subject: `agent`  
  - Action: `initiate_payment`, Resource: `payment`  
  - Condition: `kyc_status != 'PASS' || sanctions_hit == true || mule_account_flag == true || tamper_check_failed == true`  
  - Evidence required: `kyc_status`, `sanctions_hit`, `mule_account_flag`, `tamper_check_failed`  
  - Exceptions: None

## 4) Obligations
- **OB-USER-NOTICE-FEES-LIMITS** — Display fees, transfer limits, and risk notice prior to confirmation.  
  - When: Declare • Responsible: frontend_owner  
  - Evidence: `ui_notice_version`, `notice_displayed_timestamp`
- **OB-RECORD-CONSENT** — Record explicit user confirmation of payee details and amount.  
  - When: Do • Responsible: frontend_owner  
  - Evidence: `consent_version`, `consent_timestamp`
- **OB-ESCALATION-PROTOCOL** — Route escalations to the risk queue; perform call-back verification for amounts ≥ £1,000 to first-time payees.  
  - When: Do • Responsible: risk_team  
  - Evidence: `escalation_id`, `manual_callback_reference`, `two_person_approval_id` • Legal basis: Fraud/AML prevention
- **OB-AUDIT-TRAIL** — Maintain audit trail for all allow/deny/escalate decisions with rule IDs and detector outputs.  
  - When: Audit • Responsible: ops_analyst  
  - Evidence: `action_rule_id`, `detector_snapshots_uri`

## 5) Monitoring
- **Logging**
  - Events: `payment_initiated`, `payment_denied`, `escalation_requested`, `escalation_resolved`
  - Fields: `action_rule_id`, `amount`, `currency`, `beneficiary_iban`, `beneficiary_screening_score`, `consent_timestamp`, `consent_version`, `device_id`, `device_trust_level`, `detector_snapshots_uri`, `escalation_id`, `first_time_payee`, `geo_mismatch`, `ip_geo_country`, `kyc_status`, `manual_callback_reference`, `mule_account_flag`, `notice_displayed_timestamp`, `registered_country`, `risk_score`, `sanctions_hit`, `tamper_check_failed`, `two_person_approval_id`, `ui_notice_version`, `velocity_1h`
  - Retention (days): 90
- **Detectors**
  - HighRiskScore: Flags attempts where overall risk score is high. (&gt;&#x3D; 0.7) — [spec](https://example.org/detectors/high-risk)
  - VelocitySpike: Flags unusual transfer frequency within one hour. (&gt; 3) — [spec](https://example.org/detectors/velocity-1h)
  - GeoMismatch: Flags mismatch between IP geolocation and registered country. (&#x3D;&#x3D; 1) — [spec](https://example.org/detectors/geo-mismatch)
  - SanctionsSoftMatchLowerBound: Lower bound for soft sanctions fuzzy match. (&gt;&#x3D; 0.6) — [spec](https://example.org/detectors/sanctions-softmatch)
  - SanctionsSoftMatchUpperBound: Upper bound for soft sanctions fuzzy match. (&lt; 0.8) — [spec](https://example.org/detectors/sanctions-softmatch)
- **Review**
  - Owner: controls_review_board • Cadence (days): 14 • Method: Bi-weekly committee review of detector performance, false positives, and escalations.

## 6) KPIs & Thresholds
- **KPIs**
  - KPI-VIOL-RATE — violation_rate target 0.01 over 30d
  - KPI-ESC-SLA — escalation_sla_pct target 95 over 30d
- **Critical auto-fail:** `transfer_without_KYC`, `transfer_to_sanctioned_party`, `override_without_two_person_approval`

## 7) Change Management
- **Approvals:** Head of Risk, CISO, Compliance Officer
- **Diff notes:** Initial retail banking policy card.
- **Rollback conditions:** KPI-VIOL-RATE &gt; 3x target or detector precision &lt; 70% for 7d
- **Backout plan:** Immediately disable AR-PAY-ALLOW-LOWRISK; set default deny and require manual approvals for all first-time payees ≥ £1,000.

## 8) Assurance Mapping
- **NIST AI RMF:** `GOVERN-1`, `MAP-1`, `MEASURE-1`, `MANAGE-1`, `MANAGE-3`
- **ISO/IEC 42001:** `ISO42001-4`, `ISO42001-8`, `ISO42001-9`, `ISO42001-10`
- **EU AI Act:** `EUAA-AnnexIV-3`, `EUAA-AnnexIV-4`, `EUAA-AnnexIV-6`, `EUAA-AnnexIV-9`, `EUAA-Art72`

## 9) References
- Docs: [link](https://example.org/runbooks/payments-agent), [link](https://example.org/audit/guide), [link](https://example.org/playbooks/escalation)
- Notes: Retail banking example: First-time high-value transfer on a new device.
