/* SHARED MODULE — edit shared/router.js, then run `node build.mjs`. Do not edit the generated copy inside an app file. */
/* Hash router + render pipeline (incl. a11y focus-on-nav). @@MAIN@@ = per-app bottom-tab id list. renderTabs stays per-app. */
const ROUTES={};let CURRENT='splash',STACK=[],CURRENT_OPTS={};
function route(n,fn){ROUTES[n]=fn;}
function go(n,o){o=o||{};if(!o.replace&&CURRENT&&CURRENT!==n)STACK.push(CURRENT);CURRENT=n;CURRENT_OPTS=o;window.__navFocus=true;render();}
function goBack(){window.__navFocus=true;if(STACK.length){CURRENT=STACK.pop();render();}else navTab('today');}
const MAIN=[@@MAIN@@];
function navTab(n){STACK=[];CURRENT=n;CURRENT_OPTS={};window.__navFocus=true;render();}
function render(){applyDir();const host=$('#screens');host.innerHTML='';const fn=ROUTES[CURRENT]||ROUTES['today'];const node=el('<div class="screen active"></div>');fn(node,CURRENT_OPTS);host.appendChild(node);node.scrollTop=0;try{animNums(node);}catch(e){}const tb=$('#tabbar');if(MAIN.includes(CURRENT)){tb.classList.remove('hidden');renderTabs();}else tb.classList.add('hidden');const fab=$('#fab');if(fab)fab.classList.toggle('show',CURRENT==='today');
  try{var sl=$('#skiplink');if(sl)sl.textContent=isAr()?'تخطَّ إلى المحتوى':'Skip to content';if(tb)tb.setAttribute('aria-label',isAr()?'التنقّل الرئيسي':'Primary');var mc=$('#screens');if(mc)mc.setAttribute('aria-label',isAr()?'المحتوى الرئيسي':'Main content');}catch(e){}
  if(window.__navFocus){window.__navFocus=false;try{var hh=node.querySelector('h1,h2');if(hh){hh.setAttribute('tabindex','-1');hh.focus({preventScroll:true});}else{$('#screens').focus({preventScroll:true});}}catch(e){}}}
