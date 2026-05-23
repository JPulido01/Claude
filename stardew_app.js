// Lista plana de productos animales con crudo y procesado
// saleMult: precio crudo se multiplica por (amistad/1000+0.3) × rancher
// processed: si existe, se puede vender procesado (no afecta amistad, sí Artisan excepto aceite)
const ANIMAL_PRODUCTS = [
  // Corral
  {name:"Huevo",             price:50,  freq_days:1, processed:{name:"Mayonesa",          price:190,  machine:"Mayonesera", artisan:true,  qty:1}},
  {name:"Huevo XXL",         price:95,  freq_days:1, processed:{name:"Mayonesa Oro",       price:380,  machine:"Mayonesera", artisan:true,  qty:1}},
  {name:"Huevo Marrón",      price:50,  freq_days:1, processed:{name:"Mayonesa",           price:190,  machine:"Mayonesera", artisan:true,  qty:1}},
  {name:"Huevo Marrón XXL",  price:95,  freq_days:1, processed:{name:"Mayonesa Oro",       price:380,  machine:"Mayonesera", artisan:true,  qty:1}},
  {name:"Huevo Sombrio",     price:65,  freq_days:1, processed:{name:"Mayonesa Sombría",   price:275,  machine:"Mayonesera", artisan:true,  qty:1}},
  {name:"Huevo Dorado",      price:500, freq_days:1, processed:{name:"Mayonesa Dorada",    price:380,  machine:"Mayonesera", artisan:true,  qty:3}},
  {name:"Huevo de Pato",     price:95,  freq_days:1, processed:{name:"Mayonesa Pato",      price:375,  machine:"Mayonesera", artisan:true,  qty:1}},
  {name:"Pluma de Pato",     price:250, freq_days:2, processed:null},
  {name:"Huevo Dinosaurio",  price:350, freq_days:7, processed:{name:"Mayo. Dinosaurio",   price:800,  machine:"Mayonesera", artisan:true,  qty:1}},
  {name:"Huevo Avestruz",    price:600, freq_days:7, processed:{name:"Mayonesa ×10",       price:1900, machine:"Mayonesera", artisan:true,  qty:10}},
  {name:"Lana (Conejo)",     price:340, freq_days:4, processed:{name:"Tela",               price:470,  machine:"Telar",      artisan:true,  qty:1}},
  {name:"Pata de Conejo",    price:565, freq_days:4, processed:null},
  // Establo
  {name:"Leche",             price:125, freq_days:1, processed:{name:"Queso",              price:230,  machine:"Prensa",     artisan:true,  qty:1}},
  {name:"Leche XXL",         price:190, freq_days:1, processed:{name:"Queso Oro",          price:345,  machine:"Prensa",     artisan:true,  qty:1}},
  {name:"Leche de Cabra",    price:225, freq_days:2, processed:{name:"Queso Cabra",        price:400,  machine:"Prensa",     artisan:true,  qty:1}},
  {name:"Leche Cabra XXL",   price:345, freq_days:2, processed:{name:"Queso Cabra Oro",    price:600,  machine:"Prensa",     artisan:true,  qty:1}},
  {name:"Lana (Oveja)",      price:340, freq_days:3, processed:{name:"Tela",               price:470,  machine:"Telar",      artisan:true,  qty:1}},
  {name:"Trufa",             price:625, freq_days:1, processed:{name:"Aceite de Trufa",    price:1065, machine:"Aceitera",   artisan:false, qty:1}},
];

let animalRowCount = 0;

function toggleAnimals() {
  const sec = document.getElementById('animals_section');
  const btn = document.getElementById('btn_animals');
  if (sec.style.display === 'none') {
    sec.style.display = 'block';
    btn.textContent = '▶ - OCULTAR PRODUCTOS ANIMALES ◀';
    if (animalRowCount === 0) addAnimalRow();
  } else {
    sec.style.display = 'none';
    btn.textContent = '▶ + PRODUCTOS ANIMALES (OPCIONAL) ◀';
  }
}

function buildProductOpts() {
  return ANIMAL_PRODUCTS.map((p, i) => {
    const fd   = p.freq_days > 1 ? ` c/${p.freq_days}d` : '/día';
    const proc = p.processed ? ` → ${p.processed.name} ${p.processed.price * p.processed.qty}g` : '';
    return `<option value="${i}">${p.name} — ${p.price}g${fd}${proc}</option>`;
  }).join('');
}

function updateSaleOpts(id) {
  const idx     = parseInt(document.getElementById(`animal_prod_${id}`).value) || 0;
  const prod    = ANIMAL_PRODUCTS[idx];
  const saleSel = document.getElementById(`animal_sale_${id}`);
  if (prod && prod.processed) {
    const procTotal = prod.processed.price * prod.processed.qty;
    saleSel.innerHTML =
      `<option value="raw">Crudo — ${prod.price}g</option>` +
      `<option value="proc">Procesado — ${prod.processed.name} ${procTotal}g</option>`;
  } else {
    saleSel.innerHTML = `<option value="raw">Crudo — ${prod ? prod.price : 0}g</option>`;
  }
}

