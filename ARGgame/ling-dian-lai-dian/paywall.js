(()=>{
'use strict';

const Paywall={
  STORAGE_KEY:'_zero_call_support',
  SESSION_KEY:'_zero_call_support_session',
  COOKIE_KEY:'_zero_call_support_flag',
  AUTO_KEY:'_zero_call_support_auto_shown_v1',
  config:{qrCode:'paycode.png',price:'1元',title:'支持《零点来电》',studio:'abc studio'},
  hasPaid(){
    try{return !!(localStorage.getItem(this.STORAGE_KEY)||sessionStorage.getItem(this.SESSION_KEY)||this._getCookie(this.COOKIE_KEY));}catch(e){return false;}
  },
  markPaid(){
    const token=this._generateToken();
    try{localStorage.setItem(this.STORAGE_KEY,token);}catch(e){}
    try{sessionStorage.setItem(this.SESSION_KEY,token);}catch(e){}
    try{this._setCookie(this.COOKIE_KEY,token,365);}catch(e){}
  },
  _generateToken(){
    const raw=`${Date.now()}_${Math.random().toString(36).slice(2,10)}_zero_call`;
    try{return btoa(raw);}catch(e){return raw;}
  },
  _setCookie(name,value,days){const d=new Date(Date.now()+days*86400000);document.cookie=`${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;},
  _getCookie(name){const key=name+'=';return document.cookie.split(';').map(x=>x.trim()).find(x=>x.startsWith(key))?.slice(key.length)||'';},
  show(config={}){
    if(this.hasPaid()){this._showThanks('已经记录过你的支持，谢谢你。');return;}
    this.config=Object.assign({},this.config,config||{});
    let overlay=document.getElementById('paywall-overlay');
    if(!overlay){this._createOverlay();overlay=document.getElementById('paywall-overlay');}
    if(!overlay)return;
    overlay.hidden=false;overlay.classList.remove('paywall-closing');
    requestAnimationFrame(()=>requestAnimationFrame(()=>overlay.classList.add('paywall-show')));
    document.documentElement.classList.add('paywall-open');
    setTimeout(()=>overlay.querySelector('.paywall-close')?.focus(),50);
  },
  hide(){
    const overlay=document.getElementById('paywall-overlay');if(!overlay)return;
    overlay.classList.add('paywall-closing');overlay.classList.remove('paywall-show');
    document.documentElement.classList.remove('paywall-open');
    setTimeout(()=>{overlay.hidden=true;overlay.classList.remove('paywall-closing');},260);
  },
  support(){this.markPaid();this.hide();this._showThanks('感谢你的支持！让档案室的夜班灯再亮一会儿。');},
  _showThanks(text){
    const old=document.querySelector('.paywall-toast');old?.remove();
    const toast=document.createElement('div');toast.className='paywall-toast';toast.textContent=text||'感谢支持！';document.body.appendChild(toast);
    requestAnimationFrame(()=>toast.classList.add('show'));setTimeout(()=>{toast.classList.remove('show');setTimeout(()=>toast.remove(),260);},3000);
  },
  _createOverlay(){
    const c=this.config;
    const wrap=document.createElement('div');wrap.id='paywall-overlay';wrap.className='paywall-overlay';wrap.hidden=true;wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-label','支持作者');
    wrap.innerHTML=`<div class="paywall-card"><button class="paywall-close" type="button" aria-label="关闭支持窗口">×</button><div class="paywall-card-inner"><div class="paywall-header"><div class="paywall-title-row"><span class="paywall-heart">♡</span><span class="paywall-title">${c.title}</span><span class="paywall-heart">♡</span></div><div class="paywall-subtitle">${c.price} 自愿支持 · 不影响任何游戏内容</div></div><div class="paywall-body"><div class="paywall-qr-wrapper"><img src="${c.qrCode}" alt="1元支持收款码" class="paywall-qr-img"><div class="paywall-qr-glow"></div></div><div class="paywall-qr-tip">请使用支持该收款码的扫码工具，自愿支持 ${c.price}</div><div class="paywall-message"><p class="paywall-msg-warm">你好，我是 ${c.studio} 的独立开发者。</p><p class="paywall-msg-body">《零点来电》里的广播档案、旧网页、人物材料和推理链都花了不少时间反复调整。<br>如果这段雨夜调查让你觉得值得，愿意支持 <strong>1元</strong>，会给后续作品很直接的鼓励。</p><p class="paywall-msg-cute">1块钱买不到一杯咖啡，但能让档案室的夜班灯再亮一会儿。</p><p class="paywall-msg-warm2">完全自愿。关闭窗口不会锁内容、不会减少提示，也不会影响结局。</p></div></div><div class="paywall-footer"><div class="paywall-hint"><span>💡</span><span>自动提示只出现一次；以后仍可从顶部“支持作者 1元”手动打开。</span></div><div class="paywall-btns"><button class="paywall-btn paywall-btn-support" type="button">已完成支持 ♡</button><button class="paywall-btn paywall-btn-later" type="button">下次一定</button></div><div class="paywall-studio">${c.studio}</div></div></div></div>`;
    document.body.appendChild(wrap);
    wrap.querySelector('.paywall-close').onclick=()=>this.hide();
    wrap.querySelector('.paywall-btn-later').onclick=()=>this.hide();
    wrap.querySelector('.paywall-btn-support').onclick=()=>this.support();
    wrap.addEventListener('click',e=>{if(e.target===wrap)this.hide();});
  },
  autoOnce(){
    if(this.hasPaid())return;
    try{if(localStorage.getItem(this.AUTO_KEY))return;}catch(e){}
    let attempts=0;
    const tryShow=()=>{
      attempts++;
      if(this.hasPaid())return;
      const game=document.getElementById('game');const modal=document.getElementById('modal');
      /* 不和开场说明 / 线索弹窗抢层级。只有真正显示时才写入“已自动弹过”，
       * 避免页面切换太快导致本轮自动提示被永久吃掉。 */
      if(!game||game.classList.contains('hidden')){if(attempts<180)setTimeout(tryShow,500);return;}
      if(modal&&!modal.classList.contains('hidden')){if(attempts<180)setTimeout(tryShow,500);return;}
      try{localStorage.setItem(this.AUTO_KEY,String(Date.now()));}catch(e){}
      this.show();
    };
    setTimeout(tryShow,3000);
  }
};
window.Paywall=Paywall;

const supportBtn=document.getElementById('supportBtn');
if(supportBtn)supportBtn.addEventListener('click',()=>Paywall.show());

document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-act="new"],[data-act="continue"]');if(!b)return;
  if(b.dataset.act==='continue'&&b.disabled)return;
  setTimeout(()=>Paywall.autoOnce(),0);
},true);

document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.getElementById('paywall-overlay')?.hidden)Paywall.hide();});
})();
