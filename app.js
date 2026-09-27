const PRODUCTS = [
  {id:"psg", name:"Paris Saint-Germain 2026/27 Stadium Home", team:"PSG", league:"Ligue 1", type:"Stadium", price:2900, color:"#173c92", accent:"#e83d69", stock:12},
  {id:"inter", name:"Inter Milan 2026/27 Stadium Home", team:"INTER", league:"Serie A", type:"Stadium", price:2900, color:"#101b63", accent:"#7ed9ff", stock:8},
  {id:"chelsea", name:"Chelsea FC 2026/27 Match Home", team:"CHELSEA", league:"Premier League", type:"Authentic", price:4600, color:"#0047b3", accent:"#fff", stock:6},
  {id:"spurs", name:"Tottenham Hotspur 2026/27 Stadium Home", team:"SPURS", league:"Premier League", type:"Stadium", price:2900, color:"#f5f6f8", accent:"#142a58", stock:10},
  {id:"barca", name:"FC Barcelona 2026/27 Stadium Home", team:"BARÇA", league:"La Liga", type:"Stadium", price:2900, color:"#7c1530", accent:"#27348b", stock:7},
  {id:"france", name:"France National Team 2026 Stadium Home", team:"FRANCE", league:"National Teams", type:"Stadium", price:2900, color:"#142f6b", accent:"#e8edf8", stock:9},
  {id:"brazil", name:"Brazil National Team 2026 Stadium Home", team:"BRAZIL", league:"National Teams", type:"Stadium", price:1740, oldPrice:2900, color:"#f4d51f", accent:"#16864b", stock:5},
  {id:"england", name:"England National Team 2026 Stadium Home", team:"ENGLAND", league:"National Teams", type:"Stadium", price:2900, color:"#f7f7f3", accent:"#173b7b", stock:4}
];

const TREE = {
  name:"JERSEY LAB", children:[
    {name:"Club Teams", children:[
      {name:"Premier League", children:[{name:"Chelsea FC 2026/27"}, {name:"Tottenham Hotspur 2026/27"}]},
      {name:"La Liga", children:[{name:"FC Barcelona 2026/27"}]},
      {name:"Serie A", children:[{name:"Inter Milan 2026/27"}]},
      {name:"Ligue 1", children:[{name:"Paris Saint-Germain 2026/27"}]}
    ]},
    {name:"National Teams", children:[
      {name:"World Cup 2026", children:[{name:"France 2026"}, {name:"Brazil 2026"}, {name:"England 2026"}]}
    ]}
  ]
};

// Weighted Graph: logistics hubs. Vertex = hub/warehouse; Edge = delivery leg; weight = time (minutes) + fare (baht).
const GRAPH = {
  Warehouse:["Bangkok DC","Central Hub"],
  "Bangkok DC":["Warehouse","North Hub","East Hub","Bangkok Customer"],
  "Central Hub":["Warehouse","East Hub","South Hub"],
  "North Hub":["Bangkok DC","Chiang Mai"],
  "East Hub":["Bangkok DC","Central Hub","Pattaya"],
  "South Hub":["Central Hub","Phuket"],
  "Chiang Mai":["North Hub","Customer"],
  "Pattaya":["East Hub","Customer"],
  "Phuket":["South Hub","Customer"],
  Customer:["Chiang Mai","Pattaya","Phuket","Bangkok DC"]
};
const EDGE = {
  "Warehouse|Bangkok DC":{time:20,fare:35},"Warehouse|Central Hub":{time:30,fare:45},
  "Bangkok DC|North Hub":{time:35,fare:25},"Bangkok DC|East Hub":{time:30,fare:20},
  "Bangkok DC|Bangkok Customer":{time:15,fare:20},
  "Central Hub|East Hub":{time:25,fare:22},"Central Hub|South Hub":{time:40,fare:30},
  "North Hub|Chiang Mai":{time:50,fare:35},"East Hub|Pattaya":{time:35,fare:30},
  "South Hub|Phuket":{time:55,fare:45},"Chiang Mai|Customer":{time:25,fare:40},
  "Pattaya|Customer":{time:25,fare:35},"Phuket|Customer":{time:35,fare:55},
  "Customer|Bangkok DC":{time:15,fare:20}
};

