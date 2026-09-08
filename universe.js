/* Self-contained model scenes. Stars and navigation run independently. */
(() => {
  'use strict';
  const fx = window.SFSExperience, T = window.THREE;
  const TWO_PI = Math.PI * 2, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function kepler(mean, e) { let E = mean; for (let i = 0; i < 5; i++) E -= (E - e * Math.sin(E) - mean) / (1 - e * Math.cos(E)); return E; }
  const names = ['Kaves', 'Hudson', 'Manish', 'Zohaib', 'Saksham'], colors = [0x88eaff, 0xffcd96, 0xa9a2ff, 0x8aefc5, 0xffa8d7];
  const scenes = [];

  function controls(stage, state, tap) {
    const pointers = new Map(); let down, traveled = 0, pinch = 0;
    stage.style.touchAction = 'none';
    stage.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    stage.addEventListener('pointerdown', e => { if (e.button > 0) return; pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); down = { x: e.clientX, y: e.clientY }; traveled = 0; state.dragging = true; stage.setPointerCapture(e.pointerId); if (pointers.size === 2) { const a = [...pointers.values()]; pinch = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); } });
    stage.addEventListener('pointermove', e => { const previous = pointers.get(e.pointerId); if (!previous) return; const dx = e.clientX - previous.x, dy = e.clientY - previous.y; traveled += Math.hypot(dx, dy); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) { const a = [...pointers.values()], distance = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); if (pinch > 0) state.zoom = clamp(state.zoom * pinch / Math.max(distance, 1), .7, 1.4); pinch = distance; }
      else { state.yaw += dx * .006; state.pitch = clamp(state.pitch + dy * .005, -.95, .95); state.vy = dx * .12; state.vx = dy * .09; }
      state.dirty = true;
    });
    const end = e => { const wasSingle = pointers.size === 1; pointers.delete(e.pointerId); if (e.type === 'pointerup' && wasSingle && traveled < 8 && down) tap(e.clientX, e.clientY); state.dragging = pointers.size > 0; if (pointers.size < 2) pinch = 0; down = null; };
    stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end); stage.addEventListener('lostpointercapture', () => { if (!pointers.size) state.dragging = false; });
    stage.addEventListener('keydown', e => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '-', '=', 'Enter', ' '].includes(e.key)) e.preventDefault(); if (e.key === 'ArrowLeft') state.yaw -= .16; if (e.key === 'ArrowRight') state.yaw += .16; if (e.key === 'ArrowUp') state.pitch -= .12; if (e.key === 'ArrowDown') state.pitch += .12; if (['+', '='].includes(e.key)) state.zoom = clamp(state.zoom - .1, .7, 1.4); if (e.key === '-') state.zoom = clamp(state.zoom + .1, .7, 1.4); if (['Enter', ' '].includes(e.key)) tap(null, null); state.dirty = true; });
  }

  // Film-specific fallback remains interactive without a GPU.
  function fallback(stage,type){
    const canvas=document.createElement('canvas');stage.replaceChildren(canvas);const c=canvas.getContext('2d');if(!c)return;
    stage.dataset.renderer='canvas';stage.dataset.ready='true';
    const state={yaw:0,pitch:.3,zoom:1,vy:0,vx:0,dirty:true},targets=[];let age=0;
    const portraits=names.map(n=>{const img=new Image();img.src=window.SFSPortraits?.[n.toLowerCase()]||('assets/'+n.toLowerCase()+'.webp');return img;});
    controls(stage,state,(x,y)=>{const r=stage.getBoundingClientRect();if(type==='hero'){fx.emit('discover',{id:'core'});fx.emit('cue',{kind:'core'});fx.burst(x||r.x+r.width/2,y||r.y+r.height/2,1.8);}else{const hit=x===null?{i:0}:targets.find(t=>Math.abs(t.x+r.x-x)<30&&Math.abs(t.y+r.y-y)<42);if(hit)fx.emit('crew-picked',{index:hit.i});}});
    fx.tick((dt,global)=>{const r=stage.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>innerHeight)return;if(!global.paused&&!(type==='crew'&&global.crewPaused))age+=dt;
      const dpr=Math.min(devicePixelRatio||1,1.5);if(canvas.width!==Math.round(r.width*dpr)||canvas.height!==Math.round(r.height*dpr)){canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);}
      c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,r.width,r.height);const cx=r.width/2,cy=r.height/2,scale=Math.min(r.width,r.height)/440/state.zoom;c.save();c.translate(cx,cy);c.scale(scale,scale);if(type==='hero')c.rotate(Math.sin(state.yaw)*.15);c.strokeStyle='#b7c9e7';c.lineWidth=1.5;targets.length=0;
      if(type==='hero'){
        c.fillStyle='#132039';c.fillRect(-90,-30,140,95);c.strokeRect(-90,-30,140,95);c.strokeRect(50,-7,50,38);c.strokeRect(-58,93,95,8);c.strokeRect(-15,65,10,28);
        const g=c.createLinearGradient(100,0,210,0);g.addColorStop(0,'#b6d6ff66');g.addColorStop(1,'#c1c4ff05');c.fillStyle=g;c.beginPath();c.moveTo(100,-7);c.lineTo(230,-100);c.lineTo(230,115);c.lineTo(100,31);c.fill();
        for(const [j,x]of [-68,40].entries()){c.save();c.translate(x,-75);c.rotate(-age*(1+j*.2)+state.yaw);c.fillStyle='#8eabc5';c.beginPath();c.arc(0,0,48,0,TWO_PI);c.fill();c.fillStyle='#081123';for(let k=0;k<5;k++){const a=k*TWO_PI/5;c.beginPath();c.arc(Math.cos(a)*29,Math.sin(a)*29,12,0,TWO_PI);c.fill();}c.fillStyle='#e7f2ff';c.beginPath();c.arc(0,0,5,0,TWO_PI);c.fill();c.restore();}
        c.font='bold 24px Arial';c.fillStyle='#e7efff';c.fillText('SFS',-50,27);c.font='9px monospace';c.fillText('35 MM / DREAM MACHINE',-69,48);
      }else{
        c.fillStyle='#10213a';c.fillRect(-47,-40,94,62);c.strokeRect(-47,-40,94,62);c.fillStyle='#c8d7ef';c.font='bold 13px Arial';c.textAlign='center';c.fillText('SINCLAIR',0,-15);c.font='9px monospace';c.fillText('FILM STUDIOS',0,2);for(let i=0;i<6;i++){c.fillStyle=i%2?'#d3e3f5':'#192138';c.fillRect(-47+i*16,-54,16,12);}
        for(let i=0;i<5;i++){const rx=100+i*16,ry=rx*.45,rot=state.yaw*.4+i*.2;c.save();c.rotate(rot);c.strokeStyle=['#9acbf699','#c4a4ea99','#a7dbcd99'][i%3];c.lineWidth=8;c.setLineDash([4,3]);c.beginPath();c.ellipse(0,0,rx,ry,0,0,TWO_PI);c.stroke();c.setLineDash([]);c.restore();const a=age*.22/(1+i*.18)+i*TWO_PI/5,ex=rx*Math.cos(a),ey=ry*Math.sin(a),x=ex*Math.cos(rot)-ey*Math.sin(rot),y=ex*Math.sin(rot)+ey*Math.cos(rot);c.fillStyle='#bcd3ee';c.fillRect(x-20,y-28,40,54);if(portraits[i].complete&&portraits[i].naturalWidth)c.drawImage(portraits[i],x-17,y-25,34,46);c.font='10px Arial';c.fillText(names[i],x,y+40);targets.push({x:cx+x*scale,y:cy+y*scale,i});}
      }c.restore();stage.dataset.frames=String((Number(stage.dataset.frames)||0)+1);state.dirty=false;
    });
  }

  function glowTexture() {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128; const ctx = canvas.getContext('2d'), g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, '#ffffff'); g.addColorStop(.12, '#ffffffaa'); g.addColorStop(.35, '#ffffff33'); g.addColorStop(1, '#ffffff00'); ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128); return new T.CanvasTexture(canvas);
  }
  let sharedGlow;
  function glow(parent, color, size, opacity = .6) { if (!sharedGlow) sharedGlow = glowTexture(); const sprite = new T.Sprite(new T.SpriteMaterial({ map: sharedGlow, color, transparent: true, opacity, depthWrite: false, blending: T.AdditiveBlending })); sprite.scale.set(size, size, 1); parent.add(sprite); return sprite; }

  function labelTexture(lines, slate=false) {
    const c=document.createElement('canvas');c.width=768;c.height=480;const x=c.getContext('2d');
    x.fillStyle='#0c1423';x.fillRect(0,0,768,480);x.strokeStyle='#859cae';x.lineWidth=3;x.strokeRect(15,15,738,450);
    x.fillStyle='#e8edf5';x.textAlign='center';x.font='bold 56px Arial';x.fillText(lines[0],384,115);
    x.font='26px monospace';x.fillStyle='#a4d9ef';x.fillText(lines[1],384,172);
    x.strokeStyle='#607d92';x.beginPath();x.moveTo(35,215);x.lineTo(733,215);x.moveTo(384,215);x.lineTo(384,445);x.stroke();
    x.font='24px monospace';x.fillText('SCENE',200,266);x.fillText('TAKE',570,266);x.font='80px monospace';x.fillStyle='#fff';x.fillText('01',200,380);x.fillText('∞',570,380);
    const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;
  }
  function reel(radius, color) {
    const group=new T.Group(),shape=new T.Shape();shape.absarc(0,0,radius,0,TWO_PI,false);
    const center=new T.Path();center.absarc(0,0,radius*.13,0,TWO_PI,true);shape.holes.push(center);
    for(let j=0;j<5;j++){const a=j*TWO_PI/5,h=new T.Path();h.absarc(Math.cos(a)*radius*.57,Math.sin(a)*radius*.57,radius*.23,0,TWO_PI,true);shape.holes.push(h);}
    const geo=new T.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:true,bevelSize:.012,bevelThickness:.01,bevelSegments:1,steps:1,curveSegments:32});
    const mat=new T.MeshStandardMaterial({color,metalness:.83,roughness:.28});
    [-.11,.11].forEach(z=>{const disc=new T.Mesh(geo,mat);disc.position.z=z;group.add(disc);});
    const wound=new T.Mesh(new T.CylinderGeometry(radius*.89,radius*.89,.17,64),new T.MeshStandardMaterial({color:0x101521,metalness:.5,roughness:.6}));wound.rotation.x=Math.PI/2;group.add(wound);
    const rim=new T.Mesh(new T.TorusGeometry(radius,.009,5,80),new T.MeshBasicMaterial({color:0xb8d8ec}));rim.position.z=.15;group.add(rim);
    const hub=new T.Mesh(new T.CylinderGeometry(radius*.11,radius*.11,.4,20),mat);hub.rotation.x=Math.PI/2;group.add(hub);return group;
  }
  function filmTexture(color='#aacdff') {
    const c=document.createElement('canvas');c.width=256;c.height=128;const x=c.getContext('2d');
    x.fillStyle=color;x.globalAlpha=.75;x.fillRect(0,0,256,128);x.globalAlpha=1;
    x.clearRect(13,23,230,82);x.fillStyle='#1b294cb8';x.fillRect(13,23,230,82);
    x.strokeStyle=color;x.lineWidth=2;x.strokeRect(20,29,216,70);
    for(let i=0;i<8;i++){x.clearRect(i*32+8,4,16,12);x.clearRect(i*32+8,112,16,12);}
    x.strokeStyle='#e8ecff60';x.beginPath();x.moveTo(34,82);x.lineTo(83,43);x.lineTo(117,75);x.lineTo(173,39);x.lineTo(224,82);x.stroke();
    const t=new T.CanvasTexture(c);t.wrapS=T.RepeatWrapping;t.colorSpace=T.SRGBColorSpace;return t;
  }
  function filmRibbon(points,width,color,frames=16) {
    const pos=[],uv=[],ind=[];
    points.forEach((p,i)=>{pos.push(p.x,p.y-width/2,p.z,p.x,p.y+width/2,p.z);uv.push(i/(points.length-1)*frames,0,i/(points.length-1)*frames,1);if(i<points.length-1){const n=i*2;ind.push(n,n+1,n+2,n+1,n+3,n+2);}});
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ind);g.computeVertexNormals();
    const mesh=new T.Mesh(g,new T.MeshBasicMaterial({map:filmTexture(color),transparent:true,opacity:.58,side:T.DoubleSide,depthWrite:false}));return mesh;
  }
  function clapper() {
    const g=new T.Group();const body=new T.Mesh(new T.BoxGeometry(1.7,1.05,.14),new T.MeshStandardMaterial({color:0x151d30,metalness:.4,roughness:.35}));g.add(body);
    const face=new T.Mesh(new T.PlaneGeometry(1.66,1.01),new T.MeshBasicMaterial({map:labelTexture(['SINCLAIR','FILM STUDIOS']),side:T.DoubleSide}));face.position.z=.08;g.add(face);
    const hinge=new T.Group();hinge.position.set(-.83,.57,0);g.add(hinge);
    const top=new T.Mesh(new T.BoxGeometry(1.7,.2,.16),new T.MeshStandardMaterial({color:0xe5e7e9,metalness:.25,roughness:.45}));top.position.x=.83;hinge.add(top);
    for(let i=0;i<7;i++){const stripe=new T.Mesh(new T.PlaneGeometry(.14,.205),new T.MeshBasicMaterial({color:0x152131}));stripe.position.set(.08+i*.25,0,.084);stripe.rotation.z=-.42;hinge.add(stripe);}
    g.userData.hinge=hinge;return g;
  }
  class SceneView {
    constructor(stage, type) {
      this.stage = stage; this.type = type; this.state = { yaw: type === 'hero' ? -.25 : 0, pitch: type === 'hero' ? -.18 : .18, zoom: 1, vy: 0, vx: 0, dragging: false, dirty: true }; this.age = 0; this.lastSize = ''; this.visible = false; this.pickables = []; this.pulse = 0;
      try {
        this.renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default', preserveDrawingBuffer: false }); this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6)); this.renderer.setClearColor(0x000000, 0); this.renderer.outputColorSpace = T.SRGBColorSpace;
        this.scene = new T.Scene(); this.camera = new T.PerspectiveCamera(type === 'hero' ? 43 : 46, 1, .1, 60); this.world = new T.Group(); this.scene.add(this.world);
        this.scene.add(new T.AmbientLight(0x91aaff, 2)); const l = new T.PointLight(0x93dcff, 45, 30); l.position.set(2, 4, 6); this.scene.add(l); const p = new T.PointLight(0xb37eff, 26, 20); p.position.set(-4, -2, 2); this.scene.add(p);
        const studio=document.createElement('canvas');studio.width=512;studio.height=256;const studioPaint=studio.getContext('2d');studioPaint.fillStyle='#19233b';studioPaint.fillRect(0,0,512,256);studioPaint.fillStyle='#d8e5ff';studioPaint.fillRect(55,35,85,60);studioPaint.fillStyle='#b3a2d8';studioPaint.fillRect(280,40,45,120);studioPaint.fillStyle='#d3b3a0';studioPaint.fillRect(410,80,80,40);const env=new T.CanvasTexture(studio);env.mapping=T.EquirectangularReflectionMapping;env.colorSpace=T.SRGBColorSpace;const pmrem=new T.PMREMGenerator(this.renderer);this.environment=pmrem.fromEquirectangular(env);this.scene.environment=this.environment.texture;env.dispose();pmrem.dispose();
        this.ray = new T.Raycaster(); this.pointer = new T.Vector2();
        if (type === 'hero') this.buildHero(); else this.buildCrew();
        stage.replaceChildren(this.renderer.domElement); stage.dataset.renderer = 'webgl';
        controls(stage, this.state, (x, y) => this.pick(x, y));
        this.renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); this.lost = true; stage.dataset.contextLost = 'true'; });
        this.renderer.domElement.addEventListener('webglcontextrestored', () => { this.lost = false; this.state.dirty = true; delete stage.dataset.contextLost; });
        new ResizeObserver(() => this.resize()).observe(stage);
        new IntersectionObserver(es => { this.visible = es[0].isIntersecting; if (this.visible) { this.resize(); this.state.dirty = true; } }, { rootMargin: '60px' }).observe(stage);
        fx.on('route', () => { this.resize(); this.state.dirty = true; }); fx.on('quality', () => { this.renderer.setPixelRatio(fx.state.quiet ? 1 : Math.min(devicePixelRatio || 1, 1.6)); this.lastSize = ''; this.resize(); });
        fx.on('burst', () => { this.pulse = Math.min(this.pulse + .1, 1); });
        fx.tick((dt, s) => this.frame(dt, s)); this.resize(); scenes.push(this);
      } catch (error) { console.warn('3D scene fallback:', error.message); if (this.renderer) this.renderer.dispose(); fallback(stage, type); }
    }
    resize() { const r = this.stage.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return; const key = `${Math.round(r.width)}x${Math.round(r.height)}`; if (key === this.lastSize) return; this.lastSize = key; this.renderer.setSize(r.width, r.height, false); this.camera.aspect = r.width / r.height; this.camera.updateProjectionMatrix(); this.state.dirty = true; }
    buildHero() {
      this.projector=new T.Group();this.projector.position.set(-.55,-.12,0);this.world.add(this.projector);
      const metal=new T.MeshStandardMaterial({color:0x26334b,metalness:.8,roughness:.28}),silver=new T.MeshStandardMaterial({color:0x9caebc,metalness:.85,roughness:.25});
      const box=(w,h,d,mat,x,y,z)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);this.projector.add(m);return m;};
      box(1.75,1.12,.75,metal,0,0,0);box(1.6,.97,.025,metal,0,0,.4);
      for(const x of [-.79,.79])for(const y of [-.47,.47]){const screw=new T.Mesh(new T.CylinderGeometry(.025,.025,.02,12),silver);screw.rotation.x=Math.PI/2;screw.position.set(x,y,.429);this.projector.add(screw);}
      for(let i=0;i<2;i++){const dial=new T.Mesh(new T.CylinderGeometry(.085,.085,.06,28),silver);dial.rotation.x=Math.PI/2;dial.position.set(-.62+i*.27,-.39,.46);this.projector.add(dial);const notch=new T.Mesh(new T.BoxGeometry(.012,.057,.01),new T.MeshBasicMaterial({color:0x111828}));notch.position.set(-.62+i*.27,-.39,.496);notch.rotation.z=.4+i;this.projector.add(notch);}
      const plaque=new T.Mesh(new T.PlaneGeometry(.98,.61),new T.MeshBasicMaterial({map:labelTexture(['SFS','35 MM · DREAM MACHINE'])}));plaque.position.set(-.22,0,.42);this.projector.add(plaque);
      for(let i=0;i<8;i++)box(.024,.64,.028,silver,.4+i*.045,0,.42);
      box(1.28,.11,.65,silver,0,-.94,0);box(.14,.35,.14,silver,0,-.72,0);
      this.reels=[];[-.83,.83].forEach((x,i)=>{const arm=box(.11,.74,.13,silver,x*.75,.82,-.02);arm.rotation.z=i?-.35:.35;const r=reel(.7,i?0x94aac0:0xbfc8d3);r.position.set(x,1.32,.01);this.projector.add(r);this.reels.push(r);});
      [.28,.33,.36].forEach((radius,i)=>{const lens=new T.Mesh(new T.CylinderGeometry(radius,radius,.22,48),silver);lens.rotation.z=Math.PI/2;lens.position.set(.94+i*.18,.06,0);this.projector.add(lens);});
      const glass=new T.Mesh(new T.CircleGeometry(.29,48),new T.MeshBasicMaterial({color:0xc9ecff,side:T.DoubleSide}));glass.rotation.y=Math.PI/2;glass.position.set(1.43,.06,0);this.projector.add(glass);
      this.lamp=glow(this.projector,0x91c9ff,1.45,.55);this.lamp.position.set(1.45,.06,0);
      const vertices=[1.44,.06,0,3.25,-.84,-.84,3.25,.96,-.84,1.44,.06,0,3.25,.96,-.84,3.25,.96,.84,1.44,.06,0,3.25,.96,.84,3.25,-.84,.84,1.44,.06,0,3.25,-.84,.84,3.25,-.84,-.84];
      const bg=new T.BufferGeometry();bg.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
      this.beam=new T.Mesh(bg,new T.MeshBasicMaterial({color:0x9fbaff,transparent:true,opacity:.065,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));this.projector.add(this.beam);
      const screen=new T.LineLoop(new T.BufferGeometry().setFromPoints([new T.Vector3(3.25,-.84,-.84),new T.Vector3(3.25,.96,-.84),new T.Vector3(3.25,.96,.84),new T.Vector3(3.25,-.84,.84)]),new T.LineBasicMaterial({color:0xb5c7ff,transparent:true,opacity:.55}));this.projector.add(screen);
      this.projectionCanvas=document.createElement('canvas');this.projectionCanvas.width=384;this.projectionCanvas.height=384;this.projectionTexture=new T.CanvasTexture(this.projectionCanvas);this.projectionTexture.colorSpace=T.SRGBColorSpace;
      const picture=new T.Mesh(new T.PlaneGeometry(1.68,1.8),new T.MeshBasicMaterial({map:this.projectionTexture,side:T.DoubleSide,transparent:true,opacity:.68,depthWrite:false}));picture.rotation.y=-Math.PI/2;picture.position.set(3.245,.06,0);this.projector.add(picture);
      const curve=new T.CatmullRomCurve3([new T.Vector3(-1.3,1.2,-.1),new T.Vector3(-2,-.6,.15),new T.Vector3(-1.3,-1.4,1.05),new T.Vector3(.9,-1.5,1),new T.Vector3(2.1,-.8,-.4),new T.Vector3(1.3,.8,-.5),new T.Vector3(.9,1.3,-.1)]);
      this.heroFilm=filmRibbon(curve.getPoints(240),.4,'#a7c6ef',20);this.world.add(this.heroFilm);
      this.dust=this.makeDust(700,1.2,3.5,1.4);this.world.add(this.dust);
      const hit=new T.Mesh(new T.BoxGeometry(4,3.2,2),new T.MeshBasicMaterial({visible:false}));this.world.add(hit);this.pickables.push(hit);
      this.world.userData.subject='35 mm film projector';
    }
    makeDust(count, inner, outer, thickness) {
      const data = new Float32Array(count * 3), colors = new Float32Array(count * 3); this.particleSeeds = [];
      for (let i = 0; i < count; i++) { const r = inner + Math.random() * (outer - inner), a = Math.random() * TWO_PI, y = (Math.random() - .5) * thickness; data.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3); const color = new T.Color().setHSL(.53 + Math.random() * .22, .65, .45 + Math.random() * .4); colors.set([color.r, color.g, color.b], i * 3); this.particleSeeds.push({ r, a, y }); }
      const geometry = new T.BufferGeometry(); geometry.setAttribute('position', new T.BufferAttribute(data, 3)); geometry.setAttribute('color', new T.BufferAttribute(colors, 3)); if (!sharedGlow) sharedGlow = glowTexture();
      return new T.Points(geometry, new T.PointsMaterial({ size: .055, map: sharedGlow, vertexColors: true, transparent: true, opacity: .83, depthWrite: false, blending: T.AdditiveBlending }));
    }
    buildCrew() {
      this.slate = clapper(); this.slate.position.y=.1; this.world.add(this.slate); this.orbits = []; this.world.userData.subject='Opening credits on celluloid';
      const loader = new T.TextureLoader();
      names.forEach((name, i) => {
        const a = 1.6 + i * .43, ecc = .14 + i * .028, group = new T.Group(); group.rotation.set([.22, -.24, .43, -.37, .12][i], i * .47, i * .13); this.world.add(group);
        const positions = Array.from({ length: 201 }, (_, j) => { const e = j / 200 * TWO_PI; return new T.Vector3(a * (Math.cos(e) - ecc), 0, a * Math.sqrt(1 - ecc ** 2) * Math.sin(e)); });
        const path = new T.Line(new T.BufferGeometry().setFromPoints(positions), new T.LineBasicMaterial({ color: colors[i], transparent: true, opacity: .42 })); group.add(path); const film=filmRibbon(positions,.23,"#"+colors[i].toString(16),24); group.add(film);
        const body = new T.Group(); group.add(body);
        const frame = new T.Mesh(new T.PlaneGeometry(.82, 1.05), new T.MeshBasicMaterial({ color: colors[i], side: T.DoubleSide })); frame.position.y = .58; body.add(frame);
        for(let j=0;j<5;j++)for(const side of [-1,1]){const hole=new T.Mesh(new T.PlaneGeometry(.055,.085),new T.MeshBasicMaterial({color:0x070b18,side:T.DoubleSide}));hole.position.set(side*.375,.2+j*.19,.012);body.add(hole);}
        const texture = loader.load(window.SFSPortraits[name.toLowerCase()], () => { this.state.dirty = true; }); texture.colorSpace = T.SRGBColorSpace;
        const portrait = new T.Mesh(new T.PlaneGeometry(.67, .89), new T.MeshBasicMaterial({ map: texture, side: T.DoubleSide })); portrait.position.set(0, .58, .008); body.add(portrait);
        const labelCanvas = document.createElement('canvas'); labelCanvas.width = 256; labelCanvas.height = 64; const c = labelCanvas.getContext('2d'); c.font = '500 30px Arial'; c.fillStyle = '#e3edff'; c.textAlign = 'center'; c.fillText(name, 128, 43);
        const label = new T.Mesh(new T.PlaneGeometry(1.05, .26), new T.MeshBasicMaterial({ map: new T.CanvasTexture(labelCanvas), transparent: true, side: T.DoubleSide, depthWrite: false })); label.position.set(0, 1.24, 0); body.add(label);
        const hit = new T.Mesh(new T.SphereGeometry(.58, 8, 6), new T.MeshBasicMaterial({ visible: false })); hit.position.y = .58; hit.userData.crewIndex = i; body.add(hit); this.pickables.push(hit);
        const tailGeometry = new T.BufferGeometry().setFromPoints(Array.from({ length: 36 }, () => new T.Vector3())); const tail = new T.Line(tailGeometry, new T.LineBasicMaterial({ color: colors[i], transparent: true, opacity: .75 })); group.add(tail);
        this.orbits.push({ group, body, a, ecc, mean: i * TWO_PI / 5 + .5, path, film, tail, frame, portrait, label, index: i });
      });
      fx.on('crew-selected', ({ index }) => { this.orbits.forEach(o => { o.path.material.opacity = o.index === index ? .85 : .35; o.frame.material.color.setHex(colors[o.index]); }); this.state.dirty = true; });
    }
    pick(clientX, clientY) {
      const r = this.stage.getBoundingClientRect(); if (clientX === null && this.type === 'crew') { fx.emit('crew-picked', { index: 0 }); return; }
      this.pointer.set(clientX === null ? 0 : (clientX - r.left) / r.width * 2 - 1, clientY === null ? 0 : -(clientY - r.top) / r.height * 2 + 1);
      this.ray.setFromCamera(this.pointer, this.camera); const hit = this.ray.intersectObjects(this.pickables, true)[0]; if (!hit && clientX !== null) return;
      if (this.type === 'hero') { this.pulse = 1.8; this.state.vy += .15; fx.emit('discover', { id: 'core' }); fx.emit('cue', { kind: 'core', x: clientX || r.x + r.width / 2 }); fx.burst(clientX || r.x + r.width / 2, clientY || r.y + r.height / 2, 2); }
      else if (hit) fx.emit('crew-picked', { index: hit.object.userData.crewIndex });
    }
    frame(dt, global) {
      if (!this.visible || this.lost || !this.stage.clientWidth) return;
      const paused = global.paused || (this.type === 'crew' && global.crewPaused);
      if (paused && !this.state.dirty && !this.state.dragging) return;
      const s = this.state; if (!paused) { this.age += dt; this.pulse *= Math.exp(-3 * dt); if (!s.dragging) { s.yaw += s.vy * dt; s.pitch = clamp(s.pitch + s.vx * dt, -.95, .95); s.vy *= Math.exp(-3.2 * dt); s.vx *= Math.exp(-3.2 * dt); } }
      this.world.rotation.set(s.pitch, s.yaw + (this.type === 'hero' ? Math.sin(this.age * .18) * .1 : 0), 0);
      const distance = this.type === 'hero' ? 8.4 : 9.6; this.camera.position.set(0, this.type === 'crew' ? 3.5 * s.zoom : 1 * s.zoom, distance * s.zoom); this.camera.lookAt(0, this.type === 'crew' ? .1 : 0, 0); this.camera.updateMatrixWorld();
      if (this.type === 'hero') {
        const pc=this.projectionCanvas.getContext('2d');pc.fillStyle='#11182e';pc.fillRect(0,0,384,384);pc.fillStyle='#bdccec';for(let j=0;j<65;j++){const x=(j*77.7+this.age*3)%384,y=(j*131.3)%384;pc.globalAlpha=.35+Math.sin(j+this.age)*.2;pc.fillRect(x,y,1.5,1.5);}pc.globalAlpha=1;pc.fillStyle='#dae8ff';pc.textAlign='center';pc.font='12px monospace';pc.fillText('SINCLAIR FILM STUDIOS',192,120);pc.font='italic 42px Georgia';pc.fillText('Your next',192,188);pc.fillText('film.',192,239);pc.font='10px monospace';pc.fillText('IT STARTS WITH YOU.',192,292);this.projectionTexture.needsUpdate=true;
        this.reels.forEach((r,i)=>r.rotation.z=-this.age*(i?1.3:1.1)-this.pulse*.2);
        this.heroFilm.material.map.offset.x=-this.age*.22;
        this.lamp.material.opacity=.4+this.pulse*.15+Math.sin(this.age*24)*.035;
        this.beam.material.opacity=.06+this.pulse*.06;
        this.projector.position.y=-.12+Math.sin(this.age*.5)*.06;
        const pos=this.dust.geometry.attributes.position,count=global.quiet?250:this.particleSeeds.length;this.dust.geometry.setDrawRange(0,count);
        for(let i=0;i<count;i++){const p=this.particleSeeds[i],a=p.a+this.age*.04;pos.setXYZ(i,Math.cos(a)*p.r,p.y+Math.sin(a*2+this.age*.2)*.2,Math.sin(a)*p.r);}pos.needsUpdate=true;
      } else {
        this.slate.userData.hinge.rotation.z=Math.max(0,Math.sin(this.age*.8))*.32;
        this.world.updateMatrixWorld(true);
        for (const o of this.orbits) {
          o.film.material.map.offset.x=-this.age*.13;
          if (!paused) o.mean += dt * 1.7 / Math.pow(o.a, 1.5);
          const E = kepler(o.mean, o.ecc); o.body.position.set(o.a * (Math.cos(E) - o.ecc), 0, o.a * Math.sqrt(1 - o.ecc ** 2) * Math.sin(E));
          const parentQ = o.group.getWorldQuaternion(new T.Quaternion()); o.body.quaternion.copy(parentQ.invert().multiply(this.camera.quaternion));
          const attr = o.tail.geometry.attributes.position; for (let j = 0; j < 36; j++) { const e = kepler(o.mean - (35 - j) * .009, o.ecc); attr.setXYZ(j, o.a * (Math.cos(e) - o.ecc), 0, o.a * Math.sqrt(1 - o.ecc ** 2) * Math.sin(e)); } attr.needsUpdate = true;
        }
      }
      this.renderer.render(this.scene, this.camera); this.stage.dataset.ready = 'true'; this.stage.dataset.frames = String((Number(this.stage.dataset.frames) || 0) + 1); this.state.dirty = false;
    }
  }
  for (const [id, type] of [['heroStage', 'hero'], ['crewStage', 'crew']]) { const stage = document.getElementById(id); if (!stage) continue; if (!T || !fx) { fallback(stage, type); continue; } new SceneView(stage, type); }
})();
