/* ============================================================
   IYADI — shared motion engine (all pages)
   ============================================================ */
(function(){
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover:none)').matches;
  const $  = (s,c)=> (c||document).querySelector(s);
  const $$ = (s,c)=> Array.from((c||document).querySelectorAll(s));
  const lerp = (a,b,t)=> a+(b-a)*t;
  const clamp = (v,a,b)=> Math.max(a,Math.min(b,v));

  document.body.classList.add('page-ready');
  if(document.querySelector('main .page-hero.green-hero')) document.body.classList.add('nav-on-dark');

  /* ---------- kinetic headline splitter ---------- */
  function splitKinetic(el){
    if(el.dataset.split==='done') return;
    const nodes = Array.from(el.childNodes); el.innerHTML='';
    let lastInner=null;
    nodes.forEach(node=>{
      if(node.nodeType===3){
        node.textContent.split(/(\s+)/).forEach(p=>{
          if(p==='') return;
          if(!p.trim()){ const sp=document.createElement('span'); sp.className='ksp'; el.appendChild(sp); return; }
          const w=document.createElement('span'); w.className='word';
          const s=document.createElement('span'); s.textContent=p; w.appendChild(s); el.appendChild(w);
          lastInner=s;
        });
      } else if(node.nodeName==='BR'){ el.appendChild(node); lastInner=null; }
      else { const w=document.createElement('span'); w.className='word';
        const s=document.createElement('span'); s.className=node.className||''; s.textContent=node.textContent;
        if(node.getAttribute && node.getAttribute('style')) s.setAttribute('style', node.getAttribute('style'));
        w.appendChild(s); el.appendChild(w); lastInner=s; }
    });
    $$('.word>span', el).forEach((s,i)=> s.style.transitionDelay=(i*80)+'ms');
    el.dataset.split='done';
  }
  $$('.kinetic[data-split]').forEach(splitKinetic);

  /* ---------- char splitter (going-green quote) ---------- */
  /* Group characters into per-word nowrap wrappers so words never break
     mid-word; spaces between words remain normal wrap opportunities. */
  $$('.chars[data-split]').forEach(el=>{
    const t=el.textContent; el.textContent='';
    let idx=0;
    t.split(/(\s+)/).forEach(part=>{
      if(part==='') return;
      if(!part.trim()){ el.appendChild(document.createTextNode(' ')); return; }
      const word=document.createElement('span');
      word.style.display='inline-block'; word.style.whiteSpace='nowrap';
      part.split('').forEach(c=>{ const s=document.createElement('span'); s.className='ch';
        s.textContent=c; s.style.transitionDelay=(idx*18)+'ms'; idx++; word.appendChild(s); });
      el.appendChild(word);
    });
  });

  /* ---------- hero skyline (home) ---------- */
  (function(){ const host=$('#heroSkyline'); if(!host) return;
    const N=56; let bars='';
    for(let i=0;i<N;i++){ const w=100/N, x=i*w;
      const seed=Math.sin(i*1.7)*0.5+0.5, seed2=Math.sin(i*0.6+2)*0.5+0.5;
      const h=18+seed*52+(seed2>0.7?28:0); const accent=(i%9===4);
      const fill=accent?'var(--green)':(seed2>0.55?'#d8b85a':'#e3c265');
      const op=accent?.9:(0.16+seed*0.22);
      bars+=`<rect class="sb" x="${x}%" y="${100-h}%" width="${w*0.62}%" height="${h}%" fill="${fill}" opacity="${op}"/>`;
    }
    host.innerHTML=`<svg preserveAspectRatio="none" viewBox="0 0 100 100">${bars}</svg>`;
  })();

  /* ---------- green particles ---------- */
  (function(){ const host=$('.green-particles'); if(!host) return;
    let html=''; for(let i=0;i<34;i++){ const l=Math.random()*100, d=8+Math.random()*12,
      delay=-Math.random()*16, sz=3+Math.random()*5;
      html+=`<i style="left:${l}%;bottom:-10px;width:${sz}px;height:${sz}px;animation-duration:${d}s;animation-delay:${delay}s"></i>`; }
    host.innerHTML=html;
  })();

  /* ---------- PRELOADER (index only) ---------- */
  const pre=$('#preloader');
  function revealHero(){
    $$('.hero .kinetic, .page-hero .kinetic').forEach(el=> el.classList.add('in'));
    $$('.hero [data-reveal], .page-hero [data-reveal]').forEach(el=> el.classList.add('in'));
    $$('.hero-skyline .sb').forEach((b,i)=>{ b.style.transformBox='fill-box'; b.style.transformOrigin='bottom';
      if(reduce) return;
      b.animate([{transform:'scaleY(0)'},{transform:'scaleY(1)'}],
        {duration:900,delay:120+i*22,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'}); });
  }
  if(pre){
    const bar=$('#preBar'), count=$('#preCount'), word=$('#preWord'), curtain=$('#curtain');
    if(word){ word.innerHTML=word.textContent.split('').map(ch=> ch===' '
      ? '<span class="l" style="width:.4em"> </span>' : `<span class="l">${ch}</span>`).join(''); }
    const letters=$$('.l',word);
    function finish(){ if(document.body.classList.contains('loaded')) return;
      document.body.classList.add('loaded');
      pre.animate([{opacity:1},{opacity:0}],{duration:500,easing:'ease',fill:'forwards'});
      $$('#curtain span').forEach((s,i)=> s.animate([{transform:'translateY(0)'},{transform:'translateY(-100%)'}],
        {duration:850,delay:i*70,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'}));
      setTimeout(()=>{ pre.style.display='none'; if(curtain)curtain.style.display='none'; revealHero(); },1000);
    }
    if(reduce){ pre.style.display='none'; if(curtain)curtain.style.display='none'; revealHero(); }
    else {
      letters.forEach((l,i)=> l.animate([{transform:'translateY(120%)',opacity:0},{transform:'translateY(0)',opacity:1}],
        {duration:600,delay:1100+i*26,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'}));
      let p=0; const tick=()=>{ p+=Math.max(1,(100-p)*0.055); if(p>=100)p=100;
        if(bar)bar.style.width=p+'%'; if(count)count.textContent=String(Math.round(p)).padStart(3,'0');
        if(p<100) requestAnimationFrame(tick); else setTimeout(finish,340); };
      setTimeout(()=>requestAnimationFrame(tick),900);
      setTimeout(finish,3500); // hard safety
    }
  } else { revealHero(); }

  /* ---------- nav + progress + active link ---------- */
  const nav=$('#nav'), prog=$('#scrollProg');
  function onScroll(){ const y=window.scrollY;
    if(nav) nav.classList.toggle('scrolled', y>40);
    const dh=document.documentElement.scrollHeight-window.innerHeight;
    if(prog) prog.style.width=(dh>0?(y/dh*100):0)+'%'; }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
  (function(){ const path=(location.pathname.split('/').pop()||'index.html');
    $$('.nav-links a, .menu a').forEach(a=>{ const href=a.getAttribute('href')||'';
      if(href===path || (path==='index.html' && (href==='index.html'||href==='./'))) a.classList.add('active'); });
  })();

  /* ---------- mobile menu ---------- */
  const burger=$('#burger'), menu=$('#menu');
  if(burger) burger.addEventListener('click', ()=> document.body.classList.toggle('menu-open'));
  if(menu) $$('a',menu).forEach(a=> a.addEventListener('click', ()=> document.body.classList.remove('menu-open')));

  /* ---------- scroll reveal ---------- */
  const io=new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){
    e.target.classList.add('in'); io.unobserve(e.target); } }); },
    {threshold:0.15, rootMargin:'0px 0px -80px 0px'});
  $$('[data-reveal]').forEach(el=>{ if(!el.closest('.hero')&&!el.closest('.page-hero')) io.observe(el); });
  $$('.kinetic, .chars').forEach(el=>{ if(!el.closest('.hero')&&!el.closest('.page-hero')) io.observe(el); });
  if(reduce) $$('[data-reveal],.kinetic,.chars').forEach(el=> el.classList.add('in'));

  /* Safety net: anything already in/above the viewport on load reveals
     immediately, and a hard timeout reveals everything so content can
     never stay invisible if the observer misfires. */
  function revealIfSeen(){ $$('[data-reveal],.kinetic,.chars').forEach(el=>{
    if(el.classList.contains('in')) return;
    if(el.closest('.hero')||el.closest('.page-hero')) return;
    const r=el.getBoundingClientRect();
    if(r.top < window.innerHeight*0.92){ el.classList.add('in'); io.unobserve(el); }
  }); }
  window.addEventListener('load', revealIfSeen);
  revealIfSeen();
  setTimeout(()=> $$('[data-reveal],.kinetic,.chars').forEach(el=> el.classList.add('in')), 2600);

  /* ---------- counters + bars ---------- */
  const cio=new IntersectionObserver((es)=>{ es.forEach(e=>{ if(!e.isIntersecting) return; cio.unobserve(e.target);
    $$('[data-count]', e.target).forEach(el=>{ if(el.hasAttribute('data-plain')) return;
      const target=+el.getAttribute('data-count'), dur=1800, t0=performance.now();
      const step=(t)=>{ const p=clamp((t-t0)/dur,0,1), eased=1-Math.pow(1-p,3);
        el.textContent=Math.round(target*eased); if(p<1) requestAnimationFrame(step); };
      requestAnimationFrame(step); });
    $$('[data-bar]', e.target).forEach(el=> setTimeout(()=> el.style.width=el.getAttribute('data-bar')+'%',120));
  }); },{threshold:0.4});
  $$('[data-counter]').forEach(s=> cio.observe(s));

  /* ---------- marquee (velocity + reverse) ---------- */
  $$('[data-marquee]').forEach(m=>{
    const track=$('.marquee-track',m); const base=track.firstElementChild;
    const need=Math.ceil((window.innerWidth*2)/base.offsetWidth)+1;
    for(let i=0;i<need;i++) track.appendChild(base.cloneNode(true));
    const unit=base.offsetWidth; let x=0, vel=0, ly=window.scrollY;
    const speed=parseFloat(m.getAttribute('data-speed'))||0.6;
    function loop(){ x-=speed+vel; vel*=0.92;
      if(x<=-unit) x+=unit; if(x>0) x-=unit; track.style.transform=`translateX(${x}px)`; requestAnimationFrame(loop); }
    if(!reduce) loop();
    window.addEventListener('scroll', ()=>{ const dy=window.scrollY-ly; ly=window.scrollY;
      vel=dy*0.05*(speed>0?1:-1); }, {passive:true});
  });

  /* ---------- parallax ---------- */
  const px=$$('[data-parallax]').map(el=>({el, s:parseFloat(el.getAttribute('data-parallax'))||0.12,
    base:parseFloat(el.getAttribute('data-base'))||1}));
  let ticking=false;
  function parallax(){ ticking=false; const vh=innerHeight;
    px.forEach(p=>{ const host=p.el.closest('section,.hero,.page-hero')||p.el;
      const r=host.getBoundingClientRect(); const off=((r.top+r.height/2)-vh/2)/vh;
      const mv=-off*p.s*vh;
      p.el.style.transform= p.base!==1 ? `scale(${p.base}) translateY(${mv/p.base}px)` : `translateY(${mv}px)`; });
  }
  window.addEventListener('scroll', ()=>{ if(!ticking&&!reduce){ ticking=true; requestAnimationFrame(parallax); } }, {passive:true});
  if(!reduce) parallax();

  /* ---------- magnetic ---------- */
  if(!isTouch && !reduce){ $$('.mag').forEach(el=>{ let rx=0,ry=0,tx=0,ty=0,raf=null;
    function run(){ if(raf) return; const a=()=>{ tx=lerp(tx,rx,0.2); ty=lerp(ty,ry,0.2);
      el.style.transform=`translate(${tx}px,${ty}px)`;
      if(Math.abs(tx-rx)>0.3||Math.abs(ty-ry)>0.3) raf=requestAnimationFrame(a);
      else { el.style.transform=`translate(${rx}px,${ry}px)`; raf=null; } }; raf=requestAnimationFrame(a); }
    el.addEventListener('mousemove', e=>{ const r=el.getBoundingClientRect();
      rx=(e.clientX-(r.left+r.width/2))*0.35; ry=(e.clientY-(r.top+r.height/2))*0.35; run(); });
    el.addEventListener('mouseleave', ()=>{ rx=0; ry=0; run(); });
  }); }

  /* ---------- 3D tilt + shine ---------- */
  if(!isTouch && !reduce){ $$('[data-tilt]').forEach(card=>{
    const max= card.hasAttribute('data-tilt-soft')?5:8; const shine=$('.shine',card);
    card.addEventListener('mousemove', e=>{ const r=card.getBoundingClientRect();
      const px2=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
      card.style.transform=`perspective(1000px) rotateX(${(0.5-py)*max*2}deg) rotateY(${(px2-0.5)*max*2}deg)`;
      if(shine){ shine.style.left=px2*100+'%'; shine.style.top=py*100+'%'; } });
    card.addEventListener('mouseleave', ()=>{ card.style.transform='perspective(1000px) rotateX(0) rotateY(0)'; });
  }); }

  /* ---------- custom cursor ---------- */
  if(!isTouch && !reduce){ const cur=$('#cursor'), dot=$('#cursorDot');
    if(cur && dot){ let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
      window.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY;
        dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`; });
      (function r(){ cx=lerp(cx,mx,0.18); cy=lerp(cy,my,0.18);
        cur.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(r); })();
      const hot='a,button,[data-cursor],.svc,.member,.cert,.why-card,.commit,input,textarea,select';
      document.addEventListener('mouseover', e=>{ if(e.target.closest(hot)) cur.classList.add('hot'); });
      document.addEventListener('mouseout', e=>{ if(e.target.closest(hot)&&!e.relatedTarget?.closest?.(hot)) cur.classList.remove('hot'); });
    }
  }

  /* ---------- service rows — tap-to-expand on touch ---------- */
  $$('.svc').forEach(svc=>{
    svc.addEventListener('click', ()=>{
      const wasActive=svc.classList.contains('active');
      $$('.svc').forEach(s=>s.classList.remove('active'));
      if(!wasActive) svc.classList.add('active');
    });
  });

  /* ---------- contact form ---------- */
  const form=$('#cform');
  if(form){ $$('select',form).forEach(s=>{ const sync=()=> s.parentElement.classList.toggle('filled', !!s.value); s.addEventListener('change',sync); sync(); });
    form.addEventListener('submit', async e=>{ e.preventDefault();
      const req=$$('[required]',form); let ok=true;
      req.forEach(f=>{ if(!f.value.trim()){ ok=false; f.style.borderColor='#c0392b'; setTimeout(()=>f.style.borderColor='',1600); } });
      if(!ok) return;
      const btn=form.querySelector('[type="submit"]');
      const origText=btn ? btn.textContent : '';
      if(btn){ btn.disabled=true; btn.textContent='Sending...'; }
      try {
        const res=await fetch('/api/send-email',{ method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            name: (document.getElementById('f-name')||{}).value||'',
            org:  (document.getElementById('f-org')||{}).value||'',
            email:(document.getElementById('f-email')||{}).value||'',
            phone:(document.getElementById('f-phone')||{}).value||'',
            service:(document.getElementById('f-svc')||{}).value||'',
            message:(document.getElementById('f-msg')||{}).value||''
          })
        });
        if(res.ok){
          if(btn){ btn.disabled=false; btn.textContent=origText; }
          const okEl=$('#formOk'); if(okEl) okEl.classList.add('show');
          form.querySelectorAll('input,textarea,select').forEach(f=>{ f.value=''; f.parentElement.classList.remove('filled'); });
          setTimeout(()=>{ if(okEl) okEl.classList.remove('show'); },6000);
        } else {
          if(btn){ btn.disabled=false; btn.textContent=origText; }
          const errP=document.createElement('p');
          errP.style.cssText='color:#c0392b;margin-top:.75rem;font-size:.9rem;';
          errP.textContent='Something went wrong. Please try again or call us on 036 004 0024.';
          btn ? btn.insertAdjacentElement('afterend',errP) : form.appendChild(errP);
          setTimeout(()=>{ if(errP.parentNode) errP.parentNode.removeChild(errP); },6000);
        }
      } catch(_){
        if(btn){ btn.disabled=false; btn.textContent=origText; }
        const errP=document.createElement('p');
        errP.style.cssText='color:#c0392b;margin-top:.75rem;font-size:.9rem;';
        errP.textContent='Something went wrong. Please try again or call us on 036 004 0024.';
        btn ? btn.insertAdjacentElement('afterend',errP) : form.appendChild(errP);
        setTimeout(()=>{ if(errP.parentNode) errP.parentNode.removeChild(errP); },6000);
      }
    });
  }

  /* ---------- smooth anchors ---------- */
  $$('a[href^="#"]').forEach(a=> a.addEventListener('click', e=>{ const id=a.getAttribute('href');
    if(id.length<2) return; const t=document.querySelector(id); if(!t) return; e.preventDefault();
    window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-58, behavior:reduce?'auto':'smooth'}); }));

  /* ---------- page transitions ---------- */
  const fade=$('#pageFade');
  if(fade && !reduce){
    $$('a[href]').forEach(a=>{ const href=a.getAttribute('href');
      if(!href || !href.endsWith('.html')) return;
      if(a.target==='_blank') return;
      a.addEventListener('click', e=>{ if(e.metaKey||e.ctrlKey||e.shiftKey) return;
        e.preventDefault(); fade.classList.add('show');
        if(prog){ prog.style.transition='width .45s linear'; prog.style.width='100%'; }
        setTimeout(()=>{ location.href=href; }, 460); });
    });
    window.addEventListener('pageshow', e=>{ if(e.persisted){ fade.classList.remove('show'); document.body.classList.add('page-ready'); } });
  }

})();
