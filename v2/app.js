'use strict';
const labels={input:'Input',wilor:'WiLoR',mint:'MINT',v1:'ViDiHand V1',ace:'ACE-Ego-Hand',ours:'ViDiHand V2'};
async function init(){
 const [cases,results]=await Promise.all(['cases','results'].map(async name=>{const r=await fetch(`v2/${name}.json`);if(!r.ok)throw Error('Could not load '+name);return r.json();}));
 const tabs=document.querySelector('#case-tabs');
 function showCase(c,index){
  [...tabs.children].forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index));});
  document.querySelector('#case-caption').textContent=`${c.dataset} · ${c.label} · Frame ${c.frame}`;
  document.querySelector('#gallery').replaceChildren(...Object.entries(labels).map(([key,label])=>{const f=document.createElement('figure'),im=document.createElement('img'),cap=document.createElement('figcaption');im.src=`v2/case-${c.frame}/${key}.jpg`;im.alt=`${label}: ${c.label}, frame ${c.frame}`;im.width=640;im.height=480;cap.textContent=label;f.append(im,cap);return f;}));
 }
 cases.forEach((c,i)=>{const b=document.createElement('button');b.textContent=c.label;b.onclick=()=>showCase(c,i);tabs.append(b);});showCase(cases[0],0);
 function showResults(setting){const offset=setting==='wild'?7:0;document.querySelector('#table-caption').textContent=setting==='wild'?'Gen-HumanEgo · In-the-wild evaluation':'Mean over six datasets · In-domain evaluation';document.querySelector('#metrics').replaceChildren(...results.map(r=>{const tr=document.createElement('tr');if(r.method==='ViDiHand V2')tr.className='ours';[r.method,...r.values.slice(offset,offset+7).map(v=>v.toFixed(2))].forEach((v,i)=>{const td=document.createElement(i===0?'th':'td');if(i===0)td.scope='row';td.textContent=v;tr.append(td);});return tr;}));document.querySelectorAll('[data-setting]').forEach(b=>{b.classList.toggle('active',b.dataset.setting===setting);b.setAttribute('aria-pressed',String(b.dataset.setting===setting));});}
 document.querySelectorAll('[data-setting]').forEach(b=>b.onclick=()=>showResults(b.dataset.setting));showResults('wild');
}
init().catch(()=>{document.querySelector('#case-caption').textContent='Results could not be loaded. Please refresh the page.';});

function initTasks(){
 const tasks=[{key:'wild1',label:'Xperience',caption:'Multi-person interaction · paper case · 20 FPS'},{key:'wild2',label:'EgoDex',caption:'Manipulating everyday objects · 30 FPS'},{key:'wild8',label:'Ego4D',caption:'Everyday hand motion · 30 FPS'},{key:'paper2',label:'GenHumanEgo',caption:'Hand-object interaction · 30 FPS'}];
 const video=document.querySelector('#task-video'),canvas=document.querySelector('#task-canvas'),ctx=canvas.getContext('2d'),slider=document.querySelector('#wipe'),line=document.querySelector('#wipe-line'),play=document.querySelector('#task-play'),tabs=document.querySelector('#task-tabs');
 let poster=null,selected=0,playing=false,loaded=false;
 function draw(){const source=loaded&&video.readyState>=2?video:poster;if(!source)return;const sw=source===video?video.videoWidth:source.naturalWidth,sh=source===video?video.videoHeight:source.naturalHeight;if(!sw||!sh)return;const x=Number(slider.value)/100*640;ctx.drawImage(source,sw/2,0,sw/2,sh,0,0,640,480);if(x>0)ctx.drawImage(source,0,0,sw/2*(x/640),sh,0,0,x,480);line.style.left=slider.value+'%';}
 function select(i){video.pause();playing=false;play.textContent='Play video';loaded=false;poster=null;selected=i;const task=tasks[i];[...tabs.children].forEach((b,j)=>{b.classList.toggle('active',j===i);b.setAttribute('aria-pressed',String(j===i));});document.querySelector('#task-caption').textContent=task.caption;canvas.setAttribute('aria-label',task.label+': raw video and ViDiHand V2 reconstruction');const im=new Image();im.onload=()=>{if(selected===i){poster=im;draw();}};im.src='v2/tasks/'+task.key+'.jpg';video.src='v2/tasks/'+task.key+'.mp4';video.load();}
 tasks.forEach((task,i)=>{const b=document.createElement('button');b.textContent=task.label;b.onclick=()=>select(i);tabs.append(b);});
 slider.addEventListener('input',draw);video.addEventListener('loadeddata',()=>{loaded=true;draw();});video.addEventListener('seeked',draw);video.addEventListener('error',()=>{play.textContent='Video unavailable';document.querySelector('#task-caption').textContent='Video could not load. Please refresh to retry.';});
 play.onclick=async()=>{if(playing){video.pause();playing=false;play.textContent='Play video';}else{try{await video.play();playing=true;play.textContent='Pause video';}catch{play.textContent='Retry playback';}}};
 function tick(){draw();if(video.requestVideoFrameCallback)video.requestVideoFrameCallback(tick);else requestAnimationFrame(tick);}if(video.requestVideoFrameCallback)video.requestVideoFrameCallback(tick);else requestAnimationFrame(tick);
 select(0);
}
initTasks();
