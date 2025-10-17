# Examples

This folder contains validated example Policy Cards for multiple domains.
Each example passes the repository’s validator and follows the
authoring template in `docs/templates/policy-card.md.hbs`.

> Additional Disclaimer: See DISCLAIMER.md — the Materials are not intended or certified for safety-critical or regulatory use. No affiliation, approval, or endorsement by NIST, ISO/IEC, the European Union, NHS, MHRA, or any regulator or institution is implied by references to their frameworks or tokens. These are just ficticious examples.


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


## Example 2 — Clinical Triage Agent (Healthcare Sandbox)

> *An autonomous clinical triage system constrained by explicit policy logic and medical-safety governance.*

This example demonstrates how a **Policy Card** governs an agent operating in a controlled healthcare sandbox, ensuring that every automated action remains traceable, auditable, and ethically compliant with clinical-safety standards.

### Scenario

An NHS A&E triage pilot runs inside a regulatory sandbox jointly supervised by the MHRA and NHS AI Lab. A patient arrives reporting chest pain and shortness of breath.  
The **AI Triage Agent** conducts the intake interview, captures vitals from connected sensors, and estimates urgency.

Its Policy Card defines strict decision boundaries:

* **ALLOW**: routine symptom capture and non-diagnostic triage recommendations.  
* **REQUIRE ESCALATION**: when any red-flag pattern appears: ST-elevation risk, severe pain, age > 65, or comorbidity.  
* **DENY**: any autonomous diagnostic statement, prescription, or clinical sign-off.

Each decision produces structured **evidence**, `vitals`, `risk_level`, `confidence_score`, and `triage_category`; logged under NHS Data Security and Protection Toolkit (DSPT) guidance.  
**Detectors** monitor missing vitals, low confidence, bias drift, and data-collection failures.  
**Obligations** require human-clinician review, call-back verification, and model-version logging.  
**KPIs** track average triage-to-clinician handover time and escalation accuracy, while assurance mappings reference **ISO 13485**, **ISO 14971**, **NHS DSPT**, and the **EU AI Act (Annex VIII)**.

Together, these mechanisms form a **live compliance boundary**; a safety layer that tells the triage agent exactly **what it must not break**, ensuring that clinical autonomy never exceeds certified human oversight.

[View the full Policy Card Markdown →](clinical_triage.md)  
[View the full Policy Card JSON →](clinical_triage.json)


## Example 3 — Autonomous Diagnostic Co-Pilot (Radiology)

> *A diagnostic AI that sees, but never speaks without a clinician’s oversight.*

This example illustrates how a **Policy Card** governs an autonomous radiology agent that assists clinicians while operating inside explicit, machine-verifiable safety and compliance constraints.

### Scenario

A hospital radiology department deploys an **AI Co-Pilot** to assist with CT and MRI pre-reads.  
The agent automatically segments images, highlights suspected anomalies, and generates structured descriptors, but cannot sign off on reports or issue diagnostic statements.  

Its **Policy Card** defines the behavioural contract:

* **ALLOW**: automated image annotation, measurement, and preliminary descriptors.  
* **REQUIRE ESCALATION**: when uncertainty > 20 %, lesion size > 10 mm, or clinician feedback conflicts with model predictions.  
* **DENY**: any autonomous report finalisation, diagnostic claim, or treatment recommendation.

Each inference logs **evidence**, `model_version`, `confidence_interval`, `lesion_size`, `image_series_uid`, and `reviewer_id`, to a secure audit trail compliant with **ISO 13485**, **IEC 62304**, and **EU MDR**.  
**Detectors** monitor false-positive drift, uncertainty spikes, and dataset lineage; **obligations** require clinician review and dual sign-off; and **KPIs** track escalation precision and turnaround time.

The result is an explainable and auditable partnership: an agent that performs high-speed perception and reasoning, while its Policy Card guarantees that human oversight and regulatory accountability remain in the loop.  
It exemplifies how future diagnostic systems can achieve autonomy *without overstepping the ethical perimeter defined by their policy logic.*

[View the full Policy Card Markdown →](diagnostic_copilot.md)  
[View the full Policy Card JSON →](diagnostic_copilot.json)


## Example 4 — Multi-Agent Clinical Trial Coordinator

> *Distributed intelligence under shared regulatory control.*

