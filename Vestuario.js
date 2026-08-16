(function(){

alert ("¡Alistate! viste a tu personaje con la ropa que quieras para que quede listo para la fiesta de cumpleaños."); 

/* ================= DATA ================= */

const CATS = [
  {key:'shoes',       label:'Zapatos',    slot:'shoe'},
  {key:'dresses',     label:'Vestidos',   slot:'dress'},
  {key:'tops',        label:'Arriba',     slot:'top'},
  {key:'bottoms',     label:'Abajo',      slot:'bottom'},
  {key:'accessories', label:'Accesorios', slot:'accessory'}
];

const DEFAULT_BOX = {
  top:       {left:20, top:22, width:60, height:26},
  bottom:    {left:20, top:48, width:60, height:34},
  dress:     {left:14, top:20, width:72, height:60},
  shoeL:     {left:8,  top:78, width:32, height:16},
  shoeR:     {left:60, top:78, width:32, height:16},
  accessory: {left:20, top:2,  width:40, height:16}
};

const CHAR_KEY = 'character-image';
const CLOSET_KEY = 'closet-items';
const OUTFIT_KEY = 'outfit-state';


/* ================= STATE ================= */

let characterImage = DEFAULT_CHARACTER;
let uploadedItems = {shoes:[], dresses:[], tops:[], bottoms:[], accessories:[]};
let closetItems = {shoes:[], dresses:[], tops:[], bottoms:[], accessories:[]};

// outfit: slots únicos + un array para accesorios (pueden ser varios a la vez)
let outfit = {
  shoeL:null, shoeR:null, dress:null, top:null, bottom:null,
  accessories: [] // [{instId, id, left, top, width, height, rot}]
};
let activeCat = 'shoes';

function rebuildCloset(){
  CATS.forEach(c=>{
    closetItems[c.key] = DEFAULT_ITEMS[c.key].concat(uploadedItems[c.key] || []);
  });
}

function findItem(id){
  for (const cat in closetItems){
    const f = closetItems[cat].find(i=>i.id===id);
    if (f) return f;
  }
  return null;
}

function slotToCat(slot){
  if (slot==='shoeL'||slot==='shoeR') return 'shoes';
  if (slot==='dress') return 'dresses';
  if (slot==='top') return 'tops';
  if (slot==='bottom') return 'bottoms';
  if (slot==='accessory') return 'accessories';
  return null;
}

function isEquipped(item){
  if (item.slot === 'shoe'){
    return (outfit.shoeL && outfit.shoeL.id === item.id) || (outfit.shoeR && outfit.shoeR.id === item.id);
  }
  if (item.slot === 'accessory'){
    return outfit.accessories.some(a=>a.id===item.id);
  }
  return outfit[item.slot] && outfit[item.slot].id === item.id;
}

function getOutfitEntry(slot, instId){
  if (slot === 'accessory') return outfit.accessories.find(a=>a.instId===instId);
  return outfit[slot];
}

function getAllEquippedEntries(){
  const list = [];
  ['bottom','top','dress','shoeL','shoeR'].forEach(slot=>{
    if (outfit[slot]) list.push({slot, instId:null, entry:outfit[slot]});
  });
  outfit.accessories.forEach(acc=>{
    list.push({slot:'accessory', instId:acc.instId, entry:acc});
  });
  return list;
}

function nextZValue(){
  const list = getAllEquippedEntries();
  if (!list.length) return 1;
  return Math.max(...list.map(l => l.entry.z || 0)) + 1;
}

/* ================= TOAST ================= */
let toastTimer = null;
function toast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> el.classList.remove('show'), 3200);
}

/* ================= IMAGE HELPERS ================= */

function fileToResizedDataURL(file, maxDim){
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = (e)=>{
      const img = new Image();
      img.onload = ()=>{
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim){
          if (w > h){ h = Math.round(h * maxDim / w); w = maxDim; }
          else { w = Math.round(w * maxDim / h); h = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = ()=> reject(new Error('No se pudo leer la imagen'));
      img.src = e.target.result;
    };
    reader.onerror = ()=> reject(new Error('No se pudo leer el archivo'));
    reader.readAsDataURL(file);
  });
}

function clamp(v, min, max){ return Math.min(max, Math.max(min, v)); }

/* ================= RENDER: NAV ================= */

