'use strict';
async function initResults() {
 const response = await fetch('v2/results.json');
 if (!response.ok) throw Error('Results unavailable');
 const results = await response.json();
 let setting = 'wild', metric = null, direction = 1;
 const headers = [...document.querySelectorAll('[data-metric]')];
 function render() {
  const offset = setting === 'wild' ? 7 : 0;
  document.querySelector('#table-caption').textContent = setting === 'wild' ? 'Gen-HumanEgo · In-the-wild evaluation' : 'Mean over six datasets · In-domain evaluation';
  const ordered = [...results];
  if (metric !== null) ordered.sort((a,b) => direction * (a.values[offset+metric] - b.values[offset+metric]));
  document.querySelector('#metrics').replaceChildren(...ordered.map(r => {
   const tr = document.createElement('tr');
   if (r.method === 'ViDiHand V2') tr.className = 'ours';
   [r.method, ...r.values.slice(offset,offset+7).map(v => v.toFixed(2))].forEach((value,i) => {
    const cell = document.createElement(i ? 'td' : 'th');
    if (!i) cell.scope = 'row';
    cell.textContent = value; tr.append(cell);
   });
   return tr;
  }));
  headers.forEach((button,i) => {
   const active = i === metric;
   button.parentElement.setAttribute('aria-sort',active ? (direction === 1 ? 'ascending' : 'descending') : 'none');
   button.classList.toggle('sorted',active);
   button.querySelector('.sort-indicator').textContent = active ? (direction === 1 ? ' ↑' : ' ↓') : ' ↕';
  });
  document.querySelectorAll('[data-setting]').forEach(b => {
   b.classList.toggle('active',b.dataset.setting === setting);
   b.setAttribute('aria-pressed',String(b.dataset.setting === setting));
  });
 }
 headers.forEach((button,i) => button.addEventListener('click',() => {
  direction = metric === i ? -direction : (i < 2 ? -1 : 1); metric = i; render();
 }));
 document.querySelectorAll('[data-setting]').forEach(b => b.addEventListener('click',() => {setting = b.dataset.setting; render();}));
 render();
}
initResults().catch(() => {document.querySelector('#table-caption').textContent = 'Results unavailable.';});

async function initQualitative() {
 const response = await fetch('v2/qualitative/scenes-v47.json');
 if (!response.ok) throw Error('Comparison scenes unavailable');
 const scenes = await response.json();
 const tabs = document.querySelector('#scene-tabs'), grid = document.querySelector('#comparison-grid');
 const caption = document.querySelector('#scene-caption'), status = document.querySelector('#comparison-status');
 const play = document.querySelector('#comparison-play'), timeline = document.querySelector('#comparison-frame');
 const position = document.querySelector('#comparison-position');
 const names = {input:'Input',ours:'ViDiHand V2 (Ours)',gt:'Ground Truth',wilor:'WiLoR',mint:'MINT',v1:'ViDiHand V1',ace:'ACE-Ego-Hand'};
 const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
 let video = null, scene = null, contexts = [], generation = 0, wantsPlay = !reducedMotion.matches;
 function updateControl() {
  play.textContent = wantsPlay ? 'Pause' : 'Play';
  play.setAttribute('aria-label', (wantsPlay ? 'Pause' : 'Play')+' comparison');
 }
 function draw() {
  if (!video || video.readyState < 2) return;
  contexts.forEach(({ctx,height},i) => ctx.drawImage(video,(i%scene.columns)*scene.width,Math.floor(i/scene.columns)*scene.height,scene.width,height,0,0,scene.width,height));
  const frame = Math.min(scene.frames-1,Math.round(video.currentTime*scene.fps));
  timeline.value = frame; position.textContent = (frame+1)+' / '+scene.frames;
  grid.dataset.frame = frame;
 }
 function tick(token) {
  if (token !== generation) return;
  draw();
  if ('requestVideoFrameCallback' in video) video.requestVideoFrameCallback(() => tick(token));
  else requestAnimationFrame(() => tick(token));
 }
 async function start() {
  const current = video;
  if (!current || !wantsPlay) return;
  try {await current.play();} catch (_) {
   if (current !== video) return;
   wantsPlay = false; updateControl();
  }
 }
 function select(index) {
  const token = ++generation;
  if (video) {video.pause(); video.removeAttribute('src'); video.load();}
  scene = scenes[index]; contexts = []; grid.replaceChildren(); grid.dataset.scene = scene.key;
  grid.classList.toggle('without-gt',!scene.methods.includes('gt'));
  [...tabs.children].forEach((b,i) => {b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index));});
  caption.textContent = scene.dataset+' · '+scene.label+' · Fig. '+scene.figure;
  status.textContent = 'Loading comparison…'; play.disabled = true; updateControl();
  timeline.max = scene.frames-1; timeline.value = 0; position.textContent = '1 / '+scene.frames;
  scene.methods.forEach(method => {
   const card = document.createElement('figure');
   card.className = 'comparison-card '+(method==='ours'?'ours ':'')+(['input','ours','gt'].includes(method)?'primary':'baseline');
   const label = document.createElement('figcaption');label.textContent = names[method];
   const canvas = document.createElement('canvas');canvas.width = scene.width;canvas.height = method==='input' ? scene.imageHeight : scene.height;
   canvas.setAttribute('role','img');canvas.setAttribute('aria-label',scene.label+' — '+names[method]+(method==='input'?'':': 2D reconstruction above 3D hands and wrist trajectories'));
   const ctx = canvas.getContext('2d');contexts.push({ctx,height:canvas.height});
   const poster = new Image();poster.onload = () => {if (token===generation && (!video || video.readyState<2)) ctx.drawImage(poster,0,0,canvas.width,canvas.height,0,0,canvas.width,canvas.height);};
   poster.src = 'v2/qualitative/'+scene.key+'-'+method+scene.posterSuffix+'.jpg';
   card.append(label,canvas);grid.append(card);
  });
  video = document.createElement('video');video.muted = true;video.loop = true;video.playsInline = true;video.preload = 'auto';
  video.addEventListener('loadeddata',() => {
   if (token!==generation) return;
   play.disabled = false;status.textContent = '';draw();tick(token);start();
  },{once:true});
  video.addEventListener('seeked',() => {if(token===generation) draw();});
  video.addEventListener('error',() => {
   if(token!==generation) return;
   status.textContent = 'Showing the paper frames. Motion preview is temporarily unavailable.';
  });
  video.src = 'v2/qualitative/'+scene.video;
 }
 scenes.forEach((s,i) => {
  const button = document.createElement('button');button.type = 'button';button.setAttribute('aria-pressed','false');
  const number = document.createElement('span');number.className = 'scene-number';number.textContent = String(i+1).padStart(2,'0');
  const title = document.createElement('span');title.textContent = s.label;
  const dataset = document.createElement('small');dataset.textContent = s.dataset;
  title.append(dataset);button.append(number,title);button.addEventListener('click',() => select(i));tabs.append(button);
 });
 play.addEventListener('click',() => {wantsPlay = !wantsPlay;updateControl();if(wantsPlay) start();else video.pause();});
 timeline.addEventListener('input',() => {if(video.readyState>=1) video.currentTime = Number(timeline.value)/scene.fps;});
 document.addEventListener('visibilitychange',() => {if(document.hidden) video.pause();else if(wantsPlay) start();});
 select(0);
}
initQualitative().catch(() => {document.querySelector('#comparison-status').textContent = 'Comparison scenes could not be loaded.';});
