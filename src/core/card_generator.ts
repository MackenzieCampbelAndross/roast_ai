/**
 * Shareable comedy image card generator for Roast.ai.
 * Generates stylized SVG/HTML image cards ready for social export.
 */

import { RoastResult } from '../types';

export class CardGenerator {
  /**
   * Generates a self-contained SVG social card markup with dark aesthetic and comedy branding.
   */
  static generateSVGCard(roast: RoastResult): string {
    const title = roast.inputType === 'IMAGE' ? (roast.imageFileName || 'Image Roast') : (roast.inputText?.slice(0, 45) || 'Text Roast');
    const content = roast.roastContent;
    const personality = roast.personality.name;
    const intensity = roast.intensity;

    // Wrap content into lines
    const maxCharsPerLine = 48;
    const words = content.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const w of words) {
      if ((currentLine + ' ' + w).length > maxCharsPerLine) {
        lines.push(currentLine.trim());
        currentLine = w;
      } else {
        currentLine += ' ' + w;
      }
    }
    if (currentLine.trim()) lines.push(currentLine.trim());

    const textSvgElements = lines.slice(0, 6).map((line, idx) => {
      return `<text x="50" y="${170 + idx * 30}" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="500" fill="#f8fafc">${this.escapeXml(line)}</text>`;
    }).join('\n    ');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#030712" />
    </linearGradient>
    <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#f43f5e" />
    </linearGradient>
  </defs>

  <!-- Background Canvas -->
  <rect width="800" height="450" rx="20" fill="url(#cardBg)" />
  <rect x="2" y="2" width="796" height="446" rx="18" fill="none" stroke="#1e293b" stroke-width="2" />

  <!-- Top Header Badge -->
  <rect x="50" y="45" width="110" height="32" rx="16" fill="url(#accentGlow)" />
  <text x="105" y="66" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#ffffff">ROAST.AI</text>

  <!-- Personality Badge -->
  <text x="180" y="66" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#94a3b8">${this.escapeXml(personality)} • [${intensity}]</text>

  <!-- Target Prompt Quote -->
  <text x="50" y="125" font-family="system-ui, sans-serif" font-size="16" font-style="italic" fill="#64748b">Regarding: "${this.escapeXml(title)}"</text>

  <!-- Main Roast Content -->
  ${textSvgElements}

  <!-- Footer Branding -->
  <line x1="50" y1="380" x2="750" y2="380" stroke="#1e293b" stroke-width="1" />
  <text x="50" y="412" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="#64748b">Verified Burn • Zero Feelings Spared</text>
  <text x="750" y="412" text-anchor="end" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#ec4899">roast.ai</text>
</svg>`;
  }

  private static escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }
}