function edge(a,b){return EDGE[`${a}|${b}`]||EDGE[`${b}|${a}`]||{time:0,fare:0}}
function dijkstra(weightFn){
  const dist={}, prev={}, Q=new Set(Object.keys(GRAPH));
  Object.keys(GRAPH).forEach(v=>dist[v]=Infinity); dist.Warehouse=0;
  while(Q.size){
    let u=null; for(const v of Q) if(u===null||dist[v]<dist[u])u=v;
    if(dist[u]===Infinity)break; Q.delete(u);
    for(const v of GRAPH[u]){
      if(!Q.has(v))continue; const e=edge(u,v), alt=dist[u]+weightFn(e);
      if(alt<dist[v]){dist[v]=alt;prev[v]=u;}
    }
  }
  const path=[]; let cur="Customer"; while(cur){path.unshift(cur);cur=prev[cur]}
  return {cost:dist.Customer,path};
}
function shippingRoutes(){
  const fastest=dijkstra(e=>e.time), cheapest=dijkstra(e=>e.fare), balanced=dijkstra(e=>e.time+e.fare*0.65);
  return {fastest,cheapest,balanced};
}
const state={
  product: PRODUCTS[0], size:"M", routes:shippingRoutes(),
  shippingMode:"balanced", qty:1
};

