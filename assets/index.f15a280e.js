var f=Object.defineProperty;var p=(t,e,n)=>e in t?f(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var a=(t,e,n)=>(p(t,typeof e!="symbol"?e+"":e,n),n);import{S as m,P as g,C as w,W as v,s as C,a as y,R as D,O as E,A as c,b as u,t as d,d as R,D as b,G as M,c as A,e as l,f as _,g as k,w as h,o as L,h as F}from"./vendor.1242afae.js";const I=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerpolicy&&(r.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?r.credentials="include":i.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}};I();class O{constructor(e,n){a(this,"renderer");a(this,"scene");a(this,"camera");a(this,"logRenderTimes");a(this,"gltf");a(this,"animationMixer");a(this,"clock");a(this,"orbitControl");a(this,"renderID",0);this.logRenderTimes=!0,this.gltf=e,this.scene=new m,this.camera=new g(50,n.offsetWidth/n.offsetHeight,.1,2e3),this.camera.position.set(0,0,5),this.scene.background=new w(14082047),this.scene.add(e.scene),this.renderer=new v({canvas:n,antialias:!0}),this.renderer.outputEncoding=C,this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(innerWidth,innerHeight);const s=new y(this.renderer);this.scene.environment=s.fromScene(new D).texture,window.addEventListener("resize",()=>{this.camera.aspect=n.offsetWidth/n.offsetHeight,this.renderer.setSize(innerWidth,innerHeight),this.camera.updateProjectionMatrix()}),this.orbitControl=new E(this.camera,n),this.orbitControl.enableDamping=!0,this.animationMixer=new c(this.gltf.scene),this.animationMixer.clipAction(e.animations[0]).play(),this.clock=new u,this.startRender()}startRender(){const e=()=>{this.renderID=requestAnimationFrame(e),this.animationMixer.update(this.clock.getDelta()),this.orbitControl.update(),this.renderer.render(this.scene,this.camera)};this.renderID=requestAnimationFrame(e)}stopRender(){cancelAnimationFrame(this.renderID)}setModel(e){this.stopRender(),this.scene.remove(this.gltf.scene),this.scene.add(e.scene),this.animationMixer=new c(e.scene),this.animationMixer.clipAction(e.animations[0]).play(),this.clock=new u,this.gltf=e,d(this).startRender()}}var P=(t,e)=>{for(const[n,s]of e)t[n]=s;return t};const x=R({data(){return{loading:!1,selecting:!1,gltf:null,viewer:null,file:null}},watch:{gltf(t){t?this.viewer?this.viewer.setModel(d(t)):this.viewer=new O(d(t),this.$refs.modelView):this.viewer=null}},methods:{onUploadClick(){if(!this.$refs.fileInput)return;this.selecting=!0,this.$refs.fileInput.click(),window.addEventListener("focus",()=>{this.selecting=!1},{once:!0})},async onFileChanged(t){if(!t.target)return;const e=t.target.files;if(!e){console.log("\u53D6\u6D88\u4E86\u9009\u62E9");return}const n=e[0];this.file=n;const s=new b;s.setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/libs/draco/");const i=new M;i.setDRACOLoader(s);try{this.loading=!0,i.parse(await n.arrayBuffer(),"",this.loadComplete,this.loadError)}catch(r){this.loadError(new ErrorEvent("ModelLoadError",{error:r,message:r.message}))}},loadComplete(t){this.loading=!1,this.gltf=t},loadError(t){this.loading=!1},onDrop(t){const e=t.dataTransfer;if(e&&e.files.item(0)){const s=this.$refs.fileInput;s.files=e.files,s.dispatchEvent(new Event("change"))}},onDragOver(t){}}}),B={class:"app"},$={class:"header"},S=l("span",{class:"header-title"}," \u6A21\u578B\u67E5\u770B\u5668 ",-1),G=l("div",{class:"spacer"},null,-1),T={class:"btn-content"},W=l("i",{class:"fas fa-folder-open"},null,-1),N=l("div",{class:"w-10px"},null,-1),V={ref:"modelView",class:"model-viewer"};function j(t,e,n,s,i,r){return L(),A("div",B,[l("header",$,[S,G,l("input",{style:{display:"none"},type:"file",ref:"fileInput",onChange:e[0]||(e[0]=(...o)=>t.onFileChanged&&t.onFileChanged(...o))},null,544),l("button",{class:"btn",onClick:e[1]||(e[1]=(...o)=>t.onUploadClick&&t.onUploadClick(...o))},[l("div",T,[W,_(" "+k(t.gltf?"\u66F4\u6362\u8981\u9884\u89C8\u7684\u6587\u4EF6":"\u4E0A\u4F20\u6587\u4EF6\u8FDB\u884C\u9884\u89C8"),1)])]),N]),l("main",{class:"main",onDrop:e[2]||(e[2]=h((...o)=>t.onDrop&&t.onDrop(...o),["prevent"])),onDragover:e[3]||(e[3]=h((...o)=>t.onDragOver&&t.onDragOver(...o),["prevent"]))},[l("canvas",V,null,512)],32)])}var H=P(x,[["render",j]]);F(H).mount("#app");