function addAnimalRow() {
  const container = document.getElementById('animal_rows');
  if (animalRowCount === 0) {
    const hdr = document.createElement('div');
    hdr.className = 'animal-header';
    hdr.id = 'animal_header';
    hdr.innerHTML = '<span>Producto</span><span>Venta</span><span>Cantidad</span><span>Amistad</span><span>Prob.</span><span></span>';
    container.appendChild(hdr);
  }
  const id  = animalRowCount++;
  const row = document.createElement('div');
  row.className = 'animal-row';
  row.id = `animal_row_${id}`;
  row.innerHTML = `
    <select id="animal_prod_${id}" onchange="updateSaleOpts(${id})">${buildProductOpts()}</select>
    <select id="animal_sale_${id}"></select>
    <input type="number" id="animal_count_${id}" value="4" min="1">
    <select id="animal_hearts_${id}">
      <option value="200">1♥</option>
      <option value="400">2♥</option>
      <option value="600">3♥</option>
      <option value="800">4♥</option>
      <option value="1000" selected>5♥</option>
    </select>
    <input type="number" id="animal_prob_${id}" value="1" min="0" max="1" step="0.1" title="Probabilidad">
    <button class="del-btn" onclick="removeAnimalRow(${id})">✕</button>
  `;
  container.appendChild(row);
  updateSaleOpts(id);
}

function removeAnimalRow(id) {
  const row = document.getElementById(`animal_row_${id}`);
  if (row) row.remove();
  if (document.querySelectorAll('.animal-row').length === 0) {
    const hdr = document.getElementById('animal_header');
    if (hdr) hdr.remove();
    animalRowCount = 0;
  }
}

function calcAnimals(seasonDays) {
  const rows = document.querySelectorAll('.animal-row');
  if (rows.length === 0) return 0;
  const artisanMult = document.getElementById('artisan').checked ? 1.4 : 1.0;
  const rancherMult = document.getElementById('rancher').checked ? 1.2 : 1.0;
  let total = 0;
  rows.forEach(row => {
    const id   = row.id.replace('animal_row_', '');
    const idx  = parseInt(document.getElementById(`animal_prod_${id}`).value) || 0;
    const mode = document.getElementById(`animal_sale_${id}`).value;
    const count  = parseFloat(document.getElementById(`animal_count_${id}`).value)  || 0;
    const hearts = parseFloat(document.getElementById(`animal_hearts_${id}`).value) || 1000;
    const prob   = parseFloat(document.getElementById(`animal_prob_${id}`).value)   || 1;
    const prod   = ANIMAL_PRODUCTS[idx];
    if (!prod) return;
    const productions = seasonDays / (prod.freq_days || 1);
    let salePrice;
    if (mode === 'proc' && prod.processed) {
      const am = prod.processed.artisan ? artisanMult : 1.0;
      salePrice = prod.processed.price * prod.processed.qty * am;
    } else {
      salePrice = prod.price * (hearts / 1000 + 0.3) * rancherMult;
    }
    total += salePrice * prob * count * productions;
  });
  return total;
}