const tabsEl = document.getElementById('tabs');
const gridEl = document.getElementById('grid');
const closetTitleEl = document.getElementById('closetTitle');
const stageEl = document.getElementById('stage');
const nextStageEl = document.getElementById('nextStage');

function renderTabs(){
  tabsEl.innerHTML = CATS.map(c => `
    <button class="tab ${c.key===activeCat?'active':''}" data-cat="${c.key}">${c.label}</button>
  `).join('');
  tabsEl.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      activeCat = btn.dataset.cat;
      renderTabs();
      renderGrid();
      renderStage();
    });
  });
  const activeBtn = tabsEl.querySelector('.tab.active');
  if (activeBtn) activeBtn.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
}

/* ================= RENDER: GRID ================= */

function renderGrid(){
  const cat = CATS.find(c=>c.key===activeCat);
  closetTitleEl.textContent = cat.label;

  const addTile = `
    <div class="item-card add-card" id="addCard">
      <div class="add-icon">+</div>
      <div class="item-name">Agregar prenda</div>
    </div>`;

  const items = closetItems[activeCat] || [];
  const itemTiles = items.map(item => {
    const equipped = isEquipped(item);
    return `
      <div class="item-card ${equipped?'equipped-marker':''}" data-id="${item.id}">
        ${equipped ? '<span class="badge">puesto</span>' : ''}
        ${item.isDefault ? '' : `<button class="item-delete" data-id="${item.id}" title="Eliminar">×</button>`}
        <img class="item-thumb" src="${item.src}" draggable="false">
        <div class="item-name">${item.name}</div>
      </div>`;
  }).join('');

  gridEl.innerHTML = addTile + itemTiles;

  document.getElementById('addCard').addEventListener('click', ()=> document.getElementById('fileInput').click());

  gridEl.querySelectorAll('.item-card:not(.add-card)').forEach(card=>{
    attachDrag(card);
  });
  gridEl.querySelectorAll('.item-delete').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      deleteItem(btn.dataset.id);
    });
  });
}

function deleteItem(id){
  const item = findItem(id);
  if (!item || item.isDefault) return;
  uploadedItems[item.cat] = uploadedItems[item.cat].filter(i=>i.id!==id);
  if (item.slot === 'shoe'){
    if (outfit.shoeL && outfit.shoeL.id===id) outfit.shoeL = null;
    if (outfit.shoeR && outfit.shoeR.id===id) outfit.shoeR = null;
  } else if (item.slot === 'accessory'){
    outfit.accessories = outfit.accessories.filter(a=>a.id!==id);
  } else if (outfit[item.slot] && outfit[item.slot].id===id){
    outfit[item.slot] = null;
  }
  rebuildCloset();
  renderGrid();
  renderStage();
  saveUploadedItems();
  saveOutfitState('closet');
}

/* ================= RENDER: STAGE ================= */

function renderLayer(slot, instId, eq, editable){
  const item = findItem(eq.id);
  if (!item) return '';
  const rot = eq.rot || 0;
  const isActiveCat = slotToCat(slot) === activeCat;
  const editHere = editable && isActiveCat;
  const controls = editHere
    ? `<button class="layer-remove" data-slot="${slot}" ${instId?`data-instid="${instId}"`:''} title="Quitar">×</button>
       <div class="layer-resize" data-slot="${slot}" ${instId?`data-instid="${instId}"`:''}></div>
       <div class="layer-rotate" data-slot="${slot}" ${instId?`data-instid="${instId}"`:''}>↻</div>
       <button class="layer-front" data-slot="${slot}" ${instId?`data-instid="${instId}"`:''} title="Traer al frente">⬆</button>
       <button class="layer-back" data-slot="${slot}" ${instId?`data-instid="${instId}"`:''} title="Enviar atrás">⬇</button>`
    : '';
  return `<div class="layer-wrap equipped ${editHere?'editable':''}" data-slot="${slot}" ${instId?`data-instid="${instId}"`:''}
              style="left:${eq.left}%; top:${eq.top}%; width:${eq.width}%; height:${eq.height}%; transform:rotate(${rot}deg);">
              <img src="${item.src}" draggable="false">
             ${controls}
          </div>`;
}

function stageInnerHTML(editable){
  let html = characterImage
    ? `<img class="char-img" src="${characterImage}">`
    : `<div class="char-placeholder">🧍<br>Sube la foto de tu personaje</div>`;

  const layers = getAllEquippedEntries().sort((a,b)=> (a.entry.z||0) - (b.entry.z||0));
  layers.forEach(l=>{
    html += renderLayer(l.slot, l.instId, l.entry, editable);
  });
  return html;
}

