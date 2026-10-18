/* Illustrations: mountains scene, avatars, crops, mode thumbnails, icons. */
const I = {
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  flame:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c.6 3.6 5.5 5.6 5.5 11.3A5.5 5.5 0 0 1 6.5 13.6c0-2.6 1.4-4.2 2.6-5.6.3 1.7 1.1 2.8 2.2 3.1C11.5 8 10.8 5.2 12 2z"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.2 6.8.8-5 4.6 1.4 6.7L12 17.4l-6.1 3.4 1.4-6.7-5-4.6 6.8-.8z"/></svg>',
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z"/></svg>',
  trophy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>',
  skip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  drop:'<svg viewBox="0 0 18 22" fill="currentColor" aria-hidden="true"><path d="M9 1C6 6 2 10 2 14a7 7 0 0 0 14 0c0-4-4-8-7-13z"/></svg>',
  undo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  speaker:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>'
};

const ART = {};

ART.band = () => {
  let dots = '';
  for (let x = 12; x < 400; x += 25) dots += `<circle cx="${x}" cy="7" r="2.6"/>`;
  return `<div class="band" aria-hidden="true"><svg viewBox="0 0 400 22" preserveAspectRatio="none"><path d="M0 0H400V12Q387.5 22 375 12T350 12T325 12T300 12T275 12T250 12T225 12T200 12T175 12T150 12T125 12T100 12T75 12T50 12T25 12T0 12Z" fill="#C2362B"/><g fill="#F2C230">${dots}</g></svg></div>`;
};

ART.mountains = (thumb) => `<svg viewBox="${thumb ? '110 20 180 130' : '0 0 360 150'}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Mlima Kilimanjaro na vilima">
<rect x="0" y="0" width="360" height="150" fill="#D7EDF2"/>
<circle class="sun-glow" cx="292" cy="38" r="18" fill="#F2C230"/>
<g class="cloud"><ellipse cx="60" cy="34" rx="26" ry="8" fill="#FFFFFF"/><ellipse cx="76" cy="28" rx="15" ry="8" fill="#FFFFFF"/></g>
<g class="cloud c2"><ellipse cx="200" cy="20" rx="22" ry="6" fill="#FFFFFF"/><ellipse cx="213" cy="16" rx="12" ry="6" fill="#FFFFFF"/></g>
<path d="M0 116L44 86L82 104L122 74L160 100L196 94L238 110L290 92L360 104V150H0Z" fill="#A9CBD3"/>
<path d="M84 132L170 60Q186 48 202 51L216 57L306 132Z" fill="#5E7F8B"/>
<path d="M156 72L170 60Q186 48 202 51L216 57L232 70L222 68L212 74L202 66L192 73L182 66L172 73Z" fill="#FFFFFF"/>
<path d="M0 150V126Q60 110 120 124T240 122T360 118V150Z" fill="#7FB069"/>
<path d="M0 150V138Q80 128 170 138T360 134V150Z" fill="#5E9650"/>
<g fill="#3E6B3A"><rect x="58" y="108" width="3" height="22"/><ellipse cx="60" cy="106" rx="22" ry="6"/><rect x="300" y="112" width="2.5" height="16"/><ellipse cx="301" cy="110" rx="15" ry="4.5"/></g>
</svg>`;

