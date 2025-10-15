# Policy Card Specification Notes (v0)

- **Action rules** use a tuple: *(subject, action, resource, condition, effect)*,
  where `effect ∈ {allow, deny, require_escalation}`.
- **Exceptions** are named, approver-listed, and **time-bound**.
- **Evidence** fields in rules must appear in `monitoring.logging.fields`.
- **Critical auto-fail** conditions must be explicit and testable.
- **Assurance mapping** uses string tokens to reference NIST/ISO/EU elements.
