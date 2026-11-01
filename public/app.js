const $ = (s, parent=document) => parent.querySelector(s);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tags = items => `<div class="badges">${items.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div>`;
const dateLabel = value => /^(dates? not (supplied|provided)|award year not provided)$/i.test(String(value ?? '').trim()) ? '' : String(value ?? '');
const tabs = [
  ['about','About'],['education','Education'],['research','Research'],['publications','Publications'],
  ['experience','Experience'],['projects','Projects'],['books','Favorite Books'],['skills','Skills'],['awards','Awards'],['contact','Contact']
];
let profile, selected='about';
const content=$('#tab-content');
function block(title,inner,right='',kicker='') {
  return `<section class="block">${kicker?`<div class="section-kicker">${esc(kicker)}</div>`:''}<div class="block-head"><h3>${esc(title)}</h3>${right}</div>${inner}</section>`;
}
function preview(icon,title,subtitle,meta='') {
  return `<div class="preview-row"><span class="preview-icon">${icon}</span><div class="preview-body"><h4>${esc(title)}</h4><p>${esc(subtitle)}</p>${meta?`<div class="preview-meta">${esc(meta)}</div>`:''}</div></div>`;
}
function educationCard(item) {
  return `<article class="detail-item"><div class="item-head"><div><h4>${esc(item.degree)}${item.specialization?` <span style="color:#238c84">·</span> ${esc(item.specialization)}`:''}</h4><small>${esc(item.institution)} · ${esc(item.place)}</small></div>${dateLabel(item.period)?`<span class="item-date">${esc(dateLabel(item.period))}</span>`:""}</div></article>`;
}
function experienceCard(item) {
  return `<article class="detail-item"><div class="item-head"><div><h4>${esc(item.job)}</h4><small>${esc(item.institution)} · ${esc(item.location)}</small></div>${dateLabel(item.dates)?`<span class="item-date">${esc(dateLabel(item.dates))}</span>`:""}</div>${tags([item.type])}${item.note?`<p class="visiting-note"><span aria-hidden="true">*</span> ${esc(item.note)}</p>`:''}<ul class="details-bullets">${item.details.map(d=>`<li>${esc(d)}</li>`).join('')}</ul></article>`;
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
function bookCard(book, index) {
  const bullets=(book.overview||[]).slice(0,3).map(line=>`<li>${esc(line)}</li>`).join('');
  return `<article class="book-card"><div class="book-cover-wrap"><img class="book-cover" src="${esc(book.image)}" alt="Cover of ${esc(book.title)}" loading="lazy" decoding="async"></div><div class="book-content"><div class="book-meta-top"><span class="book-index">BOOK ${String(index+1).padStart(2,'0')}</span><time class="book-date">${esc(book.date)}</time></div><h4>${esc(book.title)}</h4><p class="book-author">${esc(book.author)}</p><details class="book-disclosure"><summary><span>Explore book overview</span><svg class="book-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><div class="book-disclosure-body"><ul class="book-bullets">${bullets}</ul><a class="book-source" href="${esc(book.link)}" target="_blank" rel="noopener noreferrer" aria-label="View publication details for ${esc(book.title)}">Publication details ↗</a></div></details></div></article>`;
}
function booksSection() {
  return block('Favorite books',`<p class="books-lead">Selected reading in artificial intelligence, language models, software engineering, and natural language processing.</p><div class="books-grid">${(profile.favoriteBooks||[]).map(bookCard).join('')}</div>`, '', 'PROFESSIONAL READING');
}
function bookPreview(book) {
  return `<article class="book-preview"><img src="${esc(book.image)}" alt="Cover of ${esc(book.title)}" loading="lazy"><div><strong>${esc(book.title)}</strong><span>${esc(book.date)}</span></div></article>`;
}
const skillIconPaths={
  'cpu':'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9zM9 1v3m6-3v3M9 20v3m6-3v3M1 9h3m-3 6h3m16-6h3m-3 6h3"/>',
  'brain':'<path d="M12 18V5a4 4 0 0 0-7.5-2 4.5 4.5 0 0 0-2 7 4.5 4.5 0 0 0 1.5 8.5A4.5 4.5 0 0 0 12 21m0-16a4 4 0 0 1 7.5-2 4.5 4.5 0 0 1 2 7 4.5 4.5 0 0 1-1.5 8.5A4.5 4.5 0 0 1 12 21"/>',
  'message':'<path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-3 3v-9.5A7.5 7.5 0 1 1 20 11.5Z"/>',
  'sparkles':'<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z"/>',
  'network':'<circle cx="12" cy="4" r="2"/><circle cx="4" cy="19" r="2"/><circle cx="20" cy="19" r="2"/><path d="M11 6 5 17m8-11 6 11M6 19h12"/>',
  'layers':'<path d="m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5"/>',
  'search':'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  'chart':'<path d="M3 3v18h18M7 16l4-5 3 2 5-7"/>',
  'code':'<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/>',
  'flask':'<path d="M9 3h6m-5 0v7l-6 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-9V3M8 16h8"/>',
  'database':'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 4 18 4 18 0V5M3 12c0 4 18 4 18 0"/>',
  'settings':'<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
  'book':'<path d="M12 6c-3-2-6-2-10-1v14c4-1 7-1 10 1 3-2 6-2 10-1V5c-4-1-7-1-10 1Zm0 0v14"/>',
  'users':'<circle cx="9" cy="8" r="3"/><path d="M2 20v-2a7 7 0 0 1 14 0v2H2ZM17 5a3 3 0 0 1 0 6m2 4c2 1 3 3 3 5"/>',
  'pen':'<path d="M4 20 9 19 20 8 16 4 5 15 4 20ZM14 6l4 4"/>',
  'shield':'<path d="m12 2 8 4v6c0 5-3 8-8 10-5-2-8-5-8-10V6l8-4Z"/>',
  'graduation':'<path d="m2 9 10-5 10 5-10 5-10-5Zm4 3v5c4 3 8 3 12 0v-5m4-3v8"/>',
  'target':'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  'terminal':'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m6 9 3 3-3 3m6 0h5"/>',
  'puzzle':'<path d="M3 4h7a2 2 0 0 1 4 0h7v7a2 2 0 0 0 0 4v5h-7a2 2 0 0 1-4 0H3v-7a2 2 0 0 0 0-4V4Z"/>',
  'zap':'<path d="m13 2-9 11h7l-1 9 10-12h-7V2Z"/>',
  'file':'<path d="M6 2h8l5 5v15H6V2Zm8 0v5h5M9 12h7m-7 4h7"/>',
  'eye':'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  'activity':'<path d="M2 12h4l3-7 5 14 3-7h5"/>',
  'clipboard':'<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4V2h6v2M9 11h6m-6 4h6"/>'
};
const skillIconByName={
 'Machine Learning':'cpu','Deep Learning':'brain','Natural Language Processing':'message','Generative AI':'sparkles',
 'Large Language Models':'brain','Knowledge Graphs':'network','Multimodal Learning':'layers','Information Retrieval':'search',
 'Question Answering':'message','Experiment Design':'flask','Model Evaluation':'chart','Python':'code',
 'PyTorch':'zap','TensorFlow':'network','Scikit-learn':'cpu','NumPy':'database','Pandas':'chart',
 'SciPy':'flask','Matplotlib':'chart','Seaborn':'activity','NLTK':'message','spaCy':'message',
 'Transformers':'layers','Text Preprocessing':'file','Data Analysis':'chart','Model Training':'settings',
 'Performance Optimization':'activity','Semantic Search':'search','RAG':'puzzle','Prompt Engineering':'terminal',
 'Technical Documentation':'file','Research Collaboration':'users','University & College Teaching':'graduation',
 'Academic Leadership':'target','Mentoring':'users','Scientific Writing':'pen','Research Communication':'message',
 'Teamwork':'users','Problem Solving':'puzzle'
};
function skillIcon(name){const k=skillIconByName[name]||'target';return `<svg class="skill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${skillIconPaths[k]}</svg>`;}
function skillGroups() {
  return Object.entries(profile.skills).map(([label,items])=>`<div class="skill-group"><h4>${esc(label)}</h4><div class="skill-row">${items.map(item=>`<span class="skill">${skillIcon(item)}<span>${esc(item)}</span></span>`).join('')}</div></div>`).join('');
}
function overview() {
  const features = profile.researchAreas.slice(0,4).map((r,i)=>`<div class="feature"><span class="feature-icon">${['✳','◈','↗','⌘'][i]}</span><h4>${esc(r.name)}</h4><p>${esc(r.details)}</p></div>`).join('');
  return [
    block('Research in focus',`<p>${esc(profile.summary)}</p>`, '', 'RESEARCH PROFILE'),
    block('Research directions',`<div class="feature-grid">${features}</div>`, `<button class="mini-link" data-goto="research">All research →</button>`, 'FIELDS OF INTEREST'),
    block('Academic education',profile.education.slice(0,2).map((x,i)=>preview(['🎓','✦'][i],x.degree+' · '+x.specialization,x.institution,dateLabel(x.period))).join(''), `<button class="mini-link" data-goto="education">View education →</button>`),
    block('Research & scholarly contributions',profile.publications.filter(p=>!p.status).slice(0,4).map(publicationPreview).join('') + `<div class="manuscript-callout"><span>MANUSCRIPT · DECISION IN PROCESS</span><strong>CA-GAT: A causal-aware graph attention framework for temporal knowledge graph question answering</strong><div class="pub-venue-row"><small>Neural Networks · Not yet published</small>${journalMetric(profile.publications.find(p=>p.status))}</div></div>`, `<button class="mini-link" data-goto="publications">View all research papers →</button>`),
    block('Professional experience',profile.experience.slice(0,3).map((x,i)=>preview(['↗','◎','◎'][i],x.job,x.institution,x.dates)).join(''), `<button class="mini-link" data-goto="experience">Career timeline →</button>`),
    block('Recognition & awards',profile.awards.map(x=>preview('✦',x.title,x.detail)).join(''), `<button class="mini-link" data-goto="awards">Awards →</button>`),
    block('Academic & research collaboration',`<p>Interested in faculty appointments, research collaboration, teaching opportunities and applied AI projects? Use the contact information or ask the chatbot about his expertise and academic experience.</p><div style="margin-top:17px"><a class="btn btn-primary" href="mailto:${esc(profile.email)}">Get in touch ↗</a></div>`, `<button class="mini-link" data-goto="contact">Contact →</button>`)
  ].join('');
}
function renderTab(name) {
  switch(name) {
    case 'about': return block('',`<div class="about-prose">${esc(profile.about).split('\n\n').map(s=>`<p>${s}</p>`).join('')}</div>`,) + overview();
    case 'education': return block('Education & qualifications',`<div class="detail-list">${profile.education.map(educationCard).join('')}</div>`, '', 'ACADEMIC FOUNDATION');
    case 'research': return block('Research Interest',`<div class="feature-grid">${profile.researchAreas.map((r,i)=>`<div class="feature"><span class="feature-icon">${['✳','◈','↗','⌘','✦','◇'][i]}</span><h4>${esc(r.name)}</h4><p>${esc(r.details)}</p></div>`).join('')}</div>`,) + block('Research approach',`<p>Research activities documentation include literature review, dataset preparation, algorithm development, experiments, performance evaluation, scientific writing and collaboration. The publication topics demonstrate both methodological work and domain-specific applications.</p>`);
    case 'publications':return block('Scientific Publications',`<p class="metric-explainer">Journal Impact Factors reflect the 2025 Journal Citation Reports (released 2026); they measure journals, not individual articles. Conference papers have no Journal Impact Factor. </p><div class="detail-list">${profile.publications.filter(p=>!p.status).map((p,i)=>publicationCard(p,i)).join('')}${profile.publications.filter(p=>p.status).map((p,i)=>publicationCard(p,profile.publications.filter(x=>!x.status).length+i)).join('')}</div>`);
    case 'experience':return block('PROFESSIONAL EXPERIENCE',`<div class="detail-list">${profile.experience.map(experienceCard).join('')}</div>`,);
    case 'projects':return block('Portfolio Intelligent Applications',`<div class="project-grid">${profile.projects.map(projectCard).join('')}</div>`,);
    case 'books':return booksSection();
    case 'skills':return block('Technical & academic competencies',skillGroups(), '', 'RESEARCH + DELIVERY + TEACHING');
    case 'awards':return block('Recognition & achievements',`<div class="detail-list">${profile.awards.map(a=>`<article class="detail-item"><div class="item-head"><div><h4>${esc(a.title)}</h4><small>${esc(a.detail)}</small></div><span class="item-date">Recognition</span></div></article>`).join('')}</div>`, '', 'AWARDS');
    case 'contact':return block('Start a conversation',`
      <p>For faculty appointments, academic collaboration, teaching opportunities and research enquiries, please use the contact details below.</p>
      <div style="height:19px"></div>
      <div class="contact-layout">
        <div class="contact-tile contact-item">
          <span class="contact-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 7 9-7"></path>
            </svg>
          </span>
          <div><small>EMAIL ADDRESS</small><a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a></div>
        </div>
        <div class="contact-tile contact-item">
          <span class="contact-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 2.8a2 2 0 0 1-.6 1.9L7.1 10.3a16 16 0 0 0 6.6 6.6l1.9-1.9a2 2 0 0 1 1.9-.6l2.8.5a2 2 0 0 1 1.7 2Z"></path>
            </svg>
          </span>
          <div><small>CHINA PHONE</small><a href="tel:${esc(profile.phone.replace(/\D/g,''))}">${esc(profile.phone)}</a></div>
        </div>
        <div class="contact-tile contact-item">
          <span class="contact-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle>
            </svg>
          </span>
          <div><small>LOCATION</small><b>${esc(profile.location)}</b></div>
        </div>
        <div class="contact-tile contact-item">
          <span class="contact-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2h8l5 5v15H6z"></path><path d="M14 2v5h5M9 13h7M9 17h7"></path>
            </svg>
          </span>
          <div><small>CURRICULUM VITAE</small><a href="assets/Samar_Abbas_Original_Resume.docx" download>Download original CV ↗</a></div>
        </div>
        <div class="contact-tile contact-item">
          <span class="contact-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.1-5A8.5 8.5 0 1 1 20.5 11.5Z"></path><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" stroke-width="2.7"></path>
            </svg>
          </span>
          <div><small>WECHAT / WEIXIN 微信号</small><b>samar-hashmi</b></div>
        </div>
        <div class="contact-qr">
          <img src="assets/Samar_WeChat_QR.jpeg" alt="Samar Abbas WeChat QR code" loading="lazy" decoding="async">
          <div class="contact-qr-copy">
            <h4>Connect on 微信 (WeChat)</h4>
            <p>Scan the QR code to connect directly on WeChat.</p>
            <span>WeChat ID / 微信号: <strong>samar-hashmi</strong></span>
          </div>
        </div>
      </div>
    `, '', 'GET IN TOUCH');
    default: return renderTab('about');
  }
}

function renderSidebarExtras(){
  const core=['NLP','Machine Learning','Deep Learning','Generative AI','LLMs','Logical NLP','Question Answering','RAG','Python','Research Methods','Academic Teaching'];
  const skills=$('#sidebar-skills');
  if(skills)skills.innerHTML=core.map(name=>`<span class="side-competency">${esc(name)}</span>`).join('');
  const target=$('#sidebar-books');
  if(!target)return;
  const books=profile.favoriteBooks||[];
  const items=books.map(book=>`<a class="side-book" href="${esc(book.link||'#')}" target="_blank" rel="noopener noreferrer" title="${esc(book.title)}"><img src="${esc(book.image)}" alt="" loading="lazy"><span><b>${esc(book.title)}</b><small>${esc(book.date)}</small></span></a>`).join('');
  target.innerHTML=`<div class="side-books-set">${items}</div><div class="side-books-set" aria-hidden="true" inert>${items}</div>`;
}

function selectTab(name,shouldScroll=false) {
  if (!tabs.some(([key])=>key===name)) name='about';
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
    renderSidebarExtras();
    $('#hero-summary').textContent=profile.tagline;
    $('#tabs').innerHTML=tabs.map(([name,label],i)=>`<button type="button" role="tab" aria-controls="tab-content" aria-selected="${i===0}" class="tab ${i===0?'active':''}" data-tab="${name}" tabindex="${i===0?0:-1}">${label}</button>`).join('');
    selectTab('about');
  } catch(e) {content.innerHTML=`<section class="block"><h3>Profile unavailable</h3><p>Check that the server is running and try refreshing the page.</p></section>`;}
}
$('#tabs').addEventListener('click',e=>{const btn=e.target.closest('[data-tab]');if(btn)selectTab(btn.dataset.tab);});
content.addEventListener('click',e=>{const btn=e.target.closest('[data-goto]');if(btn)selectTab(btn.dataset.goto,true);});
document.querySelector('.side-panel')?.addEventListener('click',e=>{const link=e.target.closest('[data-side-tab]');if(link){e.preventDefault();selectTab(link.dataset.sideTab,true);}});


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
  en:[['Education','What is Samar Abbas’s education?'],['Research','Describe his research expertise.'],['Papers','Summarize his publications.'],['Teaching','What teaching experience does he have?'],['Projects','Tell me about his AI projects.'],['Books','What are his favorite AI and NLP books?'],['Skills','What are his technical skills?'],['Contact','How can I contact him?']],
  zh:[['教育背景','请介绍他的教育背景。'],['研究方向','他的研究方向是什么？'],['论文','请介绍他的学术论文和CA-GAT的状态。'],['教学','他有哪些教学经验？'],['项目','请介绍他的人工智能项目。'],['书籍','他推荐哪些人工智能和自然语言处理书籍？'],['技能','他有哪些技术技能？'],['联系','如何联系他？']]
};
const welcome='Hello! how can I help you respected';
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
  const mode=$('#chat-mode'); if(mode) mode.textContent='Chat reset';
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
        if(event==='meta'){const mode=$('#chat-mode'); if(mode) mode.textContent=obj.mode==='groq'?'Online · Groq':'Preview mode';}
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
