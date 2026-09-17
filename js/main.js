const navToggle=document.querySelector('.nav-toggle'),nav=document.querySelector('.main-nav');
navToggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');navToggle.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');navToggle?.setAttribute('aria-expanded','false')}));
const sections=[...document.querySelectorAll('main section[id]')],links=[...document.querySelectorAll('.main-nav a')];
const setActive=()=>{let current='inicio';sections.forEach(s=>{if(scrollY+120>=s.offsetTop)current=s.id});links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current))};
addEventListener('scroll',setActive,{passive:true});setActive();
document.getElementById('year').textContent=new Date().getFullYear();
document.getElementById('contactForm')?.addEventListener('submit',e=>{e.preventDefault();const status=document.getElementById('formStatus');status.textContent='Formulario preparado. Conecta aquí tu servicio de correo o endpoint antes de publicar.';e.target.reset();});
