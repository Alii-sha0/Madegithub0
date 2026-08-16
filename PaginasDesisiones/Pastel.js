
(function(){
  const CHAR_KEY = 'character-image';
  const CLOSET_KEY = 'closet-items';
  const OUTFIT_KEY = 'outfit-state';

  function loadJSON(key, fallback){
    try{
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    }catch(err){ return fallback; }
  }

  const characterImage = localStorage.getItem(CHAR_KEY) || DEFAULT_CHARACTER;
  const uploadedItems = loadJSON(CLOSET_KEY, {shoes:[],dresses:[],tops:[],bottoms:[],accessories:[]});
  const outfit = (loadJSON(OUTFIT_KEY, {outfit:{}})).outfit || {};

  const closetItems = {};
  Object.keys(DEFAULT_ITEMS).forEach(cat=>{
    closetItems[cat] = DEFAULT_ITEMS[cat].concat(uploadedItems[cat] || []);
  });
  function findItem(id){
    for (const cat in closetItems){
      const f = closetItems[cat].find(i=>i.id===id);
      if (f) return f;
    }
    return null;
  }

  function getAllEquippedEntries(){
    const list = [];
    ['bottom','top','dress','shoeL','shoeR'].forEach(slot=>{
      if (outfit[slot]) list.push({slot, entry:outfit[slot]});
    });
    (outfit.accessories || []).forEach(acc=> list.push({slot:'accessory', entry:acc}));
    return list;
  }

  const container = document.getElementById('personaje-final');
  container.innerHTML = `<div class="base"><img src="${characterImage}"></div>`;
  const base = container.querySelector('.base');

  getAllEquippedEntries()
    .sort((a,b)=> (a.entry.z||0) - (b.entry.z||0))
    .forEach(l=>{
      const item = findItem(l.entry.id);
      if (!item) return;
      const div = document.createElement('div');
      div.className = 'capa';
      div.style.left = l.entry.left + '%';
      div.style.top = l.entry.top + '%';
      div.style.width = l.entry.width + '%';
      div.style.height = l.entry.height + '%';
      div.style.transform = `rotate(${l.entry.rot || 0}deg)`;
      div.innerHTML = `<img src="${item.src}">`;
      base.appendChild(div);
    });
})();