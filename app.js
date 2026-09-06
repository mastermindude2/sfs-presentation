'use strict';
  const roleData = {
    actor: ['Actor', 'Perform in short films, trailers, emotional scenes, thrillers, comedy scenes, and cinematic projects. No experience needed, just commitment.'],
    writer: ['Writer', 'Create story ideas, scripts, dialogue, character moments, plot twists, and scenes that give every production a strong reason to exist.'],
    camera: ['Camera Crew', 'Help frame shots, control camera movement, plan angles, capture scenes, and make the footage look cinematic.'],
    editor: ['Editor', 'Cut footage, shape pacing, add sound, build suspense, create titles, and turn raw clips into a finished film.'],
    design: ['Design', 'Create posters, thumbnails, credits, title cards, props, graphics, and the visual identity of SFS.'],
    crew: ['Stage Crew', 'Help with props, setup, lighting, movement, organization, continuity, and whatever is needed behind the camera.']
  };
  const finderQuestions = [
    {
      q: "When a scene starts, where do you imagine yourself?",
      a: [
        { t: "In front of the camera", s: "I want to perform and become the character.", r: { actor: 5, director: 1 } },
        { t: "Behind the camera", s: "I want to control how the shot looks.", r: { camera: 4, director: 2 } },
        { t: "At the editing timeline", s: "I want to build the final feeling.", r: { editor: 5, sound: 1 } },
        { t: "Writing the moment", s: "I want to create the story first.", r: { writer: 5, director: 1 } }
      ]
    },
    {
      q: "Pick the energy that fits you best.",
      a: [
        { t: "Main character energy", s: "I like being seen when it matters.", r: { actor: 5 } },
        { t: "Silent mastermind", s: "I like planning everything carefully.", r: { producer: 4, director: 2 } },
        { t: "Visual perfectionist", s: "I care how every frame looks.", r: { camera: 4, design: 2 } },
        { t: "Chaos fixer", s: "I help when everything goes wrong.", r: { crew: 4, producer: 2 } }
      ]
    },
    {
      q: "What would you tap first in a film project?",
      a: [
        { t: "Auditions", s: "I want to try a role.", r: { actor: 5 } },
        { t: "Story ideas", s: "I want to shape the plot.", r: { writer: 4, director: 1 } },
        { t: "Camera tests", s: "I want to make it look expensive.", r: { camera: 5 } },
        { t: "Poster concepts", s: "I want the club to look professional.", r: { design: 5, marketing: 1 } }
      ]
    },
    {
      q: "A scene feels boring. What do you fix?",
      a: [
        { t: "Performance", s: "Make the character feel real.", r: { actor: 5, director: 1 } },
        { t: "Pacing", s: "Cut it tighter and make it hit harder.", r: { editor: 5 } },
        { t: "Sound", s: "Add tension, silence, and impact.", r: { sound: 5, editor: 1 } },
        { t: "Lighting and angle", s: "Make the shot more cinematic.", r: { camera: 5 } }
      ]
    },
    {
      q: "Your best club fair move would be:",
      a: [
        { t: "Be the face of the club", s: "Talk to people and pull them in.", r: { actor: 4, marketing: 2 } },
        { t: "Run the sign-up flow", s: "Keep things organized and moving.", r: { producer: 4, crew: 1 } },
        { t: "Show the cool visuals", s: "Make people stop and look.", r: { design: 4, marketing: 2 } },
        { t: "Film the whole thing", s: "Capture the moment for later.", r: { camera: 4, editor: 1 } }
      ]
    },
    {
      q: "Pick a movie job that sounds fun.",
      a: [
        { t: "Playing the lead", s: "Being the person everyone remembers.", r: { actor: 6 } },
        { t: "Directing the scene", s: "Guiding actors, camera, and tone.", r: { director: 5 } },
        { t: "Editing the final cut", s: "Turning raw clips into a real film.", r: { editor: 5 } },
        { t: "Building the world", s: "Props, costumes, posters, and style.", r: { design: 4, crew: 1 } }
      ]
    },
    {
      q: "What sounds least scary to you?",
      a: [
        { t: "Acting in front of people", s: "I could handle it.", r: { actor: 5 } },
        { t: "Taking responsibility", s: "I can keep a team on track.", r: { producer: 4, director: 1 } },
        { t: "Learning camera settings", s: "I like technical stuff.", r: { camera: 4, sound: 1 } },
        { t: "Spending time on details", s: "I like making things clean.", r: { editor: 3, design: 2 } }
      ]
    },
    {
      q: "Choose your cinematic power.",
      a: [
        { t: "Presence", s: "People notice when I enter.", r: { actor: 5 } },
        { t: "Vision", s: "I know what the final scene should feel like.", r: { director: 4, writer: 1 } },
        { t: "Precision", s: "I notice small mistakes fast.", r: { editor: 3, camera: 2 } },
        { t: "Atmosphere", s: "I can make something feel cool or eerie.", r: { sound: 3, design: 2 } }
      ]
    },
    {
      q: "A deadline is close. What do you do?",
      a: [
        { t: "Show up and perform", s: "Give the scene what it needs.", r: { actor: 4, crew: 1 } },
        { t: "Organize everyone", s: "Make the plan clear.", r: { producer: 5 } },
        { t: "Fix the edit", s: "Get the final version ready.", r: { editor: 5 } },
        { t: "Help wherever needed", s: "Props, lights, setup, anything.", r: { crew: 5 } }
      ]
    },
    {
      q: "What do you want people to say after seeing your work?",
      a: [
        { t: "That character was so good", s: "I want my performance remembered.", r: { actor: 5 } },
        { t: "That shot looked insane", s: "I want visuals to stand out.", r: { camera: 4, design: 1 } },
        { t: "That story actually hit", s: "I want the idea to stay with them.", r: { writer: 4, director: 1 } },
        { t: "That whole project felt real", s: "I want the whole thing to work.", r: { producer: 3, director: 2 } }
      ]
    }
  ];
  const finderRoleDetails = {
    actor: { title: "Actor", desc: "You belong in front of the camera. You bring the scene to life, make people care, and turn a script into something the audience remembers.", line: "SFS needs actors. The next scene needs someone willing to step into it." },
    writer: { title: "Writer", desc: "You think in story, twists, characters, and moments. You give the film its reason to exist before anyone presses record.", line: "Every great scene starts with an idea someone actually writes down." },
    camera: { title: "Camera Crew", desc: "You notice framing, movement, lighting, and the way a shot feels. You help make normal locations look cinematic.", line: "A good camera crew can make a hallway feel like a movie set." },
    editor: { title: "Editor", desc: "You control the final feeling. Pacing, music, cuts, silence, timing, and polish become your tools.", line: "The edit is where random clips become a real film." },
    director: { title: "Director", desc: "You see the full picture. You guide actors, camera, tone, story, and energy so the whole project feels connected.", line: "A director turns confusion into a scene." },
    producer: { title: "Producer", desc: "You keep the project alive. Planning, schedules, people, locations, and deadlines move because someone is organizing them.", line: "A film does not happen just because it sounds cool. Producers make it real." },
    design: { title: "Designer", desc: "You shape the look of the club and the production. Posters, props, titles, thumbnails, costumes, and style are your world.", line: "Before people watch the film, they see the design." },
    sound: { title: "Sound / Music", desc: "You understand that sound can make a scene scary, emotional, funny, or powerful. You help control what the audience feels.", line: "Sometimes the strongest part of a scene is what you hear." },
    crew: { title: "Stage Crew", desc: "You are the reason filming actually works. Setup, props, lighting help, movement, and problem-solving happen because of you.", line: "The crew is what makes the set survive." },
    marketing: { title: "Marketing", desc: "You know how to make people care before they even watch. Posters, announcements, promo ideas, and recruitment are your strength.", line: "If nobody knows the club exists, even the best film stays invisible." }
  };