function money(n){return new Intl.NumberFormat("th-TH",{style:"currency",currency:"THB",maximumFractionDigits:0}).format(n)}
function qs(s){return document.querySelector(s)}
function save(){localStorage.setItem("jerseyState",JSON.stringify({productId:state.product.id,size:state.size,qty:state.qty,shippingMode:state.shippingMode}))}
function load(){try{const s=JSON.parse(localStorage.getItem("jerseyState")||"{}");if(s.productId)state.product=PRODUCTS.find(p=>p.id===s.productId)||state.product;if(s.size)state.size=s.size;if(s.qty)state.qty=s.qty;if(s.shippingMode)state.shippingMode=s.shippingMode}catch(e){}}
function go(page){location.href=page}
function header(active){
 return `<header class="topbar"><nav class="nav">
 <a class="brand" href="index.html">JERSEY<span>LAB</span></a>
 <div class="navlinks"><a class="${active==="home"?"active":""}" href="index.html">Shop</a><a class="${active==="compare"?"active":""}" href="compare.html">Compare</a><a class="${active==="detail"?"active":""}" href="detail.html">Order</a><a class="${active==="ticket"?"active":""}" href="ticket.html">E‑Ticket</a></div>
 <a class="cart" href="ticket.html">Bag <b>${state.qty}</b></a>
 </nav></header>`;
}
function footer(){return `<footer class="footer">JERSEY LAB — Interactive Web Application • Graph Theory × Tree • ราคาอ้างอิงจากตลาดไทยเพื่อการสาธิต</footer>`}
function jerseySVG(p, big=false){
 const id="g"+p.id; return `<svg viewBox="0 0 320 380" aria-label="${p.name}">
 <defs><linearGradient id="${id}" x1="0" x2="1"><stop stop-color="${p.color}"/><stop offset=".52" stop-color="${p.color}"/><stop offset="1" stop-color="${p.accent}"/></linearGradient></defs>
 <path d="M92 46 38 76 66 137 91 124 82 356Q160 374 238 356l-9-232 25 13 28-61-54-30-31 38h-74z" fill="url(#${id})" stroke="rgba(255,255,255,.5)" stroke-width="3"/>
 <path d="M122 46q38 34 76 0" fill="none" stroke="#111827" stroke-width="13"/>
 <path d="M92 65h136M82 115h156" stroke="rgba(255,255,255,.18)" stroke-width="2"/>
 <text x="160" y="190" text-anchor="middle" font-family="Arial,sans-serif" font-size="27" font-weight="800" fill="${p.accent}">${p.team}</text>
 <text x="160" y="225" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="rgba(255,255,255,.8)">JERSEY LAB</text>
 <text x="160" y="315" text-anchor="middle" font-family="Arial,sans-serif" font-size="58" font-weight="900" fill="rgba(255,255,255,.88)">10</text>
 </svg>`;
}
function productCard(p){
 return `<article class="card"><a href="detail.html?product=${p.id}"><div class="art">${jerseySVG(p)}</div><div class="cardbody"><span class="tag">${p.type}</span><div class="product-name">${p.name}</div><div class="product-meta">${p.league} • เหลือ ${p.stock} ตัว</div><div class="price">${money(p.price)}</div></div></a></article>`;
}
function treeHTML(n, level=0){
 const cls=level===0?"root":""; return `<li class="${cls}">${n.name}${n.children?`<ul>${n.children.map(x=>treeHTML(x,level+1)).join("")}</ul>`:""}</li>`;
}
function home(){
 const app=qs("#app"); app.innerHTML=header("home")+`<main>
 <section class="hero"><div><div class="eyebrow">Football shirts / 2026 collection</div><h1>WEAR THE<br><em>GAME.</em></h1><p>ร้านเสื้อฟุตบอลจำลองที่ใช้ Tree สำหรับหมวดหมู่สินค้า และ Weighted Graph + Dijkstra สำหรับคำนวณเส้นทางการจัดส่งจริงในระบบสาธิต</p><a class="btn" href="#collection">ดูคอลเลกชัน →</a></div><div class="hero-art">${jerseySVG(PRODUCTS[2],true)}</div></section>
 <section class="section" id="collection"><div class="section-head"><div><div class="eyebrow">Collection</div><h2>Match-ready shirts</h2></div><div class="muted">ราคาอ้างอิงตลาดไทย</div></div><div class="grid">${PRODUCTS.slice(0,4).map(productCard).join("")}</div></section>
 <section class="section"><div class="layout"><aside class="sidebar"><div class="eyebrow">Tree structure</div><h3>หมวดหมู่สินค้า</h3><div class="tree"><ul>${treeHTML(TREE)}</ul></div></aside><div class="panel"><div class="eyebrow">How the math works</div><h2>จาก Root → Leaf แล้วต่อด้วย Graph</h2><p class="muted">เลือกสินค้าเดินลง Tree จาก “JERSEY LAB” → ประเภท → ลีก → เสื้อ (Leaf) จากนั้นระบบใช้ Weighted Graph ของคลังและศูนย์กระจายสินค้าเพื่อหาเส้นทางจัดส่ง</p><div class="two-col"><div class="info-box"><strong>Tree</strong>Root = JERSEY LAB • Parent = ประเภท/ลีก • Child = โหนดถัดไป • Leaf = เสื้อที่เลือก</div><div class="info-box"><strong>Graph</strong>Vertex = จุดกระจายสินค้า • Edge = ช่วงขนส่ง • Weight = เวลา/ค่าส่ง</div></div><br><a class="btn secondary" href="compare.html">ดู Dijkstra Route →</a></div></div></section>
 </main>${footer()}`;
}
function routeCard(label,r,rec){
 const ship=state.product.price*state.qty>=5500?0:150;
 return `<div class="route-card ${rec?"recommended":""}"><div class="route-label">${label}${rec?" • SELECTED":""}</div><div class="route-price">${r.path.map(x=>x).join(" → ")}</div><div class="stats"><div class="stat"><b>${r.cost}</b><span>cost score</span></div><div class="stat"><b>${routeTime(r)} min</b><span>estimated time</span></div><div class="stat"><b>${money(ship)}</b><span>shipping fee</span></div></div><div class="route-line">${r.path.map((x,i)=>`<span class="node">${x}</span>${i<r.path.length-1?'<span class="arrow">→</span>':""}`).join("")}</div><button class="btn ${rec?"":"secondary"} full onclick="selectRoute('${label.toLowerCase()}')">${rec?"เลือกเส้นทางนี้":"ใช้เส้นทางนี้"}</button></div>`;
}
function routeTime(r){
 let t=0; for(let i=0;i<r.path.length-1;i++)t+=edge(r.path[i],r.path[i+1]).time; return t;
}
function compare(){
 const app=qs("#app"); const rs=state.routes; app.innerHTML=header("compare")+`<main>
 <div class="eyebrow">02 / Compare Routes</div><h1 style="font:700 50px 'Space Grotesk';margin:10px 0">Choose the delivery path.</h1>
 <p class="muted">ระบบรัน Dijkstra 3 รอบด้วย Weight ต่างกัน เพื่อให้เห็นว่า “Shortest Path” เปลี่ยนได้เมื่อความหมายของ Weight เปลี่ยน</p>
 <section class="section"><div class="compare-grid">${routeCard("FASTEST",rs.fastest,state.shippingMode==="fastest")}${routeCard("CHEAPEST",rs.cheapest,state.shippingMode==="cheapest")}${routeCard("BALANCED",rs.balanced,state.shippingMode==="balanced")}</div></section>
 <section class="section"><div class="panel"><div class="eyebrow">Adjacency List</div><h2>GRAPH = G(V,E)</h2><pre style="white-space:pre-wrap;color:#bfc8d6;line-height:1.7">${JSON.stringify(GRAPH,null,2)}</pre><div class="notice">Path ที่แสดงเป็นลำดับ Vertex ที่ติดกันด้วย Edge จริง และ Dijkstra ใช้การ Relax ค่า dist เพื่อหาเส้นทางที่มี Weight รวมต่ำที่สุด</div></div></section>
 <div style="margin-top:24px"><a class="btn" href="detail.html">ไปหน้ารายละเอียด →</a></div></main>${footer()}`;
}
window.selectRoute=function(mode){state.shippingMode=mode.includes("fastest")?"fastest":mode.includes("cheapest")?"cheapest":"balanced";save();location.reload()}
function detail(){
 const params=new URLSearchParams(location.search); const id=params.get("product"); if(id){const p=PRODUCTS.find(x=>x.id===id);if(p)state.product=p}
 const p=state.product; const r=state.routes[state.shippingMode]; const ship=p.price*state.qty>=5500?0:150; save();
 qs("#app").innerHTML=header("detail")+`<main><div class="eyebrow">03 / Itinerary Detail</div><div class="detail-grid" style="margin-top:18px">
 <div class="big-art">${jerseySVG(p,true)}</div><div class="detail"><span class="tag">${p.type} • ${p.league}</span><h1>${p.name}</h1><div class="detail-price">${money(p.price)} ${p.oldPrice?`<del style="font-size:16px;color:#687386">${money(p.oldPrice)}</del>`:""}</div>
 <div class="muted">Size</div><div class="option-row">${["S","M","L","XL","XXL"].map(s=>`<span class="chip ${state.size===s?"selected":""}" onclick="setSize('${s}')">${s}</span>`).join("")}</div>
 <div class="muted">Quantity</div><div class="option-row"><button class="btn secondary" onclick="changeQty(-1)">−</button><span class="chip selected">${state.qty}</span><button class="btn secondary" onclick="changeQty(1)">+</button></div>
 <div class="info-box"><strong>เส้นทางจัดส่งที่เลือก</strong>${r.path.join(" → ")}<br><span class="muted">เวลาโดยประมาณ ${routeTime(r)} นาที • ค่าส่ง ${ship?money(ship):"ฟรี"} • ฟรีเมื่อยอด ≥ ฿5,500</span></div>
 <div class="info-box"><strong>Graph → Product</strong> Path จาก Warehouse ถึง Customer ถูกคำนวณด้วย Dijkstra ส่วนสินค้านี้เป็น Leaf ที่ได้จาก Tree ในหน้า Shop</div>
 <button class="btn full" onclick="go('ticket.html')">ยืนยันคำสั่งซื้อ →</button></div></div></main>${footer()}`;
}
window.setSize=function(s){state.size=s;save();detail()}
window.changeQty=function(d){state.qty=Math.max(1,Math.min(5,state.qty+d));save();detail()}
function ticket(){
 const p=state.product,r=state.routes[state.shippingMode],subtotal=p.price*state.qty,ship=subtotal>=5500?0:150,total=subtotal+ship,code="JL-"+Math.random().toString(36).slice(2,8).toUpperCase();
 qs("#app").innerHTML=header("ticket")+`<main><div class="eyebrow">04 / E‑Ticket</div><h1 style="font:700 50px 'Space Grotesk';margin:10px 0">Your matchday order.</h1>
 <div class="ticket"><div class="ticket-top"><div class="eyebrow">JERSEY LAB • DEMO ORDER</div><div class="ticket-code">${code}</div><p class="muted">สร้างสำหรับสาธิตระบบเท่านั้น</p></div><div class="ticket-body">
 <div class="two-col"><div><div class="art" style="border-radius:16px">${jerseySVG(p)}</div></div><div><h2>${p.name}</h2><p class="muted">Size ${state.size} • Qty ${state.qty}</p><hr style="border-color:#252c38"><p>สินค้า <b style="float:right">${money(subtotal)}</b></p><p>จัดส่ง <b style="float:right">${ship?money(ship):"ฟรี"}</b></p><p style="font-size:20px">รวม <b style="float:right;color:var(--accent)">${money(total)}</b></p><div class="notice">Path: ${r.path.join(" → ")}<br>เวลาโดยประมาณ ${routeTime(r)} นาที</div></div></div>
 <div style="display:flex;justify-content:space-between;align-items:center;margin-top:25px;gap:20px"><div><b>Payment</b><br><span class="muted">Card / PromptPay (demo)</span></div><div class="qr"></div></div>
 </div></div>
 <div class="panel"><div class="eyebrow">Discrete Mathematics used</div><h2>ตรวจตามเกณฑ์โครงงาน</h2><div class="two-col"><div><p>✓ Vertex ≥ 6 และ Edge ≥ 7<br>✓ Adjacency List<br>✓ Weighted Graph<br>✓ Dijkstra + Path</p></div><div><p>✓ Tree ≥ 3 ระดับ<br>✓ Root / Parent / Child / Leaf<br>✓ Root → Leaf Path<br>✓ JavaScript อธิบายโครงสร้าง</p></div></div></div>
 </main>${footer()}`;
}
load(); const page=document.body.dataset.page;
if(page==="home")home(); if(page==="compare")compare(); if(page==="detail")detail(); if(page==="ticket")ticket();
