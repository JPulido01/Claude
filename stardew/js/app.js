// Lista plana de productos animales con crudo y procesado
// saleMult: precio crudo se multiplica por (amistad/1000+0.3) × rancher
// processed: si existe, se puede vender procesado (no afecta amistad, sí Artisan excepto aceite)
const ANIMAL_PRODUCTS = [
  // Corral (Coop) — afectados por Coopmaster
  {name:"Huevo",             type:"coop", price:50,  freq_days:1, processed:{name:"Mayonesa",          price:190,  machine:"Mayonesera", artisan:true,  qty:1}},
  {name:"Huevo XXL",         type:"coop", price:95,  freq_days:1, processed:{name:"Mayonesa Oro",       price:380,  machine:"Mayonesera", artisan:true,  qty:1}},
  {name:"Huevo Marrón",      type:"coop", price:50,  freq_days:1, processed:{name:"Mayonesa",           price:190,  machine:"Mayonesera", artisan:true,  qty:1}},
  {name:"Huevo Marrón XXL",  type:"coop", price:95,  freq_days:1, processed:{name:"Mayonesa Oro",       price:380,  machine:"Mayonesera", artisan:true,  qty:1}},
  {name:"Huevo Sombrio",     type:"coop", price:65,  freq_days:1, processed:{name:"Mayonesa Sombría",   price:275,  machine:"Mayonesera", artisan:true,  qty:1}},
  {name:"Huevo Dorado",      type:"coop", price:500, freq_days:1, processed:{name:"Mayonesa Dorada",    price:380,  machine:"Mayonesera", artisan:true,  qty:3}},
  {name:"Huevo de Pato",     type:"coop", price:95,  freq_days:1, processed:{name:"Mayonesa Pato",      price:375,  machine:"Mayonesera", artisan:true,  qty:1}},
  {name:"Pluma de Pato",     type:"coop", price:250, freq_days:2, processed:null},
  {name:"Huevo Dinosaurio",  type:"coop", price:350, freq_days:7, processed:{name:"Mayo. Dinosaurio",   price:800,  machine:"Mayonesera", artisan:true,  qty:1}},
  {name:"Huevo Avestruz",    type:"coop", price:600, freq_days:7, processed:{name:"Mayonesa ×10",       price:1900, machine:"Mayonesera", artisan:true,  qty:10}},
  {name:"Lana (Conejo)",     type:"coop", price:340, freq_days:4, processed:{name:"Tela",               price:470,  machine:"Telar",      artisan:true,  qty:1}},
  {name:"Pata de Conejo",    type:"coop", price:565, freq_days:4, processed:null},
  // Establo (Barn) — afectados por Shepherd
  {name:"Leche",             type:"barn", price:125, freq_days:1, processed:{name:"Queso",              price:230,  machine:"Prensa",     artisan:true,  qty:1}},
  {name:"Leche XXL",         type:"barn", price:190, freq_days:1, processed:{name:"Queso Oro",          price:345,  machine:"Prensa",     artisan:true,  qty:1}},
  {name:"Leche de Cabra",    type:"barn", price:225, freq_days:2, processed:{name:"Queso Cabra",        price:400,  machine:"Prensa",     artisan:true,  qty:1}},
  {name:"Leche Cabra XXL",   type:"barn", price:345, freq_days:2, processed:{name:"Queso Cabra Oro",    price:600,  machine:"Prensa",     artisan:true,  qty:1}},
  {name:"Lana (Oveja)",      type:"barn", price:340, freq_days:3, processed:{name:"Tela",               price:470,  machine:"Telar",      artisan:true,  qty:1}},
  {name:"Trufa",             type:"barn", price:625, freq_days:1, processed:{name:"Aceite de Trufa",    price:1065, machine:"Aceitera",   artisan:false, qty:1}},
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
  updateAnimalDisplay(id);
}

