
/* main.js - final package
 * - Shows 3D showroom only on Home (canvas present)
 * - Shop uses modal for View with bio/description
 * - Category filter, search, button interactions
 * - GLB loader uses local models/car.glb if present; fallback to remote URL
 */

const PRODUCTS = [
  { id: 'bently', name:'Bently race day 2018', img:'img/Bently race day 2018.png', price:'Rp 83k', category:'Race', bio:'Vintage race special', desc:'Limited edition Bently' },
  { id: 'supra', name:'Fast & Furious 2021 Supra', img:'img/fast & furious 2021 supra.jpg', price:'Rp 157k', category:'Fast & Furious', bio:'Street legend', desc:'Modified Supra with turbo' },
  { id: 'koenig', name:'Fast & Furious Koenigsegg CCX', img:'img/fast & furious koenisegg ccx.jpg', price:'Rp 187.5k', category:'Fast & Furious', bio:'Hypercar icon', desc:'Koenigsegg with top speed' },
  { id: 'dodge', name:'Fast & Furious 2020 Dodge', img:'img/fast-furious-dodge.jpg', price:'Rp 132k', category:'Fast & Furious', bio:'Muscle car', desc:'Classic Dodge muscle power' },
  { id: 'subaru', name:'Fast & Furious Subaru WRX', img:'img/fast-furious-subaru.jpg', price:'Rp 127k', category:'Fast & Furious', bio:'Rally legend', desc:'WRX rally-tuned' },
  { id: 'mazda', name:'Mazda 787B', img:'img/mazda-787b.jpg', price:'Rp 132k', category:'JDM', bio:'Le Mans winner', desc:'Rotary-powered racer' },
  { id: 'sx', name:'Fast & Furious Nissan 180 SX', img:'img/fast-furious-180sx.jpg', price:'Rp 152k', category:'Fast & Furious', bio:'Drift icon', desc:'180SX drift spec' },
  { id: 'ferrari', name:'Circuit Legend Ferrari 499P', img:'img/ferrari-499p.jpg', price:'Rp 292k', category:'Supercar', bio:'Modern prototype', desc:'Ferrari endurance prototype' },
  { id: 'clk', name:'Mercedez Benz CLK GTR AMG', img:'img/clk-gtr.jpg', price:'Rp 377k', category:'Supercar', bio:'GT legend', desc:'CLK GTR race homologation' },
  { id: 'pandem', name:'Pandem Civic EG6', img:'img/pandem-civic.jpg', price:'Rp 216k', category:'JDM', bio:'Pandem widebody', desc:'Civic EG6 with wide body kit' },
  { id: 'rwb', name:'RWB 997 Silver', img:'img/rwb-997-silver.jpg', price:'Rp 192k', category:'JDM', bio:'RAUH-Welt Begriff', desc:'Porsche with RWB styling' },
  { id: 'nwb', name:'NWB Supra', img:'img/nwb-supra.jpg', price:'Rp 190k', category:'JDM', bio:'Modern tuned Supra', desc:'Custom NWB build' },
  { id: 'rx7', name:'RX-7 Super Silhouette', img:'img/rx7-silhouette.jpg', price:'Rp 198k', category:'JDM', bio:'Silhouette racer', desc:'RX-7 full silhouette kit' },
  { id: 'bugatti', name:'Bugatti Vision Gran Turismo', img:'img/bugatti-vision.jpg', price:'Rp 207.5k', category:'Supercar', bio:'Vision concept', desc:'Concept hypercar' },
  { id: 'nissan', name:'Nissan Z Pandem Seiron B', img:'img/nissan-pandem.jpg', price:'Rp 182k', category:'JDM', bio:'Pandem Z', desc:'Custom Z with Seiron kit' },
  { id: 'sls', name:'SLS LB Silhouette', img:'img/sls-lb.jpg', price:'Rp 228k', category:'Supercar', bio:'Liberty Walk SLS', desc:'SLS with LB kit' },
  { id: 'skyline', name:'Nissan Skyline GTR R34', img:'img/skyline-r34.jpg', price:'Rp 183k', category:'JDM', bio:'Iconic GTR', desc:'Skyline R34 GT-R' },
  { id: 'nsx', name:'Honda NSX GT3 Evo', img:'img/nsx-gt3.jpg', price:'Rp 214k', category:'JDM', bio:'NSX race spec', desc:'GT3 EVO version' },
  { id: 'aston', name:'Aston Martin Valkyrie', img:'img/aston-valkyrie.jpg', price:'Rp 203k', category:'Supercar', bio:'Hyper GT', desc:'Aston Martin halo car' }
];

