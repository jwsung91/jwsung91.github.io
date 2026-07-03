import sharp from 'sharp';

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0c0a09"/>
  <rect x="60" y="60" width="1080" height="510" fill="none" stroke="#292524" stroke-width="2"/>
  <text x="100" y="300" font-family="monospace" font-size="64" font-weight="bold" fill="#fafaf9">jwsung91.github.io</text>
  <text x="100" y="380" font-family="monospace" font-size="32" fill="#a8a29e">Robotics Software Architect</text>
  <text x="100" y="430" font-family="monospace" font-size="32" fill="#a8a29e">platform architecture, middleware</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og-default.png');
console.log('✓ public/og-default.png generated');