function updateAnimalDisplay(id) {
  const seasonDays     = parseFloat(document.getElementById('season_days').value) || 28;
  const artisanMult    = document.getElementById('artisan').checked    ? 1.4  : 1.0;
  const rancherMult    = document.getElementById('rancher').checked    ? 1.2  : 1.0;
  const shepherdMult   = document.getElementById('shepherd').checked   ? 1.25 : 1.0;
  const coopmasterMult = document.getElementById('coopmaster').checked ? 1.25 : 1.0;

  const idx    = parseInt(document.getElementById(`animal_prod_${id}`).value) || 0;
  const mode   = document.getElementById(`animal_sale_${id}`).value;

  const prod   = ANIMAL_PRODUCTS[idx];

  const priceCell = document.getElementById(`animal_price_${id}`);
  const prodsCell = document.getElementById(`animal_prods_${id}`);
  if (!prod || !priceCell || !prodsCell) return;

  const profQualMult = prod.type === 'barn' ? shepherdMult : coopmasterMult;
  let salePrice;
  if (mode === 'proc' && prod.processed) {
    const am = prod.processed.artisan ? artisanMult : 1.0;
    salePrice = prod.processed.price * prod.processed.qty * am;
  } else {
    salePrice = prod.price * rancherMult * profQualMult;
  }

  const productions = Math.floor(seasonDays / (prod.freq_days || 1));
  priceCell.textContent = Math.round(salePrice) + 'g';
  prodsCell.textContent = productions + '×';
}

function updateAllAnimalDisplays() {
  document.querySelectorAll('.animal-row').forEach(row => {
    const id = row.id.replace('animal_row_', '');
    updateAnimalDisplay(id);
  });
}

