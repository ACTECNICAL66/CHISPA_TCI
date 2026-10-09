// Visor 3D interactivo — three.js
// El modelo se importa y queda embebido como data-URI en el build de archivo único.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import modelUrl from './model.glb';

const container = document.getElementById('viewer');
const loadingEl = document.getElementById('viewerLoading');
const pctEl = document.getElementById('loadPct');
const hintEl = document.getElementById('viewerHint');

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.localClippingEnabled = true; // para el modo "corte"
container.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.background = null; // transparente: deja ver el fondo de la página

const camera = new THREE.PerspectiveCamera(45, 1, 0.05, 300);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.maxPolarAngle = Math.PI * 0.495; // no ir bajo el piso
controls.minDistance = 0.8;
controls.maxDistance = 26;

// Entorno + luces
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.02).texture;
scene.environmentIntensity = 0.9;

const hemi = new THREE.HemisphereLight(0xffffff, 0x8899aa, 0.6);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2df, 2.0);
sun.position.set(6, 11, 5);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 0.5;
sun.shadow.camera.far = 40;
sun.shadow.camera.left = -12;
sun.shadow.camera.right = 12;
sun.shadow.camera.top = 12;
sun.shadow.camera.bottom = -12;
sun.shadow.bias = -0.0005;
scene.add(sun);
const fill = new THREE.DirectionalLight(0xdfe9ff, 0.6);
fill.position.set(-7, 6, -6);
scene.add(fill);

// Piso receptor de sombras
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(16, 64),
  new THREE.ShadowMaterial({ opacity: 0.28 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// ---------- Carga del modelo ----------
const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

// Progreso simulado (los data-URI no reportan progreso real)
let fakeP = 0;
const fakeTimer = setInterval(() => {
  fakeP = Math.min(92, fakeP + Math.random() * 9);
  pctEl.textContent = Math.round(fakeP) + '%';
}, 180);

let modelRoot = null;
const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 3); // altura de corte en metros (se ajusta al cargar)

function applyClip(on) {
  modelRoot?.traverse((o) => {
    if (o.isMesh && o.material) {
      o.material.clippingPlanes = on ? [clipPlane] : null;
      o.material.clipShadows = true;
      o.material.needsUpdate = true;
    }
  });
}

const maxAniso = renderer.capabilities.getMaxAnisotropy();

loader.load(modelUrl, (gltf) => {
  clearInterval(fakeTimer);
  pctEl.textContent = '100%';
  const root = gltf.scene;
  modelRoot = root;
  // Nitidez: anisotropía máxima en todas las texturas del modelo
  root.traverse((o) => {
    if (o.isMesh && o.material) {
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) {
        for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap']) {
          if (m[key]) { m[key].anisotropy = maxAniso; m[key].needsUpdate = true; }
        }
      }
    }
  });
  root.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
      if (o.material) {
        o.material.side = THREE.DoubleSide;
        // Vidrios: el export escribe alpha en baseColorFactor pero con alphaMode OPAQUE,
        // así que three.js los renderiza como losas sólidas. Forzamos transparencia real.
        if ((o.material.opacity ?? 1) < 1) {
          o.material.transparent = true;
          o.material.depthWrite = false;
        }
      }
    }
  });

  // El export de OpenSKP sale en milímetros: 6000 ≈ 6 m. Escalar a metros.
  const rawBox = new THREE.Box3().setFromObject(root);
  const rawSize = rawBox.getSize(new THREE.Vector3());
  if (Math.max(rawSize.x, rawSize.z) > 60) {
    modelScale = 0.001;
    root.scale.setScalar(modelScale);
  }

  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  root.position.x -= center.x;
  root.position.z -= center.z;
  root.position.y -= box.min.y; // apoya en y=0
  root.updateMatrixWorld(true);
  scene.add(root);

  // Modo corte tipo "casa de muñecas" (desactivado por defecto): al activarlo recorta
  // por encima del 60% de la altura, manteniendo puertas y ventanas visibles.
  clipPlane.constant = size.y * 0.6;
  cutOn = false;
  btnCut.classList.remove('active');
  btnCut.setAttribute('aria-pressed', 'false');

  fitTo(views.general, 0);

  loadingEl.classList.add('hidden');
  setTimeout(() => loadingEl.remove(), 600);
  showHint();
}, (ev) => {
  if (ev.lengthComputable) {
    const p = Math.round((ev.loaded / ev.total) * 100);
    pctEl.textContent = p + '%';
  }
}, (err) => {
  clearInterval(fakeTimer);
  console.error(err);
  loadingEl.innerHTML = '<p>No se pudo cargar el modelo 3D.<br>Probá abrir la página en Chrome o Edge.</p>';
});