ART.avatars = {
  simba: { name: 'Simba', svg: `<svg viewBox="0 0 80 80" aria-hidden="true"><rect width="80" height="80" fill="#FDF1C8"/><circle cx="40" cy="43" r="31" fill="#C9772A"/><circle cx="22" cy="24" r="8" fill="#F2C230"/><circle cx="58" cy="24" r="8" fill="#F2C230"/><circle cx="40" cy="45" r="22" fill="#F2C230"/><circle cx="32" cy="41" r="3" fill="#24211C"/><circle cx="48" cy="41" r="3" fill="#24211C"/><path d="M35 50h10l-5 6z" fill="#7A3E16"/><path d="M34 59q6 5 12 0" stroke="#7A3E16" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>` },
  twiga: { name: 'Twiga', svg: `<svg viewBox="0 0 80 80" aria-hidden="true"><rect width="80" height="80" fill="#D7EDF2"/><path d="M32 22L30 9M48 22L50 9" stroke="#8A5A2B" stroke-width="4" stroke-linecap="round"/><circle cx="30" cy="8" r="4" fill="#8A5A2B"/><circle cx="50" cy="8" r="4" fill="#8A5A2B"/><ellipse cx="20" cy="30" rx="9" ry="4" transform="rotate(-25 20 30)" fill="#E8B04A"/><ellipse cx="60" cy="30" rx="9" ry="4" transform="rotate(25 60 30)" fill="#E8B04A"/><ellipse cx="40" cy="44" rx="19" ry="25" fill="#F2C230"/><ellipse cx="31" cy="30" rx="5" ry="4" fill="#C77A2E"/><ellipse cx="50" cy="34" rx="4" ry="5" fill="#C77A2E"/><ellipse cx="40" cy="24" rx="4" ry="3" fill="#C77A2E"/><ellipse cx="40" cy="61" rx="14" ry="10" fill="#E8B04A"/><circle cx="33" cy="42" r="3" fill="#24211C"/><circle cx="47" cy="42" r="3" fill="#24211C"/><circle cx="35" cy="62" r="1.8" fill="#7A3E16"/><circle cx="45" cy="62" r="1.8" fill="#7A3E16"/></svg>` },
  tembo: { name: 'Tembo', svg: `<svg viewBox="0 0 80 80" aria-hidden="true"><rect width="80" height="80" fill="#E3F1E6"/><ellipse cx="17" cy="38" rx="15" ry="19" fill="#9C968C"/><ellipse cx="63" cy="38" rx="15" ry="19" fill="#9C968C"/><circle cx="40" cy="36" r="21" fill="#BDB7AE"/><path d="M40 46Q38 66 52 70" stroke="#BDB7AE" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M31 50q-2 8 3 11" stroke="#FFFFFF" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M49 50q2 8-3 11" stroke="#FFFFFF" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="32" cy="34" r="3" fill="#24211C"/><circle cx="48" cy="34" r="3" fill="#24211C"/></svg>` },
  pundamilia: { name: 'Pundamilia', svg: `<svg viewBox="0 0 80 80" aria-hidden="true"><rect width="80" height="80" fill="#FBE4DE"/><path d="M30 14q10-8 20 0" stroke="#24211C" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="26" cy="20" rx="5" ry="9" transform="rotate(-20 26 20)" fill="#FFFFFF" stroke="#24211C" stroke-width="2"/><ellipse cx="54" cy="20" rx="5" ry="9" transform="rotate(20 54 20)" fill="#FFFFFF" stroke="#24211C" stroke-width="2"/><ellipse cx="40" cy="42" rx="18" ry="27" fill="#FFFFFF" stroke="#24211C" stroke-width="2"/><path d="M24 30h9M47 30h9M23 38h8M49 38h8M26 46h6M48 46h6M36 22l4 8 4-8" stroke="#24211C" stroke-width="3.5" stroke-linecap="round" fill="none"/><ellipse cx="40" cy="61" rx="12" ry="9" fill="#3A3633"/><circle cx="33" cy="40" r="3" fill="#24211C"/><circle cx="47" cy="40" r="3" fill="#24211C"/><circle cx="36" cy="62" r="1.8" fill="#FFFFFF"/><circle cx="44" cy="62" r="1.8" fill="#FFFFFF"/></svg>` }
};

