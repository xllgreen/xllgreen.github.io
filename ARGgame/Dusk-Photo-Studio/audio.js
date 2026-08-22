(function(){
'use strict';
const AudioSys={
 ctx:null,master:null,amb:null,sfx:null,enabled:true,ambNodes:[],started:false,
 init(){if(this.ctx)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;this.ctx=new AC();this.master=this.ctx.createGain();this.amb=this.ctx.createGain();this.sfx=this.ctx.createGain();this.master.gain.value=.45;this.amb.gain.value=.26;this.sfx.gain.value=.55;this.amb.connect(this.master);this.sfx.connect(this.master);this.master.connect(this.ctx.destination)},
 ensure(){this.init();if(this.ctx?.state==='suspended')this.ctx.resume()},
 apply(settings={}){this.enabled=settings.sound!==false;this.ensure();if(!this.ctx)return;const now=this.ctx.currentTime;this.master.gain.setTargetAtTime(this.enabled?Number(settings.master??.55):0,now,.03);this.amb.gain.setTargetAtTime(Number(settings.ambient??.45),now,.03);this.sfx.gain.setTargetAtTime(Number(settings.sfx??.65),now,.03);if(this.enabled)this.startAmbience();else this.stopAmbience()},
 toggle(){this.enabled=!this.enabled;this.apply({...(window.Game?.state?.settings||{}),sound:this.enabled});return this.enabled},
 startAmbience(){this.ensure();if(!this.ctx||this.started||!this.enabled)return;this.started=true;const ctx=this.ctx;
   const rain=ctx.createBufferSource();const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const d=b.getChannelData(0);let last=0;for(let i=0;i<d.length;i++){const w=Math.random()*2-1;last=(last+.025*w)/1.025;d[i]=last*2.1}rain.buffer=b;rain.loop=true;const low=ctx.createBiquadFilter();low.type='lowpass';low.frequency.value=1350;const rg=ctx.createGain();rg.gain.value=.21;rain.connect(low).connect(rg).connect(this.amb);rain.start();
   const hum=ctx.createOscillator();hum.type='sine';hum.frequency.value=72;const hg=ctx.createGain();hg.gain.value=.025;hum.connect(hg).connect(this.amb);hum.start();
   const chime=ctx.createOscillator();chime.type='sine';chime.frequency.value=392;const cg=ctx.createGain();cg.gain.value=.006;chime.connect(cg).connect(this.amb);chime.start();
   this.ambNodes=[rain,hum,chime];
 },
 stopAmbience(){for(const n of this.ambNodes){try{n.stop()}catch(e){}}this.ambNodes=[];this.started=false},
 tone(freq=440,dur=.1,type='sine',gain=.12){if(!this.enabled)return;this.ensure();if(!this.ctx)return;const o=this.ctx.createOscillator(),g=this.ctx.createGain(),now=this.ctx.currentTime;o.type=type;o.frequency.setValueAtTime(freq,now);g.gain.setValueAtTime(.001,now);g.gain.exponentialRampToValueAtTime(gain,now+.015);g.gain.exponentialRampToValueAtTime(.001,now+dur);o.connect(g).connect(this.sfx);o.start(now);o.stop(now+dur+.03)},
 click(){this.tone(620,.055,'triangle',.065)},
 success(){this.tone(523,.13,'sine',.08);setTimeout(()=>this.tone(659,.16,'sine',.08),90);setTimeout(()=>this.tone(784,.22,'sine',.07),185)},
 error(){this.tone(190,.16,'square',.045)},
 paper(){this.tone(310,.07,'triangle',.04);setTimeout(()=>this.tone(350,.06,'triangle',.035),45)},
 bell(){this.tone(880,.28,'sine',.075);setTimeout(()=>this.tone(1320,.4,'sine',.04),70)}
};
window.AudioSys=AudioSys;
document.addEventListener('pointerdown',()=>{AudioSys.ensure();if(AudioSys.enabled)AudioSys.startAmbience()},{once:true});
})();