document.addEventListener('DOMContentLoaded', ()=>{
  const grid = document.getElementById('productsGrid');
  if(grid){
    PRODUCTS.forEach(p=>{
      const el = document.createElement('article');
      el.className = 'card';
      el.dataset.category = p.category;
      el.innerHTML = `
        <img loading="lazy" src="${p.img}" alt="${p.name}" onerror="this.onerror=null;this.src='logo.png'">
        <h3>${p.name}</h3>
        <p class="price">${p.price}</p>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:8px">
          <button class="btn view" data-id="${p.id}">View</button>
          <button class="btn" onclick="beli('${p.name}')">Beli</button>
        </div>
        <div style="margin-top:10px"><span class="tag ${mapTag(p.category)}">${p.category}</span></div>
      `;
      grid.appendChild(el);
    });

    grid.querySelectorAll('.btn.view').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const id = e.currentTarget.dataset.id;
        const p = PRODUCTS.find(x=>x.id===id);
        openModal(p);
      });
    });
  }

  document.querySelectorAll('.categories .btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.categories .btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.products-grid .card').forEach(card=>{
        card.style.display = (cat==='All' || card.dataset.category===cat)?'':'none';
      });
    });
  });

  document.querySelectorAll('.community-cats .btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const c = btn.dataset.comm;
      document.querySelectorAll('#commList .comm-card').forEach(card=>{
        card.style.display = card.querySelector('h3').textContent===c ? '' : 'none';
      });
    });
  });

  const search = document.getElementById('search');
  if(search){
    search.addEventListener('input', (e)=>{
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.products-grid .card').forEach(card=>{
        const txt = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = txt.includes(q) ? '' : 'none';
      });
    });
  }

  const modal = document.getElementById('modal');
  const closeModal = document.getElementById('closeModal');
  if(closeModal){
    closeModal.addEventListener('click', ()=>{ closeProductModal(); });
    window.addEventListener('click', (e)=>{ if(e.target===modal) closeProductModal(); });
  }
});

function mapTag(cat){ return cat ? cat.toLowerCase().replace(/[^a-z0-9]+/g,'') : ''; }
function beli(name){ alert('Maaf, ' + name + ' belum tersedia.'); }

function openModal(p){
  const modal = document.getElementById('modal');
  if(!modal) return;
  document.getElementById('modal-title').textContent = p.name;
  document.getElementById('modal-img').src = p.img || 'img/logo.png';
  document.getElementById('modal-bio').innerHTML = '<strong>Biography:</strong> ' + (p.bio || '—');
  document.getElementById('modal-desc').innerHTML = '<strong>Description:</strong> ' + (p.desc || '—');
  modal.setAttribute('aria-hidden','false');
}
function closeProductModal(){
  const modal = document.getElementById('modal');
  if(!modal) return;
  modal.setAttribute('aria-hidden','true');
}

