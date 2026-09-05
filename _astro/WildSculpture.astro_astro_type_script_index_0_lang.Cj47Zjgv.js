const W=r=>{const o=Math.hypot(...r)||1;return r.map(i=>i/o)},K=(r,o)=>[r[1]*o[2]-r[2]*o[1],r[2]*o[0]-r[0]*o[2],r[0]*o[1]-r[1]*o[0]],j=(r,o)=>r.map((i,l)=>i-o[l]),X=(r,o)=>r.reduce((i,l,d)=>i+l*o[d],0),fe=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),H=(r,o)=>{const i=new Float32Array(16);for(let l=0;l<4;l++)for(let d=0;d<4;d++)for(let f=0;f<4;f++)i[l*4+d]+=r[f*4+d]*o[l*4+f];return i},be=r=>{const o=1/Math.tan(.29),i=.1,l=30;return new Float32Array([o/r,0,0,0,0,o,0,0,0,0,(l+i)/(i-l),-1,0,0,2*l*i/(i-l),0])},B=[0,.85,6.4],R=W(j(B,[0,-.1,0])),C=W(K([0,1,0],R)),I=K(R,C),Ee=new Float32Array([C[0],I[0],R[0],0,C[1],I[1],R[1],0,C[2],I[2],R[2],0,-X(C,B),-X(I,B),-X(R,B),1]),Pe=`
attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uModel;
uniform mat4 uViewProjection;
varying vec3 vPosition;
varying vec3 vNormal;
void main(){
  vec4 p=uModel*vec4(aPosition,1.0);
  vPosition=p.xyz;
  vNormal=mat3(uModel)*aNormal;
  gl_Position=uViewProjection*p;
}`,xe=`
precision mediump float;
varying vec3 vPosition;
varying vec3 vNormal;
uniform vec3 uEye;
uniform float uGround;
uniform float uLift;
float noise(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec3 n=normalize(vNormal);
  vec3 v=normalize(uEye-vPosition);
  vec3 light=normalize(vec3(-3.0,5.0,4.0));
  vec3 color;
  if(uGround>0.5){
    float shadow=exp(-dot(vPosition.xz*vec2(.9,1.4),vPosition.xz*vec2(.9,1.4))*1.4);
    float grain=(noise(vPosition.xz*110.0)-.5)*.022;
    color=vec3(.88,.85,.77)+grain;
    color*=1.0-shadow*(.21-uLift*.03);
    float horizon=smoothstep(3.0,14.0,length(vPosition.xz));
    color=mix(color,vec3(.87,.89,.86),horizon);
  } else {
    vec3 r=reflect(-v,n);
    // A tiny procedural studio environment: warm sand, azure horizon, white sky.
    color=mix(vec3(.38,.44,.45),vec3(.90,.91,.85),smoothstep(-.35,.7,r.y));
    color=mix(color,vec3(.23,.39,.47),exp(-pow((r.y+.08)*5.0,2.0))*.65);
    float panel=smoothstep(.955,.992,dot(r,normalize(vec3(-.7,.35,.8))));
    color=mix(color,vec3(1.0,.99,.93),panel);
    float darkPanel=smoothstep(.93,.99,dot(r,normalize(vec3(.9,.3,.45))));
    color=mix(color,vec3(.11,.16,.19),darkPanel*.82);
    float diffuse=max(dot(n,light),0.0);
    float specular=pow(max(dot(n,normalize(light+v)),0.0),80.0);
    float fresnel=pow(1.0-max(dot(n,v),0.0),3.0);
    color=color*(.62+diffuse*.34)+vec3(specular*.58)+fresnel*vec3(.14,.18,.20);
    color=mix(color,vec3(.80,.86,.85),.08);
  }
  gl_FragColor=vec4(color,1.0);
}`;function Me(){const r=[],o=[[1.55,0,0],[-.78,1.34,0],[-.78,-1.34,0]],i=(n,a,c)=>n.map((s,b)=>s+(a[b]-s)*c);for(let n=0;n<3;n++){const a=o[n],c=i(a,o[(n+2)%3],.13),s=i(a,o[(n+1)%3],.13);for(let y=0;y<12;y++){const L=y/12;r.push(i(i(c,a,L),i(a,s,L),L))}const b=i(o[(n+1)%3],a,.13);for(let y=0;y<12;y++)r.push(i(s,b,y/12))}const l=[[1,-.15],[1,.15],[.996,.19],[.978,.23],[.95,.25],[.64,.25],[.612,.23],[.594,.19],[.59,.15],[.59,-.15],[.594,-.19],[.612,-.23],[.64,-.25],[.95,-.25],[.978,-.23],[.996,-.19]],d=r.length,f=l.length,h=(n,a)=>{const c=r[(n+d)%d],s=l[(a+f)%f];return[c[0]*s[0],c[1]*s[0],s[1]]},m=[],e=(n,a)=>{const c=h(n,a),s=j(h(n+1,a),h(n-1,a)),b=W(K(s,j(h(n,a+1),h(n,a-1))));m.push(...c,...b)};for(let n=0;n<d;n++)for(let a=0;a<f;a++)e(n,a),e(n+1,a),e(n,a+1),e(n+1,a),e(n+1,a+1),e(n,a+1);return new Float32Array(m)}const he=new WeakSet;function me(){document.querySelectorAll("[data-wild-sculpture]").forEach(r=>{if(he.has(r))return;he.add(r);const o=r.querySelector("canvas"),i=r.querySelector(".ws-controls"),l=r.querySelector(".ws-fallback"),d=r.querySelector("[data-ws-caption]"),f=r.querySelector("[data-ws-hint]"),h=r.querySelector("[data-ws-pause]"),m=matchMedia("(prefers-reduced-motion: reduce)"),e=o.getContext("webgl",{alpha:!1,antialias:!0,powerPreference:"low-power"});if(!e){d.textContent="Clip on the beach. Interactive 3D is unavailable in this browser.";return}const n=[],a=[],c=e.createProgram();if(!c)return;let s=0,b=!1,y=!1,L=!1,p=m.matches,F=!1,E=-.35,P=.1,A=E,x=P,N=0,M=0,_=!1,O=0,U=0;const Y=new AbortController,u={signal:Y.signal},V=()=>{cancelAnimationFrame(s),s=0,o.hidden=!0,i.hidden=!0,f.hidden=!0,l.hidden=!1,d.textContent="Clip on the beach. Interactive 3D is unavailable in this browser."};try{for(const[t,w]of[[e.VERTEX_SHADER,Pe],[e.FRAGMENT_SHADER,xe]]){const g=e.createShader(t);if(!g)throw new Error("Shader unavailable");if(n.push(g),e.shaderSource(g,w),e.compileShader(g),!e.getShaderParameter(g,e.COMPILE_STATUS))throw new Error("Shader compilation failed");e.attachShader(c,g)}if(e.linkProgram(c),!e.getProgramParameter(c,e.LINK_STATUS))throw new Error("Shader linking failed")}catch{V(),n.forEach(t=>e.deleteShader(t)),e.deleteProgram(c);return}e.useProgram(c),e.enable(e.DEPTH_TEST);const D={position:e.getAttribLocation(c,"aPosition"),normal:e.getAttribLocation(c,"aNormal")},z=Object.fromEntries(["uModel","uViewProjection","uEye","uGround","uLift"].map(t=>[t,e.getUniformLocation(c,t)])),J=t=>{const w=e.createBuffer();if(!w)throw new Error("Buffer unavailable");return a.push(w),e.bindBuffer(e.ARRAY_BUFFER,w),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW),{buffer:w,count:t.length/6}};let Q,Z;try{Q=J(Me()),Z=J(new Float32Array([-20,-1.5,-20,0,1,0,-20,-1.5,20,0,1,0,20,-1.5,-20,0,1,0,20,-1.5,-20,0,1,0,-20,-1.5,20,0,1,0,20,-1.5,20,0,1,0]))}catch{V(),a.forEach(t=>e.deleteBuffer(t)),n.forEach(t=>e.deleteShader(t)),e.deleteProgram(c);return}o.hidden=!1,l.hidden=!0,i.hidden=!1,f.hidden=!1,d.textContent="Made for a different point of view.";function S(){const t=p||F||m.matches;h.textContent=t?"Play":"Pause",h.setAttribute("aria-pressed",String(t)),h.disabled=m.matches||F,h.title=m.matches?"Motion is off in your system settings":F?"Motion is paused for this page":""}const pe=()=>!p&&!F&&!m.matches,$=()=>b&&!document.hidden&&!y&&!L,v=()=>{!s&&$()&&(s=requestAnimationFrame(ve))};function ee(t,w,g){e.bindBuffer(e.ARRAY_BUFFER,t.buffer),e.enableVertexAttribArray(D.position),e.vertexAttribPointer(D.position,3,e.FLOAT,!1,24,0),e.enableVertexAttribArray(D.normal),e.vertexAttribPointer(D.normal,3,e.FLOAT,!1,24,12),e.uniformMatrix4fv(z.uModel,!1,w),e.uniform1f(z.uGround,g?1:0),e.drawArrays(e.TRIANGLES,0,t.count)}function ve(t){if(s=0,!$()){M=0;return}const w=M?Math.min((t-M)/1e3,.05):0;M=t;const g=pe();g&&!_&&(N+=w,A+=w*.065);const ne=m.matches?1:.14;E+=(A-E)*ne,P+=(x-P)*ne;const ae=o.getBoundingClientRect(),ie=Math.min(devicePixelRatio||1,1.5),T=Math.max(1,Math.round(ae.width*ie)),k=Math.max(1,Math.round(ae.height*ie));(o.width!==T||o.height!==k)&&(o.width=T,o.height=k),e.viewport(0,0,T,k),e.clearColor(.87,.89,.86,1),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.uniformMatrix4fv(z.uViewProjection,!1,H(be(T/k),Ee)),e.uniform3fv(z.uEye,B);const se=.1+Math.sin(N*.65)*.055;e.uniform1f(z.uLift,se),ee(Z,fe(),!0);const ce=Math.cos(E),le=Math.sin(E),de=Math.cos(P),ue=Math.sin(P),ge=new Float32Array([ce,0,-le,0,0,1,0,0,le,0,ce,0,0,se,0,1]),ye=new Float32Array([1,0,0,0,0,de,ue,0,0,-ue,de,0,0,0,0,1]),Ae=Math.min(1,Math.max(.62,T/k*.85)),q=fe();q[0]=q[5]=q[10]=Ae,ee(Q,H(H(ge,ye),q),!1),(g||Math.abs(A-E)>.001||Math.abs(x-P)>.001)&&v()}const G=t=>{p=!0,A+=t,S(),v()};r.querySelector("[data-ws-left]").addEventListener("click",()=>G(-.35),u),r.querySelector("[data-ws-right]").addEventListener("click",()=>G(.35),u),r.querySelector("[data-ws-reset]").addEventListener("click",()=>{p=!0,N=0,A=-.35,x=.1,S(),v()},u),h.addEventListener("click",()=>{p=!p,p&&(A=E,x=P),S(),M=0,v()},u),o.addEventListener("keydown",t=>{(t.key==="ArrowLeft"||t.key==="ArrowRight")&&(t.preventDefault(),G(t.key==="ArrowLeft"?-.35:.35)),t.key==="Home"&&(t.preventDefault(),p=!0,A=-.35,x=.1,S(),v())},u),o.addEventListener("pointerdown",t=>{t.pointerType==="mouse"&&t.button!==0||(_=!0,O=t.clientX,U=t.clientY,p=!0,o.setPointerCapture(t.pointerId),S())},u),o.addEventListener("pointermove",t=>{_&&(A+=(t.clientX-O)*.009,x=Math.max(-.6,Math.min(.6,x+(t.clientY-U)*.005)),O=t.clientX,U=t.clientY,v())},u);const te=()=>{_=!1};o.addEventListener("pointerup",te,u),o.addEventListener("pointercancel",te,u);const oe=new IntersectionObserver(t=>{b=t[0].isIntersecting,M=0,b?v():(cancelAnimationFrame(s),s=0)},{threshold:.01});oe.observe(o);const re=new ResizeObserver(v);re.observe(o),document.addEventListener("visibilitychange",()=>{M=0,document.hidden?(cancelAnimationFrame(s),s=0):v()},u),m.addEventListener("change",()=>{p=m.matches,p&&(A=E,x=P),S(),v()},u),window.addEventListener("astra-motion",(t=>{F=!!t.detail?.paused,F&&(A=E,x=P),S(),M=0,v()}),u),o.addEventListener("webglcontextlost",t=>{t.preventDefault(),L=!0,V()},u);const we=()=>{y=!0,cancelAnimationFrame(s),oe.disconnect(),re.disconnect(),Y.abort(),a.forEach(t=>e.deleteBuffer(t)),n.forEach(t=>e.deleteShader(t)),e.deleteProgram(c)};document.addEventListener("astro:before-swap",we,{once:!0,signal:Y.signal}),S()})}me();document.addEventListener("astro:page-load",me);