function kernels() {
  let s = '';
  for (let y = 42; y <= 158; y += 11) {
    const half = 28 * Math.sqrt(Math.max(0, 1 - Math.pow((y - 100) / 72, 2)));
    for (let x = 100 - half + 7; x <= 100 + half - 6; x += 10) s += `<circle cx="${x.toFixed(1)}" cy="${y}" r="4.3" fill="#E2A817"/>`;
  }
  return s;
}
function leaf(x, y, rot, len, fill) {
  len = len || 52; fill = fill || '#2E6B3F';
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0C${len * .3} -${len * .22} ${len * .72} -${len * .22} ${len} 0C${len * .72} ${len * .22} ${len * .3} ${len * .22} 0 0Z" fill="${fill}"/><path d="M2 0H${len - 4}" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="1.6"/></g>`;
}
function clove(x, y, r) {
  return `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-2.5 6L-1 62H1L2.5 6Z" fill="#6B3A1E"/><path d="M-11 6L0 -4L11 6L0 12Z" fill="#7A4424"/><circle cx="0" cy="-8" r="8" fill="#8B5130"/></g>`;
}
function boll(cx, cy, s) {
  const pts = [[-14, -6], [12, -9], [0, 11], [-12, 13], [14, 12]];
  let f = `<path d="M${cx} ${cy + 26 * s}l${-20 * s} ${8 * s} ${8 * s} ${-16 * s} ${-14 * s} ${-10 * s} ${18 * s} 2 ${8 * s} ${-14 * s} ${8 * s} ${14 * s} ${18 * s} -2 ${-14 * s} ${10 * s} ${8 * s} ${16 * s}Z" fill="#7A5230"/>`;
  pts.forEach(p => { f += `<circle cx="${cx + p[0] * s}" cy="${cy + p[1] * s}" r="${16 * s}" fill="#FFFFFF" stroke="#D9D2C3" stroke-width="2"/>`; });
  return f;
}