// seed: precio semilla (Pierre salvo indicación), sell: precio venta base, grow: días, regrow: rebrote (0=no), season: temporada
const CROPS_DB = {
  // ── PRIMAVERA ──────────────────────────────────────────────
  "Allium azul":       {seed:30,  sell:50,  grow:7,  regrow:0, season:"🌸 Primavera"},
  "Ajo":               {seed:40,  sell:60,  grow:4,  regrow:0, season:"🌸 Primavera"},
  "Chirivía":          {seed:20,  sell:35,  grow:4,  regrow:0, season:"🌸 Primavera"},
  "Coliflor":          {seed:80,  sell:175, grow:12, regrow:0, season:"🌸 Primavera"},
  "Col Rizada":        {seed:70,  sell:110, grow:6,  regrow:0, season:"🌸 Primavera"},
  "Fresa":             {seed:100, sell:120, grow:8,  regrow:4, season:"🌸 Primavera"},
  "Judía Verde":       {seed:60,  sell:40,  grow:10, regrow:3, season:"🌸 Primavera"},
  "Papa":              {seed:50,  sell:80,  grow:6,  regrow:0, season:"🌸 Primavera"},
  "Ruibarbo":          {seed:100, sell:220, grow:13, regrow:0, season:"🌸 Primavera", seedSource:"Oasis (desierto)"},
  "Tulipán":           {seed:20,  sell:30,  grow:6,  regrow:0, season:"🌸 Primavera"},
  "Zanahoria":         {seed:0,   sell:35,  grow:3,  regrow:0, season:"🌸 Primavera"},
  // ── VERANO ─────────────────────────────────────────────────
  "Amapola":           {seed:100, sell:140, grow:7,  regrow:0, season:"☀️ Verano"},
  "Arándano":          {seed:80,  sell:50,  grow:13, regrow:4, season:"☀️ Verano"},
  "Carambola (Oasis)": {seed:400, sell:750, grow:13, regrow:0, season:"☀️ Verano",   seedSource:"Oasis (desierto)"},
  "Chile Picante":     {seed:40,  sell:40,  grow:5,  regrow:3, season:"☀️ Verano"},
  "Girasol":           {seed:200, sell:80,  grow:8,  regrow:0, season:"☀️ Verano"},
  "Lentejuela":        {seed:50,  sell:90,  grow:8,  regrow:0, season:"☀️ Verano"},
  "Lombarda":          {seed:100, sell:260, grow:9,  regrow:0, season:"☀️ Verano"},
  "Lúpulo":            {seed:60,  sell:25,  grow:11, regrow:1, season:"☀️ Verano"},
  "Maíz":              {seed:150, sell:50,  grow:14, regrow:4, season:"☀️ Verano"},
  "Melón":             {seed:80,  sell:250, grow:12, regrow:0, season:"☀️ Verano"},
  "Rábano":            {seed:40,  sell:90,  grow:6,  regrow:0, season:"☀️ Verano"},
  "Tomate":            {seed:50,  sell:60,  grow:11, regrow:4, season:"☀️ Verano"},
  "Trigo":             {seed:10,  sell:25,  grow:4,  regrow:0, season:"☀️ Verano"},
  // ── OTOÑO ──────────────────────────────────────────────────
  "Alcachofa":         {seed:30,  sell:160, grow:8,  regrow:0, season:"🍂 Otoño"},
  "Amaranto":          {seed:70,  sell:150, grow:7,  regrow:0, season:"🍂 Otoño"},
  "Arándano Rojo":     {seed:240, sell:75,  grow:7,  regrow:5, season:"🍂 Otoño",  multi:3},
  "Berenjena":         {seed:20,  sell:60,  grow:5,  regrow:5, season:"🍂 Otoño"},
  "Bok Choy":          {seed:50,  sell:80,  grow:4,  regrow:0, season:"🍂 Otoño"},
  "Calabaza":          {seed:100, sell:320, grow:13, regrow:0, season:"🍂 Otoño"},
  "Col china":         {seed:100, sell:175, grow:12, regrow:0, season:"🍂 Otoño"},
  "Grosella":          {seed:80,  sell:75,  grow:13, regrow:3, season:"🍂 Otoño",  multi:2},
  "Lúpulo (Otoño)":   {seed:60,  sell:25,  grow:11, regrow:1, season:"🍂 Otoño"},
  "Ñame":              {seed:60,  sell:160, grow:10, regrow:0, season:"🍂 Otoño"},
  "Remolacha":         {seed:20,  sell:100, grow:6,  regrow:0, season:"🍂 Otoño"},
  "Uva":               {seed:60,  sell:80,  grow:10, regrow:3, season:"🍂 Otoño"},
  "Sweet Gem Berry":   {seed:1000,sell:3000,grow:24, regrow:0, season:"🍂 Otoño",    seedSource:"Carro Ambulante (precio variable 600-1000g)"},
  // ── TODO EL AÑO / INVERNADERO ──────────────────────────────
  "Fruta Antigua":     {seed:100, sell:550, grow:28, regrow:7, season:"🏡 Invernadero", seedSource:"Carro Ambulante / donación Museo"},
  // Grano de café: 4 granos por cosecha, rebrote cada 2 días. No se beneficia de Tiller.
  // Semilla = el propio grano (2500g en Carro Ambulante solo para la primera planta)
  "Grano de café":     {seed:2500,sell:15,  grow:10, regrow:2, season:"🌸☀️ Primavera/Verano", multi:4, noTiller:true, seedSource:"Carro Ambulante (~2500g) / Duende del polvo (1%)"},
};

// mult: multiplicador sobre precio base del cultivo
// fixed: precio fijo (ignora precio base del cultivo, ej: cerveza siempre 200g)
// days: días de procesamiento
// batch: unidades de input por batch (deshidratador requiere 5)
// note: descripción para mostrar al usuario
const PROCESS_DATA = {
  keg_wine:       { mult:3,    fixed:0,   days:7,    batch:1, note:"Tonel · Vino · ×3 precio fruta · 7 días por batch" },
  keg_juice:      { mult:2.25, fixed:0,   days:4,    batch:1, note:"Tonel · Jugo · ×2.25 precio vegetal · 4 días por batch" },
  keg_mead:       { mult:0,    fixed:300, days:0.42, batch:1, note:"Tonel · Hidromiel · 300g fijo (entrada: Miel) · 10 horas por batch" },
  keg_pale_ale:   { mult:0,    fixed:300, days:1.56, batch:1, note:"Tonel · Cerveza Pálida · 300g fijo (entrada: Lúpulo) · ~1.5 días por batch" },
  keg_beer:       { mult:0,    fixed:200, days:1,    batch:1, note:"Tonel · Cerveza · 200g fijo (entrada: Trigo) · 1 día por batch" },
  cask_wine:      { mult:3,    fixed:0,   days:7,    batch:1, note:"Barril · Vino/Mermelada · ×3 precio fruta · 7 días (calidad base)" },
  cask_juice:     { mult:2.25, fixed:0,   days:4,    batch:1, note:"Barril · Zumo/Encurtido · ×2.25 precio vegetal · 4 días (calidad base)" },
  jar_jam:        { mult:2,    fixed:50,  days:2.5,  batch:1, note:"Envasadora · Mermelada · ×2+50g precio fruta · 2-3 días por batch" },
  jar_pickle:     { mult:2,    fixed:50,  days:2.5,  batch:1, note:"Envasadora · Encurtido · ×2+50g precio vegetal · 2-3 días por batch" },
  dryer_fruit:    { mult:7.5,  fixed:25,  days:1,    batch:5, note:"Deshidratador · Fruta seca · ×7.5+25g · 1 día · requiere 5 unidades por batch" },
  dryer_mushroom: { mult:7.5,  fixed:25,  days:1,    batch:5, note:"Deshidratador · Setas secas · ×7.5+25g · 1 día · requiere 5 unidades por batch" },
  smoker:         { mult:2,    fixed:0,   days:0.035,batch:1, note:"Ahumador · Pescado ahumado · ×2 precio pescado · 50 minutos por batch" },
  loom:           { mult:0,    fixed:470, days:0.17, batch:1, note:"Telar · Tela · 470g fijo (entrada: Lana) · 4 horas por batch" },
};

