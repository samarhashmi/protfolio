const $ = (s, parent=document) => parent.querySelector(s);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tags = items => `<div class="badges">${items.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div>`;
const dateLabel = value => /^(dates? not (supplied|provided)|award year not provided)$/i.test(String(value ?? '').trim()) ? '' : String(value ?? '');
const tabs = [
  ['overview','Overview'],['about','About'],['education','Education'],['research','Research'],['publications','Publications'],
  ['experience','Experience'],['projects','Projects'],['skills','Skills'],['awards','Awards'],['contact','Contact']
];
let profile, selected='overview';
const content=$('#tab-content');
function block(title,inner,right='',kicker='') {
  return `<section class="block">${kicker?`<div class="section-kicker">${esc(kicker)}</div>`:''}<div class="block-head"><h3>${esc(title)}</h3>${right}</div>${inner}</section>`;
}
function preview(icon,title,subtitle,meta='') {
  return `<div class="preview-row"><span class="preview-icon">${icon}</span><div class="preview-body"><h4>${esc(title)}</h4><p>${esc(subtitle)}</p>${meta?`<div class="preview-meta">${esc(meta)}</div>`:''}</div></div>`;
}
function educationCard(item) {
  return `<article class="detail-item"><div class="item-head"><div><h4>${esc(item.degree)} <span style="color:#238c84">·</span> ${esc(item.specialization)}</h4><small>${esc(item.institution)} · ${esc(item.place)}</small></div>${dateLabel(item.period)?`<span class="item-date">${esc(dateLabel(item.period))}</span>`:""}</div></article>`;
}
function experienceCard(item) {
  return `<article class="detail-item"><div class="item-head"><div><h4>${esc(item.job)}</h4><small>${esc(item.institution)} · ${esc(item.location)}</small></div>${dateLabel(item.dates)?`<span class="item-date">${esc(dateLabel(item.dates))}</span>`:""}</div>${tags([item.type])}<ul class="details-bullets">${item.details.map(d=>`<li>${esc(d)}</li>`).join('')}</ul></article>`;
}
function journalMetric(item){
  if (!item.impactFactor) return '';
  const value=esc(item.impactFactor.value),year=esc(item.impactFactor.year);
  const metric=`<span class="impact-number">IF: ${value}</span><span class="impact-year">${year} JIF</span>`;
  return item.impactFactor.source ? `<a class="impact-badge" href="${esc(item.impactFactor.source)}" target="_blank" rel="noopener noreferrer" title="${year} Journal Impact Factor; journal-level metric">${metric}<span class="sr-only">Source</span></a>` : `<span class="impact-badge">${metric}</span>`;
}
function publicationCard(item,i) {
  return `<article class="detail-item publication"><div class="pub-index">${String(i+1).padStart(2,'0')}</div><div class="pub-main"><h4 class="pub-title">${esc(item.title)}</h4><div class="pub-venue-row"><span class="pub-venue">${esc(item.venue)} · ${esc(item.type)}</span>${journalMetric(item)}</div>${item.status?`<span class="pub-status">${esc(item.status)} · not accepted or published</span>`:''}<p class="pub-detail">${esc(item.description)}</p>${tags(item.tags)}</div></article>`;
}
function publicationPreview(item,i){
  return `<div class="pub-overview-row"><span class="pub-overview-index">${String(i+1).padStart(2,'0')}</span><div class="pub-overview-copy"><h4>${esc(item.title)}</h4><div class="pub-venue-row"><span class="pub-venue">${esc(item.venue)} · ${esc(item.type)}</span>${journalMetric(item)}</div></div></div>`;
}