This example demonstrates how **multiple Policy-governed agents** coordinate a federated clinical trial, sharing data and decisions across jurisdictions while maintaining traceability, patient privacy, and regulatory compliance.

### Scenario

A global Phase III oncology trial runs across hospitals in the UK, Germany, and Canada.  
Each site operates its own **Clinical Data Agent** responsible for ingesting patient observations, de-identifying records, and synchronising endpoints with a central **Trial Orchestration Agent**.  
Additional agents represent the Ethics Board, Data Safety Monitoring Board (DSMB), and Sponsor Quality Office, each enforcing their own Policy Cards and assurance mappings.

The network’s governance logic is explicit:

* **ALLOW**: exchange of anonymised efficacy metrics and protocol-approved parameters within designated jurisdictional nodes.  
* **REQUIRE ESCALATION**: when cross-border data transfer lacks a recorded consent token, when schema drift or endpoint anomalies occur, or when an adverse-event severity score ≥ 3 (CTCAE) is reported.  
* **DENY**: any agent-initiated access to identifiable patient data or analysis of subjects outside its legal jurisdiction.

Each agent logs structured **evidence**, `consent_token_id`, `jurisdiction_code`, `dataset_lineage_uri`, `adverse_event_grade`, `transfer_request_id`, and `review_timestamp`, into a shared, append-only audit ledger.  
**Detectors** monitor consent revocations, cross-border data flow anomalies, and protocol-deviation spikes.  
**Obligations** enforce DSMB review within 24 hours of serious adverse events, cryptographic signing of dataset exports, and version-locked protocol adherence.  
**KPIs** track data-sharing latency and review compliance across all agents.

This vignette showcases the **multi-agent extension of the Policy Card methodology**: individual autonomy bounded by local law, and collective assurance achieved through linked evidence and cross-referenced obligations.  
The result is a system where every agent knows not only *what it may do*, but *what its peers are entitled to expect*. The result is a distributed governance fabric for trustworthy collaborative AI in clinical research.

[View the full Policy Card Markdown →](clinical_trial.md)  
[View the full Policy Card JSON →](clinical_trial.json)


## Example 5 — UAV ISR Mission Planner (Human-in-the-Loop Target Designation)

> *Autonomy for sensing and recommendation; human control for lethal effect and target designation.*

This example demonstrates how a **Policy Card** constrains an Unmanned Aerial Vehicle (UAV) mission-planning assistant so it can provide high-value intelligence, surveillance, and reconnaissance (ISR) support while preserving human authority, auditable decisioning, and robust safety guardrails.

### Scenario

A tactical ISR flight supports a joint task force in a dynamic operational area.  
An onboard Mission-Planning Agent fuses EO/IR imagery, signal intelligence, and track data to propose target candidates for human review. The agent can recommend observation tasks, suggest sensor cueing, and surface potential targets, but it must never initiate kinetic or lethal actions autonomously.

The Policy Card enforces this governance contract:

* **DENY** any autonomous lethal or kinetic action (no autonomous engagement).  
* **REQUIRE ESCALATION** for target designation or any action that would change a contact’s status from “observe” → “designate” → “engage”; these require explicit human authorization and signed operator approval.  
* **ALLOW** non-kinetic ISR planning actions (route planning, sensor tasking, target prioritisation recommendations) when deconfliction and integrity checks pass.

Additional guardrails and monitoring include:

* **Blue-force deconfliction:** geo-fenced friendly zones and live friendly-force overlays block any escalation that would violate deconfliction constraints.  
* **GPS/Navigation integrity:** spoofing and jamming detectors force the agent into resilient navigation or hold patterns and block escalation while integrity is unverified.  
* **Communications loss behavior:** predefined safe behaviours (loiter, return-to-base, or hold) prevent unintended mission escalation during comms outages.  
* **Immutable audit:** every recommendation, operator override, and approval is logged with cryptographic provenance (signed approval IDs, timestamps, sensor provenance URIs).  
* **Detectors & KPIs:** GPS-spoof alerts, deconfliction breach attempts, operator override frequency, and time-to-approval SLA are continuously measured.

This vignette highlights how Policy Cards make the human-in-the-loop constraint **auditable and enforceable**: they convert legal and rules-of-engagement obligations into executable, checkable rules that produce verifiable evidence for post-mission review and compliance.  

[View the full Policy Card Markdown →](defence_uav_mission_planner.md)  
[View the full Policy Card JSON →](defence_uav_mission_planner.json)




