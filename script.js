/* ============================================================
   FLORESTA DOS DADOS — script.js
   Torre PvE (5 andares) + Loja + PvP local
   ============================================================ */

// ── Constantes da Torre ──────────────────────────────────────
const TOWER_ENEMIES = [
  // Andares 1–4
  { nome: "Goblin Bêbado",      icon: "🧌", baseHp: 55,  baseDano: 0,  defense: 0,  reward: 20,  isBoss: false, isSemiBoss: false },
  { nome: "Lobo Sombrio",       icon: "🐺", baseHp: 75,  baseDano: 1,  defense: 1,  reward: 20,  isBoss: false, isSemiBoss: false },
  { nome: "Esqueleto Arcano",   icon: "💀", baseHp: 95,  baseDano: 2,  defense: 2,  reward: 40,  isBoss: false, isSemiBoss: false },
  { nome: "Golem de Pedra",     icon: "🗿", baseHp: 115, baseDano: 3,  defense: 3,  reward: 40,  isBoss: false, isSemiBoss: false },
  // Andar 5 — SEMI-BOSS (checkpoint)
  { nome: "Hidra das Sombras",  icon: "🐲", baseHp: 160, baseDano: 5,  defense: 4,  reward: 100, isBoss: false, isSemiBoss: true  },
  // Andares 6–9
  { nome: "Bruxa da Neblina",   icon: "🧙‍♀️", baseHp: 135, baseDano: 4,  defense: 3,  reward: 60,  isBoss: false, isSemiBoss: false },
  { nome: "Cavaleiro Maldito",  icon: "🧟", baseHp: 155, baseDano: 5,  defense: 4,  reward: 60,  isBoss: false, isSemiBoss: false },
  { nome: "Titã de Ferro",      icon: "🤖", baseHp: 175, baseDano: 6,  defense: 5,  reward: 80,  isBoss: false, isSemiBoss: false },
  { nome: "Fênix Infernal",     icon: "🦅", baseHp: 195, baseDano: 7,  defense: 5,  reward: 80,  isBoss: false, isSemiBoss: false },
  // Andar 10 — BOSS FINAL
  { nome: "DRAGÃO DA FLORESTA", icon: "🐉", baseHp: 240, baseDano: 9,  defense: 6,  reward: 300, isBoss: true,  isSemiBoss: false }
];
// Índice do checkpoint (andar 5 = índice 4 = semi-boss)
const CHECKPOINT_FLOOR = 4; // índice 0-based do semi-boss

// ── Catálogo da Loja ─────────────────────────────────────────
const SHOP_CATALOG = {
  sword_common:    { name: "Espada Comum",    icon: "⚔️",  cost: 60,  rarity: "common",    bonusDano: 2,  defense: 0,  hp: 0,  diceBonus: 0, magicBonus: 0, stackable: true, maxStack: 3 },
  sword_rare:      { name: "Espada Rara",     icon: "🗡️",  cost: 230, rarity: "rare",      bonusDano: 5,  defense: 0,  hp: 0,  diceBonus: 0, magicBonus: 0, stackable: true, maxStack: 3 },
  sword_legendary: { name: "Espada Lendária", icon: "🔱",  cost: 500, rarity: "legendary", bonusDano: 8,  defense: 0,  hp: 0,  diceBonus: 0, magicBonus: 0, stackable: true, maxStack: 3 },
  armor_common:    { name: "Armadura Comum",  icon: "🥋",  cost: 60,  rarity: "common",    bonusDano: 0,  defense: 5,  hp: 2,  diceBonus: 0, magicBonus: 0, stackable: true, maxStack: 3 },
  armor_rare:      { name: "Armadura Rara",   icon: "🦺",  cost: 230, rarity: "rare",      bonusDano: 0,  defense: 8,  hp: 5,  diceBonus: 0, magicBonus: 0, stackable: true, maxStack: 3 },
  armor_legendary: { name: "Armadura Lendária",icon:"⚜️",  cost: 500, rarity: "legendary", bonusDano: 0,  defense: 10, hp: 12, diceBonus: 0, magicBonus: 0, stackable: true, maxStack: 3 },
  potion_epic:     { name: "Poção Épica",     icon: "💊",  cost: 60,  rarity: "epic",      bonusDano: 0,  defense: 0,  hp: 0,  diceBonus: 0, magicBonus: 0, stackable: true, maxStack: 3, consumable: true },
  super_potion:    { name: "Super Poção",     icon: "🧬",  cost: 500, rarity: "legendary", bonusDano: 0,  defense: 0,  hp: 0,  diceBonus: 0, magicBonus: 0, stackable: true, maxStack: 3, consumable: true, fullHeal: true },
  dex_card:        { name: "Carta de Destreza",icon:"🃏",  cost: 230, rarity: "rare",      bonusDano: 0,  defense: 0,  hp: 0,  diceBonus: 2, magicBonus: 0, stackable: true, maxStack: 1 },
  tome_common:     { name: "Livro Mágico Comum",   icon: "📗", cost: 60,  rarity: "common",    bonusDano: 0,  defense: 0,  hp: 0,  diceBonus: 0, magicBonus: 2, stackable: true, maxStack: 3 },
  tome_rare:       { name: "Livro Mágico Raro",    icon: "📘", cost: 230, rarity: "rare",      bonusDano: 0,  defense: 0,  hp: 0,  diceBonus: 0, magicBonus: 5, stackable: true, maxStack: 3 },
  tome_legendary:  { name: "Livro Mágico Lendário",icon: "📙", cost: 500, rarity: "legendary", bonusDano: 0,  defense: 0,  hp: 0,  diceBonus: 0, magicBonus: 8, stackable: true, maxStack: 3 }
};

// ── Estado global ────────────────────────────────────────────
const state = {
  mode: "pve",
  player: null,
  enemy: null,
  nickname: "Jogador",
  nick2: "Jogador 2",

  // Inventário de combate (itens ganhos em batalha — perdidos ao morrer)
  shield: 0, potion: 0, powder: 0,
  playerShielded: false, playerBlind: 0,

  // Inventário inimigo / P2
  eShield: 0, ePotion: 0, ePowder: 0,
  enemyShielded: false, enemyBlind: 0,

  // Torre PvE
  towerFloor: 0,        // 0-9: andar atual (0 = primeiro inimigo)
  towerActive: false,   // true = torre em andamento
  towerChoice: null,    // personagem escolhido para a torre
  towerPlayerHp: 100,   // HP persiste entre lutas
  towerMaxHp: 100,      // HP máximo calculado com gear

  // Equipamentos (persistem até morrer — salvo em localStorage)
  gear: [],             // array de ids de itens comprados

  // Poções épicas em batalha (vindas do shop)
  epicPotions: 0,
  superPotions: 0,

  userTurn: true,
  busy: false,
  over: false,

  // PvP
  pvp1Choice: null,
  pvp2Choice: null,

  // Tela anterior (para voltar da loja)
  shopReturnScreen: "setup"
};

// ── Helpers ─────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const setup   = $("setup");
const shop    = $("shop");
const battle  = $("battle");
const between = $("between");
const result  = $("result");

