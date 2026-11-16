/* SNL's Bakery: catálogo, pedido y textos de la página. Lee todo de catalogo.js */
(function () {
  const datos = window.SNL || { negocio: {}, productos: [] };
  const neg = datos.negocio || {};
  const productos = datos.productos || [];
  const $ = (s) => document.querySelector(s);
  const dinero = (n) => '$' + Math.round(n).toLocaleString('es-MX');
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fechaLarga = (iso) => {
    if (!iso) return '';
    const d = new Date(iso + 'T12:00:00Z');
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  };
  const waLink = (texto) => 'https://wa.me/' + (neg.whatsapp || '') + '?text=' + encodeURIComponent(texto);

  // Textos del negocio
  document.querySelectorAll('[data-n]').forEach((el) => {
    const v = neg[el.dataset.n];
    if (v) el.textContent = v;
  });
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = waLink('Hola, ' + (neg.nombre || '') + '. Quiero hacer un pedido.');
  });
  const ig = $('#link-ig');
  if (ig && neg.instagram) { ig.href = 'https://www.instagram.com/' + neg.instagram + '/'; ig.textContent = 'Instagram @' + neg.instagram; }
  const waVis = $('#wa-visible');
  if (waVis && neg.whatsappVisible) waVis.textContent = neg.whatsappVisible;
  const t = neg.temporada || {};
  const corta = $('#temporada-corta');
  if (corta && t.abre && t.ultimoPedido) corta.textContent = 'Preventa abierta del ' + fechaLarga(t.abre) + ' al ' + fechaLarga(t.ultimoPedido) + '.';
  if (neg.anticipo && $('#paso-anticipo')) $('#paso-anticipo').textContent = neg.anticipo;
  if (t.corteSemanal && $('#nota-corte')) $('#nota-corte').textContent = 'Pedidos hasta el ' + t.corteSemanal + ' para entregar el ' + (t.diaEntrega || 'sábado') + '.';
  const llenarLista = (sel, items) => {
    const ul = $(sel);
    if (!ul) return;
    ul.replaceChildren(...(items || []).map((x) => { const li = document.createElement('li'); li.textContent = x; return li; }));
  };
  llenarLista('#lista-entregas', neg.entregas);
  llenarLista('#lista-pagos', neg.pagos);
  const fechas = $('#fechas');
  if (fechas) {
    const filas = [
      [t.abre, 'Abre la preventa'],
      [t.ultimoPedido, 'Último día para pedir'],
      [t.ultimasEntregas, 'Últimas entregas antes de Navidad']
    ].filter((f) => f[0]);
    fechas.replaceChildren(...filas.map(([iso, txt]) => {
      const d = document.createElement('div'); d.className = 'fecha';
      const b = document.createElement('b'); b.textContent = fechaLarga(iso);
      const s = document.createElement('span'); s.textContent = txt;
      d.append(b, s); return d;
    }));
  }

  // Etiqueta provisional para productos sin foto
  const iconos = {
    hombre: '<g fill="#fbf3e2"><circle cx="50" cy="31" r="11"/><rect x="24" y="43" width="52" height="11" rx="5.5"/><rect x="37" y="40" width="26" height="30" rx="11"/><rect x="34" y="62" width="11" height="22" rx="5.5" transform="rotate(14 39 64)"/><rect x="55" y="62" width="11" height="22" rx="5.5" transform="rotate(-14 61 64)"/></g><g fill="VAR"><circle cx="50" cy="51" r="2.4"/><circle cx="50" cy="60" r="2.4"/><circle cx="46" cy="29" r="1.7"/><circle cx="54" cy="29" r="1.7"/></g>',
    kit: '<g fill="none" stroke="#fbf3e2" stroke-width="3.2" stroke-linejoin="round"><circle cx="44" cy="31" r="10"/><rect x="20" y="43" width="48" height="10" rx="5"/><rect x="32" y="40" width="24" height="28" rx="10"/><path d="M36 66l-6 16M52 66l6 16"/></g><g transform="rotate(30 76 60)"><rect x="70" y="40" width="12" height="34" rx="4" fill="#fbf3e2"/><path d="M73 74h6l-3 9z" fill="#fbf3e2"/></g>',
    redonda: '<circle cx="50" cy="52" r="27" fill="#fbf3e2"/><path d="M50 52c0-4 6-4 6 0 0 7-12 7-12 0 0-10 18-10 18 0 0 13-24 13-24 0" fill="none" stroke="VAR" stroke-width="3" stroke-linecap="round"/>',
    linzer: '<circle cx="50" cy="52" r="27" fill="#fbf3e2"/><path d="M50 66s-14-8-14-17c0-5 4-8 8-8 3 0 5 2 6 4 1-2 3-4 6-4 4 0 8 3 8 8 0 9-14 17-14 17z" fill="VAR"/>',
    chispas: '<circle cx="50" cy="52" r="27" fill="#fbf3e2"/><g fill="VAR"><circle cx="40" cy="42" r="3.4"/><circle cx="58" cy="40" r="3"/><circle cx="50" cy="54" r="3.6"/><circle cx="38" cy="60" r="3"/><circle cx="62" cy="58" r="3.4"/><circle cx="52" cy="68" r="2.8"/></g>',
    caja: '<rect x="25" y="44" width="50" height="36" rx="3" fill="#fbf3e2"/><rect x="21" y="34" width="58" height="12" rx="3" fill="#fbf3e2"/><rect x="46" y="34" width="8" height="46" fill="VAR"/><path d="M50 34c-8-12-20-6-12 0zM50 34c8-12 20-6 12 0z" fill="VAR"/>'
  };
  const luz = (hex) => {
    const n = parseInt((hex || '#000').slice(1), 16);
    return (((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) / 255;
  };
  const etiqueta = (p) => {
    const c = p.color || '#b3261e';
    const clara = luz(c) > 0.78;
    const ic = (iconos[p.icono] || iconos.redonda).replace(/VAR/g, clara ? '#a8742f' : c);
    return '<svg viewBox="0 0 100 125" role="img" aria-label="' + p.nombre.replace(/"/g, '') + '">' +
      '<rect width="100" height="125" fill="#efe2c6"/>' +
      '<rect x="5" y="5" width="90" height="115" rx="4" fill="none" stroke="#b8893b" stroke-width="1"/>' +
      '<circle cx="50" cy="52" r="38" fill="' + c + '"' + (clara ? ' stroke="#b8893b" stroke-width="1.6"' : '') + '/><circle cx="38" cy="38" r="9" fill="#ffffff" opacity=".18"/>' + ic.replace(/#fbf3e2/g, clara ? '#fffaf0' : '#fbf3e2') +
      '<text x="50" y="104" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-size="9.5" font-weight="700" fill="#1d3a2a">' + (p.corto || p.nombre).replace(/</g, '') + '</text>' +
      '<text class="prox" x="50" y="115" text-anchor="middle" font-family="Lora, Georgia, serif" font-size="5.6" fill="#5c4737">foto próximamente</text></svg>';
  };

  // Carrito
  let carrito = {};
  try { carrito = JSON.parse(localStorage.getItem('snl-carrito') || '{}') || {}; } catch (e) { carrito = {}; }
  const guardar = () => { try { localStorage.setItem('snl-carrito', JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento */ } };
  const porId = Object.fromEntries(productos.map((p) => [p.id, p]));
  Object.keys(carrito).forEach((id) => { if (!porId[id] || !(carrito[id] > 0)) delete carrito[id]; });

  const lista = $('#lista');
  if (lista) {
    lista.replaceChildren(...productos.map((p) => {
      const art = document.createElement('article');
      art.className = 'tarjeta'; art.id = 'p-' + p.id; art.style.setProperty('--c', p.color || '#b3261e');
      const foto = document.createElement('div'); foto.className = 'foto';
      if (p.imagen) {
        const img = document.createElement('img'); img.src = p.imagen; img.alt = p.nombre; img.loading = 'lazy';
        img.onerror = () => { foto.innerHTML = etiqueta(p); };
        foto.appendChild(img);
      } else { foto.innerHTML = etiqueta(p); }
      const insignia = p.porPedido ? 'Por pedido' : p.etiqueta;
      if (insignia) { const b = document.createElement('span'); b.className = 'badge' + (p.porPedido ? ' pedido' : ''); b.textContent = insignia; foto.appendChild(b); }
      const cuerpo = document.createElement('div'); cuerpo.className = 'cuerpo';
      const h = document.createElement('h3'); h.textContent = p.nombre;
      const meta = document.createElement('p'); meta.className = 'meta';
      const esf = document.createElement('span'); esf.className = 'esfera'; esf.setAttribute('aria-hidden', 'true');
      const pz = document.createElement('span'); pz.textContent = p.piezas + ' piezas ·';
      const pr = document.createElement('b'); pr.textContent = dinero(p.precio);
      meta.append(esf, pz, pr);
      const desc = document.createElement('p'); desc.className = 'desc'; desc.textContent = p.descripcion || '';
      desc.addEventListener('click', () => desc.classList.toggle('abierta'));
      cuerpo.append(h, meta, desc);
      [p.cuidados, p.alergenos].filter(Boolean).forEach((txt) => { const n = document.createElement('p'); n.className = 'nota'; n.textContent = txt; cuerpo.appendChild(n); });
      const acc = document.createElement('div'); acc.className = 'acciones';
      const cont = document.createElement('div'); cont.className = 'contador';
      const menos = document.createElement('button'); menos.type = 'button'; menos.textContent = '−'; menos.setAttribute('aria-label', 'Quitar una caja de ' + p.nombre);
      const out = document.createElement('output'); out.setAttribute('aria-live', 'polite');
      const mas = document.createElement('button'); mas.type = 'button'; mas.textContent = '+'; mas.setAttribute('aria-label', 'Agregar una caja de ' + p.nombre);
      const sub = document.createElement('span'); sub.className = 'subtotal';
      const pintar = () => { const q = carrito[p.id] || 0; out.textContent = q; sub.textContent = q ? dinero(q * p.precio) : 'Agrega al pedido'; };
      menos.onclick = () => { carrito[p.id] = Math.max(0, (carrito[p.id] || 0) - 1); if (!carrito[p.id]) delete carrito[p.id]; pintar(); actualizar(); };
      mas.onclick = () => { carrito[p.id] = (carrito[p.id] || 0) + 1; pintar(); actualizar(); };
      cont.append(menos, out, mas); acc.append(cont, sub); cuerpo.appendChild(acc);
      pintar();
      art.append(foto, cuerpo);
      return art;
    }));
  }

  const barra = $('#carrito');
  const modal = $('#modal');
  const resumenTexto = () => {
    const filas = Object.entries(carrito).filter(([id, q]) => porId[id] && q > 0);
    const total = filas.reduce((s, [id, q]) => s + q * porId[id].precio, 0);
    const cajas = filas.reduce((s, [, q]) => s + q, 0);
    return { filas, total, cajas };
  };
  function actualizar() {
    guardar();
    const { total, cajas } = resumenTexto();
    if (!barra) return;
    barra.hidden = cajas === 0;
    $('#carrito-cajas').textContent = cajas + (cajas === 1 ? ' caja' : ' cajas');
    $('#carrito-total').textContent = dinero(total);
  }
  function mensaje() {
    const { filas, total } = resumenTexto();
    const pago = (document.querySelector('input[name="pago"]:checked') || {}).value || '';
    const fecha = $('#f-fecha').value;
    const lineas = ['Hola, ' + (neg.nombre || '') + '. Quiero hacer un pedido:'];
    filas.forEach(([id, q]) => lineas.push('• ' + q + ' × ' + porId[id].nombre + ' (' + dinero(q * porId[id].precio) + ')'));
    lineas.push('Total: ' + dinero(total));
    if ($('#f-nombre').value.trim()) lineas.push('Nombre: ' + $('#f-nombre').value.trim());
    if (fecha) lineas.push('Para el: ' + new Date(fecha + 'T12:00:00Z').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }));
    lineas.push('Entrega: ' + $('#f-entrega').value + ($('#f-lugar').value.trim() ? ', ' + $('#f-lugar').value.trim() : ''));
    if (pago) lineas.push('Pago: ' + pago);
    if ($('#f-notas').value.trim()) lineas.push('Notas: ' + $('#f-notas').value.trim());
    return lineas.join('\n');
  }
  function pintarModal() {
    const { filas, total } = resumenTexto();
    $('#resumen').replaceChildren(...filas.map(([id, q]) => {
      const li = document.createElement('li');
      const a = document.createElement('span'); a.textContent = q + ' × ' + porId[id].nombre;
      const b = document.createElement('span'); b.textContent = dinero(q * porId[id].precio);
      li.append(a, b); return li;
    }));
    $('#resumen-total').textContent = dinero(total);
    $('#enviar-wa').href = waLink(mensaje());
  }
  const abrir = () => { pintarModal(); modal.hidden = false; setTimeout(() => $('#f-nombre').focus(), 30); };
  const cerrar = () => { modal.hidden = true; $('#carrito-abrir').focus(); };
  if (modal) {
    $('#carrito-abrir').onclick = abrir;
    $('#modal-cerrar').onclick = cerrar;
    modal.addEventListener('click', (e) => { if (e.target === modal) cerrar(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) cerrar(); });
    $('#form-pedido').addEventListener('input', pintarModal);
    $('#form-pedido').addEventListener('change', pintarModal);
    $('#form-pedido').addEventListener('submit', (e) => e.preventDefault());
  }
  actualizar();

  // Una esfera del árbol lleva a su galleta
  window.addEventListener('snl:producto', (e) => {
    const card = document.getElementById('p-' + (e.detail && e.detail.id));
    if (!card) return;
    card.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'center' });
    card.classList.add('brilla');
    setTimeout(() => card.classList.remove('brilla'), 1800);
  });
})();