const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const root=$('#sfs2026'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused=reduced.matches, soundOn=false, audio=null, master=null, drone=[], volume=.32;
function sound(kind='tap'){
 if(!soundOn||!audio||document.hidden)return;
 if(kind==='route'||kind==='reveal'){
  const length=kind==='reveal'?.55:.28,buffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*length),audio.sampleRate),samples=buffer.getChannelData(0);
  for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*Math.pow(1-i/samples.length,2);
  const source=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();source.buffer=buffer;filter.type='lowpass';filter.frequency.setValueAtTime(1800,audio.currentTime);filter.frequency.exponentialRampToValueAtTime(160,audio.currentTime+length);gain.gain.value=.065;source.connect(filter);filter.connect(gain);gain.connect(master);source.start();
 }
 const presets={tap:[[440,.09,0],[880,.13,.04]],hover:[[660,.08,0]],scan:[[220,.15,0],[440,.18,.07]],route:[[110,.3,0],[165,.3,.07]],reveal:[[110,.6,0],[330,.55,.09],[440,.6,.2],[660,.65,.3]]};
 for(const [freq,dur,delay] of presets[kind]||presets.tap){const t=audio.currentTime+delay,o=audio.createOscillator(),g=audio.createGain();o.type=kind==='route'?'triangle':'sine';o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(freq*(kind==='route'?.5:1.12),t+dur);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(kind==='hover'?.022:.075,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.02);}
}
async function toggleSound(){
 try{if(!audio){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw Error();audio=new AC();master=audio.createGain();master.gain.value=volume;const comp=audio.createDynamicsCompressor();master.connect(comp);comp.connect(audio.destination);[55,82.4,110.15].forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=f;g.gain.value=.007/(i+1);o.connect(g);g.connect(master);o.start();drone.push(o)});}
 soundOn=!soundOn;if(soundOn){await audio.resume();master.gain.setTargetAtTime(volume,audio.currentTime,.15);sound('reveal');}else{master.gain.setTargetAtTime(0,audio.currentTime,.04);await audio.suspend();}$('#sfsSoundToggle').textContent=soundOn?'Sound On':'Sound Off';$('#sfsSoundToggle').setAttribute('aria-pressed',soundOn);
 }catch(e){soundOn=false;$('#sfsSoundToggle').textContent='Audio unavailable';$('#sfsSoundToggle').setAttribute('aria-pressed','false');}
}
$('#sfsSoundToggle').setAttribute('aria-pressed','false');$('#sfsSoundToggle').addEventListener('click',toggleSound);
const soundVolume=document.createElement('label');soundVolume.className='sound-volume';soundVolume.innerHTML='Volume <input aria-label="Sound volume" type="range" min="0" max="100" value="32">';$('#sfsSoundToggle').after(soundVolume);soundVolume.querySelector('input').addEventListener('input',e=>{volume=Number(e.target.value)/100;if(master&&soundOn)master.gain.setTargetAtTime(volume,audio.currentTime,.08)});
document.addEventListener('visibilitychange',()=>{if(!audio)return;if(document.hidden)audio.suspend();else if(soundOn)audio.resume().catch(()=>{});});
function setMotion(){document.documentElement.classList.toggle('motion-paused',motionPaused);$('#motionToggle').textContent=motionPaused?'Resume motion':'Pause motion';$('#motionToggle').setAttribute('aria-pressed',motionPaused);}
$('#motionToggle').addEventListener('click',()=>{motionPaused=!motionPaused;setMotion();});reduced.addEventListener('change',e=>{motionPaused=e.matches;setMotion()});setMotion();
const pages={home:$('#sfsHomePage'),finder:$('#sfsFinderPage'),crew:$('#sfsCrewPage')};let currentPage='home';
function route(){const hash=location.hash||'#hero';currentPage=hash==='#role-finder'?'finder':hash==='#crew-page'||hash==='#crewSpotlight'?'crew':'home';for(const [name,el]of Object.entries(pages)){el.classList.toggle('hidden-page',name!==currentPage)}$$('.sfs-nav a').forEach(a=>{a.removeAttribute('aria-current');if(a.getAttribute('href')===hash)a.setAttribute('aria-current','page')});document.title=(currentPage==='finder'?'Find Your Role':currentPage==='crew'?'Meet the Crew':'Your scene is next')+' — Sinclair Film Studios';$('#navigation').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');const target=document.getElementById(hash.slice(1));if(target&&!target.closest('.hidden-page'))target.scrollIntoView({behavior:motionPaused?'instant':'smooth',block:'start'});else window.scrollTo({top:0,behavior:'instant'});}
window.addEventListener('hashchange',route);route();$('.menu-toggle').addEventListener('click',()=>{const open=$('#navigation').classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',open)});document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#navigation').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false')}});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{sound('route');if(a.getAttribute('href')===location.hash)route()}));
$$('.role-tabs button').forEach((b,i)=>{b.setAttribute('aria-pressed',i===0);b.addEventListener('click',()=>{$$('.role-tabs button').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)});const d=roleData[b.dataset.role];$('#roleOutput').innerHTML='<p class="mini">Now showing</p><h3>'+d[0]+'</h3><p>'+d[1]+'</p>';$('#deptNumber').textContent=String(i+1).padStart(2,'0');$('#deptWord').textContent=['ACT.','WRITE.','FILM.','EDIT.','MAKE.','BUILD.'][i];sound('scan')})});
let answers=[],locked=false,timers=[],generation=0;
function later(fn,ms){const gen=generation;timers.push(setTimeout(()=>{if(gen===generation)fn()},ms));}
function clearTimers(){generation++;timers.forEach(clearTimeout);timers=[];}
function resetQuiz(){clearTimers();answers=[];locked=false;$('#finderIntro').classList.remove('active');$('#finderResult').classList.remove('active','result-ready');$('#scanCutscene').classList.remove('active');$('#finderQuiz').classList.add('active');showQuestion();sound('scan');}
function showQuestion(){locked=false;const n=answers.length,item=finderQuestions[n];$('#finderCount').textContent=`Question ${n+1} / ${finderQuestions.length}`;$('#finderMode').textContent=n<3?'Signal calibration':n<7?'Pattern analysis':'Role lock';$('#finderProgress').style.width=n*10+'%';$('.finder-progress').setAttribute('aria-valuenow',n);$('#finderQuestion').textContent=item.q;$('#finderOptions').replaceChildren();item.a.forEach((a,i)=>{const b=document.createElement('button');b.className='finder-option';b.type='button';b.innerHTML=a.t+'<small>'+a.s+'</small>';b.addEventListener('click',()=>choose(i));$('#finderOptions').append(b)});$('#finderBack').disabled=n===0;$('#finderQuestion').focus({preventScroll:true});}
function choose(index){if(locked)return;locked=true;answers.push(index);$$('.finder-option').forEach(b=>b.disabled=true);$('#finderBack').disabled=true;$('#finderProgress').style.width=answers.length*10+'%';$('.finder-progress').setAttribute('aria-valuenow',answers.length);sound('scan');later(()=>{if(answers.length===finderQuestions.length)showResult();else showQuestion()},motionPaused?0:170);}
function calculate(choices){const scores=Object.fromEntries(Object.keys(finderRoleDetails).map(k=>[k,0]));scores.actor=3;choices.forEach((a,i)=>{for(const[k,v]of Object.entries(finderQuestions[i].a[a].r))scores[k]+=v});const sorted=Object.entries(scores).sort((a,b)=>b[1]-a[1]);const winner=scores.actor>=sorted[0][1]-2?'actor':sorted[0][0];return{scores,sorted,winner};}
function showResult(){const {scores,sorted,winner}=calculate(answers),d=finderRoleDetails[winner];$('#finderQuiz').classList.remove('active');$('#finderResult').classList.add('active');$('#resultRole').textContent=d.title;$('#resultDesc').textContent=d.desc;$('#resultTagline').textContent=d.line;$('#resultBars').innerHTML=sorted.slice(0,5).map(([k,v])=>{const p=Math.round(v/Math.max(...Object.values(scores),1)*100);return '<div class="bar-row"><span>'+finderRoleDetails[k].title+'</span><div class="bar-track"><div class="bar-fill" style="width:'+p+'%"></div></div><span>'+p+'%</span></div>'}).join('');
 const phases=[['Collecting your choices','Mapping your creative instincts.'],['Cross-matching SFS roles','Comparing performance, story, visuals, and production.'],['Role confirmed','Your primary match and secondary fits are ready.']];$('#scanRolesStrip').innerHTML=sorted.slice(0,6).map(([k])=>'<span class="scan-role-pill">'+finderRoleDetails[k].title+'</span>').join('');const reveal=()=>{$('#scanCutscene').classList.remove('active');$('#finderResult').classList.add('result-ready');$('#resultRole').focus({preventScroll:true});sound('reveal')};if(motionPaused){reveal();return}$('#scanCutscene').classList.add('active');phases.forEach(([t,s],i)=>later(()=>{$('#scanPhaseTitle').textContent=t;$('#scanPhaseText').textContent=s;$('#scanMeterFill').style.width=(i+1)/3*100+'%';sound('scan')},i*650));later(reveal,2150);
}
$('#startFinder').addEventListener('click',resetQuiz);$('#tryAgain').addEventListener('click',resetQuiz);$('#finderBack').addEventListener('click',()=>{if(!answers.length||locked)return;answers.pop();showQuestion();sound('tap')});
const scoreNote=document.createElement('p');scoreNote.className='score-note';scoreNote.textContent='Relative role scores, not probabilities. This original club quiz gives acting a small recruitment preference. Explore any department that interests you.';$('#resultBars').after(scoreNote);
let crewActive=0,crewPaused=false,angle=-Math.PI/2,last=0;const portraits=$$('.crew-portrait-button');
function selectCrew(i,scroll=true){crewActive=i;$$('.crew-spot-card').forEach((x,j)=>x.classList.toggle('active',i===j));$$('[data-crew-select]').forEach(b=>{const on=Number(b.dataset.crewSelect)===i;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on)});if(scroll)$('#crewSpotlight').scrollIntoView({behavior:motionPaused?'instant':'smooth',block:'start'});sound('hover');}
$$('[data-crew-select]').forEach(b=>b.addEventListener('click',()=>selectCrew(Number(b.dataset.crewSelect))));$('#crewPauseBtn').setAttribute('aria-pressed','false');$('#crewPauseBtn').addEventListener('click',()=>{crewPaused=!crewPaused;$('#crewPauseBtn').textContent=crewPaused?'Resume Orbit':'Pause Orbit';$('#crewPauseBtn').setAttribute('aria-pressed',crewPaused)});selectCrew(0,false);
function orbit(t){const dt=Math.min(t-last||16,40);last=t;if(currentPage==='crew'&&!document.hidden){if(!motionPaused&&!crewPaused)angle+=dt*.00013;const track=$('#crewOrbitTrack'),w=track.clientWidth,h=track.clientHeight;portraits.forEach((b,i)=>{const a=angle+i*2*Math.PI/portraits.length,depth=(Math.sin(a)+1)/2,scale=.78+depth*.22;const x=w/2+Math.cos(a)*(w-b.offsetWidth)/2.1-b.offsetWidth/2,y=h/2+Math.sin(a)*(h-b.offsetHeight)/2.3-b.offsetHeight/2;b.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale}) rotateY(${Math.cos(a)*-12}deg)`;b.style.zIndex=String(Math.round(depth*20));});}requestAnimationFrame(orbit)}requestAnimationFrame(orbit);
let word=0;setInterval(()=>{if(motionPaused||document.hidden||currentPage!=='home')return;$('#rotatingWord').textContent=['movie.','trailer.','set.','premiere.','story.'][++word%5]},3500);
window.addEventListener('pointermove',e=>{if(motionPaused||e.pointerType!=='mouse')return;$('.hero-art').style.setProperty('--hx',(e.clientX/innerWidth-.5)*-16+'px');$('.hero-art').style.setProperty('--hy',(e.clientY/innerHeight-.5)*-10+'px')},{passive:true});
function progress(){const max=document.documentElement.scrollHeight-innerHeight;$('#sfsProgress').style.width=(max>0?scrollY/max*100:0)+'%'}window.addEventListener('scroll',progress,{passive:true});progress();
if('IntersectionObserver'in window){const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');obs.unobserve(e.target)}})},{threshold:.12});$$('.reveal').forEach(e=>obs.observe(e));}
let hoverAt=0;document.addEventListener('pointerover',e=>{if(!e.target.closest('button,a')||Date.now()-hoverAt<120)return;hoverAt=Date.now();sound('hover')});document.addEventListener('click',e=>{if(e.target.closest('button')&&!e.target.closest('#sfsSoundToggle'))sound('tap')});
$('#copyInvite').addEventListener('click',async()=>{const url='https://classroom.google.com/c/ODQ2OTIzODA3MjM0?cjc=sgvedclk';try{await navigator.clipboard.writeText(url);$('#copyStatus').textContent='Invite copied. See you on set.'}catch(e){$('#copyStatus').textContent='Copy this invite: '+url}});