ART.crop = (id) => {
  const open = '<svg viewBox="0 0 200 200" role="img" aria-label="Picha ya zao">';
  let b = '';
  switch (id) {
    case 'mahindi':
      b = `<path d="M100 192C58 160 46 108 72 58C78 110 90 152 100 192Z" fill="#5E9E4A"/><path d="M100 192C142 160 156 108 128 58C122 110 110 152 100 192Z" fill="#4C8A3C"/><ellipse cx="100" cy="100" rx="28" ry="72" fill="#F2C230"/>${kernels()}<path d="M100 28C95 16 105 10 99 2M96 30C88 20 92 12 86 6M104 30C112 20 108 12 114 6" stroke="#B5813A" stroke-width="2.5" fill="none" stroke-linecap="round"/>`; break;
    case 'kahawa':
      b = `<path d="M18 172C70 142 112 108 182 38" stroke="#6B4423" stroke-width="7" fill="none" stroke-linecap="round"/>${leaf(56, 140, -150)}${leaf(60, 136, -20)}${leaf(102, 112, -140)}${leaf(106, 106, 10)}${leaf(146, 74, -150)}${leaf(150, 70, -10)}${leaf(176, 44, -60, 42)}` +
        [[80, 132], [90, 140], [84, 146], [122, 98], [132, 104], [126, 110], [116, 106]].map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="8.5" fill="${i === 2 ? '#7FA34A' : i === 5 ? '#D9572B' : '#B3261E'}"/><circle cx="${p[0] - 2.5}" cy="${p[1] - 3}" r="2" fill="#FFFFFF" opacity=".5"/>`).join(''); break;
    case 'korosho':
      b = `${leaf(100, 34, -30, 60, '#4C8A3C')}<path d="M100 34C100 22 108 14 118 12" stroke="#4C8A3C" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M68 44C58 92 70 132 100 136C130 132 142 92 132 44C116 32 84 32 68 44Z" fill="#E4572E"/><ellipse cx="86" cy="70" rx="7" ry="18" fill="#F08A56" opacity=".7"/><path d="M80 136C66 160 84 192 108 180C122 173 116 160 106 158C96 156 98 144 92 136Z" fill="#9A9A66"/><path d="M84 146C80 160 88 174 100 174" stroke="#7E7E52" stroke-width="2" fill="none"/>`; break;
    case 'karafuu':
      b = `<ellipse cx="100" cy="164" rx="82" ry="20" fill="#E9DFC8"/>${clove(62, 82, -24)}${clove(96, 66, 6)}${clove(132, 84, 28)}${clove(80, 104, -8)}${clove(118, 108, 14)}`; break;
    case 'chai':
      b = `<path d="M100 194C100 150 96 108 104 54" stroke="#4E7D3A" stroke-width="6" fill="none" stroke-linecap="round"/>${leaf(100, 160, -160, 58, '#3F8A4A')}${leaf(100, 150, -15, 58, '#2E6B3F')}${leaf(100, 118, -150, 52, '#3F8A4A')}${leaf(100, 110, -25, 52, '#2E6B3F')}${leaf(102, 80, -140, 44, '#4FA05A')}${leaf(103, 74, -40, 44, '#3F8A4A')}<path d="M104 56C98 44 102 34 106 26C110 36 110 46 104 56Z" fill="#7CC36E"/>`; break;
    case 'pamba':
      b = `<path d="M100 196C100 160 90 130 84 104M100 160C112 150 124 142 134 132" stroke="#6B4423" stroke-width="5" fill="none" stroke-linecap="round"/>${leaf(96, 170, -170, 46, '#4C8A3C')}${boll(84, 86, 1)}${boll(138, 124, .7)}`; break;
    case 'mkonge': {
      let l = '';
      for (let a = -78, k = 0; a <= 78; a += 13, k++) {
        const L = 118 + (k % 2 ? 26 : 0) - Math.abs(a) * .3, r = a * Math.PI / 180;
        const tx = 100 + L * Math.sin(r), ty = 186 - L * Math.cos(r);
        const nx = Math.cos(r) * 7, ny = Math.sin(r) * 7;
        l += `<path d="M${(100 - nx).toFixed(1)} ${(186 - ny).toFixed(1)}L${tx.toFixed(1)} ${ty.toFixed(1)}L${(100 + nx).toFixed(1)} ${(186 + ny).toFixed(1)}Z" fill="${k % 2 ? '#5F8F7A' : '#4E7D69'}"/>`;
      }
      b = `<ellipse cx="100" cy="188" rx="46" ry="8" fill="#C9B48A"/>${l}`; break;
    }
    case 'mpunga': {
      let s = '<rect x="0" y="168" width="200" height="32" rx="6" fill="#BFDDE6"/>';
      for (let k = 0; k < 5; k++) {
        const x = 46 + k * 26;
        s += `<path d="M${x} 186Q${x + 4} 120 ${x + 18} 66" stroke="#6E9E46" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M${x} 186Q${x - 14} 150 ${x - 22} 120" stroke="#86B85A" stroke-width="3" fill="none" stroke-linecap="round"/>`;
        for (let t = 0; t < 7; t++) {
          const gx = x + 18 + t * 3.6, gy = 66 + t * 6.5;
          s += `<ellipse cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" rx="3.2" ry="5.5" transform="rotate(-30 ${gx.toFixed(1)} ${gy.toFixed(1)})" fill="#D9B95A"/>`;
        }
      }
      b = s; break;
    }
    case 'ndizi': {
      let s = '<path d="M100 8C96 30 98 46 94 62" stroke="#6B4423" stroke-width="8" fill="none" stroke-linecap="round"/>';
      for (let k = 0; k < 5; k++) {
        s += `<g transform="translate(${92 - k * 2} ${60 + k * 4}) rotate(${-8 + k * 24})"><path d="M0 0C6 44 38 80 84 86C92 87 94 80 88 78C50 68 24 38 14 -2Z" fill="#F2C230" stroke="#C9971A" stroke-width="2"/><circle cx="88" cy="82" r="3" fill="#5A3A1E"/></g>`;
      }
      b = s; break;
    }
    case 'muhogo':
      b = `<path d="M100 82V24" stroke="#5E9E4A" stroke-width="5" stroke-linecap="round"/>` +
        [-60, -30, 0, 30, 60].map(a => `<ellipse cx="100" cy="2" rx="6" ry="20" transform="rotate(${a} 100 22)" fill="#4C8A3C"/>`).join('') +
        `<path d="M100 82C70 96 44 140 34 188C54 164 82 124 110 92Z" fill="#8B5A2B"/><path d="M100 84C104 120 98 160 96 194C110 162 118 122 112 86Z" fill="#9B6634"/><path d="M104 82C134 98 156 134 166 180C146 156 124 122 98 92Z" fill="#7E5026"/><path d="M58 140l12 6M74 112l10 7M100 130h12M101 160h10M132 118l-10 8M146 146l-10 6" stroke="#5E3A18" stroke-width="2.5" stroke-linecap="round"/>`; break;
    case 'alizeti': {
      let p = '';
      for (let k = 0; k < 16; k++) p += `<ellipse cx="100" cy="46" rx="9" ry="22" transform="rotate(${k * 22.5} 100 78)" fill="${k % 2 ? '#F2C230' : '#E8B321'}"/>`;
      let s = '';
      for (let k = 0; k < 22; k++) { const a = k * 2.4, r = 3.6 * Math.sqrt(k); s += `<circle cx="${(100 + r * Math.cos(a)).toFixed(1)}" cy="${(78 + r * Math.sin(a)).toFixed(1)}" r="2.2" fill="#3B2512"/>`; }
      b = `<path d="M100 196V104" stroke="#3E7A3A" stroke-width="8" stroke-linecap="round"/>${leaf(100, 160, -160, 54, '#4C8A3C')}${leaf(100, 140, -20, 54, '#3E7A3A')}${p}<circle cx="100" cy="78" r="24" fill="#5A3A1E"/>${s}`; break;
    }
    case 'nazi':
      b = `<path d="M60 44C80 20 120 14 150 24M60 44C46 30 28 28 14 34M60 44C70 30 64 14 52 6" stroke="#4C8A3C" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="78" cy="118" r="50" fill="#7A4E2D"/><path d="M42 96q36-14 72 0M36 120q42-12 84 0M42 144q36 12 72 0" stroke="#5E3A1E" stroke-width="2.5" fill="none"/><circle cx="66" cy="84" r="5" fill="#3B2512"/><circle cx="82" cy="80" r="5" fill="#3B2512"/><circle cx="76" cy="94" r="5" fill="#3B2512"/><path d="M106 160A40 40 0 0 1 186 160Z" fill="#7A4E2D"/><path d="M114 160A32 32 0 0 1 178 160Z" fill="#FFF8EC"/>`; break;
    default: b = '';
  }
  return open + b + '</svg>';
};

