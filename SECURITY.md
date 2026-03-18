# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| Latest  | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email us at **moclaw@proton.me** with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge receipt within 48 hours and aim to provide a fix within 7 days for critical issues.

## Security Measures

- All releases are built via GitHub Actions CI/CD with transparent build logs
- macOS builds are signed and notarized by Apple
- Windows code signing is in progress
- Source code is fully open for inspection
- Dependencies are regularly updated

## Verification

You can verify our releases:

- [VirusTotal scan results](https://www.virustotal.com/gui/url/800de679ba1d63c29023776989a531d27c4510666a320ae3b440c7785b2ab149) — 0 detections across 94 antivirus engines
- Build artifacts are produced by GitHub Actions from the public source code