const PROCESS_NOTES_EL = () => document.getElementById('process_note');
function updateProcessNote() {
  const type = document.getElementById('process_type').value;
  const el = PROCESS_NOTES_EL();
  if (el && PROCESS_DATA[type]) el.textContent = PROCESS_DATA[type].note;
}

// Tablas exactas de la wiki por nivel de Agricultura (0-14)
// Precio promedio incluido de la wiki directamente
// Sin fertilizante: Normal, Plata, Oro (sin Iridio)
// Básico: Normal, Plata, Oro
// Deluxe: Normal, Plata, Oro
// Lujo (ultra): Normal, Plata, Oro, Iridio
const QUALITY_TABLE = {
  none: [
    [0.97,0.02,0.01,0.00], // nivel 0
    [0.91,0.06,0.03,0.00],
    [0.85,0.10,0.05,0.00],
    [0.80,0.13,0.07,0.00],
    [0.75,0.16,0.09,0.00],
    [0.69,0.20,0.11,0.00],
    [0.64,0.23,0.13,0.00],
    [0.60,0.25,0.15,0.00],
    [0.55,0.28,0.17,0.00],
    [0.50,0.31,0.19,0.00],
    [0.46,0.33,0.21,0.00],
    [0.42,0.35,0.23,0.00],
    [0.38,0.37,0.25,0.00],
    [0.34,0.39,0.27,0.00],
    [0.30,0.41,0.29,0.00],
  ],
  basic: [
    [0.88,0.08,0.04,0.00],
    [0.77,0.15,0.08,0.00],
    [0.68,0.20,0.12,0.00],
    [0.59,0.26,0.15,0.00],
    [0.50,0.31,0.19,0.00],
    [0.42,0.35,0.23,0.00],
    [0.35,0.39,0.26,0.00],
    [0.28,0.42,0.30,0.00],
    [0.22,0.44,0.34,0.00],
    [0.16,0.47,0.37,0.00],
    [0.15,0.44,0.41,0.00],
    [0.14,0.41,0.45,0.00],
    [0.13,0.39,0.48,0.00],
    [0.12,0.36,0.52,0.00],
    [0.11,0.33,0.56,0.00],
  ],
  deluxe: [
    [0.78,0.14,0.08,0.00],
    [0.64,0.23,0.13,0.00],
    [0.52,0.30,0.18,0.00],
    [0.40,0.36,0.24,0.00],
    [0.30,0.41,0.29,0.00],
    [0.21,0.45,0.34,0.00],
    [0.15,0.45,0.40,0.00],
    [0.14,0.41,0.45,0.00],
    [0.13,0.37,0.50,0.00],
    [0.11,0.33,0.56,0.00],
    [0.10,0.29,0.61,0.00],
    [0.09,0.25,0.66,0.00],
    [0.07,0.21,0.72,0.00],
    [0.06,0.17,0.77,0.00],
    [0.04,0.13,0.82,0.00],
  ],
  luxury: [
    [0.00,0.84,0.10,0.06],
    [0.00,0.75,0.16,0.09],
    [0.00,0.66,0.22,0.13],
    [0.00,0.57,0.27,0.16],
    [0.00,0.49,0.31,0.20],
    [0.00,0.42,0.35,0.23],
    [0.00,0.35,0.39,0.27],
    [0.00,0.28,0.42,0.30],
    [0.00,0.22,0.45,0.34],
    [0.00,0.16,0.47,0.37],
    [0.00,0.11,0.48,0.41],
    [0.00,0.07,0.49,0.44],
    [0.00,0.03,0.50,0.47],
    [0.00,0.00,0.49,0.51],
    [0.00,0.00,0.46,0.55],
  ],
};
const QUALITY_MULT = [1.0, 1.25, 1.5, 2.0]; // Normal, Plata, Oro, Iridio

function avgQualityMult(fertType, farmingLevel) {
  const lvl = Math.min(14, Math.max(0, Math.floor(farmingLevel)));
  const row = QUALITY_TABLE[fertType][lvl];
  return row.reduce((sum, prob, i) => sum + prob * QUALITY_MULT[i], 0);
}

function updateFertCost() {
  const speedSel = document.getElementById('fertilizer');
  const qualSel  = document.getElementById('quality_fert');
  const speedCost = parseInt(speedSel.selectedOptions[0].dataset.cost) || 0;
  const qualCost  = parseInt(qualSel.selectedOptions[0].dataset.cost)  || 0;
  document.getElementById('fert_cost').value = speedCost + qualCost;
}

