/* SNL's Bakery: sala navideña low poly con three.js.
   Árbol con esferas-galleta, focos C9 de los 80 y LEDs, tren de juguete, chimenea y los tres gatos. */
import * as THREE from 'three';

const datos = window.SNL || { negocio: {}, productos: [] };
const productos = datos.productos || [];
const gatosCfg = (datos.negocio && datos.negocio.gatos) || [];
const cont = document.getElementById('escena');
const hero = document.getElementById('inicio');
const tip = document.getElementById('tip');
const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function hayWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}
if (cont && hayWebGL()) {
  try { iniciar(); } catch (e) { console.error(e); document.documentElement.classList.add('sin-3d'); cont.replaceChildren(); }
} else {
  document.documentElement.classList.add('sin-3d');
}

function iniciar() {
  // ---------- utilidades
  const hash = (x, y, z) => { const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return (h - Math.floor(h)) * 2 - 1; };
  const r3 = (v) => Math.round(v * 1000) / 1000;
  function sacudir(geo, a) {
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = r3(p.getX(i)), y = r3(p.getY(i)), z = r3(p.getZ(i));
      p.setXYZ(i, x + hash(x, y, z) * a, y + hash(y, z, x) * a * 0.5, z + hash(z, x, y) * a);
    }
    geo.computeVertexNormals();
    return geo;
  }
  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.82, metalness: 0, ...extra });
  const malla = (geo, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); return o; };
  function textura(w, h, pintar, rx = 1, ry = 1) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    pintar(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry);
    t.anisotropy = 4;
    return t;
  }
  const brillo = textura(64, 64, (g, w) => {
    const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.25, 'rgba(255,255,255,.55)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, w, w);
  });
  const halo = (color, escala, opacidad = 0.55) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: brillo, color, transparent: true, opacity: opacidad, blending: THREE.AdditiveBlending, depthWrite: false }));
    s.scale.setScalar(escala); return s;
  };

  // ---------- render, escena y cámara
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  cont.appendChild(renderer.domElement);
  const escena = new THREE.Scene();
  escena.background = new THREE.Color('#1c130e');
  escena.fog = new THREE.Fog('#1c130e', 16, 30);
  const camara = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
  const objetivo = new THREE.Vector3(0, 1.9, 0);

  escena.add(new THREE.HemisphereLight('#ffd9ad', '#2a160b', 1.25));
  const clave = new THREE.DirectionalLight('#ffe2c2', 1.7); clave.position.set(5, 9, 8); escena.add(clave);
  const contra = new THREE.DirectionalLight('#9db4ff', 0.35); contra.position.set(-6, 5, -4); escena.add(contra);
  const luzArbol = new THREE.PointLight('#ffc983', 4, 8, 1.6); luzArbol.position.set(0, 2.5, 2.4); escena.add(luzArbol);

  // ---------- sala: piso, alfombra de tartán, pared y chimenea
  const piso = malla(new THREE.PlaneGeometry(44, 44), new THREE.MeshStandardMaterial({
    roughness: 0.86, map: textura(512, 512, (g, w, h) => {
      const tonos = ['#5a3823', '#4f311f', '#61402a', '#553522'];
      for (let i = 0; i < 8; i++) { g.fillStyle = tonos[i % 4]; g.fillRect(0, i * h / 8, w, h / 8); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, i * h / 8, w, 2); g.fillRect((i * 173) % w, i * h / 8, 2, h / 8); }
    }, 7, 7)
  }));
  piso.rotation.x = -Math.PI / 2; escena.add(piso);

  const tartan = textura(512, 512, (g, w, h) => {
    g.fillStyle = '#a31d24'; g.fillRect(0, 0, w, h);
    const bandas = [[0, 70, '#1e4d2b'], [70, 40, '#1b2a4a'], [150, 6, '#e8c547'], [230, 70, '#1e4d2b'], [330, 4, '#f2efe6'], [400, 40, '#1b2a4a'], [470, 6, '#e8c547']];
    g.globalAlpha = 0.55;
    bandas.forEach(([p, a, c]) => { g.fillStyle = c; g.fillRect(p, 0, a, h); g.fillRect(0, p, w, a); });
    g.globalAlpha = 0.12; g.fillStyle = '#000';
    for (let i = 0; i < w; i += 4) g.fillRect(i, 0, 1, h);
  }, 2.5, 2.5);
  const alfombra = malla(new THREE.CircleGeometry(3.45, 44), new THREE.MeshStandardMaterial({ map: tartan, roughness: 0.95 }), 0, 0.006, 0);
  alfombra.rotation.x = -Math.PI / 2; escena.add(alfombra);
  const fleco = malla(new THREE.RingGeometry(3.45, 3.6, 44), new THREE.MeshStandardMaterial({ color: '#efe2c6', roughness: 1 }), 0, 0.007, 0);
  fleco.rotation.x = -Math.PI / 2; escena.add(fleco);

  const papelTapiz = textura(256, 256, (g, w, h) => {
    g.fillStyle = '#1f3a2a'; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(239,226,198,.07)'; for (let x = 0; x < w; x += 32) g.fillRect(x, 0, 2, h);
    g.fillStyle = 'rgba(214,170,80,.24)';
    for (let y = 16; y < h; y += 32) for (let x = 16; x < w; x += 32) {
      const cx = x + ((y - 16) / 32 % 2) * 16 - 8;
      g.beginPath(); g.moveTo(cx, y - 5); g.lineTo(cx + 3, y); g.lineTo(cx, y + 5); g.lineTo(cx - 3, y); g.closePath(); g.fill();
    }
  }, 12, 4);
  const pared = malla(new THREE.PlaneGeometry(44, 13), new THREE.MeshStandardMaterial({ map: papelTapiz, roughness: 0.95 }), 0, 6.5, -7.2);
  escena.add(pared);
  escena.add(malla(new THREE.BoxGeometry(44, 1.3, 0.14), mat('#e6d8bb'), 0, 0.65, -7.12));
  escena.add(malla(new THREE.BoxGeometry(44, 0.1, 0.24), mat('#4a2c1a'), 0, 1.32, -7.08));

  const rincon = new THREE.Group(); escena.add(rincon);
  const chim = new THREE.Group(); chim.position.set(0, 0, -6.6); rincon.add(chim);
  const marmol = mat('#e9e1d2', { roughness: 0.6 });
  chim.add(malla(new THREE.BoxGeometry(0.6, 2.25, 0.72), marmol, -1.3, 1.12, 0));
  chim.add(malla(new THREE.BoxGeometry(0.6, 2.25, 0.72), marmol, 1.3, 1.12, 0));
  chim.add(malla(new THREE.BoxGeometry(3.2, 0.45, 0.74), marmol, 0, 2.3, 0));
  chim.add(malla(new THREE.BoxGeometry(2.0, 1.85, 0.3), mat('#140d0a', { roughness: 1 }), 0, 0.93, -0.2));
  chim.add(malla(new THREE.BoxGeometry(3.7, 0.15, 1.0), mat('#4a2c1a'), 0, 2.6, 0.08));
  chim.add(malla(new THREE.BoxGeometry(3.9, 0.12, 1.4), mat('#5d5650', { roughness: 0.9 }), 0, 0.06, 0.45));
  const marco = malla(new THREE.BoxGeometry(1.7, 1.15, 0.06), mat('#c49a45', { metalness: 0.55, roughness: 0.4 }), 0, 3.55, -0.3);
  chim.add(marco);
  const retrato = textura(256, 160, (g, w, h) => {
    g.fillStyle = '#efe2c6'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#b8893b'; g.lineWidth = 3; g.strokeRect(10, 10, w - 20, h - 20);
    const cols = (gatosCfg.length ? gatosCfg : [{ pelaje: '#8a7560' }, { pelaje: '#d47f2c' }, { pelaje: '#38363a' }]).slice(0, 3);
    cols.forEach((cfg, i) => {
      const cx = w * (0.27 + i * 0.23), cy = h * 0.6, r = 26;
      g.fillStyle = cfg.pelaje;
      g.beginPath(); g.moveTo(cx - r * 0.95, cy - r * 0.25); g.lineTo(cx - r * 0.75, cy - r * 1.35); g.lineTo(cx - r * 0.15, cy - r * 0.85); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(cx + r * 0.95, cy - r * 0.25); g.lineTo(cx + r * 0.75, cy - r * 1.35); g.lineTo(cx + r * 0.15, cy - r * 0.85); g.closePath(); g.fill();
      g.beginPath(); g.ellipse(cx, cy, r, r * 0.86, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = cfg.ojos || '#c9a43b';
      g.beginPath(); g.ellipse(cx - r * 0.38, cy - r * 0.1, 4, 5, 0, 0, Math.PI * 2); g.ellipse(cx + r * 0.38, cy - r * 0.1, 4, 5, 0, 0, Math.PI * 2); g.fill();
    });
    g.fillStyle = '#6b1d28'; g.font = 'italic 600 18px Georgia, serif'; g.textAlign = 'center';
    g.fillText('S · N · L', w / 2, h - 18);
  });
  chim.add(malla(new THREE.PlaneGeometry(1.45, 0.9), new THREE.MeshStandardMaterial({ map: retrato, roughness: 0.9 }), 0, 3.55, -0.26));
  const lena = mat('#5b3a22');
  const t1 = malla(new THREE.CylinderGeometry(0.09, 0.1, 1.05, 6), lena, 0, 0.22, 0.05); t1.rotation.z = Math.PI / 2; t1.rotation.y = 0.3; chim.add(t1);
  const t2 = malla(new THREE.CylinderGeometry(0.09, 0.1, 1.0, 6), lena, 0, 0.3, 0.12); t2.rotation.z = Math.PI / 2; t2.rotation.y = -0.35; chim.add(t2);
  const llamas = [];
  [['#ff6a1a', 0.22, 0.75, -0.2], ['#ffb23a', 0.17, 0.62, 0.08], ['#ff8c1f', 0.2, 0.7, 0.3], ['#ffd25a', 0.12, 0.48, -0.02]].forEach(([c, r, hgt, x], i) => {
    const l = malla(new THREE.ConeGeometry(r, hgt, 5), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.88 }), x, 0.3 + hgt / 2, 0.08 + i * 0.02);
    l.userData.base = hgt; llamas.push(l); chim.add(l);
  });
  const haloFuego = halo('#ff8a2a', 2.6, 0.5); haloFuego.position.set(0, 0.7, 0.3); chim.add(haloFuego);
  const fuego = new THREE.PointLight('#ff7a26', 22, 10, 1.6); fuego.position.set(0, 0.9, -5.7); rincon.add(fuego);
  [['#b3261e', -1.0], ['#1f5a37', 0], ['#efe2c6', 1.0]].forEach(([c, x], i) => {
    const media = new THREE.Group(); media.position.set(x, 2.25, 0.5); media.rotation.z = (i - 1) * 0.06;
    media.add(malla(new THREE.BoxGeometry(0.22, 0.4, 0.07), mat(c), 0, -0.25, 0));
    media.add(malla(new THREE.BoxGeometry(0.32, 0.15, 0.07), mat(c), 0.06, -0.48, 0));
    media.add(malla(new THREE.BoxGeometry(0.27, 0.1, 0.09), mat('#fbf6ea'), 0, -0.02, 0));
    chim.add(media);
  });
  const guirnalda = new THREE.CatmullRomCurve3([-1.75, -0.9, 0, 0.9, 1.75].map((x, i) => new THREE.Vector3(x, 2.62 - (i % 2) * 0.16, 0.6)));
  chim.add(new THREE.Mesh(new THREE.TubeGeometry(guirnalda, 40, 0.07, 5), mat('#1f5a37')));
  [-1.45, 1.45].forEach((x) => {
    chim.add(malla(new THREE.CylinderGeometry(0.05, 0.08, 0.32, 6), mat('#c49a45', { metalness: 0.6, roughness: 0.35 }), x, 2.84, 0.15));
    chim.add(malla(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 6), mat('#f5ecd7'), x, 3.11, 0.15));
    const h = halo('#ffcf7a', 0.5, 0.8); h.position.set(x, 3.26, 0.15); chim.add(h);
  });

  const ventana = new THREE.Group(); ventana.position.set(-4.3, 0, -7.1); escena.add(ventana);
  const noche = textura(128, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#0c1630'); gr.addColorStop(0.7, '#1c2c55'); gr.addColorStop(1, '#3a4a7a');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#e9eef7';
    g.beginPath(); g.moveTo(0, h); g.lineTo(0, h * 0.86); g.quadraticCurveTo(w * 0.35, h * 0.8, w * 0.6, h * 0.87); g.quadraticCurveTo(w * 0.85, h * 0.92, w, h * 0.84); g.lineTo(w, h); g.fill();
    g.fillStyle = 'rgba(255,255,255,.8)';
    for (let i = 0; i < 26; i++) g.fillRect((i * 53) % w, (i * 97) % (h * 0.7), 1.5, 1.5);
  });
  ventana.add(malla(new THREE.PlaneGeometry(1.7, 2.3), new THREE.MeshBasicMaterial({ map: noche }), 0, 3.25, 0));
  const madera = mat('#efe2c6', { roughness: 0.7 });
  ventana.add(malla(new THREE.BoxGeometry(1.95, 0.14, 0.16), madera, 0, 4.47, 0.05));
  ventana.add(malla(new THREE.BoxGeometry(2.15, 0.12, 0.3), madera, 0, 2.04, 0.1));
  [-0.92, 0.92].forEach((x) => ventana.add(malla(new THREE.BoxGeometry(0.12, 2.5, 0.16), madera, x, 3.25, 0.05)));
  ventana.add(malla(new THREE.BoxGeometry(0.05, 2.3, 0.06), madera, 0, 3.25, 0.06));
  ventana.add(malla(new THREE.BoxGeometry(1.7, 0.05, 0.06), madera, 0, 3.4, 0.06));
  [-1, 1].forEach((sgn) => {
    const cortina = malla(sacudir(new THREE.BoxGeometry(0.55, 2.9, 0.1, 3, 6, 1), 0.04), mat('#8e1f22', { roughness: 0.95 }), sgn * 1.2, 3.05, 0.22);
    cortina.rotation.z = sgn * -0.03; ventana.add(cortina);
    ventana.add(malla(new THREE.BoxGeometry(0.6, 0.08, 0.14), mat('#d2a646', { metalness: 0.5, roughness: 0.4 }), sgn * 1.2, 2.6, 0.3));
  });
  ventana.add(malla(new THREE.BoxGeometry(3.0, 0.07, 0.07), mat('#c49a45', { metalness: 0.6, roughness: 0.35 }), 0, 4.6, 0.3));
  const copos = [];
  const nieveGeo = new THREE.BufferGeometry();
  const nievePos = new Float32Array(40 * 3);
  for (let i = 0; i < 40; i++) { const c = { x: (Math.random() - 0.5) * 1.6, y: 2.15 + Math.random() * 2.2, v: 0.12 + Math.random() * 0.18, f: Math.random() * 6.28 }; copos.push(c); nievePos.set([c.x, c.y, 0.02], i * 3); }
  nieveGeo.setAttribute('position', new THREE.BufferAttribute(nievePos, 3));
  ventana.add(new THREE.Points(nieveGeo, new THREE.PointsMaterial({ size: 0.05, color: '#ffffff', map: brillo, transparent: true, depthWrite: false })));

  // ---------- árbol
  const capas = [
    { yb: 0.45, h: 1.55, r: 1.75, c: '#1e5634' }, { yb: 1.15, h: 1.4, r: 1.42, c: '#205a37' },
    { yb: 1.85, h: 1.25, r: 1.1, c: '#225e3a' }, { yb: 2.5, h: 1.1, r: 0.78, c: '#24623d' },
    { yb: 3.1, h: 0.95, r: 0.48, c: '#266740' }
  ];
  const radioEn = (y) => capas.reduce((m, k) => (y >= k.yb && y <= k.yb + k.h ? Math.max(m, k.r * (1 - (y - k.yb) / k.h)) : m), 0);
  const arbol = new THREE.Group(); escena.add(arbol);
  arbol.add(malla(new THREE.CylinderGeometry(0.16, 0.22, 0.6, 7), mat('#4a2e1b'), 0, 0.3, 0));
  arbol.add(malla(new THREE.CylinderGeometry(0.58, 0.68, 0.24, 8), mat('#8e1f22', { roughness: 0.6 }), 0, 0.12, 0));
  const aro = malla(new THREE.TorusGeometry(0.6, 0.025, 4, 16), mat('#c49a45', { metalness: 0.6, roughness: 0.35 }), 0, 0.24, 0);
  aro.rotation.x = Math.PI / 2; arbol.add(aro);
  capas.forEach((k) => {
    const g = sacudir(new THREE.ConeGeometry(k.r, k.h, 9, 2), 0.05);
    const m = malla(g, mat(k.c, { roughness: 0.9 }), 0, k.yb + k.h / 2, 0);
    m.rotation.y = k.yb * 2.1; arbol.add(m);
  });
  const forma = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.12 : 0.29;
    i ? forma.lineTo(Math.cos(a) * r, Math.sin(a) * r) : forma.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const estrellaGeo = new THREE.ExtrudeGeometry(forma, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.018, bevelSegments: 1 });
  estrellaGeo.center();
  const estrella = malla(estrellaGeo, mat('#d9a93a', { metalness: 0.7, roughness: 0.28, emissive: '#7a5200', emissiveIntensity: 0.7 }), 0, 4.32, 0);
  arbol.add(estrella);
  const haloEstrella = halo('#ffd27a', 1.3, 0.6); haloEstrella.position.set(0, 4.32, 0); arbol.add(haloEstrella);

  // Focos C9 de los 80 en espiral
  const coloresC9 = ['#ff2d1f', '#1fbf4a', '#2563ff', '#ff8a00', '#ffd21f', '#ff3ea5'];
  const espiral = (y0, y1, vueltas, extra, fase, n) => {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const f = i / n, y = y0 + (y1 - y0) * f, a = fase + f * vueltas * Math.PI * 2, r = radioEn(y) + extra;
      pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    return pts;
  };
  const curvaC9 = new THREE.CatmullRomCurve3(espiral(0.72, 3.95, 4.2, 0.07, 0.4, 260));
  arbol.add(new THREE.Mesh(new THREE.TubeGeometry(curvaC9, 520, 0.011, 4), mat('#0f2a1a')));
  const perfil = [[0, 0], [0.026, 0.012], [0.044, 0.045], [0.047, 0.076], [0.037, 0.11], [0.019, 0.14], [0, 0.156]].map(([x, y]) => new THREE.Vector2(x, y));
  const focoGeo = new THREE.LatheGeometry(perfil, 8);
  const zocaloGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.04, 6);
  const matsC9 = coloresC9.map((c) => mat(c, { emissive: c, emissiveIntensity: 2.3, roughness: 0.35 }));
  const zocaloMat = mat('#173a26');
  const focos = [];
  curvaC9.getSpacedPoints(56).slice(1).forEach((p, i) => {
    const dir = new THREE.Vector3(p.x, -0.45, p.z).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    const z = malla(zocaloGeo, zocaloMat); z.position.copy(p); z.quaternion.copy(q); arbol.add(z);
    const f = malla(focoGeo, matsC9[i % 6]); f.position.copy(p).addScaledVector(dir, 0.015); f.quaternion.copy(q); arbol.add(f);
    const h = halo(coloresC9[i % 6], 0.42, 0.5); h.position.copy(p).addScaledVector(dir, 0.1); arbol.add(h);
    focos.push({ h, fase: Math.random() * 6.28, vel: 0.6 + Math.random() * 1.4 });
  });

  // LEDs chiquitos
  const ledPts = espiral(0.62, 4.02, 7, 0.025, 2.6, 200);
  const ledPos = new Float32Array(ledPts.length * 3), ledCol = new Float32Array(ledPts.length * 3), ledBase = [];
  const calidos = ['#fff1c4', '#fff1c4', '#fff1c4', '#ffe0a3', '#cfe6ff', '#ffb3d0'];
  ledPts.forEach((p, i) => {
    ledPos.set([p.x, p.y, p.z], i * 3);
    const c = new THREE.Color(calidos[Math.floor(Math.random() * calidos.length)]);
    ledBase.push({ c, fase: Math.random() * 6.28, vel: 1 + Math.random() * 3 });
    ledCol.set([c.r, c.g, c.b], i * 3);
  });
  const ledGeo = new THREE.BufferGeometry();
  ledGeo.setAttribute('position', new THREE.BufferAttribute(ledPos, 3));
  ledGeo.setAttribute('color', new THREE.BufferAttribute(ledCol, 3));
  arbol.add(new THREE.Points(ledGeo, new THREE.PointsMaterial({ size: 0.09, map: brillo, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

  // Esferas: cada una es una galleta del catálogo
  const esferas = [];
  const conLista = productos.length ? productos : [{ id: 'galleta', nombre: 'Galleta', color: '#c62828', precio: 0 }];
  const turnos = [];
  conLista.forEach((p) => { const n = p.porPedido ? 2 : 3; for (let i = 0; i < n; i++) turnos.push(p); });
  const icoGeo = new THREE.IcosahedronGeometry(1, 1);
  turnos.forEach((p, i) => {
    const s = p.porPedido ? 0.16 : 0.2;
    const f = (i + 0.5) / turnos.length;
    const y = 1.0 + 2.45 * (1 - Math.sqrt(1 - f * 0.96));
    const a = i * 2.39996 + 0.6;
    const yc = y - s * 1.1;
    let rMax = 0;
    for (let k = 0; k <= 6; k++) rMax = Math.max(rMax, radioEn(yc - s + (2 * s * k) / 6));
    const r = rMax * 0.96 + s * 0.75;
    const c = new THREE.Color(p.color || '#c62828');
    const lum = c.r * 0.3 + c.g * 0.59 + c.b * 0.11;
    const g = new THREE.Group();
    const bola = malla(icoGeo, new THREE.MeshStandardMaterial({ color: c, flatShading: true, metalness: 0.4, roughness: 0.25, emissive: c, emissiveIntensity: 0.12 }), 0, -s * 1.1, 0);
    bola.scale.setScalar(s); g.add(bola);
    const banda = malla(new THREE.TorusGeometry(s * 1.0, s * 0.11, 4, 14), mat(lum > 0.6 ? '#b3261e' : '#ecd9a6', { metalness: 0.4, roughness: 0.4 }), 0, -s * 1.1, 0);
    banda.rotation.x = Math.PI / 2; g.add(banda);
    g.add(malla(new THREE.CylinderGeometry(s * 0.28, s * 0.28, s * 0.32, 6), mat('#c9a14a', { metalness: 0.7, roughness: 0.3 }), 0, -s * 0.05, 0));
    const tapa = malla(new THREE.SphereGeometry(s * 1.9, 6, 4), new THREE.MeshBasicMaterial({ visible: false }), 0, -s * 1.1, 0);
    tapa.userData = { tipo: 'galleta', producto: p };
    g.add(tapa);
    const destino = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
    g.position.copy(destino);
    arbol.add(g);
    esferas.push({ g, bola, tapa, destino, inicio: 0.5 + i * 0.13, alto: 2.4 + (i % 3) * 0.5, fase: Math.random() * 6.28, p });
  });

  // Regalos bajo el árbol
  const regalo = (x, z, w, h, d, papel, liston, giro = 0) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = giro;
    g.add(malla(new THREE.BoxGeometry(w, h, d), papel, 0, h / 2, 0));
    const lm = mat(liston, { metalness: 0.3, roughness: 0.4 });
    g.add(malla(new THREE.BoxGeometry(w + 0.01, h + 0.01, d * 0.16), lm, 0, h / 2, 0));
    g.add(malla(new THREE.BoxGeometry(w * 0.16, h + 0.01, d + 0.01), lm, 0, h / 2, 0));
    [-1, 1].forEach((sgn) => { const m = malla(new THREE.TorusGeometry(0.07, 0.022, 4, 8), lm, sgn * 0.06, h + 0.05, 0); m.rotation.y = sgn * 0.6; g.add(m); });
    escena.add(g);
  };
  const papelTartan = new THREE.MeshStandardMaterial({ map: tartan, roughness: 0.8 });
  regalo(0.95, 1.3, 0.55, 0.38, 0.5, papelTartan, '#d9b25a', 0.3);
  regalo(-1.15, 1.05, 0.46, 0.32, 0.46, mat('#1f5a37'), '#b3261e', -0.4);
  regalo(0.1, 1.85, 0.38, 0.26, 0.38, mat('#efe2c6'), '#b3261e', 0.15);
  regalo(1.6, 0.05, 0.5, 0.5, 0.5, mat('#1b2a4a'), '#d9b25a', 0.7);
  regalo(-1.6, -0.45, 0.6, 0.3, 0.42, mat('#6b1d28'), '#d9b25a', 0.2);

  // ---------- tren
  const R = 2.62;
  const acero = mat('#a3a3ab', { metalness: 0.8, roughness: 0.35 });
  [R - 0.065, R + 0.065].forEach((rr) => { const r = malla(new THREE.TorusGeometry(rr, 0.013, 4, 140), acero, 0, 0.04, 0); r.rotation.x = Math.PI / 2; escena.add(r); });
  const durmientes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.025, 0.26), mat('#5a3a22'), 84);
  const tmp = new THREE.Object3D();
  for (let i = 0; i < 84; i++) { const a = (i / 84) * Math.PI * 2; tmp.position.set(Math.cos(a) * R, 0.015, Math.sin(a) * R); tmp.rotation.set(0, -a, 0); tmp.updateMatrix(); durmientes.setMatrixAt(i, tmp.matrix); }
  escena.add(durmientes);
  const ruedaGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.03, 10);
  const ruedas = [];
  const ponerRuedas = (g, xs, color) => xs.forEach((x) => [-0.105, 0.105].forEach((zz) => {
    const w = malla(ruedaGeo, mat(color, { metalness: 0.3 }), x, 0.06, zz); w.rotation.x = Math.PI / 2; g.add(w); ruedas.push(w);
  }));
  const oro = mat('#d2a646', { metalness: 0.7, roughness: 0.3 });
  const loco = new THREE.Group();
  loco.add(malla(new THREE.BoxGeometry(0.64, 0.06, 0.2), mat('#161616'), 0, 0.1, 0));
  const caldera = malla(new THREE.CylinderGeometry(0.088, 0.088, 0.38, 8), mat('#1d1d1f', { metalness: 0.3, roughness: 0.5 }), 0.07, 0.21, 0); caldera.rotation.z = Math.PI / 2; loco.add(caldera);
  [-0.05, 0.16].forEach((x) => { const b = malla(new THREE.TorusGeometry(0.09, 0.009, 4, 12), oro, x, 0.21, 0); b.rotation.y = Math.PI / 2; loco.add(b); });
  loco.add(malla(new THREE.CylinderGeometry(0.03, 0.045, 0.13, 6), mat('#111'), 0.19, 0.34, 0));
  loco.add(malla(new THREE.IcosahedronGeometry(0.045, 0), oro, 0.04, 0.3, 0));
  loco.add(malla(new THREE.BoxGeometry(0.21, 0.23, 0.22), mat('#b3261e', { roughness: 0.55 }), -0.19, 0.23, 0));
  loco.add(malla(new THREE.BoxGeometry(0.27, 0.03, 0.27), mat('#161616'), -0.19, 0.36, 0));
  const reja = malla(new THREE.ConeGeometry(0.09, 0.12, 4), mat('#b3261e'), 0.33, 0.08, 0); reja.rotation.z = -Math.PI / 2; loco.add(reja);
  loco.add(malla(new THREE.SphereGeometry(0.03, 6, 4), new THREE.MeshBasicMaterial({ color: '#ffe7a0' }), 0.3, 0.27, 0));
  const faro = halo('#ffd88a', 0.55, 0.75); faro.position.set(0.34, 0.27, 0); loco.add(faro);
  ponerRuedas(loco, [-0.19, 0.0, 0.18], '#8b1a1a');
  const vagones = [loco];
  [['#1f5a37', '#b3261e'], ['#efe2c6', '#1f5a37'], ['#6b1d28', '#efe2c6']].forEach(([c, c2]) => {
    const v = new THREE.Group();
    v.add(malla(new THREE.BoxGeometry(0.44, 0.05, 0.2), mat('#161616'), 0, 0.1, 0));
    v.add(malla(new THREE.BoxGeometry(0.42, 0.14, 0.2), mat(c), 0, 0.19, 0));
    v.add(malla(new THREE.BoxGeometry(0.44, 0.025, 0.22), oro, 0, 0.27, 0));
    v.add(malla(new THREE.BoxGeometry(0.16, 0.13, 0.15), mat(c2), 0.02, 0.34, 0));
    v.add(malla(new THREE.BoxGeometry(0.17, 0.135, 0.03), oro, 0.02, 0.34, 0));
    ponerRuedas(v, [-0.13, 0.13], '#222');
    vagones.push(v);
  });
  vagones.forEach((v) => escena.add(v));
  const humo = [];
  for (let i = 0; i < 9; i++) {
    const m = malla(new THREE.IcosahedronGeometry(0.05, 0), new THREE.MeshStandardMaterial({ color: '#f1ece4', flatShading: true, transparent: true, opacity: 0, depthWrite: false }));
    m.userData = { vida: -1 }; humo.push(m); escena.add(m);
  }
  let siguienteHumo = 0;

  // ---------- gatos
  const gatos = [];
  function pintarCaras(geo, cfg) {
    const g = geo.index ? geo.toNonIndexed() : geo;
    const p = g.attributes.position, cols = new Float32Array(p.count * 3);
    const base = new THREE.Color(cfg.pelaje), panza = new THREE.Color(cfg.panza || cfg.pelaje), rayas = cfg.rayas ? new THREE.Color(cfg.rayas) : null;
    for (let i = 0; i < p.count; i += 3) {
      const cx = (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3, cy = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3, cz = (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3;
      let c = base;
      if (cy < cfg.limitePanza && cx > -0.05) c = panza;
      else if (rayas && Math.sin(cx * 26 + cz * 4) > 0.45 && cy > 0) c = rayas;
      for (let k = 0; k < 3; k++) cols.set([c.r, c.g, c.b], (i + k) * 3);
    }
    g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    g.computeVertexNormals();
    return g;
  }
  const matGato = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 });
  function hacerGato(cfg, pose) {
    const gato = new THREE.Group();
    const piel = mat(cfg.pelaje, { roughness: 0.95 });
    const blanco = mat(cfg.panza || cfg.pelaje, { roughness: 0.95 });
    const cuerpoGeo = new THREE.IcosahedronGeometry(0.3, 1);
    const esc = pose === 'jugando' ? [0.92, 1.25, 0.82] : pose === 'dormida' ? [1.15, 0.52, 1.02] : [1.45, 0.62, 0.84];
    cuerpoGeo.scale(...esc);
    const cuerpo = malla(pintarCaras(cuerpoGeo, { ...cfg, limitePanza: pose === 'jugando' ? 0.05 : -0.08 }), matGato);
    cuerpo.position.y = pose === 'jugando' ? 0.34 : pose === 'dormida' ? 0.16 : 0.19;
    gato.add(cuerpo);
    const cabeza = new THREE.Group();
    const cabGeo = new THREE.IcosahedronGeometry(0.17, 1); cabGeo.scale(1, 0.9, 1.05);
    cabeza.add(malla(pintarCaras(cabGeo, { ...cfg, limitePanza: -0.06 }), matGato));
    [-1, 1].forEach((s) => {
      const oreja = malla(new THREE.ConeGeometry(0.06, 0.12, 4), piel, -0.01, 0.15, s * 0.085); oreja.rotation.x = s * 0.35; cabeza.add(oreja);
      const dentro = malla(new THREE.ConeGeometry(0.035, 0.08, 4), mat('#e2a0a0'), 0.022, 0.14, s * 0.082); dentro.rotation.x = s * 0.35; cabeza.add(dentro);
    });
    const hocico = malla(new THREE.IcosahedronGeometry(0.07, 0), blanco, 0.13, -0.04, 0); hocico.scale.set(0.75, 0.62, 1.05); cabeza.add(hocico);
    cabeza.add(malla(new THREE.IcosahedronGeometry(0.018, 0), mat('#d98a8a'), 0.18, -0.005, 0));
    if (pose === 'dormida') {
      [-1, 1].forEach((s) => { const o = malla(new THREE.BoxGeometry(0.012, 0.01, 0.045), mat('#1a1410'), 0.145, 0.03, s * 0.06); o.rotation.y = s * 0.2; cabeza.add(o); });
    } else {
      [-1, 1].forEach((s) => {
        cabeza.add(malla(new THREE.IcosahedronGeometry(0.024, 0), mat(cfg.ojos || '#c9a43b', { emissive: cfg.ojos || '#c9a43b', emissiveIntensity: 0.25 }), 0.14, 0.035, s * 0.062));
        cabeza.add(malla(new THREE.BoxGeometry(0.008, 0.03, 0.008), mat('#0c0a08'), 0.162, 0.035, s * 0.062));
      });
    }
    if (pose === 'jugando') cabeza.position.set(0.06, 0.74, 0);
    else if (pose === 'dormida') { cabeza.position.set(0.24, 0.17, 0.2); cabeza.rotation.set(0.5, -0.5, -0.25); }
    else cabeza.position.set(0.38, 0.33, 0);
    gato.add(cabeza);
    const colaPts = pose === 'jugando'
      ? [[-0.12, 0.06, 0], [-0.36, 0.04, 0.1], [-0.5, 0.08, 0.28], [-0.48, 0.2, 0.4]]
      : pose === 'dormida'
        ? [[-0.3, 0.07, -0.08], [-0.15, 0.06, -0.33], [0.15, 0.06, -0.34], [0.36, 0.07, -0.08]]
        : [[-0.4, 0.09, 0], [-0.46, 0.06, 0.2], [-0.26, 0.05, 0.34], [0.04, 0.05, 0.36]];
    const cola = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(colaPts.map((v) => new THREE.Vector3(...v))), 16, 0.04, 5), mat(cfg.rayas || cfg.pelaje, { roughness: 0.95 }));
    gato.add(cola);
    let pataJuego = null;
    if (pose === 'jugando') {
      gato.add(malla(new THREE.IcosahedronGeometry(0.05, 0), blanco, 0.16, 0.05, 0.08));
      pataJuego = new THREE.Group(); pataJuego.position.set(0.12, 0.42, -0.08);
      pataJuego.add(malla(new THREE.CylinderGeometry(0.035, 0.04, 0.3, 5), piel, 0, -0.15, 0));
      pataJuego.add(malla(new THREE.IcosahedronGeometry(0.05, 0), blanco, 0, -0.3, 0));
      gato.add(pataJuego);
    } else if (pose === 'echada') {
      [-1, 1].forEach((s) => gato.add(malla(new THREE.IcosahedronGeometry(0.05, 0), blanco, 0.42, 0.05, s * 0.09)));
    }
    const tapa = malla(new THREE.SphereGeometry(0.55, 6, 4), new THREE.MeshBasicMaterial({ visible: false }), 0, 0.3, 0);
    tapa.userData = { tipo: 'gato', nombre: cfg.nombre, pose };
    gato.add(tapa);
    return { gato, cuerpo, cabeza, cola, pataJuego, tapa, esc };
  }
  const mirar = (obj, x, z) => { obj.rotation.y = Math.atan2(-(z - obj.position.z), x - obj.position.x); };
  const lugares = { echada: [1.55, 2.95], jugando: [-1.2, 3.05], dormida: [-1.45, -4.75] };
  const poses = ['echada', 'jugando', 'dormida'];
  (gatosCfg.length ? gatosCfg : [{ nombre: 'Sundae', pelaje: '#8a7560' }, { nombre: 'Lana', pelaje: '#d47f2c' }, { nombre: 'Nimue', pelaje: '#38363a' }]).slice(0, 3).forEach((cfg, i) => {
    const pose = poses.includes(cfg.pose) ? cfg.pose : poses[i];
    const g = hacerGato(cfg, pose);
    const [x, z] = lugares[pose];
    g.gato.position.set(x, 0, z);
    if (pose === 'echada') mirar(g.gato, 0, 0.4);
    if (pose === 'jugando') mirar(g.gato, 0.4, 6.5);
    if (pose === 'dormida') {
      const cojin = new THREE.Group(); cojin.position.set(x, 0, z);
      cojin.add(malla(new THREE.CylinderGeometry(0.62, 0.68, 0.12, 10), mat('#6b1d28', { roughness: 0.9 }), 0, 0.06, 0));
      const ribete = malla(new THREE.TorusGeometry(0.65, 0.03, 4, 18), mat('#d2a646', { metalness: 0.5 }), 0, 0.12, 0);
      ribete.rotation.x = Math.PI / 2; cojin.add(ribete);
      rincon.add(cojin);
      g.gato.position.y = 0.11; g.gato.rotation.y = 0.8;
    }
    (pose === 'dormida' ? rincon : escena).add(g.gato);
    if (pose === 'jugando') {
      const p = productos[2] || productos[0] || { color: '#2f6fd6' };
      const caida = malla(new THREE.IcosahedronGeometry(0.13, 1), new THREE.MeshStandardMaterial({ color: p.color || '#2f6fd6', flatShading: true, metalness: 0.4, roughness: 0.25 }), 0.52, 0.13, -0.12);
      g.gato.add(caida); g.caida = caida;
    }
    gatos.push({ ...g, pose, fase: i * 1.7 });
  });

  // ---------- cámara: encuadre, arrastre y balanceo
  let az = 0, azObj = 0, alt = 0.2, ancho = 1, alto = 1, dist = 11, azBase = 0, empuje = 0;
  function encuadrar() {
    ancho = cont.clientWidth || 1; alto = cont.clientHeight || 1;
    renderer.setSize(ancho, alto, false);
    const asp = ancho / alto;
    camara.aspect = asp;
    const vertical = asp < 1;
    camara.fov = vertical ? 40 : 34;
    camara.updateProjectionMatrix();
    const tan = Math.tan(THREE.MathUtils.degToRad(camara.fov / 2));
    const necesitaAlto = vertical ? 6.4 : 5.2, necesitaAncho = vertical ? 4.9 : 9.2;
    dist = Math.max(necesitaAlto / 2 / tan, necesitaAncho / 2 / (tan * asp)) + 1.2;
    const desplazar = asp > 1.25 && window.innerWidth > 760;
    objetivo.set(desplazar ? -0.95 : 0, vertical ? 1.8 : 1.95, 0);
    rincon.position.x = desplazar ? 5.0 : vertical ? 3.0 : 4.4;
    ventana.position.x = desplazar ? -4.6 : vertical ? -3.2 : -4.3;
    azBase = desplazar ? -0.12 : 0;
    colocarCamara();
  }
  function colocarCamara() {
    const a = azBase + az;
    camara.position.set(objetivo.x + Math.sin(a) * dist, objetivo.y + 1.15 + alt, Math.cos(a) * dist);
    camara.lookAt(objetivo);
  }
  new ResizeObserver(encuadrar).observe(cont);
  encuadrar();

  const lienzo = renderer.domElement;
  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  const tapas = [...esferas.map((e) => e.tapa), ...gatos.map((g) => g.tapa)];
  let arrastre = null, ultimoToque = 0, encima = null;
  function elegir(ev) {
    const r = lienzo.getBoundingClientRect();
    ptr.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camara);
    const hit = ray.intersectObjects(tapas.filter((t) => t.parent.visible), false)[0];
    return hit ? hit.object : null;
  }
  const dinero = (n) => '$' + Math.round(n).toLocaleString('es-MX');
  function mostrarTip(obj, ev) {
    if (!tip || !hero) return;
    if (!obj) { tip.hidden = true; return; }
    const d = obj.userData;
    tip.replaceChildren();
    const b = document.createElement('b');
    if (d.tipo === 'galleta') {
      b.textContent = d.producto.nombre;
      tip.append(b, document.createElement('br'), d.producto.piezas ? d.producto.piezas + ' piezas · ' + dinero(d.producto.precio) : '');
    } else {
      b.textContent = d.nombre;
      tip.append(b, ' ' + ({ echada: 'cuidando el tren', jugando: 'jugando con una esfera', dormida: 'dormida junto a la chimenea' }[d.pose] || ''));
    }
    const rh = hero.getBoundingClientRect();
    tip.style.left = Math.min(Math.max(ev.clientX - rh.left, 90), rh.width - 90) + 'px';
    tip.style.top = Math.max(ev.clientY - rh.top, 60) + 'px';
    tip.hidden = false;
  }
  lienzo.addEventListener('pointerdown', (ev) => { arrastre = { x: ev.clientX, y: ev.clientY, az: azObj, movio: false }; });
  lienzo.addEventListener('pointermove', (ev) => {
    if (arrastre) {
      const dx = ev.clientX - arrastre.x;
      if (Math.abs(dx) > 6) arrastre.movio = true;
      azObj = THREE.MathUtils.clamp(arrastre.az - dx * 0.006, -0.95, 0.95);
      empuje = 3;
      if (reducido) { az = azObj; colocarCamara(); dibujar(); }
      return;
    }
    if (ev.pointerType !== 'mouse') return;
    const obj = elegir(ev);
    encima = obj;
    lienzo.classList.toggle('sobre-esfera', !!obj);
    mostrarTip(obj, ev);
  });
  const soltar = (ev) => {
    if (arrastre && !arrastre.movio) {
      const obj = elegir(ev);
      if (obj) {
        mostrarTip(obj, ev);
        if (obj.userData.tipo === 'galleta') {
          const id = obj.userData.producto.id;
          setTimeout(() => window.dispatchEvent(new CustomEvent('snl:producto', { detail: { id } })), ev.pointerType === 'mouse' ? 0 : 650);
        }
        ultimoToque = performance.now();
      } else if (tip) tip.hidden = true;
    }
    arrastre = null;
  };
  lienzo.addEventListener('pointerup', soltar);
  lienzo.addEventListener('pointercancel', () => { arrastre = null; });
  lienzo.addEventListener('pointerleave', () => { if (!arrastre && tip && performance.now() - ultimoToque > 1500) tip.hidden = true; lienzo.classList.remove('sobre-esfera'); });

  // ---------- animación
  const reloj = new THREE.Clock();
  let visible = true;
  const rebote = (x) => { const n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75; if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375; return n * (x -= 2.625 / d) * x + 0.984375; };
  const tmpV = new THREE.Vector3();
  function actualizar(t, dt) {
    esferas.forEach((e) => {
      const k = reducido ? 1 : THREE.MathUtils.clamp((t - e.inicio) / 0.9, 0, 1);
      e.g.visible = k > 0;
      e.g.position.set(e.destino.x, e.destino.y + (1 - rebote(k)) * e.alto, e.destino.z);
      if (!reducido) e.g.rotation.z = Math.sin(t * 1.3 + e.fase) * 0.05;
      const s = e.tapa === encima ? 1.18 : 1;
      e.g.scale.lerp(tmpV.set(s, s, s), 0.2);
    });
    const th0 = t * 0.3;
    vagones.forEach((v, i) => {
      const th = th0 - i * (0.66 / R);
      v.position.set(Math.cos(th) * R, 0.035, Math.sin(th) * R);
      v.rotation.y = -th - Math.PI / 2;
    });
    if (reducido) return;
    focos.forEach((f) => { f.h.material.opacity = 0.32 + 0.28 * (0.5 + 0.5 * Math.sin(t * f.vel + f.fase)); });
    const col = ledGeo.attributes.color;
    ledBase.forEach((l, i) => { const b = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * l.vel + l.fase)); col.setXYZ(i, l.c.r * b, l.c.g * b, l.c.b * b); });
    col.needsUpdate = true;
    llamas.forEach((l, i) => { l.scale.y = 0.8 + 0.3 * Math.sin(t * (7 + i) + i) * Math.sin(t * 3.1 + i * 2); l.rotation.y = t * (0.6 + i * 0.2); });
    fuego.intensity = 20 + 5 * Math.sin(t * 9.1) * Math.sin(t * 4.3 + 1);
    haloFuego.material.opacity = 0.42 + 0.1 * Math.sin(t * 7.3);
    estrella.rotation.y = t * 0.5;
    const np = nieveGeo.attributes.position;
    copos.forEach((c, i) => { c.y -= c.v * dt; if (c.y < 2.12) c.y = 4.38; np.setXY(i, THREE.MathUtils.clamp(c.x + Math.sin(t * 0.8 + c.f) * 0.04, -0.82, 0.82), c.y); });
    np.needsUpdate = true;
    ruedas.forEach((w) => { w.rotation.y += dt * 5.5; });
    if (t >= siguienteHumo) {
      siguienteHumo = t + 0.32;
      const m = humo.find((h) => h.userData.vida < 0);
      if (m) { loco.localToWorld(m.position.set(0.19, 0.42, 0)); m.userData.vida = 0; m.userData.nace = t; m.userData.y0 = m.position.y; m.scale.setScalar(0.6); }
    }
    humo.forEach((m) => {
      if (m.userData.vida < 0) return;
      m.userData.vida = t - m.userData.nace;
      const v = m.userData.vida / 1.6;
      if (v >= 1) { m.userData.vida = -1; m.material.opacity = 0; return; }
      m.position.y = m.userData.y0 + m.userData.vida * 0.42; m.scale.setScalar(0.6 + v * 1.6); m.material.opacity = 0.55 * (1 - v);
    });
    gatos.forEach((g) => {
      const resp = 1 + Math.sin(t * (g.pose === 'dormida' ? 1.4 : 2.1) + g.fase) * 0.025;
      g.cuerpo.scale.set(1, resp, 1);
      if (g.pose === 'echada') {
        const loc = vagones[0].position;
        const local = g.gato.worldToLocal(tmpV.copy(loc));
        g.cabeza.rotation.y = THREE.MathUtils.lerp(g.cabeza.rotation.y, THREE.MathUtils.clamp(Math.atan2(-local.z, local.x), -0.9, 0.9), 0.05);
        g.cola.rotation.y = Math.sin(t * 1.6) * 0.06;
      }
      if (g.pose === 'jugando' && g.pataJuego) {
        const ciclo = (t + g.fase) % 2.6;
        const golpe = ciclo < 0.5 ? Math.sin((ciclo / 0.5) * Math.PI) : 0;
        g.pataJuego.rotation.z = -0.15 - golpe * 1.05;
        g.pataJuego.rotation.x = golpe * 0.25;
        if (g.caida) { g.caida.rotation.x += golpe * dt * 6; g.caida.position.z = -0.12 + Math.sin((t + g.fase) * 0.9) * 0.05; }
        g.cola.rotation.x = Math.sin(t * 3 + g.fase) * 0.12;
        g.cabeza.rotation.z = -0.15 + golpe * 0.1;
      }
    });
    if (!arrastre) {
      empuje = Math.max(0, empuje - dt);
      if (empuje <= 0) azObj = THREE.MathUtils.lerp(azObj, Math.sin(t * 0.11) * 0.2, 0.01);
    }
    az = THREE.MathUtils.lerp(az, azObj, 0.08);
    colocarCamara();
  }
  function dibujar() { renderer.render(escena, camara); }
  function ciclo() {
    if (!visible) return;
    const dt = Math.min(reloj.getDelta(), 0.05);
    actualizar(reloj.elapsedTime, dt);
    dibujar();
    requestAnimationFrame(ciclo);
  }
  if (reducido) {
    actualizar(10, 0); dibujar();
    new ResizeObserver(() => dibujar()).observe(cont);
    lienzo.addEventListener('pointermove', () => dibujar());
  } else {
    new IntersectionObserver((ents) => {
      const ahora = ents[0].isIntersecting && !document.hidden;
      if (ahora && !visible) { visible = true; reloj.getDelta(); requestAnimationFrame(ciclo); }
      visible = ahora;
    }).observe(cont);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !visible) { visible = true; reloj.getDelta(); requestAnimationFrame(ciclo); }
      else if (document.hidden) visible = false;
    });
    requestAnimationFrame(ciclo);
  }
  window.SNL_ESCENA = { escena, camara, renderer, dibujar, actualizar };
}
