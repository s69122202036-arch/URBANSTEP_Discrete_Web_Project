const products=[
{id:1,name:"Velocity 01",cat:"running",price:3490,img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",tag:"NEW"},
{id:2,name:"Mono Runner",cat:"lifestyle",price:2890,img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",tag:"POPULAR"},
{id:3,name:"Court 84",cat:"classic",price:2590,img:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",tag:"CLASSIC"},
{id:4,name:"Aero Knit",cat:"running",price:3190,img:"https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80",tag:"LIGHT"},
{id:5,name:"Studio Low",cat:"lifestyle",price:2790,img:"https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=80",tag:"ESSENTIAL"},
{id:6,name:"Heritage 72",cat:"classic",price:2390,img:"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80",tag:"ARCHIVE"}];

let cart=JSON.parse(localStorage.getItem("urbanstep-cart")||"[]");
function money(n){return "฿"+n.toLocaleString("th-TH")}
function saveCart(){localStorage.setItem("urbanstep-cart",JSON.stringify(cart));document.querySelectorAll("#cartCount").forEach(x=>x.textContent=cart.length)}
function addToCart(id){let p=products.find(x=>x.id===id);cart.push(p);saveCart();let b=document.querySelector(`[data-add="${id}"]`);if(b){b.textContent="Added";setTimeout(()=>b.textContent="Add to bag",900)}}
function showCart(){if(!cart.length){alert("Your bag is empty.");return} alert("Bag\\n\\n"+cart.map(x=>x.name+" — "+money(x.price)).join("\\n")+"\\n\\nDemo checkout only.");}
function renderProducts(filter="all"){
 const grid=document.getElementById("productGrid"); if(!grid)return;
 grid.innerHTML=products.filter(p=>filter==="all"||p.cat===filter).map(p=>`<article class="product"><div class="product-image"><img src="${p.img}" alt="${p.name}"><span class="tag">${p.tag}</span></div><div class="product-info"><span class="category">${p.cat}</span><h3>${p.name}</h3><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add" data-add="${p.id}" onclick="addToCart(${p.id})">Add to bag</button></div></div></article>`).join("");
}
document.addEventListener("click",e=>{if(e.target.classList.contains("filter")){document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));e.target.classList.add("active");renderProducts(e.target.dataset.cat)}})
saveCart();

const graph={
Warehouse:[{to:"HubA",time:6,fare:25},{to:"HubB",time:9,fare:40}],
HubA:[{to:"Warehouse",time:6,fare:25},{to:"HubB",time:4,fare:18},{to:"StoreA",time:7,fare:25}],
HubB:[{to:"Warehouse",time:9,fare:40},{to:"HubA",time:4,fare:18},{to:"StoreB",time:6,fare:22},{to:"StoreC",time:8,fare:30}],
StoreA:[{to:"HubA",time:7,fare:25},{to:"StoreC",time:6,fare:22}],
StoreB:[{to:"HubB",time:6,fare:22},{to:"StoreC",time:5,fare:20}],
StoreC:[{to:"HubB",time:8,fare:30},{to:"StoreA",time:6,fare:22},{to:"StoreB",time:5,fare:20}]
};
function dijkstra(start,target,costFn){
 const dist={},prev={},open=new Set(Object.keys(graph)); Object.keys(graph).forEach(v=>dist[v]=Infinity);dist[start]=0;
 while(open.size){let u=[...open].reduce((a,b)=>dist[a]<dist[b]?a:b);open.delete(u);if(u===target)break;
   graph[u].forEach(e=>{if(!open.has(e.to))return;let alt=dist[u]+costFn(e);if(alt<dist[e.to]){dist[e.to]=alt;prev[e.to]=u}});
 }
 let path=[],cur=target;if(dist[target]===Infinity)return null;while(cur){path.unshift(cur);if(cur===start)break;cur=prev[cur]}return {cost:dist[target],path};
}
function pathEdges(path){let out=[];for(let i=0;i<path.length-1;i++){let e=graph[path[i]].find(x=>x.to===path[i+1]);out.push(e)}return out}
function calculateRoutes(){
 let from=document.getElementById("from")?.value||"Warehouse",to=document.getElementById("to")?.value||"StoreA",box=document.getElementById("routeResults");if(!box)return;
 let fastest=dijkstra(from,to,e=>e.time), cheapest=dijkstra(from,to,e=>e.fare), balanced=dijkstra(from,to,e=>e.time+e.fare*.25);
 const cards=[["Fastest route",fastest,"time"],["Lowest fare",cheapest,"fare"],["Recommended",balanced,"balanced"]];
 box.innerHTML=cards.map(([title,r,type],i)=>{let es=pathEdges(r.path),time=es.reduce((s,e)=>s+e.time,0),fare=es.reduce((s,e)=>s+e.fare,0);return `<div class="route-card ${i===2?"best":""}"><div class="route-top"><div class="route-title">${title}<small>${i===0?"Minimum time":i===1?"Minimum fare":"Balanced weight"}</small></div><b>${money(fare)}</b></div><div class="route-metrics"><div><b>${time} min</b><small>Total time</small></div><div><b>${es.length-1<0?0:es.length-1}</b><small>Transfers</small></div><div><b>${r.path.length}</b><small>Vertices</small></div></div><div class="mini-path">${r.path.join("  →  ")}</div></div>`}).join("");
}
function confirmTicket(){localStorage.setItem("urbanstep-ticket","US-260927-1048");location.href="ticket.html"}