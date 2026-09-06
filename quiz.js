'use strict';
// Stratified sampling: ten project contexts, four role opportunities each.
// The cyclic incidence design exposes every role exactly four times per run.
const ROLE_IDS=['actor','writer','camera','editor','director','producer','design','sound','crew','marketing'];
const PROJECTS=['a mystery short','a school event promo','a comedy scene','a sci-fi adventure','a music video','a behind-the-scenes film','a dramatic scene','a film-festival entry','a suspense trailer','an original mini-series'];
const PROMPTS=[
 'You’re helping with {p}. Which job sounds most fun?',
 'There’s one free afternoon for {p}. How would you spend it?',
 'Your team is starting {p}. What would you volunteer for?',
 'You can learn one new skill for {p}. Pick one.',
 'Your friends need help with {p}. What feels most like you?',
 'Imagine the finished version of {p}. What would make you proud?'
];
const ANSWERS={
 actor:['Bring a character to life','Rehearse a scene with a friend','Try out for a part','Act naturally on camera','Jump into the scene','My performance felt real'],
 writer:['Invent the story and dialogue','Write a surprising new scene','Draft the first script','Write dialogue people believe','Think of a clever story twist','My story stayed with people'],
 camera:['Choose the shots and angles','Try some camera movements','Film the first camera tests','Use lighting and camera settings','Find a beautiful angle','My shots looked cinematic'],
 editor:['Turn clips into a finished scene','Make a rough cut of the footage','Organize clips for the edit','Make cuts flow smoothly','Tighten a scene that feels slow','My edit made the story land'],
 director:['Guide the whole scene','Plan how the scene should feel','Help everyone share one vision','Give useful creative direction','Connect everybody’s ideas','The whole scene felt connected'],
 producer:['Make the shoot actually happen','Build a plan for the next shoot','Sort the schedule and locations','Keep a project on track','Work out who needs to be where','Our team finished together'],
 design:['Build the look of the world','Sketch costumes, props, or titles','Create a visual mood board','Design striking props or graphics','Make something look distinctive','Our visual style stood out'],
 sound:['Build the sound and atmosphere','Try music and sound effects','Test microphones and ambience','Record clear sound and mix music','Find the sound the scene needs','The audio gave people chills'],
 crew:['Get the set ready for action','Prepare props and equipment','Help set up the filming space','Handle set equipment confidently','Solve a hands-on problem','The shoot ran smoothly'],
 marketing:['Get people excited to watch','Make a teaser people would share','Plan how to announce the film','Promote a film to an audience','Find a way to draw people in','People were excited to watch']
};
const QUESTION_BANK=PROJECTS.flatMap((p,group)=>PROMPTS.map((template,variant)=>({id:`${group}-${variant}`,group,variant,q:template.replace('{p}',p),a:[0,1,3,6].map(offset=>{const role=ROLE_IDS[(group+offset)%10];return{role,t:ANSWERS[role][variant],r:{[role]:3}}})})));
function shuffle(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function createMission(rng=Math.random){const variants=shuffle([0,1,2,3,4,5,Math.floor(rng()*6),Math.floor(rng()*6),Math.floor(rng()*6),Math.floor(rng()*6)],rng);return shuffle(PROJECTS.map((_,g)=>{const q=QUESTION_BANK.find(q=>q.group===g&&q.variant===variants[g]);return{...q,a:shuffle(q.a,rng)}}),rng)}
function scoreMission(questions,answers){const scores=Object.fromEntries(ROLE_IDS.map(r=>[r,0])),exposure={...scores},evidence=Object.fromEntries(ROLE_IDS.map(r=>[r,[]]));questions.forEach((q,i)=>{q.a.forEach(a=>exposure[a.role]+=3);if(answers[i]!==undefined){const a=q.a[answers[i]];if(!a)throw Error('Invalid answer');scores[a.role]+=3;evidence[a.role].push({q:q.q,a:a.t})}});const ranked=ROLE_IDS.map(role=>({role,score:scores[role],affinity:Math.round(scores[role]/(exposure[role]||1)*100),evidence:evidence[role]})).sort((a,b)=>b.affinity-a.affinity);const tied=ranked.filter(r=>r.affinity===ranked[0].affinity).map(r=>r.role);return{ranked,tied,scores,exposure};}
if(typeof module!=='undefined')module.exports={ROLE_IDS,QUESTION_BANK,createMission,scoreMission};
