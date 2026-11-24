/* SNL's Bakery: catálogo, caja surtida, calendario y pedido por WhatsApp. Lee todo de catalogo.js */
(function () {
  const datos = window.SNL || { negocio: {}, productos: [] };
  const neg = datos.negocio || {};
  const productos = datos.productos || [];
  const porId = Object.fromEntries(productos.map((p) => [p.id, p]));
  const cal = neg.calendario || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const dinero = (n) => '$' + Math.round(n).toLocaleString('es-MX');
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const waLink = (texto) => 'https://wa.me/' + (neg.whatsapp || '') + '?text=' + encodeURIComponent(texto);
  const nodo = (tag, attrs, ...hijos) => {
    const e = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v == null || v === false) return;
      if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? '' : v);
    });
    hijos.flat().forEach((h) => { if (h != null && h !== false) e.append(h); });
    return e;
  };

  // ---------- fechas (todo en hora de la CDMX)
  const hoy = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const aFecha = (s) => new Date(s + 'T12:00:00Z');
  const iso = (d) => d.toISOString().slice(0, 10);
  const sumarDias = (s, n) => { const d = aFecha(s); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
  const fechaTxt = (s, op) => (s ? aFecha(s).toLocaleDateString('es-MX', { timeZone: 'UTC', ...op }) : '');
  const largo = (s) => fechaTxt(s, { weekday: 'long', day: 'numeric', month: 'long' });
  const corto = (s) => fechaTxt(s, { day: 'numeric', month: 'long' });
  const minDias = cal.minDias != null ? +cal.minDias : 3;
  const listaDias = (fs) => {
    const xs = [...(fs || [])].sort();
    if (!xs.length) return '';
    const porMes = {};
    xs.forEach((s) => { const k = fechaTxt(s, { month: 'long' }); (porMes[k] = porMes[k] || []).push(+s.slice(8)); });
    const y = (a) => (a.length > 1 ? a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1] : String(a[0]));
    return y(Object.entries(porMes).map(([m, ds]) => y(ds) + ' de ' + m));
  };
  const sinPedidosHoy = (h) => (cal.sinPedidos || []).includes(h);
  function estadoDia(d, h) {
    if (d <= h) return { tipo: 'pasado' };
    if (cal.hasta && d > cal.hasta) return { tipo: 'pasado' };
    if ((cal.sinEntrega || []).includes(d)) return { tipo: 'sin', nota: 'sin entregas' };
    if ((cal.llenos || []).includes(d)) return { tipo: 'lleno', nota: 'agotado' };
    if (sinPedidosHoy(h)) return { tipo: 'pronto' };
    const ex = (cal.excepciones || []).find((x) => x.entrega === d);
    const dias = Math.round((aFecha(d) - aFecha(h)) / 864e5);
    return dias >= minDias || (ex && h <= ex.ultimoPedido) ? { tipo: 'libre' } : { tipo: 'pronto' };
  }
  function primeraLibre(h) {
    for (let i = 1, d = sumarDias(h, 1); i < 120 && (!cal.hasta || d <= cal.hasta); i++, d = sumarDias(d, 1)) if (estadoDia(d, h).tipo === 'libre') return d;
    return '';
  }
  const SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  function mesHTML(mes, h, elegido, seleccionable) {
    const primero = aFecha(mes + '-01');
    const hueco = (primero.getUTCDay() + 6) % 7;
    const dias = new Date(Date.UTC(primero.getUTCFullYear(), primero.getUTCMonth() + 1, 0)).getUTCDate();
    const t0 = fechaTxt(mes + '-01', { month: 'long', year: 'numeric' }), titulo = t0.charAt(0).toUpperCase() + t0.slice(1);
    const celdas = [];
    for (let i = 0; i < hueco; i++) celdas.push(nodo('span', { class: 'dia vacio', 'aria-hidden': 'true' }));
    for (let n = 1; n <= dias; n++) {
      const d = mes + '-' + String(n).padStart(2, '0');
      const e = estadoDia(d, h);
      const etiqueta = largo(d) + (e.tipo === 'libre' ? ', disponible' : e.nota ? ', ' + e.nota : ', no disponible');
      const clase = 'dia ' + e.tipo + (d === elegido ? ' elegido' : '') + (d === h ? ' hoy' : '');
      const hijos = [nodo('span', { class: 'num', text: String(n) }), e.nota ? nodo('small', { text: e.nota }) : null];
      celdas.push(seleccionable && e.tipo === 'libre'
        ? nodo('button', { type: 'button', class: clase, 'data-dia': d, 'aria-label': etiqueta, 'aria-pressed': d === elegido ? 'true' : 'false' }, hijos)
        : nodo('span', { class: clase, 'aria-label': etiqueta, role: 'img' }, hijos));
    }
    return nodo('div', { class: 'mes' }, nodo('p', { class: 'mes-t', text: titulo }), nodo('div', { class: 'semana', 'aria-hidden': 'true' }, SEMANA.map((x) => nodo('span', { text: x }))), nodo('div', { class: 'dias' }, celdas));
  }
  function mesesVisibles(h) {
    const fin = cal.hasta || sumarDias(h, 60);
    const meses = [];
    for (let m = h.slice(0, 7); m <= fin.slice(0, 7) && meses.length < 4;) {
      meses.push(m);
      const d = aFecha(m + '-01'); d.setUTCMonth(d.getUTCMonth() + 1); m = iso(d).slice(0, 7);
    }
    return meses;
  }
  const leyenda = () => nodo('p', { class: 'leyenda' }, nodo('span', { class: 'l libre' }, 'Disponible'), nodo('span', { class: 'l lleno' }, 'Agotado'), nodo('span', { class: 'l sin' }, 'Sin entregas'), nodo('span', { class: 'l pronto' }, 'Muy pronto para hornear'));

  // ---------- textos del negocio
  $$('[data-n]').forEach((e) => { const v = neg[e.dataset.n]; if (v) e.textContent = v; });
  $$('[data-wa]').forEach((a) => { a.href = waLink('Hola, ' + (neg.nombre || '') + '. Quiero hacer un pedido.'); });
  const ig = $('#link-ig');
  if (ig && neg.instagram) { ig.href = 'https://www.instagram.com/' + neg.instagram + '/'; ig.textContent = 'Instagram @' + neg.instagram; }
  if ($('#wa-visible') && neg.whatsappVisible) $('#wa-visible').textContent = neg.whatsappVisible;
  const t = neg.temporada || {};
  const anticipo = neg.anticipoMin != null ? +neg.anticipoMin : 70;
  const h0 = hoy();
  const corta = $('#temporada-corta');
  if (corta) {
    let txt = 'Horneamos todo por pedido, con ' + minDias + ' días de anticipación.';
    if (t.ultimoPedido && h0 <= t.ultimoPedido) txt += ' Para recibir antes de Navidad, pide a más tardar el ' + corto(t.ultimoPedido) + '.';
    corta.textContent = txt;
  }
  if (neg.anticipo && $('#paso-anticipo')) $('#paso-anticipo').textContent = neg.anticipo;
  if ($('#nota-corte')) $('#nota-corte').textContent = 'Horneamos todo por pedido: elige tu fecha con al menos ' + minDias + ' días de anticipación.';
  if ($('#nota-anticipo')) $('#nota-anticipo').textContent = 'Para apartar: mínimo ' + anticipo + '% por adelantado o, si prefieres, todo. Por ahora no aceptamos tarjeta.';
  const llenarLista = (sel, items) => { const ul = $(sel); if (ul) ul.replaceChildren(...(items || []).map((x) => nodo('li', { text: x }))); };
  llenarLista('#lista-entregas', neg.entregas);
  llenarLista('#lista-pagos', neg.pagos);
  const fechas = $('#fechas');
  if (fechas) {
    const filas = [[minDias + ' días', 'Horneamos todo por pedido: elige tu fecha con al menos ' + minDias + ' días de anticipación.']];
    (cal.excepciones || []).forEach((x) => filas.push([corto(x.ultimoPedido), 'Último día para pedir y recibir el ' + corto(x.entrega) + '.']));
    if ((cal.sinEntrega || []).length) filas.push([listaDias(cal.sinEntrega), 'No hay entregas esos días.']);
    if ((cal.llenos || []).length) filas.push([listaDias(cal.llenos), 'Agenda llena: ya no hay lugar.']);
    if (cal.hasta) filas.push(['Hasta el ' + corto(cal.hasta), 'Seguimos horneando después de Navidad.']);
    fechas.replaceChildren(...filas.map(([b, s]) => nodo('div', { class: 'fecha' }, nodo('b', { text: b }), nodo('span', { text: s }))));
  }
  const calInfo = $('#calendario-info');
  if (calInfo) calInfo.replaceChildren(nodo('div', { class: 'meses' }, mesesVisibles(h0).map((m) => mesHTML(m, h0, '', false))), leyenda());

  // ---------- etiqueta provisional para productos sin foto
  const iconos = {
    hombre: '<g fill="#fbf3e2"><circle cx="50" cy="31" r="11"/><rect x="24" y="43" width="52" height="11" rx="5.5"/><rect x="37" y="40" width="26" height="30" rx="11"/><rect x="34" y="62" width="11" height="22" rx="5.5" transform="rotate(14 39 64)"/><rect x="55" y="62" width="11" height="22" rx="5.5" transform="rotate(-14 61 64)"/></g><g fill="VAR"><circle cx="50" cy="51" r="2.4"/><circle cx="50" cy="60" r="2.4"/><circle cx="46" cy="29" r="1.7"/><circle cx="54" cy="29" r="1.7"/></g>',
    kit: '<g fill="none" stroke="#fbf3e2" stroke-width="3.2" stroke-linejoin="round"><circle cx="44" cy="31" r="10"/><rect x="20" y="43" width="48" height="10" rx="5"/><rect x="32" y="40" width="24" height="28" rx="10"/><path d="M36 66l-6 16M52 66l6 16"/></g><g transform="rotate(30 76 60)"><rect x="70" y="40" width="12" height="34" rx="4" fill="#fbf3e2"/><path d="M73 74h6l-3 9z" fill="#fbf3e2"/></g>',
    redonda: '<circle cx="50" cy="52" r="27" fill="#fbf3e2"/><path d="M50 52c0-4 6-4 6 0 0 7-12 7-12 0 0-10 18-10 18 0 0 13-24 13-24 0" fill="none" stroke="VAR" stroke-width="3" stroke-linecap="round"/>',
    linzer: '<circle cx="50" cy="52" r="27" fill="#fbf3e2"/><path d="M50 66s-14-8-14-17c0-5 4-8 8-8 3 0 5 2 6 4 1-2 3-4 6-4 4 0 8 3 8 8 0 9-14 17-14 17z" fill="VAR"/>',
    chispas: '<circle cx="50" cy="52" r="27" fill="#fbf3e2"/><g fill="VAR"><circle cx="40" cy="42" r="3.4"/><circle cx="58" cy="40" r="3"/><circle cx="50" cy="54" r="3.6"/><circle cx="38" cy="60" r="3"/><circle cx="62" cy="58" r="3.4"/><circle cx="52" cy="68" r="2.8"/></g>',
    caja: '<rect x="25" y="44" width="50" height="36" rx="3" fill="#fbf3e2"/><rect x="21" y="34" width="58" height="12" rx="3" fill="#fbf3e2"/><rect x="46" y="34" width="8" height="46" fill="VAR"/><path d="M50 34c-8-12-20-6-12 0zM50 34c8-12 20-6 12 0z" fill="VAR"/>',
    thumb: '<circle cx="50" cy="52" r="27" fill="#fbf3e2"/><circle cx="50" cy="52" r="12" fill="VAR"/><circle cx="46" cy="48" r="3.4" fill="#ffffff" opacity=".4"/><g fill="#e9d9b8"><circle cx="34" cy="40" r="1.6"/><circle cx="66" cy="44" r="1.6"/><circle cx="62" cy="68" r="1.6"/><circle cx="35" cy="64" r="1.6"/></g>',
    oso: '<g fill="#fbf3e2"><circle cx="33" cy="36" r="9"/><circle cx="67" cy="36" r="9"/><circle cx="50" cy="55" r="23"/></g><g fill="VAR"><circle cx="33" cy="36" r="4.4"/><circle cx="67" cy="36" r="4.4"/><circle cx="42" cy="51" r="2.6"/><circle cx="58" cy="51" r="2.6"/><ellipse cx="50" cy="61" rx="4" ry="3"/></g><ellipse cx="50" cy="64" rx="9.5" ry="7.5" fill="VAR" opacity=".22"/>'
  };
  const luz = (hex) => { const n = parseInt((hex || '#000').slice(1), 16); return (((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) / 255; };
  const etiqueta = (p) => {
    const c = p.color || '#b3261e', clara = luz(c) > 0.78;
    const ic = (iconos[p.icono] || iconos.redonda).replace(/VAR/g, clara ? '#a8742f' : c);
    return '<svg viewBox="0 0 100 125" role="img" aria-label="' + p.nombre.replace(/"/g, '') + '"><rect width="100" height="125" fill="#efe2c6"/><rect x="5" y="5" width="90" height="115" rx="4" fill="none" stroke="#b8893b" stroke-width="1"/>' +
      '<circle cx="50" cy="52" r="38" fill="' + c + '"' + (clara ? ' stroke="#b8893b" stroke-width="1.6"' : '') + '/><circle cx="38" cy="38" r="9" fill="#ffffff" opacity=".18"/>' + ic.replace(/#fbf3e2/g, clara ? '#fffaf0' : '#fbf3e2') +
      '<text x="50" y="104" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-size="9.5" font-weight="700" fill="#1d3a2a">' + (p.corto || p.nombre).replace(/</g, '') + '</text>' +
      '<text class="prox" x="50" y="115" text-anchor="middle" font-family="Lora, Georgia, serif" font-size="5.6" fill="#5c4737">foto próximamente</text></svg>';
  };

  // ---------- precios y textos de una línea del pedido
  const valor = (p, o, sel) => { const v = (sel && sel[o.id]) || o.defecto; return o.valores.find((x) => x.id === v) || o.valores[0]; };
  const enSurtida = productos.filter((p) => p.pieza > 0);
  function precioLinea(l) {
    const p = porId[l.id]; if (!p) return 0;
    if (p.arma) return Object.entries(l.piezas || {}).reduce((s, [id, q]) => s + q * ((porId[id] || {}).pieza || 0), 0);
    return (+p.precio || 0) + (p.opciones || []).reduce((s, o) => s + (+valor(p, o, l.opciones).extra || 0), 0) + (l.caja && p.caja != null ? +p.caja : 0);
  }
  function detalleLinea(l) {
    const p = porId[l.id]; if (!p) return '';
    if (p.arma) return Object.entries(l.piezas || {}).filter(([, q]) => q > 0).map(([id, q]) => q + ' ' + ((porId[id] || {}).corto || (porId[id] || {}).nombre || id)).join(', ');
    const d = (p.opciones || []).map((o) => o.nombre.toLowerCase() + ' ' + valor(p, o, l.opciones).nombre.toLowerCase());
    if (p.caja != null) d.push(l.caja ? 'en caja de regalo' : 'en bolsa');
    return d.join(', ');
  }
  const piezasTotal = (pz) => Object.values(pz || {}).reduce((s, q) => s + (+q || 0), 0);
  const claveDe = (l) => l.id + '|' + JSON.stringify(l.opciones || {}) + '|' + (l.caja ? 1 : 0) + '|' + JSON.stringify(Object.entries(l.piezas || {}).filter(([, q]) => q > 0).sort());

  // ---------- carrito
  let carrito = [];
  try { carrito = JSON.parse(localStorage.getItem('snl-pedido') || '[]') || []; } catch (e) { carrito = []; }
  carrito = (Array.isArray(carrito) ? carrito : []).filter((l) => {
    const p = porId[l && l.id]; if (!p || !(l.n > 0)) return false;
    if (p.arma) { const n = piezasTotal(l.piezas); return Object.keys(l.piezas || {}).every((id) => porId[id] && porId[id].pieza > 0) && n >= p.arma.min && n <= p.arma.max; }
    return (p.opciones || []).every((o) => !l.opciones || !l.opciones[o.id] || o.valores.some((v) => v.id === l.opciones[o.id]));
  });
  const guardar = () => { try { localStorage.setItem('snl-pedido', JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento */ } };
  function agregar(l) {
    l.clave = claveDe(l);
    const ya = carrito.find((x) => x.clave === l.clave);
    if (ya) ya.n += l.n; else carrito.push(l);
    actualizar();
  }

  // ---------- tarjetas del catálogo
  function grupoChips(nombre, legend, opciones, elegido, alCambiar) {
    const fs = nodo('fieldset', { class: 'opc' }, nodo('legend', { text: legend }));
    const caja = nodo('div', { class: 'chips' });
    opciones.forEach(([id, txt, extra]) => {
      const inp = nodo('input', { type: 'radio', name: nombre, value: id, checked: id === elegido, onchange: () => alCambiar(id) });
      caja.append(nodo('label', { class: 'chip' }, inp, nodo('span', {}, txt, extra ? nodo('small', { text: ' +' + dinero(extra) }) : null)));
    });
    fs.append(caja);
    return fs;
  }
  function tarjeta(p) {
    const art = nodo('article', { class: 'tarjeta' + (p.lab ? ' de-lab' : '') + (p.arma ? ' ancha' : ''), id: 'p-' + p.id });
    art.style.setProperty('--c', p.color || '#b3261e');
    const foto = nodo('div', { class: 'foto' });
    if (p.imagen) {
      const img = nodo('img', { src: p.imagen, alt: p.nombre, loading: 'lazy' });
      img.onerror = () => { foto.innerHTML = etiqueta(p); };
      foto.append(img);
    } else foto.innerHTML = etiqueta(p);
    if (p.etiqueta) foto.append(nodo('span', { class: 'badge' + (p.lab ? ' lab' : ''), text: p.etiqueta }));
    const cuerpo = nodo('div', { class: 'cuerpo' });
    const precio = nodo('b');
    const meta = nodo('p', { class: 'meta' }, nodo('span', { class: 'esfera', 'aria-hidden': 'true' }), nodo('span', { class: 'pz' }), precio);
    const desc = nodo('p', { class: 'desc', text: p.descripcion || '' });
    desc.addEventListener('click', () => desc.classList.toggle('abierta'));
    cuerpo.append(nodo('h3', { text: p.nombre }), meta, desc);
    [p.cuidados, p.alergenos].filter(Boolean).forEach((txt) => cuerpo.append(nodo('p', { class: 'nota', text: txt })));
    const sel = { id: p.id, n: 1, opciones: {}, caja: false, piezas: p.arma ? { ...(p.arma.inicial || {}) } : null };
    (p.opciones || []).forEach((o) => { sel.opciones[o.id] = o.defecto || o.valores[0].id; });
    const aviso = nodo('p', { class: 'agregado', 'aria-live': 'polite' });
    const boton = nodo('button', { type: 'button', class: 'btn btn-vino agregar' });
    const pintar = () => {
      const pr = precioLinea(sel);
      if (p.arma) {
        const n = piezasTotal(sel.piezas), ok = n >= p.arma.min && n <= p.arma.max;
        meta.querySelector('.pz').textContent = n + ' piezas ·';
        precio.textContent = dinero(pr);
        boton.disabled = !ok;
        boton.textContent = ok ? 'Agregar caja · ' + dinero(pr) : n < p.arma.min ? 'Faltan ' + (p.arma.min - n) + ' galletas' : 'Máximo ' + p.arma.max + ' galletas';
        $$('[data-cuenta]', art).forEach((e) => { e.textContent = 'Llevas ' + n + ' de ' + p.arma.min + ' a ' + p.arma.max + ' galletas'; });
      } else {
        meta.querySelector('.pz').textContent = p.piezas + ' piezas ·';
        precio.textContent = dinero(pr);
        boton.textContent = 'Agregar · ' + dinero(pr * sel.n);
        $$('output.n', art).forEach((o) => { o.textContent = sel.n; });
      }
    };
    if (p.arma) {
      const lista = nodo('div', { class: 'arma' }, nodo('p', { class: 'arma-t', text: 'Elige tus galletas (precio por pieza, caja de regalo incluida):' }));
      enSurtida.forEach((x) => {
        const out = nodo('output', { 'aria-live': 'polite', text: String(sel.piezas[x.id] || 0) });
        const paso = (d) => { const nuevo = Math.max(0, (sel.piezas[x.id] || 0) + d); if (d > 0 && piezasTotal(sel.piezas) >= p.arma.max) return; if (nuevo) sel.piezas[x.id] = nuevo; else delete sel.piezas[x.id]; out.textContent = String(nuevo); pintar(); };
        lista.append(nodo('div', { class: 'arma-fila' }, nodo('span', { class: 'esfera', 'aria-hidden': 'true', style: '--c:' + (x.color || '#b3261e') }), nodo('span', { class: 'arma-n' }, x.corto || x.nombre, nodo('small', { text: dinero(x.pieza) + ' c/u' })),
          nodo('div', { class: 'contador chico' }, nodo('button', { type: 'button', 'aria-label': 'Una ' + (x.corto || x.nombre) + ' menos', text: '−', onclick: () => paso(-1) }), out, nodo('button', { type: 'button', 'aria-label': 'Una ' + (x.corto || x.nombre) + ' más', text: '+', onclick: () => paso(1) }))));
      });
      lista.append(nodo('p', { class: 'nota', 'data-cuenta': '' }));
      cuerpo.append(lista);
      boton.onclick = () => { agregar({ id: p.id, n: 1, piezas: { ...sel.piezas } }); aviso.textContent = 'Caja agregada a tu pedido.'; setTimeout(() => { aviso.textContent = ''; }, 2600); };
      cuerpo.append(nodo('div', { class: 'acciones' }, boton), aviso);
    } else {
      (p.opciones || []).forEach((o) => cuerpo.append(grupoChips(p.id + '-' + o.id, o.nombre, o.valores.map((v) => [v.id, v.nombre, +v.extra || 0]), sel.opciones[o.id], (v) => { sel.opciones[o.id] = v; pintar(); })));
      if (p.caja != null) cuerpo.append(grupoChips(p.id + '-pres', 'Presentación', [['bolsa', 'Bolsa', 0], ['caja', 'Caja de regalo', +p.caja]], 'bolsa', (v) => { sel.caja = v === 'caja'; pintar(); }));
      const menos = nodo('button', { type: 'button', text: '−', 'aria-label': 'Una menos de ' + p.nombre, onclick: () => { sel.n = Math.max(1, sel.n - 1); pintar(); } });
      const mas = nodo('button', { type: 'button', text: '+', 'aria-label': 'Una más de ' + p.nombre, onclick: () => { sel.n += 1; pintar(); } });
      boton.onclick = () => { agregar({ id: p.id, n: sel.n, opciones: p.opciones ? { ...sel.opciones } : undefined, caja: p.caja != null ? sel.caja : undefined }); aviso.textContent = 'Agregado a tu pedido.'; sel.n = 1; pintar(); setTimeout(() => { aviso.textContent = ''; }, 2600); };
      cuerpo.append(nodo('div', { class: 'acciones' }, nodo('div', { class: 'contador' }, menos, nodo('output', { class: 'n', 'aria-live': 'polite', text: '1' }), mas), boton), aviso);
    }
    art.append(foto, cuerpo);
    pintar();
    return art;
  }
  const lista = $('#lista'), listaLab = $('#lista-lab');
  if (lista) lista.replaceChildren(...productos.filter((p) => !p.lab).map(tarjeta));
  if (listaLab) {
    const lab = productos.filter((p) => p.lab);
    listaLab.replaceChildren(...lab.map(tarjeta));
    if (!lab.length && $('#santa-lab')) $('#santa-lab').hidden = true;
  }

  // ---------- pedido
  const barra = $('#carrito'), modal = $('#modal');
  let fechaElegida = '', mesModal = '';
  const totalPedido = () => carrito.reduce((s, l) => s + l.n * precioLinea(l), 0);
  function actualizar() {
    guardar();
    const n = carrito.reduce((s, l) => s + l.n, 0);
    if (barra) {
      barra.hidden = n === 0;
      $('#carrito-cajas').textContent = n + (n === 1 ? ' producto' : ' productos');
      $('#carrito-total').textContent = dinero(totalPedido());
    }
    if (modal && !modal.hidden) pintarModal();
  }
  const pagoAhora = () => (($('input[name="cuanto"]:checked') || {}).value === 'todo' ? 'todo' : 'anticipo');
  function mensaje() {
    const total = totalPedido(), pago = ($('input[name="pago"]:checked') || {}).value || '';
    const ant = Math.ceil(total * anticipo / 100);
    const lineas = ['Hola, ' + (neg.nombre || '') + '. Quiero hacer un pedido:'];
    carrito.forEach((l) => { const p = porId[l.id], d = detalleLinea(l); lineas.push('• ' + l.n + ' × ' + p.nombre + (d ? ' (' + d + ')' : '') + ' (' + dinero(l.n * precioLinea(l)) + ')'); });
    lineas.push('Total: ' + dinero(total));
    if ($('#f-nombre').value.trim()) lineas.push('Nombre: ' + $('#f-nombre').value.trim());
    if (fechaElegida) lineas.push('Para el: ' + largo(fechaElegida));
    lineas.push('Entrega: ' + $('#f-entrega').value + ($('#f-lugar').value.trim() ? ', ' + $('#f-lugar').value.trim() : ''));
    lineas.push('Pago: ' + (pago ? pago + ' · ' : '') + (pagoAhora() === 'todo' ? 'pago todo por adelantado (' + dinero(total) + ')' : 'aparto con el ' + anticipo + '% (' + dinero(ant) + ') y el resto al entregar'));
    if ($('#f-notas').value.trim()) lineas.push('Notas: ' + $('#f-notas').value.trim());
    return lineas.join('\n');
  }
  function pintarCalendario() {
    const caja = $('#f-calendario'); if (!caja) return;
    const h = hoy(), meses = mesesVisibles(h);
    if (!mesModal || !meses.includes(mesModal)) mesModal = (fechaElegida || primeraLibre(h) || h).slice(0, 7);
    if (!meses.includes(mesModal)) mesModal = meses[0];
    const i = meses.indexOf(mesModal);
    const nav = nodo('div', { class: 'cal-nav' },
      nodo('button', { type: 'button', class: 'cal-flecha', 'aria-label': 'Mes anterior', disabled: i <= 0, text: '‹', onclick: () => { mesModal = meses[i - 1]; pintarCalendario(); } }),
      nodo('button', { type: 'button', class: 'cal-flecha', 'aria-label': 'Mes siguiente', disabled: i >= meses.length - 1, text: '›', onclick: () => { mesModal = meses[i + 1]; pintarCalendario(); } }));
    const mes = mesHTML(mesModal, h, fechaElegida, true);
    mes.querySelector('.mes-t').after(nav);
    caja.replaceChildren(mes);
    $$('button[data-dia]', caja).forEach((b) => b.addEventListener('click', () => { fechaElegida = b.dataset.dia; pintarCalendario(); pintarModal(); }));
    const nota = $('#f-fecha-nota');
    if (sinPedidosHoy(h)) nota.textContent = 'Hoy no tomamos pedidos. Escríbenos desde mañana.';
    else if (fechaElegida) nota.textContent = 'Elegiste el ' + largo(fechaElegida) + '.';
    else { const p1 = primeraLibre(h); nota.textContent = p1 ? 'La primera fecha disponible es el ' + largo(p1) + '.' : 'Ya no quedan fechas en esta temporada.'; }
  }
  function pintarModal() {
    const total = totalPedido(), ant = Math.ceil(total * anticipo / 100);
    $('#resumen').replaceChildren(...carrito.map((l, i) => {
      const p = porId[l.id], d = detalleLinea(l);
      return nodo('li', {}, nodo('div', { class: 'r-txt' }, nodo('b', { text: p.nombre }), d ? nodo('small', { text: d }) : null),
        nodo('div', { class: 'r-der' }, nodo('div', { class: 'contador chico' }, nodo('button', { type: 'button', text: '−', 'aria-label': 'Una menos de ' + p.nombre, onclick: () => { l.n -= 1; if (l.n < 1) carrito.splice(i, 1); actualizar(); if (!carrito.length) cerrar(); } }), nodo('output', { text: String(l.n) }), nodo('button', { type: 'button', text: '+', 'aria-label': 'Una más de ' + p.nombre, onclick: () => { l.n += 1; actualizar(); } })),
          nodo('span', { class: 'r-precio', text: dinero(l.n * precioLinea(l)) })));
    }));
    $('#resumen-total').textContent = dinero(total);
    $('#txt-anticipo').textContent = 'Aparto con el ' + anticipo + '%: ' + dinero(ant) + ' (el resto, ' + dinero(total - ant) + ', al entregar)';
    $('#txt-todo').textContent = 'Pago todo ahora: ' + dinero(total);
    const enviar = $('#enviar-wa'), falta = !fechaElegida;
    enviar.href = falta ? '#f-calendario' : waLink(mensaje());
    enviar.setAttribute('aria-disabled', falta ? 'true' : 'false');
    enviar.classList.toggle('apagado', falta);
    enviar.removeAttribute('target');
    if (!falta) enviar.setAttribute('target', '_blank');
    $('#aviso-wa').textContent = falta ? 'Elige el día de entrega en el calendario para mandar tu pedido.' : 'Se abre WhatsApp con tu pedido ya escrito. Solo tienes que enviarlo.';
  }
  const abrir = () => { pintarCalendario(); pintarModal(); modal.hidden = false; document.body.classList.add('con-modal'); setTimeout(() => $('#f-nombre').focus(), 30); };
  function cerrar() { modal.hidden = true; document.body.classList.remove('con-modal'); const b = $('#carrito-abrir'); if (b && !barra.hidden) b.focus(); }
  if (modal) {
    $('#carrito-abrir').onclick = abrir;
    $('#modal-cerrar').onclick = cerrar;
    modal.addEventListener('click', (e) => { if (e.target === modal) cerrar(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) cerrar(); });
    $('#form-pedido').addEventListener('input', pintarModal);
    $('#form-pedido').addEventListener('change', pintarModal);
    $('#form-pedido').addEventListener('submit', (e) => e.preventDefault());
    $('#enviar-wa').addEventListener('click', (e) => {
      if (!fechaElegida) { e.preventDefault(); const c = $('#f-calendario button[data-dia]'); if (c) c.focus(); $('#f-fecha-nota').classList.add('marca'); setTimeout(() => $('#f-fecha-nota').classList.remove('marca'), 1400); }
    });
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