// ─── RECOLECCIÓN ────────────────────────────────────────────
const FORAGE_DB = {
  // Primavera
  rabano_silv:50, narciso:80, puerro:60, diente_leon:40,
  cebolleta:80, colmenilla:150, seta_comun_p:40, frambuesa:50,
  // Verano
  uva:80, baya_esp:80, guisante_dulce:50, seta_roja:75, helecho:90,
  // Otoño
  seta_comun_o:40, ciruela_salv:80, avellana:90, mora:75,
  chantarela:160, seta_lila:320,
  // Invierno
  raiz_invernal:70, fruta_cristal:150, name_nival:100, azafran:60, acebo:80,
  // Isla
  jengibre:60, coco:100, piña:100,
};

// ─── RESINERAS ──────────────────────────────────────────────
// days: días normales | daysHeavy: días con Grifo pesado
const TAPPER_DB = {
  maple:    { price:200,  days:9,   daysHeavy:4.5, note:"Jarabe de Arce · Arce · 9 días (4-5 con Grifo)" },
  oak:      { price:150,  days:7.5, daysHeavy:3.5, note:"Resina de Roble · Roble · 7-8 días (3-4 con Grifo)" },
  pine:     { price:100,  days:5.5, daysHeavy:2.5, note:"Brea de Pino · Pino · 5-6 días (2-3 con Grifo)" },
  mahogany: { price:15,   days:1,   daysHeavy:1,   note:"Savia · Caoba · 1 día (igual con Grifo)" },
  mystic:   { price:1000, days:7,   daysHeavy:3.5, note:"Sirope Místico · Árbol Místico · 7 días (3-4 con Grifo)" },
};

function loadTapperData() {
  const type = document.getElementById('tapper_type').value;
  const data = TAPPER_DB[type];
  const heavy = document.getElementById('tapper_heavy').checked;
  const el = document.getElementById('tapper_info');
  if (data && el) el.textContent = data.note;
}

function calcTapper() {
  const visible = document.getElementById('tapper_section').style.display !== 'none';
  if (!visible) return 0;
  const type    = document.getElementById('tapper_type').value;
  const count   = parseFloat(document.getElementById('tapper_count').value)   || 0;
  const days    = parseFloat(document.getElementById('tapper_days').value)    || 0;
  const heavy   = document.getElementById('tapper_heavy').checked;
  const tapperP = document.getElementById('tapper_tapper_prof').checked ? 1.25 : 1.0;
  const data    = TAPPER_DB[type];
  if (!data) return 0;
  const cycleDays  = heavy ? data.daysHeavy : data.days;
  const outputs    = Math.floor(days / cycleDays);
  const salePrice  = data.price * tapperP;
  return salePrice * outputs * count;
}

function loadForageData() {
  const type = document.getElementById('forage_type').value;
  document.getElementById('forage_price').value = FORAGE_DB[type] || 0;
}

function calcForage() {
  const visible = document.getElementById('foraging_section').style.display !== 'none';
  if (!visible) return 0;
  const price      = parseFloat(document.getElementById('forage_price').value)    || 0;
  const perDay     = parseFloat(document.getElementById('forage_per_day').value)  || 0;
  const days       = parseFloat(document.getElementById('forage_days').value)     || 0;
  const dehydrator = document.getElementById('forage_dehydrator').checked;
  const botanist   = document.getElementById('forage_botanist').checked;
  const artisanF   = document.getElementById('forage_artisan_f').checked;

  // Calidad: Botánico = siempre Iridio (×2), sino Normal (×1)
  const qualMult = botanist ? 2.0 : 1.0;
  const basePrice = price * qualMult;

  if (dehydrator) {
    // Deshidratador: 5 uds → 1 output = precio×7.5+25, 1 día
    const artisanMult = artisanF ? 1.4 : 1.0;
    const outputPrice = (price * 7.5 + 25) * artisanMult;
    const totalUnits  = perDay * days;
    const outputs     = Math.floor(totalUnits / 5);
    return outputPrice * outputs;
  } else {
    return basePrice * perDay * days;
  }
}

function loadCrops() {
  const select = document.getElementById('crop');
  select.innerHTML = '';
  let lastSeason = '';
  for (const name in CROPS_DB) {
    const crop = CROPS_DB[name];
    if (crop.season !== lastSeason) {
      const grp = document.createElement('optgroup');
      grp.label = '── ' + crop.season + ' ──';
      select.appendChild(grp);
      lastSeason = crop.season;
    }
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name + ' (' + crop.sell + 'g · ' + crop.grow + 'd)';
    select.appendChild(opt);
  }
  loadCropData();
}

