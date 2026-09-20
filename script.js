const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = reducedMotion.matches;
const header = document.querySelector('.site-header');
const progress = document.querySelector('.reading-progress');
const motionToggle = document.querySelector('.motion-toggle');
const tilt = document.querySelector('[data-tilt]');
const pointerHalo = document.querySelector('.pointer-halo');
let scrollScheduled = false;
const portraitImage = tilt.querySelector('img');
const finePointer = window.matchMedia('(pointer:fine)');
function motionAllowed() { return !motionPaused && !reducedMotion.matches; }
function updateMotion() {
  document.body.classList.toggle('motion-paused', motionPaused);
  document.documentElement.style.scrollBehavior = motionAllowed() ? '' : 'auto';
  document.documentElement.classList.toggle('motion-enabled', motionAllowed());
  motionToggle.setAttribute('aria-pressed', String(motionPaused));
  motionToggle.setAttribute('aria-label', motionPaused ? 'Resume animations' : 'Pause animations');
  motionToggle.setAttribute('title', motionPaused ? 'Resume animations' : 'Pause animations');
  motionToggle.firstElementChild.textContent = motionPaused ? '▷' : 'Ⅱ';
  motionToggle.disabled = reducedMotion.matches;
  if (reducedMotion.matches) {
    motionToggle.setAttribute('aria-label', 'Animations reduced by your device settings');
    motionToggle.title = 'Animations reduced by your device settings';
  }
  if (!motionAllowed()) {
    tilt.style.transform = '';
    portraitImage.style.removeProperty('--portrait-shift');
    document.querySelectorAll('[data-magnetic]').forEach(el => el.style.transform = '');
    document.querySelectorAll('.skill-panel').forEach(el => el.getAnimations?.().forEach(a => a.cancel()));
  }
}
updateMotion();
motionToggle.addEventListener('click', () => { motionPaused = !motionPaused; updateMotion(); });
reducedMotion.addEventListener('change', () => { motionPaused = reducedMotion.matches; updateMotion(); });
function updateScroll() {
  header.classList.toggle('scrolled', window.scrollY > 30);
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0})`;
  if (motionAllowed() && finePointer.matches && window.innerWidth > 800) {
    const heroBottom = document.querySelector('.hero').getBoundingClientRect().bottom;
    if (heroBottom > 0) portraitImage.style.setProperty('--portrait-shift', `${Math.min(window.scrollY * .018, 12)}px`);
  }
  scrollScheduled = false;
}
window.addEventListener('scroll', () => { if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateScroll); } }, {passive:true});
window.addEventListener('resize', updateScroll);
updateScroll();
document.querySelector('#year').textContent = new Date().getFullYear();
function updateClock() {
  document.querySelector('#local-time').textContent = new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Colombo',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());
}
updateClock();
setInterval(updateClock, 60000);
const menu = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); mobileNav.hidden = true; }
menu.addEventListener('click', () => { const opened = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(opened)); menu.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation'); mobileNav.hidden = !opened; });
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menu.focus(); } });
document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
window.matchMedia('(min-width: 601px)').addEventListener('change', closeMenu);
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }); }, {threshold:0.04, rootMargin:'0px 0px -12px 0px'});
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  document.querySelectorAll('.build-card').forEach((el, index) => { el.classList.add('reveal'); el.style.setProperty('--reveal-delay', `${index * 85}ms`); revealObserver.observe(el); });
  const navObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { document.querySelectorAll('.desktop-nav a').forEach(a => { if (a.hash === `#${entry.target.id}`) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); }); } }); }, {rootMargin:'-15% 0px -65% 0px'});
  document.querySelectorAll('#home,#work,#about,#expertise,#development,#contact').forEach(el => navObserver.observe(el));
} else document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
const skillTabs = [...document.querySelectorAll('.skill-tab')];
const skillPanels = [...document.querySelectorAll('.skill-panel')];
let selectedSkill = 'marketing';
function selectSkill(id, focus = false) {
  const next = skillTabs.find(tab => tab.dataset.skill === id);
  if (!next) return;
  skillTabs.forEach(tab => { const chosen = tab === next; tab.setAttribute('aria-selected',String(chosen)); tab.tabIndex = chosen ? 0 : -1; });
  skillPanels.forEach(panel => { const active = panel.id === `panel-${id}`; panel.hidden = !active; if (!active) panel.getAnimations?.().forEach(a => a.cancel()); });
  const panel = document.querySelector(`#panel-${id}`);
  if (id !== selectedSkill && motionAllowed() && panel.animate) panel.animate([{opacity:0,transform:'translateX(16px)'},{opacity:1,transform:'translateX(0)'}],{duration:520,easing:'cubic-bezier(.22,.8,.25,1)'});
  selectedSkill = id;
  if (focus) next.focus({preventScroll:true});
}
skillTabs.forEach((tab,index) => {
  tab.addEventListener('click', () => selectSkill(tab.dataset.skill));
  tab.addEventListener('keydown', event => {
    let nextIndex;
    if (['ArrowDown','ArrowRight'].includes(event.key)) nextIndex = (index + 1) % skillTabs.length;
    else if (['ArrowUp','ArrowLeft'].includes(event.key)) nextIndex = (index - 1 + skillTabs.length) % skillTabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = skillTabs.length - 1;
    if (nextIndex !== undefined) { event.preventDefault(); selectSkill(skillTabs[nextIndex].dataset.skill,true); }
  });
});
function tabOrientation() { document.querySelector('[role=tablist]').setAttribute('aria-orientation',window.innerWidth > 600 && window.innerWidth <= 800 ? 'horizontal' : 'vertical'); }
window.addEventListener('resize', tabOrientation); tabOrientation();
document.querySelector('#view-development').addEventListener('click', () => selectSkill('development', true));
document.querySelectorAll('[data-select-skill]').forEach(link => link.addEventListener('click', () => selectSkill(link.dataset.selectSkill)));
document.querySelector('.primary-discipline').addEventListener('click', () => selectSkill('marketing'));
document.querySelectorAll('.tool-card').forEach(card => card.addEventListener('pointermove', event => {
  if (!motionAllowed() || event.pointerType !== 'mouse') return;
  const r = card.getBoundingClientRect(); card.style.setProperty('--spot-x',`${event.clientX-r.left}px`); card.style.setProperty('--spot-y',`${event.clientY-r.top}px`);
}));
tilt.addEventListener('pointermove', event => {
  if (!motionAllowed() || event.pointerType !== 'mouse') return;
  const r = tilt.getBoundingClientRect();
  tilt.style.transform = `rotateY(${((event.clientX-r.left)/r.width-.5)*7}deg) rotateX(${((event.clientY-r.top)/r.height-.5)*-5}deg)`;
});
tilt.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('pointermove', event => {
    if (!motionAllowed() || event.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect(); el.style.transform = `translate(${(event.clientX-r.left-r.width/2)*.1}px,${(event.clientY-r.top-r.height/2)*.12}px)`;
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  el.addEventListener('blur', () => { el.style.transform = ''; });
});
let pointerFrame = null;
document.addEventListener('pointermove', event => {
  if (!motionAllowed() || event.pointerType !== 'mouse' || window.innerWidth <= 600 || getComputedStyle(pointerHalo).display === 'none') return;
  if (pointerFrame) cancelAnimationFrame(pointerFrame);
  pointerFrame = requestAnimationFrame(() => { pointerHalo.style.transform = `translate(${event.clientX-250}px,${event.clientY-250}px)`; pointerHalo.style.opacity = '1'; pointerFrame = null; });
}, {passive:true});
document.documentElement.addEventListener('pointerleave', () => { pointerHalo.style.opacity='0'; });
const projects = {
  synergy: {title:'Helping students see what’s next.',category:'Marketing Executive · Synergy Consultant',description:'My role connects overseas education opportunities with prospective students through clear, consistent brand communication in English and Tamil.',points:['Plan and manage social content around universities, programmes, and student success stories.','Design branded posters, banners, digital creatives, and event materials.','Write captions, promotional copy, and video scripts; edit short-form social content.','Support webinars, open days, student outreach, and institutional partnership promotions.'],note:'Role scope · Jaffna, Sri Lanka · March 2026–present'},
  fyp: {title:'Find Your Potential.',category:'FYP · Personal podcast brand',image:'/assets/fyp-poster.png',logo:'/assets/fyp-logo.png',alt:'FYP launch poster in black, white, and lime green, announcing Find Your Potential',description:'FYP is a personal podcast brand created to explore motivation, personal growth, and meaningful life topics. Through concise English solo episodes, it encourages people to question limiting beliefs, understand their journey, and unlock their true potential.',points:['A visual identity built around a distinctive FYP wordmark and a black, white, and lime palette.','Solo English episodes focused on motivation, personal growth, and meaningful life topics.','Brand artwork and a launch poster that carry the same visual language across social media.'],note:'Personal project · Podcast & brand identity · Website coming soon'}
};
const dialog = document.querySelector('#project-dialog');
let dialogTrigger = null;
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  if (!project) return;
  dialogTrigger = button;
  const isFyp = button.dataset.project === 'fyp';
  dialog.classList.toggle('fyp-dialog', isFyp);
  document.querySelector('.dialog-website').hidden = !isFyp;
  document.querySelector('.dialog-contact').hidden = isFyp;
  const brandLogo = document.querySelector('#dialog-brand-logo');
  brandLogo.hidden = !project.logo;
  if (project.logo) brandLogo.src = project.logo; else brandLogo.removeAttribute('src');
  document.querySelector('#dialog-title').textContent=project.title;
  document.querySelector('#dialog-category').textContent=project.category;
  document.querySelector('#dialog-description').textContent=project.description;
  document.querySelector('#dialog-note').textContent=project.note;
  const list=document.querySelector('#dialog-points');list.replaceChildren();list.hidden=!project.points.length;
  project.points.forEach(point=>{const li=document.createElement('li');li.textContent=point;list.append(li);});
  const wrap=document.querySelector('.dialog-image-wrap');wrap.hidden=!project.image;
  dialog.classList.toggle('no-image',!project.image);
  const img=document.querySelector('#dialog-image');
  if(project.image){img.src=project.image;img.alt=project.alt;}else{img.removeAttribute('src');img.alt='';}
  dialog.showModal();document.body.classList.add('dialog-open');
}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');dialogTrigger?.focus({preventScroll:true});});
