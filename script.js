const categories = [
  { cat: 'zapatillas', talles: [38, 39, 40, 41, 42, 43, 44] },
  { cat: 'ropa', talles: ['S', 'M', 'L', 'XL'] },
  { cat: 'accesorios', talles: ['Único'] }
];

const imgPool = {
  zapatillas: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80&auto=format&fit=crop'
  ],
  ropa: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506629905607-d9c297d3f46f?w=600&q=80&auto=format&fit=crop'
  ],
  accesorios: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600&q=80&auto=format&fit=crop'
  ]
};

const genders = ['hombre', 'mujer', 'niño'];
const adjectives = ['Pro', 'Ultra', 'Extreme', 'Elite', 'Flex', 'Aero', 'Max'];
const itemNames = {
  zapatillas: ['Zapatilla Runner', 'Calzado Training', 'Tenis Court'],
  ropa: ['Remera Dry-Fit', 'Buzo Oversize', 'Calza Compresión'],
  accesorios: ['Mochila Técnica', 'Gorra Performance', 'Botella Térmica']
};

const PRODUCTS = [];
for (let i = 1; i <= 1000; i++) {
  const gender = genders[i % genders.length];
  const catObj = categories[i % categories.length];
  const nameBase = itemNames[catObj.cat][i % itemNames[catObj.cat].length];
  const price = Math.floor(35 + (i * 19) % 210);
  const isOffer = i % 6 === 0;
  const images = imgPool[catObj.cat];
  PRODUCTS.push({
    id: i,
    nombre: `${nameBase} ${adjectives[i % adjectives.length]} #${i}`,
    genero: gender,
    categoria: catObj.cat,
    precio: price,
    oldPrice: isOffer ? Math.round(price * 1.25) : null,
    talles: catObj.talles,
    img: images[i % images.length],
    desc: `Equipamiento técnico de alto rendimiento perteneciente a la colección oficial KINETIC #${i}. Confeccionado con materiales respirables de máxima durabilidad.`,
    tag: isOffer ? '20% OFF' : (i % 9 === 0 ? 'NUEVO' : null),
    rating: (4.7 + (i % 4) * 0.1).toFixed(1)
  });
}

const WHATSAPP_NUMBER = '5491100000000';
const ITEMS_PER_PAGE = 16;
const storageRead = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
};
const storageWrite = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* El sitio sigue funcionando sin almacenamiento local. */ }
};
const storageGet = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return fallback;
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === 'string' ? parsed : value;
    } catch {
      return value;
    }
  } catch {
    return fallback;
  }
};

const state = {
  filters: { genero: '', categoria: '', precioMax: 250, search: '', sort: 'default' },
  currentPage: 1,
  cart: storageRead('kinetic_cart', []),
  favs: new Set(storageRead('kinetic_favs', [])),
  compare: new Set(),
  recent: storageRead('kinetic_recent', []),
  favOnly: false,
  couponApplied: false,
  currency: storageGet('kinetic_currency', 'USD'),
  rates: { USD: 1, ARS: 1200, EUR: 0.92 },
  symbols: { USD: 'USD ', ARS: 'ARS $', EUR: '€' }
};
if (!['USD', 'ARS', 'EUR'].includes(state.currency)) state.currency = 'USD';
if (!Array.isArray(state.cart)) state.cart = [];
if (!Array.isArray(state.recent)) state.recent = [];

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
const formatPrice = amount => {
  const value = amount * state.rates[state.currency];
  if (state.currency === 'ARS') return `${state.symbols.ARS}${Math.round(value).toLocaleString('es-AR')}`;
  return `${state.symbols[state.currency]}${value.toFixed(state.currency === 'EUR' ? 2 : 0)}`;
};
const findProduct = id => PRODUCTS.find(product => product.id === Number(id));