function loadCropData() {
  const cropName = document.getElementById('crop').value;
  const crop = CROPS_DB[cropName];
  if (!crop) return;
  document.getElementById('seed_cost').value   = crop.seed;
  document.getElementById('sell_price').value  = crop.sell;
  document.getElementById('grow_days').value   = crop.grow;
  document.getElementById('regrow_days').value = crop.regrow;
  document.getElementById('multi').value       = crop.multi || 1;

  // Card resumen
  const sumEl = document.getElementById('crop_summary');
  const parts = [
    `<strong>${crop.season}</strong>`,
    `Semilla: <strong>${crop.seed}g</strong>`,
    `Venta: <strong>${crop.sell}g</strong>`,
    `Crece: <strong>${crop.grow}d</strong>`,
    crop.regrow > 0 ? `Rebrota: <strong>cada ${crop.regrow}d</strong>` : 'Sin rebrote',
    crop.multi > 1  ? `×${crop.multi}/cosecha` : '',
  ].filter(Boolean).join(' · ');
  sumEl.innerHTML = parts;
  sumEl.style.display = 'block';

  // Nota especial
  const noteEl = document.getElementById('crop_note');
  const notes = [];
  if (crop.multi && crop.multi > 1) notes.push(`Produce ${crop.multi} uds/cosecha`);
  if (crop.noTiller) notes.push('No beneficia de Tiller');
  if (crop.seedSource) notes.push(`Semilla: ${crop.seedSource}`);
  if (notes.length > 0) {
    noteEl.textContent = '⚠ ' + notes.join(' · ');
    noteEl.style.display = 'block';
  } else {
    noteEl.style.display = 'none';
  }
}

function fmt(n) { return Math.round(n).toLocaleString('es-CO') + 'g'; }

