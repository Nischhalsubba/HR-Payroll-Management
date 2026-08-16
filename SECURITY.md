# Security Policy

## Supported version

Security fixes are applied to the current `main` branch and to validated releases built from it.

## Reporting a vulnerability

Do not open a public issue for suspected vulnerabilities, exposed credentials, authorization flaws, payroll-data issues, or privacy-sensitive findings.

Use GitHub's private vulnerability reporting feature when available. If private reporting is unavailable, contact the repository owner privately through the contact information on the GitHub profile.

Do not include real credentials, personal data, payroll records, or destructive proof-of-concept material in reports.

## Repository security baseline

Maintained releases are expected to pass lockfile-backed dependency installation, an npm audit with no accepted known vulnerabilities, CodeQL analysis, linting, type checks, unit tests, production builds, and browser end-to-end flows. GitHub Actions use least-privilege permissions and immutable third-party Action pins. Credentials and environment-specific secrets must remain outside source control.

This repository is a frontend prototype and must not be treated as a production payroll authority without an appropriately secured backend, server-side authorization, audit logging, data protection, and operational controls. A passing automated scan reduces known risk but cannot prove that software is risk-free.