const showToast = message => {
  const container = $('#toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
};

const updateFavCount = () => {
  const count = $('#fav-count');
  if (count) count.textContent = state.favs.size;
  const badge = $('#wishlist-count');
  if (badge) {
    badge.textContent = state.favs.size;
    badge.hidden = state.favs.size === 0;
  }
};

const toggleFav = id => {
  if (state.favs.has(id)) state.favs.delete(id);
  else state.favs.add(id);
  storageWrite('kinetic_favs', [...state.favs]);
  updateFavCount();
  renderCatalog();
};

const getVisibleProducts = () => {
  const query = state.filters.search.trim().toLowerCase();
  const products = PRODUCTS.filter(product => {
    if (state.filters.genero && product.genero !== state.filters.genero) return false;
    if (state.filters.categoria && product.categoria !== state.filters.categoria) return false;
    if (product.precio > state.filters.precioMax) return false;
    if (state.favOnly && !state.favs.has(product.id)) return false;
    if (query && !`${product.nombre} ${product.categoria} ${product.genero}`.toLowerCase().includes(query)) return false;
    return true;
  });
  if (state.filters.sort === 'price-asc') products.sort((a, b) => a.precio - b.precio);
  if (state.filters.sort === 'price-desc') products.sort((a, b) => b.precio - a.precio);
  return products;
};

const createCard = product => {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-card__media">
      <img src="${product.img}" alt="${product.nombre}" loading="lazy">
      ${product.tag ? `<span class="product-card__tag">${product.tag}</span>` : ''}
      <button class="fav-btn ${state.favs.has(product.id) ? 'is-on' : ''}" data-fav="${product.id}" aria-label="Agregar a favoritos" aria-pressed="${state.favs.has(product.id)}" type="button">♥️</button>
    </div>
    <div class="product-card__body">
      <div class="product-card__top"><span class="product-card__cat">${product.genero} · ${product.categoria}</span><span class="product-card__rating">★ ${product.rating}</span></div>
      <h3 class="product-card__name">${product.nombre}</h3>
      <div class="product-card__price-row"><p class="product-card__price">${formatPrice(product.precio)}</p>${product.oldPrice ? `<span class="product-card__old-price">${formatPrice(product.oldPrice)}</span>` : ''}</div>
      <div class="product-card__actions">
        <button class="btn-card-main" data-quick="${product.id}" type="button">Elegir talle</button>
        <button class="btn-card-cart" data-fast-add="${product.id}" title="Agregar rápido" aria-label="Agregar ${product.nombre} al carrito" type="button">🛒</button>
        <button class="btn-card-compare ${state.compare.has(product.id) ? 'is-on' : ''}" data-compare="${product.id}" title="Comparar producto" aria-label="Comparar ${product.nombre}" aria-pressed="${state.compare.has(product.id)}" type="button">⇄</button>
      </div>
    </div>`;

  card.addEventListener('mousemove', event => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  });
  $('.product-card__media', card).addEventListener('click', event => {
    if (!event.target.closest('[data-fav]')) openModal(product.id);
  });
  $('[data-fav]', card).addEventListener('click', event => {
    event.stopPropagation();
    toggleFav(product.id);
  });
  $('[data-compare]', card).addEventListener('click', () => toggleCompare(product.id));
  $('[data-quick]', card).addEventListener('click', () => openModal(product.id));
  $('[data-fast-add]', card).addEventListener('click', () => addToCart(product.id, product.talles[0]));
  return card;
};

const renderCatalog = () => {
  const grid = $('#product-grid');
  if (!grid) return;
  const empty = $('#empty-state');
  const count = $('#results-count');
  const pagination = $('#pagination-box');
  const products = getVisibleProducts();
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  state.currentPage = Math.max(1, Math.min(state.currentPage, totalPages || 1));
  const start = (state.currentPage - 1) * ITEMS_PER_PAGE;
  const pageProducts = products.slice(start, start + ITEMS_PER_PAGE);

  grid.replaceChildren(...pageProducts.map(createCard));
  grid.hidden = products.length === 0;
  if (empty) empty.hidden = products.length !== 0;
  if (count) count.textContent = products.length ? `Mostrando ${start + 1}-${Math.min(start + ITEMS_PER_PAGE, products.length)} de ${products.length} productos` : '0 productos';
  if (!pagination) return;
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  const firstPage = Math.max(1, Math.min(state.currentPage - 2, totalPages - 4));
  const lastPage = Math.min(totalPages, firstPage + 4);
  let html = `<button class="page-btn" data-page="${state.currentPage - 1}" type="button" aria-label="Página anterior" ${state.currentPage === 1 ? 'disabled' : ''}>‹</button>`;
  for (let page = firstPage; page <= lastPage; page++) {
    html += `<button class="page-btn ${page === state.currentPage ? 'is-active' : ''}" data-page="${page}" type="button" aria-current="${page === state.currentPage ? 'page' : 'false'}">${page}</button>`;
  }
  html += `<button class="page-btn" data-page="${state.currentPage + 1}" type="button" aria-label="Página siguiente" ${state.currentPage === totalPages ? 'disabled' : ''}>›</button>`;
  pagination.innerHTML = html;
  $$('.page-btn:not(:disabled)', pagination).forEach(button => button.addEventListener('click', () => {
    state.currentPage = Number(button.dataset.page);
    renderCatalog();
    $('#catalogo')?.scrollIntoView({ behavior: 'smooth' });
  }));
};

const updateCart = () => {
  const itemsHost = $('#cart-items');
  const count = $('#cart-count');
  const total = $('#cart-subtotal');
  const itemCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  if (count) {
    count.textContent = itemCount;
    count.hidden = itemCount === 0;
  }
  const subtotal = state.cart.reduce((sum, item) => {
    const product = findProduct(item.id);
    return sum + (product ? product.precio * item.qty : 0);
  }, 0);
  const finalTotal = state.couponApplied ? subtotal * 0.9 : subtotal;
  if (total) total.textContent = formatPrice(finalTotal);
  if (itemsHost) {
    if (!state.cart.length) {
      itemsHost.innerHTML = '<p class="empty-state">Tu carrito está vacío.</p>';
    } else {
      itemsHost.innerHTML = state.cart.map(item => {
        const product = findProduct(item.id);
        if (!product) return '';
        return `<div class="cart-item">
          <div class="cart-item__img"><img src="${product.img}" alt="${product.nombre}"></div>
          <div><strong>${product.nombre}</strong><small> Talle: ${item.size} · ${formatPrice(product.precio)}</small><div class="qty-control"><button data-qty="-1" data-id="${item.id}" data-size="${item.size}" aria-label="Quitar uno" type="button">−</button><span>${item.qty}</span><button data-qty="1" data-id="${item.id}" data-size="${item.size}" aria-label="Agregar uno" type="button">+</button></div></div>
          <button data-remove="${item.id}" data-size="${item.size}" aria-label="Eliminar ${product.nombre}" type="button">✕</button>
        </div>`;
      }).join('');
      $$('[data-qty]', itemsHost).forEach(button => button.addEventListener('click', () => changeQuantity(Number(button.dataset.id), button.dataset.size, Number(button.dataset.qty))));
      $$('[data-remove]', itemsHost).forEach(button => button.addEventListener('click', () => removeFromCart(Number(button.dataset.remove), button.dataset.size)));
    }
  }
  storageWrite('kinetic_cart', state.cart);
};

const addToCart = (id, size) => {
  const existing = state.cart.find(item => item.id === id && item.size === size);
  if (existing) existing.qty++;
  else state.cart.push({ id, size, qty: 1 });
  updateCart();
  showToast('Producto agregado al carrito');
};
const changeQuantity = (id, size, amount) => {
  const item = state.cart.find(entry => entry.id === id && entry.size === size);
  if (!item) return;
  item.qty += amount;
  if (item.qty <= 0) state.cart = state.cart.filter(entry => entry !== item);
  updateCart();
};
const removeFromCart = (id, size) => {
  state.cart = state.cart.filter(item => !(item.id === id && item.size === size));
  updateCart();
};

const openCart = () => {
  $('#drawer-overlay').hidden = false;
  $('#cart-drawer').classList.add('is-open');
  document.body.style.overflow = 'hidden';
};
const closeCart = () => {
  $('#drawer-overlay').hidden = true;
  $('#cart-drawer').classList.remove('is-open');
  document.body.style.overflow = '';
};

let selectedSize = null;
const openModal = id => {
  const product = findProduct(id);
  if (!product) return;
  selectedProductId = product.id;
  state.recent = [product.id, ...state.recent.filter(item => item !== product.id)].slice(0, 8);
  storageWrite('kinetic_recent', state.recent);
  const modalBody = $('#modal-body');
  const galleryImages = [product.img, ...imgPool[product.categoria].filter(image => image !== product.img)].slice(0, 4);
  selectedSize = product.talles[0];
  modalBody.innerHTML = `<div class="product-detail">
    <div class="product-detail__media product-gallery"><img class="product-gallery__main" src="${galleryImages[0]}" alt="${product.nombre}"><div class="product-gallery__thumbs">${galleryImages.map((image, index) => `<button class="product-gallery__thumb ${index === 0 ? 'is-active' : ''}" data-image="${image}" aria-label="Ver imagen ${index + 1}" type="button"><img src="${image}" alt=""></button>`).join('')}</div></div>
    <div class="product-detail__info"><p class="eyebrow">${product.categoria} · ${product.genero}</p><h2 class="product-detail__name">${product.nombre}</h2><p>${product.desc}</p><strong class="product-card__price">${formatPrice(product.precio)}</strong><div><strong>Talle</strong><div class="filter-chips" style="margin-top:8px">${product.talles.map((size, index) => `<button class="chip ${index === 0 ? 'is-active' : ''}" data-size="${size}" type="button">${size}</button>`).join('')}</div></div><button class="btn btn--primary btn--full" id="modal-add-cart" type="button">Agregar al carrito</button></div>
  </div>`;
  $$('.product-gallery__thumb', modalBody).forEach(button => button.addEventListener('click', () => {
    $('.product-gallery__main', modalBody).src = button.dataset.image;
    $$('.product-gallery__thumb', modalBody).forEach(thumb => thumb.classList.toggle('is-active', thumb === button));
  }));
  $$('.chip[data-size]', modalBody).forEach(button => button.addEventListener('click', () => {
    selectedSize = button.dataset.size;
    $$('.chip[data-size]', modalBody).forEach(chip => chip.classList.toggle('is-active', chip === button));
  }));
  $('#modal-add-cart', modalBody).addEventListener('click', () => {
    addToCart(product.id, selectedSize);
    closeProductModal();
  });
  $('#modal-overlay').hidden = false;
  $('#product-modal').hidden = false;
  document.body.style.overflow = 'hidden';
};
const closeProductModal = () => {
  $('#modal-overlay').hidden = true;
  $('#product-modal').hidden = true;
  document.body.style.overflow = '';
};

const toggleCompare = id => {
  if (state.compare.has(id)) state.compare.delete(id);
  else if (state.compare.size >= 3) return showToast('Podés comparar hasta 3 productos a la vez');
  else state.compare.add(id);
  renderCatalog();
  renderCompareBar();
};
const renderCompareBar = () => {
  let bar = $('#compare-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'compare-bar';
    bar.className = 'compare-bar';
    bar.setAttribute('aria-live', 'polite');
    document.body.appendChild(bar);
  }
  bar.hidden = !state.compare.size;
  if (!state.compare.size) return;
  bar.innerHTML = `<span><strong>${state.compare.size}/3</strong> productos seleccionados</span><div class="compare-bar__actions"><button class="btn btn--glass" id="clear-compare" type="button">Limpiar</button><button class="btn btn--primary" id="show-compare" type="button" ${state.compare.size < 2 ? 'disabled' : ''}>Comparar</button></div>`;
  $('#clear-compare', bar).addEventListener('click', () => { state.compare.clear(); renderCatalog(); renderCompareBar(); });
  $('#show-compare', bar).addEventListener('click', showCompareModal);
};
const showCompareModal = () => {
  const products = [...state.compare].map(findProduct).filter(Boolean);
  if (products.length < 2) return;
  let overlay = $('#compare-overlay');
  let modal = $('#compare-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'compare-overlay';
    overlay.className = 'modal-overlay';
    modal = document.createElement('section');
    modal.id = 'compare-modal';
    modal.className = 'modal compare-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    document.body.append(overlay, modal);
    overlay.addEventListener('click', closeCompareModal);
  }
  modal.innerHTML = `<button class="icon-btn modal__close" id="compare-close" type="button" aria-label="Cerrar comparación">✕</button><div class="compare-content"><p class="eyebrow">Cara a cara</p><h2 class="section-title text-white">Compará productos</h2><div class="compare-table">${products.map(product => `<article class="compare-product"><img src="${product.img}" alt="${product.nombre}"><h3>${product.nombre}</h3><p class="compare-price">${formatPrice(product.precio)}</p><dl><div><dt>Categoría</dt><dd>${product.categoria}</dd></div><div><dt>Género</dt><dd>${product.genero}</dd></div><div><dt>Talles</dt><dd>${product.talles.join(', ')}</dd></div><div><dt>Calificación</dt><dd>★ ${product.rating}</dd></div></dl><button class="btn btn--primary btn--full" data-compare-add="${product.id}" type="button">Agregar al carrito</button></article>`).join('')}</div></div>`;
  modal.hidden = false;
  overlay.hidden = false;
  $('#compare-close', modal).addEventListener('click', closeCompareModal);
  $$('[data-compare-add]', modal).forEach(button => button.addEventListener('click', () => {
    const product = findProduct(button.dataset.compareAdd);
    if (product) addToCart(product.id, product.talles[0]);
    closeCompareModal();
  }));
};
const closeCompareModal = () => {
  if ($('#compare-modal')) $('#compare-modal').hidden = true;
  if ($('#compare-overlay')) $('#compare-overlay').hidden = true;
};

let selectedProductId = null;

const setup = () => {
  document.addEventListener('click', event => {
    const jump = event.target.closest('[data-cat-jump]');
    if (jump) {
      state.filters.categoria = jump.dataset.catJump;
      state.currentPage = 1;
      setFilterChip('categoria', state.filters.categoria);
      renderCatalog();
      $('#catalogo').scrollIntoView({ behavior: 'smooth' });
    }
  });

  $('#currency-selector').value = state.currency;
  $('#currency-selector').addEventListener('change', event => {
    state.currency = event.target.value;
    storageWrite('kinetic_currency', state.currency);
    renderCatalog();
    updateCart();
    if (selectedProductId && !$('#product-modal').hidden) openModal(selectedProductId);
  });
  $('#nav-toggle').addEventListener('click', () => {
    const menu = $('#mobile-menu');
    menu.hidden = !menu.hidden;
  });
  $$('#mobile-menu a').forEach(link => link.addEventListener('click', () => { $('#mobile-menu').hidden = true; }));

  $('#search-open').addEventListener('click', () => {
    $('#search-panel').hidden = false;
    $('#search-input').focus();
  });
  $('#search-close').addEventListener('click', () => {
    $('#search-panel').hidden = true;
    $('#search-suggestions')?.setAttribute('hidden', '');
  });
  $('#search-input').addEventListener('input', event => {
    state.filters.search = event.target.value;
    state.currentPage = 1;
    renderCatalog();
    renderSuggestions(event.target.value);
  });
  $('#search-input').addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      $('#search-panel').hidden = true;
      $('#catalogo').scrollIntoView({ behavior: 'smooth' });
    }
  });

  $$('.filter-chips[data-filter-group]').forEach(group => group.addEventListener('click', event => {
    const button = event.target.closest('.chip');
    if (!button) return;
    group.querySelectorAll('.chip').forEach(chip => chip.classList.toggle('is-active', chip === button));
    state.filters[group.dataset.filterGroup] = button.dataset.value;
    state.currentPage = 1;
    renderCatalog();
  }));
  $('#filter-precio').addEventListener('input', event => {
    state.filters.precioMax = Number(event.target.value);
    $('#precio-output').textContent = state.filters.precioMax >= 250 ? 'Sin límite' : formatPrice(state.filters.precioMax);
    state.currentPage = 1;
    renderCatalog();
  });
  $('#sort-select').addEventListener('change', event => {
    state.filters.sort = event.target.value;
    state.currentPage = 1;
    renderCatalog();
  });
  $('#fav-only').addEventListener('click', event => {
    state.favOnly = !state.favOnly;
    event.currentTarget.classList.toggle('is-active', state.favOnly);
    state.currentPage = 1;
    renderCatalog();
  });
  $('#reset-filters').addEventListener('click', () => {
    state.filters = { genero: '', categoria: '', precioMax: 250, search: '', sort: 'default' };
    state.favOnly = false;
    state.currentPage = 1;
    $('#filter-precio').value = 250;
    $('#precio-output').textContent = 'Sin límite';
    $('#sort-select').value = 'default';
    $('#search-input').value = '';
    $('#fav-only').classList.remove('is-active');
    $$('.filter-chips[data-filter-group]').forEach(group => group.querySelectorAll('.chip').forEach((chip, index) => chip.classList.toggle('is-active', index === 0)));
    renderCatalog();
  });
  $('#wishlist-btn').addEventListener('click', () => {
    state.favOnly = !state.favOnly;
    $('#fav-only').classList.toggle('is-active', state.favOnly);
    renderCatalog();
    $('#catalogo').scrollIntoView({ behavior: 'smooth' });
  });

  $('#cart-open').addEventListener('click', openCart);
  $('#cart-close').addEventListener('click', closeCart);
  $('#drawer-overlay').addEventListener('click', closeCart);
  $('#modal-close').addEventListener('click', closeProductModal);
  $('#modal-overlay').addEventListener('click', closeProductModal);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeCart();
      closeProductModal();
      closeCompareModal();
    }
  });

  $('#apply-coupon').addEventListener('click', () => {
    const input = $('#coupon-input');
    if (input.value.trim().toUpperCase() === 'NEXORA10') {
      state.couponApplied = true;
      updateCart();
      showToast('Cupón aplicado: 10% de descuento');
    } else showToast('Cupón no válido');
  });
  $('#checkout-btn').addEventListener('click', () => {
    if (!state.cart.length) return showToast('Tu carrito está vacío');
    const lines = state.cart.map(item => {
      const product = findProduct(item.id);
      return `${product.nombre} (talle ${item.size}) x${item.qty} — ${formatPrice(product.precio * item.qty)}`;
    });
    const subtotal = state.cart.reduce((sum, item) => sum + findProduct(item.id).precio * item.qty, 0);
    const total = state.couponApplied ? subtotal * 0.9 : subtotal;
    const message = `Hola, quiero realizar este pedido:\n${lines.join('\n')}\nTotal: ${formatPrice(total)}${state.couponApplied ? ' (cupón NEXORA10 aplicado)' : ''}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });

  $('#open-size-calculator').addEventListener('click', () => {
    $('#size-calc-overlay').hidden = false;
    $('#size-calc-modal').hidden = false;
  });
  $('#size-calc-close').addEventListener('click', closeSizeCalculator);
  $('#size-calc-overlay').addEventListener('click', closeSizeCalculator);
  $('#calc-size-btn').addEventListener('click', () => {
    const height = Number($('#sc-altura').value);
    const weight = Number($('#sc-peso').value);
    const result = $('#size-result-box');
    if (!height || !weight) {
      result.textContent = 'Ingresá altura y peso válidos.';
    } else {
      const size = weight / ((height / 100) ** 2);
      result.textContent = `Talle orientativo: ${size < 20 ? 'S' : size < 25 ? 'M' : size < 30 ? 'L' : 'XL'}. Para calzado, consultá la guía específica.`;
    }
    result.hidden = false;
  });

  window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    $('#scroll-progress').style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
  }, { passive: true });

  updateFavCount();
  updateCart();
  renderCatalog();
};

const setFilterChip = (groupName, value) => {
  const group = $(`.filter-chips[data-filter-group="${groupName}"]`);
  if (group) group.querySelectorAll('.chip').forEach(chip => chip.classList.toggle('is-active', chip.dataset.value === value));
};
const renderSuggestions = query => {
  let host = $('#search-suggestions');
  if (!host) {
    host = document.createElement('div');
    host.id = 'search-suggestions';
    host.className = 'search-suggestions';
    $('.search-input-wrapper').appendChild(host);
  }
  const matches = query.trim() ? PRODUCTS.filter(product => product.nombre.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : [];
  host.hidden = matches.length === 0;
  host.innerHTML = matches.map(product => `<button type="button" data-suggestion="${product.id}"><img src="${product.img}" alt=""><span>${product.nombre}</span><strong>${formatPrice(product.precio)}</strong></button>`).join('');
  $$('[data-suggestion]', host).forEach(button => button.addEventListener('click', () => {
    $('#search-panel').hidden = true;
    openModal(Number(button.dataset.suggestion));
  }));
};
const closeSizeCalculator = () => {
  $('#size-calc-overlay').hidden = true;
  $('#size-calc-modal').hidden = true;
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
else setup();
