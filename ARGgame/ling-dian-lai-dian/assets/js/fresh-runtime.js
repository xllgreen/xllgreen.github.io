(()=>{
'use strict';

const NativeAudio=window.Audio;
const NativeImage=window.Image;
const metaTheme=document.querySelector('meta[name="theme-color"]');

/*
 * 进入案件时原版 resourceCheck 会同时解码多段 WAV 与多张图片。
 * 在 http(s) 部署环境中，将这一次“是否存在”的自检临时改为限并发 HEAD，
 * 真正的声音播放仍使用浏览器原生 Audio；file:// 本地运行保持原逻辑。
 */
const probeQueue=[];
let probeActive=0;
const PROBE_LIMIT=4;
function pumpProbe(){
  while(probeActive<PROBE_LIMIT&&probeQueue.length){
    const job=probeQueue.shift();
    probeActive++;
    fetch(job.url,{method:'HEAD',cache:'no-store'})
      .then(r=>{if(!r.ok)throw new Error(String(r.status));job.ok();})
      .catch(job.fail)
      .finally(()=>{probeActive--;pumpProbe();});
  }
}
function makeProbe(successKey){
  const obj={onerror:null,onload:null,oncanplaythrough:null,_src:''};
  Object.defineProperty(obj,'src',{
    get(){return obj._src;},
    set(v){
      obj._src=String(v||'');
      if(!obj._src)return;
      probeQueue.push({
        url:obj._src,
        ok:()=>{const fn=obj[successKey];if(typeof fn==='function')queueMicrotask(()=>fn.call(obj));},
        fail:()=>{if(typeof obj.onerror==='function')queueMicrotask(()=>obj.onerror.call(obj));}
      });
      pumpProbe();
    }
  });
  return obj;
}
function patchResourceConstructors(){
  if(!/^https?:$/.test(location.protocol))return ()=>{};
  function ProbeAudio(src){
    if(arguments.length&&src)return new NativeAudio(src);
    return makeProbe('oncanplaythrough');
  }
  function ProbeImage(w,h){
    if(arguments.length)return new NativeImage(w,h);
    return makeProbe('onload');
  }
  ProbeAudio.prototype=NativeAudio.prototype;
  ProbeImage.prototype=NativeImage.prototype;
  window.Audio=ProbeAudio;
  window.Image=ProbeImage;
  return ()=>{window.Audio=NativeAudio;window.Image=NativeImage;};
}
document.addEventListener('click',e=>{
  const exportBtn=e.target.closest?.('#saveBtn,[data-act2="export"]');
  if(exportBtn){
    const nativeClick=HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click=function(){
      if(this.download==='零点来电_调查存档_v2.3.json')this.download='零点来电_调查存档_v3.2.1.json';
      return nativeClick.call(this);
    };
    setTimeout(()=>{HTMLAnchorElement.prototype.click=nativeClick;},0);
  }
},true);

/* 进入游戏的资源自检改为轻量存在性探测。 */
document.addEventListener('click',e=>{
  const target=e.target.closest?.('[data-act="new"],[data-act="continue"]');
  if(!target)return;
  const restore=patchResourceConstructors();
  setTimeout(restore,0);
},true);

function isLowPower(){
  const cores=Number(navigator.hardwareConcurrency||8);
  const mem=Number(navigator.deviceMemory||8);
  return cores<=4||mem<=4||matchMedia('(prefers-reduced-motion: reduce)').matches;
}
if(isLowPower())document.documentElement.classList.add('low-power');

function updateTheme(){
  if(!metaTheme)return;
  const site=document.querySelector('#game')?.dataset.site||'desk';
  metaTheme.setAttribute('content',['tower','phone'].includes(site)?'#0d0f0c':'#eef2f5');
}

function enhanceRenderedView(){
  const view=document.querySelector('#view');
  if(!view)return;
  view.querySelectorAll('img').forEach(img=>{
    if(!img.closest('.home-hero'))img.loading='lazy';
    img.decoding='async';
    if(!img.closest('.hero-panel'))img.fetchPriority='low';
  });
  view.querySelectorAll('button').forEach(b=>{if(!b.getAttribute('type'))b.type='button';});
  view.querySelectorAll('input,textarea').forEach(el=>{
    if(!el.getAttribute('aria-label')){
      const label=el.closest('label')?.querySelector('span')?.textContent?.trim();
      const placeholder=el.getAttribute('placeholder');
      if(label||placeholder)el.setAttribute('aria-label',label||placeholder);
    }
  });
}

function enhanceStatic(){
  const progress=document.querySelector('.progress>div[role="progressbar"]');
  const bar=document.querySelector('#progressBar');
  if(progress&&bar){
    const sync=()=>progress.setAttribute('aria-valuenow',String(Math.max(0,Math.min(100,parseFloat(bar.style.width)||0))));
    new MutationObserver(sync).observe(bar,{attributes:true,attributeFilter:['style']});
    sync();
  }
  document.querySelectorAll('.topnav button,.header-actions button,.boot-actions button').forEach(b=>{if(!b.type)b.type='button';});
  enhanceRenderedView();
  updateTheme();
}

const view=document.querySelector('#view');
if(view){
  let raf=0;
  new MutationObserver(()=>{
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{enhanceRenderedView();updateTheme();});
  }).observe(view,{childList:true});
}
const game=document.querySelector('#game');
if(game)new MutationObserver(updateTheme).observe(game,{attributes:true,attributeFilter:['data-site']});

/* 弹窗键盘兜底：Esc 关闭，打开时聚焦第一个可操作控件。 */
document.addEventListener('keydown',e=>{
  const modal=document.querySelector('#modal');
  if(!modal||modal.classList.contains('hidden'))return;
  if(e.key==='Escape'){
    modal.classList.add('hidden');
    return;
  }
  if(e.key==='Tab'){
    const focusable=[...modal.querySelectorAll('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href]')].filter(x=>x.offsetParent!==null);
    if(!focusable.length)return;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
});
const modal=document.querySelector('#modal');
if(modal){
  new MutationObserver(()=>{
    if(!modal.classList.contains('hidden'))requestAnimationFrame(()=>modal.querySelector('button:not(:disabled),input:not(:disabled),textarea:not(:disabled)')?.focus());
  }).observe(modal,{attributes:true,attributeFilter:['class']});
}

/* Ctrl/Cmd+K 在当前页面有搜索框时直接定位，避免长论坛/缓存页重复翻找。 */
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
    const input=document.querySelector('#view .search input,#view input[type="search"],#view #fq');
    if(input){e.preventDefault();input.focus();input.select?.();}
  }
});

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhanceStatic,{once:true});
else enhanceStatic();
})();
