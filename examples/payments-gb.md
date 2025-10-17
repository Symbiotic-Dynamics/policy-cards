# Payments Agent — GB Retail — Policy Card (v0.1.0)

**Owner:** Payments Risk &amp; Controls  
**Created:** 2025-10-17T10:00:00Z  
**Valid:** 2025-10-17 — open-ended

## 1) Scope
- **Application:** Initiate/check/cancel payments via FPS
- **Stakeholders:** end_user, ops_analyst
- **Jurisdictions:** GB
- **System refs:** [link](https://example.org/system-card.pdf)
- **Model/Data refs:** [link](https://example.org/model-card.pdf)

## 2) Applicable Policies
- **KYC/AML Policy** (GB) — Firm POL-AML-12 [link](https://example.org/policies/aml)

## 3) Controls (Action Rules)
> ABAC tuple ⟨subject, action, resource, condition, effect⟩; effect ∈ {allow, deny, require_escalation}

- **AR-PAY-ALLOW-KYC** — *allow*  
  - Subject: `agent`  
  - Action: `initiate_payment`, Resource: `payment`  
  - Condition: `subject.kyc_status == 'PASS' && subject.risk_score < 0.7`  
  - Evidence required: `kyc_status`, `risk_score`  
  - Exceptions: None

## 4) Obligations
- **OB-USER-NOTICE** — Display fees and transfer limits prior to confirmation.  
  - When: Declare • Responsible: frontend_owner  
  - Evidence: `ui_notice_version`

## 5) Monitoring
- **Logging**
  - Events: `payment_initiated`, `payment_denied`, `escalation_requested`
  - Fields: `kyc_status`, `risk_score`, `ui_notice_version`
  - Retention (days): 7
- **Detectors**
  - HighRiskScore: Flag high risk score attempts (&gt;&#x3D; 0.7) — [spec](https://example.org/detectors/high-risk)
- **Review**
  - Owner: controls_review_board • Cadence (days): 14 • Method: bi-weekly committee review

## 6) KPIs & Thresholds
- **KPIs**
  - KPI-VIOL-RATE — violation_rate target 0.01 over 30d
- **Critical auto-fail:** `transfer_without_KYC`

## 7) Change Management
- **Approvals:** Head of Risk, CISO
- **Diff notes:** Initial skeleton.
- **Rollback conditions:** Any KPI breach &gt; 3x target
- **Backout plan:** Revert to v0.0.0 default-deny rules

## 8) Assurance Mapping
- **NIST AI RMF:** `GOVERN-2`, `MANAGE-3`
- **ISO/IEC 42001:** `ISO42001-8`, `ISO42001-9`
- **EU AI Act:** `EUAA-Art72`

## 9) References
- Docs: [link](https://example.org/runbook), [link](https://example.org/audit-guide)
- Notes: Day-2 trivial example
