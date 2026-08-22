/**
 * 自愿打赏系统：沿用《松涛粮站》的纯前端 localStorage / sessionStorage / Cookie 宽松记录方式。
 * 玩家可关闭或“下次一定”，不会阻断游戏；点击“已完成支持”只记录本机不再重复弹出。
 */
const Paywall={
  STORAGE_KEY:'_twilight_photo_studio_support',SESSION_KEY:'_twilight_photo_studio_session',COOKIE_KEY:'_twilight_photo_pay_flag',
  hasPaid(){try{return!!(localStorage.getItem(this.STORAGE_KEY)||sessionStorage.getItem(this.SESSION_KEY)||this._getCookie(this.COOKIE_KEY))}catch(e){return false}},
  markPaid(){const t=this._generateToken();try{localStorage.setItem(this.STORAGE_KEY,t);sessionStorage.setItem(this.SESSION_KEY,t);this._setCookie(this.COOKIE_KEY,t,365)}catch(e){}},
  _generateToken(){const raw=`${Date.now()}_${Math.random().toString(36).slice(2,10)}_abc_studio`;try{return btoa(raw)}catch(e){return raw}},
  _setCookie(n,v,d){const x=new Date(Date.now()+d*86400000);document.cookie=`${n}=${v};expires=${x.toUTCString()};path=/;SameSite=Lax`},
  _getCookie(n){const p=n+'=';for(const c of document.cookie.split(';')){const s=c.trim();if(s.startsWith(p))return s.slice(p.length)}return''},
  show(config={}){if(this.hasPaid()&&config.force!==true)return;const old=document.getElementById('paywall-overlay');if(old){old.style.display='flex';requestAnimationFrame(()=>old.classList.add('paywall-show'));return}this._createOverlay(config)},
  hide(){const o=document.getElementById('paywall-overlay');if(!o)return;o.classList.add('paywall-closing');o.classList.remove('paywall-show');setTimeout(()=>{o.style.display='none';o.classList.remove('paywall-closing')},350)},
  _onSupport(){this.markPaid();this.hide();this._showThanks()},
  _showThanks(){const t=document.createElement('div');t.className='paywall-toast';t.textContent='谢谢你为暗房添了一点光。愿这张照片也温暖你。';document.body.appendChild(t);setTimeout(()=>t.classList.add('show'),30);setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),350)},3000)},
  _createOverlay(config){const cfg=Object.assign({qrCode:'assets/paycode.png',price:'1元',title:'支持《暮光照相馆》',studio:'abc studio'},config||{});document.body.insertAdjacentHTML('beforeend',`<div class="paywall-overlay" id="paywall-overlay"><div class="paywall-card"><button class="paywall-close" onclick="Paywall.hide()" aria-label="关闭">×</button><div class="paywall-card-inner"><div class="paywall-title-row"><span class="paywall-heart">♡</span><span class="paywall-title">${cfg.title}</span><span class="paywall-heart">♡</span></div><div class="paywall-subtitle">${cfg.price} 自愿打赏 · 不影响继续游玩</div><div class="paywall-body"><div class="paywall-qr-wrapper"><img src="${cfg.qrCode}" alt="支付宝1元收款码" class="paywall-qr-img"></div><div class="paywall-qr-tip">请使用支付宝扫码支持 ${cfg.price}</div><div class="paywall-message"><p class="paywall-msg-warm">你好，我是 abc studio 的独立开发者。</p><p class="paywall-msg-body">这间旧照相馆里的暮光、胶片和谜题，都是一点点打磨出来的。<br>如果你在某个故事里感到了一丝安慰，愿意支持 <strong>1元</strong>，就是我继续创作的动力。</p><p class="paywall-msg-cute">一元买不到一卷胶片，却能让暗房再亮一个傍晚。</p><p class="paywall-msg-warm2">不扫码也可以关闭窗口继续游戏，感谢你愿意来看完这些旧照片。</p></div></div><div class="paywall-footer"><div class="paywall-hint">💡 本作使用本地浏览器记录；清除浏览器数据后可能再次显示支持窗口。</div><div class="paywall-btns"><button class="paywall-btn paywall-btn-support" onclick="Paywall._onSupport()">已完成支持 ♡</button><button class="paywall-btn paywall-btn-later" onclick="Paywall.hide()">下次一定</button></div></div><div class="paywall-studio">${cfg.studio}</div></div></div></div>`);requestAnimationFrame(()=>document.getElementById('paywall-overlay')?.classList.add('paywall-show'))}
};
window.Paywall=Paywall;