function calculate() {
  const plants     = parseFloat(document.getElementById('plants').value)     || 0;
  const tiles      = parseFloat(document.getElementById('tiles').value)      || 100;
  const seasonDays = parseFloat(document.getElementById('season_days').value)|| 28;
  const seedCost   = parseFloat(document.getElementById('seed_cost').value)  || 0;
  const sellPrice  = parseFloat(document.getElementById('sell_price').value) || 0;
  const growDays   = parseFloat(document.getElementById('grow_days').value)  || 1;
  const regrowDays = parseFloat(document.getElementById('regrow_days').value)|| 0;
  const multiYield = parseFloat(document.getElementById('multi').value)      || 1;
  const kegs       = parseFloat(document.getElementById('kegs').value)       || 0;
  const fertCost   = parseFloat(document.getElementById('fert_cost').value)  || 0;

  // noTiller: Grano de café y otros cultivos que el juego no considera verdura/fruta
  const cropName   = document.getElementById('crop').value;
  const cropData   = CROPS_DB[cropName] || {};
  const noTiller   = cropData.noTiller || false;

  const tillerRaw    = document.getElementById('tiller').checked       ? 0.10 : 0;
  const tiller       = noTiller ? 0 : tillerRaw;
  const artisan      = document.getElementById('artisan').checked      ? 0.40 : 0;
  const agriculturist= document.getElementById('agriculturist').checked? 0.10 : 0;
  const speedBonus   = parseFloat(document.getElementById('fertilizer').value) || 0;
  const qualFert     = document.getElementById('quality_fert').value;
  const farmingLevel = parseInt(document.getElementById('farming_level').value) || 0;
  const processType  = document.getElementById('process_type').value;
  const processData  = PROCESS_DATA[processType];

  // Días de crecimiento ajustados
  const totalSpeed = agriculturist + speedBonus;
  const growReal   = Math.max(1, Math.ceil(growDays * (1 - totalSpeed)));

  // Cosechas y replantaciones
  let harvests, replants;
  if (regrowDays > 0) {
    harvests = seasonDays >= growReal
      ? 1 + Math.max(0, Math.floor((seasonDays - growReal) / regrowDays))
      : 0;
    replants = 0;
  } else {
    harvests = seasonDays >= growReal ? Math.floor(seasonDays / growReal) : 0;
    replants = Math.max(0, harvests - 1);
  }

  // Precio ajustado por calidad según nivel de Agricultura
  const qualMult       = avgQualityMult(qualFert, farmingLevel);
  const qualAdjPrice   = sellPrice * qualMult;

  // Inversión total
  const totalInvest = (seedCost * plants * (1 + replants)) + (fertCost * tiles);

  // CRUDO con calidad y multi-cosecha
  const rawSellPrice = qualAdjPrice * (1 + tiller);
  const totalUnitsRaw = harvests * plants * multiYield;
  const rawProfit    = (rawSellPrice * totalUnitsRaw) - (seedCost * plants * (1 + replants)) - (fertCost * tiles);
  const rawPerDay    = rawProfit / seasonDays;

  // PROCESADO — calidad no afecta precio procesado (máquinas usan precio base)
  // multi-cosecha produce más unidades para procesar
  const procBaseSell = processData.fixed > 0
    ? processData.fixed
    : sellPrice * processData.mult + (processData.fixed || 0);
  const procSellPrice  = procBaseSell * (1 + artisan);
  const lotsPerSeason  = Math.floor(seasonDays / processData.days);
  const unitsAvailProc = harvests * plants * multiYield;
  // batch: unidades de input por output (deshidratador=5, resto=1)
  const outputsAvail   = Math.floor(unitsAvailProc / processData.batch);
  const outputsProc    = Math.min(outputsAvail, lotsPerSeason * kegs);
  const procProfit     = (procSellPrice * outputsProc) - (seedCost * plants * (1 + replants)) - (fertCost * tiles);
  const procPerDay     = procProfit / seasonDays;

  // ROI y mejor opción
  const roi  = totalInvest > 0 ? (Math.max(rawProfit, procProfit) / totalInvest * 100) : 0;
  const best = procProfit > rawProfit ? 'PROCESADO' : 'CRUDO';

  // ANIMALES
  const animalsVisible = document.getElementById('animals_section').style.display !== 'none';
  const animalProfit = animalsVisible ? calcAnimals(seasonDays) : 0;

  // ÁRBOLES FRUTALES
  const treeProfit = calcTrees();

  // PESCA
  const fishProfit   = calcFish();
  const forageProfit = calcForage();
  const tapperProfit = calcTapper();

  // ENVÍOS: mismo precio que tienda (wiki confirmado — no hay descuento)
  const rawProfitFinal = rawProfit;

  const bestCropProfit = Math.max(rawProfitFinal, procProfit);
  const grandTotal = bestCropProfit + animalProfit + treeProfit + fishProfit + forageProfit + tapperProfit;

  // Mostrar resultados
  document.getElementById('r_harvests').textContent    = harvests;
  document.getElementById('r_grow_real').textContent   = growReal;
  document.getElementById('r_quality_price').textContent = fmt(rawSellPrice);
  document.getElementById('r_raw').textContent         = fmt(rawProfitFinal);
  document.getElementById('r_proc').textContent        = fmt(procProfit);
  document.getElementById('r_best').textContent        = best;
  document.getElementById('r_raw_day').textContent     = fmt(rawProfitFinal / seasonDays);
  document.getElementById('r_proc_day').textContent    = fmt(procPerDay);
  document.getElementById('r_roi').textContent         = roi.toFixed(1) + '%';
  document.getElementById('r_invest').textContent      = fmt(totalInvest);

  const animCard   = document.getElementById('r_animals_card');
  const treeCard   = document.getElementById('r_trees_card');
  const fishCard   = document.getElementById('r_fish_card');
  const forageCard = document.getElementById('r_forage_card');
  const tapperCard = document.getElementById('r_tapper_card');
  const grandCard  = document.getElementById('r_grand_total_card');

  animCard.style.display   = (animalsVisible && animalProfit > 0) ? 'block' : 'none';
  treeCard.style.display   = (treeProfit > 0)   ? 'block' : 'none';
  fishCard.style.display   = (fishProfit > 0)   ? 'block' : 'none';
  forageCard.style.display = (forageProfit > 0) ? 'block' : 'none';
  tapperCard.style.display = (tapperProfit > 0) ? 'block' : 'none';

  if (animalProfit > 0 || treeProfit > 0 || fishProfit > 0 || forageProfit > 0 || tapperProfit > 0) {
    grandCard.style.display = 'block';
    document.getElementById('r_animals').textContent     = fmt(animalProfit);
    document.getElementById('r_trees').textContent       = fmt(treeProfit);
    document.getElementById('r_fish').textContent        = fmt(fishProfit);
    document.getElementById('r_forage').textContent      = fmt(forageProfit);
    document.getElementById('r_tapper').textContent      = fmt(tapperProfit);
    document.getElementById('r_grand_total').textContent = fmt(grandTotal);
  } else {
    grandCard.style.display = 'none';
  }

  const replantInfo = regrowDays === 0
    ? `Replantación manual: ${harvests} cosechas × ${growReal}d`
    : `Rebrote cada ${regrowDays}d: ${harvests} cosechas`;
  const qualLabels = {none:'Sin fertilizante',basic:'Básico',deluxe:'Deluxe',luxury:'Lujo'};

  document.getElementById('r_note').textContent =
    `${replantInfo} | Calidad: ${qualLabels[qualFert]} Nv.Agric.${farmingLevel} (×${qualMult.toFixed(3)} precio) | ` +
    `Crudo: ${fmt(rawSellPrice)}/u × ${harvests * plants} uds = ${fmt(rawProfit)} | ` +
    `Procesado: ${fmt(procSellPrice)}/u × ${outputsProc} uds = ${fmt(procProfit)} | ` +
    `Velocidad: ${totalSpeed > 0 ? `-${(totalSpeed*100).toFixed(0)}% (${growDays}d→${growReal}d)` : 'sin bonus'}`;

  document.getElementById('results').classList.add('visible');
  document.getElementById('results').scrollIntoView({behavior:'smooth', block:'nearest'});
}

// ─── ÁRBOLES FRUTALES ───────────────────────────────────────
// Precios por año (calidad sube 1★ por año del árbol)
// año1=Normal, año2=Plata(×1.25), año3=Oro(×1.5), año4+=Iridio(×2)
// sell = precio Normal. La calidad se aplica con TREE_QUALITY_MULT
const TREES_DB = {
  apricot:     { sell:50,  sapling:2000, season:'🌸 Primavera', days:28 },
  cherry:      { sell:80,  sapling:3400, season:'🌸 Primavera', days:28 },
  orange:      { sell:100, sapling:4000, season:'☀️ Verano',    days:28 },
  peach:       { sell:140, sapling:6000, season:'☀️ Verano',    days:28 },
  apple:       { sell:100, sapling:4000, season:'🍂 Otoño',     days:28 },
  pomegranate: { sell:140, sapling:6000, season:'🍂 Otoño',     days:28 },
  banana:      { sell:150, sapling:0,    season:'🏝️ Isla/Invernadero', days:28 },
  mango:       { sell:130, sapling:0,    season:'🏝️ Isla/Invernadero', days:28 },
};
// Calidad por año: año1=Normal, año2=Plata, año3=Oro, año4+=Iridio
const TREE_QUALITY_MULT = [1.0, 1.25, 1.5, 2.0];

