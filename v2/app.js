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

async function initTasks() {
 const response = await fetch('v2/tasks/frames.json?v=39');
 if (!response.ok) throw Error('Previews unavailable');
 const tasks = await response.json();
 const canvas = document.querySelector('#task-canvas'), ctx = canvas.getContext('2d');
 const wipe = document.querySelector('#wipe'), line = document.querySelector('#wipe-line');
 const timeline = document.querySelector('#task-frame'), tabs = document.querySelector('#task-tabs');
 const caption = document.querySelector('#task-caption'), position = document.querySelector('#frame-position');
 const images = new Map();
 let selected = 0, revision = 0;
 function load(src) {
  if (!images.has(src)) images.set(src,new Promise((resolve,reject) => {
   const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = 'v2/tasks/'+src;
  }));
  return images.get(src);
 }
 async function draw() {
  const token = ++revision, task = tasks[selected], frame = Number(timeline.value);
  line.style.left = wipe.value+'%';
  position.textContent = (frame+1)+' / '+task.frames;
  const image = await load(task.sheets[Math.floor(frame/task.fps)]);
  if (token !== revision) return;
  const local = frame % task.fps, w = task.width, h = task.height;
  const sx = local % task.columns * w*2, sy = Math.floor(local/task.columns)*h;
  const cut = Number(wipe.value)/100*w;
  ctx.drawImage(image,sx+w,sy,w,h,0,0,w,h);
  if (cut > 0) ctx.drawImage(image,sx,sy,cut,h,0,0,cut,h);
  canvas.dataset.frame = String(frame); canvas.dataset.scene = task.key;
 }
 function redraw() {draw().catch(() => {caption.textContent = 'Preview unavailable.';});}
 function select(i) {
  selected = i; const task = tasks[i];
  canvas.width = task.width; canvas.height = task.height;
  canvas.parentElement.style.aspectRatio = task.width+'/'+task.height;
  timeline.max = task.frames-1; timeline.value = Math.min(Math.round(task.fps*3),task.frames-1);
  [...tabs.children].forEach((b,j) => {b.classList.toggle('active',j===i); b.setAttribute('aria-pressed',String(j===i));});
  caption.textContent = task.label+(task.key === 'wild1' ? ' · Multi-person interaction' : '');
  canvas.setAttribute('aria-label',task.label+': synchronized raw and reconstruction comparison');
  redraw();
 }
 tasks.forEach((task,i) => {const b = document.createElement('button'); b.type='button'; b.textContent=task.label; b.addEventListener('click',() => select(i)); tabs.append(b);});
 wipe.addEventListener('input',redraw); timeline.addEventListener('input',redraw);
 select(0);
}
initTasks().catch(() => {document.querySelector('#task-caption').textContent = 'Previews unavailable.';});
