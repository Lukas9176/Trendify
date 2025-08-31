// Enkel e-handelsdemo i svenska - inga backend-anrop, allt i localStorage
const SAMPLE_PRODUCTS = [
  {id:'p1',title:'LED Ringlampa 26cm',desc:'Populär ringlampa för videoinspelning. Snabbt säljande produkt.',price:249,img:'https://picsum.photos/seed/lamp/600/400'},
  {id:'p2',title:'Bärbar Smoothie Mixer',desc:'Mini-blender med USB-laddning. Perfekt för hälsoköp.',price:349,img:'https://picsum.photos/seed/blender/600/400'},
  {id:'p3',title:'Massagepistol Mini',desc:'Kraftfull massage i fickformat — ofta "vinnare" på sociala plattformar.',price:699,img:'https://picsum.photos/seed/massage/600/400'}
]

// Keys
const STORAGE_PRODUCTS = 'wp_products_v1'
const STORAGE_CART = 'wp_cart_v1'

// Utilities
const byId = id => document.getElementById(id)
const saveProducts = (arr) => localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(arr))
const loadProducts = () => {
  const raw = localStorage.getItem(STORAGE_PRODUCTS)
  if(!raw) { saveProducts(SAMPLE_PRODUCTS); return SAMPLE_PRODUCTS }
  try { return JSON.parse(raw) } catch(e){ saveProducts(SAMPLE_PRODUCTS); return SAMPLE_PRODUCTS }
}
const saveCart = (cart) => localStorage.setItem(STORAGE_CART, JSON.stringify(cart))
const loadCart = () => {
  const raw = localStorage.getItem(STORAGE_CART)
  if(!raw) return {}
  try{ return JSON.parse(raw) }catch(e){ return {} }
}

let products = loadProducts()
let cart = loadCart()

// Render product list
function renderProducts(){
  const container = byId('product-list')
  container.innerHTML = ''
  products.forEach(p => {
    const div = document.createElement('div'); div.className='card'
    div.innerHTML = `
      <img src="${p.img||'https://picsum.photos/600/400'}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="price-row">
        <div><strong>${p.price} SEK</strong></div>
        <div>
          <button class="btn" data-id="${p.id}" data-action="buy">Lägg i kundvagn</button>
          <button class="btn secondary" data-id="${p.id}" data-action="view">Visa</button>
        </div>
      </div>
    `
    container.appendChild(div)
  })
  attachProductButtons()
}

// Buttons
function attachProductButtons(){
  document.querySelectorAll('button[data-action="buy"]').forEach(btn=>btn.onclick = e=>{
    const id = e.currentTarget.dataset.id; addToCart(id); updateCartUI()
  })
  document.querySelectorAll('button[data-action="view"]').forEach(btn=>btn.onclick = e=>{
    const id = e.currentTarget.dataset.id; openModal(id)
  })
}