function loadTreeData() {
  const type = document.getElementById('tree_type').value;
  const tree = TREES_DB[type];
  const inGH  = document.getElementById('tree_greenhouse').value === '1';
  const days  = inGH ? 112 : 28;
  const info  = document.getElementById('tree_info');
  info.textContent = `${tree.season} · ${tree.sell}g/fruta base · ${days} días productivos · brote ${tree.sapling}g`;
}

function calcTrees() {
  const visible = document.getElementById('trees_section').style.display !== 'none';
  if (!visible) return 0;
  const type   = document.getElementById('tree_type').value;
  const count  = parseFloat(document.getElementById('tree_count').value) || 0;
  const year   = Math.min(4, Math.max(1, parseInt(document.getElementById('tree_year').value) || 1));
  const inGH   = document.getElementById('tree_greenhouse').value === '1';
  const artisan= document.getElementById('artisan').checked ? 0.40 : 0;
  const tiller = document.getElementById('tiller').checked  ? 0.10 : 0;
  const tree   = TREES_DB[type];
  const qualM  = TREE_QUALITY_MULT[year - 1];
  const days   = inGH ? 112 : 28;
  const sellRaw = tree.sell * qualM * (1 + tiller);
  return sellRaw * count * days;
}

// ─── PESCA ──────────────────────────────────────────────────
// Precios base exactos de la wiki (precio normal sin profesión)
const FISH_DB = {
  // Primavera
  anchoa:30, lubina:100, pez_gato:200, pez_sol:30, arenque:30,
  anguila:85, sardina:40, sabalo:60, platija:100, fletan:80, leyenda:5000,
  // Verano
  pez_globo:200, atun:100, trucha_arcoiris:65, pez_gato_v:200, sauri:1000,
  pulpo:150, pargo:50, superpepino:250, esturion:200, tilapia:75,
  dorado:100, salmonete:30, pez_carmesi:1500,
  // Otoño
  perca_peq:50, perca:100, salmon:75, tiger_trout:150, albacore:75,
  pez_madera:75, carpa:30, lucio:100, void_salmon:150, rape:900, linterna:120,
  // Invierno
  atun_inv:100, sardina_inv:40, lucio_inv:100, pez_hielo:500, calamar:80,
  pepino_mar:75, superpepino_i:250, pez_piedra:500, pez_fantasma_i:45,
  pez_glaciar:1000, anguila_lava_i:700, carpa_mutante:1000,
  // Todo el año
  carpa_all:30, perca_peq_all:50, pez_madera_all:75, perca_all:100,
  lucio_all:100, void_salmon_all:150, pez_fantasma_all:45,
  pez_piedra_all:500, pez_hielo_all:500, anguila_lava_all:700,
  carpa_mutante_all:1000,
};

function loadFishData() {
  const type = document.getElementById('fish_type').value;
  document.getElementById('fish_price').value = FISH_DB[type] || 0;
}

function calcFish() {
  const visible = document.getElementById('fishing_section').style.display !== 'none';
  if (!visible) return 0;
  const price   = parseFloat(document.getElementById('fish_price').value)    || 0;
  const perDay  = parseFloat(document.getElementById('fish_per_day').value)  || 0;
  const days    = parseFloat(document.getElementById('fish_days').value)     || 0;
  const smoker  = document.getElementById('fish_smoker').checked  ? 2.0 : 1.0;
  const fisher  = document.getElementById('fish_fisher').checked  ? 1.25 : 1.0;
  const angler  = document.getElementById('fish_angler').checked  ? 1.50 : 1.0;
  const profMult= Math.max(fisher, angler); // no se acumulan
  return price * smoker * profMult * perDay * days;
}

// ─── INVERNADERO ────────────────────────────────────────────
function toggleGreenhouseMode() {
  const active = document.getElementById('greenhouse_mode').checked;
  const info = document.getElementById('gh_info');
  info.style.display = active ? 'block' : 'none';
  if (active) {
    document.getElementById('season_days').value = 112;
    document.getElementById('tiles').value = 120;
  } else {
    document.getElementById('season_days').value = 28;
  }
}

// ─── AUXILIARES ─────────────────────────────────────────────
function toggleSection(sectionId, btnId) {
  const sec = document.getElementById(sectionId);
  const btn = document.getElementById(btnId);
  const isHidden = sec.style.display === 'none';
  sec.style.display = isHidden ? 'block' : 'none';
  const label = btn.textContent.includes('+') ? btn.textContent.replace('+ ','- ') : btn.textContent.replace('- ','+ ');
  btn.textContent = label;
  if (sectionId === 'trees_section' && isHidden) loadTreeData();
  if (sectionId === 'fishing_section' && isHidden) loadFishData();
}

loadCrops();
updateProcessNote();