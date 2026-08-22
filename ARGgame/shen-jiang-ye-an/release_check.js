'use strict';
const fs=require('fs');
const path=require('path');
const ROOT=__dirname;
const delta=process.argv.includes('--delta');
const fail=[];
const need=f=>{if(!fs.existsSync(path.join(ROOT,f)))fail.push(`missing:${f}`)};
['shen-jiang-ye-an.html','style.css','app.js'].forEach(need);
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
if(fail.length){console.error('RELEASE_CHECK_FAIL',fail.join(' | '));process.exit(1)}
const html=read('shen-jiang-ye-an.html'),app=read('app.js');
const checks=[
  ['build-marker',html.includes('shenjiang-build')&&html.includes('2026-08-14-final-hardening')&&app.includes("APP_REVISION='2026-08-14-final-hardening'")],
  ['no-support-popup',!html.includes('paywall')&&!html.includes('supportBtn')&&!app.includes('Paywall')&&!app.includes('showSupport')&&!app.includes('scheduleAutoSupport')],
  ['study-period-image',app.includes("image:'assets/images/study_gun_glass.jpg'")&&!app.includes("image:'assets/images/scene_study.png'")],
  ['return-time-0031',/E17:\{[^\n]+00:31重新签入/.test(app)&&!/E17:\{[^\n]+00:18重新签入/.test(app)],
  ['phone-chain',app.includes('00:27从公用电话亭')&&app.includes('00:31返编辑部')],
  ['context-hints',app.includes("'1:newsroom'")&&app.includes("'2:switchboard'")&&app.includes("'3:interviews'")&&app.includes("'4:finale'")],
  ['hint-history',app.includes('hintHistory')&&app.includes('回看其他页面已解锁提示')],
  ['photo-audit',app.includes('暗房验片 · 证据边界')&&app.includes('PHOTO_AUDIT_ORDER')],
  ['responsibility-tags',app.includes('责任链 · 四段行为')&&app.includes('responsibility-name')],
  ['review-three',app.includes('.slice(0,3)')&&app.includes('再通过三项随机证据边界复核')],
  ['review-variants',(['phone','alibi','window','motive','newsroom'].every(x=>app.includes(`${x}:{title:'复核任务`)))],
];
for(const [name,ok] of checks)if(!ok)fail.push(name);
if(!delta){
  need('assets/images/scene_newsroom.png');need('assets/images/study_gun_glass.jpg');need('assets/images/scene_switchboard.png');need('assets/images/scene_darkroom.png');
  need('assets/images/interview_fang.jpg');need('assets/images/interview_gu.jpg');need('assets/images/interview_li.jpg');need('assets/images/interview_su.jpg');
  need('assets/audio/rain_room.wav');need('assets/audio/typewriter.wav');need('assets/audio/phone_ring.wav');need('assets/audio/camera_shutter.wav');need('assets/audio/paper.wav');need('assets/audio/stamp.wav');
}
if(fail.length){console.error('RELEASE_CHECK_FAIL',fail.join(' | '));process.exit(1)}
console.log(`RELEASE_CHECK_PASS mode=${delta?'delta':'full'} checks=${checks.length}`);
