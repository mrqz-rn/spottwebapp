import{$ as f,a0 as b}from"./index-ygXwHGmL.js";/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const _=n=>{if(f===void 0)return;let o=0,t,s,a;const R=n.getBoolean("animated",!0)&&n.getBoolean("rippleEffect",!0),d=new WeakMap,u=()=>{a&&clearTimeout(a),a=void 0,t&&(m(!1),t=void 0)},h=e=>{t||e.button===2||p(g(e),e)},w=e=>{p(void 0,e)},p=(e,i)=>{if(e&&e===t)return;a&&clearTimeout(a),a=void 0;const{x:c,y:r}=b(i);if(t){if(d.has(t))throw new Error("internal error");t.classList.contains(l)||v(t,c,r),m(!0)}if(e){const A=d.get(e);A&&(clearTimeout(A),d.delete(e)),e.classList.remove(l);const T=()=>{v(e,c,r),a=void 0};L(e)?T():a=setTimeout(T,S)}t=e},v=(e,i,c)=>{if(o=Date.now(),e.classList.add(l),!R)return;const r=C(e);r!==null&&(E(),s=r.addRipple(i,c))},E=()=>{s!==void 0&&(s.then(e=>e()),s=void 0)},m=e=>{E();const i=t;if(!i)return;const c=D-Date.now()+o;if(e&&c>0&&!L(i)){const r=setTimeout(()=>{i.classList.remove(l),d.delete(i)},D);d.set(i,r)}else i.classList.remove(l)};f.addEventListener("ionGestureCaptured",u),f.addEventListener("pointerdown",h,!0),f.addEventListener("pointerup",w,!0),f.addEventListener("pointercancel",u,!0)},g=n=>{if(n.composedPath!==void 0){const o=n.composedPath();for(let t=0;t<o.length-2;t++){const s=o[t];if(!(s instanceof ShadowRoot)&&s.classList.contains("ion-activatable"))return s}}else return n.target.closest(".ion-activatable")},L=n=>n.classList.contains("ion-activatable-instant"),C=n=>{if(n.shadowRoot){const o=n.shadowRoot.querySelector("ion-ripple-effect");if(o)return o}return n.querySelector("ion-ripple-effect")},l="ion-activated",S=100,D=150;export{_ as startTapClick};
