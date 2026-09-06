#!/usr/bin/env node
/**
 * Pre-commit secret scanner
 * 
 * Scans staged files for known secret patterns. Blocks the commit if any
 * match is found. Run manually with `npm run secrets:scan`.
 * 
 * Patterns checked:
 *  - Private keys (-----BEGIN.*PRIVATE KEY-----)
 *  - API keys (re_..., sk_..., AKIA...)
 *  - Generic high-entropy base64 strings in likely secret contexts
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const patterns = [
  {
    name: 'RSA/EC Private Key',
    regex: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/,
    severity: 'critical',
  },
  {
    name: 'Resend API Key',
    regex: /\bre_[A-Za-z0-9]{20,}\b/,
    severity: 'critical',
  },
  {
    name: 'Stripe Secret Key',
    regex: /\bsk_(?:live|test)_[A-Za-z0-9]{20,}\b/,
    severity: 'critical',
  },
  {
    name: 'AWS Access Key',
    regex: /\bAKIA[A-Z0-9]{16}\b/,
    severity: 'critical',
  },
  {
    name: 'Generic API Key',
    regex: /(?:api[_-]?key|apikey|access[_-]?token)\s*[:=]\s*['"]?[A-Za-z0-9_\-]{32,}['"]?/i,
    severity: 'warning',
  },
];

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
    });
    return output.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

function scanFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const findings = [];

    for (const pattern of patterns) {
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (pattern.regex.test(line)) {
          findings.push({
            file: filePath,
            line: idx + 1,
            pattern: pattern.name,
            severity: pattern.severity,
            snippet: line.trim().substring(0, 80),
          });
        }
      });
    }

    return findings;
  } catch {
    // File might be binary or deleted
    return [];
  }
}

function main() {
  const stagedFiles = getStagedFiles();
  
  if (stagedFiles.length === 0) {
    console.log('No staged files to scan.');
    process.exit(0);
  }

  const allFindings = [];
  
  for (const file of stagedFiles) {
    // Skip node_modules and other build artifacts
    if (file.includes('node_modules/') || 
        file.includes('.next/') || 
        file.includes('dist/') ||
        file.includes('.open-next/')) {
      continue;
    }
    
    const findings = scanFile(file);
    allFindings.push(...findings);
  }

  if (allFindings.length === 0) {
    console.log('✓ No secrets detected in staged files.');
    process.exit(0);
  }

  console.error('\n🚨 SECRET DETECTED — commit blocked\n');
  
  for (const finding of allFindings) {
    console.error(`  ${finding.file}:${finding.line}`);
    console.error(`  Pattern: ${finding.pattern} (${finding.severity})`);
    console.error(`  Snippet: ${finding.snippet}`);
    console.error('');
  }

  console.error('Secrets must never be committed to git.');
  console.error('See docs/SECRETS.md for the policy.\n');
  process.exit(1);
}

main();
