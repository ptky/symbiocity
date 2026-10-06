(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  let current = 0;
  const el = id => document.getElementById(id);
  function go(index, changeHash = true) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {slide.hidden = i !== current; if(i === current) slide.scrollTop = 0;});
    el('slide-number').textContent = String(current + 1).padStart(2,'0') + ' / ' + String(slides.length).padStart(2,'0');
    el('previous-button').disabled = current === 0;
    el('next-button').disabled = current === slides.length - 1;
    document.querySelectorAll('#progress-dots button').forEach((button,i) => {button.classList.toggle('active',i===current);button.setAttribute('aria-current',i===current?'step':'false');});
    if(changeHash) history.replaceState(null,'','#' + (current + 1));
  }
  slides.forEach((slide,i)=>{
    const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label',(i+1)+'. dia: '+(window.SLIDES[i]?.title||''));dot.onclick=()=>go(i);el('progress-dots').append(dot);
    const jump=document.createElement('button');jump.type='button';const num=document.createElement('span');num.textContent=String(i+1).padStart(2,'0');jump.append(num,document.createTextNode(window.SLIDES[i]?.title||''));jump.onclick=()=>{go(i);el('index-dialog').close();};el('slide-index').append(jump);
  });
  el('previous-button').onclick=()=>go(current-1);el('next-button').onclick=()=>go(current+1);
  el('index-button').onclick=()=>el('index-dialog').showModal();el('extras-button').onclick=()=>el('extras-dialog').showModal();
  document.querySelectorAll('[data-close]').forEach(button=>button.onclick=()=>button.closest('dialog').close());
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}}));
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else{el('fullscreen-button').textContent='Böngésző teljes képernyő';el('fullscreen-button').title='Használd a böngésző teljes képernyős módját.';}}catch{el('fullscreen-button').textContent='Böngésző teljes képernyő';}}
  el('fullscreen-button').onclick=fullscreen;
  document.addEventListener('fullscreenchange',()=>el('fullscreen-button').textContent=document.fullscreenElement?'Kilépés':'Teljes képernyő');
  window.addEventListener('hashchange',()=>{const n=Number(location.hash.slice(1));if(Number.isInteger(n)&&n>=1&&n<=slides.length)go(n-1,false);});
  document.addEventListener('keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey||event.target.matches('input,textarea,select')||document.querySelector('dialog[open]'))return;
    if(['ArrowRight','PageDown','ArrowLeft','PageUp','Home','End',' '].includes(event.key)){
      if(event.target.closest('button,a')&&event.key===' ')return;
      event.preventDefault();
      if(['ArrowRight','PageDown',' '].includes(event.key))go(current+1);
      else if(['ArrowLeft','PageUp'].includes(event.key))go(current-1);
      else go(event.key==='Home'?0:slides.length-1);
    }
    if(event.key.toLowerCase()==='f')fullscreen();if(event.key.toLowerCase()==='g')el('index-dialog').showModal();if(event.key.toLowerCase()==='s')el('extras-dialog').showModal();
  });
  let touchStart=null;
  el('deck').addEventListener('touchstart',event=>{if(event.touches.length===1)touchStart={x:event.touches[0].clientX,y:event.touches[0].clientY};},{passive:true});
  el('deck').addEventListener('touchend',event=>{if(!touchStart)return;const t=event.changedTouches[0],dx=t.clientX-touchStart.x,dy=t.clientY-touchStart.y;if(Math.abs(dx)>80&&Math.abs(dx)>Math.abs(dy)*2)go(current+(dx<0?1:-1));touchStart=null;},{passive:true});
  const extras=el('extras-content');
  const disclosure=document.createElement('p');disclosure.className='disclosure';disclosure.textContent='Iskolai koncepció. A képek látványtervek, nem valós budapesti állapotfelvételek. A költségvetés szemléltető becslés; a megtakarítások és a zéró emisszió tervezési célok, mérésre és részletes vizsgálatra várnak.';extras.append(disclosure);
  const stitle=document.createElement('h3');stitle.textContent='Források';extras.append(stitle);const list=document.createElement('ul');
  window.SOURCES.forEach(source=>{const li=document.createElement('li');if(source.url){const a=document.createElement('a');a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=source.title;li.append(a);}else li.textContent=source.title;if(source.note){li.append(document.createTextNode(' — '+source.note));}list.append(li);});extras.append(list);
  const hash=Number(location.hash.slice(1));go(Number.isInteger(hash)&&hash>=1&&hash<=slides.length?hash-1:0,false);
})();