// ---------- Cámara: vistas predefinidas ----------
// Se calculan al momento de usarse: la escala del modelo (mm→m) se conoce tras la carga.
let modelScale = 1; // se define al cargar
const d = (x) => x * modelScale;

const views = {
  // Según el modelo: estanterías de biblioteca en la esquina NO; bancos del taller y TV en la franja ESTE;
// informática y pórtico al SUR (+Z); puerta en la esquina SO.
  get general()     { return { pos: [d(8800), d(7200), d(10200)], tgt: [0, d(1050), 0] }; },
  get taller()      { return { pos: [d(4050), d(6000), d(2660)],  tgt: [d(2450), d(800), d(-40)] }; },
  get biblioteca()  { return { pos: [d(-2150), d(6000), d(1260)], tgt: [d(-1950), d(900), d(-2140)] }; },
  get informatica() { return { pos: [d(-350), d(6000), d(3860)],  tgt: [d(-350), d(800), d(1900)] }; },
  get flexible()    { return { pos: [d(2700), d(5300), d(4300)],  tgt: [d(0), d(900), d(0)] }; },
  get entrada()     { return { pos: [d(-6550), d(2000), d(5950)], tgt: [d(-4050), d(1300), d(2610)] }; }
};

function fitTo(view, dur = 1100) {
  const p = new THREE.Vector3(...view.pos);
  const t = new THREE.Vector3(...view.tgt);
  if (!dur) {
    camera.position.copy(p);
    controls.target.copy(t);
    controls.update();
    return;
  }
  const p0 = camera.position.clone();
  const t0 = controls.target.clone();
  const start = performance.now();
  animateCam();
  function animateCam() {
    const k = Math.min(1, (performance.now() - start) / dur);
    const e = 1 - Math.pow(1 - k, 3); // easeOutCubic
    camera.position.lerpVectors(p0, p, e);
    controls.target.lerpVectors(t0, t, e);
    if (k < 1) requestAnimationFrame(animateCam);
  }
}

// Botones de vista
document.querySelectorAll('#viewPresets .tool-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#viewPresets .tool-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    fitTo(views[btn.dataset.view]);
  });
});

// Vista elegida desde el plano de zonas (main.js)
export function gotoView(name) {
  const v = views[name];
  if (v) fitTo(v);
}

// ---------- Toolbar ----------
// Botón de corte: alterna el plano de recorte horizontal
const btnCut = document.getElementById('btnCut');
let cutOn = false;
btnCut.addEventListener('click', () => {
  cutOn = !cutOn;
  btnCut.classList.toggle('active', cutOn);
  btnCut.setAttribute('aria-pressed', String(cutOn));
  applyClip(cutOn);
});

let rotating = false;
const btnRotate = document.getElementById('btnRotate');
btnRotate.addEventListener('click', () => {
  rotating = !rotating;
  btnRotate.classList.toggle('active', rotating);
  btnRotate.setAttribute('aria-pressed', String(rotating));
});

