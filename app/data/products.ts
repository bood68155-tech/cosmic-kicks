export interface Product {
  id: string;
  name: string;
  category: 'sneakers' | 'classic' | 'boots';
  price: number;
  description: string;
  details: string[];    // bullet-point features
  materials: string;    // material composition
  svg: string;
  accent: string;       // primary accent color
  accent2?: string;     // secondary accent for gradient
  cosmicTier: 'stellar' | 'nebula' | 'supernova'; // rarity tier
}

export const products: Product[] = [
  // ═══════════════════════════════════════════
  //              SNEAKERS
  // ═══════════════════════════════════════════

  {
    id: 's1',
    name: 'Nebula Runner',
    category: 'sneakers',
    price: 189,
    description: 'Lightweight mesh upper with responsive cushioning. Designed for urban exploration and cosmic commutes. The nebula-knit technology creates a breathable second-skin fit.',
    details: [
      'Nebula-knit breathable upper',
      'Orbit-foam midsole with 30% energy return',
      'Reflective lunar-lace details',
      'Zero-gravity sock liner',
    ],
    materials: 'Nebula-knit polyester / Orbit-foam EVA / Rubber outsole',
    accent: '#7c6ae8',
    accent2: '#4a3aaa',
    cosmicTier: 'stellar',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 70 C30 55 40 40 60 38 L140 35 C155 35 165 45 168 55 L175 75 C178 85 172 90 162 90 L45 90 C35 90 30 82 30 70Z" fill="currentColor" opacity="0.15"/>
      <path d="M35 65 C35 52 45 40 60 38 L138 35 C150 35 160 42 163 52 L170 72 C172 80 168 85 158 85 L42 85 C34 85 30 78 30 68Z" fill="currentColor" opacity="0.25"/>
      <path d="M40 40 L60 38 L140 35 L155 38 L160 55 L165 72 L162 80 L155 82 L40 82 L36 72Z" fill="currentColor" opacity="0.1"/>
      <circle cx="55" cy="75" r="12" fill="currentColor" opacity="0.15"/>
      <circle cx="145" cy="75" r="12" fill="currentColor" opacity="0.15"/>
      <path d="M60 60 L90 58 L90 65 L60 65Z" fill="currentColor" opacity="0.08"/>
      <path d="M95 58 L130 56 L130 63 L95 65Z" fill="currentColor" opacity="0.08"/>
      <path d="M50 48 L55 38 L75 40" stroke="currentColor" strokeWidth="1.5" opacity="0.3" fill="none"/>
      <path d="M130 38 L155 40 L158 52" stroke="currentColor" strokeWidth="1.5" opacity="0.3" fill="none"/>
    </svg>`
  },

  {
    id: 's2',
    name: 'Orbit Flex',
    category: 'sneakers',
    price: 159,
    description: 'Zero-gravity comfort meets street-ready style. Breathable knit fabric with a sleek, laceless silhouette and a slip-on design that adapts to your foot like a second atmosphere.',
    details: [
      'Laceless slip-on construction',
      'Adaptive-knit collar',
      'Perforated air-flow sole',
      'Machine washable',
    ],
    materials: 'Recycled knit mesh / Cloud-cushion EVA / Recycled rubber',
    accent: '#50b8e8',
    accent2: '#2080b0',
    cosmicTier: 'stellar',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 72 C25 58 35 42 58 38 L142 35 C158 35 168 48 170 60 L176 78 C178 88 170 92 160 92 L38 92 C28 92 25 84 25 72Z" fill="currentColor" opacity="0.15"/>
      <path d="M30 68 C30 55 42 42 60 40 L140 38 C155 38 162 50 165 62 L170 76 C172 84 166 88 156 88 L36 88 C28 88 30 80 30 68Z" fill="currentColor" opacity="0.25"/>
      <path d="M50 42 L70 40 L145 38 L158 42 L162 58 L167 74 L162 82 L155 84 L38 84 L34 74Z" fill="currentColor" opacity="0.08"/>
      <ellipse cx="55" cy="78" rx="10" ry="8" fill="currentColor" opacity="0.12"/>
      <ellipse cx="148" cy="78" rx="10" ry="8" fill="currentColor" opacity="0.12"/>
      <path d="M65 58 L95 56 L95 62 L65 64Z" fill="currentColor" opacity="0.06"/>
      <path d="M100 56 L130 54 L130 60 L100 62Z" fill="currentColor" opacity="0.06"/>
      <line x1="55" y1="38" x2="85" y2="36" stroke="currentColor" strokeWidth="1" opacity="0.15"/>
      <line x1="120" y1="36" x2="155" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.15"/>
    </svg>`
  },

  {
    id: 's3',
    name: 'Star Burst Low',
    category: 'sneakers',
    price: 219,
    description: 'Premium leather and mesh hybrid with a responsive sole. Limited edition cosmic colorway featuring iridescent star-burst panels that catch every wavelength of light.',
    details: [
      'Premium leather & mesh hybrid upper',
      'Iridescent burst-panel overlays',
      'Responsive star-foam midsole',
      'Limited edition colorway',
    ],
    materials: 'Italian leather / Star-foam / Mesh / Rubber outsole',
    accent: '#e8c050',
    accent2: '#b89020',
    cosmicTier: 'nebula',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M35 68 C35 52 48 38 65 36 L135 34 C150 34 162 44 165 56 L172 74 C175 84 168 90 158 90 L45 90 C33 90 30 82 30 70Z" fill="currentColor" opacity="0.15"/>
      <path d="M38 64 C38 50 50 38 65 36 L138 34 C152 34 160 44 163 56 L168 74 C170 82 164 86 155 86 L42 86 C32 86 30 78 30 68Z" fill="currentColor" opacity="0.2"/>
      <path d="M55 40 L75 38 L140 36 L152 40 L157 56 L162 72 L158 80 L152 82 L40 82 L34 72Z" fill="currentColor" opacity="0.06"/>
      <circle cx="50" cy="76" r="11" fill="currentColor" opacity="0.12"/>
      <circle cx="150" cy="76" r="11" fill="currentColor" opacity="0.12"/>
      <path d="M40 62 L50 64 L50 70 L40 68Z" fill="currentColor" opacity="0.08"/>
      <path d="M150 62 L160 64 L160 70 L150 68Z" fill="currentColor" opacity="0.08"/>
      <path d="M65 55 L95 52 L95 60 L65 62Z" fill="currentColor" opacity="0.05"/>
      <path d="M100 52 L130 50 L130 58 L100 60Z" fill="currentColor" opacity="0.05"/>
    </svg>`
  },

  {
    id: 's4',
    name: 'Supernova Speed',
    category: 'sneakers',
    price: 249,
    description: 'Engineered for velocity. The Supernova Speed features an ultra-responsive carbon-fiber infused plate and explosive energy-return foam for record-breaking sprints.',
    details: [
      'Carbon-fiber propulsion plate',
      'Supernova energy-return foam',
      'Aero-mesh ventilation system',
      'Anti-gravity heel counter',
    ],
    materials: 'Carbon-fiber composite / Supernova-foam / Aero-mesh / Gum rubber',
    accent: '#e84040',
    accent2: '#aa2020',
    cosmicTier: 'supernova',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 65 C28 50 42 35 62 33 L142 30 C158 30 170 42 172 55 L178 75 C180 86 174 92 162 92 L42 92 C30 92 28 82 28 65Z" fill="currentColor" opacity="0.15"/>
      <path d="M32 60 C32 48 44 36 62 34 L140 32 C154 32 164 44 167 56 L171 74 C173 84 168 88 158 88 L40 88 C30 88 32 78 32 60Z" fill="currentColor" opacity="0.25"/>
      <path d="M52 38 L72 36 L142 34 L156 38 L160 56 L165 72 L160 80 L154 82 L38 82 L32 72 Z" fill="currentColor" opacity="0.08"/>
      <path d="M55 38 L62 34 L80 36" stroke="currentColor" strokeWidth="1.5" opacity="0.2" fill="none"/>
      <path d="M135 34 L157 40 L162 55" stroke="currentColor" strokeWidth="1.5" opacity="0.2" fill="none"/>
      <circle cx="48" cy="78" r="10" fill="currentColor" opacity="0.1"/>
      <circle cx="152" cy="78" r="10" fill="currentColor" opacity="0.1"/>
      <path d="M65 56 L95 54 L95 60 L65 62Z" fill="currentColor" opacity="0.06"/>
      <path d="M100 54 L132 52 L132 58 L100 60Z" fill="currentColor" opacity="0.06"/>
    </svg>`
  },

  {
    id: 's5',
    name: 'Quantum Walker',
    category: 'sneakers',
    price: 279,
    description: 'Where quantum mechanics meets footwear. The Quantum Walker uses phase-change materials that adapt to your stride — stiffening for sprints and softening for strolls.',
    details: [
      'Phase-change adaptive cushioning',
      'Entanglement-knit seamless upper',
      'Quantum-stability outrigger',
      'Heel-wear indicator light',
    ],
    materials: 'Phase-change polymer / Entanglement-knit nylon / Carbon-rubber',
    accent: '#40c8a0',
    accent2: '#209078',
    cosmicTier: 'supernova',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 72 C32 56 44 40 64 38 L138 35 C154 35 166 46 168 58 L174 78 C176 88 170 92 158 92 L44 92 C30 92 32 86 32 72Z" fill="currentColor" opacity="0.15"/>
      <path d="M36 68 C36 55 46 42 64 40 L136 38 C150 38 160 48 163 60 L168 76 C170 84 164 88 154 88 L42 88 C30 88 36 80 36 68Z" fill="currentColor" opacity="0.2"/>
      <path d="M56 42 L76 40 L138 38 L152 42 L156 58 L162 74 L158 82 L152 84 L38 84 L34 72 Z" fill="currentColor" opacity="0.06"/>
      <circle cx="52" cy="76" r="9" fill="currentColor" opacity="0.1"/>
      <circle cx="148" cy="76" r="9" fill="currentColor" opacity="0.1"/>
      <path d="M62 54 L98 52 L98 60 L62 62Z" fill="currentColor" opacity="0.05"/>
      <path d="M102 52 L136 50 L136 58 L102 60Z" fill="currentColor" opacity="0.05"/>
      <line x1="52" y1="40" x2="80" y2="38" stroke="currentColor" strokeWidth="1" opacity="0.12"/>
    </svg>`
  },

  {
    id: 's6',
    name: 'Cosmic Glide',
    category: 'sneakers',
    price: 199,
    description: 'Glide through the urban galaxy in plush comfort. An all-day sneaker with cloud-like cushioning and a sleek, minimalist aesthetic inspired by deep-space silhouettes.',
    details: [
      'Cloud-cushion full-length foam',
      'Minimalist cosmic-weave upper',
      'Padded lunar-collar',
      'Reflective heel tab',
    ],
    materials: 'Cosmic-weave polyester / Cloud-cushion foam / Recycled rubber',
    accent: '#8890e8',
    accent2: '#6068b8',
    cosmicTier: 'nebula',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M34 74 C34 58 46 44 66 42 L136 40 C150 40 162 50 164 60 L170 78 C172 88 166 92 156 92 L46 92 C34 92 34 84 34 74Z" fill="currentColor" opacity="0.15"/>
      <path d="M38 70 C38 58 48 46 66 44 L134 42 C148 42 158 52 160 62 L165 78 C167 86 162 90 152 90 L44 90 C34 90 38 82 38 70Z" fill="currentColor" opacity="0.2"/>
      <path d="M58 46 L78 44 L136 42 L148 46 L152 60 L158 76 L154 84 L148 86 L40 86 L36 74Z" fill="currentColor" opacity="0.06"/>
      <circle cx="50" cy="78" r="8" fill="currentColor" opacity="0.1"/>
      <circle cx="150" cy="78" r="8" fill="currentColor" opacity="0.1"/>
      <path d="M64 56 L98 54 L98 62 L64 64Z" fill="currentColor" opacity="0.05"/>
      <path d="M102 54 L138 52 L138 60 L102 62Z" fill="currentColor" opacity="0.05"/>
    </svg>`
  },

  // ═══════════════════════════════════════════
  //              CLASSICS
  // ═══════════════════════════════════════════

  {
    id: 'c1',
    name: 'Void Oxford',
    category: 'classic',
    price: 259,
    description: 'Handcrafted Italian leather Oxfords with a timeless silhouette. The void-black finish conceals subtle lunar texture that reveals itself in changing light — an eclipse on every step.',
    details: [
      'Hand-burnished Italian calfskin leather',
      'Blake-stitched leather sole',
      'Lunar-texture finish',
      'Lasted heel with subtle arc',
    ],
    materials: 'Italian calfskin leather / Leather sole / Brass eyelets',
    accent: '#b8b0a8',
    accent2: '#888078',
    cosmicTier: 'nebula',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 65 C25 58 30 42 55 40 L110 38 C125 38 135 42 145 50 L165 68 C170 74 172 82 165 86 L55 88 C38 88 25 82 25 72Z" fill="currentColor" opacity="0.15"/>
      <path d="M28 62 C28 55 35 45 55 42 L108 40 C122 40 132 44 140 52 L160 68 C164 74 166 80 160 84 L52 86 C36 86 28 78 28 68Z" fill="currentColor" opacity="0.25"/>
      <path d="M60 42 L105 40 L130 44 L148 56 L158 68 L157 78 L152 82 L50 82 L32 68 L35 56L45 46Z" fill="currentColor" opacity="0.08"/>
      <path d="M40 44 L55 42 L65 48 L52 52Z" fill="currentColor" opacity="0.1"/>
      <path d="M55 54 L95 50 L95 58 L55 62Z" fill="currentColor" opacity="0.06"/>
      <path d="M100 50 L135 52 L135 60 L100 58Z" fill="currentColor" opacity="0.06"/>
      <line x1="45" y1="42" x2="55" y2="38" stroke="currentColor" strokeWidth="1.2" opacity="0.2"/>
      <line x1="120" y1="40" x2="145" y2="52" stroke="currentColor" strokeWidth="1.2" opacity="0.2"/>
    </svg>`
  },

  {
    id: 'c2',
    name: 'Lunar Loafer',
    category: 'classic',
    price: 229,
    description: 'Suede penny loafers with a celestial twist. Apollo-crew comfort meets boardroom-ready refinement. The hand-stitched apron pays homage to classic Italian craftsmanship.',
    details: [
      'Premium Italian suede upper',
      'Hand-stitched apron detail',
      'Leather-lined interior',
      'Moon-rock rubber outsole',
    ],
    materials: 'Italian suede / Leather lining / Rubber outsole',
    accent: '#c0b8a8',
    accent2: '#908878',
    cosmicTier: 'stellar',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 68 C20 58 28 42 52 40 L120 38 C138 38 148 46 155 56 L168 72 C172 80 168 86 158 88 L50 88 C30 88 20 80 20 68Z" fill="currentColor" opacity="0.15"/>
      <path d="M24 65 C24 55 32 44 52 42 L118 40 C135 40 144 48 150 58 L162 72 C165 80 162 84 154 86 L48 86 C30 86 24 78 24 68Z" fill="currentColor" opacity="0.25"/>
      <path d="M52 42 L115 40 L140 46 L152 58 L160 72 L156 80 L150 82 L46 82 L28 68 L32 56 L42 46Z" fill="currentColor" opacity="0.08"/>
      <ellipse cx="48" cy="48" rx="8" ry="6" fill="currentColor" opacity="0.08"/>
      <path d="M55 56 L100 52 L100 60 L55 64Z" fill="currentColor" opacity="0.06"/>
      <path d="M105 52 L140 54 L140 62 L105 60Z" fill="currentColor" opacity="0.06"/>
      <path d="M42 40 L52 38" stroke="currentColor" strokeWidth="1.2" opacity="0.2"/>
    </svg>`
  },

  {
    id: 'c3',
    name: 'Eclipse Derby',
    category: 'classic',
    price: 279,
    description: 'Full-grain leather derby shoes with burnished edges. An eclipse of shadow and light on every step. Open lacing system for a refined, comfortable fit.',
    details: [
      'Full-grain European leather',
      'Open-lace derby system',
      'Burnished edge finishing',
      'Leather-wrapped heel',
    ],
    materials: 'Full-grain leather / Leather sole / Brass hardware',
    accent: '#a8a098',
    accent2: '#787068',
    cosmicTier: 'nebula',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 62 C30 55 38 38 60 36 L115 34 C132 34 142 40 150 48 L168 66 C174 74 175 84 165 88 L58 88 C40 88 30 80 30 68Z" fill="currentColor" opacity="0.15"/>
      <path d="M34 60 C34 52 42 40 60 38 L113 36 C128 36 138 42 145 50 L162 66 C167 74 168 82 160 85 L56 85 C38 85 34 76 34 66Z" fill="currentColor" opacity="0.2"/>
      <path d="M60 38 L110 36 L132 42 L148 54 L160 66 L158 78 L152 82 L54 82 L38 66 L40 54 L48 44Z" fill="currentColor" opacity="0.06"/>
      <path d="M42 42 L58 38 L72 44 L58 48Z" fill="currentColor" opacity="0.08"/>
      <path d="M58 52 L95 48 L95 56 L58 60Z" fill="currentColor" opacity="0.05"/>
      <path d="M100 48 L138 50 L138 58 L100 56Z" fill="currentColor" opacity="0.05"/>
      <line x1="55" y1="36" x2="72" y2="34" stroke="currentColor" strokeWidth="1" opacity="0.12"/>
      <line x1="130" y1="38" x2="152" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.15"/>
    </svg>`
  },

  {
    id: 'c4',
    name: 'Astral Monk',
    category: 'classic',
    price: 319,
    description: 'Double-monk strap shoes with a celestial edge. The burnished cognac leather develops a rich patina over time, like a constellation slowly revealing itself.',
    details: [
      'Double monk-strap with brushed buckles',
      'Cognac burnished calfskin',
      'Goodyear-welted construction',
      'Leather stacked heel',
    ],
    materials: 'Burnished calfskin / Leather sole / Brushed brass buckles',
    accent: '#c8a070',
    accent2: '#987048',
    cosmicTier: 'supernova',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 64 C22 56 28 40 52 38 L118 36 C136 36 148 44 155 54 L168 72 C172 82 166 88 156 90 L48 90 C30 90 22 80 22 64Z" fill="currentColor" opacity="0.15"/>
      <path d="M26 60 C26 52 34 42 54 40 L116 38 C132 38 142 46 148 56 L162 72 C166 80 162 84 152 86 L46 86 C28 86 26 76 26 60Z" fill="currentColor" opacity="0.2"/>
      <path d="M54 40 L112 38 L138 44 L150 56 L160 72 L156 80 L150 82 L44 82 L30 72 L34 58 L42 48Z" fill="currentColor" opacity="0.06"/>
      <rect x="56" y="44" width="52" height="4" rx="1" fill="currentColor" opacity="0.06"/>
      <rect x="56" y="52" width="48" height="3" rx="1" fill="currentColor" opacity="0.05"/>
      <circle cx="50" cy="76" r="8" fill="currentColor" opacity="0.1"/>
      <circle cx="150" cy="76" r="8" fill="currentColor" opacity="0.1"/>
    </svg>`
  },

  {
    id: 'c5',
    name: 'Celestial Chelsea',
    category: 'classic',
    price: 299,
    description: 'A sleek Chelsea boot reimagined for the cosmos. Elastic side panels and a pull tab make for effortless wear, while the refined silhouette transitions from deck to dinner.',
    details: [
      'Slim elastic-side Chelsea silhouette',
      'Pull tab with constellation stitching',
      'Leather-lined with cushioned insole',
      'Rounded toe with slight taper',
    ],
    materials: 'Suede / Elastic gore / Leather lining / Rubber sole',
    accent: '#889098',
    accent2: '#606870',
    cosmicTier: 'nebula',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 68 C28 58 34 40 56 36 L130 34 C148 34 160 46 164 60 L174 78 C176 88 170 92 158 92 L42 92 C28 92 28 80 28 68Z" fill="currentColor" opacity="0.15"/>
      <path d="M32 64 C32 54 38 44 58 40 L128 38 C144 38 154 48 158 60 L166 76 C168 84 162 88 152 88 L40 88 C28 88 32 78 32 64Z" fill="currentColor" opacity="0.2"/>
      <path d="M58 40 L124 38 L148 44 L156 58 L164 74 L160 82 L154 84 L38 84 L30 72 L34 56 L44 48Z" fill="currentColor" opacity="0.06"/>
      <rect x="58" y="34" width="4" height="20" rx="1" fill="currentColor" opacity="0.04"/>
      <circle cx="48" cy="78" r="8" fill="currentColor" opacity="0.1"/>
      <circle cx="152" cy="78" r="8" fill="currentColor" opacity="0.1"/>
    </svg>`
  },

  {
    id: 'c6',
    name: 'Gravity Brogue',
    category: 'classic',
    price: 339,
    description: 'The gravity-defying brogue — intricate pinking and perforation details meet a lightweight construction that feels like walking on the moon. Defy convention, defy gravity.',
    details: [
      'Full brogue with pinking detailing',
      'Perforated medallion toe cap',
      'Lightweight micro-sole construction',
      'Antique brass eyelets',
    ],
    materials: 'Polished calfskin / Micro-sole / Leather heel stack',
    accent: '#989088',
    accent2: '#706860',
    cosmicTier: 'supernova',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M26 62 C26 54 32 38 56 36 L122 34 C140 34 152 42 160 52 L172 70 C176 80 168 86 158 88 L50 88 C32 88 26 78 26 62Z" fill="currentColor" opacity="0.15"/>
      <path d="M30 58 C30 50 36 40 56 38 L120 36 C136 36 146 44 154 54 L166 70 C170 78 164 82 154 84 L48 84 C30 84 30 74 30 58Z" fill="currentColor" opacity="0.2"/>
      <path d="M56 38 L118 36 L144 42 L156 54 L165 70 L160 78 L154 80 L46 80 L32 70 L36 56 L44 46Z" fill="currentColor" opacity="0.06"/>
      <circle cx="50" cy="58" r="2" fill="currentColor" opacity="0.08"/>
      <circle cx="56" cy="54" r="1.5" fill="currentColor" opacity="0.08"/>
      <circle cx="62" cy="58" r="1.5" fill="currentColor" opacity="0.08"/>
      <circle cx="50" cy="78" r="8" fill="currentColor" opacity="0.1"/>
      <circle cx="152" cy="78" r="8" fill="currentColor" opacity="0.1"/>
    </svg>`
  },

  // ═══════════════════════════════════════════
  //               BOOTS
  // ═══════════════════════════════════════════

  {
    id: 'b1',
    name: 'Astro Combat',
    category: 'boots',
    price: 329,
    description: 'Military-grade combat boots engineered for extraterrestrial terrain. Waterproof, reinforced, and interstellar-ready with a tactical aesthetic that commands attention.',
    details: [
      'Waterproof sealed membrane',
      'Reinforced toe and heel cap',
      'Anti-slip lunar-tread outsole',
      'Quick-lace tactical system',
    ],
    materials: 'Full-grain leather / Sealed membrane / Vibram® outsole',
    accent: '#707880',
    accent2: '#485058',
    cosmicTier: 'supernova',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 72 C15 62 20 35 45 32 L120 28 C142 28 155 38 165 50 L180 70 C185 82 178 90 168 92 L35 92 C20 92 15 84 15 72Z" fill="currentColor" opacity="0.2"/>
      <path d="M18 68 C18 58 24 38 48 34 L118 30 C138 30 150 40 158 52 L172 72 C176 84 170 88 162 90 L32 90 C18 90 18 80 18 68Z" fill="currentColor" opacity="0.3"/>
      <path d="M48 34 L115 30 L140 36 L155 50 L168 70 L164 82 L158 85 L30 85 L22 70 L26 55 L35 42Z" fill="currentColor" opacity="0.08"/>
      <rect x="42" y="60" width="10" height="25" rx="2" fill="currentColor" opacity="0.06"/>
      <rect x="62" y="55" width="10" height="30" rx="2" fill="currentColor" opacity="0.06"/>
      <rect x="82" y="50" width="10" height="35" rx="2" fill="currentColor" opacity="0.06"/>
      <rect x="102" y="48" width="10" height="37" rx="2" fill="currentColor" opacity="0.06"/>
      <rect x="122" y="48" width="10" height="37" rx="2" fill="currentColor" opacity="0.06"/>
      <circle cx="42" cy="78" r="10" fill="currentColor" opacity="0.12"/>
      <circle cx="158" cy="78" r="10" fill="currentColor" opacity="0.12"/>
      <path d="M25 40 L45 35 L75 38" stroke="currentColor" strokeWidth="1.5" opacity="0.2" fill="none"/>
      <path d="M140 38 L170 48 L175 62" stroke="currentColor" strokeWidth="1.5" opacity="0.2" fill="none"/>
    </svg>`
  },

  {
    id: 'b2',
    name: 'Crater Trekker',
    category: 'boots',
    price: 289,
    description: 'Rugged hiking boots with Vibram® outsoles and moon-grade traction. The crater-lug pattern grips every surface — from Martian regolith to slick city sidewalks.',
    details: [
      'Vibram® Crater-Lug outsole',
      'Water-repellent nubuck upper',
      'Padded ankle support collar',
      'Rock-shield toe protection',
    ],
    materials: 'Nubuck leather / Vibram® outsole / EVA midsole / Gore-Tex® lining',
    accent: '#687070',
    accent2: '#404848',
    cosmicTier: 'nebula',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 70 C20 60 25 32 48 30 L115 28 C138 28 152 38 162 52 L175 72 C178 82 172 90 162 92 L40 92 C25 92 20 82 20 70Z" fill="currentColor" opacity="0.2"/>
      <path d="M24 66 C24 56 28 36 50 32 L113 30 C134 30 146 40 155 52 L168 72 C172 82 166 86 158 88 L38 88 C24 88 24 78 24 66Z" fill="currentColor" opacity="0.3"/>
      <path d="M50 32 L110 30 L136 36 L152 50 L165 70 L160 82 L155 85 L36 85 L28 70 L32 55 L40 42Z" fill="currentColor" opacity="0.08"/>
      <path d="M38 55 L60 50 L72 55 L60 65 L40 60Z" fill="currentColor" opacity="0.06"/>
      <path d="M85 48 L130 44 L142 50 L130 62 L85 58Z" fill="currentColor" opacity="0.06"/>
      <circle cx="38" cy="78" r="11" fill="currentColor" opacity="0.12"/>
      <circle cx="160" cy="78" r="11" fill="currentColor" opacity="0.12"/>
      <path d="M28 38 L48 32 L80 36" stroke="currentColor" strokeWidth="1.5" opacity="0.15" fill="none"/>
      <path d="M138 36 L165 48 L170 60" stroke="currentColor" strokeWidth="1.5" opacity="0.15" fill="none"/>
    </svg>`
  },

  {
    id: 'b3',
    name: 'Solar Panel Boot',
    category: 'boots',
    price: 379,
    description: 'Limited edition tactical boots with integrated solar-weave panels. Charges your devices as you explore the unknown. The future of footwear, powered by the sun.',
    details: [
      'Solar-weave charging panels',
      'USB-C integrated charging port',
      'Impact-resistant composite toe',
      'Reflective constellation laces',
    ],
    materials: 'Solar-weave polymer / Nylon composite / Rubber / Aluminum hardware',
    accent: '#887868',
    accent2: '#605040',
    cosmicTier: 'supernova',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 74 C18 64 22 34 48 30 L118 26 C140 26 155 38 165 52 L178 72 C182 84 176 92 165 94 L38 94 C22 94 18 86 18 74Z" fill="currentColor" opacity="0.2"/>
      <path d="M22 70 C22 60 26 38 50 34 L116 30 C136 30 150 40 158 54 L172 74 C176 86 170 90 160 92 L35 92 C20 92 22 82 22 70Z" fill="currentColor" opacity="0.3"/>
      <path d="M50 34 L113 30 L140 36 L155 52 L168 72 L164 84 L158 87 L33 87 L26 72 L30 56 L38 44Z" fill="currentColor" opacity="0.08"/>
      <rect x="55" y="40" width="8" height="20" rx="1" fill="currentColor" opacity="0.05"/>
      <rect x="75" y="38" width="8" height="25" rx="1" fill="currentColor" opacity="0.05"/>
      <rect x="95" y="36" width="8" height="30" rx="1" fill="currentColor" opacity="0.05"/>
      <rect x="115" y="38" width="8" height="25" rx="1" fill="currentColor" opacity="0.05"/>
      <rect x="135" y="42" width="8" height="20" rx="1" fill="currentColor" opacity="0.05"/>
      <path d="M50 68 L146 68" stroke="currentColor" strokeWidth="1" opacity="0.08"/>
      <circle cx="40" cy="80" r="11" fill="currentColor" opacity="0.12"/>
      <circle cx="162" cy="80" r="11" fill="currentColor" opacity="0.12"/>
      <path d="M28 36 L48 30 L82 34" stroke="currentColor" strokeWidth="1.5" opacity="0.15" fill="none"/>
      <path d="M136 34 L165 48 L170 62" stroke="currentColor" strokeWidth="1.5" opacity="0.15" fill="none"/>
    </svg>`
  },

  {
    id: 'b4',
    name: 'Orion Tactical',
    category: 'boots',
    price: 359,
    description: 'Named for the hunter constellation, these tactical boots are built for the most extreme conditions. Side-zip deployment, reinforced stitching, and a stealth profile.',
    details: [
      'Side-zip rapid deployment',
      'Kevlar® reinforced stitching',
      'Stealth rubber outsole',
      'Tactical webbing anchor points',
    ],
    materials: 'Nylon / Leather / Kevlar® thread / Rubber / YKK zipper',
    accent: '#505858',
    accent2: '#303838',
    cosmicTier: 'supernova',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 74 C22 64 26 34 50 30 L122 28 C144 28 158 38 168 52 L180 72 C184 84 176 92 166 94 L40 94 C24 94 22 86 22 74Z" fill="currentColor" opacity="0.2"/>
      <path d="M26 70 C26 60 30 38 52 34 L120 30 C140 30 154 40 162 54 L174 74 C178 86 172 90 162 92 L38 92 C24 92 26 82 26 70Z" fill="currentColor" opacity="0.3"/>
      <path d="M52 34 L118 30 L144 36 L158 52 L170 72 L166 84 L160 87 L36 87 L30 72 L34 56 L42 44Z" fill="currentColor" opacity="0.08"/>
      <line x1="34" y1="52" x2="44" y2="56" stroke="currentColor" strokeWidth="1.5" opacity="0.15"/>
      <line x1="48" y1="48" x2="58" y2="52" stroke="currentColor" strokeWidth="1.5" opacity="0.15"/>
      <line x1="148" y1="48" x2="166" y2="60" stroke="currentColor" strokeWidth="1.5" opacity="0.15"/>
      <circle cx="44" cy="80" r="10" fill="currentColor" opacity="0.1"/>
      <circle cx="160" cy="80" r="10" fill="currentColor" opacity="0.1"/>
    </svg>`
  },

  {
    id: 'b5',
    name: 'Mars Explorer',
    category: 'boots',
    price: 399,
    description: 'Designed in collaboration with Martian terrain specialists. The Mars Explorer features a pressurized ankle seal and heat-dissipating outsole for extreme temperature variance.',
    details: [
      'Pressurized ankle gaiter seal',
      'Heat-dissipating ceramic outsole',
      'Multi-directional tread blocks',
      'Corrosion-resistant hardware',
    ],
    materials: 'Ballistic nylon / Ceramic composite / Sealed gaiter / Titanium hardware',
    accent: '#c07050',
    accent2: '#904830',
    cosmicTier: 'supernova',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 76 C18 66 22 38 48 34 L118 30 C140 30 155 40 165 54 L178 74 C182 86 174 94 164 96 L36 96 C20 96 18 88 18 76Z" fill="currentColor" opacity="0.2"/>
      <path d="M22 72 C22 62 26 42 50 38 L116 34 C136 34 150 44 158 58 L172 78 C176 90 168 94 158 96 L34 96 C18 96 22 84 22 72Z" fill="currentColor" opacity="0.3"/>
      <path d="M50 38 L114 34 L140 40 L156 56 L168 76 L164 88 L158 91 L32 91 L26 76 L30 60 L40 48Z" fill="currentColor" opacity="0.08"/>
      <circle cx="42" cy="82" r="12" fill="currentColor" opacity="0.1"/>
      <circle cx="162" cy="82" r="12" fill="currentColor" opacity="0.1"/>
      <path d="M48 30 L52 26 L80 30" stroke="currentColor" strokeWidth="1.5" opacity="0.12" fill="none"/>
      <path d="M142 32 L168 46 L172 60" stroke="currentColor" strokeWidth="1.5" opacity="0.12" fill="none"/>
    </svg>`
  },

  {
    id: 'b6',
    name: 'Nebula Hiker',
    category: 'boots',
    price: 269,
    description: 'Mid-height hiker with a cosmic color gradient. The nebula-dyed leather shifts from deep violet to midnight blue — no two pairs are exactly alike.',
    details: [
      'Nebula-gradient hand-dyed leather',
      'Mid-height ankle support',
      'Vibram® Nebula-Grip outsole',
      'Padded tongue and collar',
    ],
    materials: 'Hand-dyed leather / Vibram® outsole / EVA midsole / Lace closure',
    accent: '#6848a8',
    accent2: '#403080',
    cosmicTier: 'nebula',
    svg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 72 C24 62 28 36 52 34 L116 30 C138 30 152 40 162 54 L174 74 C178 84 170 90 160 92 L38 92 C24 92 24 82 24 72Z" fill="currentColor" opacity="0.2"/>
      <path d="M28 68 C28 58 32 40 54 36 L114 34 C134 34 146 44 155 56 L168 74 C172 84 166 88 156 90 L36 90 C24 90 28 80 28 68Z" fill="currentColor" opacity="0.3"/>
      <path d="M54 36 L112 34 L138 40 L153 56 L165 74 L160 84 L154 87 L34 87 L28 74 L32 58 L42 48Z" fill="currentColor" opacity="0.08"/>
      <circle cx="40" cy="78" r="10" fill="currentColor" opacity="0.1"/>
      <circle cx="158" cy="78" r="10" fill="currentColor" opacity="0.1"/>
      <path d="M38 48 L58 44 L70 48" stroke="currentColor" strokeWidth="1" opacity="0.12" fill="none"/>
      <path d="M138 42 L162 52 L166 64" stroke="currentColor" strokeWidth="1" opacity="0.12" fill="none"/>
    </svg>`
  },
];

export const categories = [
  {
    id: 'sneakers' as const,
    name: 'Sneakers',
    tagline: 'Urban velocity. Cosmic comfort.',
    description: 'From nebula-knit uppers to orbit-foam soles, our sneakers blend street-edge aesthetic with zero-gravity feel.',
    icon: '👟'
  },
  {
    id: 'classic' as const,
    name: 'Classics',
    tagline: 'Timeless. Celestial. Refined.',
    description: 'Handcrafted Italian leathers meet lunar craftsmanship. Shoes that have walked on the moon — and boardrooms.',
    icon: '👞'
  },
  {
    id: 'boots' as const,
    name: 'Boots',
    tagline: 'Terraformed for the unknown.',
    description: 'Built for the harshest environments — from Martian dust storms to concrete jungles. Unstoppable traction.',
    icon: '👢'
  }
] as const;