function renderStage(){
  stageEl.innerHTML = stageInnerHTML(true);
  stageEl.querySelectorAll('.layer-wrap.editable').forEach(el=> attachLayerMove(el));
  stageEl.querySelectorAll('.layer-remove').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      unequip(btn.dataset.slot, btn.dataset.instid || null);
    });
  });
  stageEl.querySelectorAll('.layer-resize').forEach(handle=> attachResize(handle));
  stageEl.querySelectorAll('.layer-rotate').forEach(handle=> attachRotate(handle));
  stageEl.querySelectorAll('.layer-front').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      bringToFront(btn.dataset.slot, btn.dataset.instid || null);
    });
  });
  stageEl.querySelectorAll('.layer-back').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      sendToBack(btn.dataset.slot, btn.dataset.instid || null);
    });
  });
}

function bringToFront(slot, instId){
  const entry = getOutfitEntry(slot, instId);
  if (!entry) return;
  entry.z = nextZValue();
  renderStage();
  saveOutfitState('closet');
}

function sendToBack(slot, instId){
  const entry = getOutfitEntry(slot, instId);
  if (!entry) return;
  const list = getAllEquippedEntries();
  const minZ = list.length ? Math.min(...list.map(l=>l.entry.z||0)) : 0;
  entry.z = minZ - 1;
  renderStage();
  saveOutfitState('closet');
}

function renderNextStage(){
  nextStageEl.innerHTML = stageInnerHTML(false);
}

/* ================= EQUIP / UNEQUIP ================= */

function makeEntry(slot, id){
  const box = DEFAULT_BOX[slot];
  return {id, left:box.left, top:box.top, width:box.width, height:box.height, rot:0, z: nextZValue()};
}

function equipAccessory(item){
  const box = DEFAULT_BOX.accessory;
  const n = outfit.accessories.length;
  const offset = (n % 5) * 7;
  outfit.accessories.push({
    instId: 'a'+Date.now()+Math.random().toString(36).slice(2,6),
    id: item.id,
    left: clamp(box.left + offset, 0, 100 - box.width),
    top: clamp(box.top + offset, 0, 100 - box.height),
    width: box.width,
    height: box.height,
    rot: 0,
    z: nextZValue()
  });
}

function equip(item){
  if (item.slot === 'dress'){
    outfit.dress = makeEntry('dress', item.id); outfit.top = null; outfit.bottom = null;
  } else if (item.slot === 'top' || item.slot === 'bottom'){
    outfit[item.slot] = makeEntry(item.slot, item.id); outfit.dress = null;
  } else if (item.slot === 'shoe'){
    if (!outfit.shoeL) outfit.shoeL = makeEntry('shoeL', item.id);
    else if (!outfit.shoeR) outfit.shoeR = makeEntry('shoeR', item.id);
    else outfit.shoeL = makeEntry('shoeL', item.id);
  } else if (item.slot === 'accessory'){
    equipAccessory(item);
  }
  renderStage();
  renderGrid();
  saveOutfitState('closet');
}

function unequip(slot, instId){
  if (slot === 'accessory'){
    outfit.accessories = outfit.accessories.filter(a=>a.instId!==instId);
  } else {
    outfit[slot] = null;
  }
  renderStage();
  renderGrid();
  saveOutfitState('closet');
}

/* ================= MOVE / RESIZE / ROTATE ON STAGE ================= */

function attachLayerMove(el){
  el.addEventListener('pointerdown', (e)=>{
    if (e.target.closest('.layer-remove') || e.target.closest('.layer-resize') || e.target.closest('.layer-rotate')) return;
    e.preventDefault();
    const slot = el.dataset.slot, instId = el.dataset.instid || null;
    const entry = getOutfitEntry(slot, instId);
    if (!entry) return;
    const stageRect = stageEl.getBoundingClientRect();
    const startLeftPct = entry.left, startTopPct = entry.top;
    const startX = e.clientX, startY = e.clientY;

    function onMove(ev){
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      entry.left = clamp(startLeftPct + (dx/stageRect.width)*100, -25, 100);
      entry.top = clamp(startTopPct + (dy/stageRect.height)*100, -25, 100);
      el.style.left = entry.left+'%'; el.style.top = entry.top+'%';
    }
    function onUp(){
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      saveOutfitState('closet');
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, {once:true});
  });
}