function projectCard(item) {
  return `<article class="project-card"><span class="project-type">${esc(item.category).toUpperCase()}</span><h4>${esc(item.name)}</h4><p>${esc(item.description)}</p>${tags(item.tags)}</article>`;
}
function skillGroups() {
  return Object.entries(profile.skills).map(([label,items])=>`<div class="skill-group"><h4>${esc(label)}</h4><div class="skill-row">${items.map(item=>`<span class="skill">${esc(item)}</span>`).join('')}</div></div>`).join('');
}
function overview() {
  const features = profile.researchAreas.slice(0,4).map((r,i)=>`<div class="feature"><span class="feature-icon">${['✳','◈','↗','⌘'][i]}</span><h4>${esc(r.name)}</h4><p>${esc(r.details)}</p></div>`).join('');
  return [
    block('A brief introduction',`<p>${esc(profile.summary)}</p>`, `<button class="mini-link" data-goto="about">Read profile →</button>`, 'ACADEMIC PROFILE'),
    block('Research directions',`<div class="feature-grid">${features}</div>`, `<button class="mini-link" data-goto="research">All research →</button>`, 'FIELDS OF INTEREST'),
    block('Academic education',profile.education.slice(0,2).map((x,i)=>preview(['🎓','✦'][i],x.degree+' · '+x.specialization,x.institution,dateLabel(x.period))).join(''), `<button class="mini-link" data-goto="education">View education →</button>`),
    block('Research & scholarly contributions',profile.publications.filter(p=>!p.status).slice(0,4).map(publicationPreview).join('') + `<div class="manuscript-callout"><span>MANUSCRIPT · DECISION IN PROCESS</span><strong>CA-GAT: A causal-aware graph attention framework for temporal knowledge graph question answering</strong><div class="pub-venue-row"><small>Neural Networks · Not yet published</small>${journalMetric(profile.publications.find(p=>p.status))}</div></div>`, `<button class="mini-link" data-goto="publications">View all research papers →</button>`),
    block('Professional experience',profile.experience.slice(0,3).map((x,i)=>preview(['↗','◎','◎'][i],x.job,x.institution,x.dates)).join(''), `<button class="mini-link" data-goto="experience">Career timeline →</button>`),
    block('Selected practical projects',`<div class="project-grid">${profile.projects.slice(0,4).map(projectCard).join('')}</div>`, `<button class="mini-link" data-goto="projects">All projects →</button>`),
    block('Core competencies',`${tags(['NLP','Machine Learning','Deep Learning','Generative AI','LLMs','Knowledge Graphs','Question Answering','RAG','Python','Research Methods','Academic Teaching'])}`,`<button class="mini-link" data-goto="skills">All skills →</button>`),
    block('Recognition & awards',profile.awards.map(x=>preview('✦',x.title,x.detail)).join(''), `<button class="mini-link" data-goto="awards">Awards →</button>`),
    block('Academic & research collaboration',`<p>Interested in faculty appointments, research collaboration, teaching opportunities and applied AI projects? Use the contact information or ask the chatbot about his expertise and academic experience.</p><div style="margin-top:17px"><a class="btn btn-primary" href="mailto:${esc(profile.email)}">Get in touch ↗</a></div>`, `<button class="mini-link" data-goto="contact">Contact →</button>`)
  ].join('');
}
function renderTab(name) {
  switch(name) {
    case 'overview': return overview();
    case 'about': return block('Professional summary',`<p>${esc(profile.summary)}</p>`, '', 'WHO I AM') + block('What distinguishes this profile',`<div class="feature-grid">${[
      {name:'Scholarly research',details:'Published work spanning NLP, knowledge graphs, multimodal learning, QA and applied AI.'},
      {name:'Teaching & mentoring',details:'Experience as lecturer and in academic leadership roles.'},
      {name:'Applied AI delivery',details:'Prototype development across PDF QA, LLM chatbot and data analytics applications.'},
      {name:'Interdisciplinary perspective',details:'AI work connected to education, engineering and information systems.'}
    ].map((v,i)=>`<div class="feature"><span class="feature-icon">${['✦','◈','↗','⌘'][i]}</span><h4>${esc(v.name)}</h4><p>${esc(v.details)}</p></div>`).join('')}</div>`);
    case 'education': return block('Education & qualifications',`<div class="detail-list">${profile.education.map(educationCard).join('')}</div>`, '', 'ACADEMIC FOUNDATION');
    case 'research': return block('Research specializations',`<div class="feature-grid">${profile.researchAreas.map((r,i)=>`<div class="feature"><span class="feature-icon">${['✳','◈','↗','⌘','✦','◇'][i]}</span><h4>${esc(r.name)}</h4><p>${esc(r.details)}</p></div>`).join('')}</div>`, '', 'SCIENTIFIC INTERESTS') + block('Research approach',`<p>Research activities documented in the CV include literature review, dataset preparation, algorithm development, experiments, performance evaluation, scientific writing and collaboration. The publication topics demonstrate both methodological work and domain-specific applications.</p>`);
    case 'publications':return block('Scholarly publications',`<p class="metric-explainer">Journal Impact Factors reflect the 2025 Journal Citation Reports (released 2026); they measure journals, not individual articles. Conference papers have no Journal Impact Factor. The CA-GAT manuscript remains under editorial consideration.</p><div class="detail-list">${profile.publications.filter(p=>!p.status).map((p,i)=>publicationCard(p,i)).join('')}${profile.publications.filter(p=>p.status).map((p,i)=>publicationCard(p,profile.publications.filter(x=>!x.status).length+i)).join('')}</div>`, '', 'SIX LISTED PUBLICATIONS + ONE MANUSCRIPT IN PROCESS');
    case 'experience':return block('Teaching, research & leadership',`<div class="detail-list">${profile.experience.map(experienceCard).join('')}</div>`, '', 'PROFESSIONAL EXPERIENCE');
    case 'projects':return block('Selected intelligent applications',`<div class="project-grid">${profile.projects.map(projectCard).join('')}</div>`, '', 'APPLIED AI PORTFOLIO');
    case 'skills':return block('Technical & academic competencies',skillGroups(), '', 'RESEARCH + DELIVERY + TEACHING');
    case 'awards':return block('Recognition & achievements',`<div class="detail-list">${profile.awards.map(a=>`<article class="detail-item"><div class="item-head"><div><h4>${esc(a.title)}</h4><small>${esc(a.detail)}</small></div><span class="item-date">Recognition</span></div></article>`).join('')}</div>`, '', 'AWARDS');
    case 'contact':return block('Start a conversation',`<p>For faculty positions, academic collaboration, teaching or applied AI projects, please get in touch.</p><div style="height:19px"></div><div class="contact-layout"><div class="contact-tile"><small>EMAIL</small><a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a></div><div class="contact-tile"><small>CHINA PHONE</small><a href="tel:${esc(profile.phone.replace(/\D/g,''))}">${esc(profile.phone)}</a></div><div class="contact-tile"><small>LOCATION</small><b>${esc(profile.location)}</b></div><div class="contact-tile"><small>CV DOCUMENT</small><a href="assets/Samar_Abbas_Original_Resume.docx" download>Download original DOCX ↗</a></div></div>`, '', 'GET IN TOUCH');
    default: return overview();
  }
}
function selectTab(name,shouldScroll=false) {
  if (!tabs.some(([key])=>key===name)) name='overview';
  selected=name;
  $$('#tabs .tab').forEach(b=>{const active=b.dataset.tab===name;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
  content.innerHTML=renderTab(name);
  if(shouldScroll) $('.portfolio').scrollIntoView({behavior:'smooth',block:'start'});
}
function $$(s,parent=document){return Array.from(parent.querySelectorAll(s));}
async function load() {
  try {
    const req=await fetch('/api/profile');
    if(!req.ok) throw new Error('Unable to fetch profile');
    profile=await req.json();
    $('#hero-summary').textContent=profile.tagline;
    $('#tabs').innerHTML=tabs.map(([name,label],i)=>`<button type="button" role="tab" aria-controls="tab-content" aria-selected="${i===0}" class="tab ${i===0?'active':''}" data-tab="${name}" tabindex="${i===0?0:-1}">${label}</button>`).join('');
    selectTab('overview');
  } catch(e) {content.innerHTML=`<section class="block"><h3>Profile unavailable</h3><p>Check that the server is running and try refreshing the page.</p></section>`;}
}
$('#tabs').addEventListener('click',e=>{const btn=e.target.closest('[data-tab]');if(btn)selectTab(btn.dataset.tab);});
content.addEventListener('click',e=>{const btn=e.target.closest('[data-goto]');if(btn)selectTab(btn.dataset.goto,true);});
$('#hero-research').addEventListener('click',()=>selectTab('research',true));

// Rotating editorial headline: exact original opening plus two carefully paired statements.
const headlinePairs=[
  ['Building intelligent','systems.'],
  ['Nurturing creative','thinking.'],
  ['Innovating with','purpose.']
];
let headlineIndex=0;
const headlineMain=$('#headline-animated'),headlineTail=$('#headline-tail');
if(headlineMain && headlineTail && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  setInterval(()=>{
    headlineMain.parentElement.classList.add('headline-changing');
    headlineTail.classList.add('headline-changing');
    setTimeout(()=>{
      headlineIndex=(headlineIndex+1)%headlinePairs.length;
      headlineMain.textContent=headlinePairs[headlineIndex][0];
      headlineTail.textContent=headlinePairs[headlineIndex][1];
      headlineMain.parentElement.classList.remove('headline-changing');
      headlineTail.classList.remove('headline-changing');
    },320);
  },4400);
}


const launcher=$('#chat-launcher'),panel=$('#chat-panel'),body=$('#chat-body'),form=$('#chat-form'),input=$('#chat-input'),send=$('#send-button');
let isSending=false,history=[],chatSession=0,activeRequest=null,activeTicker=null;
const suggestionSets={
  en:[['Education','What is Samar Abbas’s education?'],['Research','Describe his research expertise.'],['Papers','Summarize his publications and CA-GAT status.'],['Teaching','What teaching experience does he have?'],['Projects','Tell me about his AI projects.'],['Skills','What are his technical skills?'],['Contact','How can I contact him?']],
  zh:[['教育背景','请介绍他的教育背景。'],['研究方向','他的研究方向是什么？'],['论文','请介绍他的学术论文和CA-GAT的状态。'],['教学','他有哪些教学经验？'],['项目','请介绍他的人工智能项目。'],['技能','他有哪些技术技能？'],['联系','如何联系他？']]
};
const welcome='Hello! 👋how can I help you respected';
let chatLanguage='en';
function renderSuggestions(lang='en'){
  chatLanguage=lang==='zh'?'zh':'en';
  $('#chat-suggestions').innerHTML=suggestionSets[chatLanguage].map(([label,prompt])=>`<button type="button" class="suggestion" data-prompt="${esc(prompt)}">${esc(label)}</button>`).join('');
}

function addMessage(role,text) {
  const el=document.createElement('div');el.className=`chat-message ${role}`;
  if(role!=='user') {const face=document.createElement('span');face.className='chat-face';face.textContent='✦';el.append(face);}
  const bubble=document.createElement('div');bubble.className='chat-bubble';bubble.textContent=text;el.append(bubble);body.append(el);
  body.scrollTop=body.scrollHeight;return bubble;
}
addMessage('assistant',welcome);
renderSuggestions();
$('#chat-suggestions').addEventListener('click',e=>{const b=e.target.closest('.suggestion');if(b && !isSending){input.value=b.dataset.prompt;sendQuestion();}});
function setOpen(open){panel.hidden=!open;launcher.classList.toggle('open',open);launcher.setAttribute('aria-expanded',String(open));$('#chat-nudge').classList.toggle('hidden',open);if(open)input.focus();}
launcher.addEventListener('click',()=>setOpen(panel.hidden));
$('#chat-minimize').addEventListener('click',()=>setOpen(false));
$('#side-chat').addEventListener('click',()=>setOpen(true));
function resetChat(){
  chatSession += 1; // invalidate any late stream, callbacks and queue
  if(activeRequest) activeRequest.abort();
  if(activeTicker) clearInterval(activeTicker);
  activeRequest=null;activeTicker=null;
  isSending=false;send.disabled=false;history=[];
  body.replaceChildren();addMessage('assistant',welcome);
  input.value='';input.style.height='auto';
  $('#chat-mode').textContent='Ready to help';
  renderSuggestions('en');
  if(!panel.hidden) input.focus();
}
$('#chat-reset').addEventListener('click',resetChat);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)setOpen(false);});
input.addEventListener('input',()=>{input.style.height='auto';input.style.height=Math.min(input.scrollHeight,100)+'px';});
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendQuestion();}});
form.addEventListener('submit',e=>{e.preventDefault();sendQuestion();});

