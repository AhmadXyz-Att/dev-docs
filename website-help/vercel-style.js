
(function(){const gaya=document.createElement('style');gaya.textContent=`
.vercel-navbar,.vercel-navbar *{box-sizing:border-box}
.vercel-navbar{position:sticky;top:0;z-index:99999;width:100%;background:rgba(10,10,10,.88);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid #262626;color:#ededed;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
.vercel-navbar-inner{max-width:1280px;min-height:64px;margin:auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;gap:24px}
.vercel-brand{display:inline-flex;align-items:center;gap:10px;color:#fff;text-decoration:none;font-size:17px;font-weight:650;letter-spacing:-.6px;white-space:nowrap}
.vercel-logo{width:25px;height:23px;display:block;fill:#fff}
.vercel-menu{display:flex;align-items:center;gap:5px;margin:0;padding:0;list-style:none}
.vercel-menu a,.vercel-menu-button{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:9px 12px;border:1px solid transparent;border-radius:7px;background:transparent;color:#a1a1aa;text-decoration:none;font:inherit;font-size:13px;white-space:nowrap;cursor:pointer;transition:background .2s,color .2s,border-color .2s}
.vercel-menu a:hover,.vercel-menu-button:hover{background:#171717;color:#fff}
.vercel-menu a.aktif{color:#fff;background:#171717;border-color:#292929}
.vercel-kanan{display:flex;align-items:center;gap:10px}
.vercel-cari{width:190px;height:36px;display:flex;align-items:center;gap:9px;padding:0 10px;border:1px solid #303030;border-radius:8px;background:#111;color:#737373}
.vercel-cari svg{width:15px;height:15px;flex-shrink:0;fill:none;stroke:currentColor;stroke-width:1.8}
.vercel-cari input{width:100%;min-width:0;outline:none;border:0;background:transparent;color:#ededed;font-size:12px}
.vercel-cari input::placeholder{color:#737373}
.vercel-tombol{height:36px;padding:0 14px;border:1px solid #333;border-radius:8px;background:#111;color:#ededed;font-size:12px;font-weight:550;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;cursor:pointer;transition:background .2s}
.vercel-tombol:hover{background:#222}
.vercel-tombol.putih{background:#fff;color:#000;border-color:#fff}
.vercel-tombol.putih:hover{background:#e5e5e5}
.vercel-menu-mobile{display:none;width:36px;height:36px;align-items:center;justify-content:center;border:1px solid #303030;border-radius:8px;background:#111;color:#fff;cursor:pointer}
.vercel-menu-mobile svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round}
.vercel-mobile{display:none;border-top:1px solid #262626;padding:10px 16px 16px;background:#0a0a0a}
.vercel-mobile.buka{display:block;animation:vercelMuncul .18s ease}
.vercel-mobile a{display:flex;align-items:center;justify-content:space-between;padding:12px 10px;border-radius:7px;color:#a1a1aa;text-decoration:none;font-size:13px}
.vercel-mobile a:hover{background:#171717;color:#fff}
.vercel-mobile-bawah{display:flex;gap:8px;padding:12px 0 0}
.vercel-mobile-bawah a{flex:1;justify-content:center;border:1px solid #303030}
.vercel-mobile-bawah a.putih{background:#fff;color:#000;border-color:#fff}
@keyframes vercelMuncul{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:1050px){.vercel-cari{width:150px}.vercel-navbar-inner{gap:12px}.vercel-menu a,.vercel-menu-button{padding:9px 8px}}
@media(max-width:800px){.vercel-navbar-inner{min-height:60px;padding:0 16px}.vercel-menu,.vercel-kanan .vercel-cari,.vercel-kanan .vercel-tombol{display:none}.vercel-menu-mobile{display:flex}.vercel-brand{font-size:16px}.vercel-kanan{margin-left:auto}}
@media(prefers-reduced-motion:reduce){.vercel-navbar *{animation:none!important;transition:none!important}}
`;document.head.appendChild(gaya);const navbar=document.createElement('header');navbar.className='vercel-navbar';navbar.innerHTML=`
<div class="vercel-navbar-inner">
<a class="vercel-brand" href="/" aria-label="Home">
<svg class="vercel-logo" viewBox="0 0 76 65" aria-hidden="true"><path d="M38 0 76 65H0L38 0Z"/></svg>
<span>Vercel</span>
</a>
<nav aria-label="Main navigation">
<ul class="vercel-menu">
<li><a class="aktif" href="#overview">Overview</a></li>
<li><a href="#products">Products</a></li>
<li><a href="#resources">Resources</a></li>
<li><a href="#docs">Documentation</a></li>
<li><a href="#pricing">Pricing</a></li>
</ul>
</nav>
<div class="vercel-kanan">
<label class="vercel-cari">
<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>
<input type="search" placeholder="Search..." aria-label="Search">
</label>
<a class="vercel-tombol" href="#login">Log In</a>
<a class="vercel-tombol putih" href="#signup">Sign Up</a>
<button class="vercel-menu-mobile" aria-label="Open navigation" aria-expanded="false">
<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
</button>
</div>
</div>
<div class="vercel-mobile">
<a href="#overview">Overview</a>
<a href="#products">Products</a>
<a href="#resources">Resources</a>
<a href="#docs">Documentation</a>
<a href="#pricing">Pricing</a>
<div class="vercel-mobile-bawah"><a href="#login">Log In</a><a class="putih" href="#signup">Sign Up</a></div>
</div>`;const sasaran=document.querySelector('[data-vercel-navbar]')||document.body;sasaran.prepend(navbar);const tombolMenu=navbar.querySelector('.vercel-menu-mobile');const menuMobile=navbar.querySelector('.vercel-mobile');tombolMenu.addEventListener('click',function(){const terbuka=menuMobile.classList.toggle('buka');tombolMenu.setAttribute('aria-expanded',String(terbuka));tombolMenu.setAttribute('aria-label',terbuka?'Close navigation':'Open navigation');tombolMenu.innerHTML=terbuka?'<svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>':'<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'});menuMobile.querySelectorAll('a').forEach(tautan=>tautan.addEventListener('click',()=>{menuMobile.classList.remove('buka');tombolMenu.setAttribute('aria-expanded','false');tombolMenu.setAttribute('aria-label','Open navigation');tombolMenu.innerHTML='<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'}));navbar.querySelector('.vercel-cari input').addEventListener('keydown',function(acara){if(acara.key==='Enter'&&this.value.trim()){window.dispatchEvent(new CustomEvent('vercel-search',{detail:{query:this.value.trim()}}))}})})();