function attachResize(handle){
  handle.addEventListener('pointerdown', (e)=>{
    e.stopPropagation(); e.preventDefault();
    const slot = handle.dataset.slot, instId = handle.dataset.instid || null;
    const entry = getOutfitEntry(slot, instId);
    if (!entry) return;
    const stageRect = stageEl.getBoundingClientRect();
    const startW = entry.width, startH = entry.height;
    const startX = e.clientX, startY = e.clientY;
    const wrap = handle.parentElement;

    function onMove(ev){
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      entry.width = clamp(startW + (dx/stageRect.width)*100, 6, 100);
      entry.height = clamp(startH + (dy/stageRect.height)*100, 6, 100);
      wrap.style.width = entry.width+'%'; wrap.style.height = entry.height+'%';
    }
    function onUp(){
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      saveOutfitState('closet');
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, {once:true});
  });
}

function attachRotate(handle){
  handle.addEventListener('pointerdown', (e)=>{
    e.stopPropagation(); e.preventDefault();
    const wrap = handle.parentElement;
    const slot = wrap.dataset.slot, instId = wrap.dataset.instid || null;
    const entry = getOutfitEntry(slot, instId);
    if (!entry) return;
    const stageRect = stageEl.getBoundingClientRect();
    const centerX = stageRect.left + (entry.left + entry.width/2)/100*stageRect.width;
    const centerY = stageRect.top + (entry.top + entry.height/2)/100*stageRect.height;
    const startAngle = Math.atan2(e.clientY-centerY, e.clientX-centerX) * 180/Math.PI;
    const startRot = entry.rot || 0;

    function onMove(ev){
      const angle = Math.atan2(ev.clientY-centerY, ev.clientX-centerX) * 180/Math.PI;
      entry.rot = startRot + (angle - startAngle);
      wrap.style.transform = `rotate(${entry.rot}deg)`;
    }
    function onUp(){
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      saveOutfitState('closet');
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, {once:true});
  });
}

/* ================= DRAG FROM CLOSET TO STAGE ================= */

let dragGhost = null;
let draggingItem = null;
let dragMoved = false;
let startX = 0, startY = 0;

function attachDrag(card){
  card.addEventListener('pointerdown', (e)=>{
    if (e.target.closest('.item-delete')) return;
    const id = card.dataset.id;
    draggingItem = findItem(id);
    if (!draggingItem) return;
    dragMoved = false;
    startX = e.clientX; startY = e.clientY;

    dragGhost = document.createElement('div');
    dragGhost.className = 'ghost';
    dragGhost.innerHTML = `<img src="${draggingItem.src}">`;
    document.body.appendChild(dragGhost);
    moveGhost(e.clientX, e.clientY);

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp, {once:true});
  });
}

function moveGhost(x,y){
  if (dragGhost){ dragGhost.style.left = x+'px'; dragGhost.style.top = y+'px'; }
}

function onPointerMove(e){
  if (!draggingItem) return;
  if (Math.abs(e.clientX-startX) > 4 || Math.abs(e.clientY-startY) > 4) dragMoved = true;
  moveGhost(e.clientX, e.clientY);
  const rect = stageEl.getBoundingClientRect();
  const inside = e.clientX>=rect.left && e.clientX<=rect.right && e.clientY>=rect.top && e.clientY<=rect.bottom;
  stageEl.classList.toggle('drop-hover', inside);
}

function onPointerUp(e){
  window.removeEventListener('pointermove', onPointerMove);
  if (dragGhost){ dragGhost.remove(); dragGhost = null; }
  stageEl.classList.remove('drop-hover');

  if (draggingItem){
    const rect = stageEl.getBoundingClientRect();
    const inside = e.clientX>=rect.left && e.clientX<=rect.right && e.clientY>=rect.top && e.clientY<=rect.bottom;
    if (inside || !dragMoved){
      equip(draggingItem);
    }
  }
  draggingItem = null;
}

/* ================= UPLOADS ================= */

