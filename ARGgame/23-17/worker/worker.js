const ALLOWED_ORIGINS = new Set([
  "https://mike798-cloud.github.io",
  // "https://你的自定义域名.com",
]);
const ACTIONS=["INSPECT","MOVE","TALK","CALL","MESSAGE","USE","PLACE","HIDE","FOLLOW","WAIT","TEST","INFER","UNSUPPORTED"];
function cors(origin){return{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type","Access-Control-Max-Age":"86400","Vary":"Origin"}}
function cleanContext(v){const o=v&&typeof v==='object'?v:{};const time=typeof o.time==='string'?o.time.slice(0,5):'22:47';const location=typeof o.location==='string'?o.location.slice(0,32):'FOYER';const knowledge=Array.isArray(o.knowledge)?o.knowledge.filter(x=>typeof x==='string').slice(0,20).map(x=>x.slice(0,40)):[];const loop=Math.max(1,Math.min(999,Number(o.loop)||1));return{time,location,knowledge,loop}}
export default {async fetch(request,env){const url=new URL(request.url),origin=request.headers.get("Origin")||"",allowed=ALLOWED_ORIGINS.has(origin);if(request.method==="OPTIONS")return new Response(null,{status:allowed?204:403,headers:allowed?cors(origin):{}});if(url.pathname!=="/action")return Response.json({error:"Not Found"},{status:404});if(request.method!=="POST")return Response.json({error:"Method Not Allowed"},{status:405});if(!allowed)return Response.json({error:"Origin not allowed"},{status:403});try{const len=Number(request.headers.get('content-length')||0);if(len>4096)return Response.json({error:'Payload too large'},{status:413,headers:cors(origin)});const body=await request.json(),text=typeof body.text==='string'?body.text.trim():'';if(!text||text.length>240)return Response.json({error:'Invalid player input'},{status:400,headers:cors(origin)});const visibleContext=cleanContext(body.visibleContext);if(env.RATE_LIMITER){const r=await env.RATE_LIMITER.limit({key:request.headers.get('CF-Connecting-IP')||'unknown'});if(!r.success)return Response.json({error:'Too Many Requests'},{status:429,headers:cors(origin)})}
const schema={type:'object',properties:{action:{type:'string',enum:ACTIONS},target:{type:'string',maxLength:40},method:{type:'string',maxLength:160},content:{type:'string',maxLength:240},confidence:{type:'number',minimum:0,maximum:1}},required:['action','target','method','content','confidence'],additionalProperties:false};
const prompt=`你是网页悬疑游戏《23:17》的玩家行动解析器。你唯一的职责是把玩家中文转换成标准行动JSON。绝不推进剧情、编造线索、判断成功失败、暴露真相或决定NPC行为。
动作：INSPECT观察/搜索，MOVE移动，TALK当面交谈/敲门问人，CALL打电话，MESSAGE发消息，USE使用物品/录音录像，PLACE布置/堵门，HIDE躲藏/蹲守，FOLLOW跟踪，WAIT等待，TEST试探/撒谎/套话/设局，INFER提交推理，UNSUPPORTED无法执行。
地点：FOYER,LIVING,BEDROOM,KITCHEN,BATHROOM,ROOM_704,CORRIDOR_7F,STAIRCASE,ELEVATOR,ROOFTOP,LOBBY,PROPERTY_OFFICE,CONVENIENCE_STORE。
人物：ZHOU_YAN,FENG_CHUAN,MAINTENANCE_WORKER,GUARD_ZHAO,DU_COLLEAGUE,POLICE。
对象：DOOR_703,DOOR_704,SMOKE_DETECTOR,PHONE,CAMERA,KEY,EVIDENCE,SCENE。
身份规则：玩家只说“维修工/维修员/修理工/物业师傅”且knowledge不含FENG时，target必须是MAINTENANCE_WORKER；不要偷换成FENG_CHUAN。
虚假报修：如“我假装不知道偷拍视频，骗物业说704漏水，叫维修工过来”，解析为CALL + PROPERTY_OFFICE + FALSE_REPAIR_REPORT。
复合动作：只提取第一个当前可执行的核心动作，其余计划保留在method/content。例如“去一楼等维修工”优先MOVE到LOBBY；“录音并诈维修工说警方拿到证据”优先TEST维修工，method写RECORD_AND_BLUFF。
口语同义：楼顶=天台，小卖部=便利店，修理工/师傅=维修员，敲704门问邻居=TALK ZHOU_YAN，蹲守/埋伏=HIDE，尾随=FOLLOW，诈一下/套话=TEST。
不要因为玩家提到“报警”就把“告诉周妍她会让我报警”解析成CALL POLICE；先识别交流对象。`;
const result=await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast',{messages:[{role:'system',content:prompt},{role:'user',content:JSON.stringify({playerInput:text,visibleContext})}],response_format:{type:'json_schema',json_schema:schema},temperature:.05,max_tokens:220});return Response.json({ok:true,action:result.response},{headers:cors(origin)})}catch(e){console.error(e);return Response.json({ok:false,error:'ACTION_PARSE_FAILED'},{status:500,headers:cors(origin)})}}};