// SSE messages are streamed by the Node server; a tiny display queue reveals text
// character-by-character for the requested calm typewriter effect.
async function sendQuestion(){
  const question=input.value.trim();if(!question||isSending) return;
  isSending=true;send.disabled=true;
  const currentSession=chatSession;
  const controller=new AbortController();activeRequest=controller;
  if (/[\u3400-\u9fff]/u.test(question)) renderSuggestions('zh');
  else if (/\p{Script=Latin}/u.test(question)) renderSuggestions('en');
  addMessage('user',question);input.value='';input.style.height='auto';
  const reply=addMessage('assistant','');reply.classList.add('typing-cursor');
  history.push({role:'user',content:question});
  let queue='',completed=false,stop=false;
  const ticker=setInterval(()=>{
    if(currentSession!==chatSession){clearInterval(ticker);return;}
    if(queue.length) {
      const count=Math.min(queue.length,3);reply.textContent+=queue.slice(0,count);queue=queue.slice(count);body.scrollTop=body.scrollHeight;
    }
    if(completed&&!queue.length){clearInterval(ticker);activeTicker=null;activeRequest=null;reply.classList.remove('typing-cursor');isSending=false;send.disabled=false;history.push({role:'assistant',content:reply.textContent});history=history.slice(-8);}
  },19);
  activeTicker=ticker;
  try {
    const response=await fetch('/api/chat',{signal:controller.signal,method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history.slice(-8)})});
    if(currentSession!==chatSession)return;
    if(!response.ok){let reason='Unable to process the request.';try{reason=(await response.json()).error||reason;}catch{}throw new Error(reason);}
    const reader=response.body.getReader(),decoder=new TextDecoder();
    let buffer='';
    for(;;){
      const {done,value}=await reader.read();if(currentSession!==chatSession)return;if(done)break;
      buffer+=decoder.decode(value,{stream:true});
      const events=buffer.split(/\r?\n\r?\n/);buffer=events.pop()||'';
      for(const part of events){
        let event='',data='';for(const line of part.split(/\r?\n/)){if(line.startsWith('event:'))event=line.slice(6).trim();if(line.startsWith('data:'))data+=line.slice(5).trim();}
        if(!data)continue;
        let obj;try{obj=JSON.parse(data);}catch{continue;}
        if(event==='token'&&obj.text)queue+=obj.text;
        if(event==='error'&&obj.message){queue+=`\n\n${obj.message}`;stop=true;}
        if(event==='meta'){$('#chat-mode').textContent=obj.mode==='groq'?'Online · Groq':'Preview mode';}
      }
      if(stop)break;
    }
    if(!reply.textContent&&!queue)queue='I could not produce a response. Please try again.';
  } catch(e){if(currentSession===chatSession && !controller.signal.aborted) queue+=`Sorry, ${e.message||'something went wrong'}. Please try again.`;}
  finally{if(currentSession===chatSession)completed=true;}
}
load();

