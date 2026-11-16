'use strict';
async function init(){
 const response=await fetch('v2/results.json');if(!response.ok)throw Error('Could not load results');const results=await response.json();
 function showResults(setting){const offset=setting==='wild'?7:0;document.querySelector('#table-caption').textContent=setting==='wild'?'Gen-HumanEgo · In-the-wild evaluation':'Mean over six datasets · In-domain evaluation';document.querySelector('#metrics').replaceChildren(...results.map(r=>{const tr=document.createElement('tr');if(r.method==='ViDiHand V2')tr.className='ours';[r.method,...r.values.slice(offset,offset+7).map(v=>v.toFixed(2))].forEach((v,i)=>{const td=document.createElement(i===0?'th':'td');if(i===0)td.scope='row';td.textContent=v;tr.append(td);});return tr;}));document.querySelectorAll('[data-setting]').forEach(b=>{b.classList.toggle('active',b.dataset.setting===setting);b.setAttribute('aria-pressed',String(b.dataset.setting===setting));});}
 document.querySelectorAll('[data-setting]').forEach(b=>b.onclick=()=>showResults(b.dataset.setting));showResults('wild');
}
init().catch(()=>{document.querySelector('#table-caption').textContent='Results could not be loaded. Please refresh the page.';});

async function initTasks(){
 const response=await fetch('v2/tasks/sources.json?v=38');if(!response.ok)throw Error('Could not load demos');const tasks=await response.json();
 const video=document.querySelector('#task-video'),canvas=document.querySelector('#task-canvas'),ctx=canvas.getContext('2d'),slider=document.querySelector('#wipe'),line=document.querySelector('#wipe-line'),play=document.querySelector('#task-play'),tabs=document.querySelector('#task-tabs');
 let poster=null,selected=0,playing=false,loaded=false;
 function draw(){const source=loaded&&video.readyState>=2?video:poster;if(!source)return;const sw=source===video?video.videoWidth:source.naturalWidth,sh=source===video?video.videoHeight:source.naturalHeight;if(!sw||!sh)return;const x=Number(slider.value)/100*canvas.width;ctx.drawImage(source,sw/2,0,sw/2,sh,0,0,canvas.width,canvas.height);if(x>0)ctx.drawImage(source,0,0,sw/2*(x/canvas.width),sh,0,0,x,canvas.height);line.style.left=slider.value+'%';}
 function select(i){video.pause();playing=false;play.textContent='Play motion';loaded=false;poster=null;selected=i;const task=tasks[i];canvas.width=task.width;canvas.height=task.height;canvas.parentElement.style.aspectRatio=task.width+'/'+task.height;[...tabs.children].forEach((b,j)=>{b.classList.toggle('active',j===i);b.setAttribute('aria-pressed',String(j===i));});document.querySelector('#task-caption').textContent=task.label+" · "+(task.key==="wild1"?"Multi-person interaction · ":"")+task.fps+" FPS";canvas.setAttribute('aria-label',task.label+': raw video and ViDiHand V2 reconstruction');const im=new Image();im.onload=()=>{if(selected===i){poster=im;draw();}};im.src='v2/tasks/'+task.key+'.jpg?v=38';video.src='v2/tasks/'+task.key+'.mp4?v=38';video.load();}
 tasks.forEach((task,i)=>{const b=document.createElement('button');b.textContent=task.label;b.onclick=()=>select(i);tabs.append(b);});
 slider.addEventListener('input',draw);video.addEventListener('loadeddata',()=>{loaded=true;draw();});video.addEventListener('seeked',draw);video.addEventListener('error',()=>{play.textContent='Video unavailable';document.querySelector('#task-caption').textContent='Video could not load. Please refresh to retry.';});
 play.onclick=async()=>{if(playing){video.pause();playing=false;play.textContent='Play motion';}else{try{await video.play();playing=true;play.textContent='Pause motion';}catch{play.textContent='Retry playback';}}};
 function tick(){draw();if(video.requestVideoFrameCallback)video.requestVideoFrameCallback(tick);else requestAnimationFrame(tick);}if(video.requestVideoFrameCallback)video.requestVideoFrameCallback(tick);else requestAnimationFrame(tick);
 select(0);
}
initTasks().catch(()=>{document.querySelector('#task-caption').textContent='Demos could not load. Please refresh to retry.';});