const btnLabels = document.getElementById('btnLabels');
let labelsGroup = null;
btnLabels.addEventListener('click', () => {
  const on = !btnLabels.classList.contains('active');
  btnLabels.classList.toggle('active', on);
  btnLabels.setAttribute('aria-pressed', String(on));
  if (labelsGroup) labelsGroup.visible = on;
});

const btnFull = document.getElementById('btnFull');
btnFull.addEventListener('click', () => {
  const el = document.querySelector('.viewer-frame');
  if (!document.fullscreenElement) {
    el.requestFullscreen?.();
    btnFull.classList.add('active');
  } else {
    document.exitFullscreen?.();
    btnFull.classList.remove('active');
  }
});
document.addEventListener('fullscreenchange', () => {
  btnFull.classList.toggle('active', !!document.fullscreenElement);
});

// ---------- Etiquetas flotantes (sprites) ----------
function makeLabel(text, color) {
  const pad = 28; const fs = 46;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  ctx.font = `700 ${fs}px 'Space Grotesk', sans-serif`;
  const w = ctx.measureText(text).width;
  c.width = w + pad * 2; c.height = fs + pad * 1.4;
  const ctx2 = c.getContext('2d');
  ctx2.font = `700 ${fs}px 'Space Grotesk', sans-serif`;
  ctx2.fillStyle = 'rgba(10,14,22,0.78)';
  const r = 22;
  ctx2.beginPath();
  ctx2.roundRect(0, 0, c.width, c.height, r);
  ctx2.fill();
  ctx2.strokeStyle = color; ctx2.lineWidth = 5;
  ctx2.stroke();
  ctx2.fillStyle = color;
  ctx2.textBaseline = 'middle';
  ctx2.fillText(text, pad, c.height / 2 + 2);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
  spr.scale.set(c.width / 320, c.height / 320, 1);
  return spr;
}

function buildLabels() {
  labelsGroup = new THREE.Group();
  const L = [
    ['A · BIBLIOTECA', '#3FA7FF', [d(-2250), d(2500), d(-1560)]],
    ['B · TALLER', '#FFB300', [d(2550), d(2500), d(-440)]],
    ['C · INFORMÁTICA', '#7C5CFF', [d(-350), d(2200), d(1920)]],
    ['ZONA FLEXIBLE', '#2ECC8F', [d(-1450), d(2050), d(800)]]
  ];
  for (const [txt, col, pos] of L) {
    const s = makeLabel(txt, col);
    s.position.set(...pos);
    labelsGroup.add(s);
  }
  labelsGroup.renderOrder = 10;
  scene.add(labelsGroup);
}

// ---------- Hint ----------
let hintShown = false;
function showHint() {
  if (hintShown) return;
  hintShown = true;
  hintEl.classList.add('visible');
  buildLabels();
  setTimeout(() => hintEl.classList.remove('visible'), 6500);
}
container.addEventListener('pointerdown', showHint, { once: true });

// ---------- Resize + loop ----------
function resize() {
  const w = container.clientWidth, h = container.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// Hook de depuración/pruebas (permite mover la cámara desde la consola o tests)
window.__chispa = {
  fitTo,
  views: () => views,
  camera,
  controls,
  scene,
  model: () => modelRoot,
  // caja de depuración en coords del modelo (metros, y-up, SIN centrar)
  box(pos, size = [0.3, 0.3, 0.3], color = 0xff0000) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(...size),
      new THREE.MeshBasicMaterial({ color, depthTest: false })
    );
    m.renderOrder = 99;
    m.position.set(...pos);
    modelRoot?.add(m);
    return m;
  }
};

renderer.setAnimationLoop(() => {
  if (rotating) {
    const t = performance.now() * 0.00012;
    const r = camera.position.distanceTo(controls.target);
    camera.position.x = controls.target.x + Math.cos(t) * r;
    camera.position.z = controls.target.z + Math.sin(t) * r;
  }
  controls.update();
  renderer.render(scene, camera);
});