document.getElementById('fileInput').addEventListener('change', async (e)=>{
  const files = Array.from(e.target.files || []);
  e.target.value = '';
  if (!files.length) return;
  const cat = CATS.find(c=>c.key===activeCat);
  for (const file of files){
    try{
      const src = await fileToResizedDataURL(file, 600);
      uploadedItems[activeCat].push({
        id: 'c'+Date.now()+Math.random().toString(36).slice(2,7),
        name: file.name.replace(/\.[^/.]+$/, '').slice(0,20) || cat.label,
        src, cat: activeCat, slot: cat.slot, isDefault:false
      });
    }catch(err){
      toast('No se pudo cargar una de las imágenes.');
    }
  }
  rebuildCloset();
  renderGrid();
  const ok = await saveUploadedItems();
  if (!ok) toast('El armario quedó muy pesado para guardarse. Probá con imágenes más livianas.');
});

document.getElementById('charUploadBtn').addEventListener('click', ()=>{
  document.getElementById('charFileInput').click();
});
document.getElementById('charFileInput').addEventListener('change', async (e)=>{
  const file = e.target.files && e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try{
    characterImage = await fileToResizedDataURL(file, 900);
    renderStage();
    const ok = await saveCharacterImage();
    if (!ok) toast('La foto quedó muy pesada para guardarse. Probá con una más liviana.');
  }catch(err){
    toast('No se pudo cargar la foto del personaje.');
  }
});

/* ================= STORAGE ================= */

async function saveCharacterImage(){
  try{
    localStorage.setItem(CHAR_KEY, characterImage || '');
    return true;
  }catch(err){ console.error(err); return false; }
}

async function saveUploadedItems(){
  try{
    localStorage.setItem(CLOSET_KEY, JSON.stringify(uploadedItems));
    return true;
  }catch(err){ console.error(err); return false; }
}

async function saveOutfitState(view){
  try{
    localStorage.setItem(OUTFIT_KEY, JSON.stringify({view, outfit}));
  }catch(err){ console.error(err); }
}

async function loadAll(){
  try{
    const val = localStorage.getItem(CHAR_KEY);
    if (val) characterImage = val;
  }catch(err){ /* sigue con el personaje por defecto */ }

  try{
    const val = localStorage.getItem(CLOSET_KEY);
    if (val){
      const parsed = JSON.parse(val);
      uploadedItems = Object.assign(uploadedItems, parsed);
    }
  }catch(err){ /* nada subido todavía */ }

  rebuildCloset();

  try{
    const val = localStorage.getItem(OUTFIT_KEY);
    if (val){
      const parsed = JSON.parse(val);
      if (parsed.outfit){
        outfit.shoeL = parsed.outfit.shoeL || null;
        outfit.shoeR = parsed.outfit.shoeR || null;
        outfit.dress = parsed.outfit.dress || null;
        outfit.top = parsed.outfit.top || null;
        outfit.bottom = parsed.outfit.bottom || null;
        outfit.accessories = Array.isArray(parsed.outfit.accessories) ? parsed.outfit.accessories : [];
        if (parsed.outfit.accessory && !outfit.accessories.length){
          outfit.accessories = [Object.assign({instId:'a'+Date.now()}, parsed.outfit.accessory)];
        }
        let z = 1;
        getAllEquippedEntries().forEach(l=>{ if (typeof l.entry.z !== 'number') l.entry.z = z++; });
      }
    }
  }catch(err){ /* nada guardado aún */ }

  return 'closet';
}

/* ================= PAGE SWITCH ================= */

const closetView = document.getElementById('closet-view');
const nextView = document.getElementById('next-page');

function showCloset(){
  closetView.classList.remove('hidden');
  nextView.style.display = 'none';
  renderStage();
  renderGrid();
}

function showNext(){
  closetView.classList.add('hidden');
  nextView.style.display = 'block';
  renderNextStage();
}

document.getElementById('clearOutfit').addEventListener('click', ()=>{
  outfit = {shoeL:null, shoeR:null, dress:null, top:null, bottom:null, accessories:[]};
  renderStage();
  renderGrid();
  saveOutfitState('closet');
});

document.getElementById('finishBtn').addEventListener('click', async ()=>{
  await saveOutfitState('closet');
  window.location.href = 'pastel.html';
});

document.getElementById('backBtn').addEventListener('click', async ()=>{
  await saveOutfitState('closet');
  showCloset();
});

/* ================= INIT ================= */

(async function init(){
  renderTabs();
  const view = await loadAll();
  if (view === 'next') showNext(); else showCloset();
})();

})();