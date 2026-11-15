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