// Native Windows one-click edition: optional AI key in process memory only.
(async function setupLocalApp(){
 let status;
 try {const response=await fetch('/api/status');status=await response.json();}catch{return;}
 if(!status.localApp)return;
 const topbar=document.querySelector('.top-links');
 if(topbar){
   const quit=document.createElement('button');quit.className='local-quit';quit.type='button';quit.textContent='Exit app';quit.title='Close the local application';
   quit.addEventListener('click',async()=>{if(!confirm('Close the portfolio app?'))return;try{await fetch('/api/quit',{method:'POST'});}catch{};document.body.innerHTML='<main style="font:18px system-ui;text-align:center;margin:15vh auto;max-width:600px;padding:30px"><h2>Application closed</h2><p>You can safely close this browser tab. Double-click the app icon to reopen it.</p></main>';});
   topbar.append(quit);
 }
 const row=document.querySelector('.chat-bottom');
 if(!row)return;
 const aiBtn=document.createElement('button');aiBtn.type='button';aiBtn.className='local-ai-btn';aiBtn.textContent=status.mode==='groq'?'AI connected':'Enable AI';aiBtn.title='Connect a new Groq API key for live AI answers';
 row.insertBefore(aiBtn,row.lastElementChild);
 const modal=document.createElement('div');modal.className='local-modal';modal.hidden=true;
 modal.innerHTML=`<form class="local-modal-card" id="local-ai-form"><h3>Connect the AI chatbot</h3><p>Your portfolio already works without setup. For live multilingual answers, enter a <strong>new Groq API key</strong>. It stays in this app's memory, is not saved on disk, and is not included in your public website files.</p><label for="local-groq-key">Groq API key</label><input type="password" id="local-groq-key" autocomplete="off" placeholder="gsk_..."/><p class="local-banner" id="local-ai-status">Leave blank to return to demo mode.</p><div class="local-modal-actions"><button type="button" id="local-modal-cancel">Cancel</button><button type="submit">Save & connect</button></div></form>`;
 document.body.append(modal);
 const show=()=>{modal.hidden=false;modal.querySelector('input').focus()};
 const hide=()=>{modal.hidden=true;modal.querySelector('input').value=''};
 aiBtn.addEventListener('click',show);modal.querySelector('#local-modal-cancel').addEventListener('click',hide);modal.addEventListener('click',e=>{if(e.target===modal)hide()});
 modal.querySelector('#local-ai-form').addEventListener('submit',async e=>{e.preventDefault();const key=modal.querySelector('input').value.trim();
  const note=modal.querySelector('#local-ai-status');
  try{const res=await fetch('/api/local-key',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key})});const data=await res.json();if(!res.ok)throw new Error(data.error||'Could not connect');aiBtn.textContent=data.mode==='groq'?'AI connected':'Enable AI';const mode=document.querySelector('#chat-mode');if(mode)mode.textContent=data.mode==='groq'?'Online · Groq':'Preview mode';hide();}
  catch(err){note.textContent=err.message||'Please check your key.';note.style.color='#a12d40'}
 });
})();
