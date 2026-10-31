var P=[
{id:"host",name:"Cloud hosting",desc:"Fast, always-on hosting for your site or app. Pay for as many months as you need.",price:10,rec:true,feat:true,tag:"Most popular"},
{id:"npm",name:"npm dependencies pack",desc:"Your project's npm dependencies installed, configured and ready to deploy.",price:10,rec:false},
{id:"domain",name:"Custom domain",desc:"Register a .com domain and point it to your host.",price:12,rec:true,unit:"year",step:12,minU:1},
{id:"ssl",name:"SSL certificate",desc:"HTTPS for your site, set up and renewed for you.",price:8,rec:true},
{id:"db",name:"Managed database",desc:"PostgreSQL or MongoDB with daily backups.",price:15,rec:true},
{id:"cdn",name:"CDN",desc:"Serve your files from servers close to your users.",price:5,rec:true},
{id:"ci",name:"CI/CD pipeline",desc:"Automatic tests and deploys every time you push code.",price:7,rec:true},
{id:"mail",name:"Business email",desc:"Email addresses on your own domain, with 5 mailboxes.",price:4,rec:true},
{id:"reg",name:"Private npm registry",desc:"Publish and install your own private packages.",price:9,rec:true},
{id:"vps",name:"VPS server",desc:"2 vCPU, 4 GB RAM, 80 GB SSD with full root access.",price:20,rec:true},
{id:"mon",name:"Uptime monitoring",desc:"Get an alert the moment your site goes down.",price:3,rec:true},
{id:"setup",name:"Project setup service",desc:"One-time setup: repo, build, deploy and environment variables.",price:25,rec:false},
{id:"fx",name:"Google international currency API",desc:"Live exchange rates and currency conversion for your app, set up once with your API access.",price:25,rec:false}
];
var cart={};
function fmt(n){return "$"+n.toFixed(n%1?2:0)}
function qty(p){return cart[p.id]}
function label(p,m){return m+(p.unit==="year"?(m===1?" year":" years"):(m===1?" month":" months"))}
function renderGrid(){
  var g=document.getElementById("grid");g.innerHTML="";
  P.forEach(function(p){
    var m=cart[p.id],c=document.createElement("div");c.className="card"+(p.feat?" feat":"");
    var left=document.createElement("div");left.style.cssText="display:flex;flex-direction:column;gap:8px;flex:1 1 260px";
    left.innerHTML=(p.tag?'<span class="tag">'+p.tag+'</span>':'')+'<h3>'+p.name+'</h3><p>'+p.desc+'</p>';
    var right=document.createElement("div");right.style.cssText="display:flex;flex-direction:column;gap:10px;justify-content:flex-end";
    right.innerHTML='<div class="price">'+fmt(p.price)+' <small>'+(p.rec?'/ '+(p.unit||'month')+(p.unit?'':' (min. 6 months)'):'one-time')+'</small></div>';
    var row=document.createElement("div");row.className="row";
    if(p.rec&&m){
      var s=document.createElement("div");s.className="stepper";
      s.innerHTML='<button aria-label="Fewer">&minus;</button><span>'+label(p,m)+'</span><button aria-label="More">+</button>';
      s.children[0].onclick=function(){if(m>(p.unit==="year"?1:6))cart[p.id]=m-1;update()};
      s.children[2].onclick=function(){if(m<36)cart[p.id]=m+1;update()};
      row.appendChild(s);
    }
    var b=document.createElement("button");b.className="btn"+(m?" in":"");
    b.textContent=m?"Remove":"Add to order";
    b.onclick=function(){if(m)delete cart[p.id];else cart[p.id]=p.rec&&p.unit!=="year"?6:1;update()};
    row.appendChild(b);right.appendChild(row);
    c.appendChild(left);c.appendChild(right);g.appendChild(c);
  });
}
function total(){return P.reduce(function(t,p){return t+(cart[p.id]?p.price*cart[p.id]:0)},0)}
function renderCart(){
  var L=document.getElementById("lines");L.innerHTML="";var any=false;
  P.forEach(function(p){
    var m=cart[p.id];if(!m)return;any=true;
    var d=document.createElement("div");d.className="line";
    d.innerHTML='<span>'+p.name+'<small>'+(p.rec?fmt(p.price)+' × '+label(p,m):'One-time')+'</small><button>Remove</button></span><b>'+fmt(p.price*m)+'</b>';
    d.querySelector("button").onclick=function(){delete cart[p.id];update()};
    L.appendChild(d);
  });
  if(!any)L.innerHTML='<p class="empty">Nothing here yet. Add hosting or a tool to get started.</p>';
  document.getElementById("total").textContent=fmt(total());
}
function update(){renderGrid();renderCart()}
var dlg=document.getElementById("dlg");
document.getElementById("buy").onclick=function(){
  if(!total()){document.getElementById("lines").innerHTML='<p class="empty">Add at least one item before you purchase.</p>';return}
  document.getElementById("amt").textContent="Transfer "+fmt(total())+" to this account to complete your order.";
  dlg.showModal();
};
document.getElementById("close").onclick=function(){dlg.close()};
dlg.addEventListener("click",function(e){
  var t=e.target;
  if(t===dlg)dlg.close();
  if(t.dataset&&t.dataset.copy){
    var v=t.dataset.copy;
    try{navigator.clipboard.writeText(v)}catch(x){}
    t.textContent="Copied";setTimeout(function(){t.textContent="Copy"},1500);
  }
});
cart.host=6;update();