// Modal
const modal = byId('product-modal'), modalBody = byId('modal-body'), modalClose = byId('modal-close')
function openModal(id){
  const p = products.find(x=>x.id===id); if(!p) return
  modalBody.innerHTML = `
    <img src="${p.img}" alt="${p.title}" style="width:100%;max-height:350px;object-fit:cover;border-radius:8px">
    <h2>${p.title}</h2>
    <p>${p.desc}</p>
    <p class="muted"><strong>${p.price} SEK</strong></p>
    <div style="display:flex;gap:8px">
      <button class="btn" id="modal-add">Lägg i kundvagn</button>
      <button class="btn secondary" id="modal-close-2">Stäng</button>
    </div>
  `
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false')
  byId('modal-add').onclick = ()=>{ addToCart(id); updateCartUI(); closeModal() }
  byId('modal-close-2').onclick = closeModal
}
function closeModal(){ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true') }
modalClose.onclick = closeModal

// Cart logic
function addToCart(id, qty=1){
  cart[id] = (cart[id]||0) + qty; saveCart(cart)
}
function removeFromCart(id){
  delete cart[id]; saveCart(cart)
}
function changeQty(id, qty){
  if(qty<=0) removeFromCart(id)
  else cart[id]=qty
  saveCart(cart)
}
function cartCount(){
  return Object.values(cart).reduce((s,n)=>s+n,0)
}
function cartTotal(){
  return Object.entries(cart).reduce((s,[id,q])=>{
    const p = products.find(x=>x.id===id); return s + (p? p.price * q : 0)
  },0)
}

function updateCartUI(){
  byId('cart-count').textContent = cartCount()
  const itemsDiv = byId('cart-items'); itemsDiv.innerHTML = ''
  if(cartCount()===0){ itemsDiv.innerHTML = '<p class="muted">Kundvagnen är tom.</p>'; byId('cart-summary').classList.add('hidden'); return }
  Object.entries(cart).forEach(([id,q])=>{
    const p = products.find(x=>x.id===id)
    const div = document.createElement('div'); div.className='cart-item'
    div.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="meta">
        <strong>${p.title}</strong>
        <div class="muted">${p.price} SEK</div>
      </div>
      <div>
        <div class="qty">
          <button class="btn secondary" data-id="${id}" data-action="dec">−</button>
          <div style="padding:6px 10px;border:1px solid #eee;border-radius:6px">${q}</div>
          <button class="btn" data-id="${id}" data-action="inc">+</button>
        </div>
        <div style="margin-top:8px"><button class="btn secondary" data-id="${id}" data-action="remove">Ta bort</button></div>
      </div>
    `
    itemsDiv.appendChild(div)
  })
  // attach actions
  document.querySelectorAll('button[data-action="inc"]').forEach(b=>b.onclick=e=>{ const id=e.currentTarget.dataset.id; changeQty(id, (cart[id]||0)+1); updateCartUI() })
  document.querySelectorAll('button[data-action="dec"]').forEach(b=>b.onclick=e=>{ const id=e.currentTarget.dataset.id; changeQty(id, (cart[id]||0)-1); updateCartUI() })
  document.querySelectorAll('button[data-action="remove"]').forEach(b=>b.onclick=e=>{ const id=e.currentTarget.dataset.id; removeFromCart(id); updateCartUI() })

  byId('cart-total').textContent = cartTotal().toFixed(2)
  byId('cart-summary').classList.remove('hidden')
}

// Admin form
byId('admin-form').onsubmit = (ev)=>{
  ev.preventDefault()
  const fd = new FormData(ev.target)
  const nxt = {id: 'p'+Date.now(), title: fd.get('title'), desc: fd.get('desc'), price: parseFloat(fd.get('price')), img: fd.get('img')||'https://picsum.photos/600/400'}
  products.unshift(nxt); saveProducts(products); renderProducts()
  byId('admin-msg').textContent = 'Produkten lades till.'
  ev.target.reset()
}

// Navigation & hash handling
function showSection(hash){
  document.querySelectorAll('main .container > section, main .container > section.admin-section').forEach(s=>s.classList.add('hidden'))
  if(!hash || hash==='#' || hash==='#home'){ byId('product-list').parentElement.classList.remove('hidden'); byId('product-list').parentElement.querySelector('#product-list') }
  if(hash==='#admin') byId('admin').classList.remove('hidden')
  if(hash==='#cart') { byId('cart').classList.remove('hidden'); updateCartUI() }
}
window.addEventListener('hashchange', ()=> showSection(location.hash))
document.getElementById('homeLink').onclick = ()=>{ location.hash='#home' }
document.getElementById('adminLink').onclick = ()=>{ location.hash='#admin' }
document.getElementById('cartLink').onclick = ()=>{ location.hash='#cart' }

// Checkout flow (mock)
byId('checkout-btn').onclick = ()=>{ byId('checkout').classList.remove('hidden'); byId('checkout-form').scrollIntoView() }
byId('checkout-form').onsubmit = (ev)=>{
  ev.preventDefault()
  const fd = new FormData(ev.target)
  const order = {
    id: 'order_' + Date.now(),
    name: fd.get('name'),
    email: fd.get('email'),
    address: fd.get('address'),
    items: cart,
    total: cartTotal()
  }
  // In a real app: send to backend. Here we simulate.
  console.log('Order:', order)
  byId('order-result').textContent = 'Tack! Din order är mottagen (demo). Ordernummer: ' + order.id
  // clear cart
  cart = {}; saveCart(cart); updateCartUI()
  byId('checkout').classList.add('hidden')
  location.hash = '#home'
}

// Init
renderProducts(); updateCartUI(); showSection(location.hash)