function addAnimalRow() {
  const container = document.getElementById('animal_rows');
  if (animalRowCount === 0) {
    const hdr = document.createElement('div');
    hdr.className = 'animal-header';
    hdr.id = 'animal_header';
    hdr.innerHTML = '<span>Producto</span><span>Venta</span><span>Diario</span><span>Precio/u</span><span>×/Temp</span><span></span>';
    container.appendChild(hdr);
  }
  const id  = animalRowCount++;
  const row = document.createElement('div');
  row.className = 'animal-row';
  row.id = `animal_row_${id}`;
  row.innerHTML = `
    <select id="animal_prod_${id}" onchange="updateSaleOpts(${id})">${buildProductOpts()}</select>
    <select id="animal_sale_${id}" onchange="updateAnimalDisplay(${id})"></select>
    <input type="number" id="animal_count_${id}" value="4" min="1">
    <span id="animal_price_${id}" class="animal-stat">—</span>
    <span id="animal_prods_${id}" class="animal-stat">—</span>
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
  const artisanMult    = document.getElementById('artisan').checked    ? 1.4  : 1.0;
  const rancherMult    = document.getElementById('rancher').checked    ? 1.2  : 1.0;
  const shepherdMult   = document.getElementById('shepherd').checked   ? 1.25 : 1.0;
  const coopmasterMult = document.getElementById('coopmaster').checked ? 1.25 : 1.0;
  let total = 0;
  rows.forEach(row => {
    const id   = row.id.replace('animal_row_', '');
    const idx  = parseInt(document.getElementById(`animal_prod_${id}`).value) || 0;
    const mode = document.getElementById(`animal_sale_${id}`).value;
    const count  = parseFloat(document.getElementById(`animal_count_${id}`).value) || 0;
  
    const prod   = ANIMAL_PRODUCTS[idx];
    if (!prod) return;
    const productions = seasonDays / (prod.freq_days || 1);
    const profQualMult = prod.type === 'barn' ? shepherdMult : coopmasterMult;
    let salePrice;
    if (mode === 'proc' && prod.processed) {
      const am = prod.processed.artisan ? artisanMult : 1.0;
      salePrice = prod.processed.price * prod.processed.qty * am;
    } else {
      salePrice = prod.price * rancherMult * profQualMult;
    }
    total += salePrice * count * productions;
  });
  return total;
}

// seed: precio semilla (Pierre salvo indicación), sell: precio venta base, grow: días, regrow: rebrote (0=no), season: temporada
const CROPS_DB = [
  // ── PRIMAVERA ──────────────────────────────────────────────
  {name:"Allium azul",       seed:30,  sell:50,  grow:7,  regrow:0, season:"🌸 Primavera"},
  {name:"Ajo",               seed:40,  sell:60,  grow:4,  regrow:0, season:"🌸 Primavera"},
  {name:"Chirivía",          seed:20,  sell:35,  grow:4,  regrow:0, season:"🌸 Primavera"},
  {name:"Coliflor",          seed:80,  sell:175, grow:12, regrow:0, season:"🌸 Primavera"},
  {name:"Col Rizada",        seed:70,  sell:110, grow:6,  regrow:0, season:"🌸 Primavera"},
  {name:"Fresa",             seed:100, sell:120, grow:8,  regrow:4, season:"🌸 Primavera"},
  {name:"Judía Verde",       seed:60,  sell:40,  grow:10, regrow:3, season:"🌸 Primavera"},
  {name:"Papa",              seed:50,  sell:80,  grow:6,  regrow:0, season:"🌸 Primavera"},
  {name:"Ruibarbo",          seed:100, sell:220, grow:13, regrow:0, season:"🌸 Primavera", seedSource:"Oasis (desierto)"},
  {name:"Tulipán",           seed:20,  sell:30,  grow:6,  regrow:0, season:"🌸 Primavera"},
  {name:"Zanahoria",         seed:0,   sell:35,  grow:3,  regrow:0, season:"🌸 Primavera"},
  // ── VERANO ─────────────────────────────────────────────────
  {name:"Amapola",           seed:100, sell:140, grow:7,  regrow:0, season:"☀️ Verano"},
  {name:"Arándano",          seed:80,  sell:50,  grow:13, regrow:4, season:"☀️ Verano"},
  {name:"Carambola (Oasis)", seed:400, sell:750, grow:13, regrow:0, season:"☀️ Verano",   seedSource:"Oasis (desierto)"},
  {name:"Chile Picante",     seed:40,  sell:40,  grow:5,  regrow:3, season:"☀️ Verano"},
  {name:"Girasol",           seed:200, sell:80,  grow:8,  regrow:0, season:"☀️ Verano"},
  {name:"Lentejuela",        seed:50,  sell:90,  grow:8,  regrow:0, season:"☀️ Verano"},
  {name:"Lombarda",          seed:100, sell:260, grow:9,  regrow:0, season:"☀️ Verano"},
  {name:"Lúpulo",            seed:60,  sell:25,  grow:11, regrow:1, season:"☀️ Verano"},
  {name:"Maíz",              seed:150, sell:50,  grow:14, regrow:4, season:"☀️ Verano"},
  {name:"Melón",             seed:80,  sell:250, grow:12, regrow:0, season:"☀️ Verano"},
  {name:"Rábano",            seed:40,  sell:90,  grow:6,  regrow:0, season:"☀️ Verano"},
  {name:"Tomate",            seed:50,  sell:60,  grow:11, regrow:4, season:"☀️ Verano"},
  {name:"Trigo",             seed:10,  sell:25,  grow:4,  regrow:0, season:"☀️ Verano"},
  // ── OTOÑO ──────────────────────────────────────────────────
  {name:"Alcachofa",         seed:30,  sell:160, grow:8,  regrow:0, season:"🍂 Otoño"},
  {name:"Amaranto",          seed:70,  sell:150, grow:7,  regrow:0, season:"🍂 Otoño"},
  {name:"Arándano Rojo",     seed:240, sell:75,  grow:7,  regrow:5, season:"🍂 Otoño",  multi:3},
  {name:"Berenjena",         seed:20,  sell:60,  grow:5,  regrow:5, season:"🍂 Otoño"},
  {name:"Bok Choy",          seed:50,  sell:80,  grow:4,  regrow:0, season:"🍂 Otoño"},
  {name:"Calabaza",          seed:100, sell:320, grow:13, regrow:0, season:"🍂 Otoño"},
  {name:"Col china",         seed:100, sell:175, grow:12, regrow:0, season:"🍂 Otoño"},
  {name:"Grosella",          seed:80,  sell:75,  grow:13, regrow:3, season:"🍂 Otoño",  multi:2},
  {name:"Lúpulo (Otoño)",    seed:60,  sell:25,  grow:11, regrow:1, season:"🍂 Otoño"},
  {name:"Ñame",              seed:60,  sell:160, grow:10, regrow:0, season:"🍂 Otoño"},
  {name:"Remolacha",         seed:20,  sell:100, grow:6,  regrow:0, season:"🍂 Otoño"},
  {name:"Uva",               seed:60,  sell:80,  grow:10, regrow:3, season:"🍂 Otoño"},
  {name:"Sweet Gem Berry",   seed:1000,sell:3000,grow:24, regrow:0, season:"🍂 Otoño",    seedSource:"Carro Ambulante (precio variable 600-1000g)"},
  // ── TODO EL AÑO / INVERNADERO ──────────────────────────────
  {name:"Fruta Antigua",     seed:100, sell:550, grow:28, regrow:7, season:"🏡 Invernadero", seedSource:"Carro Ambulante / donación Museo"},
  // Grano de café: 4 granos por cosecha, rebrote cada 2 días. No se beneficia de Tiller.
  // Semilla = el propio grano (2500g en Carro Ambulante solo para la primera planta)
  {name:"Grano de café",     seed:2500,sell:15,  grow:10, regrow:2, season:"🌸☀️ Primavera/Verano", multi:4, noTiller:true, seedSource:"Carro Ambulante (~2500g) / Duende del polvo (1%)"},
];

// mult: multiplicador sobre precio base del cultivo
// fixed: precio fijo (ignora precio base del cultivo, ej: cerveza siempre 200g)
// days: días de procesamiento
// batch: unidades de input por batch (deshidratador requiere 5)
// note: descripción para mostrar al usuario
const PROCESS_DATA = [
  {name:"keg_wine",       mult:3,    fixed:0,   days:7,    batch:1, note:"Tonel · Vino · ×3 precio fruta · 7 días por batch"},
  {name:"keg_juice",      mult:2.25, fixed:0,   days:4,    batch:1, note:"Tonel · Jugo · ×2.25 precio vegetal · 4 días por batch"},
  {name:"keg_mead",       mult:0,    fixed:300, days:0.42, batch:1, note:"Tonel · Hidromiel · 300g fijo (entrada: Miel) · 10 horas por batch"},
  {name:"keg_pale_ale",   mult:0,    fixed:300, days:1.56, batch:1, note:"Tonel · Cerveza Pálida · 300g fijo (entrada: Lúpulo) · ~1.5 días por batch"},
  {name:"keg_beer",       mult:0,    fixed:200, days:1,    batch:1, note:"Tonel · Cerveza · 200g fijo (entrada: Trigo) · 1 día por batch"},
  {name:"cask_wine",      mult:3,    fixed:0,   days:7,    batch:1, note:"Barril · Vino/Mermelada · ×3 precio fruta · 7 días (calidad base)"},
  {name:"cask_juice",     mult:2.25, fixed:0,   days:4,    batch:1, note:"Barril · Zumo/Encurtido · ×2.25 precio vegetal · 4 días (calidad base)"},
  {name:"jar_jam",        mult:2,    fixed:50,  days:2.5,  batch:1, note:"Envasadora · Mermelada · ×2+50g precio fruta · 2-3 días por batch"},
  {name:"jar_pickle",     mult:2,    fixed:50,  days:2.5,  batch:1, note:"Envasadora · Encurtido · ×2+50g precio vegetal · 2-3 días por batch"},
  {name:"dryer_fruit",    mult:7.5,  fixed:25,  days:1,    batch:5, note:"Deshidratador · Fruta seca · ×7.5+25g · 1 día · requiere 5 unidades por batch"},
  {name:"dryer_mushroom", mult:7.5,  fixed:25,  days:1,    batch:5, note:"Deshidratador · Setas secas · ×7.5+25g · 1 día · requiere 5 unidades por batch"},
  {name:"smoker",         mult:2,    fixed:0,   days:0.035,batch:1, note:"Ahumador · Pescado ahumado · ×2 precio pescado · 50 minutos por batch"},
  {name:"loom",           mult:0,    fixed:470, days:0.17, batch:1, note:"Telar · Tela · 470g fijo (entrada: Lana) · 4 horas por batch"},
];

function updateProcessNote() {
  const typeEl = document.getElementById('process_type');
  const noteEl = document.getElementById('process_note');
  if (!typeEl || !noteEl) return;
  const data = PROCESS_DATA.find(p => p.name === typeEl.value);
  if (data) noteEl.textContent = data.note;
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
  updateCropHarvests();
}

// ─── RECOLECCIÓN ────────────────────────────────────────────
const FORAGE_DB = [
  // Primavera
  {name:"rabano_silv", sell:50},  {name:"narciso",      sell:80},  {name:"puerro",       sell:60},  {name:"diente_leon",  sell:40},
  {name:"cebolleta",   sell:80},  {name:"colmenilla",   sell:150}, {name:"seta_comun_p", sell:40},  {name:"frambuesa",    sell:50},
  // Verano
  {name:"uva",         sell:80},  {name:"baya_esp",     sell:80},  {name:"guisante_dulce",sell:50}, {name:"seta_roja",    sell:75},  {name:"helecho", sell:90},
  // Otoño
  {name:"seta_comun_o",sell:40},  {name:"ciruela_salv", sell:80},  {name:"avellana",     sell:90},  {name:"mora",         sell:75},
  {name:"chantarela",  sell:160}, {name:"seta_lila",    sell:320},
  // Invierno
  {name:"raiz_invernal",sell:70}, {name:"fruta_cristal",sell:150}, {name:"name_nival",   sell:100}, {name:"azafran",      sell:60},  {name:"acebo", sell:80},
  // Isla
  {name:"jengibre",    sell:60},  {name:"coco",         sell:100}, {name:"piña",         sell:100},
];

// ─── RESINERAS ──────────────────────────────────────────────
// days: días normales | daysHeavy: días con Grifo pesado
const TAPPER_DB = [
  {name:"maple",    price:200,  days:9,   daysHeavy:4.5, note:"Jarabe de Arce · Arce · 9 días (4-5 con Grifo)"},
  {name:"oak",      price:150,  days:7.5, daysHeavy:3.5, note:"Resina de Roble · Roble · 7-8 días (3-4 con Grifo)"},
  {name:"pine",     price:100,  days:5.5, daysHeavy:2.5, note:"Brea de Pino · Pino · 5-6 días (2-3 con Grifo)"},
  {name:"mahogany", price:15,   days:1,   daysHeavy:1,   note:"Savia · Caoba · 1 día (igual con Grifo)"},
  {name:"mystic",   price:1000, days:7,   daysHeavy:3.5, note:"Sirope Místico · Árbol Místico · 7 días (3-4 con Grifo)"},
];

function loadTapperData() {
  const type = document.getElementById('tapper_type').value;
  const data = TAPPER_DB.find(t => t.name === type);
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
  const data    = TAPPER_DB.find(t => t.name === type);
  if (!data) return 0;
  const cycleDays  = heavy ? data.daysHeavy : data.days;
  const outputs    = Math.floor(days / cycleDays);
  const salePrice  = data.price * tapperP;
  return salePrice * outputs * count;
}

function loadForageData() {
  const type = document.getElementById('forage_type').value;
  document.getElementById('forage_price').value = (FORAGE_DB.find(f => f.name === type)?.sell) || 0;
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
  // Gatherer: 20% de probabilidad de cosecha doble → ×1.2 en cantidad efectiva
  const gathererMult = document.getElementById('gatherer').checked ? 1.2 : 1.0;

  const qualMult  = botanist ? 2.0 : 1.0;
  const basePrice = price * qualMult;
  const effectivePerDay = perDay * gathererMult;

  if (dehydrator) {
    const artisanMult = artisanF ? 1.4 : 1.0;
    const outputPrice = (price * 7.5 + 25) * artisanMult;
    const totalUnits  = effectivePerDay * days;
    const outputs     = Math.floor(totalUnits / 5);
    return outputPrice * outputs;
  } else {
    return basePrice * effectivePerDay * days;
  }
}

// ─── TABLA MULTI-CULTIVO ─────────────────────────────────────
function buildCropTable() {
  const tbody = document.getElementById('crop_table_body');
  if (!tbody) return;
  tbody.innerHTML = '';
  let lastSeason = '';
  for (const crop of CROPS_DB) {
    // Cabecera de temporada
    if (crop.season !== lastSeason) {
      lastSeason = crop.season;
      const tr = document.createElement('tr');
      tr.className = 'crop-season-row';
      tr.innerHTML = `<td colspan="5">${crop.season}</td>`;
      tbody.appendChild(tr);
    }
    // Etiquetas extra
    const badges = [];
    if (crop.regrow > 0) badges.push(`🔄${crop.regrow}d`);
    if (crop.multi  > 1) badges.push(`×${crop.multi}`);
    if (crop.noTiller)   badges.push('no Tiller');

    const tr = document.createElement('tr');
    tr.className = 'crop-row';
    tr.dataset.crop = crop.name;
    tr.innerHTML = `
      <td class="crop-name">${crop.name}${badges.length ? `<small style="color:var(--text-dim);font-size:13px;">(${badges.join(' · ')})</small>` : ''}</td>
      <td class="crop-buy">${crop.seed > 0 ? crop.seed + 'g' : '—'}</td>
      <td class="crop-sell">${crop.sell}g</td>
      <td class="crop-harvests" data-crop="${crop.name}">—</td>
      <td class="crop-qty-cell"><input type="number" class="crop-qty" data-crop="${crop.name}" value="0" min="0" placeholder="0"></td>
    `;
    tbody.appendChild(tr);
  }
  updateCropHarvests();
}

function updateCropHarvests() {
  const seasonDays = parseFloat(document.getElementById('season_days').value) || 28;
  const agri       = document.getElementById('agriculturist').checked ? 0.10 : 0;
  const speedBonus = parseFloat(document.getElementById('fertilizer').value) || 0;
  const totalSpeed = agri + speedBonus;

  document.querySelectorAll('.crop-harvests').forEach(cell => {
    const name = cell.dataset.crop;
    const crop = CROPS_DB.find(c => c.name === name);
    if (!crop) return;

    const growReal = Math.max(1, Math.ceil(crop.grow * (1 - totalSpeed)));
    const regrow   = crop.regrow || 0;
    let text;

    if (regrow > 0) {
      const harvests    = seasonDays >= growReal
        ? 1 + Math.max(0, Math.floor((seasonDays - growReal) / regrow))
        : 0;
      const regrowCount = Math.max(0, harvests - 1);
      text = harvests > 0 ? `1+${regrowCount} 🔄` : '—';
    } else {
      const harvests = seasonDays >= growReal
        ? Math.floor(seasonDays / growReal)
        : 0;
      text = harvests > 0 ? `${harvests}×` : '—';
    }

    cell.textContent = text;
  });
}

function calcCrops(seasonDays) {
  const seedsPurchased = document.getElementById('seeds_purchased').checked;
  const tillerRaw    = document.getElementById('tiller').checked        ? 0.10 : 0;
  const agriculturist= document.getElementById('agriculturist').checked ? 0.10 : 0;
  const speedBonus   = parseFloat(document.getElementById('fertilizer').value) || 0;
  const qualMult  = 1.0;
  const fertCost  = parseFloat(document.getElementById('fert_cost').value) || 0;
  const totalSpeed   = agriculturist + speedBonus;

  let totalProfit = 0;
  let totalInvest = 0;

  document.querySelectorAll('.crop-qty').forEach(input => {
    const qty = parseFloat(input.value) || 0;
    if (qty <= 0) return;

    const name = input.dataset.crop;
    const crop = CROPS_DB.find(c => c.name === name);
    if (!crop) return;

    const noTiller = crop.noTiller || false;
    const tiller   = noTiller ? 0 : tillerRaw;
    const multi    = crop.multi || 1;
    const growReal = Math.max(1, Math.ceil(crop.grow * (1 - totalSpeed)));
    const regrow   = crop.regrow || 0;

    let harvests, replants;
    if (regrow > 0) {
      harvests = seasonDays >= growReal ? 1 + Math.max(0, Math.floor((seasonDays - growReal) / regrow)) : 0;
      replants = 0;
    } else {
      harvests = seasonDays >= growReal ? Math.floor(seasonDays / growReal) : 0;
      replants = Math.max(0, harvests - 1);
    }

    const rawSellPrice  = crop.sell * qualMult * (1 + tiller);
    const totalUnits    = harvests * qty * multi;
    const seedDeduction = seedsPurchased ? crop.seed * qty * (1 + replants) : 0;
    const invest        = seedDeduction + (fertCost * qty);
    const profit        = (rawSellPrice * totalUnits) - invest;

    totalProfit += profit;
    totalInvest += invest;
  });

  return { profit: totalProfit, invest: totalInvest };
}

function fmt(n) { return Math.round(n).toLocaleString('es-CO') + 'g'; }

function calculate() {
  const seasonDays   = parseFloat(document.getElementById('season_days').value) || 28;
  const cropsVisible = document.getElementById('crops_section').style.display !== 'none';

  // ─── CULTIVOS (tabla multi-cultivo) ────────────────────────
  const cropResult     = cropsVisible ? calcCrops(seasonDays) : { profit: 0, invest: 0 };
  const bestCropProfit = cropResult.profit;
  const totalCropInvest= cropResult.invest;

  // ─── ANIMALES ───────────────────────────────────────────────
  const animalsVisible = document.getElementById('animals_section').style.display !== 'none';
  const animalProfit   = animalsVisible ? calcAnimals(seasonDays) : 0;

  // ─── ÁRBOLES FRUTALES / PESCA / RECOLECCIÓN / RESINERAS ───
  const treeProfit   = calcTrees();
  const fishProfit   = calcFish();
  const forageProfit = calcForage();
  const tapperProfit = calcTapper();

  const grandTotal = bestCropProfit + animalProfit + treeProfit + fishProfit + forageProfit + tapperProfit;

  // ─── TARJETAS DE CULTIVOS ───────────────────────────────────
  const cropCard    = document.getElementById('r_crops_card');
  const investCard  = document.getElementById('r_invest_card');
  if (cropCard)   cropCard.style.display   = cropsVisible ? 'block' : 'none';
  if (investCard) investCard.style.display = cropsVisible ? 'block' : 'none';
  if (cropsVisible) {
    document.getElementById('r_crops').textContent  = fmt(bestCropProfit);
    document.getElementById('r_invest').textContent = fmt(totalCropInvest);
  }

  // ─── TARJETAS COMBINADAS ────────────────────────────────────
  const animCard   = document.getElementById('r_animals_card');
  const treeCard   = document.getElementById('r_trees_card');
  const fishCard   = document.getElementById('r_fish_card');
  const forageCard = document.getElementById('r_forage_card');
  const tapperCard = document.getElementById('r_tapper_card');
  const grandCard  = document.getElementById('r_grand_total_card');

  animCard.style.display   = (animalsVisible && animalProfit > 0) ? 'block' : 'none';
  treeCard.style.display   = (treeProfit   > 0) ? 'block' : 'none';
  fishCard.style.display   = (fishProfit   > 0) ? 'block' : 'none';
  forageCard.style.display = (forageProfit > 0) ? 'block' : 'none';
  tapperCard.style.display = (tapperProfit > 0) ? 'block' : 'none';

  const anyResult = cropsVisible || animalProfit > 0 || treeProfit > 0 || fishProfit > 0 || forageProfit > 0 || tapperProfit > 0;
  grandCard.style.display = anyResult ? 'block' : 'none';
  if (anyResult) {
    document.getElementById('r_animals').textContent     = fmt(animalProfit);
    document.getElementById('r_trees').textContent       = fmt(treeProfit);
    document.getElementById('r_fish').textContent        = fmt(fishProfit);
    document.getElementById('r_forage').textContent      = fmt(forageProfit);
    document.getElementById('r_tapper').textContent      = fmt(tapperProfit);
    document.getElementById('r_grand_total').textContent = fmt(grandTotal);
  }

  // ─── NOTA ───────────────────────────────────────────────────
  const activeCrops  = cropsVisible
    ? Array.from(document.querySelectorAll('.crop-qty')).filter(i => parseFloat(i.value) > 0).length
    : 0;

  document.getElementById('r_note').textContent = [
    cropsVisible ? `${activeCrops} cultivo(s) activos · Precio: calidad Normal (×1.000)` : '',
    cropsVisible ? `Cultivos: ${fmt(bestCropProfit)} ganancias · ${fmt(totalCropInvest)} inversión` : '',
    animalProfit  > 0 ? `Animales: ${fmt(animalProfit)}`    : '',
    treeProfit    > 0 ? `Árboles: ${fmt(treeProfit)}`       : '',
    fishProfit    > 0 ? `Pesca: ${fmt(fishProfit)}`         : '',
    forageProfit  > 0 ? `Recolección: ${fmt(forageProfit)}` : '',
    tapperProfit  > 0 ? `Resineras: ${fmt(tapperProfit)}`   : '',
  ].filter(Boolean).join(' | ');

  document.getElementById('results').classList.add('visible');
  document.getElementById('results').scrollIntoView({behavior:'smooth', block:'nearest'});
}

// ─── ÁRBOLES FRUTALES ───────────────────────────────────────
// Precios por año (calidad sube 1★ por año del árbol)
// año1=Normal, año2=Plata(×1.25), año3=Oro(×1.5), año4+=Iridio(×2)
// sell = precio Normal. La calidad se aplica con TREE_QUALITY_MULT
const TREES_DB = [
  {name:"apricot",     sell:50,  sapling:2000, season:'🌸 Primavera',          days:28},
  {name:"cherry",      sell:80,  sapling:3400, season:'🌸 Primavera',          days:28},
  {name:"orange",      sell:100, sapling:4000, season:'☀️ Verano',             days:28},
  {name:"peach",       sell:140, sapling:6000, season:'☀️ Verano',             days:28},
  {name:"apple",       sell:100, sapling:4000, season:'🍂 Otoño',              days:28},
  {name:"pomegranate", sell:140, sapling:6000, season:'🍂 Otoño',              days:28},
  {name:"banana",      sell:150, sapling:0,    season:'🏝️ Isla/Invernadero',   days:28},
  {name:"mango",       sell:130, sapling:0,    season:'🏝️ Isla/Invernadero',   days:28},
];
// Calidad por año: año1=Normal, año2=Plata, año3=Oro, año4+=Iridio
const TREE_QUALITY_MULT = [1.0, 1.25, 1.5, 2.0];

function loadTreeData() {
  const type = document.getElementById('tree_type').value;
  const tree = TREES_DB.find(t => t.name === type);
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
  const tree   = TREES_DB.find(t => t.name === type);
  const qualM  = TREE_QUALITY_MULT[year - 1];
  const days   = inGH ? 112 : 28;
  const sellRaw = tree.sell * qualM * (1 + tiller);
  return sellRaw * count * days;
}

// ─── PESCA ──────────────────────────────────────────────────
// Precios base exactos de la wiki (precio normal sin profesión)
const FISH_DB = [
  // Primavera
  {name:"anchoa",          sell:30},   {name:"lubina",         sell:100},  {name:"pez_gato",       sell:200},
  {name:"pez_sol",         sell:30},   {name:"arenque",        sell:30},   {name:"anguila",        sell:85},
  {name:"sardina",         sell:40},   {name:"sabalo",         sell:60},   {name:"platija",        sell:100},
  {name:"fletan",          sell:80},   {name:"leyenda",        sell:5000},
  // Verano
  {name:"pez_globo",       sell:200},  {name:"atun",           sell:100},  {name:"trucha_arcoiris",sell:65},
  {name:"pez_gato_v",      sell:200},  {name:"sauri",          sell:1000}, {name:"pulpo",          sell:150},
  {name:"pargo",           sell:50},   {name:"superpepino",    sell:250},  {name:"esturion",       sell:200},
  {name:"tilapia",         sell:75},   {name:"dorado",         sell:100},  {name:"salmonete",      sell:30},
  {name:"pez_carmesi",     sell:1500},
  // Otoño
  {name:"perca_peq",       sell:50},   {name:"perca",          sell:100},  {name:"salmon",         sell:75},
  {name:"tiger_trout",     sell:150},  {name:"albacore",       sell:75},   {name:"pez_madera",     sell:75},
  {name:"carpa",           sell:30},   {name:"lucio",          sell:100},  {name:"void_salmon",    sell:150},
  {name:"rape",            sell:900},  {name:"linterna",       sell:120},
  // Invierno
  {name:"atun_inv",        sell:100},  {name:"sardina_inv",    sell:40},   {name:"lucio_inv",      sell:100},
  {name:"pez_hielo",       sell:500},  {name:"calamar",        sell:80},   {name:"pepino_mar",     sell:75},
  {name:"superpepino_i",   sell:250},  {name:"pez_piedra",     sell:500},  {name:"pez_fantasma_i", sell:45},
  {name:"pez_glaciar",     sell:1000}, {name:"anguila_lava_i", sell:700},  {name:"carpa_mutante",  sell:1000},
  // Todo el año
  {name:"carpa_all",       sell:30},   {name:"perca_peq_all",  sell:50},   {name:"pez_madera_all", sell:75},
  {name:"perca_all",       sell:100},  {name:"lucio_all",      sell:100},  {name:"void_salmon_all",sell:150},
  {name:"pez_fantasma_all",sell:45},   {name:"pez_piedra_all", sell:500},  {name:"pez_hielo_all",  sell:500},
  {name:"anguila_lava_all",sell:700},  {name:"carpa_mutante_all",sell:1000},
];

function loadFishData() {
  const type = document.getElementById('fish_type').value;
  document.getElementById('fish_price').value = (FISH_DB.find(f => f.name === type)?.sell) || 0;
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
  document.getElementById('season_days').value = active ? 112 : 28;
  updateCropHarvests();
}

// ─── AUXILIARES ─────────────────────────────────────────────
function toggleSection(sectionId, btnId) {
  const sec = document.getElementById(sectionId);
  const btn = document.getElementById(btnId);
  const isHidden = sec.style.display === 'none';
  sec.style.display = isHidden ? 'block' : 'none';
  const label = btn.textContent.includes('+') ? btn.textContent.replace('+ ','- ') : btn.textContent.replace('- ','+ ');
  btn.textContent = label;
  if (sectionId === 'trees_section'   && isHidden) loadTreeData();
  if (sectionId === 'fishing_section' && isHidden) loadFishData();
  if (sectionId === 'crops_section'   && isHidden) buildCropTable();
}

buildCropTable();
updateProcessNote();

// Actualizar cosechas cuando cambien los parámetros que las afectan
document.getElementById('season_days').addEventListener('input',  updateCropHarvests);
document.getElementById('agriculturist').addEventListener('change', updateCropHarvests);

// Actualizar displays de animales cuando cambien profesiones o días
document.getElementById('season_days').addEventListener('input',  updateAllAnimalDisplays);
['rancher','artisan','shepherd','coopmaster'].forEach(cbId => {
  document.getElementById(cbId).addEventListener('change', updateAllAnimalDisplays);
});