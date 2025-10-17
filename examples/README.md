# Examples

This folder contains validated example Policy Cards for multiple domains.
Each example passes the repository’s validator and follows the
authoring template in `docs/templates/policy-card.md.hbs`.

> Additional Disclaimer: See DISCLAIMER.md — the Materials are not intended or certified for safety-critical or regulatory use.


## Example 1 — Retail Banking: Payments Agent

> *A realistic Friday-night payment scenario where governance, risk, and ethics become executable code.*

This example demonstrates how a **Policy Card** acts as the governing contract between a deployed AI agent and its regulatory environment. Thus, fusing technical control, auditability, and legal accountability.

### Scenario

A UK retail-bank customer opens the mobile app at 22:43 on a Friday night to send £4,750 through the Faster Payments Service. The amount is just below the £5 k threshold, the payee is new, and the device has never been seen before. KYC checks are technically valid, yet the real-time risk model raises an eyebrow:

* the new device is untrusted,  
* the IP geo doesn’t match the registered country,  
* velocity of login attempts is unusually high, and  
* the beneficiary name fuzzily matches a sanctions alias.

At that moment, the **Payments Agent**, an intelligent component governed by its **Policy Card**, executes a declared decision graph:  

* **ALLOW** only if KYC passes and overall risk is low,  
* **REQUIRE ESCALATION** for medium-risk or first-time payees, and  
* **DENY** immediately when any red-line (e.g., sanctions hit, failed KYC) is met.  

Each outcome is accompanied by structured evidence, fields such as `kyc_status`, `risk_score`, `device_trust_level`, and `beneficiary_screening_score`, all automatically logged for post-market audit.  
Linked **detectors** monitor high-risk scores, velocity anomalies, and geo mismatches; **obligations** ensure user notices, call-backs, and dual approvals; **KPIs** track violation and escalation rates; and the entire configuration is cross-referenced to the NIST AI RMF, ISO/IEC 42001, and EU AI Act (Annex IV & Art 72) tokens defined in the crosswalk.

Together, these layers form a live compliance boundary: a digital object that tells the agent **what it must not break**, and that provides regulators, auditors, and engineers a transparent, machine-verifiable trace from decision logic to legal obligation.

[View the full Policy Card Markdown →](retail_banking.md)  
[View the full Policy Card JSON →](retail_banking.json)