ART.thumbMethali = () => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#F2C230"/><path d="M14 22h72a8 8 0 0 1 8 8v30a8 8 0 0 1-8 8H44L28 82V68H14a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8z" fill="#C2362B"/><path d="M18 36h46M18 48h30" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/><path d="M54 48h22" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-dasharray="4 6"/></svg>`;
ART.thumbHeads = () => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#C2362B"/><g transform="rotate(-10 50 50)"><rect x="18" y="26" width="64" height="44" rx="10" fill="#FFFFFF"/><text x="50" y="60" text-anchor="middle" font-family="Archivo, Arial, sans-serif" font-weight="900" font-size="34" fill="#C2362B">?</text></g><path d="M30 86h40" stroke="#F2C230" stroke-width="6" stroke-linecap="round"/></svg>`;
ART.thumbChora = () => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="#FDF1C8"/><path d="M14 70C26 50 34 78 46 58S66 40 74 60" stroke="#24211C" stroke-width="4" fill="none" stroke-linecap="round"/><g transform="rotate(40 62 34)"><rect x="54" y="6" width="16" height="50" rx="3" fill="#C2362B"/><path d="M54 56h16l-8 14z" fill="#E9DFC8"/><path d="M60 64h4l-2 6z" fill="#24211C"/><rect x="54" y="6" width="16" height="8" rx="3" fill="#F2C230"/></g></svg>`;