/* Showroom 3D */
(function(){
  const canvas = document.getElementById('showroomCanvas');
  if(!canvas || !THREE) return;
  console.log('🚀 Initializing showroom...');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(canvas.clientWidth || 640, canvas.clientHeight || 360, false);
  if(renderer.outputColorSpace !== undefined){ renderer.outputColorSpace = THREE.SRGBColorSpace; } else { renderer.outputEncoding = THREE.sRGBEncoding; }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 5000);
  camera.position.set(0, 1.2, 3.2);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x111122, 0.6); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(5,10,6); scene.add(key);
  const rim = new THREE.PointLight(0xff8a00, 0.6, 8); rim.position.set(-4,1.6,3); scene.add(rim);
  const rim2 = new THREE.PointLight(0x00d6ff, 0.4, 8); rim2.position.set(4,1.6,3); scene.add(rim2);

  const floorGeo = new THREE.CircleGeometry(6, 64);
  const floorMat = new THREE.MeshStandardMaterial({ color:0x05050a, metalness:0.6, roughness:0.1 });
  const floor = new THREE.Mesh(floorGeo, floorMat); floor.rotation.x = -Math.PI/2; floor.position.y = -0.82; scene.add(floor);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.07; controls.enablePan = false;
  controls.minDistance = 1.6; controls.maxDistance = 8; controls.maxPolarAngle = Math.PI/2.1;

  const loader = new THREE.GLTFLoader();
const MODEL_CANDIDATES = ['car.glb','car.gltf',
  'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Car/glTF-Binary/Car.glb'
];
let showroomGroup = new THREE.Group();
scene.add(showroomGroup);
let models = [];

function addModelInstance(gltf, index){
    const base = gltf.scene.clone();
    base.traverse(c=>{ if(c.isMesh){ c.castShadow=true; c.receiveShadow=true; c.material = c.material.clone(); } });
    const bbox = new THREE.Box3().setFromObject(base);
    const size = bbox.getSize(new THREE.Vector3()).length();
    const scale = 1.4 / Math.max(size, 0.1);
    base.scale.setScalar(scale);
    const total = PRODUCTS.length;
    const ang = (index / total) * Math.PI * 1.3 - Math.PI*0.65;
    base.position.set(Math.cos(ang)*2.2, -0.7, Math.sin(ang)*1.0);
    base.rotation.y = -ang + Math.PI/2;
    base.userData = { id: PRODUCTS[index].id, name: PRODUCTS[index].name, category: PRODUCTS[index].category };
    showroomGroup.add(base);
    models.push(base);
  }

  function focusIndex(idx){
    if(!models.length) return;
    idx = ((idx % models.length) + models.length) % models.length;
    const target = models[idx];
    controls.target.copy(target.getWorldPosition(new THREE.Vector3()));
    camera.position.set(target.position.x + 0.0, target.position.y + 0.8, target.position.z + 2.2);
    document.getElementById('selectedName') && (document.getElementById('selectedName').textContent = target.userData.name || '—');
  }

  // try load local model, else fallback remote
  loader.load(localModel, (gltf)=>{
    console.log('Loaded local model');
    for(let i=0;i<PRODUCTS.length;i++) addModelInstance(gltf,i);
    focusIndex(0);
    startAnimate();
  }, undefined, (err)=>{
    console.warn('Local model failed, loading fallback', err);
    loader.load(fallback, (gltf)=>{
      console.log('Loaded fallback model');
      for(let i=0;i<PRODUCTS.length;i++) addModelInstance(gltf,i);
      focusIndex(0);
      startAnimate();
    }, undefined, (e)=>{ console.error('Both model loads failed', e); });
  });

  function startAnimate(){
    const clock = new THREE.Clock();
    (function animate(){
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      showroomGroup.rotation.y = Math.sin(t*0.06)*0.02;
      models.forEach((m,i)=>{ m.rotation.y += 0.001*(i%3+1); });
      controls.update();
      renderer.render(scene, camera);
    })();
  }

  document.getElementById('prevCar')?.addEventListener('click', ()=>{
    let idx = models.findIndex(m=>m.userData.name === document.getElementById('selectedName').textContent);
    if(idx === -1) idx = 0;
    idx = (idx - 1 + models.length) % models.length;
    focusIndex(idx);
  });
  document.getElementById('nextCar')?.addEventListener('click', ()=>{
    let idx = models.findIndex(m=>m.userData.name === document.getElementById('selectedName').textContent);
    if(idx === -1) idx = 0;
    idx = (idx + 1) % models.length;
    focusIndex(idx);
  });

  window.addEventListener('resize', ()=>{
    const w = canvas.clientWidth || canvas.width;
    const h = canvas.clientHeight || canvas.height;
    renderer.setSize(w,h,false);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  });
})();