function escapeHtml(s) {
  return s.replace(/[&<>'"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;" }[c]));
}

// ── SVG Art de cada personagem / inimigo ─────────────────────
function charSvg(key) {
  const SVG = {

    // ── GOBLIN — green goblin rogue with dagger, hood, patched pants ──────────
    goblin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 140" width="110" height="140">
      <!-- Botas -->
      <ellipse cx="36" cy="133" rx="10" ry="5" fill="#3a2010"/>
      <ellipse cx="72" cy="133" rx="10" ry="5" fill="#3a2010"/>
      <rect x="28" y="118" width="16" height="18" rx="4" fill="#4a2c14"/>
      <rect x="64" y="118" width="16" height="18" rx="4" fill="#4a2c14"/>
      <!-- Pernas — calça rasgada azul-escuro -->
      <rect x="30" y="95" width="18" height="28" rx="5" fill="#1e3040"/>
      <rect x="62" y="95" width="18" height="28" rx="5" fill="#1e3040"/>
      <!-- Remendos nas calças -->
      <rect x="32" y="108" width="8" height="6" rx="1" fill="#4a5a60" opacity="0.7"/>
      <rect x="64" y="115" width="9" height="6" rx="1" fill="#4a5a60" opacity="0.7"/>
      <!-- Avental/saia rasgada -->
      <path d="M32 88 Q40 104 50 100 Q60 104 78 88 Q72 110 65 115 Q56 120 50 118 Q44 120 35 115 Q28 110 32 88Z" fill="#1a2535"/>
      <!-- Cinto marrom com fivela -->
      <rect x="30" y="84" width="50" height="7" rx="3" fill="#5a3a1a"/>
      <rect x="46" y="83" width="18" height="9" rx="2" fill="#8a5a28"/>
      <rect x="50" y="85" width="10" height="5" rx="1" fill="#c8a030"/>
      <!-- Saquinho na cintura -->
      <ellipse cx="68" cy="91" rx="6" ry="7" fill="#8a6520"/>
      <path d="M63 86 Q68 82 73 86" stroke="#f5d070" stroke-width="1.5" fill="none"/>
      <!-- Corpo — colete azul escuro -->
      <rect x="31" y="62" width="48" height="30" rx="8" fill="#1e2d3a"/>
      <!-- Rebites no colete -->
      <rect x="46" y="68" width="18" height="4" rx="2" fill="#3a4a55"/>
      <rect x="46" y="76" width="18" height="4" rx="2" fill="#3a4a55"/>
      <circle cx="48" cy="70" r="2" fill="#6a8090"/>
      <circle cx="62" cy="70" r="2" fill="#6a8090"/>
      <circle cx="48" cy="78" r="2" fill="#6a8090"/>
      <circle cx="62" cy="78" r="2" fill="#6a8090"/>
      <!-- Capuz marrom -->
      <path d="M26 50 Q28 22 55 18 Q72 20 80 38 Q82 50 78 58 Q74 40 55 38 Q36 38 26 50Z" fill="#5a3a18"/>
      <!-- Aba do capuz caindo -->
      <path d="M26 50 Q20 64 24 74 Q28 68 32 62 Z" fill="#5a3a18"/>
      <path d="M80 50 Q86 64 82 74 Q78 68 74 62 Z" fill="#5a3a18"/>
      <!-- Rasgos e costuras no capuz -->
      <path d="M30 52 Q32 46 36 50" stroke="#3a220a" stroke-width="1" fill="none"/>
      <path d="M74 52 Q76 46 72 50" stroke="#3a220a" stroke-width="1" fill="none"/>
      <!-- Remendo no capuz -->
      <rect x="52" y="20" width="10" height="8" rx="1" fill="#6a4820" opacity="0.8"/>
      <line x1="52" y1="20" x2="62" y2="20" stroke="#3a2210" stroke-width="0.6"/>
      <line x1="52" y1="28" x2="62" y2="28" stroke="#3a2210" stroke-width="0.6"/>
      <!-- Cabeça verde goblin -->
      <ellipse cx="55" cy="48" rx="20" ry="22" fill="#4da830"/>
      <!-- Orelhas pontudas grandes -->
      <polygon points="35,44 22,34 32,54" fill="#4da830"/>
      <polygon points="75,44 88,34 78,54" fill="#4da830"/>
      <polygon points="35,44 24,36 33,52" fill="#3a8820"/>
      <polygon points="75,44 86,36 77,52" fill="#3a8820"/>
      <!-- Brinco orelha direita -->
      <circle cx="87" cy="38" r="2.5" fill="#f5c030"/>
      <!-- Olhos amarelo-laranja -->
      <ellipse cx="46" cy="46" rx="6" ry="6" fill="#e8a020"/>
      <ellipse cx="64" cy="46" rx="6" ry="6" fill="#e8a020"/>
      <circle cx="47" cy="46" r="3" fill="#1a0800"/>
      <circle cx="65" cy="46" r="3" fill="#1a0800"/>
      <circle cx="48.2" cy="44.5" r="1.2" fill="white"/>
      <circle cx="66.2" cy="44.5" r="1.2" fill="white"/>
      <!-- Nariz pontudo -->
      <path d="M50 52 Q55 58 60 52 Q57 55 55 54 Q53 55 50 52Z" fill="#2a7010"/>
      <!-- Sorriso malévolo com presas -->
      <path d="M43 60 Q55 68 67 60" stroke="#1a0800" stroke-width="1.5" fill="none"/>
      <polygon points="47,61 49,68 51,61" fill="white"/>
      <polygon points="59,61 61,68 63,61" fill="white"/>
      <!-- Sobrancelhas franzidas -->
      <path d="M40 40 Q46 37 52 40" stroke="#1a4008" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M58 40 Q64 37 70 40" stroke="#1a4008" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Braço direito (esquerdo na tela) segurando adaga -->
      <path d="M31 68 Q18 78 16 90" stroke="#3a8820" stroke-width="9" fill="none" stroke-linecap="round"/>
      <!-- Pulso -->
      <ellipse cx="16" cy="92" rx="5" ry="5" fill="#4da830"/>
      <!-- Adaga -->
      <rect x="4" y="76" width="4" height="24" rx="2" fill="#c0c8d0" transform="rotate(-30 4 76)"/>
      <rect x="2" y="80" width="8" height="3" rx="1" fill="#8a6030" transform="rotate(-30 2 80)"/>
      <rect x="6" y="77" width="3" height="5" rx="1" fill="#7a5020" transform="rotate(-30 6 77)"/>
      <!-- Braço esquerdo (direito na tela) -->
      <path d="M79 68 Q92 76 93 88" stroke="#3a8820" stroke-width="9" fill="none" stroke-linecap="round"/>
      <ellipse cx="93" cy="90" rx="5" ry="5" fill="#4da830"/>
    </svg>`,

    // ── HUNTER — elf archer, blonde hair, green tunic, brown cape ────────────
    hunter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 145" width="120" height="145">
      <!-- Botas marrons -->
      <rect x="34" y="118" width="18" height="22" rx="5" fill="#5a3518"/>
      <rect x="66" y="118" width="18" height="22" rx="5" fill="#5a3518"/>
      <ellipse cx="43" cy="139" rx="12" ry="5" fill="#3a2010"/>
      <ellipse cx="75" cy="139" rx="12" ry="5" fill="#3a2010"/>
      <!-- Detalhe topo das botas -->
      <rect x="34" y="118" width="18" height="5" rx="2" fill="#7a4a22"/>
      <rect x="66" y="118" width="18" height="5" rx="2" fill="#7a4a22"/>
      <!-- Calças verde musgo escuro -->
      <rect x="35" y="92" width="20" height="30" rx="6" fill="#3a5030"/>
      <rect x="63" y="92" width="20" height="30" rx="6" fill="#3a5030"/>
      <!-- Capa marrom grande — atrás -->
      <path d="M20 55 Q18 90 22 115 Q30 130 43 138 Q30 125 28 105 Q26 80 30 60Z" fill="#5a3518"/>
      <path d="M100 55 Q102 90 98 115 Q90 130 77 138 Q90 125 92 105 Q94 80 90 60Z" fill="#5a3518"/>
      <!-- Túnica verde -->
      <path d="M32 62 Q28 80 30 95 Q38 108 55 110 Q72 108 80 95 Q82 80 78 62 Q65 56 55 56 Q45 56 32 62Z" fill="#2a6830"/>
      <!-- Sobreposição da túnica mais clara -->
      <path d="M40 62 Q36 78 38 92 Q46 104 55 106 Q64 104 72 92 Q74 78 70 62 Q63 58 55 58 Q47 58 40 62Z" fill="#348a3a"/>
      <!-- Faixas da túnica -->
      <rect x="50" y="62" width="10" height="44" rx="3" fill="#2a6830" opacity="0.5"/>
      <!-- Colete de couro marrom por cima -->
      <path d="M38 62 Q36 75 38 86 Q44 94 55 95 Q66 94 72 86 Q74 75 72 62 Q64 58 55 58 Q46 58 38 62Z" fill="none" stroke="#7a4a22" stroke-width="2"/>
      <path d="M46 62 Q44 76 46 88" stroke="#5a3518" stroke-width="1.5" fill="none"/>
      <path d="M64 62 Q66 76 64 88" stroke="#5a3518" stroke-width="1.5" fill="none"/>
      <!-- Fivela do colete -->
      <rect x="50" y="74" width="10" height="8" rx="2" fill="#c88030"/>
      <rect x="52" y="76" width="6" height="4" rx="1" fill="#8a5020"/>
      <!-- Alça da aljava no ombro esquerdo -->
      <path d="M68 58 Q74 65 76 80 Q78 90 76 100" stroke="#5a3518" stroke-width="4" fill="none" stroke-linecap="round"/>
      <!-- Aljava nas costas (ombro esquerdo) -->
      <rect x="72" y="52" width="12" height="22" rx="4" fill="#6a4020"/>
      <!-- Flechas na aljava -->
      <line x1="76" y1="52" x2="74" y2="42" stroke="#8a6030" stroke-width="2"/>
      <line x1="79" y1="52" x2="77" y2="41" stroke="#8a6030" stroke-width="2"/>
      <line x1="82" y1="52" x2="81" y2="41" stroke="#8a6030" stroke-width="2"/>
      <polygon points="74,42 72,39 76,39" fill="#d0d8d0"/>
      <polygon points="77,41 75,38 79,38" fill="#d0d8d0"/>
      <polygon points="81,41 79,38 83,38" fill="#d0d8d0"/>
      <!-- Penas nas flechas -->
      <path d="M73 44 Q71 42 73 40" stroke="#8a8a60" stroke-width="1.5" fill="none"/>
      <path d="M76 43 Q74 41 76 39" stroke="#8a8a60" stroke-width="1.5" fill="none"/>
      <!-- Cabeça -->
      <ellipse cx="55" cy="38" rx="19" ry="20" fill="#e8c898"/>
      <!-- Cabelo loiro espetado -->
      <path d="M36 32 Q38 15 55 12 Q72 15 74 32 Q68 20 55 19 Q42 20 36 32Z" fill="#e8c030"/>
      <path d="M37 28 Q35 18 40 14 Q37 22 40 26Z" fill="#d4b020"/>
      <path d="M73 28 Q75 18 70 14 Q73 22 70 26Z" fill="#d4b020"/>
      <path d="M42 15 Q44 8 48 12 Q45 10 44 16Z" fill="#e8c030"/>
      <path d="M55 12 Q57 5 62 10 Q59 7 58 14Z" fill="#d4b020"/>
      <!-- Orelha pontuda de elfo -->
      <polygon points="36,36 25,28 35,44" fill="#e8c898"/>
      <polygon points="74,36 85,28 75,44" fill="#e8c898"/>
      <polygon points="36,36 27,30 36,42" fill="#d4a878"/>
      <polygon points="74,36 83,30 74,42" fill="#d4a878"/>
      <!-- Olhos verdes -->
      <ellipse cx="47" cy="38" rx="4.5" ry="4.5" fill="#228830"/>
      <ellipse cx="63" cy="38" rx="4.5" ry="4.5" fill="#228830"/>
      <circle cx="47" cy="38" r="2.5" fill="#0a1a08"/>
      <circle cx="63" cy="38" r="2.5" fill="#0a1a08"/>
      <circle cx="48" cy="37" r="1.1" fill="white"/>
      <circle cx="64" cy="37" r="1.1" fill="white"/>
      <!-- Sobrancelhas sérias -->
      <path d="M43 33 Q47 31 51 33" stroke="#8a6030" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M59 33 Q63 31 67 33" stroke="#8a6030" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <!-- Nariz -->
      <path d="M53 42 Q55 45 57 42" stroke="#c09060" stroke-width="1.2" fill="none"/>
      <!-- Boca séria -->
      <path d="M48 47 Q55 50 62 47" stroke="#9a6040" stroke-width="1.5" fill="none"/>
      <!-- Broche no pescoço (verde com ouro) -->
      <circle cx="55" cy="58" r="4" fill="#1a6a30"/>
      <circle cx="55" cy="58" r="2.5" fill="#228840"/>
      <circle cx="55" cy="58" r="1.2" fill="#30aa50"/>
      <path d="M51 58 Q55 54 59 58 Q55 62 51 58Z" fill="none" stroke="#c8a030" stroke-width="1"/>
      <!-- BRAÇO ESQUERDO (puxando a corda do arco) — estendido para esquerda -->
      <path d="M38 68 Q22 72 12 72" stroke="#2a6830" stroke-width="9" fill="none" stroke-linecap="round"/>
      <ellipse cx="12" cy="72" rx="5" ry="5" fill="#e8c898"/>
      <!-- BRAÇO DIREITO segurando o arco — estendido para direita -->
      <path d="M72 68 Q86 68 97 72" stroke="#2a6830" stroke-width="9" fill="none" stroke-linecap="round"/>
      <ellipse cx="97" cy="72" rx="5" ry="5" fill="#e8c898"/>
      <!-- ARCo marrom -->
      <path d="M97 40 Q118 72 97 104" stroke="#6a3a18" stroke-width="5" fill="none"/>
      <!-- Corda do arco -->
      <line x1="97" y1="40" x2="97" y2="104" stroke="#d8c8a0" stroke-width="1.5"/>
      <!-- FLECHA -->
      <line x1="97" y1="72" x2="15" y2="72" stroke="#9a6a30" stroke-width="2.5"/>
      <!-- Ponta da flecha -->
      <polygon points="15,72 22,68 22,76" fill="#c0c8d0"/>
      <!-- Penas da flecha -->
      <path d="M94 69 Q98 65 95 62" stroke="#8a8060" stroke-width="2" fill="none"/>
      <path d="M94 75 Q98 79 95 82" stroke="#8a8060" stroke-width="2" fill="none"/>
    </svg>`,

    // ── MAGO — elder wizard, blue robe with gold trim, star hat, glowing staff
    mago: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 145" width="100" height="145">
      <!-- MANTO — base larga -->
      <path d="M18 78 Q14 108 16 130 Q22 142 50 143 Q78 142 84 130 Q86 108 82 78 Q70 70 50 68 Q30 70 18 78Z" fill="#1e2e78"/>
      <!-- Borda dourada do manto -->
      <path d="M18 78 Q14 108 16 130 Q22 142 50 143" fill="none" stroke="#c8a030" stroke-width="2.5"/>
      <path d="M82 78 Q86 108 84 130 Q78 142 50 143" fill="none" stroke="#c8a030" stroke-width="2.5"/>
      <!-- Frente do manto — detalhe central dourado -->
      <line x1="50" y1="70" x2="50" y2="143" stroke="#c8a030" stroke-width="2.5"/>
      <!-- Cinto marrom -->
      <rect x="30" y="92" width="40" height="8" rx="4" fill="#7a4e22"/>
      <rect x="44" y="91" width="12" height="10" rx="3" fill="#9a6828"/>
      <!-- Corpo — robe azul escuro -->
      <rect x="30" y="65" width="40" height="32" rx="8" fill="#243280"/>
      <!-- Borda dourada nas mangas -->
      <rect x="28" y="90" width="14" height="6" rx="3" fill="#243280" stroke="#c8a030" stroke-width="1.5"/>
      <rect x="58" y="90" width="14" height="6" rx="3" fill="#243280" stroke="#c8a030" stroke-width="1.5"/>
      <!-- Cabeça — rosto de velho sábio -->
      <ellipse cx="50" cy="46" rx="18" ry="20" fill="#e0b888"/>
      <!-- Barba branca volumosa -->
      <path d="M33 54 Q30 65 32 74 Q38 80 50 82 Q62 80 68 74 Q70 65 67 54 Q60 58 50 60 Q40 58 33 54Z" fill="#e8e8e8"/>
      <!-- Detalhes da barba (listras) -->
      <path d="M38 58 Q42 70 44 78" stroke="#c8c8c8" stroke-width="1" fill="none"/>
      <path d="M50 60 Q50 72 50 80" stroke="#c8c8c8" stroke-width="1" fill="none"/>
      <path d="M62 58 Q58 70 56 78" stroke="#c8c8c8" stroke-width="1" fill="none"/>
      <!-- Bigode branco -->
      <path d="M40 56 Q50 60 60 56" fill="#e8e8e8" stroke="#c8c8c8" stroke-width="0.5"/>
      <!-- Olhos castanhos sábios -->
      <ellipse cx="43" cy="44" rx="4" ry="3.5" fill="white"/>
      <ellipse cx="57" cy="44" rx="4" ry="3.5" fill="white"/>
      <circle cx="43" cy="44" r="2.2" fill="#5a3a18"/>
      <circle cx="57" cy="44" r="2.2" fill="#5a3a18"/>
      <circle cx="44" cy="43" r="0.9" fill="white"/>
      <circle cx="58" cy="43" r="0.9" fill="white"/>
      <!-- Sobrancelhas brancas grossas -->
      <path d="M39 40 Q43 37 47 39" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M53 39 Q57 37 61 40" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- Nariz grande de velho -->
      <path d="M47 47 Q50 52 53 47 Q52 51 50 52 Q48 51 47 47Z" fill="#c8906a"/>
      <!-- Orelhas -->
      <ellipse cx="32" cy="46" rx="5" ry="7" fill="#e0b888"/>
      <ellipse cx="68" cy="46" rx="5" ry="7" fill="#e0b888"/>
      <!-- CHAPÉU DE MAGO — azul com estrelas douradas -->
      <path d="M32 36 Q50 -8 68 36 Q60 28 50 26 Q40 28 32 36Z" fill="#1a2468"/>
      <ellipse cx="50" cy="36" rx="22" ry="7" fill="#1e2e88"/>
      <!-- Borda dourada do chapéu -->
      <ellipse cx="50" cy="36" rx="22" ry="7" fill="none" stroke="#c8a030" stroke-width="2"/>
      <!-- Estrelas no chapéu -->
      <text x="44" y="22" font-size="9" fill="#c8a030">★</text>
      <text x="52" y="14" font-size="7" fill="#c8a030">★</text>
      <text x="38" y="32" font-size="6" fill="#c8a030">★</text>
      <text x="57" y="30" font-size="6" fill="#c8a030">★</text>
      <!-- CAJADO — madeira com orbe azul brilhante -->
      <rect x="20" y="52" width="6" height="72" rx="3" fill="#7a5228"/>
      <!-- Nó no cajado -->
      <ellipse cx="23" cy="74" rx="5" ry="4" fill="#6a4418"/>
      <ellipse cx="23" cy="100" rx="5" ry="4" fill="#6a4418"/>
      <!-- Orbe no topo -->
      <circle cx="23" cy="48" r="12" fill="#0a1858" opacity="0.4"/>
      <circle cx="23" cy="48" r="9" fill="#1030a8"/>
      <circle cx="23" cy="48" r="6" fill="#2060e8"/>
      <circle cx="23" cy="48" r="3.5" fill="#60a0ff"/>
      <circle cx="21" cy="46" r="1.8" fill="white" opacity="0.9"/>
      <!-- Brilho externo do orbe -->
      <circle cx="23" cy="48" r="14" fill="none" stroke="#4080ff" stroke-width="1" opacity="0.5"/>
      <!-- Braço esquerdo (segurando cajado) -->
      <path d="M30 72 Q22 78 22 90" stroke="#1e2e78" stroke-width="8" fill="none" stroke-linecap="round"/>
      <!-- Braço direito (solto) -->
      <path d="M70 72 Q78 78 80 88" stroke="#1e2e78" stroke-width="8" fill="none" stroke-linecap="round"/>
      <!-- Mão direita -->
      <ellipse cx="80" cy="90" rx="5" ry="5" fill="#e0b888"/>
    </svg>`,

    // ── TANK — pixel-art armored knight, silver armor, sword + kite shield ───
    tank: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 140" width="110" height="140">
      <!-- ESCUDO — lado esquerdo (direito na imagem) -->
      <path d="M10 50 L10 90 Q10 108 26 112 L26 50Z" fill="#3a4858"/>
      <path d="M10 50 L26 50 L26 112 Q10 108 10 90Z" fill="#4a5a6a"/>
      <!-- Borda do escudo -->
      <path d="M10 50 L10 90 Q10 108 26 112 L26 50 Z" fill="none" stroke="#8a9aaa" stroke-width="2"/>
      <!-- Emblema do leão no escudo -->
      <ellipse cx="18" cy="78" rx="7" ry="9" fill="#2a3848"/>
      <path d="M14 72 Q18 68 22 72 Q24 76 22 80 Q18 84 14 80 Q12 76 14 72Z" fill="#5a6a7a" opacity="0.6"/>
      <text x="13" y="82" font-size="9" fill="#7a8a9a">🦁</text>
      <!-- PERNAS — armadura de placas -->
      <rect x="34" y="98" width="19" height="28" rx="5" fill="#6a7888"/>
      <rect x="58" y="98" width="19" height="28" rx="5" fill="#6a7888"/>
      <!-- Joelheiras -->
      <ellipse cx="43" cy="102" rx="9" ry="6" fill="#8a9aaa"/>
      <ellipse cx="67" cy="102" rx="9" ry="6" fill="#8a9aaa"/>
      <!-- Botas de aço -->
      <rect x="32" y="120" width="22" height="16" rx="5" fill="#5a6878"/>
      <rect x="56" y="120" width="22" height="16" rx="5" fill="#5a6878"/>
      <ellipse cx="43" cy="135" rx="13" ry="5" fill="#3a4858"/>
      <ellipse cx="67" cy="135" rx="13" ry="5" fill="#3a4858"/>
      <!-- SAIOTE metálico (sobre as pernas) -->
      <path d="M30 94 Q28 112 32 122 Q38 128 43 126 Q48 120 50 112 Q52 120 57 126 Q62 128 68 122 Q72 112 70 94Z" fill="#5a6878"/>
      <path d="M30 94 Q50 88 70 94" stroke="#8a9aaa" stroke-width="1.5" fill="none"/>
      <!-- PEITORAL — armadura completa -->
      <path d="M26 55 Q22 68 24 82 Q28 94 50 96 Q72 94 76 82 Q78 68 74 55 Q62 48 50 47 Q38 48 26 55Z" fill="#7a8898"/>
      <!-- Divisor central do peitoral -->
      <line x1="50" y1="50" x2="50" y2="96" stroke="#5a6878" stroke-width="2.5"/>
      <!-- Detalhes do peitoral -->
      <path d="M26 65 Q50 60 74 65" stroke="#9aabb8" stroke-width="1.5" fill="none"/>
      <path d="M28 78 Q50 73 72 78" stroke="#9aabb8" stroke-width="1.5" fill="none"/>
      <!-- Ombros grandes arredondados -->
      <ellipse cx="24" cy="60" rx="12" ry="10" fill="#8a9aaa"/>
      <ellipse cx="76" cy="60" rx="12" ry="10" fill="#8a9aaa"/>
      <!-- Detalhes dos ombros -->
      <ellipse cx="24" cy="58" rx="8" ry="6" fill="#9aaabb"/>
      <ellipse cx="76" cy="58" rx="8" ry="6" fill="#9aaabb"/>
      <!-- CABEÇA com elmo completo -->
      <ellipse cx="50" cy="40" rx="22" ry="22" fill="#e0d0b0"/>
      <!-- Elmo de aço completo -->
      <path d="M28 40 Q28 15 50 12 Q72 15 72 40 Q66 30 50 28 Q34 30 28 40Z" fill="#6a7888"/>
      <!-- Lateral do elmo -->
      <path d="M28 38 Q26 50 30 58 Q34 48 34 38Z" fill="#5a6878"/>
      <path d="M72 38 Q74 50 70 58 Q66 48 66 38Z" fill="#5a6878"/>
      <!-- Viseira central -->
      <rect x="32" y="36" width="36" height="14" rx="4" fill="#4a5868"/>
      <!-- Abertura dos olhos na viseira -->
      <rect x="35" y="38" width="12" height="5" rx="2" fill="#2a3848"/>
      <rect x="53" y="38" width="12" height="5" rx="2" fill="#2a3848"/>
      <!-- Brilho dos olhos na viseira -->
      <ellipse cx="41" cy="40.5" rx="4" ry="2" fill="#e0f8ff" opacity="0.8"/>
      <ellipse cx="59" cy="40.5" rx="4" ry="2" fill="#e0f8ff" opacity="0.8"/>
      <!-- Crista do elmo — vermelha -->
      <path d="M36 16 Q50 8 64 16 Q60 12 50 10 Q40 12 36 16Z" fill="#c03020"/>
      <path d="M40 15 Q50 6 60 15 Q55 10 50 9 Q45 10 40 15Z" fill="#e04030"/>
      <!-- Nasal (proteção do nariz) -->
      <rect x="48" y="36" width="4" height="16" rx="2" fill="#5a6878"/>
      <!-- ESPADA — segurada na mão direita -->
      <rect x="80" y="28" width="6" height="60" rx="3" fill="#c0ccd8"/>
      <!-- Reflexo da espada -->
      <rect x="82" y="30" width="2" height="56" rx="1" fill="#e0ecf8" opacity="0.7"/>
      <!-- Guarda da espada (cruciforme) -->
      <rect x="72" y="58" width="22" height="5" rx="2.5" fill="#c8a030"/>
      <!-- Punho da espada -->
      <rect x="81" y="63" width="5" height="14" rx="2" fill="#7a4a20"/>
      <!-- Pomo da espada -->
      <ellipse cx="83" cy="78" rx="5" ry="4" fill="#c8a030"/>
      <!-- BRAÇO DIREITO (segurando espada) -->
      <path d="M74 68 Q82 64 84 58" stroke="#7a8898" stroke-width="9" fill="none" stroke-linecap="round"/>
      <!-- BRAÇO ESQUERDO (segurando escudo) -->
      <path d="M26 68 Q18 72 16 80" stroke="#7a8898" stroke-width="9" fill="none" stroke-linecap="round"/>
    </svg>`
  };
  // Inimigos e fallback usam emoji
  return SVG[key] || `<span style="font-size:clamp(80px,12vw,120px);line-height:1">${key}</span>`;
}
function showScreen(el) {
  [setup, shop, battle, between, result].forEach(s => s.classList.remove("active"));
  el.classList.add("active");
}

// ── Moedas (persistente) ─────────────────────────────────────
function getCoins()          { return parseInt(localStorage.getItem("d20Coins") || "0"); }
function addCoins(amount)    { saveCoins(getCoins() + amount); }
function saveCoins(n)        { localStorage.setItem("d20Coins", Math.max(0, n)); renderWallet(); }
function renderWallet() {
  const c = getCoins();
  if ($("walletDisplay")) $("walletDisplay").textContent = c;
  if ($("shopWallet"))    $("shopWallet").textContent = c;
  if ($("battleWallet"))  $("battleWallet").textContent = c;
}

// ── Ranking ──────────────────────────────────────────────────
function getRank() { return JSON.parse(localStorage.getItem("d20Rank") || "[]"); }
function saveRank(nick) {
  const rank = getRank();
  const existing = rank.find(x => x.name.toLowerCase() === nick.toLowerCase());
  if (existing) existing.wins += 1; else rank.push({ name: nick, wins: 1 });
  rank.sort((a, b) => b.wins - a.wins);
  localStorage.setItem("d20Rank", JSON.stringify(rank.slice(0, 10)));
  renderRank();
}
function renderRank() {
  $("rankList").innerHTML = getRank().length
    ? getRank().map((x, i) => `<div class="rank-row"><span>${i+1}.</span><b>${escapeHtml(x.name)}</b><strong>${x.wins} 🏆</strong></div>`).join("")
    : `<div class="empty-rank">Nenhuma vitória ainda.<br>Seja o primeiro!</div>`;
}

// ── Gear (equipamentos persistentes) ────────────────────────
function saveGear()    { localStorage.setItem("d20Gear", JSON.stringify(state.gear)); }
function loadGear()    { state.gear = JSON.parse(localStorage.getItem("d20Gear") || "[]"); }
function loseGear()    { state.gear = []; saveGear(); renderGearPreview(); }

// ── Checkpoint da torre ──────────────────────────────────────
function getTowerCheckpoint() { return parseInt(localStorage.getItem("d20TowerCheckpoint") || "0"); }
function saveTowerCheckpoint(floor) { localStorage.setItem("d20TowerCheckpoint", floor); }
function resetTowerCheckpoint()     { localStorage.setItem("d20TowerCheckpoint", "0"); }

// Quantidade já comprada de um item (gear + consumáveis)
function ownedCount(itemId) {
  const item = SHOP_CATALOG[itemId];
  if (!item) return 0;
  if (item.consumable) {
    if (itemId === "super_potion") return parseInt(localStorage.getItem("d20SuperPotions") || "0");
    if (itemId === "potion_epic")  return parseInt(localStorage.getItem("d20EpicPotions")  || "0");
  }
  return state.gear.filter(id => id === itemId).length;
}

// Calcula stats totais do gear
function gearStats() {
  let bonusDano = 0, defense = 0, hp = 0, diceBonus = 0, magicBonus = 0;
  for (const id of state.gear) {
    const item = SHOP_CATALOG[id];
    if (!item) continue;
    bonusDano  += item.bonusDano;
    defense    += item.defense;
    hp         += item.hp;
    diceBonus  += item.diceBonus;
    magicBonus += item.magicBonus || 0;
  }
  return { bonusDano, defense, hp, diceBonus, magicBonus };
}

function renderGearPreview() {
  const el = $("gearPreview");
  if (!el) return;
  const stats = gearStats();
  const items = [...new Set(state.gear)].map(id => {
    const item = SHOP_CATALOG[id];
    const qty = state.gear.filter(g => g === id).length;
    return `<span class="gear-tag rarity-${item.rarity}">${item.icon} ${item.name}${qty > 1 ? ` x${qty}` : ""}</span>`;
  });
  el.innerHTML = state.gear.length
    ? `<div class="gear-label">🧙 EQUIPAMENTOS ATIVOS</div>
       <div class="gear-tags">${items.join("")}</div>
       <div class="gear-stats-line">
         ${stats.bonusDano  ? `⚔️ +${stats.bonusDano} dano` : ""}
         ${stats.defense    ? `🛡️ +${stats.defense} def` : ""}
         ${stats.hp         ? `❤️ +${stats.hp} HP` : ""}
         ${stats.diceBonus  ? `🎲 +${stats.diceBonus} dado` : ""}
         ${stats.magicBonus ? `✨ +${stats.magicBonus} magia` : ""}
       </div>`
    : `<div class="gear-empty">Sem equipamentos. Visite a Loja!</div>`;
}

function renderGearStatsPanel() {
  const el = $("gearStatsPanel");
  if (!el) return;
  const s = gearStats();
  if (!state.towerActive || state.mode !== "pve") { el.innerHTML = ""; return; }
  const parts = [];
  if (s.bonusDano)  parts.push(`⚔️ +${s.bonusDano}`);
  if (s.defense)    parts.push(`🛡️ +${s.defense}`);
  if (s.hp)         parts.push(`❤️ +${s.hp}`);
  if (s.diceBonus)  parts.push(`🎲 +${s.diceBonus}`);
  if (s.magicBonus) parts.push(`✨ +${s.magicBonus} magia`);
  el.innerHTML = parts.length
    ? `<div class="gear-hud">${parts.join("  ")}</div>`
    : "";
}

// ── Torre — preview no setup ─────────────────────────────────
function renderTowerSteps() {
  const el = $("towerSteps");
  if (!el) return;
  el.innerHTML = TOWER_ENEMIES.map((e, i) => {
    const cls = i === state.towerFloor && state.towerActive ? "active"
              : i < state.towerFloor && state.towerActive   ? "done" : "";
    return `<div class="tower-step ${cls} ${e.isBoss ? "boss" : ""}">
      <span class="ts-icon">${e.icon}</span>
      <span class="ts-name">${e.isBoss ? "⚡ " : ""}${e.nome}</span>
      <span class="ts-reward">🪙${e.reward}</span>
    </div>`;
  }).join("");
}

function renderTowerProgress() {
  const el = $("towerProgress");
  if (!el) return;
  if (!state.towerActive || state.mode !== "pve") { el.classList.add("hidden"); return; }
  el.classList.remove("hidden");
  el.innerHTML = TOWER_ENEMIES.map((e, i) => {
    const cls = i <  state.towerFloor ? "tp-done"
              : i === state.towerFloor ? "tp-active" : "tp-next";
    return `<div class="tp-step ${cls} ${e.isBoss ? "tp-boss" : ""}" title="${e.nome}">${e.icon}</div>`;
  }).join('<div class="tp-arrow">›</div>');
}

// ── Loja ─────────────────────────────────────────────────────
function openShop() {
  state.shopReturnScreen = "setup";
  renderShopUI();
  showScreen(shop);
}
function openShopFromBattle() {
  state.shopReturnScreen = "between";
  renderShopUI();
  showScreen(shop);
}
function closeShop() {
  renderGearPreview();
  if (state.shopReturnScreen === "between") {
    showScreen(between);
  } else {
    showScreen(setup);
    renderTowerSteps();
  }
}

function renderShopUI() {
  renderWallet();
  const coins = getCoins();

  // Render equipped list
  const el = $("equippedList");
  const stats = gearStats();
  if (state.gear.length === 0) {
    el.innerHTML = `<div class="equipped-empty">Nenhum equipamento comprado ainda.</div>`;
  } else {
    const grouped = {};
    for (const id of state.gear) grouped[id] = (grouped[id] || 0) + 1;
    el.innerHTML = Object.entries(grouped).map(([id, qty]) => {
      const item = SHOP_CATALOG[id];
      return `<div class="equipped-tag rarity-${item.rarity}">${item.icon} ${item.name}${qty > 1 ? ` ×${qty}` : ""}</div>`;
    }).join("");
    el.innerHTML += `<div class="equipped-stats">
      ${stats.bonusDano  ? `⚔️ <b>+${stats.bonusDano}</b> dano  ` : ""}
      ${stats.defense    ? `🛡️ <b>+${stats.defense}</b> def  ` : ""}
      ${stats.hp         ? `❤️ <b>+${stats.hp}</b> HP  ` : ""}
      ${stats.diceBonus  ? `🎲 <b>+${stats.diceBonus}</b> dado  ` : ""}
      ${stats.magicBonus ? `✨ <b>+${stats.magicBonus}</b> magia (Mago)  ` : ""}
    </div>`;
  }

  // Enable/disable buy buttons — respect maxStack limits
  document.querySelectorAll(".shop-buy-btn").forEach(btn => {
    const itemId  = btn.closest(".shop-item")?.dataset.item;
    if (!itemId) return;
    const item = SHOP_CATALOG[itemId];
    if (!item) return;
    const owned    = ownedCount(itemId);
    const maxStack = item.maxStack ?? 99;
    const capped   = owned >= maxStack;
    btn.disabled = capped || coins < item.cost;
    if (capped)               btn.textContent = `✓ ${owned}/${maxStack}`;
    else if (coins < item.cost) btn.textContent = "🪙 " + item.cost;
    else                      btn.textContent = "COMPRAR";
  });
}

function buyItem(itemId) {
  const item = SHOP_CATALOG[itemId];
  if (!item) return;
  const coins = getCoins();
  if (coins < item.cost) return;

  const maxStack = item.maxStack ?? 99;
  if (ownedCount(itemId) >= maxStack) return; // já no limite

  saveCoins(coins - item.cost);

  if (item.consumable) {
    if (itemId === "super_potion") {
      state.superPotions = (state.superPotions || 0) + 1;
      localStorage.setItem("d20SuperPotions", state.superPotions);
    } else {
      state.epicPotions = (state.epicPotions || 0) + 1;
      localStorage.setItem("d20EpicPotions", state.epicPotions);
    }
  } else {
    state.gear.push(itemId);
    saveGear();
  }

  renderShopUI();
  showItem(`✅ ${item.name} comprada!`);
}

// ── Seleção de modo no setup ─────────────────────────────────
function selectMode(mode) {
  state.mode = mode;
  $("modePve").classList.toggle("active", mode === "pve");
  $("modePvp").classList.toggle("active", mode === "pvp");
  $("pveSetup").classList.toggle("hidden", mode !== "pve");
  $("pvpSetup").classList.toggle("hidden", mode !== "pvp");
}

// ── Seleção de personagem ────────────────────────────────────
document.querySelectorAll(".character-card").forEach(card => {
  card.addEventListener("click", () => {
    const mode   = card.dataset.mode;
    const player = card.dataset.player;

    if (mode === "pve") { startTower(player); return; }

    const slot = card.dataset.slot;
    const col  = card.closest(".pvp-player-col");
    col.querySelectorAll(".character-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    if (slot === "1") state.pvp1Choice = player;
    else              state.pvp2Choice = player;
  });
});

// ── Iniciar Torre PvE ────────────────────────────────────────
function startTower(choice) {
  const nickname = $("nickname").value.trim();
  if (!nickname) {
    $("nickname").focus();
    $("nickname").classList.add("shake");
    setTimeout(() => $("nickname").classList.remove("shake"), 450);
    return;
  }

  // Calcular HP max com gear + base da classe
  const stats   = gearStats();
  const baseHp  = (charData[choice] && charData[choice].baseHp) || 100;
  const maxHp   = baseHp + stats.hp;

  // Carregar consumíveis salvos
  state.epicPotions  = parseInt(localStorage.getItem("d20EpicPotions")  || "0");
  state.superPotions = parseInt(localStorage.getItem("d20SuperPotions") || "0");

  // Resumir do checkpoint se existir
  const checkpoint = getTowerCheckpoint();

  Object.assign(state, {
    towerActive: true,
    towerFloor: checkpoint,          // começa do checkpoint (ou 0)
    towerChoice: choice,
    towerPlayerHp: maxHp,            // HP sempre reseta ao iniciar
    towerMaxHp: maxHp,
    nickname
  });

  _launchTowerFight();
}

function _launchTowerFight() {
  const floor   = state.towerFloor;
  const tpl     = TOWER_ENEMIES[floor];
  const stats   = gearStats();

  // Scale enemy per floor: HP and damage grow
  const scale   = 1 + floor * 0.22;
  const enemyHp = Math.round(tpl.baseHp * scale);
  const enemyBonusDano = Math.round(tpl.baseDano + floor * 0.5);

  const charKey = state.towerChoice;
  const cd      = charData[charKey];
  const player  = {
    ...cd,
    hp: state.towerPlayerHp,
    bonusDano: (cd.baseBonusDano || 0) + stats.bonusDano,
    defense:   (cd.baseDefense   || 0) + stats.defense,
    diceBonus: (cd.baseDiceBonus || 0) + stats.diceBonus,
    magicBonus:(cd.baseMagicBonus|| 0) + stats.magicBonus,
    charClass: charKey
  };
  const enemy = {
    nome:     tpl.nome,
    icon:     tpl.icon,
    hp:       enemyHp,
    maxHp:    enemyHp,
    bonusDano: enemyBonusDano,
    defense:  tpl.defense + Math.floor(floor * 0.5),
    isBoss:   tpl.isBoss
  };

  _startBattle({
    mode: "pve",
    player,
    enemy,
    nickname: state.nickname,
    nick2: tpl.nome,
    userTurn: true
  });
}

function nextTowerFight() {
  state.towerFloor++;
  if (state.towerFloor >= TOWER_ENEMIES.length) {
    _towerComplete();
    return;
  }
  _launchTowerFight();
}

// Chamado quando player escolhe SAIR no checkpoint (andar 5)
function leaveTowerAtCheckpoint() {
  saveTowerCheckpoint(CHECKPOINT_FLOOR + 1); // salva: próxima vez começa no andar 6
  state.towerActive = false;
  showScreen(result);
  $("resultIcon").textContent  = "🏅";
  $("resultTitle").textContent = "Checkpoint Salvo!";
  $("resultText").textContent  = `${state.nickname} derrotou a Hidra das Sombras! Progresso salvo no Andar 6.`;
  $("resultCoins").innerHTML   = `<span class="coins-earned">Volte para continuar do Andar 6!</span>`;
}

function _towerComplete() {
  resetTowerCheckpoint();          // zerou a torre — apaga checkpoint
  state.towerActive = false;
  saveRank(state.nickname);
  showScreen(result);
  $("resultIcon").textContent    = "🏆";
  $("resultTitle").textContent   = "Torre Conquistada!";
  $("resultText").textContent    = `${state.nickname} derrotou todos os 10 guardiões da Floresta!`;
  $("resultCoins").innerHTML     = `<span class="coins-earned">🏆 Você é o mestre da Floresta dos Dados!</span>`;
}

// ── Iniciar PvP ──────────────────────────────────────────────
function startPvP() {
  const nick1 = $("nickname1").value.trim();
  const nick2 = $("nickname2").value.trim();
  if (!nick1) { $("nickname1").focus(); $("nickname1").classList.add("shake"); setTimeout(() => $("nickname1").classList.remove("shake"), 450); return; }
  if (!nick2) { $("nickname2").focus(); $("nickname2").classList.add("shake"); setTimeout(() => $("nickname2").classList.remove("shake"), 450); return; }
  if (!state.pvp1Choice) { alert("Jogador 1 precisa escolher um personagem!"); return; }
  if (!state.pvp2Choice) { alert("Jogador 2 precisa escolher um personagem!"); return; }

  const cd1 = charData[state.pvp1Choice];
  const cd2 = charData[state.pvp2Choice];
  state.towerActive = false;
  _startBattle({
    mode: "pvp",
    player: { ...cd1, hp: cd1.baseHp || 100, bonusDano: cd1.baseBonusDano || 0, defense: cd1.baseDefense || 0, diceBonus: cd1.baseDiceBonus || 0, magicBonus: cd1.baseMagicBonus || 0, charClass: state.pvp1Choice },
    enemy:  { ...cd2, hp: cd2.baseHp || 100, bonusDano: cd2.baseBonusDano || 0, defense: cd2.baseDefense || 0, diceBonus: cd2.baseDiceBonus || 0, magicBonus: cd2.baseMagicBonus || 0, charClass: state.pvp2Choice },
    nickname: nick1,
    nick2,
    userTurn: true
  });
}

// ── Dados de cada classe ─────────────────────────────────────
const charData = {
  goblin: {
    nome: "Gobblin", icon: "👺",
    baseHp: 100, baseBonusDano: 2, baseDefense: 0, baseDiceBonus: 0, baseMagicBonus: 0
  },
  hunter: {
    nome: "Hunter",  icon: "🏹",
    baseHp: 100, baseBonusDano: 0, baseDefense: 0, baseDiceBonus: 1, baseMagicBonus: 0
  },
  mago: {
    nome: "Mago",    icon: "🧙",
    baseHp: 85,  baseBonusDano: 0, baseDefense: 0, baseDiceBonus: 0, baseMagicBonus: 3
  },
  tank: {
    nome: "Tank",    icon: "🛡️",
    baseHp: 130, baseBonusDano: 0, baseDefense: 3, baseDiceBonus: 0, baseMagicBonus: 0
  }
};

function _startBattle({ mode, player, enemy, nickname, nick2, userTurn }) {
  Object.assign(state, {
    mode, player, enemy, nickname, nick2,
    shield: 0, potion: 0, powder: 0,
    playerShielded: false, playerBlind: 0,
    eShield: 0, ePotion: 0, ePowder: 0,
    enemyShielded: false, enemyBlind: 0,
    userTurn, busy: false, over: false
  });

  // Consumíveis do shop ficam disponíveis em batalha PvE
  if (mode === "pve") {
    state.epicPotions  = parseInt(localStorage.getItem("d20EpicPotions")  || "0");
    state.superPotions = parseInt(localStorage.getItem("d20SuperPotions") || "0");
  } else {
    state.epicPotions  = 0;
    state.superPotions = 0;
  }

  $("playerName").textContent   = player.nome;
  $("enemyName").textContent    = enemy.nome;
  $("playerArt").innerHTML      = charSvg(player.charClass || player.icon);
  $("enemyArt").innerHTML       = charSvg(enemy.charClass  || enemy.icon);
  $("battleNickname").textContent = nickname;

  // Health bars: HP máximo do inimigo para a barra
  state.enemy.maxHp = enemy.maxHp || enemy.hp;
  state.player.maxHp = mode === "pve" ? state.towerMaxHp : (player.baseHp || 100);

  $("inventoryOwnerLabel").textContent  = mode === "pvp" ? escapeHtml(nickname) : "SEU";
  $("enemyInventoryLabel").textContent  = mode === "pvp" ? escapeHtml(nick2)    : "INIMIGO";
  $("enemyInventory").classList.toggle("hidden", mode === "pvp");

  const isBoss = enemy.isBoss;
  $("logEntries").innerHTML = mode === "pvp"
    ? `<p>⚔ <b>${escapeHtml(nickname)}</b> vs <b>${escapeHtml(nick2)}</b> — O duelo começa!</p>`
    : `<p>${isBoss ? "🐉" : (enemy.isSemiBoss ? "🐲" : "⚔")} <b>${escapeHtml(nickname)}</b> enfrenta <b>${enemy.nome}</b>${isBoss ? " — O BOSS FINAL!" : (enemy.isSemiBoss ? " — SEMI-BOSS!" : ` (Andar ${state.towerFloor + 1}/10)`)}</p>`;

  renderTowerProgress();
  renderGearStatsPanel();
  showScreen(battle);
  updateUI();
  startTurnTimer();
}

function showSetup() {
  clearTurnTimer();
  state.towerActive = false;
  state.pvp1Choice  = null;
  state.pvp2Choice  = null;
  document.querySelectorAll(".character-card.selected").forEach(c => c.classList.remove("selected"));
  renderRank();
  renderWallet();
  renderGearPreview();
  renderTowerSteps();
  showScreen(setup);
}

// ── Temporizador de turno ─────────────────────────────────────
const TURN_SECONDS = 20;
let _timerInterval = null;
let _timerStart    = 0;

function startTurnTimer() {
  clearTurnTimer();
  if (state.over) return;
  // Only run timer on a human turn:
  // PvE → only when userTurn=true (player's turn; enemy acts automatically)
  // PvP → always (both players are human)
  const isHumanTurn = state.userTurn || state.mode === "pvp";
  if (!isHumanTurn) return;

  _timerStart = Date.now();
  _tickTimer();
  _timerInterval = setInterval(_tickTimer, 100);
}

function _tickTimer() {
  if (state.busy || state.over) { clearTurnTimer(); return; }
  const elapsed = (Date.now() - _timerStart) / 1000;
  const remaining = Math.max(0, TURN_SECONDS - elapsed);
  _renderTimerRing(remaining);
  if (remaining <= 0) {
    clearTurnTimer();
    _expireTurn();
  }
}

function clearTurnTimer() {
  if (_timerInterval) { clearInterval(_timerInterval); _timerInterval = null; }
  _renderTimerRing(TURN_SECONDS); // reset ring to full
}

function _renderTimerRing(remaining) {
  const el = $("turnTimer");
  if (!el) return;
  const pct = remaining / TURN_SECONDS;
  const r = 22, circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const urgent = remaining <= 5;
  const color  = urgent ? "#e05050" : remaining <= 10 ? "#f5c64a" : "#4f9b63";
  el.innerHTML = `
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r="${r}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="4"/>
      <circle cx="28" cy="28" r="${r}" fill="none" stroke="${color}" stroke-width="4"
        stroke-dasharray="${dash.toFixed(2)} ${circ.toFixed(2)}"
        stroke-linecap="round"
        transform="rotate(-90 28 28)"
        style="transition:stroke .2s"/>
    </svg>
    <span class="timer-num${urgent ? " timer-urgent" : ""}">${Math.ceil(remaining)}</span>`;
}

async function _expireTurn() {
  if (state.busy || state.over) return;
  state.busy = true;

  if (state.mode === "pvp") {
    if (state.userTurn) {
      addLog(`⏰ <b>${escapeHtml(state.nickname)}</b> demorou demais e perdeu o turno!`);
      state.userTurn = false; state.busy = false;
      addLog(`🎲 Turno de <b>${escapeHtml(state.nick2)}</b>.`);
      updateUI();
      startTurnTimer();
    } else {
      addLog(`⏰ <b>${escapeHtml(state.nick2)}</b> demorou demais e perdeu o turno!`);
      state.userTurn = true; state.busy = false;
      addLog(`🎲 Turno de <b>${escapeHtml(state.nickname)}</b>.`);
      updateUI();
      startTurnTimer();
    }
  } else {
    // PvE — only player turn has a timer
    addLog(`⏰ <b>${escapeHtml(state.nickname)}</b> demorou demais e perdeu o turno!`);
    state.userTurn = false; state.busy = false;
    updateUI();
    setTimeout(enemyAITurn, 600);
  }
}

// ── Event listeners ──────────────────────────────────────────
$("restartBtn").onclick = showSetup;
$("againBtn").onclick   = showSetup;
$("attackBtn").onclick  = p1Attack;
$("fleeBtn").onclick    = fleeAttempt;
$("shieldBtn").onclick     = () => useItem("shield");
$("potionBtn").onclick     = () => useItem("potion");
$("powderBtn").onclick     = () => useItem("powder");
$("epicPotionBtn").onclick  = () => useItem("potion_epic");
if ($("superPotionBtn")) $("superPotionBtn").onclick = () => useItem("super_potion");

$("eShieldBtn").onclick = () => { if (state.mode === "pvp" && !state.userTurn) useItemP2("shield"); };
$("ePotionBtn").onclick = () => { if (state.mode === "pvp" && !state.userTurn) useItemP2("potion"); };
$("ePowderBtn").onclick = () => { if (state.mode === "pvp" && !state.userTurn) useItemP2("powder"); };

// ── updateUI ─────────────────────────────────────────────────
function updateUI() {
  const p = Math.max(0, state.player.hp);
  const e = Math.max(0, state.enemy.hp);
  const pMax = state.player.maxHp || 100;
  const eMax = state.enemy.maxHp  || 100;

  $("playerHp").textContent  = `${p}/${pMax}`;
  $("enemyHp").textContent   = `${e}/${eMax}`;
  $("playerBar").style.width = `${(p / pMax) * 100}%`;
  $("enemyBar").style.width  = `${(e / eMax) * 100}%`;

  $("shieldCount").textContent     = state.shield;
  $("potionCount").textContent     = state.potion;
  $("powderCount").textContent     = state.powder;
  $("eShieldCount").textContent    = state.eShield;
  $("ePotionCount").textContent    = state.ePotion;
  $("ePowderCount").textContent    = state.ePowder;
  $("epicPotionCount").textContent  = state.epicPotions  || 0;
  if ($("superPotionCount")) $("superPotionCount").textContent = state.superPotions || 0;

  // Show/hide PvE-only buttons
  $("epicPotionBtn").closest(".inv-item-btn") && ($("epicPotionBtn").style.display = state.mode === "pve" ? "" : "none");
  const superBtn = $("superPotionBtn");
  if (superBtn) superBtn.closest(".inv-item-btn") && (superBtn.style.display = state.mode === "pve" ? "" : "none");

  const isPvp    = state.mode === "pvp";
  const isP1Turn = state.userTurn;

  if (isPvp) {
    const who = isP1Turn ? escapeHtml(state.nickname) : escapeHtml(state.nick2);
    $("turnBanner").innerHTML  = `⚔ Turno de <b>${who}</b> — escolha uma ação!`;
    $("turnLabel").textContent = `TURNO DE ${(isP1Turn ? state.nickname : state.nick2).toUpperCase()}`;
    $("inventoryOwnerLabel").textContent = isP1Turn ? state.nickname : state.nick2;
  } else {
    const isBoss     = state.enemy.isBoss;
    const isSemiBoss = state.enemy.isSemiBoss;
    $("turnBanner").textContent = isP1Turn
      ? `⚔ Seu turno — Andar ${state.towerFloor + 1}/10${isBoss ? " 🐉 BOSS FINAL" : isSemiBoss ? " 🐲 SEMI-BOSS" : ""}`
      : `⏳ ${state.enemy.nome} está atacando...`;
    $("turnLabel").textContent  = isP1Turn ? "SEU TURNO" : "TURNO DO INIMIGO";
    $("inventoryOwnerLabel").textContent = "SEU";
    $("enemyInventory").classList.remove("hidden");
  }

  const canActP1 = isP1Turn  && !state.busy && !state.over;
  const canActP2 = !isP1Turn && !state.busy && !state.over;

  $("attackBtn").disabled = isPvp ? (state.busy || state.over) : !canActP1;
  $("fleeBtn").disabled   = isPvp ? (state.busy || state.over) : !canActP1;
  $("actionHint").textContent = isP1Turn
    ? "Tente fugir: role 16+ para escapar, senão toma 5 de dano!"
    : (isPvp ? "Tente fugir: role 16+ para escapar!" : "Aguarde o ataque do inimigo.");

  $("shieldBtn").disabled     = !canActP1 || state.shield <= 0 || state.playerShielded;
  $("potionBtn").disabled     = !canActP1 || state.potion <= 0 || state.player.hp >= pMax;
  $("powderBtn").disabled     = !canActP1 || state.powder <= 0;
  $("epicPotionBtn").disabled = !canActP1 || (state.epicPotions  || 0) <= 0 || state.player.hp >= pMax;
  if ($("superPotionBtn")) $("superPotionBtn").disabled = !canActP1 || (state.superPotions || 0) <= 0 || state.player.hp >= pMax;

  if (isPvp) {
    $("enemyInventory").classList.remove("hidden");
    $("eShieldBtn").classList.remove("no-action");
    $("ePotionBtn").classList.remove("no-action");
    $("ePowderBtn").classList.remove("no-action");
    $("eShieldBtn").disabled = !canActP2 || state.eShield <= 0 || state.enemyShielded;
    $("ePotionBtn").disabled = !canActP2 || state.ePotion <= 0 || state.enemy.hp >= eMax;
    $("ePowderBtn").disabled = !canActP2 || state.ePowder <= 0;
  } else {
    $("eShieldBtn").classList.add("no-action");
    $("ePotionBtn").classList.add("no-action");
    $("ePowderBtn").classList.add("no-action");
    $("eShieldBtn").disabled = true;
    $("ePotionBtn").disabled = true;
    $("ePowderBtn").disabled = true;
  }

  $("playerStatus").innerHTML = state.playerShielded ? "🛡️ Protegido" : (state.playerBlind > 0 ? "😵 Cego" : "");
  $("enemyStatus").innerHTML  = state.enemyShielded  ? "🛡️ Protegido" : (state.enemyBlind  > 0 ? "😵 Cego" : "");

  renderWallet();
}

// ── Utilitários de combate ────────────────────────────────────
function addLog(text) {
  const log = $("combatLog"), entries = $("logEntries");
  const p = document.createElement("p");
  p.innerHTML = text;
  entries.appendChild(p);
  log.scrollTop = log.scrollHeight;
}
function rollD20() {
  const base = Math.floor(Math.random() * 20) + 1;
  const bonus = state.player?.diceBonus || 0;
  return Math.min(20, base + bonus); // cap at 20
}
function rollD20Enemy() { return Math.floor(Math.random() * 20) + 1; }

// ── D20 SVG icosahedron ───────────────────────────────────────
function drawDiceSVG(phase) {
  const svg = $("diceSvg");
  if (!svg) return;
  const cx = 100, cy = 100, r = 72;
  const phi = (1 + Math.sqrt(5)) / 2;
  const verts3d = [
    [0,1,phi],[0,-1,phi],[0,1,-phi],[0,-1,-phi],
    [1,phi,0],[-1,phi,0],[1,-phi,0],[-1,-phi,0],
    [phi,0,1],[-phi,0,1],[phi,0,-1],[-phi,0,-1]
  ].map(([x,y,z]) => { const l=Math.sqrt(x*x+y*y+z*z); return [x/l,y/l,z/l]; });

  const angX=phase*1.3, angY=phase*0.9, angZ=phase*0.5;
  const cX=Math.cos(angX),sX=Math.sin(angX);
  const cY=Math.cos(angY),sY=Math.sin(angY);
  const cZ=Math.cos(angZ),sZ=Math.sin(angZ);
  const rot=([x,y,z])=>{
    const y2=cX*y-sX*z, z2=sX*y+cX*z;
    const x3=cY*x+sY*z2, z3=-sY*x+cY*z2;
    const x4=cZ*x3-sZ*y2, y4=sZ*x3+cZ*y2;
    return [x4,y4,z3];
  };
  const rv=verts3d.map(rot);
  const proj=rv.map(([x,y,z])=>[cx+x*r, cy-y*r]);
  const faces=[
    [0,1,8],[0,8,4],[0,4,5],[0,5,9],[0,9,1],
    [1,6,8],[8,6,10],[8,10,4],[4,10,2],[4,2,5],
    [5,2,11],[5,11,9],[9,11,7],[9,7,1],[1,7,6],
    [3,6,7],[3,7,11],[3,11,2],[3,2,10],[3,10,6]
  ];
  const dark='#8b6320', stroke='#f5d88b';
  let html='';
  faces.forEach(([a,b,c])=>{
    const [ax,ay]=proj[a],[bx,by]=proj[b],[ccx,ccy]=proj[c];
    const s2d=(bx-ax)*(ccy-ay)-(by-ay)*(ccx-ax);
    const vis=s2d>0;
    const fill=vis?'url(#gFace)':'rgba(18,10,3,0.88)';
    html+=`<polygon points="${ax},${ay} ${bx},${by} ${ccx},${ccy}" fill="${fill}" stroke="${stroke}" stroke-width="${vis?1.4:0.4}" stroke-opacity="${vis?1:0.25}" fill-opacity="0.95"/>`;
  });
  svg.innerHTML=`<defs><radialGradient id="gFace" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#f5d88b"/><stop offset="100%" stop-color="${dark}"/></radialGradient></defs>${html}`;
}

function animateDice(value) {
  return new Promise(resolve => {
    const wrap=$("dice"), face=$("diceValue");
    wrap.classList.add("show","rolling");
    face.textContent="?";
    let rafId, startTime;
    function animFrame(ts) {
      if (!startTime) startTime=ts;
      const elapsed=(ts-startTime)/1000;
      drawDiceSVG(elapsed*4.5);
      if (elapsed<1.55) rafId=requestAnimationFrame(animFrame);
    }
    rafId=requestAnimationFrame(animFrame);
    setTimeout(()=>{
      cancelAnimationFrame(rafId);
      face.textContent=value;
      const svg=$("diceSvg");
      if (svg) {
        const col=value===20?'#ff9944':value>=16?'#7ed88a':value<=3?'#e05050':'#e9c46a';
        svg.querySelectorAll('polygon').forEach(p=>{
          if (p.getAttribute('fill')==='url(#gFace)') p.setAttribute('fill',col);
        });
      }
      wrap.classList.add("land");
      setTimeout(()=>{wrap.classList.remove("rolling","land");resolve();},500);
    },1600);
  });
}

function animateAttack(attacker, defender) {
  return new Promise(resolve => {
    const left = attacker.id === "player";
    attacker.classList.add(left ? "attack-left" : "attack-right");
    setTimeout(() => {
      defender.classList.add("hit");
      setTimeout(() => {
        attacker.classList.remove("attack-left","attack-right");
        defender.classList.remove("hit");
        resolve();
      }, 360);
    }, 470);
  });
}

function showDamage(damage, critical) {
  const el=$("damageFloat");
  el.textContent=critical?`💥 CRÍTICO! -${damage}`:`-${damage}`;
  el.className=`damage-float active${critical?" critical":""}`;
  setTimeout(()=>el.className="damage-float",1000);
}
function showItem(msg) {
  const el=$("itemFloat");
  if (!el) return;
  el.textContent=msg;
  el.className="item-float active";
  setTimeout(()=>el.className="item-float",1200);
}
function itemName(item) {
  return {shield:"🛡️ Escudo",potion:"🧪 Poção de vida",powder:"✨ Pó mágico",potion_epic:"💊 Poção Épica"}[item] || item;
}

// ── Drop de itens em batalha ─────────────────────────────────
function possibleDrop(roll, owner) {
  if (roll < 15) return null;
  // Em PvE o inimigo (NPC) não recebe itens — apenas o player
  if (owner === "enemy" && state.mode === "pve") return null;
  const chance=Math.random();
  let item;
  if (chance<0.34) item="shield";
  else if (chance<0.67) item="potion";
  else item="powder";
  if (owner==="player") {
    if (item==="shield"&&state.shield>=1)  return null;
    if (item==="potion"&&state.potion>=3)  return null;
    if (item==="powder"&&state.powder>=2)  return null;
    if (item==="shield") state.shield++;
    if (item==="potion") state.potion++;
    if (item==="powder") state.powder++;
  } else {
    if (item==="shield"&&state.eShield>=1) return null;
    if (item==="potion"&&state.ePotion>=3) return null;
    if (item==="powder"&&state.ePowder>=2) return null;
    if (item==="shield") state.eShield++;
    if (item==="potion") state.ePotion++;
    if (item==="powder") state.ePowder++;
  }
  return item;
}

// ── Cálculo de dano (com defesa) ─────────────────────────────
function calcDamage(roll, attacker, defenderDefense) {
  const magicAdd = (attacker.charClass === "mago") ? (attacker.magicBonus || 0) : 0;
  const totalBonus = (attacker.bonusDano || 0) + magicAdd;
  const base = roll === 20 ? (roll + totalBonus) * 2 : roll + totalBonus;
  const reduced = Math.max(0, base - defenderDefense);
  return { damage: reduced, wasCrit: roll === 20, baseBeforeDefense: base };
}

// ── Ataque do Jogador 1 ──────────────────────────────────────
async function p1Attack() {
  if (state.busy || state.over) return;
  if (!state.userTurn) {
    if (state.mode === "pvp") { p2Attack(); return; }
    return;
  }
  clearTurnTimer();
  state.busy = true; updateUI();

  // Cegueira
  if (state.playerBlind > 0) {
    state.playerBlind--;
    const who = state.mode === "pvp" ? escapeHtml(state.nickname) : "Você";
    addLog(`😵 <b>${who}</b> está cego e perde este turno!`);
    state.userTurn = false; state.busy = false; updateUI();
    if (state.mode === "pvp") { addLog(`🎲 Turno de <b>${escapeHtml(state.nick2)}</b>.`); startTurnTimer(); }
    if (state.mode === "pve") setTimeout(enemyAITurn, 850);
    return;
  }

  const roll = rollD20();
  await animateDice(roll);
  $("dice").classList.remove("show");

  const drop = possibleDrop(roll, "player");
  if (drop) { showItem(`🎁 ${itemName(drop)} encontrado!`); addLog(`🎁 <b>${state.player.nome}</b> encontrou <b>${itemName(drop)}</b>!`); updateUI(); }

  await animateAttack($("player"), $("enemy"));

  const defVal = state.enemy.defense || 0;
  const { damage, wasCrit, baseBeforeDefense } = calcDamage(roll, state.player, state.enemyShielded ? 999 : defVal);

  if (state.enemyShielded) {
    state.enemyShielded = false;
    addLog(`🛡️ O escudo de <b>${escapeHtml(state.enemy.nome)}</b> bloqueou o ataque!`);
  } else {
    if (damage < baseBeforeDefense && defVal > 0)
      addLog(`🛡️ Armadura do inimigo absorveu <b>${baseBeforeDefense - damage}</b> de dano.`);
    state.enemy.hp = Math.max(0, state.enemy.hp - damage);
    if (damage) showDamage(damage, wasCrit);
  }

  const attLabel = state.mode === "pvp" ? escapeHtml(state.nickname) : state.player.nome;
  const diceBonus = state.player.diceBonus || 0;
  addLog(`${state.player.icon} <b>${attLabel}</b> rolou <b>${roll}${diceBonus > 0 ? ` (+${diceBonus})` : ""}</b> → <b>${damage}</b> dano${wasCrit ? " 💥 <b>CRÍTICO!</b>" : ""}.`);
  updateUI();

  if (state.enemy.hp <= 0) { finish("p1"); return; }

  state.userTurn = false; state.busy = false;
  if (state.mode === "pvp") { addLog(`🎲 Turno de <b>${escapeHtml(state.nick2)}</b>.`); startTurnTimer(); }
  updateUI();
  if (state.mode === "pve") setTimeout(enemyAITurn, 850);
}

// ── Fuga ─────────────────────────────────────────────────────
async function fleeAttempt() {
  if (state.busy || state.over) return;
  if (!state.userTurn) {
    if (state.mode === "pvp") { await fleeP2(); return; }
    return;
  }
  clearTurnTimer();
  state.busy = true; updateUI();

  const roll = rollD20();
  await animateDice(roll);
  $("dice").classList.remove("show");

  const name = state.mode === "pvp" ? escapeHtml(state.nickname) : state.player.nome;
  if (roll >= 16) {
    addLog(`🏃 <b>${name}</b> rolou <b>${roll}</b> e fugiu!`);
    finish("flee_p1");
  } else {
    const dmg = 5;
    state.player.hp = Math.max(0, state.player.hp - dmg);
    showDamage(dmg, false);
    addLog(`🏃 Fuga falhou! <b>${name}</b> rolou <b>${roll}</b> (precisa 16+) e tomou <b>${dmg}</b> de dano.`);
    updateUI();
    if (state.player.hp <= 0) { finish("p2"); return; }
    state.userTurn = false; state.busy = false;
    if (state.mode === "pvp") { addLog(`🎲 Turno de <b>${escapeHtml(state.nick2)}</b>.`); startTurnTimer(); }
    updateUI();
    if (state.mode === "pve") setTimeout(enemyAITurn, 850);
  }
}

// ── Ataque do Jogador 2 (PvP) ────────────────────────────────
async function p2Attack() {
  if (state.busy || state.over || state.userTurn) return;
  clearTurnTimer();
  state.busy = true; updateUI();

  if (state.playerBlind > 0) { // P2's blind stored in enemyBlind for symmetry — actually not used in PvP separately
  }

  const roll = rollD20Enemy();
  await animateDice(roll);
  $("dice").classList.remove("show");

  const drop = possibleDrop(roll, "enemy");
  if (drop) { showItem(`🎁 ${itemName(drop)} encontrado!`); addLog(`🎁 <b>${escapeHtml(state.nick2)}</b> encontrou <b>${itemName(drop)}</b>!`); updateUI(); }

  await animateAttack($("enemy"), $("player"));

  let damage = roll === 20 ? (roll + state.enemy.bonusDano) * 2 : roll + state.enemy.bonusDano;
  if (state.playerShielded) {
    damage = 0; state.playerShielded = false;
    addLog(`🛡️ O escudo de <b>${escapeHtml(state.nickname)}</b> bloqueou o ataque!`);
  }
  state.player.hp = Math.max(0, state.player.hp - damage);
  if (damage) showDamage(damage, roll === 20);
  addLog(`${state.enemy.icon} <b>${escapeHtml(state.nick2)}</b> rolou <b>${roll}</b> → <b>${damage}</b> dano${roll === 20 ? " 💥 <b>CRÍTICO!</b>" : ""}.`);
  updateUI();

  if (state.player.hp <= 0) { finish("p2"); return; }
  state.userTurn = true; state.busy = false;
  addLog(`🎲 Turno de <b>${escapeHtml(state.nickname)}</b>.`);
  updateUI();
  startTurnTimer();
}

async function fleeP2() {
  clearTurnTimer();
  state.busy = true; updateUI();
  const roll = rollD20Enemy();
  await animateDice(roll);
  $("dice").classList.remove("show");
  if (roll >= 16) {
    addLog(`🏃 <b>${escapeHtml(state.nick2)}</b> rolou <b>${roll}</b> e fugiu!`);
    finish("flee_p2");
  } else {
    const dmg = 5;
    state.enemy.hp = Math.max(0, state.enemy.hp - dmg);
    showDamage(dmg, false);
    addLog(`🏃 Fuga falhou! <b>${escapeHtml(state.nick2)}</b> rolou <b>${roll}</b> e tomou <b>${dmg}</b> de dano.`);
    updateUI();
    if (state.enemy.hp <= 0) { finish("p1"); return; }
    state.userTurn = true; state.busy = false;
    addLog(`🎲 Turno de <b>${escapeHtml(state.nickname)}</b>.`);
    updateUI();
    startTurnTimer();
  }
}

// ── IA inimiga (PvE) ─────────────────────────────────────────
async function enemyAITurn() {
  if (state.over) return;
  state.busy = true; updateUI();

  if (state.enemyBlind > 0) {
    state.enemyBlind--;
    addLog(`😵 <b>${state.enemy.nome}</b> está cego e perde este turno!`);
    state.userTurn = true; state.busy = false; updateUI();
    startTurnTimer();
    return;
  }

  // Se usar item, perde o ataque deste turno
  const usedItem = enemyAIUseItem();
  if (usedItem) {
    addLog(`🎲 Turno de <b>${escapeHtml(state.nickname)}</b>.`);
    state.userTurn = true; state.busy = false; updateUI();
    startTurnTimer();
    return;
  }

  const roll = rollD20Enemy();
  await animateDice(roll);
  $("dice").classList.remove("show");

  const drop = possibleDrop(roll, "enemy");
  if (drop) { showItem(`🎁 Inimigo obteve ${itemName(drop)}!`); addLog(`🎁 <b>${state.enemy.nome}</b> encontrou <b>${itemName(drop)}</b>!`); updateUI(); }

  await animateAttack($("enemy"), $("player"));

  const playerDef = state.player.defense || 0;
  const { damage, wasCrit, baseBeforeDefense } = calcDamage(roll, state.enemy, state.playerShielded ? 999 : playerDef);

  if (state.playerShielded) {
    state.playerShielded = false;
    addLog(`🛡️ Seu escudo bloqueou o ataque!`);
  } else {
    if (damage < baseBeforeDefense && playerDef > 0)
      addLog(`🛡️ Sua armadura absorveu <b>${baseBeforeDefense - damage}</b> de dano.`);
    state.player.hp = Math.max(0, state.player.hp - damage);
    if (damage) showDamage(damage, wasCrit);
  }

  addLog(`${state.enemy.icon} <b>${state.enemy.nome}</b> rolou <b>${roll}</b> → <b>${damage}</b> dano${wasCrit ? " 💥 <b>CRÍTICO!</b>" : ""}.`);
  updateUI();

  if (state.player.hp <= 0) { finish("p2"); return; }
  state.userTurn = true; state.busy = false; updateUI();
  startTurnTimer();
}

function enemyAIUseItem() {
  // Em PvE o NPC não usa itens — são exclusivos dos players
  if (state.mode === "pve") return null;
  const eHpPct = state.enemy.hp / state.enemy.maxHp;
  if (state.enemy.hp <= state.enemy.maxHp * 0.4 && state.ePotion > 0) {
    const heal = Math.min(10, state.enemy.maxHp - state.enemy.hp);
    state.ePotion--;
    state.enemy.hp += heal;
    showItem(`🧪 ${state.enemy.nome} se cura!`);
    addLog(`🧪 <b>${state.enemy.nome}</b> usou uma Poção e recuperou <b>${heal} HP</b>.`);
    updateUI();
    return "potion";
  }
  if (state.eShield > 0 && !state.enemyShielded && Math.random() < 0.30) {
    state.eShield--;
    state.enemyShielded = true;
    showItem(`🛡️ ${state.enemy.nome} se protege!`);
    addLog(`🛡️ <b>${state.enemy.nome}</b> ativou o Escudo.`);
    updateUI();
    return "shield";
  }
  if (state.ePowder > 0 && state.playerBlind === 0 && Math.random() < 0.40) {
    state.ePowder--;
    state.playerBlind = 1;
    showItem("✨ VOCÊ ESTÁ CEGO!");
    addLog(`✨ <b>${state.enemy.nome}</b> lançou Pó Mágico! Você perde o próximo turno.`);
    updateUI();
    return "powder";
  }
  return null;
}

// ── Uso de itens — Jogador 1 ─────────────────────────────────
function useItem(item) {
  if (!state.userTurn || state.busy || state.over) return;
  const pMax = state.player.maxHp || 100;

  if (item === "shield" && state.shield > 0 && !state.playerShielded) {
    state.shield--; state.playerShielded = true;
    showItem("🛡️ Escudo ativado!"); addLog("🛡️ Escudo ativado. Próximo ataque bloqueado."); endItemTurnP1();
  } else if (item === "potion" && state.potion > 0 && state.player.hp < pMax) {
    const heal = Math.min(5, pMax - state.player.hp); state.potion--; state.player.hp += heal;
    showItem(`🧪 +${heal} HP`); addLog(`🧪 Poção de vida: +<b>${heal} HP</b>.`); endItemTurnP1();
  } else if (item === "potion_epic" && (state.epicPotions || 0) > 0 && state.player.hp < pMax) {
    const heal = Math.min(10, pMax - state.player.hp);
    state.epicPotions--; state.player.hp += heal;
    localStorage.setItem("d20EpicPotions", state.epicPotions);
    showItem(`💊 +${heal} HP`); addLog(`💊 Poção Épica: +<b>${heal} HP</b>.`); endItemTurnP1();
  } else if (item === "super_potion" && (state.superPotions || 0) > 0 && state.player.hp < pMax) {
    const heal = pMax - state.player.hp; // cura 100%
    state.superPotions--; state.player.hp = pMax;
    localStorage.setItem("d20SuperPotions", state.superPotions);
    showItem(`🧬 +${heal} HP — VIDA CHEIA!`); addLog(`🧬 <b>Super Poção</b>: vida restaurada completamente! +<b>${heal} HP</b>.`); endItemTurnP1();
  } else if (item === "powder" && state.powder > 0) {
    state.powder--; state.enemyBlind = 1;
    showItem("✨ INIMIGO CEGO!"); addLog(`✨ Pó Mágico: <b>${escapeHtml(state.enemy.nome)}</b> perde o próximo turno.`); endItemTurnP1();
  }
}

function endItemTurnP1() {
  clearTurnTimer();
  state.userTurn = false; state.busy = false;
  if (state.mode === "pvp") { addLog(`🎲 Turno de <b>${escapeHtml(state.nick2)}</b>.`); startTurnTimer(); }
  updateUI();
  if (state.mode === "pve") setTimeout(enemyAITurn, 850);
}

// ── Uso de itens — Jogador 2 (PvP) ───────────────────────────
function useItemP2(item) {
  if (state.userTurn || state.busy || state.over) return;
  const eMax = state.enemy.maxHp || 100;
  if (item === "shield" && state.eShield > 0 && !state.enemyShielded) {
    state.eShield--; state.enemyShielded = true;
    showItem("🛡️ Escudo ativado!"); addLog(`🛡️ <b>${escapeHtml(state.nick2)}</b> ativou o Escudo.`); endItemTurnP2();
  } else if (item === "potion" && state.ePotion > 0 && state.enemy.hp < eMax) {
    const heal = Math.min(5, eMax - state.enemy.hp); state.ePotion--; state.enemy.hp += heal;
    showItem(`🧪 +${heal} HP`); addLog(`🧪 <b>${escapeHtml(state.nick2)}</b> usou Poção: +<b>${heal} HP</b>.`); endItemTurnP2();
  } else if (item === "powder" && state.ePowder > 0) {
    state.ePowder--; state.playerBlind = 1;
    showItem("✨ OPONENTE CEGO!"); addLog(`✨ <b>${escapeHtml(state.nick2)}</b> lançou Pó Mágico!`); endItemTurnP2();
  }
}

function endItemTurnP2() {
  clearTurnTimer();
  state.userTurn = true; state.busy = false;
  addLog(`🎲 Turno de <b>${escapeHtml(state.nickname)}</b>.`);
  updateUI();
  startTurnTimer();
}

// ── Fim de combate ────────────────────────────────────────────
function finish(winner) {
  clearTurnTimer();
  state.over = true; state.busy = false;
  $("dice").classList.remove("show", "rolling");

  const isPvp = state.mode === "pvp";

  if (winner === "p1") {
    // Player venceu — PvE: entre lutas ou resultado final PvP
    if (isPvp) {
      addCoins(100);
      saveRank(state.nickname);
      setTimeout(() => {
        showScreen(result);
        $("resultIcon").textContent  = "🏆";
        $("resultTitle").textContent = "Vitória!";
        $("resultText").textContent  = `${state.nickname}, ${state.player.nome} derrotou ${state.enemy.nome}!`;
        $("resultCoins").innerHTML   = `<span class="coins-earned">+100 🪙 moedas!</span>`;
      }, 500);
    } else {
      // PvE — inimigo derrotado
      const tpl         = TOWER_ENEMIES[state.towerFloor];
      const reward      = tpl.reward;
      const isBoss      = tpl.isBoss;
      const isSemiBoss  = tpl.isSemiBoss;
      addCoins(reward);

      // Salvar HP atual para próxima luta
      state.towerPlayerHp = state.player.hp;

      const isLastFloor = state.towerFloor >= TOWER_ENEMIES.length - 1;
      const isCheckpoint = state.towerFloor === CHECKPOINT_FLOOR; // andar 5 (índice 4)

      if (isLastFloor) {
        _towerComplete();
      } else if (isCheckpoint) {
        // Checkpoint: oferecer sair e salvar ou continuar
        setTimeout(() => {
          showScreen(between);
          $("betweenIcon").textContent  = "🏅";
          $("betweenTitle").textContent = `${tpl.nome} derrotada! — CHECKPOINT`;
          $("betweenText").textContent  = `Andar 5/10 completo! HP: ${state.player.hp}/${state.towerMaxHp}. Você pode sair e salvar o progresso, ou continuar agora.`;
          $("betweenCoins").innerHTML   = `<span class="coins-earned">+${reward} 🪙 moedas ganhas!</span>`;
          // Botões: continuar + sair/salvar
          const nextEnemy = TOWER_ENEMIES[state.towerFloor + 1];
          $("nextFightBtn").textContent = `⚔ Continuar — Andar 6: ${nextEnemy.icon} ${nextEnemy.nome}`;
          $("checkpointLeaveBtn").classList.remove("hidden");
        }, 500);
      } else {
        setTimeout(() => {
          showScreen(between);
          $("betweenIcon").textContent  = isBoss ? "🏆" : "⚔️";
          $("betweenTitle").textContent = `${tpl.nome} derrotado!`;
          $("betweenText").textContent  = `Andar ${state.towerFloor + 1}/10 completo. HP restante: ${state.player.hp}/${state.towerMaxHp}.`;
          $("betweenCoins").innerHTML   = `<span class="coins-earned">+${reward} 🪙 moedas ganhas!</span>`;
          const nextFloor = state.towerFloor + 1;
          const nextEnemy = TOWER_ENEMIES[nextFloor];
          $("nextFightBtn").textContent = nextEnemy.isBoss
            ? `⚔ Enfrentar BOSS FINAL: ${nextEnemy.icon} ${nextEnemy.nome}`
            : nextEnemy.isSemiBoss
            ? `⚔ Enfrentar SEMI-BOSS: ${nextEnemy.icon} ${nextEnemy.nome}`
            : `⚔ Próximo: ${nextEnemy.icon} ${nextEnemy.nome}`;
          $("checkpointLeaveBtn").classList.add("hidden");
        }, 500);
      }
    }

  } else if (winner === "p2") {
    // Player perdeu
    const wasInTower = state.towerActive && !isPvp;

    // Capturar itens ANTES de apagar (para mostrar na tela)
    let lostGearHtml = "";
    if (wasInTower && state.gear.length > 0) {
      const grouped = {};
      for (const id of state.gear) grouped[id] = (grouped[id] || 0) + 1;
      const tags = Object.entries(grouped).map(([id, qty]) => {
        const item = SHOP_CATALOG[id];
        if (!item) return "";
        return `<span class="lost-item rarity-${item.rarity}">${item.icon} ${item.name}${qty > 1 ? ` ×${qty}` : ""}</span>`;
      }).filter(Boolean).join("");
      if (tags) lostGearHtml = `<div class="lost-gear"><b>Equipamentos perdidos:</b><br>${tags}</div>`;
    }

    if (wasInTower) {
      loseGear();              // Perde todos os equipamentos
      resetTowerCheckpoint();  // Torre reseta — recomeça do andar 1
    }
    if (isPvp) addCoins(100), saveRank(state.nick2);
    state.towerActive = false;
    setTimeout(() => {
      showScreen(result);
      $("resultIcon").textContent  = isPvp ? "🏆" : "💀";
      $("resultTitle").textContent = isPvp ? `${state.nick2} Venceu!` : "Você Morreu...";
      $("resultText").textContent  = isPvp
        ? `${state.nick2} derrotou ${state.nickname}!`
        : `${state.enemy.nome} derrotou você.`;
      $("resultCoins").innerHTML = isPvp
        ? `<span class="coins-earned">+100 🪙 moedas para ${escapeHtml(state.nick2)}!</span>`
        : lostGearHtml;
    }, 500);

  } else if (winner === "flee_p1") {
    state.towerActive = false;
    setTimeout(() => {
      showScreen(result);
      $("resultIcon").textContent  = "🏃";
      $("resultTitle").textContent = "Você Fugiu!";
      $("resultText").textContent  = isPvp ? `${state.nickname} escapou.` : `${state.nickname} fugiu da floresta!`;
      $("resultCoins").innerHTML   = "";
    }, 500);

  } else if (winner === "flee_p2") {
    addCoins(100); saveRank(state.nickname);
    state.towerActive = false;
    setTimeout(() => {
      showScreen(result);
      $("resultIcon").textContent  = "🏃";
      $("resultTitle").textContent = `${state.nick2} Fugiu!`;
      $("resultText").textContent  = `${state.nickname} venceu por desistência!`;
      $("resultCoins").innerHTML   = `<span class="coins-earned">+100 🪙 moedas!</span>`;
    }, 500);
  }
}

// ── Inicialização ────────────────────────────────────────────
loadGear();
renderRank();
renderWallet();
renderGearPreview();
renderTowerSteps();
