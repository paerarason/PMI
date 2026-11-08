(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const c of l)if(c.type==="childList")for(const h of c.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&s(h)}).observe(document,{childList:!0,subtree:!0});function i(l){const c={};return l.integrity&&(c.integrity=l.integrity),l.referrerPolicy&&(c.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?c.credentials="include":l.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(l){if(l.ep)return;l.ep=!0;const c=i(l);fetch(l.href,c)}})();var ah={exports:{}},Oo={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var C_;function HS(){if(C_)return Oo;C_=1;var r=Symbol.for("react.transitional.element"),t=Symbol.for("react.fragment");function i(s,l,c){var h=null;if(c!==void 0&&(h=""+c),l.key!==void 0&&(h=""+l.key),"key"in l){c={};for(var d in l)d!=="key"&&(c[d]=l[d])}else c=l;return l=c.ref,{$$typeof:r,type:s,key:h,ref:l!==void 0?l:null,props:c}}return Oo.Fragment=t,Oo.jsx=i,Oo.jsxs=i,Oo}var w_;function GS(){return w_||(w_=1,ah.exports=HS()),ah.exports}var H=GS(),sh={exports:{}},ce={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var D_;function VS(){if(D_)return ce;D_=1;var r=Symbol.for("react.transitional.element"),t=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),c=Symbol.for("react.consumer"),h=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),v=Symbol.for("react.activity"),S=Symbol.iterator;function M(N){return N===null||typeof N!="object"?null:(N=S&&N[S]||N["@@iterator"],typeof N=="function"?N:null)}var b={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},E=Object.assign,y={};function g(N,W,vt){this.props=N,this.context=W,this.refs=y,this.updater=vt||b}g.prototype.isReactComponent={},g.prototype.setState=function(N,W){if(typeof N!="object"&&typeof N!="function"&&N!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,N,W,"setState")},g.prototype.forceUpdate=function(N){this.updater.enqueueForceUpdate(this,N,"forceUpdate")};function B(){}B.prototype=g.prototype;function R(N,W,vt){this.props=N,this.context=W,this.refs=y,this.updater=vt||b}var w=R.prototype=new B;w.constructor=R,E(w,g.prototype),w.isPureReactComponent=!0;var V=Array.isArray;function F(){}var L={H:null,A:null,T:null,S:null},X=Object.prototype.hasOwnProperty;function U(N,W,vt){var Mt=vt.ref;return{$$typeof:r,type:N,key:W,ref:Mt!==void 0?Mt:null,props:vt}}function D(N,W){return U(N.type,W,N.props)}function z(N){return typeof N=="object"&&N!==null&&N.$$typeof===r}function lt(N){var W={"=":"=0",":":"=2"};return"$"+N.replace(/[=:]/g,function(vt){return W[vt]})}var st=/\/+/g;function dt(N,W){return typeof N=="object"&&N!==null&&N.key!=null?lt(""+N.key):W.toString(36)}function et(N){switch(N.status){case"fulfilled":return N.value;case"rejected":throw N.reason;default:switch(typeof N.status=="string"?N.then(F,F):(N.status="pending",N.then(function(W){N.status==="pending"&&(N.status="fulfilled",N.value=W)},function(W){N.status==="pending"&&(N.status="rejected",N.reason=W)})),N.status){case"fulfilled":return N.value;case"rejected":throw N.reason}}throw N}function I(N,W,vt,Mt,K){var xt=typeof N;(xt==="undefined"||xt==="boolean")&&(N=null);var ut=!1;if(N===null)ut=!0;else switch(xt){case"bigint":case"string":case"number":ut=!0;break;case"object":switch(N.$$typeof){case r:case t:ut=!0;break;case _:return ut=N._init,I(ut(N._payload),W,vt,Mt,K)}}if(ut)return K=K(N),ut=Mt===""?"."+dt(N,0):Mt,V(K)?(vt="",ut!=null&&(vt=ut.replace(st,"$&/")+"/"),I(K,W,vt,"",function(Gt){return Gt})):K!=null&&(z(K)&&(K=D(K,vt+(K.key==null||N&&N.key===K.key?"":(""+K.key).replace(st,"$&/")+"/")+ut)),W.push(K)),1;ut=0;var Et=Mt===""?".":Mt+":";if(V(N))for(var Dt=0;Dt<N.length;Dt++)Mt=N[Dt],xt=Et+dt(Mt,Dt),ut+=I(Mt,W,vt,xt,K);else if(Dt=M(N),typeof Dt=="function")for(N=Dt.call(N),Dt=0;!(Mt=N.next()).done;)Mt=Mt.value,xt=Et+dt(Mt,Dt++),ut+=I(Mt,W,vt,xt,K);else if(xt==="object"){if(typeof N.then=="function")return I(et(N),W,vt,Mt,K);throw W=String(N),Error("Objects are not valid as a React child (found: "+(W==="[object Object]"?"object with keys {"+Object.keys(N).join(", ")+"}":W)+"). If you meant to render a collection of children, use an array instead.")}return ut}function Y(N,W,vt){if(N==null)return N;var Mt=[],K=0;return I(N,Mt,"","",function(xt){return W.call(vt,xt,K++)}),Mt}function q(N){if(N._status===-1){var W=N._result;W=W(),W.then(function(vt){(N._status===0||N._status===-1)&&(N._status=1,N._result=vt)},function(vt){(N._status===0||N._status===-1)&&(N._status=2,N._result=vt)}),N._status===-1&&(N._status=0,N._result=W)}if(N._status===1)return N._result.default;throw N._result}var $=typeof reportError=="function"?reportError:function(N){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var W=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof N=="object"&&N!==null&&typeof N.message=="string"?String(N.message):String(N),error:N});if(!window.dispatchEvent(W))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",N);return}console.error(N)},rt={map:Y,forEach:function(N,W,vt){Y(N,function(){W.apply(this,arguments)},vt)},count:function(N){var W=0;return Y(N,function(){W++}),W},toArray:function(N){return Y(N,function(W){return W})||[]},only:function(N){if(!z(N))throw Error("React.Children.only expected to receive a single React element child.");return N}};return ce.Activity=v,ce.Children=rt,ce.Component=g,ce.Fragment=i,ce.Profiler=l,ce.PureComponent=R,ce.StrictMode=s,ce.Suspense=m,ce.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=L,ce.__COMPILER_RUNTIME={__proto__:null,c:function(N){return L.H.useMemoCache(N)}},ce.cache=function(N){return function(){return N.apply(null,arguments)}},ce.cacheSignal=function(){return null},ce.cloneElement=function(N,W,vt){if(N==null)throw Error("The argument must be a React element, but you passed "+N+".");var Mt=E({},N.props),K=N.key;if(W!=null)for(xt in W.key!==void 0&&(K=""+W.key),W)!X.call(W,xt)||xt==="key"||xt==="__self"||xt==="__source"||xt==="ref"&&W.ref===void 0||(Mt[xt]=W[xt]);var xt=arguments.length-2;if(xt===1)Mt.children=vt;else if(1<xt){for(var ut=Array(xt),Et=0;Et<xt;Et++)ut[Et]=arguments[Et+2];Mt.children=ut}return U(N.type,K,Mt)},ce.createContext=function(N){return N={$$typeof:h,_currentValue:N,_currentValue2:N,_threadCount:0,Provider:null,Consumer:null},N.Provider=N,N.Consumer={$$typeof:c,_context:N},N},ce.createElement=function(N,W,vt){var Mt,K={},xt=null;if(W!=null)for(Mt in W.key!==void 0&&(xt=""+W.key),W)X.call(W,Mt)&&Mt!=="key"&&Mt!=="__self"&&Mt!=="__source"&&(K[Mt]=W[Mt]);var ut=arguments.length-2;if(ut===1)K.children=vt;else if(1<ut){for(var Et=Array(ut),Dt=0;Dt<ut;Dt++)Et[Dt]=arguments[Dt+2];K.children=Et}if(N&&N.defaultProps)for(Mt in ut=N.defaultProps,ut)K[Mt]===void 0&&(K[Mt]=ut[Mt]);return U(N,xt,K)},ce.createRef=function(){return{current:null}},ce.forwardRef=function(N){return{$$typeof:d,render:N}},ce.isValidElement=z,ce.lazy=function(N){return{$$typeof:_,_payload:{_status:-1,_result:N},_init:q}},ce.memo=function(N,W){return{$$typeof:p,type:N,compare:W===void 0?null:W}},ce.startTransition=function(N){var W=L.T,vt={};L.T=vt;try{var Mt=N(),K=L.S;K!==null&&K(vt,Mt),typeof Mt=="object"&&Mt!==null&&typeof Mt.then=="function"&&Mt.then(F,$)}catch(xt){$(xt)}finally{W!==null&&vt.types!==null&&(W.types=vt.types),L.T=W}},ce.unstable_useCacheRefresh=function(){return L.H.useCacheRefresh()},ce.use=function(N){return L.H.use(N)},ce.useActionState=function(N,W,vt){return L.H.useActionState(N,W,vt)},ce.useCallback=function(N,W){return L.H.useCallback(N,W)},ce.useContext=function(N){return L.H.useContext(N)},ce.useDebugValue=function(){},ce.useDeferredValue=function(N,W){return L.H.useDeferredValue(N,W)},ce.useEffect=function(N,W){return L.H.useEffect(N,W)},ce.useEffectEvent=function(N){return L.H.useEffectEvent(N)},ce.useId=function(){return L.H.useId()},ce.useImperativeHandle=function(N,W,vt){return L.H.useImperativeHandle(N,W,vt)},ce.useInsertionEffect=function(N,W){return L.H.useInsertionEffect(N,W)},ce.useLayoutEffect=function(N,W){return L.H.useLayoutEffect(N,W)},ce.useMemo=function(N,W){return L.H.useMemo(N,W)},ce.useOptimistic=function(N,W){return L.H.useOptimistic(N,W)},ce.useReducer=function(N,W,vt){return L.H.useReducer(N,W,vt)},ce.useRef=function(N){return L.H.useRef(N)},ce.useState=function(N){return L.H.useState(N)},ce.useSyncExternalStore=function(N,W,vt){return L.H.useSyncExternalStore(N,W,vt)},ce.useTransition=function(){return L.H.useTransition()},ce.version="19.2.8",ce}var U_;function Od(){return U_||(U_=1,sh.exports=VS()),sh.exports}var Vt=Od(),rh={exports:{}},Po={},oh={exports:{}},lh={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var N_;function kS(){return N_||(N_=1,(function(r){function t(I,Y){var q=I.length;I.push(Y);t:for(;0<q;){var $=q-1>>>1,rt=I[$];if(0<l(rt,Y))I[$]=Y,I[q]=rt,q=$;else break t}}function i(I){return I.length===0?null:I[0]}function s(I){if(I.length===0)return null;var Y=I[0],q=I.pop();if(q!==Y){I[0]=q;t:for(var $=0,rt=I.length,N=rt>>>1;$<N;){var W=2*($+1)-1,vt=I[W],Mt=W+1,K=I[Mt];if(0>l(vt,q))Mt<rt&&0>l(K,vt)?(I[$]=K,I[Mt]=q,$=Mt):(I[$]=vt,I[W]=q,$=W);else if(Mt<rt&&0>l(K,q))I[$]=K,I[Mt]=q,$=Mt;else break t}}return Y}function l(I,Y){var q=I.sortIndex-Y.sortIndex;return q!==0?q:I.id-Y.id}if(r.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var c=performance;r.unstable_now=function(){return c.now()}}else{var h=Date,d=h.now();r.unstable_now=function(){return h.now()-d}}var m=[],p=[],_=1,v=null,S=3,M=!1,b=!1,E=!1,y=!1,g=typeof setTimeout=="function"?setTimeout:null,B=typeof clearTimeout=="function"?clearTimeout:null,R=typeof setImmediate<"u"?setImmediate:null;function w(I){for(var Y=i(p);Y!==null;){if(Y.callback===null)s(p);else if(Y.startTime<=I)s(p),Y.sortIndex=Y.expirationTime,t(m,Y);else break;Y=i(p)}}function V(I){if(E=!1,w(I),!b)if(i(m)!==null)b=!0,F||(F=!0,lt());else{var Y=i(p);Y!==null&&et(V,Y.startTime-I)}}var F=!1,L=-1,X=5,U=-1;function D(){return y?!0:!(r.unstable_now()-U<X)}function z(){if(y=!1,F){var I=r.unstable_now();U=I;var Y=!0;try{t:{b=!1,E&&(E=!1,B(L),L=-1),M=!0;var q=S;try{e:{for(w(I),v=i(m);v!==null&&!(v.expirationTime>I&&D());){var $=v.callback;if(typeof $=="function"){v.callback=null,S=v.priorityLevel;var rt=$(v.expirationTime<=I);if(I=r.unstable_now(),typeof rt=="function"){v.callback=rt,w(I),Y=!0;break e}v===i(m)&&s(m),w(I)}else s(m);v=i(m)}if(v!==null)Y=!0;else{var N=i(p);N!==null&&et(V,N.startTime-I),Y=!1}}break t}finally{v=null,S=q,M=!1}Y=void 0}}finally{Y?lt():F=!1}}}var lt;if(typeof R=="function")lt=function(){R(z)};else if(typeof MessageChannel<"u"){var st=new MessageChannel,dt=st.port2;st.port1.onmessage=z,lt=function(){dt.postMessage(null)}}else lt=function(){g(z,0)};function et(I,Y){L=g(function(){I(r.unstable_now())},Y)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(I){I.callback=null},r.unstable_forceFrameRate=function(I){0>I||125<I?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):X=0<I?Math.floor(1e3/I):5},r.unstable_getCurrentPriorityLevel=function(){return S},r.unstable_next=function(I){switch(S){case 1:case 2:case 3:var Y=3;break;default:Y=S}var q=S;S=Y;try{return I()}finally{S=q}},r.unstable_requestPaint=function(){y=!0},r.unstable_runWithPriority=function(I,Y){switch(I){case 1:case 2:case 3:case 4:case 5:break;default:I=3}var q=S;S=I;try{return Y()}finally{S=q}},r.unstable_scheduleCallback=function(I,Y,q){var $=r.unstable_now();switch(typeof q=="object"&&q!==null?(q=q.delay,q=typeof q=="number"&&0<q?$+q:$):q=$,I){case 1:var rt=-1;break;case 2:rt=250;break;case 5:rt=1073741823;break;case 4:rt=1e4;break;default:rt=5e3}return rt=q+rt,I={id:_++,callback:Y,priorityLevel:I,startTime:q,expirationTime:rt,sortIndex:-1},q>$?(I.sortIndex=q,t(p,I),i(m)===null&&I===i(p)&&(E?(B(L),L=-1):E=!0,et(V,q-$))):(I.sortIndex=rt,t(m,I),b||M||(b=!0,F||(F=!0,lt()))),I},r.unstable_shouldYield=D,r.unstable_wrapCallback=function(I){var Y=S;return function(){var q=S;S=Y;try{return I.apply(this,arguments)}finally{S=q}}}})(lh)),lh}var L_;function XS(){return L_||(L_=1,oh.exports=kS()),oh.exports}var ch={exports:{}},Un={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var O_;function jS(){if(O_)return Un;O_=1;var r=Od();function t(m){var p="https://react.dev/errors/"+m;if(1<arguments.length){p+="?args[]="+encodeURIComponent(arguments[1]);for(var _=2;_<arguments.length;_++)p+="&args[]="+encodeURIComponent(arguments[_])}return"Minified React error #"+m+"; visit "+p+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var s={d:{f:i,r:function(){throw Error(t(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal");function c(m,p,_){var v=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:v==null?null:""+v,children:m,containerInfo:p,implementation:_}}var h=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function d(m,p){if(m==="font")return"";if(typeof p=="string")return p==="use-credentials"?p:""}return Un.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=s,Un.createPortal=function(m,p){var _=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!p||p.nodeType!==1&&p.nodeType!==9&&p.nodeType!==11)throw Error(t(299));return c(m,p,null,_)},Un.flushSync=function(m){var p=h.T,_=s.p;try{if(h.T=null,s.p=2,m)return m()}finally{h.T=p,s.p=_,s.d.f()}},Un.preconnect=function(m,p){typeof m=="string"&&(p?(p=p.crossOrigin,p=typeof p=="string"?p==="use-credentials"?p:"":void 0):p=null,s.d.C(m,p))},Un.prefetchDNS=function(m){typeof m=="string"&&s.d.D(m)},Un.preinit=function(m,p){if(typeof m=="string"&&p&&typeof p.as=="string"){var _=p.as,v=d(_,p.crossOrigin),S=typeof p.integrity=="string"?p.integrity:void 0,M=typeof p.fetchPriority=="string"?p.fetchPriority:void 0;_==="style"?s.d.S(m,typeof p.precedence=="string"?p.precedence:void 0,{crossOrigin:v,integrity:S,fetchPriority:M}):_==="script"&&s.d.X(m,{crossOrigin:v,integrity:S,fetchPriority:M,nonce:typeof p.nonce=="string"?p.nonce:void 0})}},Un.preinitModule=function(m,p){if(typeof m=="string")if(typeof p=="object"&&p!==null){if(p.as==null||p.as==="script"){var _=d(p.as,p.crossOrigin);s.d.M(m,{crossOrigin:_,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0})}}else p==null&&s.d.M(m)},Un.preload=function(m,p){if(typeof m=="string"&&typeof p=="object"&&p!==null&&typeof p.as=="string"){var _=p.as,v=d(_,p.crossOrigin);s.d.L(m,_,{crossOrigin:v,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0,type:typeof p.type=="string"?p.type:void 0,fetchPriority:typeof p.fetchPriority=="string"?p.fetchPriority:void 0,referrerPolicy:typeof p.referrerPolicy=="string"?p.referrerPolicy:void 0,imageSrcSet:typeof p.imageSrcSet=="string"?p.imageSrcSet:void 0,imageSizes:typeof p.imageSizes=="string"?p.imageSizes:void 0,media:typeof p.media=="string"?p.media:void 0})}},Un.preloadModule=function(m,p){if(typeof m=="string")if(p){var _=d(p.as,p.crossOrigin);s.d.m(m,{as:typeof p.as=="string"&&p.as!=="script"?p.as:void 0,crossOrigin:_,integrity:typeof p.integrity=="string"?p.integrity:void 0})}else s.d.m(m)},Un.requestFormReset=function(m){s.d.r(m)},Un.unstable_batchedUpdates=function(m,p){return m(p)},Un.useFormState=function(m,p,_){return h.H.useFormState(m,p,_)},Un.useFormStatus=function(){return h.H.useHostTransitionStatus()},Un.version="19.2.8",Un}var P_;function WS(){if(P_)return ch.exports;P_=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(t){console.error(t)}}return r(),ch.exports=jS(),ch.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var z_;function qS(){if(z_)return Po;z_=1;var r=XS(),t=Od(),i=WS();function s(e){var n="https://react.dev/errors/"+e;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function c(e){var n=e,a=e;if(e.alternate)for(;n.return;)n=n.return;else{e=n;do n=e,(n.flags&4098)!==0&&(a=n.return),e=n.return;while(e)}return n.tag===3?a:null}function h(e){if(e.tag===13){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function d(e){if(e.tag===31){var n=e.memoizedState;if(n===null&&(e=e.alternate,e!==null&&(n=e.memoizedState)),n!==null)return n.dehydrated}return null}function m(e){if(c(e)!==e)throw Error(s(188))}function p(e){var n=e.alternate;if(!n){if(n=c(e),n===null)throw Error(s(188));return n!==e?null:e}for(var a=e,o=n;;){var u=a.return;if(u===null)break;var f=u.alternate;if(f===null){if(o=u.return,o!==null){a=o;continue}break}if(u.child===f.child){for(f=u.child;f;){if(f===a)return m(u),e;if(f===o)return m(u),n;f=f.sibling}throw Error(s(188))}if(a.return!==o.return)a=u,o=f;else{for(var x=!1,A=u.child;A;){if(A===a){x=!0,a=u,o=f;break}if(A===o){x=!0,o=u,a=f;break}A=A.sibling}if(!x){for(A=f.child;A;){if(A===a){x=!0,a=f,o=u;break}if(A===o){x=!0,o=f,a=u;break}A=A.sibling}if(!x)throw Error(s(189))}}if(a.alternate!==o)throw Error(s(190))}if(a.tag!==3)throw Error(s(188));return a.stateNode.current===a?e:n}function _(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e;for(e=e.child;e!==null;){if(n=_(e),n!==null)return n;e=e.sibling}return null}var v=Object.assign,S=Symbol.for("react.element"),M=Symbol.for("react.transitional.element"),b=Symbol.for("react.portal"),E=Symbol.for("react.fragment"),y=Symbol.for("react.strict_mode"),g=Symbol.for("react.profiler"),B=Symbol.for("react.consumer"),R=Symbol.for("react.context"),w=Symbol.for("react.forward_ref"),V=Symbol.for("react.suspense"),F=Symbol.for("react.suspense_list"),L=Symbol.for("react.memo"),X=Symbol.for("react.lazy"),U=Symbol.for("react.activity"),D=Symbol.for("react.memo_cache_sentinel"),z=Symbol.iterator;function lt(e){return e===null||typeof e!="object"?null:(e=z&&e[z]||e["@@iterator"],typeof e=="function"?e:null)}var st=Symbol.for("react.client.reference");function dt(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===st?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case E:return"Fragment";case g:return"Profiler";case y:return"StrictMode";case V:return"Suspense";case F:return"SuspenseList";case U:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case b:return"Portal";case R:return e.displayName||"Context";case B:return(e._context.displayName||"Context")+".Consumer";case w:var n=e.render;return e=e.displayName,e||(e=n.displayName||n.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case L:return n=e.displayName||null,n!==null?n:dt(e.type)||"Memo";case X:n=e._payload,e=e._init;try{return dt(e(n))}catch{}}return null}var et=Array.isArray,I=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Y=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,q={pending:!1,data:null,method:null,action:null},$=[],rt=-1;function N(e){return{current:e}}function W(e){0>rt||(e.current=$[rt],$[rt]=null,rt--)}function vt(e,n){rt++,$[rt]=e.current,e.current=n}var Mt=N(null),K=N(null),xt=N(null),ut=N(null);function Et(e,n){switch(vt(xt,n),vt(K,e),vt(Mt,null),n.nodeType){case 9:case 11:e=(e=n.documentElement)&&(e=e.namespaceURI)?Qg(e):0;break;default:if(e=n.tagName,n=n.namespaceURI)n=Qg(n),e=Jg(n,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}W(Mt),vt(Mt,e)}function Dt(){W(Mt),W(K),W(xt)}function Gt(e){e.memoizedState!==null&&vt(ut,e);var n=Mt.current,a=Jg(n,e.type);n!==a&&(vt(K,e),vt(Mt,a))}function Rt(e){K.current===e&&(W(Mt),W(K)),ut.current===e&&(W(ut),Do._currentValue=q)}var Ut,O;function qt(e){if(Ut===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);Ut=n&&n[1]||"",O=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Ut+e+O}var Pt=!1;function Qt(e,n){if(!e||Pt)return"";Pt=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(n){var St=function(){throw Error()};if(Object.defineProperty(St.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(St,[])}catch(ht){var ot=ht}Reflect.construct(e,[],St)}else{try{St.call()}catch(ht){ot=ht}e.call(St.prototype)}}else{try{throw Error()}catch(ht){ot=ht}(St=e())&&typeof St.catch=="function"&&St.catch(function(){})}}catch(ht){if(ht&&ot&&typeof ht.stack=="string")return[ht.stack,ot.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var u=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");u&&u.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var f=o.DetermineComponentFrameRoot(),x=f[0],A=f[1];if(x&&A){var G=x.split(`
`),it=A.split(`
`);for(u=o=0;o<G.length&&!G[o].includes("DetermineComponentFrameRoot");)o++;for(;u<it.length&&!it[u].includes("DetermineComponentFrameRoot");)u++;if(o===G.length||u===it.length)for(o=G.length-1,u=it.length-1;1<=o&&0<=u&&G[o]!==it[u];)u--;for(;1<=o&&0<=u;o--,u--)if(G[o]!==it[u]){if(o!==1||u!==1)do if(o--,u--,0>u||G[o]!==it[u]){var mt=`
`+G[o].replace(" at new "," at ");return e.displayName&&mt.includes("<anonymous>")&&(mt=mt.replace("<anonymous>",e.displayName)),mt}while(1<=o&&0<=u);break}}}finally{Pt=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?qt(a):""}function Yt(e,n){switch(e.tag){case 26:case 27:case 5:return qt(e.type);case 16:return qt("Lazy");case 13:return e.child!==n&&n!==null?qt("Suspense Fallback"):qt("Suspense");case 19:return qt("SuspenseList");case 0:case 15:return Qt(e.type,!1);case 11:return Qt(e.type.render,!1);case 1:return Qt(e.type,!0);case 31:return qt("Activity");default:return""}}function ke(e){try{var n="",a=null;do n+=Yt(e,a),a=e,e=e.return;while(e);return n}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var Xt=Object.prototype.hasOwnProperty,fe=r.unstable_scheduleCallback,Je=r.unstable_cancelCallback,Qe=r.unstable_shouldYield,P=r.unstable_requestPaint,T=r.unstable_now,at=r.unstable_getCurrentPriorityLevel,gt=r.unstable_ImmediatePriority,Tt=r.unstable_UserBlockingPriority,pt=r.unstable_NormalPriority,ee=r.unstable_LowPriority,Nt=r.unstable_IdlePriority,$t=r.log,te=r.unstable_setDisableYieldValue,Ct=null,Lt=null;function ne(e){if(typeof $t=="function"&&te(e),Lt&&typeof Lt.setStrictMode=="function")try{Lt.setStrictMode(Ct,e)}catch{}}var Ht=Math.clz32?Math.clz32:j,zt=Math.log,he=Math.LN2;function j(e){return e>>>=0,e===0?32:31-(zt(e)/he|0)|0}var wt=256,Ot=262144,kt=4194304;function At(e){var n=e&42;if(n!==0)return n;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function yt(e,n,a){var o=e.pendingLanes;if(o===0)return 0;var u=0,f=e.suspendedLanes,x=e.pingedLanes;e=e.warmLanes;var A=o&134217727;return A!==0?(o=A&~f,o!==0?u=At(o):(x&=A,x!==0?u=At(x):a||(a=A&~e,a!==0&&(u=At(a))))):(A=o&~f,A!==0?u=At(A):x!==0?u=At(x):a||(a=o&~e,a!==0&&(u=At(a)))),u===0?0:n!==0&&n!==u&&(n&f)===0&&(f=u&-u,a=n&-n,f>=a||f===32&&(a&4194048)!==0)?n:u}function jt(e,n){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&n)===0}function le(e,n){switch(e){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Pe(){var e=kt;return kt<<=1,(kt&62914560)===0&&(kt=4194304),e}function Re(e){for(var n=[],a=0;31>a;a++)n.push(e);return n}function On(e,n){e.pendingLanes|=n,n!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function si(e,n,a,o,u,f){var x=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var A=e.entanglements,G=e.expirationTimes,it=e.hiddenUpdates;for(a=x&~a;0<a;){var mt=31-Ht(a),St=1<<mt;A[mt]=0,G[mt]=-1;var ot=it[mt];if(ot!==null)for(it[mt]=null,mt=0;mt<ot.length;mt++){var ht=ot[mt];ht!==null&&(ht.lane&=-536870913)}a&=~St}o!==0&&kr(e,o,0),f!==0&&u===0&&e.tag!==0&&(e.suspendedLanes|=f&~(x&~n))}function kr(e,n,a){e.pendingLanes|=n,e.suspendedLanes&=~n;var o=31-Ht(n);e.entangledLanes|=n,e.entanglements[o]=e.entanglements[o]|1073741824|a&261930}function Ai(e,n){var a=e.entangledLanes|=n;for(e=e.entanglements;a;){var o=31-Ht(a),u=1<<o;u&n|e[o]&n&&(e[o]|=n),a&=~u}}function Us(e,n){var a=n&-n;return a=(a&42)!==0?1:Ns(a),(a&(e.suspendedLanes|n))!==0?0:a}function Ns(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Ls(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Za(){var e=Y.p;return e!==0?e:(e=window.event,e===void 0?32:y_(e.type))}function Xr(e,n){var a=Y.p;try{return Y.p=e,n()}finally{Y.p=a}}var Yn=Math.random().toString(36).slice(2),rn="__reactFiber$"+Yn,En="__reactProps$"+Yn,ha="__reactContainer$"+Yn,jr="__reactEvents$"+Yn,Qc="__reactListeners$"+Yn,Jc="__reactHandles$"+Yn,$o="__reactResources$"+Yn,Ka="__reactMarker$"+Yn;function C(e){delete e[rn],delete e[En],delete e[jr],delete e[Qc],delete e[Jc]}function Z(e){var n=e[rn];if(n)return n;for(var a=e.parentNode;a;){if(n=a[ha]||a[rn]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(e=s_(e);e!==null;){if(a=e[rn])return a;e=s_(e)}return n}e=a,a=e.parentNode}return null}function ct(e){if(e=e[rn]||e[ha]){var n=e.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return e}return null}function ft(e){var n=e.tag;if(n===5||n===26||n===27||n===6)return e.stateNode;throw Error(s(33))}function Q(e){var n=e[$o];return n||(n=e[$o]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function bt(e){e[Ka]=!0}var It=new Set,Zt={};function Ft(e,n){ie(e,n),ie(e+"Capture",n)}function ie(e,n){for(Zt[e]=n,e=0;e<n.length;e++)It.add(n[e])}var oe=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),ae={},_e={};function Le(e){return Xt.call(_e,e)?!0:Xt.call(ae,e)?!1:oe.test(e)?_e[e]=!0:(ae[e]=!0,!1)}function Xe(e,n,a){if(Le(n))if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(n);return;case"boolean":var o=n.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){e.removeAttribute(n);return}}e.setAttribute(n,""+a)}}function Oe(e,n,a){if(a===null)e.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttribute(n,""+a)}}function ve(e,n,a,o){if(o===null)e.removeAttribute(a);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(n,a,""+o)}}function Kt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function We(e){var n=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function Ce(e,n,a){var o=Object.getOwnPropertyDescriptor(e.constructor.prototype,n);if(!e.hasOwnProperty(n)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var u=o.get,f=o.set;return Object.defineProperty(e,n,{configurable:!0,get:function(){return u.call(this)},set:function(x){a=""+x,f.call(this,x)}}),Object.defineProperty(e,n,{enumerable:o.enumerable}),{getValue:function(){return a},setValue:function(x){a=""+x},stopTracking:function(){e._valueTracker=null,delete e[n]}}}}function bn(e){if(!e._valueTracker){var n=We(e)?"checked":"value";e._valueTracker=Ce(e,n,""+e[n])}}function Bi(e){if(!e)return!1;var n=e._valueTracker;if(!n)return!0;var a=n.getValue(),o="";return e&&(o=We(e)?e.checked?"true":"false":e.value),e=o,e!==a?(n.setValue(e),!0):!1}function xn(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Qa=/[\n"\\]/g;function Ee(e){return e.replace(Qa,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function Dn(e,n,a,o,u,f,x,A){e.name="",x!=null&&typeof x!="function"&&typeof x!="symbol"&&typeof x!="boolean"?e.type=x:e.removeAttribute("type"),n!=null?x==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+Kt(n)):e.value!==""+Kt(n)&&(e.value=""+Kt(n)):x!=="submit"&&x!=="reset"||e.removeAttribute("value"),n!=null?hn(e,x,Kt(n)):a!=null?hn(e,x,Kt(a)):o!=null&&e.removeAttribute("value"),u==null&&f!=null&&(e.defaultChecked=!!f),u!=null&&(e.checked=u&&typeof u!="function"&&typeof u!="symbol"),A!=null&&typeof A!="function"&&typeof A!="symbol"&&typeof A!="boolean"?e.name=""+Kt(A):e.removeAttribute("name")}function Pn(e,n,a,o,u,f,x,A){if(f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(e.type=f),n!=null||a!=null){if(!(f!=="submit"&&f!=="reset"||n!=null)){bn(e);return}a=a!=null?""+Kt(a):"",n=n!=null?""+Kt(n):a,A||n===e.value||(e.value=n),e.defaultValue=n}o=o??u,o=typeof o!="function"&&typeof o!="symbol"&&!!o,e.checked=A?e.checked:!!o,e.defaultChecked=!!o,x!=null&&typeof x!="function"&&typeof x!="symbol"&&typeof x!="boolean"&&(e.name=x),bn(e)}function hn(e,n,a){n==="number"&&xn(e.ownerDocument)===e||e.defaultValue===""+a||(e.defaultValue=""+a)}function nn(e,n,a,o){if(e=e.options,n){n={};for(var u=0;u<a.length;u++)n["$"+a[u]]=!0;for(a=0;a<e.length;a++)u=n.hasOwnProperty("$"+e[a].value),e[a].selected!==u&&(e[a].selected=u),u&&o&&(e[a].defaultSelected=!0)}else{for(a=""+Kt(a),n=null,u=0;u<e.length;u++){if(e[u].value===a){e[u].selected=!0,o&&(e[u].defaultSelected=!0);return}n!==null||e[u].disabled||(n=e[u])}n!==null&&(n.selected=!0)}}function Os(e,n,a){if(n!=null&&(n=""+Kt(n),n!==e.value&&(e.value=n),a==null)){e.defaultValue!==n&&(e.defaultValue=n);return}e.defaultValue=a!=null?""+Kt(a):""}function Ri(e,n,a,o){if(n==null){if(o!=null){if(a!=null)throw Error(s(92));if(et(o)){if(1<o.length)throw Error(s(93));o=o[0]}a=o}a==null&&(a=""),n=a}a=Kt(n),e.defaultValue=a,o=e.textContent,o===a&&o!==""&&o!==null&&(e.value=o),bn(e)}function Ps(e,n){if(n){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=n;return}}e.textContent=n}var Pv=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Yd(e,n,a){var o=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?o?e.setProperty(n,""):n==="float"?e.cssFloat="":e[n]="":o?e.setProperty(n,a):typeof a!="number"||a===0||Pv.has(n)?n==="float"?e.cssFloat=a:e[n]=(""+a).trim():e[n]=a+"px"}function Zd(e,n,a){if(n!=null&&typeof n!="object")throw Error(s(62));if(e=e.style,a!=null){for(var o in a)!a.hasOwnProperty(o)||n!=null&&n.hasOwnProperty(o)||(o.indexOf("--")===0?e.setProperty(o,""):o==="float"?e.cssFloat="":e[o]="");for(var u in n)o=n[u],n.hasOwnProperty(u)&&a[u]!==o&&Yd(e,u,o)}else for(var f in n)n.hasOwnProperty(f)&&Yd(e,f,n[f])}function $c(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var zv=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Iv=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function tl(e){return Iv.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Fi(){}var tu=null;function eu(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var zs=null,Is=null;function Kd(e){var n=ct(e);if(n&&(e=n.stateNode)){var a=e[En]||null;t:switch(e=n.stateNode,n.type){case"input":if(Dn(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+Ee(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var o=a[n];if(o!==e&&o.form===e.form){var u=o[En]||null;if(!u)throw Error(s(90));Dn(o,u.value,u.defaultValue,u.defaultValue,u.checked,u.defaultChecked,u.type,u.name)}}for(n=0;n<a.length;n++)o=a[n],o.form===e.form&&Bi(o)}break t;case"textarea":Os(e,a.value,a.defaultValue);break t;case"select":n=a.value,n!=null&&nn(e,!!a.multiple,n,!1)}}}var nu=!1;function Qd(e,n,a){if(nu)return e(n,a);nu=!0;try{var o=e(n);return o}finally{if(nu=!1,(zs!==null||Is!==null)&&(Gl(),zs&&(n=zs,e=Is,Is=zs=null,Kd(n),e)))for(n=0;n<e.length;n++)Kd(e[n])}}function Wr(e,n){var a=e.stateNode;if(a===null)return null;var o=a[En]||null;if(o===null)return null;a=o[n];t:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break t;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(s(231,n,typeof a));return a}var Hi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),iu=!1;if(Hi)try{var qr={};Object.defineProperty(qr,"passive",{get:function(){iu=!0}}),window.addEventListener("test",qr,qr),window.removeEventListener("test",qr,qr)}catch{iu=!1}var da=null,au=null,el=null;function Jd(){if(el)return el;var e,n=au,a=n.length,o,u="value"in da?da.value:da.textContent,f=u.length;for(e=0;e<a&&n[e]===u[e];e++);var x=a-e;for(o=1;o<=x&&n[a-o]===u[f-o];o++);return el=u.slice(e,1<o?1-o:void 0)}function nl(e){var n=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&n===13&&(e=13)):e=n,e===10&&(e=13),32<=e||e===13?e:0}function il(){return!0}function $d(){return!1}function Bn(e){function n(a,o,u,f,x){this._reactName=a,this._targetInst=u,this.type=o,this.nativeEvent=f,this.target=x,this.currentTarget=null;for(var A in e)e.hasOwnProperty(A)&&(a=e[A],this[A]=a?a(f):f[A]);return this.isDefaultPrevented=(f.defaultPrevented!=null?f.defaultPrevented:f.returnValue===!1)?il:$d,this.isPropagationStopped=$d,this}return v(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=il)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=il)},persist:function(){},isPersistent:il}),n}var Ja={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},al=Bn(Ja),Yr=v({},Ja,{view:0,detail:0}),Bv=Bn(Yr),su,ru,Zr,sl=v({},Yr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:lu,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Zr&&(Zr&&e.type==="mousemove"?(su=e.screenX-Zr.screenX,ru=e.screenY-Zr.screenY):ru=su=0,Zr=e),su)},movementY:function(e){return"movementY"in e?e.movementY:ru}}),tp=Bn(sl),Fv=v({},sl,{dataTransfer:0}),Hv=Bn(Fv),Gv=v({},Yr,{relatedTarget:0}),ou=Bn(Gv),Vv=v({},Ja,{animationName:0,elapsedTime:0,pseudoElement:0}),kv=Bn(Vv),Xv=v({},Ja,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),jv=Bn(Xv),Wv=v({},Ja,{data:0}),ep=Bn(Wv),qv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Yv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Zv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Kv(e){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(e):(e=Zv[e])?!!n[e]:!1}function lu(){return Kv}var Qv=v({},Yr,{key:function(e){if(e.key){var n=qv[e.key]||e.key;if(n!=="Unidentified")return n}return e.type==="keypress"?(e=nl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Yv[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:lu,charCode:function(e){return e.type==="keypress"?nl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?nl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Jv=Bn(Qv),$v=v({},sl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),np=Bn($v),tx=v({},Yr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:lu}),ex=Bn(tx),nx=v({},Ja,{propertyName:0,elapsedTime:0,pseudoElement:0}),ix=Bn(nx),ax=v({},sl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),sx=Bn(ax),rx=v({},Ja,{newState:0,oldState:0}),ox=Bn(rx),lx=[9,13,27,32],cu=Hi&&"CompositionEvent"in window,Kr=null;Hi&&"documentMode"in document&&(Kr=document.documentMode);var cx=Hi&&"TextEvent"in window&&!Kr,ip=Hi&&(!cu||Kr&&8<Kr&&11>=Kr),ap=" ",sp=!1;function rp(e,n){switch(e){case"keyup":return lx.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function op(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Bs=!1;function ux(e,n){switch(e){case"compositionend":return op(n);case"keypress":return n.which!==32?null:(sp=!0,ap);case"textInput":return e=n.data,e===ap&&sp?null:e;default:return null}}function fx(e,n){if(Bs)return e==="compositionend"||!cu&&rp(e,n)?(e=Jd(),el=au=da=null,Bs=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return ip&&n.locale!=="ko"?null:n.data;default:return null}}var hx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function lp(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n==="input"?!!hx[e.type]:n==="textarea"}function cp(e,n,a,o){zs?Is?Is.push(o):Is=[o]:zs=o,n=Yl(n,"onChange"),0<n.length&&(a=new al("onChange","change",null,a,o),e.push({event:a,listeners:n}))}var Qr=null,Jr=null;function dx(e){jg(e,0)}function rl(e){var n=ft(e);if(Bi(n))return e}function up(e,n){if(e==="change")return n}var fp=!1;if(Hi){var uu;if(Hi){var fu="oninput"in document;if(!fu){var hp=document.createElement("div");hp.setAttribute("oninput","return;"),fu=typeof hp.oninput=="function"}uu=fu}else uu=!1;fp=uu&&(!document.documentMode||9<document.documentMode)}function dp(){Qr&&(Qr.detachEvent("onpropertychange",pp),Jr=Qr=null)}function pp(e){if(e.propertyName==="value"&&rl(Jr)){var n=[];cp(n,Jr,e,eu(e)),Qd(dx,n)}}function px(e,n,a){e==="focusin"?(dp(),Qr=n,Jr=a,Qr.attachEvent("onpropertychange",pp)):e==="focusout"&&dp()}function mx(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return rl(Jr)}function gx(e,n){if(e==="click")return rl(n)}function _x(e,n){if(e==="input"||e==="change")return rl(n)}function vx(e,n){return e===n&&(e!==0||1/e===1/n)||e!==e&&n!==n}var Zn=typeof Object.is=="function"?Object.is:vx;function $r(e,n){if(Zn(e,n))return!0;if(typeof e!="object"||e===null||typeof n!="object"||n===null)return!1;var a=Object.keys(e),o=Object.keys(n);if(a.length!==o.length)return!1;for(o=0;o<a.length;o++){var u=a[o];if(!Xt.call(n,u)||!Zn(e[u],n[u]))return!1}return!0}function mp(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function gp(e,n){var a=mp(e);e=0;for(var o;a;){if(a.nodeType===3){if(o=e+a.textContent.length,e<=n&&o>=n)return{node:a,offset:n-e};e=o}t:{for(;a;){if(a.nextSibling){a=a.nextSibling;break t}a=a.parentNode}a=void 0}a=mp(a)}}function _p(e,n){return e&&n?e===n?!0:e&&e.nodeType===3?!1:n&&n.nodeType===3?_p(e,n.parentNode):"contains"in e?e.contains(n):e.compareDocumentPosition?!!(e.compareDocumentPosition(n)&16):!1:!1}function vp(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var n=xn(e.document);n instanceof e.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)e=n.contentWindow;else break;n=xn(e.document)}return n}function hu(e){var n=e&&e.nodeName&&e.nodeName.toLowerCase();return n&&(n==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||n==="textarea"||e.contentEditable==="true")}var xx=Hi&&"documentMode"in document&&11>=document.documentMode,Fs=null,du=null,to=null,pu=!1;function xp(e,n,a){var o=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;pu||Fs==null||Fs!==xn(o)||(o=Fs,"selectionStart"in o&&hu(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),to&&$r(to,o)||(to=o,o=Yl(du,"onSelect"),0<o.length&&(n=new al("onSelect","select",null,n,a),e.push({event:n,listeners:o}),n.target=Fs)))}function $a(e,n){var a={};return a[e.toLowerCase()]=n.toLowerCase(),a["Webkit"+e]="webkit"+n,a["Moz"+e]="moz"+n,a}var Hs={animationend:$a("Animation","AnimationEnd"),animationiteration:$a("Animation","AnimationIteration"),animationstart:$a("Animation","AnimationStart"),transitionrun:$a("Transition","TransitionRun"),transitionstart:$a("Transition","TransitionStart"),transitioncancel:$a("Transition","TransitionCancel"),transitionend:$a("Transition","TransitionEnd")},mu={},Sp={};Hi&&(Sp=document.createElement("div").style,"AnimationEvent"in window||(delete Hs.animationend.animation,delete Hs.animationiteration.animation,delete Hs.animationstart.animation),"TransitionEvent"in window||delete Hs.transitionend.transition);function ts(e){if(mu[e])return mu[e];if(!Hs[e])return e;var n=Hs[e],a;for(a in n)if(n.hasOwnProperty(a)&&a in Sp)return mu[e]=n[a];return e}var yp=ts("animationend"),Mp=ts("animationiteration"),Ep=ts("animationstart"),Sx=ts("transitionrun"),yx=ts("transitionstart"),Mx=ts("transitioncancel"),bp=ts("transitionend"),Tp=new Map,gu="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");gu.push("scrollEnd");function _i(e,n){Tp.set(e,n),Ft(n,[e])}var ol=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},ri=[],Gs=0,_u=0;function ll(){for(var e=Gs,n=_u=Gs=0;n<e;){var a=ri[n];ri[n++]=null;var o=ri[n];ri[n++]=null;var u=ri[n];ri[n++]=null;var f=ri[n];if(ri[n++]=null,o!==null&&u!==null){var x=o.pending;x===null?u.next=u:(u.next=x.next,x.next=u),o.pending=u}f!==0&&Ap(a,u,f)}}function cl(e,n,a,o){ri[Gs++]=e,ri[Gs++]=n,ri[Gs++]=a,ri[Gs++]=o,_u|=o,e.lanes|=o,e=e.alternate,e!==null&&(e.lanes|=o)}function vu(e,n,a,o){return cl(e,n,a,o),ul(e)}function es(e,n){return cl(e,null,null,n),ul(e)}function Ap(e,n,a){e.lanes|=a;var o=e.alternate;o!==null&&(o.lanes|=a);for(var u=!1,f=e.return;f!==null;)f.childLanes|=a,o=f.alternate,o!==null&&(o.childLanes|=a),f.tag===22&&(e=f.stateNode,e===null||e._visibility&1||(u=!0)),e=f,f=f.return;return e.tag===3?(f=e.stateNode,u&&n!==null&&(u=31-Ht(a),e=f.hiddenUpdates,o=e[u],o===null?e[u]=[n]:o.push(n),n.lane=a|536870912),f):null}function ul(e){if(50<Eo)throw Eo=0,Cf=null,Error(s(185));for(var n=e.return;n!==null;)e=n,n=e.return;return e.tag===3?e.stateNode:null}var Vs={};function Ex(e,n,a,o){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Kn(e,n,a,o){return new Ex(e,n,a,o)}function xu(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Gi(e,n){var a=e.alternate;return a===null?(a=Kn(e.tag,n,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=n,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&65011712,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,n=e.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function Rp(e,n){e.flags&=65011714;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=n,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,n=a.dependencies,e.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),e}function fl(e,n,a,o,u,f){var x=0;if(o=e,typeof e=="function")xu(e)&&(x=1);else if(typeof e=="string")x=CS(e,a,Mt.current)?26:e==="html"||e==="head"||e==="body"?27:5;else t:switch(e){case U:return e=Kn(31,a,n,u),e.elementType=U,e.lanes=f,e;case E:return ns(a.children,u,f,n);case y:x=8,u|=24;break;case g:return e=Kn(12,a,n,u|2),e.elementType=g,e.lanes=f,e;case V:return e=Kn(13,a,n,u),e.elementType=V,e.lanes=f,e;case F:return e=Kn(19,a,n,u),e.elementType=F,e.lanes=f,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case R:x=10;break t;case B:x=9;break t;case w:x=11;break t;case L:x=14;break t;case X:x=16,o=null;break t}x=29,a=Error(s(130,e===null?"null":typeof e,"")),o=null}return n=Kn(x,a,n,u),n.elementType=e,n.type=o,n.lanes=f,n}function ns(e,n,a,o){return e=Kn(7,e,o,n),e.lanes=a,e}function Su(e,n,a){return e=Kn(6,e,null,n),e.lanes=a,e}function Cp(e){var n=Kn(18,null,null,0);return n.stateNode=e,n}function yu(e,n,a){return n=Kn(4,e.children!==null?e.children:[],e.key,n),n.lanes=a,n.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},n}var wp=new WeakMap;function oi(e,n){if(typeof e=="object"&&e!==null){var a=wp.get(e);return a!==void 0?a:(n={value:e,source:n,stack:ke(n)},wp.set(e,n),n)}return{value:e,source:n,stack:ke(n)}}var ks=[],Xs=0,hl=null,eo=0,li=[],ci=0,pa=null,Ci=1,wi="";function Vi(e,n){ks[Xs++]=eo,ks[Xs++]=hl,hl=e,eo=n}function Dp(e,n,a){li[ci++]=Ci,li[ci++]=wi,li[ci++]=pa,pa=e;var o=Ci;e=wi;var u=32-Ht(o)-1;o&=~(1<<u),a+=1;var f=32-Ht(n)+u;if(30<f){var x=u-u%5;f=(o&(1<<x)-1).toString(32),o>>=x,u-=x,Ci=1<<32-Ht(n)+u|a<<u|o,wi=f+e}else Ci=1<<f|a<<u|o,wi=e}function Mu(e){e.return!==null&&(Vi(e,1),Dp(e,1,0))}function Eu(e){for(;e===hl;)hl=ks[--Xs],ks[Xs]=null,eo=ks[--Xs],ks[Xs]=null;for(;e===pa;)pa=li[--ci],li[ci]=null,wi=li[--ci],li[ci]=null,Ci=li[--ci],li[ci]=null}function Up(e,n){li[ci++]=Ci,li[ci++]=wi,li[ci++]=pa,Ci=n.id,wi=n.overflow,pa=e}var Tn=null,qe=null,Ae=!1,ma=null,ui=!1,bu=Error(s(519));function ga(e){var n=Error(s(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw no(oi(n,e)),bu}function Np(e){var n=e.stateNode,a=e.type,o=e.memoizedProps;switch(n[rn]=e,n[En]=o,a){case"dialog":Se("cancel",n),Se("close",n);break;case"iframe":case"object":case"embed":Se("load",n);break;case"video":case"audio":for(a=0;a<To.length;a++)Se(To[a],n);break;case"source":Se("error",n);break;case"img":case"image":case"link":Se("error",n),Se("load",n);break;case"details":Se("toggle",n);break;case"input":Se("invalid",n),Pn(n,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":Se("invalid",n);break;case"textarea":Se("invalid",n),Ri(n,o.value,o.defaultValue,o.children)}a=o.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||o.suppressHydrationWarning===!0||Zg(n.textContent,a)?(o.popover!=null&&(Se("beforetoggle",n),Se("toggle",n)),o.onScroll!=null&&Se("scroll",n),o.onScrollEnd!=null&&Se("scrollend",n),o.onClick!=null&&(n.onclick=Fi),n=!0):n=!1,n||ga(e,!0)}function Lp(e){for(Tn=e.return;Tn;)switch(Tn.tag){case 5:case 31:case 13:ui=!1;return;case 27:case 3:ui=!0;return;default:Tn=Tn.return}}function js(e){if(e!==Tn)return!1;if(!Ae)return Lp(e),Ae=!0,!1;var n=e.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||kf(e.type,e.memoizedProps)),a=!a),a&&qe&&ga(e),Lp(e),n===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));qe=a_(e)}else if(n===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));qe=a_(e)}else n===27?(n=qe,Da(e.type)?(e=Yf,Yf=null,qe=e):qe=n):qe=Tn?hi(e.stateNode.nextSibling):null;return!0}function is(){qe=Tn=null,Ae=!1}function Tu(){var e=ma;return e!==null&&(Vn===null?Vn=e:Vn.push.apply(Vn,e),ma=null),e}function no(e){ma===null?ma=[e]:ma.push(e)}var Au=N(null),as=null,ki=null;function _a(e,n,a){vt(Au,n._currentValue),n._currentValue=a}function Xi(e){e._currentValue=Au.current,W(Au)}function Ru(e,n,a){for(;e!==null;){var o=e.alternate;if((e.childLanes&n)!==n?(e.childLanes|=n,o!==null&&(o.childLanes|=n)):o!==null&&(o.childLanes&n)!==n&&(o.childLanes|=n),e===a)break;e=e.return}}function Cu(e,n,a,o){var u=e.child;for(u!==null&&(u.return=e);u!==null;){var f=u.dependencies;if(f!==null){var x=u.child;f=f.firstContext;t:for(;f!==null;){var A=f;f=u;for(var G=0;G<n.length;G++)if(A.context===n[G]){f.lanes|=a,A=f.alternate,A!==null&&(A.lanes|=a),Ru(f.return,a,e),o||(x=null);break t}f=A.next}}else if(u.tag===18){if(x=u.return,x===null)throw Error(s(341));x.lanes|=a,f=x.alternate,f!==null&&(f.lanes|=a),Ru(x,a,e),x=null}else x=u.child;if(x!==null)x.return=u;else for(x=u;x!==null;){if(x===e){x=null;break}if(u=x.sibling,u!==null){u.return=x.return,x=u;break}x=x.return}u=x}}function Ws(e,n,a,o){e=null;for(var u=n,f=!1;u!==null;){if(!f){if((u.flags&524288)!==0)f=!0;else if((u.flags&262144)!==0)break}if(u.tag===10){var x=u.alternate;if(x===null)throw Error(s(387));if(x=x.memoizedProps,x!==null){var A=u.type;Zn(u.pendingProps.value,x.value)||(e!==null?e.push(A):e=[A])}}else if(u===ut.current){if(x=u.alternate,x===null)throw Error(s(387));x.memoizedState.memoizedState!==u.memoizedState.memoizedState&&(e!==null?e.push(Do):e=[Do])}u=u.return}e!==null&&Cu(n,e,a,o),n.flags|=262144}function dl(e){for(e=e.firstContext;e!==null;){if(!Zn(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function ss(e){as=e,ki=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function An(e){return Op(as,e)}function pl(e,n){return as===null&&ss(e),Op(e,n)}function Op(e,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},ki===null){if(e===null)throw Error(s(308));ki=n,e.dependencies={lanes:0,firstContext:n},e.flags|=524288}else ki=ki.next=n;return a}var bx=typeof AbortController<"u"?AbortController:function(){var e=[],n=this.signal={aborted:!1,addEventListener:function(a,o){e.push(o)}};this.abort=function(){n.aborted=!0,e.forEach(function(a){return a()})}},Tx=r.unstable_scheduleCallback,Ax=r.unstable_NormalPriority,on={$$typeof:R,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function wu(){return{controller:new bx,data:new Map,refCount:0}}function io(e){e.refCount--,e.refCount===0&&Tx(Ax,function(){e.controller.abort()})}var ao=null,Du=0,qs=0,Ys=null;function Rx(e,n){if(ao===null){var a=ao=[];Du=0,qs=Of(),Ys={status:"pending",value:void 0,then:function(o){a.push(o)}}}return Du++,n.then(Pp,Pp),n}function Pp(){if(--Du===0&&ao!==null){Ys!==null&&(Ys.status="fulfilled");var e=ao;ao=null,qs=0,Ys=null;for(var n=0;n<e.length;n++)(0,e[n])()}}function Cx(e,n){var a=[],o={status:"pending",value:null,reason:null,then:function(u){a.push(u)}};return e.then(function(){o.status="fulfilled",o.value=n;for(var u=0;u<a.length;u++)(0,a[u])(n)},function(u){for(o.status="rejected",o.reason=u,u=0;u<a.length;u++)(0,a[u])(void 0)}),o}var zp=I.S;I.S=function(e,n){xg=T(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&Rx(e,n),zp!==null&&zp(e,n)};var rs=N(null);function Uu(){var e=rs.current;return e!==null?e:je.pooledCache}function ml(e,n){n===null?vt(rs,rs.current):vt(rs,n.pool)}function Ip(){var e=Uu();return e===null?null:{parent:on._currentValue,pool:e}}var Zs=Error(s(460)),Nu=Error(s(474)),gl=Error(s(542)),_l={then:function(){}};function Bp(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Fp(e,n,a){switch(a=e[a],a===void 0?e.push(n):a!==n&&(n.then(Fi,Fi),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Gp(e),e;default:if(typeof n.status=="string")n.then(Fi,Fi);else{if(e=je,e!==null&&100<e.shellSuspendCounter)throw Error(s(482));e=n,e.status="pending",e.then(function(o){if(n.status==="pending"){var u=n;u.status="fulfilled",u.value=o}},function(o){if(n.status==="pending"){var u=n;u.status="rejected",u.reason=o}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw e=n.reason,Gp(e),e}throw ls=n,Zs}}function os(e){try{var n=e._init;return n(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(ls=a,Zs):a}}var ls=null;function Hp(){if(ls===null)throw Error(s(459));var e=ls;return ls=null,e}function Gp(e){if(e===Zs||e===gl)throw Error(s(483))}var Ks=null,so=0;function vl(e){var n=so;return so+=1,Ks===null&&(Ks=[]),Fp(Ks,e,n)}function ro(e,n){n=n.props.ref,e.ref=n!==void 0?n:null}function xl(e,n){throw n.$$typeof===S?Error(s(525)):(e=Object.prototype.toString.call(n),Error(s(31,e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)))}function Vp(e){function n(J,k){if(e){var nt=J.deletions;nt===null?(J.deletions=[k],J.flags|=16):nt.push(k)}}function a(J,k){if(!e)return null;for(;k!==null;)n(J,k),k=k.sibling;return null}function o(J){for(var k=new Map;J!==null;)J.key!==null?k.set(J.key,J):k.set(J.index,J),J=J.sibling;return k}function u(J,k){return J=Gi(J,k),J.index=0,J.sibling=null,J}function f(J,k,nt){return J.index=nt,e?(nt=J.alternate,nt!==null?(nt=nt.index,nt<k?(J.flags|=67108866,k):nt):(J.flags|=67108866,k)):(J.flags|=1048576,k)}function x(J){return e&&J.alternate===null&&(J.flags|=67108866),J}function A(J,k,nt,_t){return k===null||k.tag!==6?(k=Su(nt,J.mode,_t),k.return=J,k):(k=u(k,nt),k.return=J,k)}function G(J,k,nt,_t){var se=nt.type;return se===E?mt(J,k,nt.props.children,_t,nt.key):k!==null&&(k.elementType===se||typeof se=="object"&&se!==null&&se.$$typeof===X&&os(se)===k.type)?(k=u(k,nt.props),ro(k,nt),k.return=J,k):(k=fl(nt.type,nt.key,nt.props,null,J.mode,_t),ro(k,nt),k.return=J,k)}function it(J,k,nt,_t){return k===null||k.tag!==4||k.stateNode.containerInfo!==nt.containerInfo||k.stateNode.implementation!==nt.implementation?(k=yu(nt,J.mode,_t),k.return=J,k):(k=u(k,nt.children||[]),k.return=J,k)}function mt(J,k,nt,_t,se){return k===null||k.tag!==7?(k=ns(nt,J.mode,_t,se),k.return=J,k):(k=u(k,nt),k.return=J,k)}function St(J,k,nt){if(typeof k=="string"&&k!==""||typeof k=="number"||typeof k=="bigint")return k=Su(""+k,J.mode,nt),k.return=J,k;if(typeof k=="object"&&k!==null){switch(k.$$typeof){case M:return nt=fl(k.type,k.key,k.props,null,J.mode,nt),ro(nt,k),nt.return=J,nt;case b:return k=yu(k,J.mode,nt),k.return=J,k;case X:return k=os(k),St(J,k,nt)}if(et(k)||lt(k))return k=ns(k,J.mode,nt,null),k.return=J,k;if(typeof k.then=="function")return St(J,vl(k),nt);if(k.$$typeof===R)return St(J,pl(J,k),nt);xl(J,k)}return null}function ot(J,k,nt,_t){var se=k!==null?k.key:null;if(typeof nt=="string"&&nt!==""||typeof nt=="number"||typeof nt=="bigint")return se!==null?null:A(J,k,""+nt,_t);if(typeof nt=="object"&&nt!==null){switch(nt.$$typeof){case M:return nt.key===se?G(J,k,nt,_t):null;case b:return nt.key===se?it(J,k,nt,_t):null;case X:return nt=os(nt),ot(J,k,nt,_t)}if(et(nt)||lt(nt))return se!==null?null:mt(J,k,nt,_t,null);if(typeof nt.then=="function")return ot(J,k,vl(nt),_t);if(nt.$$typeof===R)return ot(J,k,pl(J,nt),_t);xl(J,nt)}return null}function ht(J,k,nt,_t,se){if(typeof _t=="string"&&_t!==""||typeof _t=="number"||typeof _t=="bigint")return J=J.get(nt)||null,A(k,J,""+_t,se);if(typeof _t=="object"&&_t!==null){switch(_t.$$typeof){case M:return J=J.get(_t.key===null?nt:_t.key)||null,G(k,J,_t,se);case b:return J=J.get(_t.key===null?nt:_t.key)||null,it(k,J,_t,se);case X:return _t=os(_t),ht(J,k,nt,_t,se)}if(et(_t)||lt(_t))return J=J.get(nt)||null,mt(k,J,_t,se,null);if(typeof _t.then=="function")return ht(J,k,nt,vl(_t),se);if(_t.$$typeof===R)return ht(J,k,nt,pl(k,_t),se);xl(k,_t)}return null}function Wt(J,k,nt,_t){for(var se=null,we=null,Jt=k,pe=k=0,Te=null;Jt!==null&&pe<nt.length;pe++){Jt.index>pe?(Te=Jt,Jt=null):Te=Jt.sibling;var De=ot(J,Jt,nt[pe],_t);if(De===null){Jt===null&&(Jt=Te);break}e&&Jt&&De.alternate===null&&n(J,Jt),k=f(De,k,pe),we===null?se=De:we.sibling=De,we=De,Jt=Te}if(pe===nt.length)return a(J,Jt),Ae&&Vi(J,pe),se;if(Jt===null){for(;pe<nt.length;pe++)Jt=St(J,nt[pe],_t),Jt!==null&&(k=f(Jt,k,pe),we===null?se=Jt:we.sibling=Jt,we=Jt);return Ae&&Vi(J,pe),se}for(Jt=o(Jt);pe<nt.length;pe++)Te=ht(Jt,J,pe,nt[pe],_t),Te!==null&&(e&&Te.alternate!==null&&Jt.delete(Te.key===null?pe:Te.key),k=f(Te,k,pe),we===null?se=Te:we.sibling=Te,we=Te);return e&&Jt.forEach(function(Pa){return n(J,Pa)}),Ae&&Vi(J,pe),se}function re(J,k,nt,_t){if(nt==null)throw Error(s(151));for(var se=null,we=null,Jt=k,pe=k=0,Te=null,De=nt.next();Jt!==null&&!De.done;pe++,De=nt.next()){Jt.index>pe?(Te=Jt,Jt=null):Te=Jt.sibling;var Pa=ot(J,Jt,De.value,_t);if(Pa===null){Jt===null&&(Jt=Te);break}e&&Jt&&Pa.alternate===null&&n(J,Jt),k=f(Pa,k,pe),we===null?se=Pa:we.sibling=Pa,we=Pa,Jt=Te}if(De.done)return a(J,Jt),Ae&&Vi(J,pe),se;if(Jt===null){for(;!De.done;pe++,De=nt.next())De=St(J,De.value,_t),De!==null&&(k=f(De,k,pe),we===null?se=De:we.sibling=De,we=De);return Ae&&Vi(J,pe),se}for(Jt=o(Jt);!De.done;pe++,De=nt.next())De=ht(Jt,J,pe,De.value,_t),De!==null&&(e&&De.alternate!==null&&Jt.delete(De.key===null?pe:De.key),k=f(De,k,pe),we===null?se=De:we.sibling=De,we=De);return e&&Jt.forEach(function(FS){return n(J,FS)}),Ae&&Vi(J,pe),se}function He(J,k,nt,_t){if(typeof nt=="object"&&nt!==null&&nt.type===E&&nt.key===null&&(nt=nt.props.children),typeof nt=="object"&&nt!==null){switch(nt.$$typeof){case M:t:{for(var se=nt.key;k!==null;){if(k.key===se){if(se=nt.type,se===E){if(k.tag===7){a(J,k.sibling),_t=u(k,nt.props.children),_t.return=J,J=_t;break t}}else if(k.elementType===se||typeof se=="object"&&se!==null&&se.$$typeof===X&&os(se)===k.type){a(J,k.sibling),_t=u(k,nt.props),ro(_t,nt),_t.return=J,J=_t;break t}a(J,k);break}else n(J,k);k=k.sibling}nt.type===E?(_t=ns(nt.props.children,J.mode,_t,nt.key),_t.return=J,J=_t):(_t=fl(nt.type,nt.key,nt.props,null,J.mode,_t),ro(_t,nt),_t.return=J,J=_t)}return x(J);case b:t:{for(se=nt.key;k!==null;){if(k.key===se)if(k.tag===4&&k.stateNode.containerInfo===nt.containerInfo&&k.stateNode.implementation===nt.implementation){a(J,k.sibling),_t=u(k,nt.children||[]),_t.return=J,J=_t;break t}else{a(J,k);break}else n(J,k);k=k.sibling}_t=yu(nt,J.mode,_t),_t.return=J,J=_t}return x(J);case X:return nt=os(nt),He(J,k,nt,_t)}if(et(nt))return Wt(J,k,nt,_t);if(lt(nt)){if(se=lt(nt),typeof se!="function")throw Error(s(150));return nt=se.call(nt),re(J,k,nt,_t)}if(typeof nt.then=="function")return He(J,k,vl(nt),_t);if(nt.$$typeof===R)return He(J,k,pl(J,nt),_t);xl(J,nt)}return typeof nt=="string"&&nt!==""||typeof nt=="number"||typeof nt=="bigint"?(nt=""+nt,k!==null&&k.tag===6?(a(J,k.sibling),_t=u(k,nt),_t.return=J,J=_t):(a(J,k),_t=Su(nt,J.mode,_t),_t.return=J,J=_t),x(J)):a(J,k)}return function(J,k,nt,_t){try{so=0;var se=He(J,k,nt,_t);return Ks=null,se}catch(Jt){if(Jt===Zs||Jt===gl)throw Jt;var we=Kn(29,Jt,null,J.mode);return we.lanes=_t,we.return=J,we}finally{}}}var cs=Vp(!0),kp=Vp(!1),va=!1;function Lu(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Ou(e,n){e=e.updateQueue,n.updateQueue===e&&(n.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function xa(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Sa(e,n,a){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(Ne&2)!==0){var u=o.pending;return u===null?n.next=n:(n.next=u.next,u.next=n),o.pending=n,n=ul(e),Ap(e,null,a),n}return cl(e,o,n,a),ul(e)}function oo(e,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var o=n.lanes;o&=e.pendingLanes,a|=o,n.lanes=a,Ai(e,a)}}function Pu(e,n){var a=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,a===o)){var u=null,f=null;if(a=a.firstBaseUpdate,a!==null){do{var x={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};f===null?u=f=x:f=f.next=x,a=a.next}while(a!==null);f===null?u=f=n:f=f.next=n}else u=f=n;a={baseState:o.baseState,firstBaseUpdate:u,lastBaseUpdate:f,shared:o.shared,callbacks:o.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=n:e.next=n,a.lastBaseUpdate=n}var zu=!1;function lo(){if(zu){var e=Ys;if(e!==null)throw e}}function co(e,n,a,o){zu=!1;var u=e.updateQueue;va=!1;var f=u.firstBaseUpdate,x=u.lastBaseUpdate,A=u.shared.pending;if(A!==null){u.shared.pending=null;var G=A,it=G.next;G.next=null,x===null?f=it:x.next=it,x=G;var mt=e.alternate;mt!==null&&(mt=mt.updateQueue,A=mt.lastBaseUpdate,A!==x&&(A===null?mt.firstBaseUpdate=it:A.next=it,mt.lastBaseUpdate=G))}if(f!==null){var St=u.baseState;x=0,mt=it=G=null,A=f;do{var ot=A.lane&-536870913,ht=ot!==A.lane;if(ht?(be&ot)===ot:(o&ot)===ot){ot!==0&&ot===qs&&(zu=!0),mt!==null&&(mt=mt.next={lane:0,tag:A.tag,payload:A.payload,callback:null,next:null});t:{var Wt=e,re=A;ot=n;var He=a;switch(re.tag){case 1:if(Wt=re.payload,typeof Wt=="function"){St=Wt.call(He,St,ot);break t}St=Wt;break t;case 3:Wt.flags=Wt.flags&-65537|128;case 0:if(Wt=re.payload,ot=typeof Wt=="function"?Wt.call(He,St,ot):Wt,ot==null)break t;St=v({},St,ot);break t;case 2:va=!0}}ot=A.callback,ot!==null&&(e.flags|=64,ht&&(e.flags|=8192),ht=u.callbacks,ht===null?u.callbacks=[ot]:ht.push(ot))}else ht={lane:ot,tag:A.tag,payload:A.payload,callback:A.callback,next:null},mt===null?(it=mt=ht,G=St):mt=mt.next=ht,x|=ot;if(A=A.next,A===null){if(A=u.shared.pending,A===null)break;ht=A,A=ht.next,ht.next=null,u.lastBaseUpdate=ht,u.shared.pending=null}}while(!0);mt===null&&(G=St),u.baseState=G,u.firstBaseUpdate=it,u.lastBaseUpdate=mt,f===null&&(u.shared.lanes=0),Ta|=x,e.lanes=x,e.memoizedState=St}}function Xp(e,n){if(typeof e!="function")throw Error(s(191,e));e.call(n)}function jp(e,n){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)Xp(a[e],n)}var Qs=N(null),Sl=N(0);function Wp(e,n){e=$i,vt(Sl,e),vt(Qs,n),$i=e|n.baseLanes}function Iu(){vt(Sl,$i),vt(Qs,Qs.current)}function Bu(){$i=Sl.current,W(Qs),W(Sl)}var Qn=N(null),fi=null;function ya(e){var n=e.alternate;vt(an,an.current&1),vt(Qn,e),fi===null&&(n===null||Qs.current!==null||n.memoizedState!==null)&&(fi=e)}function Fu(e){vt(an,an.current),vt(Qn,e),fi===null&&(fi=e)}function qp(e){e.tag===22?(vt(an,an.current),vt(Qn,e),fi===null&&(fi=e)):Ma()}function Ma(){vt(an,an.current),vt(Qn,Qn.current)}function Jn(e){W(Qn),fi===e&&(fi=null),W(an)}var an=N(0);function yl(e){for(var n=e;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||Wf(a)||qf(a)))return n}else if(n.tag===19&&(n.memoizedProps.revealOrder==="forwards"||n.memoizedProps.revealOrder==="backwards"||n.memoizedProps.revealOrder==="unstable_legacy-backwards"||n.memoizedProps.revealOrder==="together")){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var ji=0,de=null,Be=null,ln=null,Ml=!1,Js=!1,us=!1,El=0,uo=0,$s=null,wx=0;function $e(){throw Error(s(321))}function Hu(e,n){if(n===null)return!1;for(var a=0;a<n.length&&a<e.length;a++)if(!Zn(e[a],n[a]))return!1;return!0}function Gu(e,n,a,o,u,f){return ji=f,de=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,I.H=e===null||e.memoizedState===null?Dm:nf,us=!1,f=a(o,u),us=!1,Js&&(f=Zp(n,a,o,u)),Yp(e),f}function Yp(e){I.H=po;var n=Be!==null&&Be.next!==null;if(ji=0,ln=Be=de=null,Ml=!1,uo=0,$s=null,n)throw Error(s(300));e===null||cn||(e=e.dependencies,e!==null&&dl(e)&&(cn=!0))}function Zp(e,n,a,o){de=e;var u=0;do{if(Js&&($s=null),uo=0,Js=!1,25<=u)throw Error(s(301));if(u+=1,ln=Be=null,e.updateQueue!=null){var f=e.updateQueue;f.lastEffect=null,f.events=null,f.stores=null,f.memoCache!=null&&(f.memoCache.index=0)}I.H=Um,f=n(a,o)}while(Js);return f}function Dx(){var e=I.H,n=e.useState()[0];return n=typeof n.then=="function"?fo(n):n,e=e.useState()[0],(Be!==null?Be.memoizedState:null)!==e&&(de.flags|=1024),n}function Vu(){var e=El!==0;return El=0,e}function ku(e,n,a){n.updateQueue=e.updateQueue,n.flags&=-2053,e.lanes&=~a}function Xu(e){if(Ml){for(e=e.memoizedState;e!==null;){var n=e.queue;n!==null&&(n.pending=null),e=e.next}Ml=!1}ji=0,ln=Be=de=null,Js=!1,uo=El=0,$s=null}function zn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ln===null?de.memoizedState=ln=e:ln=ln.next=e,ln}function sn(){if(Be===null){var e=de.alternate;e=e!==null?e.memoizedState:null}else e=Be.next;var n=ln===null?de.memoizedState:ln.next;if(n!==null)ln=n,Be=e;else{if(e===null)throw de.alternate===null?Error(s(467)):Error(s(310));Be=e,e={memoizedState:Be.memoizedState,baseState:Be.baseState,baseQueue:Be.baseQueue,queue:Be.queue,next:null},ln===null?de.memoizedState=ln=e:ln=ln.next=e}return ln}function bl(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function fo(e){var n=uo;return uo+=1,$s===null&&($s=[]),e=Fp($s,e,n),n=de,(ln===null?n.memoizedState:ln.next)===null&&(n=n.alternate,I.H=n===null||n.memoizedState===null?Dm:nf),e}function Tl(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return fo(e);if(e.$$typeof===R)return An(e)}throw Error(s(438,String(e)))}function ju(e){var n=null,a=de.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var o=de.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(n={data:o.data.map(function(u){return u.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=bl(),de.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(e),o=0;o<e;o++)a[o]=D;return n.index++,a}function Wi(e,n){return typeof n=="function"?n(e):n}function Al(e){var n=sn();return Wu(n,Be,e)}function Wu(e,n,a){var o=e.queue;if(o===null)throw Error(s(311));o.lastRenderedReducer=a;var u=e.baseQueue,f=o.pending;if(f!==null){if(u!==null){var x=u.next;u.next=f.next,f.next=x}n.baseQueue=u=f,o.pending=null}if(f=e.baseState,u===null)e.memoizedState=f;else{n=u.next;var A=x=null,G=null,it=n,mt=!1;do{var St=it.lane&-536870913;if(St!==it.lane?(be&St)===St:(ji&St)===St){var ot=it.revertLane;if(ot===0)G!==null&&(G=G.next={lane:0,revertLane:0,gesture:null,action:it.action,hasEagerState:it.hasEagerState,eagerState:it.eagerState,next:null}),St===qs&&(mt=!0);else if((ji&ot)===ot){it=it.next,ot===qs&&(mt=!0);continue}else St={lane:0,revertLane:it.revertLane,gesture:null,action:it.action,hasEagerState:it.hasEagerState,eagerState:it.eagerState,next:null},G===null?(A=G=St,x=f):G=G.next=St,de.lanes|=ot,Ta|=ot;St=it.action,us&&a(f,St),f=it.hasEagerState?it.eagerState:a(f,St)}else ot={lane:St,revertLane:it.revertLane,gesture:it.gesture,action:it.action,hasEagerState:it.hasEagerState,eagerState:it.eagerState,next:null},G===null?(A=G=ot,x=f):G=G.next=ot,de.lanes|=St,Ta|=St;it=it.next}while(it!==null&&it!==n);if(G===null?x=f:G.next=A,!Zn(f,e.memoizedState)&&(cn=!0,mt&&(a=Ys,a!==null)))throw a;e.memoizedState=f,e.baseState=x,e.baseQueue=G,o.lastRenderedState=f}return u===null&&(o.lanes=0),[e.memoizedState,o.dispatch]}function qu(e){var n=sn(),a=n.queue;if(a===null)throw Error(s(311));a.lastRenderedReducer=e;var o=a.dispatch,u=a.pending,f=n.memoizedState;if(u!==null){a.pending=null;var x=u=u.next;do f=e(f,x.action),x=x.next;while(x!==u);Zn(f,n.memoizedState)||(cn=!0),n.memoizedState=f,n.baseQueue===null&&(n.baseState=f),a.lastRenderedState=f}return[f,o]}function Kp(e,n,a){var o=de,u=sn(),f=Ae;if(f){if(a===void 0)throw Error(s(407));a=a()}else a=n();var x=!Zn((Be||u).memoizedState,a);if(x&&(u.memoizedState=a,cn=!0),u=u.queue,Ku($p.bind(null,o,u,e),[e]),u.getSnapshot!==n||x||ln!==null&&ln.memoizedState.tag&1){if(o.flags|=2048,tr(9,{destroy:void 0},Jp.bind(null,o,u,a,n),null),je===null)throw Error(s(349));f||(ji&127)!==0||Qp(o,n,a)}return a}function Qp(e,n,a){e.flags|=16384,e={getSnapshot:n,value:a},n=de.updateQueue,n===null?(n=bl(),de.updateQueue=n,n.stores=[e]):(a=n.stores,a===null?n.stores=[e]:a.push(e))}function Jp(e,n,a,o){n.value=a,n.getSnapshot=o,tm(n)&&em(e)}function $p(e,n,a){return a(function(){tm(n)&&em(e)})}function tm(e){var n=e.getSnapshot;e=e.value;try{var a=n();return!Zn(e,a)}catch{return!0}}function em(e){var n=es(e,2);n!==null&&kn(n,e,2)}function Yu(e){var n=zn();if(typeof e=="function"){var a=e;if(e=a(),us){ne(!0);try{a()}finally{ne(!1)}}}return n.memoizedState=n.baseState=e,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Wi,lastRenderedState:e},n}function nm(e,n,a,o){return e.baseState=a,Wu(e,Be,typeof o=="function"?o:Wi)}function Ux(e,n,a,o,u){if(wl(e))throw Error(s(485));if(e=n.action,e!==null){var f={payload:u,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(x){f.listeners.push(x)}};I.T!==null?a(!0):f.isTransition=!1,o(f),a=n.pending,a===null?(f.next=n.pending=f,im(n,f)):(f.next=a.next,n.pending=a.next=f)}}function im(e,n){var a=n.action,o=n.payload,u=e.state;if(n.isTransition){var f=I.T,x={};I.T=x;try{var A=a(u,o),G=I.S;G!==null&&G(x,A),am(e,n,A)}catch(it){Zu(e,n,it)}finally{f!==null&&x.types!==null&&(f.types=x.types),I.T=f}}else try{f=a(u,o),am(e,n,f)}catch(it){Zu(e,n,it)}}function am(e,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(o){sm(e,n,o)},function(o){return Zu(e,n,o)}):sm(e,n,a)}function sm(e,n,a){n.status="fulfilled",n.value=a,rm(n),e.state=a,n=e.pending,n!==null&&(a=n.next,a===n?e.pending=null:(a=a.next,n.next=a,im(e,a)))}function Zu(e,n,a){var o=e.pending;if(e.pending=null,o!==null){o=o.next;do n.status="rejected",n.reason=a,rm(n),n=n.next;while(n!==o)}e.action=null}function rm(e){e=e.listeners;for(var n=0;n<e.length;n++)(0,e[n])()}function om(e,n){return n}function lm(e,n){if(Ae){var a=je.formState;if(a!==null){t:{var o=de;if(Ae){if(qe){e:{for(var u=qe,f=ui;u.nodeType!==8;){if(!f){u=null;break e}if(u=hi(u.nextSibling),u===null){u=null;break e}}f=u.data,u=f==="F!"||f==="F"?u:null}if(u){qe=hi(u.nextSibling),o=u.data==="F!";break t}}ga(o)}o=!1}o&&(n=a[0])}}return a=zn(),a.memoizedState=a.baseState=n,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:om,lastRenderedState:n},a.queue=o,a=Rm.bind(null,de,o),o.dispatch=a,o=Yu(!1),f=ef.bind(null,de,!1,o.queue),o=zn(),u={state:n,dispatch:null,action:e,pending:null},o.queue=u,a=Ux.bind(null,de,u,f,a),u.dispatch=a,o.memoizedState=e,[n,a,!1]}function cm(e){var n=sn();return um(n,Be,e)}function um(e,n,a){if(n=Wu(e,n,om)[0],e=Al(Wi)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var o=fo(n)}catch(x){throw x===Zs?gl:x}else o=n;n=sn();var u=n.queue,f=u.dispatch;return a!==n.memoizedState&&(de.flags|=2048,tr(9,{destroy:void 0},Nx.bind(null,u,a),null)),[o,f,e]}function Nx(e,n){e.action=n}function fm(e){var n=sn(),a=Be;if(a!==null)return um(n,a,e);sn(),n=n.memoizedState,a=sn();var o=a.queue.dispatch;return a.memoizedState=e,[n,o,!1]}function tr(e,n,a,o){return e={tag:e,create:a,deps:o,inst:n,next:null},n=de.updateQueue,n===null&&(n=bl(),de.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=e.next=e:(o=a.next,a.next=e,e.next=o,n.lastEffect=e),e}function hm(){return sn().memoizedState}function Rl(e,n,a,o){var u=zn();de.flags|=e,u.memoizedState=tr(1|n,{destroy:void 0},a,o===void 0?null:o)}function Cl(e,n,a,o){var u=sn();o=o===void 0?null:o;var f=u.memoizedState.inst;Be!==null&&o!==null&&Hu(o,Be.memoizedState.deps)?u.memoizedState=tr(n,f,a,o):(de.flags|=e,u.memoizedState=tr(1|n,f,a,o))}function dm(e,n){Rl(8390656,8,e,n)}function Ku(e,n){Cl(2048,8,e,n)}function Lx(e){de.flags|=4;var n=de.updateQueue;if(n===null)n=bl(),de.updateQueue=n,n.events=[e];else{var a=n.events;a===null?n.events=[e]:a.push(e)}}function pm(e){var n=sn().memoizedState;return Lx({ref:n,nextImpl:e}),function(){if((Ne&2)!==0)throw Error(s(440));return n.impl.apply(void 0,arguments)}}function mm(e,n){return Cl(4,2,e,n)}function gm(e,n){return Cl(4,4,e,n)}function _m(e,n){if(typeof n=="function"){e=e();var a=n(e);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return e=e(),n.current=e,function(){n.current=null}}function vm(e,n,a){a=a!=null?a.concat([e]):null,Cl(4,4,_m.bind(null,n,e),a)}function Qu(){}function xm(e,n){var a=sn();n=n===void 0?null:n;var o=a.memoizedState;return n!==null&&Hu(n,o[1])?o[0]:(a.memoizedState=[e,n],e)}function Sm(e,n){var a=sn();n=n===void 0?null:n;var o=a.memoizedState;if(n!==null&&Hu(n,o[1]))return o[0];if(o=e(),us){ne(!0);try{e()}finally{ne(!1)}}return a.memoizedState=[o,n],o}function Ju(e,n,a){return a===void 0||(ji&1073741824)!==0&&(be&261930)===0?e.memoizedState=n:(e.memoizedState=a,e=yg(),de.lanes|=e,Ta|=e,a)}function ym(e,n,a,o){return Zn(a,n)?a:Qs.current!==null?(e=Ju(e,a,o),Zn(e,n)||(cn=!0),e):(ji&42)===0||(ji&1073741824)!==0&&(be&261930)===0?(cn=!0,e.memoizedState=a):(e=yg(),de.lanes|=e,Ta|=e,n)}function Mm(e,n,a,o,u){var f=Y.p;Y.p=f!==0&&8>f?f:8;var x=I.T,A={};I.T=A,ef(e,!1,n,a);try{var G=u(),it=I.S;if(it!==null&&it(A,G),G!==null&&typeof G=="object"&&typeof G.then=="function"){var mt=Cx(G,o);ho(e,n,mt,ei(e))}else ho(e,n,o,ei(e))}catch(St){ho(e,n,{then:function(){},status:"rejected",reason:St},ei())}finally{Y.p=f,x!==null&&A.types!==null&&(x.types=A.types),I.T=x}}function Ox(){}function $u(e,n,a,o){if(e.tag!==5)throw Error(s(476));var u=Em(e).queue;Mm(e,u,n,q,a===null?Ox:function(){return bm(e),a(o)})}function Em(e){var n=e.memoizedState;if(n!==null)return n;n={memoizedState:q,baseState:q,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Wi,lastRenderedState:q},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Wi,lastRenderedState:a},next:null},e.memoizedState=n,e=e.alternate,e!==null&&(e.memoizedState=n),n}function bm(e){var n=Em(e);n.next===null&&(n=e.alternate.memoizedState),ho(e,n.next.queue,{},ei())}function tf(){return An(Do)}function Tm(){return sn().memoizedState}function Am(){return sn().memoizedState}function Px(e){for(var n=e.return;n!==null;){switch(n.tag){case 24:case 3:var a=ei();e=xa(a);var o=Sa(n,e,a);o!==null&&(kn(o,n,a),oo(o,n,a)),n={cache:wu()},e.payload=n;return}n=n.return}}function zx(e,n,a){var o=ei();a={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},wl(e)?Cm(n,a):(a=vu(e,n,a,o),a!==null&&(kn(a,e,o),wm(a,n,o)))}function Rm(e,n,a){var o=ei();ho(e,n,a,o)}function ho(e,n,a,o){var u={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(wl(e))Cm(n,u);else{var f=e.alternate;if(e.lanes===0&&(f===null||f.lanes===0)&&(f=n.lastRenderedReducer,f!==null))try{var x=n.lastRenderedState,A=f(x,a);if(u.hasEagerState=!0,u.eagerState=A,Zn(A,x))return cl(e,n,u,0),je===null&&ll(),!1}catch{}finally{}if(a=vu(e,n,u,o),a!==null)return kn(a,e,o),wm(a,n,o),!0}return!1}function ef(e,n,a,o){if(o={lane:2,revertLane:Of(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},wl(e)){if(n)throw Error(s(479))}else n=vu(e,a,o,2),n!==null&&kn(n,e,2)}function wl(e){var n=e.alternate;return e===de||n!==null&&n===de}function Cm(e,n){Js=Ml=!0;var a=e.pending;a===null?n.next=n:(n.next=a.next,a.next=n),e.pending=n}function wm(e,n,a){if((a&4194048)!==0){var o=n.lanes;o&=e.pendingLanes,a|=o,n.lanes=a,Ai(e,a)}}var po={readContext:An,use:Tl,useCallback:$e,useContext:$e,useEffect:$e,useImperativeHandle:$e,useLayoutEffect:$e,useInsertionEffect:$e,useMemo:$e,useReducer:$e,useRef:$e,useState:$e,useDebugValue:$e,useDeferredValue:$e,useTransition:$e,useSyncExternalStore:$e,useId:$e,useHostTransitionStatus:$e,useFormState:$e,useActionState:$e,useOptimistic:$e,useMemoCache:$e,useCacheRefresh:$e};po.useEffectEvent=$e;var Dm={readContext:An,use:Tl,useCallback:function(e,n){return zn().memoizedState=[e,n===void 0?null:n],e},useContext:An,useEffect:dm,useImperativeHandle:function(e,n,a){a=a!=null?a.concat([e]):null,Rl(4194308,4,_m.bind(null,n,e),a)},useLayoutEffect:function(e,n){return Rl(4194308,4,e,n)},useInsertionEffect:function(e,n){Rl(4,2,e,n)},useMemo:function(e,n){var a=zn();n=n===void 0?null:n;var o=e();if(us){ne(!0);try{e()}finally{ne(!1)}}return a.memoizedState=[o,n],o},useReducer:function(e,n,a){var o=zn();if(a!==void 0){var u=a(n);if(us){ne(!0);try{a(n)}finally{ne(!1)}}}else u=n;return o.memoizedState=o.baseState=u,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:u},o.queue=e,e=e.dispatch=zx.bind(null,de,e),[o.memoizedState,e]},useRef:function(e){var n=zn();return e={current:e},n.memoizedState=e},useState:function(e){e=Yu(e);var n=e.queue,a=Rm.bind(null,de,n);return n.dispatch=a,[e.memoizedState,a]},useDebugValue:Qu,useDeferredValue:function(e,n){var a=zn();return Ju(a,e,n)},useTransition:function(){var e=Yu(!1);return e=Mm.bind(null,de,e.queue,!0,!1),zn().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,n,a){var o=de,u=zn();if(Ae){if(a===void 0)throw Error(s(407));a=a()}else{if(a=n(),je===null)throw Error(s(349));(be&127)!==0||Qp(o,n,a)}u.memoizedState=a;var f={value:a,getSnapshot:n};return u.queue=f,dm($p.bind(null,o,f,e),[e]),o.flags|=2048,tr(9,{destroy:void 0},Jp.bind(null,o,f,a,n),null),a},useId:function(){var e=zn(),n=je.identifierPrefix;if(Ae){var a=wi,o=Ci;a=(o&~(1<<32-Ht(o)-1)).toString(32)+a,n="_"+n+"R_"+a,a=El++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=wx++,n="_"+n+"r_"+a.toString(32)+"_";return e.memoizedState=n},useHostTransitionStatus:tf,useFormState:lm,useActionState:lm,useOptimistic:function(e){var n=zn();n.memoizedState=n.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=ef.bind(null,de,!0,a),a.dispatch=n,[e,n]},useMemoCache:ju,useCacheRefresh:function(){return zn().memoizedState=Px.bind(null,de)},useEffectEvent:function(e){var n=zn(),a={impl:e};return n.memoizedState=a,function(){if((Ne&2)!==0)throw Error(s(440));return a.impl.apply(void 0,arguments)}}},nf={readContext:An,use:Tl,useCallback:xm,useContext:An,useEffect:Ku,useImperativeHandle:vm,useInsertionEffect:mm,useLayoutEffect:gm,useMemo:Sm,useReducer:Al,useRef:hm,useState:function(){return Al(Wi)},useDebugValue:Qu,useDeferredValue:function(e,n){var a=sn();return ym(a,Be.memoizedState,e,n)},useTransition:function(){var e=Al(Wi)[0],n=sn().memoizedState;return[typeof e=="boolean"?e:fo(e),n]},useSyncExternalStore:Kp,useId:Tm,useHostTransitionStatus:tf,useFormState:cm,useActionState:cm,useOptimistic:function(e,n){var a=sn();return nm(a,Be,e,n)},useMemoCache:ju,useCacheRefresh:Am};nf.useEffectEvent=pm;var Um={readContext:An,use:Tl,useCallback:xm,useContext:An,useEffect:Ku,useImperativeHandle:vm,useInsertionEffect:mm,useLayoutEffect:gm,useMemo:Sm,useReducer:qu,useRef:hm,useState:function(){return qu(Wi)},useDebugValue:Qu,useDeferredValue:function(e,n){var a=sn();return Be===null?Ju(a,e,n):ym(a,Be.memoizedState,e,n)},useTransition:function(){var e=qu(Wi)[0],n=sn().memoizedState;return[typeof e=="boolean"?e:fo(e),n]},useSyncExternalStore:Kp,useId:Tm,useHostTransitionStatus:tf,useFormState:fm,useActionState:fm,useOptimistic:function(e,n){var a=sn();return Be!==null?nm(a,Be,e,n):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:ju,useCacheRefresh:Am};Um.useEffectEvent=pm;function af(e,n,a,o){n=e.memoizedState,a=a(o,n),a=a==null?n:v({},n,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var sf={enqueueSetState:function(e,n,a){e=e._reactInternals;var o=ei(),u=xa(o);u.payload=n,a!=null&&(u.callback=a),n=Sa(e,u,o),n!==null&&(kn(n,e,o),oo(n,e,o))},enqueueReplaceState:function(e,n,a){e=e._reactInternals;var o=ei(),u=xa(o);u.tag=1,u.payload=n,a!=null&&(u.callback=a),n=Sa(e,u,o),n!==null&&(kn(n,e,o),oo(n,e,o))},enqueueForceUpdate:function(e,n){e=e._reactInternals;var a=ei(),o=xa(a);o.tag=2,n!=null&&(o.callback=n),n=Sa(e,o,a),n!==null&&(kn(n,e,a),oo(n,e,a))}};function Nm(e,n,a,o,u,f,x){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,f,x):n.prototype&&n.prototype.isPureReactComponent?!$r(a,o)||!$r(u,f):!0}function Lm(e,n,a,o){e=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,o),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,o),n.state!==e&&sf.enqueueReplaceState(n,n.state,null)}function fs(e,n){var a=n;if("ref"in n){a={};for(var o in n)o!=="ref"&&(a[o]=n[o])}if(e=e.defaultProps){a===n&&(a=v({},a));for(var u in e)a[u]===void 0&&(a[u]=e[u])}return a}function Om(e){ol(e)}function Pm(e){console.error(e)}function zm(e){ol(e)}function Dl(e,n){try{var a=e.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(o){setTimeout(function(){throw o})}}function Im(e,n,a){try{var o=e.onCaughtError;o(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(u){setTimeout(function(){throw u})}}function rf(e,n,a){return a=xa(a),a.tag=3,a.payload={element:null},a.callback=function(){Dl(e,n)},a}function Bm(e){return e=xa(e),e.tag=3,e}function Fm(e,n,a,o){var u=a.type.getDerivedStateFromError;if(typeof u=="function"){var f=o.value;e.payload=function(){return u(f)},e.callback=function(){Im(n,a,o)}}var x=a.stateNode;x!==null&&typeof x.componentDidCatch=="function"&&(e.callback=function(){Im(n,a,o),typeof u!="function"&&(Aa===null?Aa=new Set([this]):Aa.add(this));var A=o.stack;this.componentDidCatch(o.value,{componentStack:A!==null?A:""})})}function Ix(e,n,a,o,u){if(a.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(n=a.alternate,n!==null&&Ws(n,a,u,!0),a=Qn.current,a!==null){switch(a.tag){case 31:case 13:return fi===null?Vl():a.alternate===null&&tn===0&&(tn=3),a.flags&=-257,a.flags|=65536,a.lanes=u,o===_l?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([o]):n.add(o),Uf(e,o,u)),!1;case 22:return a.flags|=65536,o===_l?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([o])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([o]):a.add(o)),Uf(e,o,u)),!1}throw Error(s(435,a.tag))}return Uf(e,o,u),Vl(),!1}if(Ae)return n=Qn.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=u,o!==bu&&(e=Error(s(422),{cause:o}),no(oi(e,a)))):(o!==bu&&(n=Error(s(423),{cause:o}),no(oi(n,a))),e=e.current.alternate,e.flags|=65536,u&=-u,e.lanes|=u,o=oi(o,a),u=rf(e.stateNode,o,u),Pu(e,u),tn!==4&&(tn=2)),!1;var f=Error(s(520),{cause:o});if(f=oi(f,a),Mo===null?Mo=[f]:Mo.push(f),tn!==4&&(tn=2),n===null)return!0;o=oi(o,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,e=u&-u,a.lanes|=e,e=rf(a.stateNode,o,e),Pu(a,e),!1;case 1:if(n=a.type,f=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(Aa===null||!Aa.has(f))))return a.flags|=65536,u&=-u,a.lanes|=u,u=Bm(u),Fm(u,e,a,o),Pu(a,u),!1}a=a.return}while(a!==null);return!1}var of=Error(s(461)),cn=!1;function Rn(e,n,a,o){n.child=e===null?kp(n,null,a,o):cs(n,e.child,a,o)}function Hm(e,n,a,o,u){a=a.render;var f=n.ref;if("ref"in o){var x={};for(var A in o)A!=="ref"&&(x[A]=o[A])}else x=o;return ss(n),o=Gu(e,n,a,x,f,u),A=Vu(),e!==null&&!cn?(ku(e,n,u),qi(e,n,u)):(Ae&&A&&Mu(n),n.flags|=1,Rn(e,n,o,u),n.child)}function Gm(e,n,a,o,u){if(e===null){var f=a.type;return typeof f=="function"&&!xu(f)&&f.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=f,Vm(e,n,f,o,u)):(e=fl(a.type,null,o,n,n.mode,u),e.ref=n.ref,e.return=n,n.child=e)}if(f=e.child,!mf(e,u)){var x=f.memoizedProps;if(a=a.compare,a=a!==null?a:$r,a(x,o)&&e.ref===n.ref)return qi(e,n,u)}return n.flags|=1,e=Gi(f,o),e.ref=n.ref,e.return=n,n.child=e}function Vm(e,n,a,o,u){if(e!==null){var f=e.memoizedProps;if($r(f,o)&&e.ref===n.ref)if(cn=!1,n.pendingProps=o=f,mf(e,u))(e.flags&131072)!==0&&(cn=!0);else return n.lanes=e.lanes,qi(e,n,u)}return lf(e,n,a,o,u)}function km(e,n,a,o){var u=o.children,f=e!==null?e.memoizedState:null;if(e===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((n.flags&128)!==0){if(f=f!==null?f.baseLanes|a:a,e!==null){for(o=n.child=e.child,u=0;o!==null;)u=u|o.lanes|o.childLanes,o=o.sibling;o=u&~f}else o=0,n.child=null;return Xm(e,n,f,a,o)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},e!==null&&ml(n,f!==null?f.cachePool:null),f!==null?Wp(n,f):Iu(),qp(n);else return o=n.lanes=536870912,Xm(e,n,f!==null?f.baseLanes|a:a,a,o)}else f!==null?(ml(n,f.cachePool),Wp(n,f),Ma(),n.memoizedState=null):(e!==null&&ml(n,null),Iu(),Ma());return Rn(e,n,u,a),n.child}function mo(e,n){return e!==null&&e.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function Xm(e,n,a,o,u){var f=Uu();return f=f===null?null:{parent:on._currentValue,pool:f},n.memoizedState={baseLanes:a,cachePool:f},e!==null&&ml(n,null),Iu(),qp(n),e!==null&&Ws(e,n,o,!0),n.childLanes=u,null}function Ul(e,n){return n=Ll({mode:n.mode,children:n.children},e.mode),n.ref=e.ref,e.child=n,n.return=e,n}function jm(e,n,a){return cs(n,e.child,null,a),e=Ul(n,n.pendingProps),e.flags|=2,Jn(n),n.memoizedState=null,e}function Bx(e,n,a){var o=n.pendingProps,u=(n.flags&128)!==0;if(n.flags&=-129,e===null){if(Ae){if(o.mode==="hidden")return e=Ul(n,o),n.lanes=536870912,mo(null,e);if(Fu(n),(e=qe)?(e=i_(e,ui),e=e!==null&&e.data==="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:pa!==null?{id:Ci,overflow:wi}:null,retryLane:536870912,hydrationErrors:null},a=Cp(e),a.return=n,n.child=a,Tn=n,qe=null)):e=null,e===null)throw ga(n);return n.lanes=536870912,null}return Ul(n,o)}var f=e.memoizedState;if(f!==null){var x=f.dehydrated;if(Fu(n),u)if(n.flags&256)n.flags&=-257,n=jm(e,n,a);else if(n.memoizedState!==null)n.child=e.child,n.flags|=128,n=null;else throw Error(s(558));else if(cn||Ws(e,n,a,!1),u=(a&e.childLanes)!==0,cn||u){if(o=je,o!==null&&(x=Us(o,a),x!==0&&x!==f.retryLane))throw f.retryLane=x,es(e,x),kn(o,e,x),of;Vl(),n=jm(e,n,a)}else e=f.treeContext,qe=hi(x.nextSibling),Tn=n,Ae=!0,ma=null,ui=!1,e!==null&&Up(n,e),n=Ul(n,o),n.flags|=4096;return n}return e=Gi(e.child,{mode:o.mode,children:o.children}),e.ref=n.ref,n.child=e,e.return=n,e}function Nl(e,n){var a=n.ref;if(a===null)e!==null&&e.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(s(284));(e===null||e.ref!==a)&&(n.flags|=4194816)}}function lf(e,n,a,o,u){return ss(n),a=Gu(e,n,a,o,void 0,u),o=Vu(),e!==null&&!cn?(ku(e,n,u),qi(e,n,u)):(Ae&&o&&Mu(n),n.flags|=1,Rn(e,n,a,u),n.child)}function Wm(e,n,a,o,u,f){return ss(n),n.updateQueue=null,a=Zp(n,o,a,u),Yp(e),o=Vu(),e!==null&&!cn?(ku(e,n,f),qi(e,n,f)):(Ae&&o&&Mu(n),n.flags|=1,Rn(e,n,a,f),n.child)}function qm(e,n,a,o,u){if(ss(n),n.stateNode===null){var f=Vs,x=a.contextType;typeof x=="object"&&x!==null&&(f=An(x)),f=new a(o,f),n.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,f.updater=sf,n.stateNode=f,f._reactInternals=n,f=n.stateNode,f.props=o,f.state=n.memoizedState,f.refs={},Lu(n),x=a.contextType,f.context=typeof x=="object"&&x!==null?An(x):Vs,f.state=n.memoizedState,x=a.getDerivedStateFromProps,typeof x=="function"&&(af(n,a,x,o),f.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(x=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),x!==f.state&&sf.enqueueReplaceState(f,f.state,null),co(n,o,f,u),lo(),f.state=n.memoizedState),typeof f.componentDidMount=="function"&&(n.flags|=4194308),o=!0}else if(e===null){f=n.stateNode;var A=n.memoizedProps,G=fs(a,A);f.props=G;var it=f.context,mt=a.contextType;x=Vs,typeof mt=="object"&&mt!==null&&(x=An(mt));var St=a.getDerivedStateFromProps;mt=typeof St=="function"||typeof f.getSnapshotBeforeUpdate=="function",A=n.pendingProps!==A,mt||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(A||it!==x)&&Lm(n,f,o,x),va=!1;var ot=n.memoizedState;f.state=ot,co(n,o,f,u),lo(),it=n.memoizedState,A||ot!==it||va?(typeof St=="function"&&(af(n,a,St,o),it=n.memoizedState),(G=va||Nm(n,a,G,o,ot,it,x))?(mt||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(n.flags|=4194308)):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=o,n.memoizedState=it),f.props=o,f.state=it,f.context=x,o=G):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),o=!1)}else{f=n.stateNode,Ou(e,n),x=n.memoizedProps,mt=fs(a,x),f.props=mt,St=n.pendingProps,ot=f.context,it=a.contextType,G=Vs,typeof it=="object"&&it!==null&&(G=An(it)),A=a.getDerivedStateFromProps,(it=typeof A=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(x!==St||ot!==G)&&Lm(n,f,o,G),va=!1,ot=n.memoizedState,f.state=ot,co(n,o,f,u),lo();var ht=n.memoizedState;x!==St||ot!==ht||va||e!==null&&e.dependencies!==null&&dl(e.dependencies)?(typeof A=="function"&&(af(n,a,A,o),ht=n.memoizedState),(mt=va||Nm(n,a,mt,o,ot,ht,G)||e!==null&&e.dependencies!==null&&dl(e.dependencies))?(it||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(o,ht,G),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(o,ht,G)),typeof f.componentDidUpdate=="function"&&(n.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof f.componentDidUpdate!="function"||x===e.memoizedProps&&ot===e.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||x===e.memoizedProps&&ot===e.memoizedState||(n.flags|=1024),n.memoizedProps=o,n.memoizedState=ht),f.props=o,f.state=ht,f.context=G,o=mt):(typeof f.componentDidUpdate!="function"||x===e.memoizedProps&&ot===e.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||x===e.memoizedProps&&ot===e.memoizedState||(n.flags|=1024),o=!1)}return f=o,Nl(e,n),o=(n.flags&128)!==0,f||o?(f=n.stateNode,a=o&&typeof a.getDerivedStateFromError!="function"?null:f.render(),n.flags|=1,e!==null&&o?(n.child=cs(n,e.child,null,u),n.child=cs(n,null,a,u)):Rn(e,n,a,u),n.memoizedState=f.state,e=n.child):e=qi(e,n,u),e}function Ym(e,n,a,o){return is(),n.flags|=256,Rn(e,n,a,o),n.child}var cf={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function uf(e){return{baseLanes:e,cachePool:Ip()}}function ff(e,n,a){return e=e!==null?e.childLanes&~a:0,n&&(e|=ti),e}function Zm(e,n,a){var o=n.pendingProps,u=!1,f=(n.flags&128)!==0,x;if((x=f)||(x=e!==null&&e.memoizedState===null?!1:(an.current&2)!==0),x&&(u=!0,n.flags&=-129),x=(n.flags&32)!==0,n.flags&=-33,e===null){if(Ae){if(u?ya(n):Ma(),(e=qe)?(e=i_(e,ui),e=e!==null&&e.data!=="&"?e:null,e!==null&&(n.memoizedState={dehydrated:e,treeContext:pa!==null?{id:Ci,overflow:wi}:null,retryLane:536870912,hydrationErrors:null},a=Cp(e),a.return=n,n.child=a,Tn=n,qe=null)):e=null,e===null)throw ga(n);return qf(e)?n.lanes=32:n.lanes=536870912,null}var A=o.children;return o=o.fallback,u?(Ma(),u=n.mode,A=Ll({mode:"hidden",children:A},u),o=ns(o,u,a,null),A.return=n,o.return=n,A.sibling=o,n.child=A,o=n.child,o.memoizedState=uf(a),o.childLanes=ff(e,x,a),n.memoizedState=cf,mo(null,o)):(ya(n),hf(n,A))}var G=e.memoizedState;if(G!==null&&(A=G.dehydrated,A!==null)){if(f)n.flags&256?(ya(n),n.flags&=-257,n=df(e,n,a)):n.memoizedState!==null?(Ma(),n.child=e.child,n.flags|=128,n=null):(Ma(),A=o.fallback,u=n.mode,o=Ll({mode:"visible",children:o.children},u),A=ns(A,u,a,null),A.flags|=2,o.return=n,A.return=n,o.sibling=A,n.child=o,cs(n,e.child,null,a),o=n.child,o.memoizedState=uf(a),o.childLanes=ff(e,x,a),n.memoizedState=cf,n=mo(null,o));else if(ya(n),qf(A)){if(x=A.nextSibling&&A.nextSibling.dataset,x)var it=x.dgst;x=it,o=Error(s(419)),o.stack="",o.digest=x,no({value:o,source:null,stack:null}),n=df(e,n,a)}else if(cn||Ws(e,n,a,!1),x=(a&e.childLanes)!==0,cn||x){if(x=je,x!==null&&(o=Us(x,a),o!==0&&o!==G.retryLane))throw G.retryLane=o,es(e,o),kn(x,e,o),of;Wf(A)||Vl(),n=df(e,n,a)}else Wf(A)?(n.flags|=192,n.child=e.child,n=null):(e=G.treeContext,qe=hi(A.nextSibling),Tn=n,Ae=!0,ma=null,ui=!1,e!==null&&Up(n,e),n=hf(n,o.children),n.flags|=4096);return n}return u?(Ma(),A=o.fallback,u=n.mode,G=e.child,it=G.sibling,o=Gi(G,{mode:"hidden",children:o.children}),o.subtreeFlags=G.subtreeFlags&65011712,it!==null?A=Gi(it,A):(A=ns(A,u,a,null),A.flags|=2),A.return=n,o.return=n,o.sibling=A,n.child=o,mo(null,o),o=n.child,A=e.child.memoizedState,A===null?A=uf(a):(u=A.cachePool,u!==null?(G=on._currentValue,u=u.parent!==G?{parent:G,pool:G}:u):u=Ip(),A={baseLanes:A.baseLanes|a,cachePool:u}),o.memoizedState=A,o.childLanes=ff(e,x,a),n.memoizedState=cf,mo(e.child,o)):(ya(n),a=e.child,e=a.sibling,a=Gi(a,{mode:"visible",children:o.children}),a.return=n,a.sibling=null,e!==null&&(x=n.deletions,x===null?(n.deletions=[e],n.flags|=16):x.push(e)),n.child=a,n.memoizedState=null,a)}function hf(e,n){return n=Ll({mode:"visible",children:n},e.mode),n.return=e,e.child=n}function Ll(e,n){return e=Kn(22,e,null,n),e.lanes=0,e}function df(e,n,a){return cs(n,e.child,null,a),e=hf(n,n.pendingProps.children),e.flags|=2,n.memoizedState=null,e}function Km(e,n,a){e.lanes|=n;var o=e.alternate;o!==null&&(o.lanes|=n),Ru(e.return,n,a)}function pf(e,n,a,o,u,f){var x=e.memoizedState;x===null?e.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:o,tail:a,tailMode:u,treeForkCount:f}:(x.isBackwards=n,x.rendering=null,x.renderingStartTime=0,x.last=o,x.tail=a,x.tailMode=u,x.treeForkCount=f)}function Qm(e,n,a){var o=n.pendingProps,u=o.revealOrder,f=o.tail;o=o.children;var x=an.current,A=(x&2)!==0;if(A?(x=x&1|2,n.flags|=128):x&=1,vt(an,x),Rn(e,n,o,a),o=Ae?eo:0,!A&&e!==null&&(e.flags&128)!==0)t:for(e=n.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Km(e,a,n);else if(e.tag===19)Km(e,a,n);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break t;for(;e.sibling===null;){if(e.return===null||e.return===n)break t;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(u){case"forwards":for(a=n.child,u=null;a!==null;)e=a.alternate,e!==null&&yl(e)===null&&(u=a),a=a.sibling;a=u,a===null?(u=n.child,n.child=null):(u=a.sibling,a.sibling=null),pf(n,!1,u,a,f,o);break;case"backwards":case"unstable_legacy-backwards":for(a=null,u=n.child,n.child=null;u!==null;){if(e=u.alternate,e!==null&&yl(e)===null){n.child=u;break}e=u.sibling,u.sibling=a,a=u,u=e}pf(n,!0,a,null,f,o);break;case"together":pf(n,!1,null,null,void 0,o);break;default:n.memoizedState=null}return n.child}function qi(e,n,a){if(e!==null&&(n.dependencies=e.dependencies),Ta|=n.lanes,(a&n.childLanes)===0)if(e!==null){if(Ws(e,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(e!==null&&n.child!==e.child)throw Error(s(153));if(n.child!==null){for(e=n.child,a=Gi(e,e.pendingProps),n.child=a,a.return=n;e.sibling!==null;)e=e.sibling,a=a.sibling=Gi(e,e.pendingProps),a.return=n;a.sibling=null}return n.child}function mf(e,n){return(e.lanes&n)!==0?!0:(e=e.dependencies,!!(e!==null&&dl(e)))}function Fx(e,n,a){switch(n.tag){case 3:Et(n,n.stateNode.containerInfo),_a(n,on,e.memoizedState.cache),is();break;case 27:case 5:Gt(n);break;case 4:Et(n,n.stateNode.containerInfo);break;case 10:_a(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,Fu(n),null;break;case 13:var o=n.memoizedState;if(o!==null)return o.dehydrated!==null?(ya(n),n.flags|=128,null):(a&n.child.childLanes)!==0?Zm(e,n,a):(ya(n),e=qi(e,n,a),e!==null?e.sibling:null);ya(n);break;case 19:var u=(e.flags&128)!==0;if(o=(a&n.childLanes)!==0,o||(Ws(e,n,a,!1),o=(a&n.childLanes)!==0),u){if(o)return Qm(e,n,a);n.flags|=128}if(u=n.memoizedState,u!==null&&(u.rendering=null,u.tail=null,u.lastEffect=null),vt(an,an.current),o)break;return null;case 22:return n.lanes=0,km(e,n,a,n.pendingProps);case 24:_a(n,on,e.memoizedState.cache)}return qi(e,n,a)}function Jm(e,n,a){if(e!==null)if(e.memoizedProps!==n.pendingProps)cn=!0;else{if(!mf(e,a)&&(n.flags&128)===0)return cn=!1,Fx(e,n,a);cn=(e.flags&131072)!==0}else cn=!1,Ae&&(n.flags&1048576)!==0&&Dp(n,eo,n.index);switch(n.lanes=0,n.tag){case 16:t:{var o=n.pendingProps;if(e=os(n.elementType),n.type=e,typeof e=="function")xu(e)?(o=fs(e,o),n.tag=1,n=qm(null,n,e,o,a)):(n.tag=0,n=lf(null,n,e,o,a));else{if(e!=null){var u=e.$$typeof;if(u===w){n.tag=11,n=Hm(null,n,e,o,a);break t}else if(u===L){n.tag=14,n=Gm(null,n,e,o,a);break t}}throw n=dt(e)||e,Error(s(306,n,""))}}return n;case 0:return lf(e,n,n.type,n.pendingProps,a);case 1:return o=n.type,u=fs(o,n.pendingProps),qm(e,n,o,u,a);case 3:t:{if(Et(n,n.stateNode.containerInfo),e===null)throw Error(s(387));o=n.pendingProps;var f=n.memoizedState;u=f.element,Ou(e,n),co(n,o,null,a);var x=n.memoizedState;if(o=x.cache,_a(n,on,o),o!==f.cache&&Cu(n,[on],a,!0),lo(),o=x.element,f.isDehydrated)if(f={element:o,isDehydrated:!1,cache:x.cache},n.updateQueue.baseState=f,n.memoizedState=f,n.flags&256){n=Ym(e,n,o,a);break t}else if(o!==u){u=oi(Error(s(424)),n),no(u),n=Ym(e,n,o,a);break t}else{switch(e=n.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(qe=hi(e.firstChild),Tn=n,Ae=!0,ma=null,ui=!0,a=kp(n,null,o,a),n.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling}else{if(is(),o===u){n=qi(e,n,a);break t}Rn(e,n,o,a)}n=n.child}return n;case 26:return Nl(e,n),e===null?(a=c_(n.type,null,n.pendingProps,null))?n.memoizedState=a:Ae||(a=n.type,e=n.pendingProps,o=Zl(xt.current).createElement(a),o[rn]=n,o[En]=e,Cn(o,a,e),bt(o),n.stateNode=o):n.memoizedState=c_(n.type,e.memoizedProps,n.pendingProps,e.memoizedState),null;case 27:return Gt(n),e===null&&Ae&&(o=n.stateNode=r_(n.type,n.pendingProps,xt.current),Tn=n,ui=!0,u=qe,Da(n.type)?(Yf=u,qe=hi(o.firstChild)):qe=u),Rn(e,n,n.pendingProps.children,a),Nl(e,n),e===null&&(n.flags|=4194304),n.child;case 5:return e===null&&Ae&&((u=o=qe)&&(o=mS(o,n.type,n.pendingProps,ui),o!==null?(n.stateNode=o,Tn=n,qe=hi(o.firstChild),ui=!1,u=!0):u=!1),u||ga(n)),Gt(n),u=n.type,f=n.pendingProps,x=e!==null?e.memoizedProps:null,o=f.children,kf(u,f)?o=null:x!==null&&kf(u,x)&&(n.flags|=32),n.memoizedState!==null&&(u=Gu(e,n,Dx,null,null,a),Do._currentValue=u),Nl(e,n),Rn(e,n,o,a),n.child;case 6:return e===null&&Ae&&((e=a=qe)&&(a=gS(a,n.pendingProps,ui),a!==null?(n.stateNode=a,Tn=n,qe=null,e=!0):e=!1),e||ga(n)),null;case 13:return Zm(e,n,a);case 4:return Et(n,n.stateNode.containerInfo),o=n.pendingProps,e===null?n.child=cs(n,null,o,a):Rn(e,n,o,a),n.child;case 11:return Hm(e,n,n.type,n.pendingProps,a);case 7:return Rn(e,n,n.pendingProps,a),n.child;case 8:return Rn(e,n,n.pendingProps.children,a),n.child;case 12:return Rn(e,n,n.pendingProps.children,a),n.child;case 10:return o=n.pendingProps,_a(n,n.type,o.value),Rn(e,n,o.children,a),n.child;case 9:return u=n.type._context,o=n.pendingProps.children,ss(n),u=An(u),o=o(u),n.flags|=1,Rn(e,n,o,a),n.child;case 14:return Gm(e,n,n.type,n.pendingProps,a);case 15:return Vm(e,n,n.type,n.pendingProps,a);case 19:return Qm(e,n,a);case 31:return Bx(e,n,a);case 22:return km(e,n,a,n.pendingProps);case 24:return ss(n),o=An(on),e===null?(u=Uu(),u===null&&(u=je,f=wu(),u.pooledCache=f,f.refCount++,f!==null&&(u.pooledCacheLanes|=a),u=f),n.memoizedState={parent:o,cache:u},Lu(n),_a(n,on,u)):((e.lanes&a)!==0&&(Ou(e,n),co(n,null,null,a),lo()),u=e.memoizedState,f=n.memoizedState,u.parent!==o?(u={parent:o,cache:o},n.memoizedState=u,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=u),_a(n,on,o)):(o=f.cache,_a(n,on,o),o!==u.cache&&Cu(n,[on],a,!0))),Rn(e,n,n.pendingProps.children,a),n.child;case 29:throw n.pendingProps}throw Error(s(156,n.tag))}function Yi(e){e.flags|=4}function gf(e,n,a,o,u){if((n=(e.mode&32)!==0)&&(n=!1),n){if(e.flags|=16777216,(u&335544128)===u)if(e.stateNode.complete)e.flags|=8192;else if(Tg())e.flags|=8192;else throw ls=_l,Nu}else e.flags&=-16777217}function $m(e,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!p_(n))if(Tg())e.flags|=8192;else throw ls=_l,Nu}function Ol(e,n){n!==null&&(e.flags|=4),e.flags&16384&&(n=e.tag!==22?Pe():536870912,e.lanes|=n,ar|=n)}function go(e,n){if(!Ae)switch(e.tailMode){case"hidden":n=e.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?e.tail=null:a.sibling=null;break;case"collapsed":a=e.tail;for(var o=null;a!==null;)a.alternate!==null&&(o=a),a=a.sibling;o===null?n||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function Ye(e){var n=e.alternate!==null&&e.alternate.child===e.child,a=0,o=0;if(n)for(var u=e.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags&65011712,o|=u.flags&65011712,u.return=e,u=u.sibling;else for(u=e.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags,o|=u.flags,u.return=e,u=u.sibling;return e.subtreeFlags|=o,e.childLanes=a,n}function Hx(e,n,a){var o=n.pendingProps;switch(Eu(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ye(n),null;case 1:return Ye(n),null;case 3:return a=n.stateNode,o=null,e!==null&&(o=e.memoizedState.cache),n.memoizedState.cache!==o&&(n.flags|=2048),Xi(on),Dt(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(js(n)?Yi(n):e===null||e.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,Tu())),Ye(n),null;case 26:var u=n.type,f=n.memoizedState;return e===null?(Yi(n),f!==null?(Ye(n),$m(n,f)):(Ye(n),gf(n,u,null,o,a))):f?f!==e.memoizedState?(Yi(n),Ye(n),$m(n,f)):(Ye(n),n.flags&=-16777217):(e=e.memoizedProps,e!==o&&Yi(n),Ye(n),gf(n,u,e,o,a)),null;case 27:if(Rt(n),a=xt.current,u=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==o&&Yi(n);else{if(!o){if(n.stateNode===null)throw Error(s(166));return Ye(n),null}e=Mt.current,js(n)?Np(n):(e=r_(u,o,a),n.stateNode=e,Yi(n))}return Ye(n),null;case 5:if(Rt(n),u=n.type,e!==null&&n.stateNode!=null)e.memoizedProps!==o&&Yi(n);else{if(!o){if(n.stateNode===null)throw Error(s(166));return Ye(n),null}if(f=Mt.current,js(n))Np(n);else{var x=Zl(xt.current);switch(f){case 1:f=x.createElementNS("http://www.w3.org/2000/svg",u);break;case 2:f=x.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;default:switch(u){case"svg":f=x.createElementNS("http://www.w3.org/2000/svg",u);break;case"math":f=x.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;case"script":f=x.createElement("div"),f.innerHTML="<script><\/script>",f=f.removeChild(f.firstChild);break;case"select":f=typeof o.is=="string"?x.createElement("select",{is:o.is}):x.createElement("select"),o.multiple?f.multiple=!0:o.size&&(f.size=o.size);break;default:f=typeof o.is=="string"?x.createElement(u,{is:o.is}):x.createElement(u)}}f[rn]=n,f[En]=o;t:for(x=n.child;x!==null;){if(x.tag===5||x.tag===6)f.appendChild(x.stateNode);else if(x.tag!==4&&x.tag!==27&&x.child!==null){x.child.return=x,x=x.child;continue}if(x===n)break t;for(;x.sibling===null;){if(x.return===null||x.return===n)break t;x=x.return}x.sibling.return=x.return,x=x.sibling}n.stateNode=f;t:switch(Cn(f,u,o),u){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break t;case"img":o=!0;break t;default:o=!1}o&&Yi(n)}}return Ye(n),gf(n,n.type,e===null?null:e.memoizedProps,n.pendingProps,a),null;case 6:if(e&&n.stateNode!=null)e.memoizedProps!==o&&Yi(n);else{if(typeof o!="string"&&n.stateNode===null)throw Error(s(166));if(e=xt.current,js(n)){if(e=n.stateNode,a=n.memoizedProps,o=null,u=Tn,u!==null)switch(u.tag){case 27:case 5:o=u.memoizedProps}e[rn]=n,e=!!(e.nodeValue===a||o!==null&&o.suppressHydrationWarning===!0||Zg(e.nodeValue,a)),e||ga(n,!0)}else e=Zl(e).createTextNode(o),e[rn]=n,n.stateNode=e}return Ye(n),null;case 31:if(a=n.memoizedState,e===null||e.memoizedState!==null){if(o=js(n),a!==null){if(e===null){if(!o)throw Error(s(318));if(e=n.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(557));e[rn]=n}else is(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Ye(n),e=!1}else a=Tu(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return n.flags&256?(Jn(n),n):(Jn(n),null);if((n.flags&128)!==0)throw Error(s(558))}return Ye(n),null;case 13:if(o=n.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(u=js(n),o!==null&&o.dehydrated!==null){if(e===null){if(!u)throw Error(s(318));if(u=n.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(s(317));u[rn]=n}else is(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Ye(n),u=!1}else u=Tu(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=u),u=!0;if(!u)return n.flags&256?(Jn(n),n):(Jn(n),null)}return Jn(n),(n.flags&128)!==0?(n.lanes=a,n):(a=o!==null,e=e!==null&&e.memoizedState!==null,a&&(o=n.child,u=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(u=o.alternate.memoizedState.cachePool.pool),f=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(f=o.memoizedState.cachePool.pool),f!==u&&(o.flags|=2048)),a!==e&&a&&(n.child.flags|=8192),Ol(n,n.updateQueue),Ye(n),null);case 4:return Dt(),e===null&&Bf(n.stateNode.containerInfo),Ye(n),null;case 10:return Xi(n.type),Ye(n),null;case 19:if(W(an),o=n.memoizedState,o===null)return Ye(n),null;if(u=(n.flags&128)!==0,f=o.rendering,f===null)if(u)go(o,!1);else{if(tn!==0||e!==null&&(e.flags&128)!==0)for(e=n.child;e!==null;){if(f=yl(e),f!==null){for(n.flags|=128,go(o,!1),e=f.updateQueue,n.updateQueue=e,Ol(n,e),n.subtreeFlags=0,e=a,a=n.child;a!==null;)Rp(a,e),a=a.sibling;return vt(an,an.current&1|2),Ae&&Vi(n,o.treeForkCount),n.child}e=e.sibling}o.tail!==null&&T()>Fl&&(n.flags|=128,u=!0,go(o,!1),n.lanes=4194304)}else{if(!u)if(e=yl(f),e!==null){if(n.flags|=128,u=!0,e=e.updateQueue,n.updateQueue=e,Ol(n,e),go(o,!0),o.tail===null&&o.tailMode==="hidden"&&!f.alternate&&!Ae)return Ye(n),null}else 2*T()-o.renderingStartTime>Fl&&a!==536870912&&(n.flags|=128,u=!0,go(o,!1),n.lanes=4194304);o.isBackwards?(f.sibling=n.child,n.child=f):(e=o.last,e!==null?e.sibling=f:n.child=f,o.last=f)}return o.tail!==null?(e=o.tail,o.rendering=e,o.tail=e.sibling,o.renderingStartTime=T(),e.sibling=null,a=an.current,vt(an,u?a&1|2:a&1),Ae&&Vi(n,o.treeForkCount),e):(Ye(n),null);case 22:case 23:return Jn(n),Bu(),o=n.memoizedState!==null,e!==null?e.memoizedState!==null!==o&&(n.flags|=8192):o&&(n.flags|=8192),o?(a&536870912)!==0&&(n.flags&128)===0&&(Ye(n),n.subtreeFlags&6&&(n.flags|=8192)):Ye(n),a=n.updateQueue,a!==null&&Ol(n,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),o=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(o=n.memoizedState.cachePool.pool),o!==a&&(n.flags|=2048),e!==null&&W(rs),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),Xi(on),Ye(n),null;case 25:return null;case 30:return null}throw Error(s(156,n.tag))}function Gx(e,n){switch(Eu(n),n.tag){case 1:return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 3:return Xi(on),Dt(),e=n.flags,(e&65536)!==0&&(e&128)===0?(n.flags=e&-65537|128,n):null;case 26:case 27:case 5:return Rt(n),null;case 31:if(n.memoizedState!==null){if(Jn(n),n.alternate===null)throw Error(s(340));is()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 13:if(Jn(n),e=n.memoizedState,e!==null&&e.dehydrated!==null){if(n.alternate===null)throw Error(s(340));is()}return e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 19:return W(an),null;case 4:return Dt(),null;case 10:return Xi(n.type),null;case 22:case 23:return Jn(n),Bu(),e!==null&&W(rs),e=n.flags,e&65536?(n.flags=e&-65537|128,n):null;case 24:return Xi(on),null;case 25:return null;default:return null}}function tg(e,n){switch(Eu(n),n.tag){case 3:Xi(on),Dt();break;case 26:case 27:case 5:Rt(n);break;case 4:Dt();break;case 31:n.memoizedState!==null&&Jn(n);break;case 13:Jn(n);break;case 19:W(an);break;case 10:Xi(n.type);break;case 22:case 23:Jn(n),Bu(),e!==null&&W(rs);break;case 24:Xi(on)}}function _o(e,n){try{var a=n.updateQueue,o=a!==null?a.lastEffect:null;if(o!==null){var u=o.next;a=u;do{if((a.tag&e)===e){o=void 0;var f=a.create,x=a.inst;o=f(),x.destroy=o}a=a.next}while(a!==u)}}catch(A){Ie(n,n.return,A)}}function Ea(e,n,a){try{var o=n.updateQueue,u=o!==null?o.lastEffect:null;if(u!==null){var f=u.next;o=f;do{if((o.tag&e)===e){var x=o.inst,A=x.destroy;if(A!==void 0){x.destroy=void 0,u=n;var G=a,it=A;try{it()}catch(mt){Ie(u,G,mt)}}}o=o.next}while(o!==f)}}catch(mt){Ie(n,n.return,mt)}}function eg(e){var n=e.updateQueue;if(n!==null){var a=e.stateNode;try{jp(n,a)}catch(o){Ie(e,e.return,o)}}}function ng(e,n,a){a.props=fs(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(o){Ie(e,n,o)}}function vo(e,n){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var o=e.stateNode;break;case 30:o=e.stateNode;break;default:o=e.stateNode}typeof a=="function"?e.refCleanup=a(o):a.current=o}}catch(u){Ie(e,n,u)}}function Di(e,n){var a=e.ref,o=e.refCleanup;if(a!==null)if(typeof o=="function")try{o()}catch(u){Ie(e,n,u)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(u){Ie(e,n,u)}else a.current=null}function ig(e){var n=e.type,a=e.memoizedProps,o=e.stateNode;try{t:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&o.focus();break t;case"img":a.src?o.src=a.src:a.srcSet&&(o.srcset=a.srcSet)}}catch(u){Ie(e,e.return,u)}}function _f(e,n,a){try{var o=e.stateNode;cS(o,e.type,a,n),o[En]=n}catch(u){Ie(e,e.return,u)}}function ag(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Da(e.type)||e.tag===4}function vf(e){t:for(;;){for(;e.sibling===null;){if(e.return===null||ag(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Da(e.type)||e.flags&2||e.child===null||e.tag===4)continue t;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function xf(e,n,a){var o=e.tag;if(o===5||o===6)e=e.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(e,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(e),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=Fi));else if(o!==4&&(o===27&&Da(e.type)&&(a=e.stateNode,n=null),e=e.child,e!==null))for(xf(e,n,a),e=e.sibling;e!==null;)xf(e,n,a),e=e.sibling}function Pl(e,n,a){var o=e.tag;if(o===5||o===6)e=e.stateNode,n?a.insertBefore(e,n):a.appendChild(e);else if(o!==4&&(o===27&&Da(e.type)&&(a=e.stateNode),e=e.child,e!==null))for(Pl(e,n,a),e=e.sibling;e!==null;)Pl(e,n,a),e=e.sibling}function sg(e){var n=e.stateNode,a=e.memoizedProps;try{for(var o=e.type,u=n.attributes;u.length;)n.removeAttributeNode(u[0]);Cn(n,o,a),n[rn]=e,n[En]=a}catch(f){Ie(e,e.return,f)}}var Zi=!1,un=!1,Sf=!1,rg=typeof WeakSet=="function"?WeakSet:Set,Sn=null;function Vx(e,n){if(e=e.containerInfo,Gf=nc,e=vp(e),hu(e)){if("selectionStart"in e)var a={start:e.selectionStart,end:e.selectionEnd};else t:{a=(a=e.ownerDocument)&&a.defaultView||window;var o=a.getSelection&&a.getSelection();if(o&&o.rangeCount!==0){a=o.anchorNode;var u=o.anchorOffset,f=o.focusNode;o=o.focusOffset;try{a.nodeType,f.nodeType}catch{a=null;break t}var x=0,A=-1,G=-1,it=0,mt=0,St=e,ot=null;e:for(;;){for(var ht;St!==a||u!==0&&St.nodeType!==3||(A=x+u),St!==f||o!==0&&St.nodeType!==3||(G=x+o),St.nodeType===3&&(x+=St.nodeValue.length),(ht=St.firstChild)!==null;)ot=St,St=ht;for(;;){if(St===e)break e;if(ot===a&&++it===u&&(A=x),ot===f&&++mt===o&&(G=x),(ht=St.nextSibling)!==null)break;St=ot,ot=St.parentNode}St=ht}a=A===-1||G===-1?null:{start:A,end:G}}else a=null}a=a||{start:0,end:0}}else a=null;for(Vf={focusedElem:e,selectionRange:a},nc=!1,Sn=n;Sn!==null;)if(n=Sn,e=n.child,(n.subtreeFlags&1028)!==0&&e!==null)e.return=n,Sn=e;else for(;Sn!==null;){switch(n=Sn,f=n.alternate,e=n.flags,n.tag){case 0:if((e&4)!==0&&(e=n.updateQueue,e=e!==null?e.events:null,e!==null))for(a=0;a<e.length;a++)u=e[a],u.ref.impl=u.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&f!==null){e=void 0,a=n,u=f.memoizedProps,f=f.memoizedState,o=a.stateNode;try{var Wt=fs(a.type,u);e=o.getSnapshotBeforeUpdate(Wt,f),o.__reactInternalSnapshotBeforeUpdate=e}catch(re){Ie(a,a.return,re)}}break;case 3:if((e&1024)!==0){if(e=n.stateNode.containerInfo,a=e.nodeType,a===9)jf(e);else if(a===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":jf(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(s(163))}if(e=n.sibling,e!==null){e.return=n.return,Sn=e;break}Sn=n.return}}function og(e,n,a){var o=a.flags;switch(a.tag){case 0:case 11:case 15:Qi(e,a),o&4&&_o(5,a);break;case 1:if(Qi(e,a),o&4)if(e=a.stateNode,n===null)try{e.componentDidMount()}catch(x){Ie(a,a.return,x)}else{var u=fs(a.type,n.memoizedProps);n=n.memoizedState;try{e.componentDidUpdate(u,n,e.__reactInternalSnapshotBeforeUpdate)}catch(x){Ie(a,a.return,x)}}o&64&&eg(a),o&512&&vo(a,a.return);break;case 3:if(Qi(e,a),o&64&&(e=a.updateQueue,e!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{jp(e,n)}catch(x){Ie(a,a.return,x)}}break;case 27:n===null&&o&4&&sg(a);case 26:case 5:Qi(e,a),n===null&&o&4&&ig(a),o&512&&vo(a,a.return);break;case 12:Qi(e,a);break;case 31:Qi(e,a),o&4&&ug(e,a);break;case 13:Qi(e,a),o&4&&fg(e,a),o&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=Qx.bind(null,a),_S(e,a))));break;case 22:if(o=a.memoizedState!==null||Zi,!o){n=n!==null&&n.memoizedState!==null||un,u=Zi;var f=un;Zi=o,(un=n)&&!f?Ji(e,a,(a.subtreeFlags&8772)!==0):Qi(e,a),Zi=u,un=f}break;case 30:break;default:Qi(e,a)}}function lg(e){var n=e.alternate;n!==null&&(e.alternate=null,lg(n)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(n=e.stateNode,n!==null&&C(n)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Ke=null,Fn=!1;function Ki(e,n,a){for(a=a.child;a!==null;)cg(e,n,a),a=a.sibling}function cg(e,n,a){if(Lt&&typeof Lt.onCommitFiberUnmount=="function")try{Lt.onCommitFiberUnmount(Ct,a)}catch{}switch(a.tag){case 26:un||Di(a,n),Ki(e,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:un||Di(a,n);var o=Ke,u=Fn;Da(a.type)&&(Ke=a.stateNode,Fn=!1),Ki(e,n,a),Ro(a.stateNode),Ke=o,Fn=u;break;case 5:un||Di(a,n);case 6:if(o=Ke,u=Fn,Ke=null,Ki(e,n,a),Ke=o,Fn=u,Ke!==null)if(Fn)try{(Ke.nodeType===9?Ke.body:Ke.nodeName==="HTML"?Ke.ownerDocument.body:Ke).removeChild(a.stateNode)}catch(f){Ie(a,n,f)}else try{Ke.removeChild(a.stateNode)}catch(f){Ie(a,n,f)}break;case 18:Ke!==null&&(Fn?(e=Ke,e_(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),hr(e)):e_(Ke,a.stateNode));break;case 4:o=Ke,u=Fn,Ke=a.stateNode.containerInfo,Fn=!0,Ki(e,n,a),Ke=o,Fn=u;break;case 0:case 11:case 14:case 15:Ea(2,a,n),un||Ea(4,a,n),Ki(e,n,a);break;case 1:un||(Di(a,n),o=a.stateNode,typeof o.componentWillUnmount=="function"&&ng(a,n,o)),Ki(e,n,a);break;case 21:Ki(e,n,a);break;case 22:un=(o=un)||a.memoizedState!==null,Ki(e,n,a),un=o;break;default:Ki(e,n,a)}}function ug(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{hr(e)}catch(a){Ie(n,n.return,a)}}}function fg(e,n){if(n.memoizedState===null&&(e=n.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{hr(e)}catch(a){Ie(n,n.return,a)}}function kx(e){switch(e.tag){case 31:case 13:case 19:var n=e.stateNode;return n===null&&(n=e.stateNode=new rg),n;case 22:return e=e.stateNode,n=e._retryCache,n===null&&(n=e._retryCache=new rg),n;default:throw Error(s(435,e.tag))}}function zl(e,n){var a=kx(e);n.forEach(function(o){if(!a.has(o)){a.add(o);var u=Jx.bind(null,e,o);o.then(u,u)}})}function Hn(e,n){var a=n.deletions;if(a!==null)for(var o=0;o<a.length;o++){var u=a[o],f=e,x=n,A=x;t:for(;A!==null;){switch(A.tag){case 27:if(Da(A.type)){Ke=A.stateNode,Fn=!1;break t}break;case 5:Ke=A.stateNode,Fn=!1;break t;case 3:case 4:Ke=A.stateNode.containerInfo,Fn=!0;break t}A=A.return}if(Ke===null)throw Error(s(160));cg(f,x,u),Ke=null,Fn=!1,f=u.alternate,f!==null&&(f.return=null),u.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)hg(n,e),n=n.sibling}var vi=null;function hg(e,n){var a=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Hn(n,e),Gn(e),o&4&&(Ea(3,e,e.return),_o(3,e),Ea(5,e,e.return));break;case 1:Hn(n,e),Gn(e),o&512&&(un||a===null||Di(a,a.return)),o&64&&Zi&&(e=e.updateQueue,e!==null&&(o=e.callbacks,o!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?o:a.concat(o))));break;case 26:var u=vi;if(Hn(n,e),Gn(e),o&512&&(un||a===null||Di(a,a.return)),o&4){var f=a!==null?a.memoizedState:null;if(o=e.memoizedState,a===null)if(o===null)if(e.stateNode===null){t:{o=e.type,a=e.memoizedProps,u=u.ownerDocument||u;e:switch(o){case"title":f=u.getElementsByTagName("title")[0],(!f||f[Ka]||f[rn]||f.namespaceURI==="http://www.w3.org/2000/svg"||f.hasAttribute("itemprop"))&&(f=u.createElement(o),u.head.insertBefore(f,u.querySelector("head > title"))),Cn(f,o,a),f[rn]=e,bt(f),o=f;break t;case"link":var x=h_("link","href",u).get(o+(a.href||""));if(x){for(var A=0;A<x.length;A++)if(f=x[A],f.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&f.getAttribute("rel")===(a.rel==null?null:a.rel)&&f.getAttribute("title")===(a.title==null?null:a.title)&&f.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){x.splice(A,1);break e}}f=u.createElement(o),Cn(f,o,a),u.head.appendChild(f);break;case"meta":if(x=h_("meta","content",u).get(o+(a.content||""))){for(A=0;A<x.length;A++)if(f=x[A],f.getAttribute("content")===(a.content==null?null:""+a.content)&&f.getAttribute("name")===(a.name==null?null:a.name)&&f.getAttribute("property")===(a.property==null?null:a.property)&&f.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&f.getAttribute("charset")===(a.charSet==null?null:a.charSet)){x.splice(A,1);break e}}f=u.createElement(o),Cn(f,o,a),u.head.appendChild(f);break;default:throw Error(s(468,o))}f[rn]=e,bt(f),o=f}e.stateNode=o}else d_(u,e.type,e.stateNode);else e.stateNode=f_(u,o,e.memoizedProps);else f!==o?(f===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):f.count--,o===null?d_(u,e.type,e.stateNode):f_(u,o,e.memoizedProps)):o===null&&e.stateNode!==null&&_f(e,e.memoizedProps,a.memoizedProps)}break;case 27:Hn(n,e),Gn(e),o&512&&(un||a===null||Di(a,a.return)),a!==null&&o&4&&_f(e,e.memoizedProps,a.memoizedProps);break;case 5:if(Hn(n,e),Gn(e),o&512&&(un||a===null||Di(a,a.return)),e.flags&32){u=e.stateNode;try{Ps(u,"")}catch(Wt){Ie(e,e.return,Wt)}}o&4&&e.stateNode!=null&&(u=e.memoizedProps,_f(e,u,a!==null?a.memoizedProps:u)),o&1024&&(Sf=!0);break;case 6:if(Hn(n,e),Gn(e),o&4){if(e.stateNode===null)throw Error(s(162));o=e.memoizedProps,a=e.stateNode;try{a.nodeValue=o}catch(Wt){Ie(e,e.return,Wt)}}break;case 3:if(Jl=null,u=vi,vi=Kl(n.containerInfo),Hn(n,e),vi=u,Gn(e),o&4&&a!==null&&a.memoizedState.isDehydrated)try{hr(n.containerInfo)}catch(Wt){Ie(e,e.return,Wt)}Sf&&(Sf=!1,dg(e));break;case 4:o=vi,vi=Kl(e.stateNode.containerInfo),Hn(n,e),Gn(e),vi=o;break;case 12:Hn(n,e),Gn(e);break;case 31:Hn(n,e),Gn(e),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,zl(e,o)));break;case 13:Hn(n,e),Gn(e),e.child.flags&8192&&e.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(Bl=T()),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,zl(e,o)));break;case 22:u=e.memoizedState!==null;var G=a!==null&&a.memoizedState!==null,it=Zi,mt=un;if(Zi=it||u,un=mt||G,Hn(n,e),un=mt,Zi=it,Gn(e),o&8192)t:for(n=e.stateNode,n._visibility=u?n._visibility&-2:n._visibility|1,u&&(a===null||G||Zi||un||hs(e)),a=null,n=e;;){if(n.tag===5||n.tag===26){if(a===null){G=a=n;try{if(f=G.stateNode,u)x=f.style,typeof x.setProperty=="function"?x.setProperty("display","none","important"):x.display="none";else{A=G.stateNode;var St=G.memoizedProps.style,ot=St!=null&&St.hasOwnProperty("display")?St.display:null;A.style.display=ot==null||typeof ot=="boolean"?"":(""+ot).trim()}}catch(Wt){Ie(G,G.return,Wt)}}}else if(n.tag===6){if(a===null){G=n;try{G.stateNode.nodeValue=u?"":G.memoizedProps}catch(Wt){Ie(G,G.return,Wt)}}}else if(n.tag===18){if(a===null){G=n;try{var ht=G.stateNode;u?n_(ht,!0):n_(G.stateNode,!1)}catch(Wt){Ie(G,G.return,Wt)}}}else if((n.tag!==22&&n.tag!==23||n.memoizedState===null||n===e)&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break t;for(;n.sibling===null;){if(n.return===null||n.return===e)break t;a===n&&(a=null),n=n.return}a===n&&(a=null),n.sibling.return=n.return,n=n.sibling}o&4&&(o=e.updateQueue,o!==null&&(a=o.retryQueue,a!==null&&(o.retryQueue=null,zl(e,a))));break;case 19:Hn(n,e),Gn(e),o&4&&(o=e.updateQueue,o!==null&&(e.updateQueue=null,zl(e,o)));break;case 30:break;case 21:break;default:Hn(n,e),Gn(e)}}function Gn(e){var n=e.flags;if(n&2){try{for(var a,o=e.return;o!==null;){if(ag(o)){a=o;break}o=o.return}if(a==null)throw Error(s(160));switch(a.tag){case 27:var u=a.stateNode,f=vf(e);Pl(e,f,u);break;case 5:var x=a.stateNode;a.flags&32&&(Ps(x,""),a.flags&=-33);var A=vf(e);Pl(e,A,x);break;case 3:case 4:var G=a.stateNode.containerInfo,it=vf(e);xf(e,it,G);break;default:throw Error(s(161))}}catch(mt){Ie(e,e.return,mt)}e.flags&=-3}n&4096&&(e.flags&=-4097)}function dg(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var n=e;dg(n),n.tag===5&&n.flags&1024&&n.stateNode.reset(),e=e.sibling}}function Qi(e,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)og(e,n.alternate,n),n=n.sibling}function hs(e){for(e=e.child;e!==null;){var n=e;switch(n.tag){case 0:case 11:case 14:case 15:Ea(4,n,n.return),hs(n);break;case 1:Di(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&ng(n,n.return,a),hs(n);break;case 27:Ro(n.stateNode);case 26:case 5:Di(n,n.return),hs(n);break;case 22:n.memoizedState===null&&hs(n);break;case 30:hs(n);break;default:hs(n)}e=e.sibling}}function Ji(e,n,a){for(a=a&&(n.subtreeFlags&8772)!==0,n=n.child;n!==null;){var o=n.alternate,u=e,f=n,x=f.flags;switch(f.tag){case 0:case 11:case 15:Ji(u,f,a),_o(4,f);break;case 1:if(Ji(u,f,a),o=f,u=o.stateNode,typeof u.componentDidMount=="function")try{u.componentDidMount()}catch(it){Ie(o,o.return,it)}if(o=f,u=o.updateQueue,u!==null){var A=o.stateNode;try{var G=u.shared.hiddenCallbacks;if(G!==null)for(u.shared.hiddenCallbacks=null,u=0;u<G.length;u++)Xp(G[u],A)}catch(it){Ie(o,o.return,it)}}a&&x&64&&eg(f),vo(f,f.return);break;case 27:sg(f);case 26:case 5:Ji(u,f,a),a&&o===null&&x&4&&ig(f),vo(f,f.return);break;case 12:Ji(u,f,a);break;case 31:Ji(u,f,a),a&&x&4&&ug(u,f);break;case 13:Ji(u,f,a),a&&x&4&&fg(u,f);break;case 22:f.memoizedState===null&&Ji(u,f,a),vo(f,f.return);break;case 30:break;default:Ji(u,f,a)}n=n.sibling}}function yf(e,n){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(e=n.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&io(a))}function Mf(e,n){e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&io(e))}function xi(e,n,a,o){if(n.subtreeFlags&10256)for(n=n.child;n!==null;)pg(e,n,a,o),n=n.sibling}function pg(e,n,a,o){var u=n.flags;switch(n.tag){case 0:case 11:case 15:xi(e,n,a,o),u&2048&&_o(9,n);break;case 1:xi(e,n,a,o);break;case 3:xi(e,n,a,o),u&2048&&(e=null,n.alternate!==null&&(e=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==e&&(n.refCount++,e!=null&&io(e)));break;case 12:if(u&2048){xi(e,n,a,o),e=n.stateNode;try{var f=n.memoizedProps,x=f.id,A=f.onPostCommit;typeof A=="function"&&A(x,n.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(G){Ie(n,n.return,G)}}else xi(e,n,a,o);break;case 31:xi(e,n,a,o);break;case 13:xi(e,n,a,o);break;case 23:break;case 22:f=n.stateNode,x=n.alternate,n.memoizedState!==null?f._visibility&2?xi(e,n,a,o):xo(e,n):f._visibility&2?xi(e,n,a,o):(f._visibility|=2,er(e,n,a,o,(n.subtreeFlags&10256)!==0||!1)),u&2048&&yf(x,n);break;case 24:xi(e,n,a,o),u&2048&&Mf(n.alternate,n);break;default:xi(e,n,a,o)}}function er(e,n,a,o,u){for(u=u&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var f=e,x=n,A=a,G=o,it=x.flags;switch(x.tag){case 0:case 11:case 15:er(f,x,A,G,u),_o(8,x);break;case 23:break;case 22:var mt=x.stateNode;x.memoizedState!==null?mt._visibility&2?er(f,x,A,G,u):xo(f,x):(mt._visibility|=2,er(f,x,A,G,u)),u&&it&2048&&yf(x.alternate,x);break;case 24:er(f,x,A,G,u),u&&it&2048&&Mf(x.alternate,x);break;default:er(f,x,A,G,u)}n=n.sibling}}function xo(e,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=e,o=n,u=o.flags;switch(o.tag){case 22:xo(a,o),u&2048&&yf(o.alternate,o);break;case 24:xo(a,o),u&2048&&Mf(o.alternate,o);break;default:xo(a,o)}n=n.sibling}}var So=8192;function nr(e,n,a){if(e.subtreeFlags&So)for(e=e.child;e!==null;)mg(e,n,a),e=e.sibling}function mg(e,n,a){switch(e.tag){case 26:nr(e,n,a),e.flags&So&&e.memoizedState!==null&&wS(a,vi,e.memoizedState,e.memoizedProps);break;case 5:nr(e,n,a);break;case 3:case 4:var o=vi;vi=Kl(e.stateNode.containerInfo),nr(e,n,a),vi=o;break;case 22:e.memoizedState===null&&(o=e.alternate,o!==null&&o.memoizedState!==null?(o=So,So=16777216,nr(e,n,a),So=o):nr(e,n,a));break;default:nr(e,n,a)}}function gg(e){var n=e.alternate;if(n!==null&&(e=n.child,e!==null)){n.child=null;do n=e.sibling,e.sibling=null,e=n;while(e!==null)}}function yo(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];Sn=o,vg(o,e)}gg(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)_g(e),e=e.sibling}function _g(e){switch(e.tag){case 0:case 11:case 15:yo(e),e.flags&2048&&Ea(9,e,e.return);break;case 3:yo(e);break;case 12:yo(e);break;case 22:var n=e.stateNode;e.memoizedState!==null&&n._visibility&2&&(e.return===null||e.return.tag!==13)?(n._visibility&=-3,Il(e)):yo(e);break;default:yo(e)}}function Il(e){var n=e.deletions;if((e.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];Sn=o,vg(o,e)}gg(e)}for(e=e.child;e!==null;){switch(n=e,n.tag){case 0:case 11:case 15:Ea(8,n,n.return),Il(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,Il(n));break;default:Il(n)}e=e.sibling}}function vg(e,n){for(;Sn!==null;){var a=Sn;switch(a.tag){case 0:case 11:case 15:Ea(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var o=a.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:io(a.memoizedState.cache)}if(o=a.child,o!==null)o.return=a,Sn=o;else t:for(a=e;Sn!==null;){o=Sn;var u=o.sibling,f=o.return;if(lg(o),o===a){Sn=null;break t}if(u!==null){u.return=f,Sn=u;break t}Sn=f}}}var Xx={getCacheForType:function(e){var n=An(on),a=n.data.get(e);return a===void 0&&(a=e(),n.data.set(e,a)),a},cacheSignal:function(){return An(on).controller.signal}},jx=typeof WeakMap=="function"?WeakMap:Map,Ne=0,je=null,xe=null,be=0,ze=0,$n=null,ba=!1,ir=!1,Ef=!1,$i=0,tn=0,Ta=0,ds=0,bf=0,ti=0,ar=0,Mo=null,Vn=null,Tf=!1,Bl=0,xg=0,Fl=1/0,Hl=null,Aa=null,dn=0,Ra=null,sr=null,ta=0,Af=0,Rf=null,Sg=null,Eo=0,Cf=null;function ei(){return(Ne&2)!==0&&be!==0?be&-be:I.T!==null?Of():Za()}function yg(){if(ti===0)if((be&536870912)===0||Ae){var e=Ot;Ot<<=1,(Ot&3932160)===0&&(Ot=262144),ti=e}else ti=536870912;return e=Qn.current,e!==null&&(e.flags|=32),ti}function kn(e,n,a){(e===je&&(ze===2||ze===9)||e.cancelPendingCommit!==null)&&(rr(e,0),Ca(e,be,ti,!1)),On(e,a),((Ne&2)===0||e!==je)&&(e===je&&((Ne&2)===0&&(ds|=a),tn===4&&Ca(e,be,ti,!1)),Ui(e))}function Mg(e,n,a){if((Ne&6)!==0)throw Error(s(327));var o=!a&&(n&127)===0&&(n&e.expiredLanes)===0||jt(e,n),u=o?Yx(e,n):Df(e,n,!0),f=o;do{if(u===0){ir&&!o&&Ca(e,n,0,!1);break}else{if(a=e.current.alternate,f&&!Wx(a)){u=Df(e,n,!1),f=!1;continue}if(u===2){if(f=n,e.errorRecoveryDisabledLanes&f)var x=0;else x=e.pendingLanes&-536870913,x=x!==0?x:x&536870912?536870912:0;if(x!==0){n=x;t:{var A=e;u=Mo;var G=A.current.memoizedState.isDehydrated;if(G&&(rr(A,x).flags|=256),x=Df(A,x,!1),x!==2){if(Ef&&!G){A.errorRecoveryDisabledLanes|=f,ds|=f,u=4;break t}f=Vn,Vn=u,f!==null&&(Vn===null?Vn=f:Vn.push.apply(Vn,f))}u=x}if(f=!1,u!==2)continue}}if(u===1){rr(e,0),Ca(e,n,0,!0);break}t:{switch(o=e,f=u,f){case 0:case 1:throw Error(s(345));case 4:if((n&4194048)!==n)break;case 6:Ca(o,n,ti,!ba);break t;case 2:Vn=null;break;case 3:case 5:break;default:throw Error(s(329))}if((n&62914560)===n&&(u=Bl+300-T(),10<u)){if(Ca(o,n,ti,!ba),yt(o,0,!0)!==0)break t;ta=n,o.timeoutHandle=$g(Eg.bind(null,o,a,Vn,Hl,Tf,n,ti,ds,ar,ba,f,"Throttled",-0,0),u);break t}Eg(o,a,Vn,Hl,Tf,n,ti,ds,ar,ba,f,null,-0,0)}}break}while(!0);Ui(e)}function Eg(e,n,a,o,u,f,x,A,G,it,mt,St,ot,ht){if(e.timeoutHandle=-1,St=n.subtreeFlags,St&8192||(St&16785408)===16785408){St={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Fi},mg(n,f,St);var Wt=(f&62914560)===f?Bl-T():(f&4194048)===f?xg-T():0;if(Wt=DS(St,Wt),Wt!==null){ta=f,e.cancelPendingCommit=Wt(Ug.bind(null,e,n,f,a,o,u,x,A,G,mt,St,null,ot,ht)),Ca(e,f,x,!it);return}}Ug(e,n,f,a,o,u,x,A,G)}function Wx(e){for(var n=e;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var o=0;o<a.length;o++){var u=a[o],f=u.getSnapshot;u=u.value;try{if(!Zn(f(),u))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function Ca(e,n,a,o){n&=~bf,n&=~ds,e.suspendedLanes|=n,e.pingedLanes&=~n,o&&(e.warmLanes|=n),o=e.expirationTimes;for(var u=n;0<u;){var f=31-Ht(u),x=1<<f;o[f]=-1,u&=~x}a!==0&&kr(e,a,n)}function Gl(){return(Ne&6)===0?(bo(0),!1):!0}function wf(){if(xe!==null){if(ze===0)var e=xe.return;else e=xe,ki=as=null,Xu(e),Ks=null,so=0,e=xe;for(;e!==null;)tg(e.alternate,e),e=e.return;xe=null}}function rr(e,n){var a=e.timeoutHandle;a!==-1&&(e.timeoutHandle=-1,hS(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),ta=0,wf(),je=e,xe=a=Gi(e.current,null),be=n,ze=0,$n=null,ba=!1,ir=jt(e,n),Ef=!1,ar=ti=bf=ds=Ta=tn=0,Vn=Mo=null,Tf=!1,(n&8)!==0&&(n|=n&32);var o=e.entangledLanes;if(o!==0)for(e=e.entanglements,o&=n;0<o;){var u=31-Ht(o),f=1<<u;n|=e[u],o&=~f}return $i=n,ll(),a}function bg(e,n){de=null,I.H=po,n===Zs||n===gl?(n=Hp(),ze=3):n===Nu?(n=Hp(),ze=4):ze=n===of?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,$n=n,xe===null&&(tn=1,Dl(e,oi(n,e.current)))}function Tg(){var e=Qn.current;return e===null?!0:(be&4194048)===be?fi===null:(be&62914560)===be||(be&536870912)!==0?e===fi:!1}function Ag(){var e=I.H;return I.H=po,e===null?po:e}function Rg(){var e=I.A;return I.A=Xx,e}function Vl(){tn=4,ba||(be&4194048)!==be&&Qn.current!==null||(ir=!0),(Ta&134217727)===0&&(ds&134217727)===0||je===null||Ca(je,be,ti,!1)}function Df(e,n,a){var o=Ne;Ne|=2;var u=Ag(),f=Rg();(je!==e||be!==n)&&(Hl=null,rr(e,n)),n=!1;var x=tn;t:do try{if(ze!==0&&xe!==null){var A=xe,G=$n;switch(ze){case 8:wf(),x=6;break t;case 3:case 2:case 9:case 6:Qn.current===null&&(n=!0);var it=ze;if(ze=0,$n=null,or(e,A,G,it),a&&ir){x=0;break t}break;default:it=ze,ze=0,$n=null,or(e,A,G,it)}}qx(),x=tn;break}catch(mt){bg(e,mt)}while(!0);return n&&e.shellSuspendCounter++,ki=as=null,Ne=o,I.H=u,I.A=f,xe===null&&(je=null,be=0,ll()),x}function qx(){for(;xe!==null;)Cg(xe)}function Yx(e,n){var a=Ne;Ne|=2;var o=Ag(),u=Rg();je!==e||be!==n?(Hl=null,Fl=T()+500,rr(e,n)):ir=jt(e,n);t:do try{if(ze!==0&&xe!==null){n=xe;var f=$n;e:switch(ze){case 1:ze=0,$n=null,or(e,n,f,1);break;case 2:case 9:if(Bp(f)){ze=0,$n=null,wg(n);break}n=function(){ze!==2&&ze!==9||je!==e||(ze=7),Ui(e)},f.then(n,n);break t;case 3:ze=7;break t;case 4:ze=5;break t;case 7:Bp(f)?(ze=0,$n=null,wg(n)):(ze=0,$n=null,or(e,n,f,7));break;case 5:var x=null;switch(xe.tag){case 26:x=xe.memoizedState;case 5:case 27:var A=xe;if(x?p_(x):A.stateNode.complete){ze=0,$n=null;var G=A.sibling;if(G!==null)xe=G;else{var it=A.return;it!==null?(xe=it,kl(it)):xe=null}break e}}ze=0,$n=null,or(e,n,f,5);break;case 6:ze=0,$n=null,or(e,n,f,6);break;case 8:wf(),tn=6;break t;default:throw Error(s(462))}}Zx();break}catch(mt){bg(e,mt)}while(!0);return ki=as=null,I.H=o,I.A=u,Ne=a,xe!==null?0:(je=null,be=0,ll(),tn)}function Zx(){for(;xe!==null&&!Qe();)Cg(xe)}function Cg(e){var n=Jm(e.alternate,e,$i);e.memoizedProps=e.pendingProps,n===null?kl(e):xe=n}function wg(e){var n=e,a=n.alternate;switch(n.tag){case 15:case 0:n=Wm(a,n,n.pendingProps,n.type,void 0,be);break;case 11:n=Wm(a,n,n.pendingProps,n.type.render,n.ref,be);break;case 5:Xu(n);default:tg(a,n),n=xe=Rp(n,$i),n=Jm(a,n,$i)}e.memoizedProps=e.pendingProps,n===null?kl(e):xe=n}function or(e,n,a,o){ki=as=null,Xu(n),Ks=null,so=0;var u=n.return;try{if(Ix(e,u,n,a,be)){tn=1,Dl(e,oi(a,e.current)),xe=null;return}}catch(f){if(u!==null)throw xe=u,f;tn=1,Dl(e,oi(a,e.current)),xe=null;return}n.flags&32768?(Ae||o===1?e=!0:ir||(be&536870912)!==0?e=!1:(ba=e=!0,(o===2||o===9||o===3||o===6)&&(o=Qn.current,o!==null&&o.tag===13&&(o.flags|=16384))),Dg(n,e)):kl(n)}function kl(e){var n=e;do{if((n.flags&32768)!==0){Dg(n,ba);return}e=n.return;var a=Hx(n.alternate,n,$i);if(a!==null){xe=a;return}if(n=n.sibling,n!==null){xe=n;return}xe=n=e}while(n!==null);tn===0&&(tn=5)}function Dg(e,n){do{var a=Gx(e.alternate,e);if(a!==null){a.flags&=32767,xe=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(e=e.sibling,e!==null)){xe=e;return}xe=e=a}while(e!==null);tn=6,xe=null}function Ug(e,n,a,o,u,f,x,A,G){e.cancelPendingCommit=null;do Xl();while(dn!==0);if((Ne&6)!==0)throw Error(s(327));if(n!==null){if(n===e.current)throw Error(s(177));if(f=n.lanes|n.childLanes,f|=_u,si(e,a,f,x,A,G),e===je&&(xe=je=null,be=0),sr=n,Ra=e,ta=a,Af=f,Rf=u,Sg=o,(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,$x(pt,function(){return zg(),null})):(e.callbackNode=null,e.callbackPriority=0),o=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||o){o=I.T,I.T=null,u=Y.p,Y.p=2,x=Ne,Ne|=4;try{Vx(e,n,a)}finally{Ne=x,Y.p=u,I.T=o}}dn=1,Ng(),Lg(),Og()}}function Ng(){if(dn===1){dn=0;var e=Ra,n=sr,a=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||a){a=I.T,I.T=null;var o=Y.p;Y.p=2;var u=Ne;Ne|=4;try{hg(n,e);var f=Vf,x=vp(e.containerInfo),A=f.focusedElem,G=f.selectionRange;if(x!==A&&A&&A.ownerDocument&&_p(A.ownerDocument.documentElement,A)){if(G!==null&&hu(A)){var it=G.start,mt=G.end;if(mt===void 0&&(mt=it),"selectionStart"in A)A.selectionStart=it,A.selectionEnd=Math.min(mt,A.value.length);else{var St=A.ownerDocument||document,ot=St&&St.defaultView||window;if(ot.getSelection){var ht=ot.getSelection(),Wt=A.textContent.length,re=Math.min(G.start,Wt),He=G.end===void 0?re:Math.min(G.end,Wt);!ht.extend&&re>He&&(x=He,He=re,re=x);var J=gp(A,re),k=gp(A,He);if(J&&k&&(ht.rangeCount!==1||ht.anchorNode!==J.node||ht.anchorOffset!==J.offset||ht.focusNode!==k.node||ht.focusOffset!==k.offset)){var nt=St.createRange();nt.setStart(J.node,J.offset),ht.removeAllRanges(),re>He?(ht.addRange(nt),ht.extend(k.node,k.offset)):(nt.setEnd(k.node,k.offset),ht.addRange(nt))}}}}for(St=[],ht=A;ht=ht.parentNode;)ht.nodeType===1&&St.push({element:ht,left:ht.scrollLeft,top:ht.scrollTop});for(typeof A.focus=="function"&&A.focus(),A=0;A<St.length;A++){var _t=St[A];_t.element.scrollLeft=_t.left,_t.element.scrollTop=_t.top}}nc=!!Gf,Vf=Gf=null}finally{Ne=u,Y.p=o,I.T=a}}e.current=n,dn=2}}function Lg(){if(dn===2){dn=0;var e=Ra,n=sr,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=I.T,I.T=null;var o=Y.p;Y.p=2;var u=Ne;Ne|=4;try{og(e,n.alternate,n)}finally{Ne=u,Y.p=o,I.T=a}}dn=3}}function Og(){if(dn===4||dn===3){dn=0,P();var e=Ra,n=sr,a=ta,o=Sg;(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?dn=5:(dn=0,sr=Ra=null,Pg(e,e.pendingLanes));var u=e.pendingLanes;if(u===0&&(Aa=null),Ls(a),n=n.stateNode,Lt&&typeof Lt.onCommitFiberRoot=="function")try{Lt.onCommitFiberRoot(Ct,n,void 0,(n.current.flags&128)===128)}catch{}if(o!==null){n=I.T,u=Y.p,Y.p=2,I.T=null;try{for(var f=e.onRecoverableError,x=0;x<o.length;x++){var A=o[x];f(A.value,{componentStack:A.stack})}}finally{I.T=n,Y.p=u}}(ta&3)!==0&&Xl(),Ui(e),u=e.pendingLanes,(a&261930)!==0&&(u&42)!==0?e===Cf?Eo++:(Eo=0,Cf=e):Eo=0,bo(0)}}function Pg(e,n){(e.pooledCacheLanes&=n)===0&&(n=e.pooledCache,n!=null&&(e.pooledCache=null,io(n)))}function Xl(){return Ng(),Lg(),Og(),zg()}function zg(){if(dn!==5)return!1;var e=Ra,n=Af;Af=0;var a=Ls(ta),o=I.T,u=Y.p;try{Y.p=32>a?32:a,I.T=null,a=Rf,Rf=null;var f=Ra,x=ta;if(dn=0,sr=Ra=null,ta=0,(Ne&6)!==0)throw Error(s(331));var A=Ne;if(Ne|=4,_g(f.current),pg(f,f.current,x,a),Ne=A,bo(0,!1),Lt&&typeof Lt.onPostCommitFiberRoot=="function")try{Lt.onPostCommitFiberRoot(Ct,f)}catch{}return!0}finally{Y.p=u,I.T=o,Pg(e,n)}}function Ig(e,n,a){n=oi(a,n),n=rf(e.stateNode,n,2),e=Sa(e,n,2),e!==null&&(On(e,2),Ui(e))}function Ie(e,n,a){if(e.tag===3)Ig(e,e,a);else for(;n!==null;){if(n.tag===3){Ig(n,e,a);break}else if(n.tag===1){var o=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(Aa===null||!Aa.has(o))){e=oi(a,e),a=Bm(2),o=Sa(n,a,2),o!==null&&(Fm(a,o,n,e),On(o,2),Ui(o));break}}n=n.return}}function Uf(e,n,a){var o=e.pingCache;if(o===null){o=e.pingCache=new jx;var u=new Set;o.set(n,u)}else u=o.get(n),u===void 0&&(u=new Set,o.set(n,u));u.has(a)||(Ef=!0,u.add(a),e=Kx.bind(null,e,n,a),n.then(e,e))}function Kx(e,n,a){var o=e.pingCache;o!==null&&o.delete(n),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,je===e&&(be&a)===a&&(tn===4||tn===3&&(be&62914560)===be&&300>T()-Bl?(Ne&2)===0&&rr(e,0):bf|=a,ar===be&&(ar=0)),Ui(e)}function Bg(e,n){n===0&&(n=Pe()),e=es(e,n),e!==null&&(On(e,n),Ui(e))}function Qx(e){var n=e.memoizedState,a=0;n!==null&&(a=n.retryLane),Bg(e,a)}function Jx(e,n){var a=0;switch(e.tag){case 31:case 13:var o=e.stateNode,u=e.memoizedState;u!==null&&(a=u.retryLane);break;case 19:o=e.stateNode;break;case 22:o=e.stateNode._retryCache;break;default:throw Error(s(314))}o!==null&&o.delete(n),Bg(e,a)}function $x(e,n){return fe(e,n)}var jl=null,lr=null,Nf=!1,Wl=!1,Lf=!1,wa=0;function Ui(e){e!==lr&&e.next===null&&(lr===null?jl=lr=e:lr=lr.next=e),Wl=!0,Nf||(Nf=!0,eS())}function bo(e,n){if(!Lf&&Wl){Lf=!0;do for(var a=!1,o=jl;o!==null;){if(e!==0){var u=o.pendingLanes;if(u===0)var f=0;else{var x=o.suspendedLanes,A=o.pingedLanes;f=(1<<31-Ht(42|e)+1)-1,f&=u&~(x&~A),f=f&201326741?f&201326741|1:f?f|2:0}f!==0&&(a=!0,Vg(o,f))}else f=be,f=yt(o,o===je?f:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(f&3)===0||jt(o,f)||(a=!0,Vg(o,f));o=o.next}while(a);Lf=!1}}function tS(){Fg()}function Fg(){Wl=Nf=!1;var e=0;wa!==0&&fS()&&(e=wa);for(var n=T(),a=null,o=jl;o!==null;){var u=o.next,f=Hg(o,n);f===0?(o.next=null,a===null?jl=u:a.next=u,u===null&&(lr=a)):(a=o,(e!==0||(f&3)!==0)&&(Wl=!0)),o=u}dn!==0&&dn!==5||bo(e),wa!==0&&(wa=0)}function Hg(e,n){for(var a=e.suspendedLanes,o=e.pingedLanes,u=e.expirationTimes,f=e.pendingLanes&-62914561;0<f;){var x=31-Ht(f),A=1<<x,G=u[x];G===-1?((A&a)===0||(A&o)!==0)&&(u[x]=le(A,n)):G<=n&&(e.expiredLanes|=A),f&=~A}if(n=je,a=be,a=yt(e,e===n?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o=e.callbackNode,a===0||e===n&&(ze===2||ze===9)||e.cancelPendingCommit!==null)return o!==null&&o!==null&&Je(o),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||jt(e,a)){if(n=a&-a,n===e.callbackPriority)return n;switch(o!==null&&Je(o),Ls(a)){case 2:case 8:a=Tt;break;case 32:a=pt;break;case 268435456:a=Nt;break;default:a=pt}return o=Gg.bind(null,e),a=fe(a,o),e.callbackPriority=n,e.callbackNode=a,n}return o!==null&&o!==null&&Je(o),e.callbackPriority=2,e.callbackNode=null,2}function Gg(e,n){if(dn!==0&&dn!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(Xl()&&e.callbackNode!==a)return null;var o=be;return o=yt(e,e===je?o:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),o===0?null:(Mg(e,o,n),Hg(e,T()),e.callbackNode!=null&&e.callbackNode===a?Gg.bind(null,e):null)}function Vg(e,n){if(Xl())return null;Mg(e,n,!0)}function eS(){dS(function(){(Ne&6)!==0?fe(gt,tS):Fg()})}function Of(){if(wa===0){var e=qs;e===0&&(e=wt,wt<<=1,(wt&261888)===0&&(wt=256)),wa=e}return wa}function kg(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:tl(""+e)}function Xg(e,n){var a=n.ownerDocument.createElement("input");return a.name=n.name,a.value=n.value,e.id&&a.setAttribute("form",e.id),n.parentNode.insertBefore(a,n),e=new FormData(e),a.parentNode.removeChild(a),e}function nS(e,n,a,o,u){if(n==="submit"&&a&&a.stateNode===u){var f=kg((u[En]||null).action),x=o.submitter;x&&(n=(n=x[En]||null)?kg(n.formAction):x.getAttribute("formAction"),n!==null&&(f=n,x=null));var A=new al("action","action",null,o,u);e.push({event:A,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(wa!==0){var G=x?Xg(u,x):new FormData(u);$u(a,{pending:!0,data:G,method:u.method,action:f},null,G)}}else typeof f=="function"&&(A.preventDefault(),G=x?Xg(u,x):new FormData(u),$u(a,{pending:!0,data:G,method:u.method,action:f},f,G))},currentTarget:u}]})}}for(var Pf=0;Pf<gu.length;Pf++){var zf=gu[Pf],iS=zf.toLowerCase(),aS=zf[0].toUpperCase()+zf.slice(1);_i(iS,"on"+aS)}_i(yp,"onAnimationEnd"),_i(Mp,"onAnimationIteration"),_i(Ep,"onAnimationStart"),_i("dblclick","onDoubleClick"),_i("focusin","onFocus"),_i("focusout","onBlur"),_i(Sx,"onTransitionRun"),_i(yx,"onTransitionStart"),_i(Mx,"onTransitionCancel"),_i(bp,"onTransitionEnd"),ie("onMouseEnter",["mouseout","mouseover"]),ie("onMouseLeave",["mouseout","mouseover"]),ie("onPointerEnter",["pointerout","pointerover"]),ie("onPointerLeave",["pointerout","pointerover"]),Ft("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Ft("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Ft("onBeforeInput",["compositionend","keypress","textInput","paste"]),Ft("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Ft("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Ft("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var To="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),sS=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(To));function jg(e,n){n=(n&4)!==0;for(var a=0;a<e.length;a++){var o=e[a],u=o.event;o=o.listeners;t:{var f=void 0;if(n)for(var x=o.length-1;0<=x;x--){var A=o[x],G=A.instance,it=A.currentTarget;if(A=A.listener,G!==f&&u.isPropagationStopped())break t;f=A,u.currentTarget=it;try{f(u)}catch(mt){ol(mt)}u.currentTarget=null,f=G}else for(x=0;x<o.length;x++){if(A=o[x],G=A.instance,it=A.currentTarget,A=A.listener,G!==f&&u.isPropagationStopped())break t;f=A,u.currentTarget=it;try{f(u)}catch(mt){ol(mt)}u.currentTarget=null,f=G}}}}function Se(e,n){var a=n[jr];a===void 0&&(a=n[jr]=new Set);var o=e+"__bubble";a.has(o)||(Wg(n,e,2,!1),a.add(o))}function If(e,n,a){var o=0;n&&(o|=4),Wg(a,e,o,n)}var ql="_reactListening"+Math.random().toString(36).slice(2);function Bf(e){if(!e[ql]){e[ql]=!0,It.forEach(function(a){a!=="selectionchange"&&(sS.has(a)||If(a,!1,e),If(a,!0,e))});var n=e.nodeType===9?e:e.ownerDocument;n===null||n[ql]||(n[ql]=!0,If("selectionchange",!1,n))}}function Wg(e,n,a,o){switch(y_(n)){case 2:var u=LS;break;case 8:u=OS;break;default:u=$f}a=u.bind(null,n,a,e),u=void 0,!iu||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(u=!0),o?u!==void 0?e.addEventListener(n,a,{capture:!0,passive:u}):e.addEventListener(n,a,!0):u!==void 0?e.addEventListener(n,a,{passive:u}):e.addEventListener(n,a,!1)}function Ff(e,n,a,o,u){var f=o;if((n&1)===0&&(n&2)===0&&o!==null)t:for(;;){if(o===null)return;var x=o.tag;if(x===3||x===4){var A=o.stateNode.containerInfo;if(A===u)break;if(x===4)for(x=o.return;x!==null;){var G=x.tag;if((G===3||G===4)&&x.stateNode.containerInfo===u)return;x=x.return}for(;A!==null;){if(x=Z(A),x===null)return;if(G=x.tag,G===5||G===6||G===26||G===27){o=f=x;continue t}A=A.parentNode}}o=o.return}Qd(function(){var it=f,mt=eu(a),St=[];t:{var ot=Tp.get(e);if(ot!==void 0){var ht=al,Wt=e;switch(e){case"keypress":if(nl(a)===0)break t;case"keydown":case"keyup":ht=Jv;break;case"focusin":Wt="focus",ht=ou;break;case"focusout":Wt="blur",ht=ou;break;case"beforeblur":case"afterblur":ht=ou;break;case"click":if(a.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ht=tp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ht=Hv;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ht=ex;break;case yp:case Mp:case Ep:ht=kv;break;case bp:ht=ix;break;case"scroll":case"scrollend":ht=Bv;break;case"wheel":ht=sx;break;case"copy":case"cut":case"paste":ht=jv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ht=np;break;case"toggle":case"beforetoggle":ht=ox}var re=(n&4)!==0,He=!re&&(e==="scroll"||e==="scrollend"),J=re?ot!==null?ot+"Capture":null:ot;re=[];for(var k=it,nt;k!==null;){var _t=k;if(nt=_t.stateNode,_t=_t.tag,_t!==5&&_t!==26&&_t!==27||nt===null||J===null||(_t=Wr(k,J),_t!=null&&re.push(Ao(k,_t,nt))),He)break;k=k.return}0<re.length&&(ot=new ht(ot,Wt,null,a,mt),St.push({event:ot,listeners:re}))}}if((n&7)===0){t:{if(ot=e==="mouseover"||e==="pointerover",ht=e==="mouseout"||e==="pointerout",ot&&a!==tu&&(Wt=a.relatedTarget||a.fromElement)&&(Z(Wt)||Wt[ha]))break t;if((ht||ot)&&(ot=mt.window===mt?mt:(ot=mt.ownerDocument)?ot.defaultView||ot.parentWindow:window,ht?(Wt=a.relatedTarget||a.toElement,ht=it,Wt=Wt?Z(Wt):null,Wt!==null&&(He=c(Wt),re=Wt.tag,Wt!==He||re!==5&&re!==27&&re!==6)&&(Wt=null)):(ht=null,Wt=it),ht!==Wt)){if(re=tp,_t="onMouseLeave",J="onMouseEnter",k="mouse",(e==="pointerout"||e==="pointerover")&&(re=np,_t="onPointerLeave",J="onPointerEnter",k="pointer"),He=ht==null?ot:ft(ht),nt=Wt==null?ot:ft(Wt),ot=new re(_t,k+"leave",ht,a,mt),ot.target=He,ot.relatedTarget=nt,_t=null,Z(mt)===it&&(re=new re(J,k+"enter",Wt,a,mt),re.target=nt,re.relatedTarget=He,_t=re),He=_t,ht&&Wt)e:{for(re=rS,J=ht,k=Wt,nt=0,_t=J;_t;_t=re(_t))nt++;_t=0;for(var se=k;se;se=re(se))_t++;for(;0<nt-_t;)J=re(J),nt--;for(;0<_t-nt;)k=re(k),_t--;for(;nt--;){if(J===k||k!==null&&J===k.alternate){re=J;break e}J=re(J),k=re(k)}re=null}else re=null;ht!==null&&qg(St,ot,ht,re,!1),Wt!==null&&He!==null&&qg(St,He,Wt,re,!0)}}t:{if(ot=it?ft(it):window,ht=ot.nodeName&&ot.nodeName.toLowerCase(),ht==="select"||ht==="input"&&ot.type==="file")var we=up;else if(lp(ot))if(fp)we=_x;else{we=mx;var Jt=px}else ht=ot.nodeName,!ht||ht.toLowerCase()!=="input"||ot.type!=="checkbox"&&ot.type!=="radio"?it&&$c(it.elementType)&&(we=up):we=gx;if(we&&(we=we(e,it))){cp(St,we,a,mt);break t}Jt&&Jt(e,ot,it),e==="focusout"&&it&&ot.type==="number"&&it.memoizedProps.value!=null&&hn(ot,"number",ot.value)}switch(Jt=it?ft(it):window,e){case"focusin":(lp(Jt)||Jt.contentEditable==="true")&&(Fs=Jt,du=it,to=null);break;case"focusout":to=du=Fs=null;break;case"mousedown":pu=!0;break;case"contextmenu":case"mouseup":case"dragend":pu=!1,xp(St,a,mt);break;case"selectionchange":if(xx)break;case"keydown":case"keyup":xp(St,a,mt)}var pe;if(cu)t:{switch(e){case"compositionstart":var Te="onCompositionStart";break t;case"compositionend":Te="onCompositionEnd";break t;case"compositionupdate":Te="onCompositionUpdate";break t}Te=void 0}else Bs?rp(e,a)&&(Te="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(Te="onCompositionStart");Te&&(ip&&a.locale!=="ko"&&(Bs||Te!=="onCompositionStart"?Te==="onCompositionEnd"&&Bs&&(pe=Jd()):(da=mt,au="value"in da?da.value:da.textContent,Bs=!0)),Jt=Yl(it,Te),0<Jt.length&&(Te=new ep(Te,e,null,a,mt),St.push({event:Te,listeners:Jt}),pe?Te.data=pe:(pe=op(a),pe!==null&&(Te.data=pe)))),(pe=cx?ux(e,a):fx(e,a))&&(Te=Yl(it,"onBeforeInput"),0<Te.length&&(Jt=new ep("onBeforeInput","beforeinput",null,a,mt),St.push({event:Jt,listeners:Te}),Jt.data=pe)),nS(St,e,it,a,mt)}jg(St,n)})}function Ao(e,n,a){return{instance:e,listener:n,currentTarget:a}}function Yl(e,n){for(var a=n+"Capture",o=[];e!==null;){var u=e,f=u.stateNode;if(u=u.tag,u!==5&&u!==26&&u!==27||f===null||(u=Wr(e,a),u!=null&&o.unshift(Ao(e,u,f)),u=Wr(e,n),u!=null&&o.push(Ao(e,u,f))),e.tag===3)return o;e=e.return}return[]}function rS(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function qg(e,n,a,o,u){for(var f=n._reactName,x=[];a!==null&&a!==o;){var A=a,G=A.alternate,it=A.stateNode;if(A=A.tag,G!==null&&G===o)break;A!==5&&A!==26&&A!==27||it===null||(G=it,u?(it=Wr(a,f),it!=null&&x.unshift(Ao(a,it,G))):u||(it=Wr(a,f),it!=null&&x.push(Ao(a,it,G)))),a=a.return}x.length!==0&&e.push({event:n,listeners:x})}var oS=/\r\n?/g,lS=/\u0000|\uFFFD/g;function Yg(e){return(typeof e=="string"?e:""+e).replace(oS,`
`).replace(lS,"")}function Zg(e,n){return n=Yg(n),Yg(e)===n}function Fe(e,n,a,o,u,f){switch(a){case"children":typeof o=="string"?n==="body"||n==="textarea"&&o===""||Ps(e,o):(typeof o=="number"||typeof o=="bigint")&&n!=="body"&&Ps(e,""+o);break;case"className":Oe(e,"class",o);break;case"tabIndex":Oe(e,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":Oe(e,a,o);break;case"style":Zd(e,o,f);break;case"data":if(n!=="object"){Oe(e,"data",o);break}case"src":case"href":if(o===""&&(n!=="a"||a!=="href")){e.removeAttribute(a);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(a);break}o=tl(""+o),e.setAttribute(a,o);break;case"action":case"formAction":if(typeof o=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof f=="function"&&(a==="formAction"?(n!=="input"&&Fe(e,n,"name",u.name,u,null),Fe(e,n,"formEncType",u.formEncType,u,null),Fe(e,n,"formMethod",u.formMethod,u,null),Fe(e,n,"formTarget",u.formTarget,u,null)):(Fe(e,n,"encType",u.encType,u,null),Fe(e,n,"method",u.method,u,null),Fe(e,n,"target",u.target,u,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){e.removeAttribute(a);break}o=tl(""+o),e.setAttribute(a,o);break;case"onClick":o!=null&&(e.onclick=Fi);break;case"onScroll":o!=null&&Se("scroll",e);break;case"onScrollEnd":o!=null&&Se("scrollend",e);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(s(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(s(60));e.innerHTML=a}}break;case"multiple":e.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":e.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){e.removeAttribute("xlink:href");break}a=tl(""+o),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,""+o):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":o===!0?e.setAttribute(a,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?e.setAttribute(a,o):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?e.setAttribute(a,o):e.removeAttribute(a);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?e.removeAttribute(a):e.setAttribute(a,o);break;case"popover":Se("beforetoggle",e),Se("toggle",e),Xe(e,"popover",o);break;case"xlinkActuate":ve(e,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":ve(e,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":ve(e,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":ve(e,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":ve(e,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":ve(e,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":ve(e,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":ve(e,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":ve(e,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":Xe(e,"is",o);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=zv.get(a)||a,Xe(e,a,o))}}function Hf(e,n,a,o,u,f){switch(a){case"style":Zd(e,o,f);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(s(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(s(60));e.innerHTML=a}}break;case"children":typeof o=="string"?Ps(e,o):(typeof o=="number"||typeof o=="bigint")&&Ps(e,""+o);break;case"onScroll":o!=null&&Se("scroll",e);break;case"onScrollEnd":o!=null&&Se("scrollend",e);break;case"onClick":o!=null&&(e.onclick=Fi);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!Zt.hasOwnProperty(a))t:{if(a[0]==="o"&&a[1]==="n"&&(u=a.endsWith("Capture"),n=a.slice(2,u?a.length-7:void 0),f=e[En]||null,f=f!=null?f[a]:null,typeof f=="function"&&e.removeEventListener(n,f,u),typeof o=="function")){typeof f!="function"&&f!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(n,o,u);break t}a in e?e[a]=o:o===!0?e.setAttribute(a,""):Xe(e,a,o)}}}function Cn(e,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Se("error",e),Se("load",e);var o=!1,u=!1,f;for(f in a)if(a.hasOwnProperty(f)){var x=a[f];if(x!=null)switch(f){case"src":o=!0;break;case"srcSet":u=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:Fe(e,n,f,x,a,null)}}u&&Fe(e,n,"srcSet",a.srcSet,a,null),o&&Fe(e,n,"src",a.src,a,null);return;case"input":Se("invalid",e);var A=f=x=u=null,G=null,it=null;for(o in a)if(a.hasOwnProperty(o)){var mt=a[o];if(mt!=null)switch(o){case"name":u=mt;break;case"type":x=mt;break;case"checked":G=mt;break;case"defaultChecked":it=mt;break;case"value":f=mt;break;case"defaultValue":A=mt;break;case"children":case"dangerouslySetInnerHTML":if(mt!=null)throw Error(s(137,n));break;default:Fe(e,n,o,mt,a,null)}}Pn(e,f,A,G,it,x,u,!1);return;case"select":Se("invalid",e),o=x=f=null;for(u in a)if(a.hasOwnProperty(u)&&(A=a[u],A!=null))switch(u){case"value":f=A;break;case"defaultValue":x=A;break;case"multiple":o=A;default:Fe(e,n,u,A,a,null)}n=f,a=x,e.multiple=!!o,n!=null?nn(e,!!o,n,!1):a!=null&&nn(e,!!o,a,!0);return;case"textarea":Se("invalid",e),f=u=o=null;for(x in a)if(a.hasOwnProperty(x)&&(A=a[x],A!=null))switch(x){case"value":o=A;break;case"defaultValue":u=A;break;case"children":f=A;break;case"dangerouslySetInnerHTML":if(A!=null)throw Error(s(91));break;default:Fe(e,n,x,A,a,null)}Ri(e,o,u,f);return;case"option":for(G in a)if(a.hasOwnProperty(G)&&(o=a[G],o!=null))switch(G){case"selected":e.selected=o&&typeof o!="function"&&typeof o!="symbol";break;default:Fe(e,n,G,o,a,null)}return;case"dialog":Se("beforetoggle",e),Se("toggle",e),Se("cancel",e),Se("close",e);break;case"iframe":case"object":Se("load",e);break;case"video":case"audio":for(o=0;o<To.length;o++)Se(To[o],e);break;case"image":Se("error",e),Se("load",e);break;case"details":Se("toggle",e);break;case"embed":case"source":case"link":Se("error",e),Se("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(it in a)if(a.hasOwnProperty(it)&&(o=a[it],o!=null))switch(it){case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:Fe(e,n,it,o,a,null)}return;default:if($c(n)){for(mt in a)a.hasOwnProperty(mt)&&(o=a[mt],o!==void 0&&Hf(e,n,mt,o,a,void 0));return}}for(A in a)a.hasOwnProperty(A)&&(o=a[A],o!=null&&Fe(e,n,A,o,a,null))}function cS(e,n,a,o){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var u=null,f=null,x=null,A=null,G=null,it=null,mt=null;for(ht in a){var St=a[ht];if(a.hasOwnProperty(ht)&&St!=null)switch(ht){case"checked":break;case"value":break;case"defaultValue":G=St;default:o.hasOwnProperty(ht)||Fe(e,n,ht,null,o,St)}}for(var ot in o){var ht=o[ot];if(St=a[ot],o.hasOwnProperty(ot)&&(ht!=null||St!=null))switch(ot){case"type":f=ht;break;case"name":u=ht;break;case"checked":it=ht;break;case"defaultChecked":mt=ht;break;case"value":x=ht;break;case"defaultValue":A=ht;break;case"children":case"dangerouslySetInnerHTML":if(ht!=null)throw Error(s(137,n));break;default:ht!==St&&Fe(e,n,ot,ht,o,St)}}Dn(e,x,A,G,it,mt,f,u);return;case"select":ht=x=A=ot=null;for(f in a)if(G=a[f],a.hasOwnProperty(f)&&G!=null)switch(f){case"value":break;case"multiple":ht=G;default:o.hasOwnProperty(f)||Fe(e,n,f,null,o,G)}for(u in o)if(f=o[u],G=a[u],o.hasOwnProperty(u)&&(f!=null||G!=null))switch(u){case"value":ot=f;break;case"defaultValue":A=f;break;case"multiple":x=f;default:f!==G&&Fe(e,n,u,f,o,G)}n=A,a=x,o=ht,ot!=null?nn(e,!!a,ot,!1):!!o!=!!a&&(n!=null?nn(e,!!a,n,!0):nn(e,!!a,a?[]:"",!1));return;case"textarea":ht=ot=null;for(A in a)if(u=a[A],a.hasOwnProperty(A)&&u!=null&&!o.hasOwnProperty(A))switch(A){case"value":break;case"children":break;default:Fe(e,n,A,null,o,u)}for(x in o)if(u=o[x],f=a[x],o.hasOwnProperty(x)&&(u!=null||f!=null))switch(x){case"value":ot=u;break;case"defaultValue":ht=u;break;case"children":break;case"dangerouslySetInnerHTML":if(u!=null)throw Error(s(91));break;default:u!==f&&Fe(e,n,x,u,o,f)}Os(e,ot,ht);return;case"option":for(var Wt in a)if(ot=a[Wt],a.hasOwnProperty(Wt)&&ot!=null&&!o.hasOwnProperty(Wt))switch(Wt){case"selected":e.selected=!1;break;default:Fe(e,n,Wt,null,o,ot)}for(G in o)if(ot=o[G],ht=a[G],o.hasOwnProperty(G)&&ot!==ht&&(ot!=null||ht!=null))switch(G){case"selected":e.selected=ot&&typeof ot!="function"&&typeof ot!="symbol";break;default:Fe(e,n,G,ot,o,ht)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var re in a)ot=a[re],a.hasOwnProperty(re)&&ot!=null&&!o.hasOwnProperty(re)&&Fe(e,n,re,null,o,ot);for(it in o)if(ot=o[it],ht=a[it],o.hasOwnProperty(it)&&ot!==ht&&(ot!=null||ht!=null))switch(it){case"children":case"dangerouslySetInnerHTML":if(ot!=null)throw Error(s(137,n));break;default:Fe(e,n,it,ot,o,ht)}return;default:if($c(n)){for(var He in a)ot=a[He],a.hasOwnProperty(He)&&ot!==void 0&&!o.hasOwnProperty(He)&&Hf(e,n,He,void 0,o,ot);for(mt in o)ot=o[mt],ht=a[mt],!o.hasOwnProperty(mt)||ot===ht||ot===void 0&&ht===void 0||Hf(e,n,mt,ot,o,ht);return}}for(var J in a)ot=a[J],a.hasOwnProperty(J)&&ot!=null&&!o.hasOwnProperty(J)&&Fe(e,n,J,null,o,ot);for(St in o)ot=o[St],ht=a[St],!o.hasOwnProperty(St)||ot===ht||ot==null&&ht==null||Fe(e,n,St,ot,o,ht)}function Kg(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function uS(){if(typeof performance.getEntriesByType=="function"){for(var e=0,n=0,a=performance.getEntriesByType("resource"),o=0;o<a.length;o++){var u=a[o],f=u.transferSize,x=u.initiatorType,A=u.duration;if(f&&A&&Kg(x)){for(x=0,A=u.responseEnd,o+=1;o<a.length;o++){var G=a[o],it=G.startTime;if(it>A)break;var mt=G.transferSize,St=G.initiatorType;mt&&Kg(St)&&(G=G.responseEnd,x+=mt*(G<A?1:(A-it)/(G-it)))}if(--o,n+=8*(f+x)/(u.duration/1e3),e++,10<e)break}}if(0<e)return n/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Gf=null,Vf=null;function Zl(e){return e.nodeType===9?e:e.ownerDocument}function Qg(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Jg(e,n){if(e===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&n==="foreignObject"?0:e}function kf(e,n){return e==="textarea"||e==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var Xf=null;function fS(){var e=window.event;return e&&e.type==="popstate"?e===Xf?!1:(Xf=e,!0):(Xf=null,!1)}var $g=typeof setTimeout=="function"?setTimeout:void 0,hS=typeof clearTimeout=="function"?clearTimeout:void 0,t_=typeof Promise=="function"?Promise:void 0,dS=typeof queueMicrotask=="function"?queueMicrotask:typeof t_<"u"?function(e){return t_.resolve(null).then(e).catch(pS)}:$g;function pS(e){setTimeout(function(){throw e})}function Da(e){return e==="head"}function e_(e,n){var a=n,o=0;do{var u=a.nextSibling;if(e.removeChild(a),u&&u.nodeType===8)if(a=u.data,a==="/$"||a==="/&"){if(o===0){e.removeChild(u),hr(n);return}o--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")o++;else if(a==="html")Ro(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,Ro(a);for(var f=a.firstChild;f;){var x=f.nextSibling,A=f.nodeName;f[Ka]||A==="SCRIPT"||A==="STYLE"||A==="LINK"&&f.rel.toLowerCase()==="stylesheet"||a.removeChild(f),f=x}}else a==="body"&&Ro(e.ownerDocument.body);a=u}while(a);hr(n)}function n_(e,n){var a=e;e=0;do{var o=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),o&&o.nodeType===8)if(a=o.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=o}while(a)}function jf(e){var n=e.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":jf(a),C(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function mS(e,n,a,o){for(;e.nodeType===1;){var u=a;if(e.nodeName.toLowerCase()!==n.toLowerCase()){if(!o&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(o){if(!e[Ka])switch(n){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(f=e.getAttribute("rel"),f==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(f!==u.rel||e.getAttribute("href")!==(u.href==null||u.href===""?null:u.href)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin)||e.getAttribute("title")!==(u.title==null?null:u.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(f=e.getAttribute("src"),(f!==(u.src==null?null:u.src)||e.getAttribute("type")!==(u.type==null?null:u.type)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin))&&f&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(n==="input"&&e.type==="hidden"){var f=u.name==null?null:""+u.name;if(u.type==="hidden"&&e.getAttribute("name")===f)return e}else return e;if(e=hi(e.nextSibling),e===null)break}return null}function gS(e,n,a){if(n==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=hi(e.nextSibling),e===null))return null;return e}function i_(e,n){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=hi(e.nextSibling),e===null))return null;return e}function Wf(e){return e.data==="$?"||e.data==="$~"}function qf(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function _S(e,n){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=n;else if(e.data!=="$?"||a.readyState!=="loading")n();else{var o=function(){n(),a.removeEventListener("DOMContentLoaded",o)};a.addEventListener("DOMContentLoaded",o),e._reactRetry=o}}function hi(e){for(;e!=null;e=e.nextSibling){var n=e.nodeType;if(n===1||n===3)break;if(n===8){if(n=e.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return e}var Yf=null;function a_(e){e=e.nextSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(n===0)return hi(e.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}e=e.nextSibling}return null}function s_(e){e=e.previousSibling;for(var n=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return e;n--}else a!=="/$"&&a!=="/&"||n++}e=e.previousSibling}return null}function r_(e,n,a){switch(n=Zl(a),e){case"html":if(e=n.documentElement,!e)throw Error(s(452));return e;case"head":if(e=n.head,!e)throw Error(s(453));return e;case"body":if(e=n.body,!e)throw Error(s(454));return e;default:throw Error(s(451))}}function Ro(e){for(var n=e.attributes;n.length;)e.removeAttributeNode(n[0]);C(e)}var di=new Map,o_=new Set;function Kl(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var ea=Y.d;Y.d={f:vS,r:xS,D:SS,C:yS,L:MS,m:ES,X:TS,S:bS,M:AS};function vS(){var e=ea.f(),n=Gl();return e||n}function xS(e){var n=ct(e);n!==null&&n.tag===5&&n.type==="form"?bm(n):ea.r(e)}var cr=typeof document>"u"?null:document;function l_(e,n,a){var o=cr;if(o&&typeof n=="string"&&n){var u=Ee(n);u='link[rel="'+e+'"][href="'+u+'"]',typeof a=="string"&&(u+='[crossorigin="'+a+'"]'),o_.has(u)||(o_.add(u),e={rel:e,crossOrigin:a,href:n},o.querySelector(u)===null&&(n=o.createElement("link"),Cn(n,"link",e),bt(n),o.head.appendChild(n)))}}function SS(e){ea.D(e),l_("dns-prefetch",e,null)}function yS(e,n){ea.C(e,n),l_("preconnect",e,n)}function MS(e,n,a){ea.L(e,n,a);var o=cr;if(o&&e&&n){var u='link[rel="preload"][as="'+Ee(n)+'"]';n==="image"&&a&&a.imageSrcSet?(u+='[imagesrcset="'+Ee(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(u+='[imagesizes="'+Ee(a.imageSizes)+'"]')):u+='[href="'+Ee(e)+'"]';var f=u;switch(n){case"style":f=ur(e);break;case"script":f=fr(e)}di.has(f)||(e=v({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:e,as:n},a),di.set(f,e),o.querySelector(u)!==null||n==="style"&&o.querySelector(Co(f))||n==="script"&&o.querySelector(wo(f))||(n=o.createElement("link"),Cn(n,"link",e),bt(n),o.head.appendChild(n)))}}function ES(e,n){ea.m(e,n);var a=cr;if(a&&e){var o=n&&typeof n.as=="string"?n.as:"script",u='link[rel="modulepreload"][as="'+Ee(o)+'"][href="'+Ee(e)+'"]',f=u;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":f=fr(e)}if(!di.has(f)&&(e=v({rel:"modulepreload",href:e},n),di.set(f,e),a.querySelector(u)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(wo(f)))return}o=a.createElement("link"),Cn(o,"link",e),bt(o),a.head.appendChild(o)}}}function bS(e,n,a){ea.S(e,n,a);var o=cr;if(o&&e){var u=Q(o).hoistableStyles,f=ur(e);n=n||"default";var x=u.get(f);if(!x){var A={loading:0,preload:null};if(x=o.querySelector(Co(f)))A.loading=5;else{e=v({rel:"stylesheet",href:e,"data-precedence":n},a),(a=di.get(f))&&Zf(e,a);var G=x=o.createElement("link");bt(G),Cn(G,"link",e),G._p=new Promise(function(it,mt){G.onload=it,G.onerror=mt}),G.addEventListener("load",function(){A.loading|=1}),G.addEventListener("error",function(){A.loading|=2}),A.loading|=4,Ql(x,n,o)}x={type:"stylesheet",instance:x,count:1,state:A},u.set(f,x)}}}function TS(e,n){ea.X(e,n);var a=cr;if(a&&e){var o=Q(a).hoistableScripts,u=fr(e),f=o.get(u);f||(f=a.querySelector(wo(u)),f||(e=v({src:e,async:!0},n),(n=di.get(u))&&Kf(e,n),f=a.createElement("script"),bt(f),Cn(f,"link",e),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},o.set(u,f))}}function AS(e,n){ea.M(e,n);var a=cr;if(a&&e){var o=Q(a).hoistableScripts,u=fr(e),f=o.get(u);f||(f=a.querySelector(wo(u)),f||(e=v({src:e,async:!0,type:"module"},n),(n=di.get(u))&&Kf(e,n),f=a.createElement("script"),bt(f),Cn(f,"link",e),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},o.set(u,f))}}function c_(e,n,a,o){var u=(u=xt.current)?Kl(u):null;if(!u)throw Error(s(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(n=ur(a.href),a=Q(u).hoistableStyles,o=a.get(n),o||(o={type:"style",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=ur(a.href);var f=Q(u).hoistableStyles,x=f.get(e);if(x||(u=u.ownerDocument||u,x={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},f.set(e,x),(f=u.querySelector(Co(e)))&&!f._p&&(x.instance=f,x.state.loading=5),di.has(e)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},di.set(e,a),f||RS(u,e,a,x.state))),n&&o===null)throw Error(s(528,""));return x}if(n&&o!==null)throw Error(s(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(n=fr(a),a=Q(u).hoistableScripts,o=a.get(n),o||(o={type:"script",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(s(444,e))}}function ur(e){return'href="'+Ee(e)+'"'}function Co(e){return'link[rel="stylesheet"]['+e+"]"}function u_(e){return v({},e,{"data-precedence":e.precedence,precedence:null})}function RS(e,n,a,o){e.querySelector('link[rel="preload"][as="style"]['+n+"]")?o.loading=1:(n=e.createElement("link"),o.preload=n,n.addEventListener("load",function(){return o.loading|=1}),n.addEventListener("error",function(){return o.loading|=2}),Cn(n,"link",a),bt(n),e.head.appendChild(n))}function fr(e){return'[src="'+Ee(e)+'"]'}function wo(e){return"script[async]"+e}function f_(e,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var o=e.querySelector('style[data-href~="'+Ee(a.href)+'"]');if(o)return n.instance=o,bt(o),o;var u=v({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return o=(e.ownerDocument||e).createElement("style"),bt(o),Cn(o,"style",u),Ql(o,a.precedence,e),n.instance=o;case"stylesheet":u=ur(a.href);var f=e.querySelector(Co(u));if(f)return n.state.loading|=4,n.instance=f,bt(f),f;o=u_(a),(u=di.get(u))&&Zf(o,u),f=(e.ownerDocument||e).createElement("link"),bt(f);var x=f;return x._p=new Promise(function(A,G){x.onload=A,x.onerror=G}),Cn(f,"link",o),n.state.loading|=4,Ql(f,a.precedence,e),n.instance=f;case"script":return f=fr(a.src),(u=e.querySelector(wo(f)))?(n.instance=u,bt(u),u):(o=a,(u=di.get(f))&&(o=v({},a),Kf(o,u)),e=e.ownerDocument||e,u=e.createElement("script"),bt(u),Cn(u,"link",o),e.head.appendChild(u),n.instance=u);case"void":return null;default:throw Error(s(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(o=n.instance,n.state.loading|=4,Ql(o,a.precedence,e));return n.instance}function Ql(e,n,a){for(var o=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),u=o.length?o[o.length-1]:null,f=u,x=0;x<o.length;x++){var A=o[x];if(A.dataset.precedence===n)f=A;else if(f!==u)break}f?f.parentNode.insertBefore(e,f.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(e,n.firstChild))}function Zf(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.title==null&&(e.title=n.title)}function Kf(e,n){e.crossOrigin==null&&(e.crossOrigin=n.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=n.referrerPolicy),e.integrity==null&&(e.integrity=n.integrity)}var Jl=null;function h_(e,n,a){if(Jl===null){var o=new Map,u=Jl=new Map;u.set(a,o)}else u=Jl,o=u.get(a),o||(o=new Map,u.set(a,o));if(o.has(e))return o;for(o.set(e,null),a=a.getElementsByTagName(e),u=0;u<a.length;u++){var f=a[u];if(!(f[Ka]||f[rn]||e==="link"&&f.getAttribute("rel")==="stylesheet")&&f.namespaceURI!=="http://www.w3.org/2000/svg"){var x=f.getAttribute(n)||"";x=e+x;var A=o.get(x);A?A.push(f):o.set(x,[f])}}return o}function d_(e,n,a){e=e.ownerDocument||e,e.head.insertBefore(a,n==="title"?e.querySelector("head > title"):null)}function CS(e,n,a){if(a===1||n.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;switch(n.rel){case"stylesheet":return e=n.disabled,typeof n.precedence=="string"&&e==null;default:return!0}case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function p_(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function wS(e,n,a,o){if(a.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var u=ur(o.href),f=n.querySelector(Co(u));if(f){n=f._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(e.count++,e=$l.bind(e),n.then(e,e)),a.state.loading|=4,a.instance=f,bt(f);return}f=n.ownerDocument||n,o=u_(o),(u=di.get(u))&&Zf(o,u),f=f.createElement("link"),bt(f);var x=f;x._p=new Promise(function(A,G){x.onload=A,x.onerror=G}),Cn(f,"link",o),a.instance=f}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=$l.bind(e),n.addEventListener("load",a),n.addEventListener("error",a))}}var Qf=0;function DS(e,n){return e.stylesheets&&e.count===0&&ec(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var o=setTimeout(function(){if(e.stylesheets&&ec(e,e.stylesheets),e.unsuspend){var f=e.unsuspend;e.unsuspend=null,f()}},6e4+n);0<e.imgBytes&&Qf===0&&(Qf=62500*uS());var u=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&ec(e,e.stylesheets),e.unsuspend)){var f=e.unsuspend;e.unsuspend=null,f()}},(e.imgBytes>Qf?50:800)+n);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(o),clearTimeout(u)}}:null}function $l(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)ec(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var tc=null;function ec(e,n){e.stylesheets=null,e.unsuspend!==null&&(e.count++,tc=new Map,n.forEach(US,e),tc=null,$l.call(e))}function US(e,n){if(!(n.state.loading&4)){var a=tc.get(e);if(a)var o=a.get(null);else{a=new Map,tc.set(e,a);for(var u=e.querySelectorAll("link[data-precedence],style[data-precedence]"),f=0;f<u.length;f++){var x=u[f];(x.nodeName==="LINK"||x.getAttribute("media")!=="not all")&&(a.set(x.dataset.precedence,x),o=x)}o&&a.set(null,o)}u=n.instance,x=u.getAttribute("data-precedence"),f=a.get(x)||o,f===o&&a.set(null,u),a.set(x,u),this.count++,o=$l.bind(this),u.addEventListener("load",o),u.addEventListener("error",o),f?f.parentNode.insertBefore(u,f.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(u,e.firstChild)),n.state.loading|=4}}var Do={$$typeof:R,Provider:null,Consumer:null,_currentValue:q,_currentValue2:q,_threadCount:0};function NS(e,n,a,o,u,f,x,A,G){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Re(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Re(0),this.hiddenUpdates=Re(null),this.identifierPrefix=o,this.onUncaughtError=u,this.onCaughtError=f,this.onRecoverableError=x,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=G,this.incompleteTransitions=new Map}function m_(e,n,a,o,u,f,x,A,G,it,mt,St){return e=new NS(e,n,a,x,G,it,mt,St,A),n=1,f===!0&&(n|=24),f=Kn(3,null,null,n),e.current=f,f.stateNode=e,n=wu(),n.refCount++,e.pooledCache=n,n.refCount++,f.memoizedState={element:o,isDehydrated:a,cache:n},Lu(f),e}function g_(e){return e?(e=Vs,e):Vs}function __(e,n,a,o,u,f){u=g_(u),o.context===null?o.context=u:o.pendingContext=u,o=xa(n),o.payload={element:a},f=f===void 0?null:f,f!==null&&(o.callback=f),a=Sa(e,o,n),a!==null&&(kn(a,e,n),oo(a,e,n))}function v_(e,n){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<n?a:n}}function Jf(e,n){v_(e,n),(e=e.alternate)&&v_(e,n)}function x_(e){if(e.tag===13||e.tag===31){var n=es(e,67108864);n!==null&&kn(n,e,67108864),Jf(e,67108864)}}function S_(e){if(e.tag===13||e.tag===31){var n=ei();n=Ns(n);var a=es(e,n);a!==null&&kn(a,e,n),Jf(e,n)}}var nc=!0;function LS(e,n,a,o){var u=I.T;I.T=null;var f=Y.p;try{Y.p=2,$f(e,n,a,o)}finally{Y.p=f,I.T=u}}function OS(e,n,a,o){var u=I.T;I.T=null;var f=Y.p;try{Y.p=8,$f(e,n,a,o)}finally{Y.p=f,I.T=u}}function $f(e,n,a,o){if(nc){var u=th(o);if(u===null)Ff(e,n,o,ic,a),M_(e,o);else if(zS(u,e,n,a,o))o.stopPropagation();else if(M_(e,o),n&4&&-1<PS.indexOf(e)){for(;u!==null;){var f=ct(u);if(f!==null)switch(f.tag){case 3:if(f=f.stateNode,f.current.memoizedState.isDehydrated){var x=At(f.pendingLanes);if(x!==0){var A=f;for(A.pendingLanes|=2,A.entangledLanes|=2;x;){var G=1<<31-Ht(x);A.entanglements[1]|=G,x&=~G}Ui(f),(Ne&6)===0&&(Fl=T()+500,bo(0))}}break;case 31:case 13:A=es(f,2),A!==null&&kn(A,f,2),Gl(),Jf(f,2)}if(f=th(o),f===null&&Ff(e,n,o,ic,a),f===u)break;u=f}u!==null&&o.stopPropagation()}else Ff(e,n,o,null,a)}}function th(e){return e=eu(e),eh(e)}var ic=null;function eh(e){if(ic=null,e=Z(e),e!==null){var n=c(e);if(n===null)e=null;else{var a=n.tag;if(a===13){if(e=h(n),e!==null)return e;e=null}else if(a===31){if(e=d(n),e!==null)return e;e=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;e=null}else n!==e&&(e=null)}}return ic=e,null}function y_(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(at()){case gt:return 2;case Tt:return 8;case pt:case ee:return 32;case Nt:return 268435456;default:return 32}default:return 32}}var nh=!1,Ua=null,Na=null,La=null,Uo=new Map,No=new Map,Oa=[],PS="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function M_(e,n){switch(e){case"focusin":case"focusout":Ua=null;break;case"dragenter":case"dragleave":Na=null;break;case"mouseover":case"mouseout":La=null;break;case"pointerover":case"pointerout":Uo.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":No.delete(n.pointerId)}}function Lo(e,n,a,o,u,f){return e===null||e.nativeEvent!==f?(e={blockedOn:n,domEventName:a,eventSystemFlags:o,nativeEvent:f,targetContainers:[u]},n!==null&&(n=ct(n),n!==null&&x_(n)),e):(e.eventSystemFlags|=o,n=e.targetContainers,u!==null&&n.indexOf(u)===-1&&n.push(u),e)}function zS(e,n,a,o,u){switch(n){case"focusin":return Ua=Lo(Ua,e,n,a,o,u),!0;case"dragenter":return Na=Lo(Na,e,n,a,o,u),!0;case"mouseover":return La=Lo(La,e,n,a,o,u),!0;case"pointerover":var f=u.pointerId;return Uo.set(f,Lo(Uo.get(f)||null,e,n,a,o,u)),!0;case"gotpointercapture":return f=u.pointerId,No.set(f,Lo(No.get(f)||null,e,n,a,o,u)),!0}return!1}function E_(e){var n=Z(e.target);if(n!==null){var a=c(n);if(a!==null){if(n=a.tag,n===13){if(n=h(a),n!==null){e.blockedOn=n,Xr(e.priority,function(){S_(a)});return}}else if(n===31){if(n=d(a),n!==null){e.blockedOn=n,Xr(e.priority,function(){S_(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function ac(e){if(e.blockedOn!==null)return!1;for(var n=e.targetContainers;0<n.length;){var a=th(e.nativeEvent);if(a===null){a=e.nativeEvent;var o=new a.constructor(a.type,a);tu=o,a.target.dispatchEvent(o),tu=null}else return n=ct(a),n!==null&&x_(n),e.blockedOn=a,!1;n.shift()}return!0}function b_(e,n,a){ac(e)&&a.delete(n)}function IS(){nh=!1,Ua!==null&&ac(Ua)&&(Ua=null),Na!==null&&ac(Na)&&(Na=null),La!==null&&ac(La)&&(La=null),Uo.forEach(b_),No.forEach(b_)}function sc(e,n){e.blockedOn===n&&(e.blockedOn=null,nh||(nh=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,IS)))}var rc=null;function T_(e){rc!==e&&(rc=e,r.unstable_scheduleCallback(r.unstable_NormalPriority,function(){rc===e&&(rc=null);for(var n=0;n<e.length;n+=3){var a=e[n],o=e[n+1],u=e[n+2];if(typeof o!="function"){if(eh(o||a)===null)continue;break}var f=ct(a);f!==null&&(e.splice(n,3),n-=3,$u(f,{pending:!0,data:u,method:a.method,action:o},o,u))}}))}function hr(e){function n(G){return sc(G,e)}Ua!==null&&sc(Ua,e),Na!==null&&sc(Na,e),La!==null&&sc(La,e),Uo.forEach(n),No.forEach(n);for(var a=0;a<Oa.length;a++){var o=Oa[a];o.blockedOn===e&&(o.blockedOn=null)}for(;0<Oa.length&&(a=Oa[0],a.blockedOn===null);)E_(a),a.blockedOn===null&&Oa.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(o=0;o<a.length;o+=3){var u=a[o],f=a[o+1],x=u[En]||null;if(typeof f=="function")x||T_(a);else if(x){var A=null;if(f&&f.hasAttribute("formAction")){if(u=f,x=f[En]||null)A=x.formAction;else if(eh(u)!==null)continue}else A=x.action;typeof A=="function"?a[o+1]=A:(a.splice(o,3),o-=3),T_(a)}}}function A_(){function e(f){f.canIntercept&&f.info==="react-transition"&&f.intercept({handler:function(){return new Promise(function(x){return u=x})},focusReset:"manual",scroll:"manual"})}function n(){u!==null&&(u(),u=null),o||setTimeout(a,20)}function a(){if(!o&&!navigation.transition){var f=navigation.currentEntry;f&&f.url!=null&&navigation.navigate(f.url,{state:f.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,u=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){o=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),u!==null&&(u(),u=null)}}}function ih(e){this._internalRoot=e}oc.prototype.render=ih.prototype.render=function(e){var n=this._internalRoot;if(n===null)throw Error(s(409));var a=n.current,o=ei();__(a,o,e,n,null,null)},oc.prototype.unmount=ih.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var n=e.containerInfo;__(e.current,2,null,e,null,null),Gl(),n[ha]=null}};function oc(e){this._internalRoot=e}oc.prototype.unstable_scheduleHydration=function(e){if(e){var n=Za();e={blockedOn:null,target:e,priority:n};for(var a=0;a<Oa.length&&n!==0&&n<Oa[a].priority;a++);Oa.splice(a,0,e),a===0&&E_(e)}};var R_=t.version;if(R_!=="19.2.8")throw Error(s(527,R_,"19.2.8"));Y.findDOMNode=function(e){var n=e._reactInternals;if(n===void 0)throw typeof e.render=="function"?Error(s(188)):(e=Object.keys(e).join(","),Error(s(268,e)));return e=p(n),e=e!==null?_(e):null,e=e===null?null:e.stateNode,e};var BS={bundleType:0,version:"19.2.8",rendererPackageName:"react-dom",currentDispatcherRef:I,reconcilerVersion:"19.2.8"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var lc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!lc.isDisabled&&lc.supportsFiber)try{Ct=lc.inject(BS),Lt=lc}catch{}}return Po.createRoot=function(e,n){if(!l(e))throw Error(s(299));var a=!1,o="",u=Om,f=Pm,x=zm;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onUncaughtError!==void 0&&(u=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(x=n.onRecoverableError)),n=m_(e,1,!1,null,null,a,o,null,u,f,x,A_),e[ha]=n.current,Bf(e),new ih(n)},Po.hydrateRoot=function(e,n,a){if(!l(e))throw Error(s(299));var o=!1,u="",f=Om,x=Pm,A=zm,G=null;return a!=null&&(a.unstable_strictMode===!0&&(o=!0),a.identifierPrefix!==void 0&&(u=a.identifierPrefix),a.onUncaughtError!==void 0&&(f=a.onUncaughtError),a.onCaughtError!==void 0&&(x=a.onCaughtError),a.onRecoverableError!==void 0&&(A=a.onRecoverableError),a.formState!==void 0&&(G=a.formState)),n=m_(e,1,!0,n,a??null,o,u,G,f,x,A,A_),n.context=g_(null),a=n.current,o=ei(),o=Ns(o),u=xa(o),u.callback=null,Sa(a,u,o),a=o,n.current.lanes=a,On(n,a),Ui(n),e[ha]=n.current,Bf(e),new oc(n)},Po.version="19.2.8",Po}var I_;function YS(){if(I_)return rh.exports;I_=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(t){console.error(t)}}return r(),rh.exports=qS(),rh.exports}var ZS=YS();async function ws(r){if(!r.ok){let t=r.statusText;try{const i=await r.json();t=typeof i.detail=="string"?i.detail:JSON.stringify(i.detail??i)}catch{}throw new Error(t||`HTTP ${r.status}`)}return r.json()}async function KS(r){const t=new FormData;return t.append("file",r),ws(await fetch("/api/models",{method:"POST",body:t}))}async function QS(){return ws(await fetch("/api/models/samples"))}async function JS(r){return ws(await fetch(`/api/models/samples/${encodeURIComponent(r)}`,{method:"POST"}))}async function $S(r){return ws(await fetch(`/api/models/${r}/mesh`))}function B_(r,t,i,s,l,c={}){return{header:r,inspector:t,inspected_at:new Date().toISOString(),extra:c,characteristics:i.map(h=>{const d=s[h.id],m=d!==void 0&&d.trim()!==""&&Number.isFinite(Number(d))?Number(d):null;return{characteristic_id:h.id,feature_name:h.feature_name,kind:h.kind,type_label:h.type_label,requirement:h.requirement,datum_refs:h.datum_refs,nominal:h.nominal,usl:h.usl,lsl:h.lsl,unit:h.unit,actual:m,nonconformance_number:l[h.id]??""}})}}async function ty(r){return ws(await fetch("/api/sessions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}))}async function ey(r,t,i){const s=i?await fetch(`/api/sessions/${i}/export?format=${t}`):await fetch(`/api/export/as9102-form3?format=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!s.ok){let m=s.statusText;try{m=(await s.json()).detail??m}catch{}throw new Error(typeof m=="string"?m:JSON.stringify(m))}const l=await s.blob(),c=s.headers.get("Content-Disposition")??"",h=/filename="([^"]+)"/.exec(c),d=document.createElement("a");d.href=URL.createObjectURL(l),d.download=(h==null?void 0:h[1])??`AS9102_Form3.${t}`,document.body.appendChild(d),d.click(),d.remove(),setTimeout(()=>URL.revokeObjectURL(d.href),2e3)}async function ny(r){return ws(await fetch(`/api/models/${r}/metadata`))}async function iy(r,t){return ws(await fetch(`/api/models/${r}/pmi`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}))}async function ay(r,t){const i=await fetch(`/api/models/${r}/file`);if(!i.ok)throw new Error(`HTTP ${i.status}`);const s=await i.blob(),l=document.createElement("a");l.href=URL.createObjectURL(s),l.download=t,document.body.appendChild(l),l.click(),l.remove(),setTimeout(()=>URL.revokeObjectURL(l.href),2e3)}async function sy(r,t){const i=await fetch(`/api/models/${r}/metadata`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!i.ok){let d=i.statusText;try{d=(await i.json()).detail??d}catch{}throw new Error(typeof d=="string"?d:JSON.stringify(d))}const s=await i.blob(),l=i.headers.get("Content-Disposition")??"",c=/filename="([^"]+)"/.exec(l),h=document.createElement("a");h.href=URL.createObjectURL(s),h.download=(c==null?void 0:c[1])??"model.step",document.body.appendChild(h),h.click(),h.remove(),setTimeout(()=>URL.revokeObjectURL(h.href),2e3)}const F_=["Diameter","Radius","Spherical Diameter","Spherical Radius","Linear Distance","Angular","Thickness"],uh=["Flatness","Straightness","Circularity","Cylindricity","Profile of Line","Profile of Surface","Angularity","Perpendicularity","Parallelism","Position","Concentricity","Coaxiality","Symmetry","Circular Runout","Total Runout"],zo=[{key:"x",i:0},{key:"y",i:1},{key:"z",i:2}];function cc(r,t){if(r.kind==="vertex"){const d=t.vertices.find(m=>m.vertex_id===r.ref_id);return d?d.point:null}if(r.kind==="face"){const d=t.face_ranges.find(S=>S.face_id===r.ref_id);if(!d||!d.index_count)return null;const m=new Set(t.indices.slice(d.index_start,d.index_start+d.index_count));let p=0,_=0,v=0;for(const S of m)p+=t.positions[S*3],_+=t.positions[S*3+1],v+=t.positions[S*3+2];return[p/m.size,_/m.size,v/m.size]}const i=t.edges.find(d=>d.edge_id===r.ref_id);if(!i||!i.points.length)return null;const s=i.points.length/3;let l=0,c=0,h=0;for(let d=0;d<s;d++)l+=i.points[d*3],c+=i.points[d*3+1],h+=i.points[d*3+2];return[l/s,c/s,h/s]}function ry({model:r,mesh:t,pickedRefs:i,pickTarget:s,onPickTargetChange:l,onClose:c,onAdded:h,onClearPicks:d}){const[m,p]=Vt.useState("geom_tolerance"),[_,v]=Vt.useState(uh[0]),[S,M]=Vt.useState(""),[b,E]=Vt.useState("0"),[y,g]=Vt.useState(""),[B,R]=Vt.useState(""),[w,V]=Vt.useState("0.1"),[F,L]=Vt.useState([]),[X,U]=Vt.useState("x"),[D,z]=Vt.useState(!1),[lt,st]=Vt.useState(null),dt=m==="dimension"?F_:uh,et=i.length>=1&&(m==="dimension"?b.trim()!=="":w.trim()!==""),I=m==="dimension"&&_==="Linear Distance";Vt.useEffect(()=>{if(!I||!t||i.length!==2)return;const $=cc(i[0],t),rt=cc(i[1],t);if(!$||!rt)return;const N=zo.map(({i:W})=>Math.abs($[W]-rt[W]));U(W=>N[zo.findIndex(vt=>vt.key===W)]>1e-6?W:zo[N.indexOf(Math.max(...N))].key)},[I,t,i]),Vt.useEffect(()=>{if(!I||!t||i.length!==2)return;const $=cc(i[0],t),rt=cc(i[1],t);if(!$||!rt)return;const N=zo.find(W=>W.key===X).i;E(Math.abs($[N]-rt[N]).toFixed(3))},[I,t,i,X]);const Y=$=>L(rt=>rt.includes($)?rt.filter(N=>N!==$):[...rt,$]),q=async()=>{z(!0),st(null);try{const $=await iy(r.model_id,{kind:m,type_label:_,feature_name:S.trim(),refs:i,nominal:m==="dimension"&&Number(b)||0,usl:m==="dimension"&&y.trim()!==""?Number(y):null,lsl:m==="dimension"&&B.trim()!==""?Number(B):null,value:m==="geom_tolerance"?Number(w)||0:null,datum_refs:F});d(),h($)}catch($){st($ instanceof Error?$.message:String($))}finally{z(!1)}};return H.jsx("div",{className:"fixed right-4 top-16 z-40 max-h-[85vh] w-96 overflow-auto rounded-lg border border-slate-700 bg-slate-900 shadow-xl",children:H.jsxs("div",{children:[H.jsxs("div",{className:"flex items-center justify-between border-b border-slate-800 px-4 py-3",children:[H.jsxs("div",{children:[H.jsx("h2",{className:"text-base font-semibold text-slate-100",children:"Add GD&T Characteristic"}),H.jsx("p",{className:"text-xs text-slate-400",children:"Writes a new dimension or geometric tolerance into the model's STEP file."})]}),H.jsx("button",{onClick:c,className:"rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200","aria-label":"Close",children:"✕"})]}),H.jsxs("div",{className:"space-y-4 p-4",children:[H.jsxs("section",{className:"rounded border border-slate-700 p-3",children:[H.jsx("div",{className:"text-xs font-medium text-slate-300",children:"Vertex(es) / edge(s) / face(s)"}),H.jsx("p",{className:"mt-0.5 text-xs text-slate-400",children:"Click a vertex (the small dots at corners/hole centers), an edge or a face on the model in the 3D view to pick it (a 2nd click picks a second one, for a two-reference location dimension). Hover shows a preview in blue before you click. Use the Front/Top/Right… buttons (top-right of the 3D view) to look straight along an axis if a target is hard to hit."}),H.jsx("div",{className:"mt-2 flex gap-1",children:["auto","vertex","edge","face"].map($=>H.jsx("button",{onClick:()=>l($),className:`rounded px-2 py-0.5 text-xs ${s===$?"bg-blue-600 text-white":"border border-slate-700 text-slate-300 hover:bg-slate-800"}`,title:$==="auto"?"A nearby vertex wins, then a nearby edge, otherwise the face":$==="vertex"?"Only vertices can be picked":$==="edge"?"Only edges can be picked":"Only faces can be picked",children:$==="auto"?"Auto":$==="vertex"?"Vertices only":$==="edge"?"Edges only":"Faces only"},$))}),H.jsxs("div",{className:"mt-2 flex flex-wrap gap-1",children:[i.length===0&&H.jsx("span",{className:"text-xs text-amber-400",children:"Nothing picked yet"}),i.map($=>H.jsxs("span",{className:"rounded bg-amber-900/60 px-2 py-0.5 text-xs text-amber-300",children:[$.kind," ",$.ref_id]},`${$.kind}-${$.ref_id}`)),i.length>0&&H.jsx("button",{onClick:d,className:"text-xs text-slate-400 underline",children:"clear"})]})]}),H.jsxs("label",{className:"block",children:[H.jsx("span",{className:"text-xs text-slate-300",children:"Kind"}),H.jsxs("select",{value:m,onChange:$=>{const rt=$.target.value;p(rt),v(rt==="dimension"?F_[0]:uh[0])},className:"mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100",children:[H.jsx("option",{value:"geom_tolerance",children:"Geometric tolerance"}),H.jsx("option",{value:"dimension",children:"Dimension"})]})]}),H.jsxs("label",{className:"block",children:[H.jsx("span",{className:"text-xs text-slate-300",children:"Type"}),H.jsx("select",{value:_,onChange:$=>v($.target.value),className:"mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100",children:dt.map($=>H.jsx("option",{value:$,children:$},$))})]}),H.jsxs("label",{className:"block",children:[H.jsx("span",{className:"text-xs text-slate-300",children:"Feature name (optional)"}),H.jsx("input",{value:S,onChange:$=>M($.target.value),className:"mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100"})]}),I&&i.length===2&&H.jsxs("div",{className:"rounded border border-slate-700 bg-slate-800/50 p-2",children:[H.jsxs("div",{className:"flex items-center gap-2",children:[H.jsx("span",{className:"text-xs text-slate-300",children:"Axis"}),zo.map(({key:$})=>H.jsx("button",{onClick:()=>U($),className:`rounded px-2 py-0.5 text-xs uppercase ${X===$?"bg-blue-600 text-white":"border border-slate-700 text-slate-300 hover:bg-slate-700"}`,children:$},$))]}),H.jsxs("p",{className:"mt-1 text-[11px] text-slate-500",children:["Nominal below is the distance between the two picked refs along this axis",i.every($=>$.kind==="vertex")?" (exact, both are vertices)":" (an estimate - pick vertices instead of faces/edges for an exact point-to-point distance)","- edit it if it's not quite what you meant."]})]}),m==="dimension"?H.jsxs("div",{className:"grid grid-cols-3 gap-2",children:[H.jsxs("label",{className:"block",children:[H.jsx("span",{className:"text-xs text-slate-300",children:"Nominal"}),H.jsx("input",{value:b,onChange:$=>E($.target.value),className:"mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100"})]}),H.jsxs("label",{className:"block",children:[H.jsx("span",{className:"text-xs text-slate-300",children:"LSL"}),H.jsx("input",{value:B,onChange:$=>R($.target.value),placeholder:"optional",className:"mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100"})]}),H.jsxs("label",{className:"block",children:[H.jsx("span",{className:"text-xs text-slate-300",children:"USL"}),H.jsx("input",{value:y,onChange:$=>g($.target.value),placeholder:"optional",className:"mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100"})]})]}):H.jsxs("label",{className:"block w-32",children:[H.jsx("span",{className:"text-xs text-slate-300",children:"Zone value"}),H.jsx("input",{value:w,onChange:$=>V($.target.value),className:"mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100"})]}),r.datums.length>0&&H.jsxs("div",{children:[H.jsx("span",{className:"text-xs text-slate-300",children:"Datum reference(s) (must already exist on this model)"}),H.jsx("div",{className:"mt-1 flex flex-wrap gap-2",children:r.datums.map($=>H.jsxs("label",{className:"flex items-center gap-1 rounded border border-slate-700 px-2 py-1 text-xs text-slate-200",children:[H.jsx("input",{type:"checkbox",checked:F.includes($.label),onChange:()=>Y($.label)}),$.label]},$.label))})]}),lt&&H.jsx("p",{className:"text-sm text-red-400",children:lt})]}),H.jsxs("div",{className:"flex justify-end gap-2 border-t border-slate-800 px-4 py-3",children:[H.jsx("button",{onClick:c,className:"rounded border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800",children:"Close"}),H.jsx("button",{onClick:q,disabled:D||!et,className:"rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50",children:D?"Writing…":"Add to model"})]})]})})}function za({label:r,value:t,onChange:i,required:s,placeholder:l}){return H.jsxs("label",{className:"block",children:[H.jsxs("span",{className:"text-[10px] uppercase tracking-wide text-slate-400",children:[r,s&&H.jsx("span",{className:"text-red-400",children:" *"})]}),H.jsx("input",{value:t,placeholder:l,onChange:c=>i(c.target.value),className:`mt-0.5 w-full rounded border bg-slate-800 px-2 py-1 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none ${s&&!t?"border-red-500/60":"border-slate-700"}`})]})}function oy({header:r,inspector:t,onHeader:i,onInspector:s}){const l=h=>d=>i({...r,[h]:d}),c=h=>d=>s({...t,[h]:d});return H.jsxs("div",{className:"grid grid-cols-4 gap-2 border-b border-slate-800 bg-slate-900 p-3",children:[H.jsx(za,{label:"1. Part number",value:r.part_number,onChange:l("part_number"),required:!0}),H.jsx(za,{label:"2. Part name",value:r.part_name,onChange:l("part_name")}),H.jsx(za,{label:"3. Serial number",value:r.serial_number,onChange:l("serial_number")}),H.jsx(za,{label:"4. FAI report no.",value:r.fai_report_number,onChange:l("fai_report_number")}),H.jsx(za,{label:"Drawing / model rev.",value:r.drawing_revision,onChange:l("drawing_revision")}),H.jsx(za,{label:"Inspector name",value:t.name,onChange:c("name"),required:!0}),H.jsx(za,{label:"Inspector ID",value:t.inspector_id,onChange:c("inspector_id")}),H.jsx(za,{label:"Instrument / tooling",value:t.instrument,onChange:c("instrument"),placeholder:"CMM, calipers…"}),H.jsxs("label",{className:"col-span-4 block",children:[H.jsx("span",{className:"text-[10px] uppercase tracking-wide text-slate-400",children:"Notes"}),H.jsx("input",{value:t.notes,onChange:h=>c("notes")(h.target.value),className:"mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"})]})]})}const ly=()=>new Date().toISOString().slice(0,10);function cy({modelId:r,fileName:t,onClose:i}){const[s,l]=Vt.useState(null),[c,h]=Vt.useState(!0),[d,m]=Vt.useState(null),[p,_]=Vt.useState(!1),[v,S]=Vt.useState(!1),[M,b]=Vt.useState(!0),[E,y]=Vt.useState(""),[g,B]=Vt.useState(!0),[R,w]=Vt.useState("approved"),[V,F]=Vt.useState(""),[L,X]=Vt.useState(""),[U,D]=Vt.useState("approver"),[z,lt]=Vt.useState(ly());Vt.useEffect(()=>{ny(r).then(et=>{l(et);const I=et.revisions.find(Y=>Y);I&&y(I),et.approval&&(w(et.approval.status),F(et.approval.approver_name),X(et.approval.approver_org),D(et.approval.role||"approver"),et.approval.date&&lt(et.approval.date))}).catch(et=>m(et instanceof Error?et.message:String(et))).finally(()=>h(!1))},[r]);const st=M&&E.trim()||g&&V.trim(),dt=async()=>{_(!0),m(null),S(!1);try{await sy(r,{revision:M?E.trim():void 0,approval:g?{status:R,approver_name:V.trim(),approver_org:L.trim(),role:U.trim()||"approver",date:z}:void 0}),S(!0)}catch(et){m(et instanceof Error?et.message:String(et))}finally{_(!1)}};return H.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",onClick:i,children:H.jsxs("div",{className:"max-h-[85vh] w-full max-w-lg overflow-auto rounded-lg bg-slate-900 shadow-xl ring-1 ring-slate-700",onClick:et=>et.stopPropagation(),children:[H.jsxs("div",{className:"flex items-center justify-between border-b border-slate-800 px-4 py-3",children:[H.jsxs("div",{children:[H.jsx("h2",{className:"text-base font-semibold text-slate-100",children:"STEP Metadata"}),H.jsx("p",{className:"text-xs text-slate-400",children:t})]}),H.jsx("button",{onClick:i,className:"rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200","aria-label":"Close",children:"✕"})]}),H.jsx("div",{className:"space-y-4 p-4",children:c?H.jsx("p",{className:"text-sm text-slate-400",children:"Reading current metadata from the file…"}):H.jsxs(H.Fragment,{children:[s&&H.jsxs("div",{className:"rounded bg-slate-800 p-2 text-xs text-slate-300",children:["Currently in file: revision ",s.revisions.some(et=>et)?s.revisions.filter(et=>et).join(", "):"(none set)",s.approval?` · approval: ${s.approval.status} by ${s.approval.approver_name}`:" · no approval recorded"]}),H.jsxs("section",{className:"rounded border border-slate-700 p-3",children:[H.jsxs("label",{className:"flex items-center gap-2 text-sm font-medium text-slate-100",children:[H.jsx("input",{type:"checkbox",checked:M,onChange:et=>b(et.target.checked)}),"Set drawing revision"]}),H.jsx("p",{className:"mt-0.5 text-xs text-slate-400",children:"Written to PRODUCT_DEFINITION_FORMATION.id - the standard STEP revision field."}),H.jsx("input",{disabled:!M,value:E,onChange:et=>y(et.target.value),placeholder:"e.g. B",className:"mt-2 w-32 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100 disabled:bg-slate-900 disabled:text-slate-500"})]}),H.jsxs("section",{className:"rounded border border-slate-700 p-3",children:[H.jsxs("label",{className:"flex items-center gap-2 text-sm font-medium text-slate-100",children:[H.jsx("input",{type:"checkbox",checked:g,onChange:et=>B(et.target.checked)}),"Set approval record"]}),H.jsx("p",{className:"mt-0.5 text-xs text-slate-400",children:"Written as standard STEP APPROVAL / PERSON / ORGANIZATION entities linked to the part revision."}),H.jsxs("div",{className:"mt-2 grid grid-cols-2 gap-2",children:[H.jsxs("label",{className:"block",children:[H.jsx("span",{className:"text-xs text-slate-300",children:"Status"}),H.jsxs("select",{disabled:!g,value:R,onChange:et=>w(et.target.value),className:"mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100 disabled:bg-slate-900 disabled:text-slate-500",children:[H.jsx("option",{value:"approved",children:"Approved"}),H.jsx("option",{value:"not_approved",children:"Not approved"}),H.jsx("option",{value:"in_work",children:"In work"})]})]}),H.jsxs("label",{className:"block",children:[H.jsx("span",{className:"text-xs text-slate-300",children:"Date"}),H.jsx("input",{type:"date",disabled:!g,value:z,onChange:et=>lt(et.target.value),className:"mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100 disabled:bg-slate-900 disabled:text-slate-500"})]}),H.jsxs("label",{className:"col-span-2 block",children:[H.jsx("span",{className:"text-xs text-slate-300",children:"Approver name *"}),H.jsx("input",{disabled:!g,value:V,onChange:et=>F(et.target.value),className:"mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100 disabled:bg-slate-900 disabled:text-slate-500"})]}),H.jsxs("label",{className:"block",children:[H.jsx("span",{className:"text-xs text-slate-300",children:"Organization"}),H.jsx("input",{disabled:!g,value:L,onChange:et=>X(et.target.value),className:"mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100 disabled:bg-slate-900 disabled:text-slate-500"})]}),H.jsxs("label",{className:"block",children:[H.jsx("span",{className:"text-xs text-slate-300",children:"Role"}),H.jsx("input",{disabled:!g,value:U,onChange:et=>D(et.target.value),className:"mt-0.5 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-slate-100 disabled:bg-slate-900 disabled:text-slate-500"})]})]})]}),d&&H.jsx("p",{className:"text-sm text-red-400",children:d}),v&&H.jsx("p",{className:"text-sm text-emerald-400",children:"Exported. A new .step file with this metadata was downloaded."})]})}),H.jsxs("div",{className:"flex justify-end gap-2 border-t border-slate-800 px-4 py-3",children:[H.jsx("button",{onClick:i,className:"rounded border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800",children:"Close"}),H.jsx("button",{onClick:dt,disabled:c||p||!st,className:"rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50",children:p?"Exporting…":"Export STEP with metadata"})]})]})})}function uy(r,t){if(t===void 0||t.trim()==="")return{actual:null,deviation:null,status:"PENDING"};const i=Number(t);if(!Number.isFinite(i))return{actual:null,deviation:null,status:"PENDING"};const s=i-r.nominal;let l=!0;return r.lsl!==null&&i<r.lsl-1e-9&&(l=!1),r.usl!==null&&i>r.usl+1e-9&&(l=!1),{actual:i,deviation:s,status:l?"PASS":"FAIL"}}function fy(r){return r.some(t=>t==="FAIL")?"FAIL":r.length&&r.every(t=>t==="PASS")?"PASS":"INCOMPLETE"}function na(r,t=4){if(r==null)return"—";const i=r.toFixed(t).replace(/\.?0+$/,"");return i==="-0"||i===""?"0":i}const hy="①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳";function H_(r){return r>=1&&r<=20?hy[r-1]:`(${r})`}const G_={PASS:"bg-green-900/50 text-green-300 border-green-700",FAIL:"bg-red-900/50 text-red-300 border-red-700",PENDING:"bg-slate-800 text-slate-400 border-slate-600"};function dy({characteristics:r,evaluated:t,readings:i,ncr:s,selectedId:l,onSelect:c,onReading:h,onNcr:d}){var S,M,b;const m=Vt.useRef({}),p=Vt.useRef(null),_=r.find(E=>E.id===l)??null;Vt.useEffect(()=>{var E,y,g;l&&((E=m.current[l])==null||E.scrollIntoView({block:"nearest",behavior:"smooth"}),(y=p.current)==null||y.focus(),(g=p.current)==null||g.select())},[l]);const v=E=>{if(!r.length)return;const y=r.findIndex(B=>B.id===l),g=r[(y+E+r.length)%r.length];c(g.id)};return H.jsxs("div",{className:"flex h-full flex-col",children:[H.jsx("div",{className:`border-b border-slate-800 p-3 ${_?"bg-blue-950/50":"bg-slate-900"}`,children:_?H.jsxs("div",{children:[H.jsxs("div",{className:"flex items-start justify-between gap-2",children:[H.jsxs("div",{children:[H.jsxs("div",{className:"text-xs font-semibold uppercase tracking-wide text-blue-400",children:["Active characteristic ",H_(_.index)," ",_.id]}),H.jsx("div",{className:"text-sm font-medium text-slate-100",children:_.feature_name}),H.jsxs("div",{className:"font-mono text-sm text-slate-300",children:[_.requirement,_.modifiers.length?` (${_.modifiers.map(E=>`(${E})`).join("")})`:""]})]}),H.jsxs("div",{className:"flex gap-1",children:[H.jsx("button",{className:"rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700",onClick:()=>v(-1),title:"Previous (Shift+Enter)",children:"↑"}),H.jsx("button",{className:"rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700",onClick:()=>v(1),title:"Next (Enter)",children:"↓"})]})]}),H.jsxs("div",{className:"mt-2 grid grid-cols-[1fr_auto_auto] items-end gap-3",children:[H.jsxs("label",{className:"block",children:[H.jsxs("span",{className:"text-xs text-slate-400",children:["Actual measured reading (",_.unit,")"]}),H.jsx("input",{ref:p,type:"number",step:"any",inputMode:"decimal",value:i[_.id]??"",onChange:E=>h(_.id,E.target.value),onKeyDown:E=>{E.key==="Enter"&&(E.preventDefault(),v(E.shiftKey?-1:1))},placeholder:_.kind==="geom_tolerance"?"measured error":na(_.nominal),className:"mt-1 w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 font-mono text-lg text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"})]}),H.jsxs("div",{className:"text-right",children:[H.jsx("div",{className:"text-xs text-slate-400",children:"Deviation"}),H.jsx("div",{className:"font-mono text-lg text-slate-100",children:na((S=t[_.id])==null?void 0:S.deviation)})]}),H.jsxs("div",{className:"text-right",children:[H.jsx("div",{className:"text-xs text-slate-400",children:"Status"}),H.jsx("span",{className:`inline-block rounded border px-2 py-0.5 font-semibold ${G_[((M=t[_.id])==null?void 0:M.status)??"PENDING"]}`,children:((b=t[_.id])==null?void 0:b.status)??"PENDING"})]})]}),H.jsxs("div",{className:"mt-1 text-xs text-slate-500",children:["Limits: ",na(_.lsl)," ≤ actual ≤ ",na(_.usl)," · nominal ",na(_.nominal)," ",_.unit,_.datum_refs.length?` · datums ${_.datum_refs.join(" | ")}`:"",_.face_ids.length?` · faces ${_.face_ids.join(", ")}`:" · not linked to geometry"]})]}):H.jsx("div",{className:"text-sm text-slate-400",children:"Click a balloon in the 3D view or a row below to enter a measured reading."})}),H.jsx("div",{className:"min-h-0 flex-1 overflow-auto",children:H.jsxs("table",{className:"w-full border-collapse text-xs",children:[H.jsx("thead",{className:"sticky top-0 z-10 bg-slate-800 text-left text-[11px] uppercase tracking-wide text-slate-400",children:H.jsxs("tr",{children:[H.jsx("th",{className:"px-2 py-2",children:"#"}),H.jsx("th",{className:"px-2 py-2",children:"Feature"}),H.jsx("th",{className:"px-2 py-2",children:"Requirement"}),H.jsx("th",{className:"px-2 py-2 text-right",children:"Nominal"}),H.jsx("th",{className:"px-2 py-2 text-right",children:"LSL"}),H.jsx("th",{className:"px-2 py-2 text-right",children:"USL"}),H.jsx("th",{className:"px-2 py-2",children:"Unit"}),H.jsx("th",{className:"px-2 py-2 text-right",children:"Actual"}),H.jsx("th",{className:"px-2 py-2 text-right",children:"Dev."}),H.jsx("th",{className:"px-2 py-2",children:"Status"}),H.jsx("th",{className:"px-2 py-2",children:"NCR #"})]})}),H.jsxs("tbody",{children:[r.map(E=>{const y=t[E.id],g=E.id===l;return H.jsxs("tr",{ref:B=>{m.current[E.id]=B},onClick:()=>c(E.id),className:`cursor-pointer border-b border-slate-800 text-slate-200 ${g?"bg-blue-950/60":(y==null?void 0:y.status)==="FAIL"?"bg-red-950/30":(y==null?void 0:y.status)==="PASS"?"bg-green-950/20":"hover:bg-slate-800/60"}`,children:[H.jsxs("td",{className:"px-2 py-1.5 font-semibold",children:[H_(E.index)," ",H.jsx("span",{className:"text-slate-500",children:E.id})]}),H.jsxs("td",{className:"px-2 py-1.5",children:[H.jsx("div",{className:"font-medium text-slate-100",children:E.feature_name}),H.jsx("div",{className:"text-[10px] text-slate-500",children:E.type_label})]}),H.jsx("td",{className:"px-2 py-1.5 font-mono",children:E.requirement}),H.jsx("td",{className:"px-2 py-1.5 text-right font-mono",children:na(E.nominal)}),H.jsx("td",{className:"px-2 py-1.5 text-right font-mono",children:na(E.lsl)}),H.jsx("td",{className:"px-2 py-1.5 text-right font-mono",children:na(E.usl)}),H.jsx("td",{className:"px-2 py-1.5",children:E.unit}),H.jsx("td",{className:"px-2 py-1.5 text-right",children:H.jsx("input",{type:"number",step:"any",value:i[E.id]??"",onClick:B=>B.stopPropagation(),onFocus:()=>c(E.id),onChange:B=>h(E.id,B.target.value),className:"w-20 rounded border border-slate-700 bg-slate-800 px-1 py-0.5 text-right font-mono text-slate-100 focus:border-blue-500 focus:outline-none"})}),H.jsx("td",{className:"px-2 py-1.5 text-right font-mono",children:na(y==null?void 0:y.deviation)}),H.jsx("td",{className:"px-2 py-1.5",children:H.jsx("span",{className:`inline-block rounded border px-1.5 py-0.5 font-semibold ${G_[(y==null?void 0:y.status)??"PENDING"]}`,children:(y==null?void 0:y.status)??"PENDING"})}),H.jsx("td",{className:"px-2 py-1.5",children:(y==null?void 0:y.status)==="FAIL"&&H.jsx("input",{type:"text",value:s[E.id]??"",onClick:B=>B.stopPropagation(),onChange:B=>d(E.id,B.target.value),placeholder:"NCR-…",className:"w-20 rounded border border-red-700 bg-slate-800 px-1 py-0.5 text-slate-100 focus:outline-none"})})]},E.id)}),!r.length&&H.jsx("tr",{children:H.jsx("td",{colSpan:11,className:"px-3 py-8 text-center text-slate-500",children:"No characteristics. Load a STEP file containing semantic PMI."})})]})]})})]})}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Pd="179",Nr={ROTATE:0,DOLLY:1,PAN:2},Cr={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},py=0,V_=1,my=2,av=1,gy=2,la=3,qa=0,Wn=1,ai=2,ja=0,Lr=1,k_=2,X_=3,j_=4,_y=5,ys=100,vy=101,xy=102,Sy=103,yy=104,My=200,Ey=201,by=202,Ty=203,Wh=204,qh=205,Ay=206,Ry=207,Cy=208,wy=209,Dy=210,Uy=211,Ny=212,Ly=213,Oy=214,Yh=0,Zh=1,Kh=2,zr=3,Qh=4,Jh=5,$h=6,td=7,sv=0,Py=1,zy=2,Wa=0,Iy=1,By=2,Fy=3,Hy=4,Gy=5,Vy=6,ky=7,rv=300,Ir=301,Br=302,ed=303,nd=304,Wc=306,id=1e3,Es=1001,ad=1002,Ti=1003,Xy=1004,uc=1005,Li=1006,fh=1007,bs=1008,zi=1009,ov=1010,lv=1011,jo=1012,zd=1013,As=1014,ua=1015,Zo=1016,Id=1017,Bd=1018,Wo=1020,cv=35902,uv=1021,fv=1022,bi=1023,qo=1026,Yo=1027,hv=1028,Fd=1029,dv=1030,Hd=1031,Gd=1033,Oc=33776,Pc=33777,zc=33778,Ic=33779,sd=35840,rd=35841,od=35842,ld=35843,cd=36196,ud=37492,fd=37496,hd=37808,dd=37809,pd=37810,md=37811,gd=37812,_d=37813,vd=37814,xd=37815,Sd=37816,yd=37817,Md=37818,Ed=37819,bd=37820,Td=37821,Bc=36492,Ad=36494,Rd=36495,pv=36283,Cd=36284,wd=36285,Dd=36286,jy=3200,Wy=3201,mv=0,qy=1,Xa="",mi="srgb",Fr="srgb-linear",Gc="linear",Ge="srgb",dr=7680,W_=519,Yy=512,Zy=513,Ky=514,gv=515,Qy=516,Jy=517,$y=518,tM=519,q_=35044,Y_="300 es",Oi=2e3,Vc=2001;class Ds{addEventListener(t,i){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[t]===void 0&&(s[t]=[]),s[t].indexOf(i)===-1&&s[t].push(i)}hasEventListener(t,i){const s=this._listeners;return s===void 0?!1:s[t]!==void 0&&s[t].indexOf(i)!==-1}removeEventListener(t,i){const s=this._listeners;if(s===void 0)return;const l=s[t];if(l!==void 0){const c=l.indexOf(i);c!==-1&&l.splice(c,1)}}dispatchEvent(t){const i=this._listeners;if(i===void 0)return;const s=i[t.type];if(s!==void 0){t.target=this;const l=s.slice(0);for(let c=0,h=l.length;c<h;c++)l[c].call(this,t);t.target=null}}}const Nn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Fc=Math.PI/180,Ud=180/Math.PI;function Ko(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(Nn[r&255]+Nn[r>>8&255]+Nn[r>>16&255]+Nn[r>>24&255]+"-"+Nn[t&255]+Nn[t>>8&255]+"-"+Nn[t>>16&15|64]+Nn[t>>24&255]+"-"+Nn[i&63|128]+Nn[i>>8&255]+"-"+Nn[i>>16&255]+Nn[i>>24&255]+Nn[s&255]+Nn[s>>8&255]+Nn[s>>16&255]+Nn[s>>24&255]).toLowerCase()}function ye(r,t,i){return Math.max(t,Math.min(i,r))}function eM(r,t){return(r%t+t)%t}function hh(r,t,i){return(1-i)*r+i*t}function Io(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Xn(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const nM={DEG2RAD:Fc};class ue{constructor(t=0,i=0){ue.prototype.isVector2=!0,this.x=t,this.y=i}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,i){return this.x=t,this.y=i,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const i=this.x,s=this.y,l=t.elements;return this.x=l[0]*i+l[3]*s+l[6],this.y=l[1]*i+l[4]*s+l[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,i){return this.x=ye(this.x,t.x,i.x),this.y=ye(this.y,t.y,i.y),this}clampScalar(t,i){return this.x=ye(this.x,t,i),this.y=ye(this.y,t,i),this}clampLength(t,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(ye(s,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(t)/i;return Math.acos(ye(s,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,s=this.y-t.y;return i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this}lerpVectors(t,i,s){return this.x=t.x+(i.x-t.x)*s,this.y=t.y+(i.y-t.y)*s,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this}rotateAround(t,i){const s=Math.cos(i),l=Math.sin(i),c=this.x-t.x,h=this.y-t.y;return this.x=c*s-h*l+t.x,this.y=c*l+h*s+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Rs{constructor(t=0,i=0,s=0,l=1){this.isQuaternion=!0,this._x=t,this._y=i,this._z=s,this._w=l}static slerpFlat(t,i,s,l,c,h,d){let m=s[l+0],p=s[l+1],_=s[l+2],v=s[l+3];const S=c[h+0],M=c[h+1],b=c[h+2],E=c[h+3];if(d===0){t[i+0]=m,t[i+1]=p,t[i+2]=_,t[i+3]=v;return}if(d===1){t[i+0]=S,t[i+1]=M,t[i+2]=b,t[i+3]=E;return}if(v!==E||m!==S||p!==M||_!==b){let y=1-d;const g=m*S+p*M+_*b+v*E,B=g>=0?1:-1,R=1-g*g;if(R>Number.EPSILON){const V=Math.sqrt(R),F=Math.atan2(V,g*B);y=Math.sin(y*F)/V,d=Math.sin(d*F)/V}const w=d*B;if(m=m*y+S*w,p=p*y+M*w,_=_*y+b*w,v=v*y+E*w,y===1-d){const V=1/Math.sqrt(m*m+p*p+_*_+v*v);m*=V,p*=V,_*=V,v*=V}}t[i]=m,t[i+1]=p,t[i+2]=_,t[i+3]=v}static multiplyQuaternionsFlat(t,i,s,l,c,h){const d=s[l],m=s[l+1],p=s[l+2],_=s[l+3],v=c[h],S=c[h+1],M=c[h+2],b=c[h+3];return t[i]=d*b+_*v+m*M-p*S,t[i+1]=m*b+_*S+p*v-d*M,t[i+2]=p*b+_*M+d*S-m*v,t[i+3]=_*b-d*v-m*S-p*M,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,i,s,l){return this._x=t,this._y=i,this._z=s,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,i=!0){const s=t._x,l=t._y,c=t._z,h=t._order,d=Math.cos,m=Math.sin,p=d(s/2),_=d(l/2),v=d(c/2),S=m(s/2),M=m(l/2),b=m(c/2);switch(h){case"XYZ":this._x=S*_*v+p*M*b,this._y=p*M*v-S*_*b,this._z=p*_*b+S*M*v,this._w=p*_*v-S*M*b;break;case"YXZ":this._x=S*_*v+p*M*b,this._y=p*M*v-S*_*b,this._z=p*_*b-S*M*v,this._w=p*_*v+S*M*b;break;case"ZXY":this._x=S*_*v-p*M*b,this._y=p*M*v+S*_*b,this._z=p*_*b+S*M*v,this._w=p*_*v-S*M*b;break;case"ZYX":this._x=S*_*v-p*M*b,this._y=p*M*v+S*_*b,this._z=p*_*b-S*M*v,this._w=p*_*v+S*M*b;break;case"YZX":this._x=S*_*v+p*M*b,this._y=p*M*v+S*_*b,this._z=p*_*b-S*M*v,this._w=p*_*v-S*M*b;break;case"XZY":this._x=S*_*v-p*M*b,this._y=p*M*v-S*_*b,this._z=p*_*b+S*M*v,this._w=p*_*v+S*M*b;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+h)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,i){const s=i/2,l=Math.sin(s);return this._x=t.x*l,this._y=t.y*l,this._z=t.z*l,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(t){const i=t.elements,s=i[0],l=i[4],c=i[8],h=i[1],d=i[5],m=i[9],p=i[2],_=i[6],v=i[10],S=s+d+v;if(S>0){const M=.5/Math.sqrt(S+1);this._w=.25/M,this._x=(_-m)*M,this._y=(c-p)*M,this._z=(h-l)*M}else if(s>d&&s>v){const M=2*Math.sqrt(1+s-d-v);this._w=(_-m)/M,this._x=.25*M,this._y=(l+h)/M,this._z=(c+p)/M}else if(d>v){const M=2*Math.sqrt(1+d-s-v);this._w=(c-p)/M,this._x=(l+h)/M,this._y=.25*M,this._z=(m+_)/M}else{const M=2*Math.sqrt(1+v-s-d);this._w=(h-l)/M,this._x=(c+p)/M,this._y=(m+_)/M,this._z=.25*M}return this._onChangeCallback(),this}setFromUnitVectors(t,i){let s=t.dot(i)+1;return s<1e-8?(s=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=s):(this._x=0,this._y=-t.z,this._z=t.y,this._w=s)):(this._x=t.y*i.z-t.z*i.y,this._y=t.z*i.x-t.x*i.z,this._z=t.x*i.y-t.y*i.x,this._w=s),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ye(this.dot(t),-1,1)))}rotateTowards(t,i){const s=this.angleTo(t);if(s===0)return this;const l=Math.min(1,i/s);return this.slerp(t,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,i){const s=t._x,l=t._y,c=t._z,h=t._w,d=i._x,m=i._y,p=i._z,_=i._w;return this._x=s*_+h*d+l*p-c*m,this._y=l*_+h*m+c*d-s*p,this._z=c*_+h*p+s*m-l*d,this._w=h*_-s*d-l*m-c*p,this._onChangeCallback(),this}slerp(t,i){if(i===0)return this;if(i===1)return this.copy(t);const s=this._x,l=this._y,c=this._z,h=this._w;let d=h*t._w+s*t._x+l*t._y+c*t._z;if(d<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,d=-d):this.copy(t),d>=1)return this._w=h,this._x=s,this._y=l,this._z=c,this;const m=1-d*d;if(m<=Number.EPSILON){const M=1-i;return this._w=M*h+i*this._w,this._x=M*s+i*this._x,this._y=M*l+i*this._y,this._z=M*c+i*this._z,this.normalize(),this}const p=Math.sqrt(m),_=Math.atan2(p,d),v=Math.sin((1-i)*_)/p,S=Math.sin(i*_)/p;return this._w=h*v+this._w*S,this._x=s*v+this._x*S,this._y=l*v+this._y*S,this._z=c*v+this._z*S,this._onChangeCallback(),this}slerpQuaternions(t,i,s){return this.copy(t).slerp(i,s)}random(){const t=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),s=Math.random(),l=Math.sqrt(1-s),c=Math.sqrt(s);return this.set(l*Math.sin(t),l*Math.cos(t),c*Math.sin(i),c*Math.cos(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,i=0){return this._x=t[i],this._y=t[i+1],this._z=t[i+2],this._w=t[i+3],this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._w,t}fromBufferAttribute(t,i){return this._x=t.getX(i),this._y=t.getY(i),this._z=t.getZ(i),this._w=t.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class tt{constructor(t=0,i=0,s=0){tt.prototype.isVector3=!0,this.x=t,this.y=i,this.z=s}set(t,i,s){return s===void 0&&(s=this.z),this.x=t,this.y=i,this.z=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,i){return this.x=t.x*i.x,this.y=t.y*i.y,this.z=t.z*i.z,this}applyEuler(t){return this.applyQuaternion(Z_.setFromEuler(t))}applyAxisAngle(t,i){return this.applyQuaternion(Z_.setFromAxisAngle(t,i))}applyMatrix3(t){const i=this.x,s=this.y,l=this.z,c=t.elements;return this.x=c[0]*i+c[3]*s+c[6]*l,this.y=c[1]*i+c[4]*s+c[7]*l,this.z=c[2]*i+c[5]*s+c[8]*l,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const i=this.x,s=this.y,l=this.z,c=t.elements,h=1/(c[3]*i+c[7]*s+c[11]*l+c[15]);return this.x=(c[0]*i+c[4]*s+c[8]*l+c[12])*h,this.y=(c[1]*i+c[5]*s+c[9]*l+c[13])*h,this.z=(c[2]*i+c[6]*s+c[10]*l+c[14])*h,this}applyQuaternion(t){const i=this.x,s=this.y,l=this.z,c=t.x,h=t.y,d=t.z,m=t.w,p=2*(h*l-d*s),_=2*(d*i-c*l),v=2*(c*s-h*i);return this.x=i+m*p+h*v-d*_,this.y=s+m*_+d*p-c*v,this.z=l+m*v+c*_-h*p,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const i=this.x,s=this.y,l=this.z,c=t.elements;return this.x=c[0]*i+c[4]*s+c[8]*l,this.y=c[1]*i+c[5]*s+c[9]*l,this.z=c[2]*i+c[6]*s+c[10]*l,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,i){return this.x=ye(this.x,t.x,i.x),this.y=ye(this.y,t.y,i.y),this.z=ye(this.z,t.z,i.z),this}clampScalar(t,i){return this.x=ye(this.x,t,i),this.y=ye(this.y,t,i),this.z=ye(this.z,t,i),this}clampLength(t,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(ye(s,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this}lerpVectors(t,i,s){return this.x=t.x+(i.x-t.x)*s,this.y=t.y+(i.y-t.y)*s,this.z=t.z+(i.z-t.z)*s,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,i){const s=t.x,l=t.y,c=t.z,h=i.x,d=i.y,m=i.z;return this.x=l*m-c*d,this.y=c*h-s*m,this.z=s*d-l*h,this}projectOnVector(t){const i=t.lengthSq();if(i===0)return this.set(0,0,0);const s=t.dot(this)/i;return this.copy(t).multiplyScalar(s)}projectOnPlane(t){return dh.copy(this).projectOnVector(t),this.sub(dh)}reflect(t){return this.sub(dh.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const i=Math.sqrt(this.lengthSq()*t.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(t)/i;return Math.acos(ye(s,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const i=this.x-t.x,s=this.y-t.y,l=this.z-t.z;return i*i+s*s+l*l}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,i,s){const l=Math.sin(i)*t;return this.x=l*Math.sin(s),this.y=Math.cos(i)*t,this.z=l*Math.cos(s),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,i,s){return this.x=t*Math.sin(i),this.y=s,this.z=t*Math.cos(i),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(t){const i=this.setFromMatrixColumn(t,0).length(),s=this.setFromMatrixColumn(t,1).length(),l=this.setFromMatrixColumn(t,2).length();return this.x=i,this.y=s,this.z=l,this}setFromMatrixColumn(t,i){return this.fromArray(t.elements,i*4)}setFromMatrix3Column(t,i){return this.fromArray(t.elements,i*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,i=Math.random()*2-1,s=Math.sqrt(1-i*i);return this.x=s*Math.cos(t),this.y=i,this.z=s*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const dh=new tt,Z_=new Rs;class me{constructor(t,i,s,l,c,h,d,m,p){me.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,i,s,l,c,h,d,m,p)}set(t,i,s,l,c,h,d,m,p){const _=this.elements;return _[0]=t,_[1]=l,_[2]=d,_[3]=i,_[4]=c,_[5]=m,_[6]=s,_[7]=h,_[8]=p,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const i=this.elements,s=t.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],this}extractBasis(t,i,s){return t.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const i=t.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const s=t.elements,l=i.elements,c=this.elements,h=s[0],d=s[3],m=s[6],p=s[1],_=s[4],v=s[7],S=s[2],M=s[5],b=s[8],E=l[0],y=l[3],g=l[6],B=l[1],R=l[4],w=l[7],V=l[2],F=l[5],L=l[8];return c[0]=h*E+d*B+m*V,c[3]=h*y+d*R+m*F,c[6]=h*g+d*w+m*L,c[1]=p*E+_*B+v*V,c[4]=p*y+_*R+v*F,c[7]=p*g+_*w+v*L,c[2]=S*E+M*B+b*V,c[5]=S*y+M*R+b*F,c[8]=S*g+M*w+b*L,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[3]*=t,i[6]*=t,i[1]*=t,i[4]*=t,i[7]*=t,i[2]*=t,i[5]*=t,i[8]*=t,this}determinant(){const t=this.elements,i=t[0],s=t[1],l=t[2],c=t[3],h=t[4],d=t[5],m=t[6],p=t[7],_=t[8];return i*h*_-i*d*p-s*c*_+s*d*m+l*c*p-l*h*m}invert(){const t=this.elements,i=t[0],s=t[1],l=t[2],c=t[3],h=t[4],d=t[5],m=t[6],p=t[7],_=t[8],v=_*h-d*p,S=d*m-_*c,M=p*c-h*m,b=i*v+s*S+l*M;if(b===0)return this.set(0,0,0,0,0,0,0,0,0);const E=1/b;return t[0]=v*E,t[1]=(l*p-_*s)*E,t[2]=(d*s-l*h)*E,t[3]=S*E,t[4]=(_*i-l*m)*E,t[5]=(l*c-d*i)*E,t[6]=M*E,t[7]=(s*m-p*i)*E,t[8]=(h*i-s*c)*E,this}transpose(){let t;const i=this.elements;return t=i[1],i[1]=i[3],i[3]=t,t=i[2],i[2]=i[6],i[6]=t,t=i[5],i[5]=i[7],i[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const i=this.elements;return t[0]=i[0],t[1]=i[3],t[2]=i[6],t[3]=i[1],t[4]=i[4],t[5]=i[7],t[6]=i[2],t[7]=i[5],t[8]=i[8],this}setUvTransform(t,i,s,l,c,h,d){const m=Math.cos(c),p=Math.sin(c);return this.set(s*m,s*p,-s*(m*h+p*d)+h+t,-l*p,l*m,-l*(-p*h+m*d)+d+i,0,0,1),this}scale(t,i){return this.premultiply(ph.makeScale(t,i)),this}rotate(t){return this.premultiply(ph.makeRotation(-t)),this}translate(t,i){return this.premultiply(ph.makeTranslation(t,i)),this}makeTranslation(t,i){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,i,0,0,1),this}makeRotation(t){const i=Math.cos(t),s=Math.sin(t);return this.set(i,-s,0,s,i,0,0,0,1),this}makeScale(t,i){return this.set(t,0,0,0,i,0,0,0,1),this}equals(t){const i=this.elements,s=t.elements;for(let l=0;l<9;l++)if(i[l]!==s[l])return!1;return!0}fromArray(t,i=0){for(let s=0;s<9;s++)this.elements[s]=t[s+i];return this}toArray(t=[],i=0){const s=this.elements;return t[i]=s[0],t[i+1]=s[1],t[i+2]=s[2],t[i+3]=s[3],t[i+4]=s[4],t[i+5]=s[5],t[i+6]=s[6],t[i+7]=s[7],t[i+8]=s[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ph=new me;function _v(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}function kc(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function iM(){const r=kc("canvas");return r.style.display="block",r}const K_={};function Or(r){r in K_||(K_[r]=!0,console.warn(r))}function aM(r,t,i){return new Promise(function(s,l){function c(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:l();break;case r.TIMEOUT_EXPIRED:setTimeout(c,i);break;default:s()}}setTimeout(c,i)})}const Q_=new me().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),J_=new me().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function sM(){const r={enabled:!0,workingColorSpace:Fr,spaces:{},convert:function(l,c,h){return this.enabled===!1||c===h||!c||!h||(this.spaces[c].transfer===Ge&&(l.r=fa(l.r),l.g=fa(l.g),l.b=fa(l.b)),this.spaces[c].primaries!==this.spaces[h].primaries&&(l.applyMatrix3(this.spaces[c].toXYZ),l.applyMatrix3(this.spaces[h].fromXYZ)),this.spaces[h].transfer===Ge&&(l.r=Pr(l.r),l.g=Pr(l.g),l.b=Pr(l.b))),l},workingToColorSpace:function(l,c){return this.convert(l,this.workingColorSpace,c)},colorSpaceToWorking:function(l,c){return this.convert(l,c,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===Xa?Gc:this.spaces[l].transfer},getLuminanceCoefficients:function(l,c=this.workingColorSpace){return l.fromArray(this.spaces[c].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,c,h){return l.copy(this.spaces[c].toXYZ).multiply(this.spaces[h].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(l,c){return Or("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(l,c)},toWorkingColorSpace:function(l,c){return Or("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(l,c)}},t=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],s=[.3127,.329];return r.define({[Fr]:{primaries:t,whitePoint:s,transfer:Gc,toXYZ:Q_,fromXYZ:J_,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:mi},outputColorSpaceConfig:{drawingBufferColorSpace:mi}},[mi]:{primaries:t,whitePoint:s,transfer:Ge,toXYZ:Q_,fromXYZ:J_,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:mi}}}),r}const Ue=sM();function fa(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Pr(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let pr;class rM{static getDataURL(t,i="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let s;if(t instanceof HTMLCanvasElement)s=t;else{pr===void 0&&(pr=kc("canvas")),pr.width=t.width,pr.height=t.height;const l=pr.getContext("2d");t instanceof ImageData?l.putImageData(t,0,0):l.drawImage(t,0,0,t.width,t.height),s=pr}return s.toDataURL(i)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const i=kc("canvas");i.width=t.width,i.height=t.height;const s=i.getContext("2d");s.drawImage(t,0,0,t.width,t.height);const l=s.getImageData(0,0,t.width,t.height),c=l.data;for(let h=0;h<c.length;h++)c[h]=fa(c[h]/255)*255;return s.putImageData(l,0,0),i}else if(t.data){const i=t.data.slice(0);for(let s=0;s<i.length;s++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[s]=Math.floor(fa(i[s]/255)*255):i[s]=fa(i[s]);return{data:i,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let oM=0;class Vd{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:oM++}),this.uuid=Ko(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const i=this.data;return i instanceof HTMLVideoElement?t.set(i.videoWidth,i.videoHeight,0):i instanceof VideoFrame?t.set(i.displayHeight,i.displayWidth,0):i!==null?t.set(i.width,i.height,i.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const s={uuid:this.uuid,url:""},l=this.data;if(l!==null){let c;if(Array.isArray(l)){c=[];for(let h=0,d=l.length;h<d;h++)l[h].isDataTexture?c.push(mh(l[h].image)):c.push(mh(l[h]))}else c=mh(l);s.url=c}return i||(t.images[this.uuid]=s),s}}function mh(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?rM.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let lM=0;const gh=new tt;class qn extends Ds{constructor(t=qn.DEFAULT_IMAGE,i=qn.DEFAULT_MAPPING,s=Es,l=Es,c=Li,h=bs,d=bi,m=zi,p=qn.DEFAULT_ANISOTROPY,_=Xa){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:lM++}),this.uuid=Ko(),this.name="",this.source=new Vd(t),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=s,this.wrapT=l,this.magFilter=c,this.minFilter=h,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=m,this.offset=new ue(0,0),this.repeat=new ue(1,1),this.center=new ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new me,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=_,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(gh).x}get height(){return this.source.getSize(gh).y}get depth(){return this.source.getSize(gh).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const i in t){const s=t[i];if(s===void 0){console.warn(`THREE.Texture.setValues(): parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Texture.setValues(): property '${i}' does not exist.`);continue}l&&s&&l.isVector2&&s.isVector2||l&&s&&l.isVector3&&s.isVector3||l&&s&&l.isMatrix3&&s.isMatrix3?l.copy(s):this[i]=s}}toJSON(t){const i=t===void 0||typeof t=="string";if(!i&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const s={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),i||(t.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==rv)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case id:t.x=t.x-Math.floor(t.x);break;case Es:t.x=t.x<0?0:1;break;case ad:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case id:t.y=t.y-Math.floor(t.y);break;case Es:t.y=t.y<0?0:1;break;case ad:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}qn.DEFAULT_IMAGE=null;qn.DEFAULT_MAPPING=rv;qn.DEFAULT_ANISOTROPY=1;class en{constructor(t=0,i=0,s=0,l=1){en.prototype.isVector4=!0,this.x=t,this.y=i,this.z=s,this.w=l}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,i,s,l){return this.x=t,this.y=i,this.z=s,this.w=l,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,i){switch(t){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,i){return this.x=t.x+i.x,this.y=t.y+i.y,this.z=t.z+i.z,this.w=t.w+i.w,this}addScaledVector(t,i){return this.x+=t.x*i,this.y+=t.y*i,this.z+=t.z*i,this.w+=t.w*i,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,i){return this.x=t.x-i.x,this.y=t.y-i.y,this.z=t.z-i.z,this.w=t.w-i.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const i=this.x,s=this.y,l=this.z,c=this.w,h=t.elements;return this.x=h[0]*i+h[4]*s+h[8]*l+h[12]*c,this.y=h[1]*i+h[5]*s+h[9]*l+h[13]*c,this.z=h[2]*i+h[6]*s+h[10]*l+h[14]*c,this.w=h[3]*i+h[7]*s+h[11]*l+h[15]*c,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const i=Math.sqrt(1-t.w*t.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/i,this.y=t.y/i,this.z=t.z/i),this}setAxisAngleFromRotationMatrix(t){let i,s,l,c;const m=t.elements,p=m[0],_=m[4],v=m[8],S=m[1],M=m[5],b=m[9],E=m[2],y=m[6],g=m[10];if(Math.abs(_-S)<.01&&Math.abs(v-E)<.01&&Math.abs(b-y)<.01){if(Math.abs(_+S)<.1&&Math.abs(v+E)<.1&&Math.abs(b+y)<.1&&Math.abs(p+M+g-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const R=(p+1)/2,w=(M+1)/2,V=(g+1)/2,F=(_+S)/4,L=(v+E)/4,X=(b+y)/4;return R>w&&R>V?R<.01?(s=0,l=.707106781,c=.707106781):(s=Math.sqrt(R),l=F/s,c=L/s):w>V?w<.01?(s=.707106781,l=0,c=.707106781):(l=Math.sqrt(w),s=F/l,c=X/l):V<.01?(s=.707106781,l=.707106781,c=0):(c=Math.sqrt(V),s=L/c,l=X/c),this.set(s,l,c,i),this}let B=Math.sqrt((y-b)*(y-b)+(v-E)*(v-E)+(S-_)*(S-_));return Math.abs(B)<.001&&(B=1),this.x=(y-b)/B,this.y=(v-E)/B,this.z=(S-_)/B,this.w=Math.acos((p+M+g-1)/2),this}setFromMatrixPosition(t){const i=t.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,i){return this.x=ye(this.x,t.x,i.x),this.y=ye(this.y,t.y,i.y),this.z=ye(this.z,t.z,i.z),this.w=ye(this.w,t.w,i.w),this}clampScalar(t,i){return this.x=ye(this.x,t,i),this.y=ye(this.y,t,i),this.z=ye(this.z,t,i),this.w=ye(this.w,t,i),this}clampLength(t,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(ye(s,t,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,i){return this.x+=(t.x-this.x)*i,this.y+=(t.y-this.y)*i,this.z+=(t.z-this.z)*i,this.w+=(t.w-this.w)*i,this}lerpVectors(t,i,s){return this.x=t.x+(i.x-t.x)*s,this.y=t.y+(i.y-t.y)*s,this.z=t.z+(i.z-t.z)*s,this.w=t.w+(i.w-t.w)*s,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,i=0){return this.x=t[i],this.y=t[i+1],this.z=t[i+2],this.w=t[i+3],this}toArray(t=[],i=0){return t[i]=this.x,t[i+1]=this.y,t[i+2]=this.z,t[i+3]=this.w,t}fromBufferAttribute(t,i){return this.x=t.getX(i),this.y=t.getY(i),this.z=t.getZ(i),this.w=t.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class cM extends Ds{constructor(t=1,i=1,s={}){super(),s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Li,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},s),this.isRenderTarget=!0,this.width=t,this.height=i,this.depth=s.depth,this.scissor=new en(0,0,t,i),this.scissorTest=!1,this.viewport=new en(0,0,t,i);const l={width:t,height:i,depth:s.depth},c=new qn(l);this.textures=[];const h=s.count;for(let d=0;d<h;d++)this.textures[d]=c.clone(),this.textures[d].isRenderTargetTexture=!0,this.textures[d].renderTarget=this;this._setTextureOptions(s),this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.resolveDepthBuffer=s.resolveDepthBuffer,this.resolveStencilBuffer=s.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=s.depthTexture,this.samples=s.samples,this.multiview=s.multiview}_setTextureOptions(t={}){const i={minFilter:Li,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(i.mapping=t.mapping),t.wrapS!==void 0&&(i.wrapS=t.wrapS),t.wrapT!==void 0&&(i.wrapT=t.wrapT),t.wrapR!==void 0&&(i.wrapR=t.wrapR),t.magFilter!==void 0&&(i.magFilter=t.magFilter),t.minFilter!==void 0&&(i.minFilter=t.minFilter),t.format!==void 0&&(i.format=t.format),t.type!==void 0&&(i.type=t.type),t.anisotropy!==void 0&&(i.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(i.colorSpace=t.colorSpace),t.flipY!==void 0&&(i.flipY=t.flipY),t.generateMipmaps!==void 0&&(i.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(i.internalFormat=t.internalFormat);for(let s=0;s<this.textures.length;s++)this.textures[s].setValues(i)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,i,s=1){if(this.width!==t||this.height!==i||this.depth!==s){this.width=t,this.height=i,this.depth=s;for(let l=0,c=this.textures.length;l<c;l++)this.textures[l].image.width=t,this.textures[l].image.height=i,this.textures[l].image.depth=s,this.textures[l].isArrayTexture=this.textures[l].image.depth>1;this.dispose()}this.viewport.set(0,0,t,i),this.scissor.set(0,0,t,i)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,s=t.textures.length;i<s;i++){this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;const l=Object.assign({},t.textures[i].image);this.textures[i].source=new Vd(l)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Cs extends cM{constructor(t=1,i=1,s={}){super(t,i,s),this.isWebGLRenderTarget=!0}}class vv extends qn{constructor(t=null,i=1,s=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:i,height:s,depth:l},this.magFilter=Ti,this.minFilter=Ti,this.wrapR=Es,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class uM extends qn{constructor(t=null,i=1,s=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:i,height:s,depth:l},this.magFilter=Ti,this.minFilter=Ti,this.wrapR=Es,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Qo{constructor(t=new tt(1/0,1/0,1/0),i=new tt(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=i}set(t,i){return this.min.copy(t),this.max.copy(i),this}setFromArray(t){this.makeEmpty();for(let i=0,s=t.length;i<s;i+=3)this.expandByPoint(Si.fromArray(t,i));return this}setFromBufferAttribute(t){this.makeEmpty();for(let i=0,s=t.count;i<s;i++)this.expandByPoint(Si.fromBufferAttribute(t,i));return this}setFromPoints(t){this.makeEmpty();for(let i=0,s=t.length;i<s;i++)this.expandByPoint(t[i]);return this}setFromCenterAndSize(t,i){const s=Si.copy(i).multiplyScalar(.5);return this.min.copy(t).sub(s),this.max.copy(t).add(s),this}setFromObject(t,i=!1){return this.makeEmpty(),this.expandByObject(t,i)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,i=!1){t.updateWorldMatrix(!1,!1);const s=t.geometry;if(s!==void 0){const c=s.getAttribute("position");if(i===!0&&c!==void 0&&t.isInstancedMesh!==!0)for(let h=0,d=c.count;h<d;h++)t.isMesh===!0?t.getVertexPosition(h,Si):Si.fromBufferAttribute(c,h),Si.applyMatrix4(t.matrixWorld),this.expandByPoint(Si);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),fc.copy(t.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),fc.copy(s.boundingBox)),fc.applyMatrix4(t.matrixWorld),this.union(fc)}const l=t.children;for(let c=0,h=l.length;c<h;c++)this.expandByObject(l[c],i);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,i){return i.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Si),Si.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let i,s;return t.normal.x>0?(i=t.normal.x*this.min.x,s=t.normal.x*this.max.x):(i=t.normal.x*this.max.x,s=t.normal.x*this.min.x),t.normal.y>0?(i+=t.normal.y*this.min.y,s+=t.normal.y*this.max.y):(i+=t.normal.y*this.max.y,s+=t.normal.y*this.min.y),t.normal.z>0?(i+=t.normal.z*this.min.z,s+=t.normal.z*this.max.z):(i+=t.normal.z*this.max.z,s+=t.normal.z*this.min.z),i<=-t.constant&&s>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Bo),hc.subVectors(this.max,Bo),mr.subVectors(t.a,Bo),gr.subVectors(t.b,Bo),_r.subVectors(t.c,Bo),Ia.subVectors(gr,mr),Ba.subVectors(_r,gr),ps.subVectors(mr,_r);let i=[0,-Ia.z,Ia.y,0,-Ba.z,Ba.y,0,-ps.z,ps.y,Ia.z,0,-Ia.x,Ba.z,0,-Ba.x,ps.z,0,-ps.x,-Ia.y,Ia.x,0,-Ba.y,Ba.x,0,-ps.y,ps.x,0];return!_h(i,mr,gr,_r,hc)||(i=[1,0,0,0,1,0,0,0,1],!_h(i,mr,gr,_r,hc))?!1:(dc.crossVectors(Ia,Ba),i=[dc.x,dc.y,dc.z],_h(i,mr,gr,_r,hc))}clampPoint(t,i){return i.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Si).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Si).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ia[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ia[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ia[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ia[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ia[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ia[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ia[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ia[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ia),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const ia=[new tt,new tt,new tt,new tt,new tt,new tt,new tt,new tt],Si=new tt,fc=new Qo,mr=new tt,gr=new tt,_r=new tt,Ia=new tt,Ba=new tt,ps=new tt,Bo=new tt,hc=new tt,dc=new tt,ms=new tt;function _h(r,t,i,s,l){for(let c=0,h=r.length-3;c<=h;c+=3){ms.fromArray(r,c);const d=l.x*Math.abs(ms.x)+l.y*Math.abs(ms.y)+l.z*Math.abs(ms.z),m=t.dot(ms),p=i.dot(ms),_=s.dot(ms);if(Math.max(-Math.max(m,p,_),Math.min(m,p,_))>d)return!1}return!0}const fM=new Qo,Fo=new tt,vh=new tt;class qc{constructor(t=new tt,i=-1){this.isSphere=!0,this.center=t,this.radius=i}set(t,i){return this.center.copy(t),this.radius=i,this}setFromPoints(t,i){const s=this.center;i!==void 0?s.copy(i):fM.setFromPoints(t).getCenter(s);let l=0;for(let c=0,h=t.length;c<h;c++)l=Math.max(l,s.distanceToSquared(t[c]));return this.radius=Math.sqrt(l),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const i=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=i*i}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,i){const s=this.center.distanceToSquared(t);return i.copy(t),s>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Fo.subVectors(t,this.center);const i=Fo.lengthSq();if(i>this.radius*this.radius){const s=Math.sqrt(i),l=(s-this.radius)*.5;this.center.addScaledVector(Fo,l/s),this.radius+=l}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(vh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Fo.copy(t.center).add(vh)),this.expandByPoint(Fo.copy(t.center).sub(vh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const aa=new tt,xh=new tt,pc=new tt,Fa=new tt,Sh=new tt,mc=new tt,yh=new tt;class Yc{constructor(t=new tt,i=new tt(0,0,-1)){this.origin=t,this.direction=i}set(t,i){return this.origin.copy(t),this.direction.copy(i),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,i){return i.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,aa)),this}closestPointToPoint(t,i){i.subVectors(t,this.origin);const s=i.dot(this.direction);return s<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const i=aa.subVectors(t,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(t):(aa.copy(this.origin).addScaledVector(this.direction,i),aa.distanceToSquared(t))}distanceSqToSegment(t,i,s,l){xh.copy(t).add(i).multiplyScalar(.5),pc.copy(i).sub(t).normalize(),Fa.copy(this.origin).sub(xh);const c=t.distanceTo(i)*.5,h=-this.direction.dot(pc),d=Fa.dot(this.direction),m=-Fa.dot(pc),p=Fa.lengthSq(),_=Math.abs(1-h*h);let v,S,M,b;if(_>0)if(v=h*m-d,S=h*d-m,b=c*_,v>=0)if(S>=-b)if(S<=b){const E=1/_;v*=E,S*=E,M=v*(v+h*S+2*d)+S*(h*v+S+2*m)+p}else S=c,v=Math.max(0,-(h*S+d)),M=-v*v+S*(S+2*m)+p;else S=-c,v=Math.max(0,-(h*S+d)),M=-v*v+S*(S+2*m)+p;else S<=-b?(v=Math.max(0,-(-h*c+d)),S=v>0?-c:Math.min(Math.max(-c,-m),c),M=-v*v+S*(S+2*m)+p):S<=b?(v=0,S=Math.min(Math.max(-c,-m),c),M=S*(S+2*m)+p):(v=Math.max(0,-(h*c+d)),S=v>0?c:Math.min(Math.max(-c,-m),c),M=-v*v+S*(S+2*m)+p);else S=h>0?-c:c,v=Math.max(0,-(h*S+d)),M=-v*v+S*(S+2*m)+p;return s&&s.copy(this.origin).addScaledVector(this.direction,v),l&&l.copy(xh).addScaledVector(pc,S),M}intersectSphere(t,i){aa.subVectors(t.center,this.origin);const s=aa.dot(this.direction),l=aa.dot(aa)-s*s,c=t.radius*t.radius;if(l>c)return null;const h=Math.sqrt(c-l),d=s-h,m=s+h;return m<0?null:d<0?this.at(m,i):this.at(d,i)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const i=t.normal.dot(this.direction);if(i===0)return t.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(t.normal)+t.constant)/i;return s>=0?s:null}intersectPlane(t,i){const s=this.distanceToPlane(t);return s===null?null:this.at(s,i)}intersectsPlane(t){const i=t.distanceToPoint(this.origin);return i===0||t.normal.dot(this.direction)*i<0}intersectBox(t,i){let s,l,c,h,d,m;const p=1/this.direction.x,_=1/this.direction.y,v=1/this.direction.z,S=this.origin;return p>=0?(s=(t.min.x-S.x)*p,l=(t.max.x-S.x)*p):(s=(t.max.x-S.x)*p,l=(t.min.x-S.x)*p),_>=0?(c=(t.min.y-S.y)*_,h=(t.max.y-S.y)*_):(c=(t.max.y-S.y)*_,h=(t.min.y-S.y)*_),s>h||c>l||((c>s||isNaN(s))&&(s=c),(h<l||isNaN(l))&&(l=h),v>=0?(d=(t.min.z-S.z)*v,m=(t.max.z-S.z)*v):(d=(t.max.z-S.z)*v,m=(t.min.z-S.z)*v),s>m||d>l)||((d>s||s!==s)&&(s=d),(m<l||l!==l)&&(l=m),l<0)?null:this.at(s>=0?s:l,i)}intersectsBox(t){return this.intersectBox(t,aa)!==null}intersectTriangle(t,i,s,l,c){Sh.subVectors(i,t),mc.subVectors(s,t),yh.crossVectors(Sh,mc);let h=this.direction.dot(yh),d;if(h>0){if(l)return null;d=1}else if(h<0)d=-1,h=-h;else return null;Fa.subVectors(this.origin,t);const m=d*this.direction.dot(mc.crossVectors(Fa,mc));if(m<0)return null;const p=d*this.direction.dot(Sh.cross(Fa));if(p<0||m+p>h)return null;const _=-d*Fa.dot(yh);return _<0?null:this.at(_/h,c)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ze{constructor(t,i,s,l,c,h,d,m,p,_,v,S,M,b,E,y){Ze.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,i,s,l,c,h,d,m,p,_,v,S,M,b,E,y)}set(t,i,s,l,c,h,d,m,p,_,v,S,M,b,E,y){const g=this.elements;return g[0]=t,g[4]=i,g[8]=s,g[12]=l,g[1]=c,g[5]=h,g[9]=d,g[13]=m,g[2]=p,g[6]=_,g[10]=v,g[14]=S,g[3]=M,g[7]=b,g[11]=E,g[15]=y,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ze().fromArray(this.elements)}copy(t){const i=this.elements,s=t.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],i[9]=s[9],i[10]=s[10],i[11]=s[11],i[12]=s[12],i[13]=s[13],i[14]=s[14],i[15]=s[15],this}copyPosition(t){const i=this.elements,s=t.elements;return i[12]=s[12],i[13]=s[13],i[14]=s[14],this}setFromMatrix3(t){const i=t.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(t,i,s){return t.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this}makeBasis(t,i,s){return this.set(t.x,i.x,s.x,0,t.y,i.y,s.y,0,t.z,i.z,s.z,0,0,0,0,1),this}extractRotation(t){const i=this.elements,s=t.elements,l=1/vr.setFromMatrixColumn(t,0).length(),c=1/vr.setFromMatrixColumn(t,1).length(),h=1/vr.setFromMatrixColumn(t,2).length();return i[0]=s[0]*l,i[1]=s[1]*l,i[2]=s[2]*l,i[3]=0,i[4]=s[4]*c,i[5]=s[5]*c,i[6]=s[6]*c,i[7]=0,i[8]=s[8]*h,i[9]=s[9]*h,i[10]=s[10]*h,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(t){const i=this.elements,s=t.x,l=t.y,c=t.z,h=Math.cos(s),d=Math.sin(s),m=Math.cos(l),p=Math.sin(l),_=Math.cos(c),v=Math.sin(c);if(t.order==="XYZ"){const S=h*_,M=h*v,b=d*_,E=d*v;i[0]=m*_,i[4]=-m*v,i[8]=p,i[1]=M+b*p,i[5]=S-E*p,i[9]=-d*m,i[2]=E-S*p,i[6]=b+M*p,i[10]=h*m}else if(t.order==="YXZ"){const S=m*_,M=m*v,b=p*_,E=p*v;i[0]=S+E*d,i[4]=b*d-M,i[8]=h*p,i[1]=h*v,i[5]=h*_,i[9]=-d,i[2]=M*d-b,i[6]=E+S*d,i[10]=h*m}else if(t.order==="ZXY"){const S=m*_,M=m*v,b=p*_,E=p*v;i[0]=S-E*d,i[4]=-h*v,i[8]=b+M*d,i[1]=M+b*d,i[5]=h*_,i[9]=E-S*d,i[2]=-h*p,i[6]=d,i[10]=h*m}else if(t.order==="ZYX"){const S=h*_,M=h*v,b=d*_,E=d*v;i[0]=m*_,i[4]=b*p-M,i[8]=S*p+E,i[1]=m*v,i[5]=E*p+S,i[9]=M*p-b,i[2]=-p,i[6]=d*m,i[10]=h*m}else if(t.order==="YZX"){const S=h*m,M=h*p,b=d*m,E=d*p;i[0]=m*_,i[4]=E-S*v,i[8]=b*v+M,i[1]=v,i[5]=h*_,i[9]=-d*_,i[2]=-p*_,i[6]=M*v+b,i[10]=S-E*v}else if(t.order==="XZY"){const S=h*m,M=h*p,b=d*m,E=d*p;i[0]=m*_,i[4]=-v,i[8]=p*_,i[1]=S*v+E,i[5]=h*_,i[9]=M*v-b,i[2]=b*v-M,i[6]=d*_,i[10]=E*v+S}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(t){return this.compose(hM,t,dM)}lookAt(t,i,s){const l=this.elements;return ni.subVectors(t,i),ni.lengthSq()===0&&(ni.z=1),ni.normalize(),Ha.crossVectors(s,ni),Ha.lengthSq()===0&&(Math.abs(s.z)===1?ni.x+=1e-4:ni.z+=1e-4,ni.normalize(),Ha.crossVectors(s,ni)),Ha.normalize(),gc.crossVectors(ni,Ha),l[0]=Ha.x,l[4]=gc.x,l[8]=ni.x,l[1]=Ha.y,l[5]=gc.y,l[9]=ni.y,l[2]=Ha.z,l[6]=gc.z,l[10]=ni.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,i){const s=t.elements,l=i.elements,c=this.elements,h=s[0],d=s[4],m=s[8],p=s[12],_=s[1],v=s[5],S=s[9],M=s[13],b=s[2],E=s[6],y=s[10],g=s[14],B=s[3],R=s[7],w=s[11],V=s[15],F=l[0],L=l[4],X=l[8],U=l[12],D=l[1],z=l[5],lt=l[9],st=l[13],dt=l[2],et=l[6],I=l[10],Y=l[14],q=l[3],$=l[7],rt=l[11],N=l[15];return c[0]=h*F+d*D+m*dt+p*q,c[4]=h*L+d*z+m*et+p*$,c[8]=h*X+d*lt+m*I+p*rt,c[12]=h*U+d*st+m*Y+p*N,c[1]=_*F+v*D+S*dt+M*q,c[5]=_*L+v*z+S*et+M*$,c[9]=_*X+v*lt+S*I+M*rt,c[13]=_*U+v*st+S*Y+M*N,c[2]=b*F+E*D+y*dt+g*q,c[6]=b*L+E*z+y*et+g*$,c[10]=b*X+E*lt+y*I+g*rt,c[14]=b*U+E*st+y*Y+g*N,c[3]=B*F+R*D+w*dt+V*q,c[7]=B*L+R*z+w*et+V*$,c[11]=B*X+R*lt+w*I+V*rt,c[15]=B*U+R*st+w*Y+V*N,this}multiplyScalar(t){const i=this.elements;return i[0]*=t,i[4]*=t,i[8]*=t,i[12]*=t,i[1]*=t,i[5]*=t,i[9]*=t,i[13]*=t,i[2]*=t,i[6]*=t,i[10]*=t,i[14]*=t,i[3]*=t,i[7]*=t,i[11]*=t,i[15]*=t,this}determinant(){const t=this.elements,i=t[0],s=t[4],l=t[8],c=t[12],h=t[1],d=t[5],m=t[9],p=t[13],_=t[2],v=t[6],S=t[10],M=t[14],b=t[3],E=t[7],y=t[11],g=t[15];return b*(+c*m*v-l*p*v-c*d*S+s*p*S+l*d*M-s*m*M)+E*(+i*m*M-i*p*S+c*h*S-l*h*M+l*p*_-c*m*_)+y*(+i*p*v-i*d*M-c*h*v+s*h*M+c*d*_-s*p*_)+g*(-l*d*_-i*m*v+i*d*S+l*h*v-s*h*S+s*m*_)}transpose(){const t=this.elements;let i;return i=t[1],t[1]=t[4],t[4]=i,i=t[2],t[2]=t[8],t[8]=i,i=t[6],t[6]=t[9],t[9]=i,i=t[3],t[3]=t[12],t[12]=i,i=t[7],t[7]=t[13],t[13]=i,i=t[11],t[11]=t[14],t[14]=i,this}setPosition(t,i,s){const l=this.elements;return t.isVector3?(l[12]=t.x,l[13]=t.y,l[14]=t.z):(l[12]=t,l[13]=i,l[14]=s),this}invert(){const t=this.elements,i=t[0],s=t[1],l=t[2],c=t[3],h=t[4],d=t[5],m=t[6],p=t[7],_=t[8],v=t[9],S=t[10],M=t[11],b=t[12],E=t[13],y=t[14],g=t[15],B=v*y*p-E*S*p+E*m*M-d*y*M-v*m*g+d*S*g,R=b*S*p-_*y*p-b*m*M+h*y*M+_*m*g-h*S*g,w=_*E*p-b*v*p+b*d*M-h*E*M-_*d*g+h*v*g,V=b*v*m-_*E*m-b*d*S+h*E*S+_*d*y-h*v*y,F=i*B+s*R+l*w+c*V;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const L=1/F;return t[0]=B*L,t[1]=(E*S*c-v*y*c-E*l*M+s*y*M+v*l*g-s*S*g)*L,t[2]=(d*y*c-E*m*c+E*l*p-s*y*p-d*l*g+s*m*g)*L,t[3]=(v*m*c-d*S*c-v*l*p+s*S*p+d*l*M-s*m*M)*L,t[4]=R*L,t[5]=(_*y*c-b*S*c+b*l*M-i*y*M-_*l*g+i*S*g)*L,t[6]=(b*m*c-h*y*c-b*l*p+i*y*p+h*l*g-i*m*g)*L,t[7]=(h*S*c-_*m*c+_*l*p-i*S*p-h*l*M+i*m*M)*L,t[8]=w*L,t[9]=(b*v*c-_*E*c-b*s*M+i*E*M+_*s*g-i*v*g)*L,t[10]=(h*E*c-b*d*c+b*s*p-i*E*p-h*s*g+i*d*g)*L,t[11]=(_*d*c-h*v*c-_*s*p+i*v*p+h*s*M-i*d*M)*L,t[12]=V*L,t[13]=(_*E*l-b*v*l+b*s*S-i*E*S-_*s*y+i*v*y)*L,t[14]=(b*d*l-h*E*l-b*s*m+i*E*m+h*s*y-i*d*y)*L,t[15]=(h*v*l-_*d*l+_*s*m-i*v*m-h*s*S+i*d*S)*L,this}scale(t){const i=this.elements,s=t.x,l=t.y,c=t.z;return i[0]*=s,i[4]*=l,i[8]*=c,i[1]*=s,i[5]*=l,i[9]*=c,i[2]*=s,i[6]*=l,i[10]*=c,i[3]*=s,i[7]*=l,i[11]*=c,this}getMaxScaleOnAxis(){const t=this.elements,i=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],s=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],l=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(i,s,l))}makeTranslation(t,i,s){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,i,0,0,1,s,0,0,0,1),this}makeRotationX(t){const i=Math.cos(t),s=Math.sin(t);return this.set(1,0,0,0,0,i,-s,0,0,s,i,0,0,0,0,1),this}makeRotationY(t){const i=Math.cos(t),s=Math.sin(t);return this.set(i,0,s,0,0,1,0,0,-s,0,i,0,0,0,0,1),this}makeRotationZ(t){const i=Math.cos(t),s=Math.sin(t);return this.set(i,-s,0,0,s,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,i){const s=Math.cos(i),l=Math.sin(i),c=1-s,h=t.x,d=t.y,m=t.z,p=c*h,_=c*d;return this.set(p*h+s,p*d-l*m,p*m+l*d,0,p*d+l*m,_*d+s,_*m-l*h,0,p*m-l*d,_*m+l*h,c*m*m+s,0,0,0,0,1),this}makeScale(t,i,s){return this.set(t,0,0,0,0,i,0,0,0,0,s,0,0,0,0,1),this}makeShear(t,i,s,l,c,h){return this.set(1,s,c,0,t,1,h,0,i,l,1,0,0,0,0,1),this}compose(t,i,s){const l=this.elements,c=i._x,h=i._y,d=i._z,m=i._w,p=c+c,_=h+h,v=d+d,S=c*p,M=c*_,b=c*v,E=h*_,y=h*v,g=d*v,B=m*p,R=m*_,w=m*v,V=s.x,F=s.y,L=s.z;return l[0]=(1-(E+g))*V,l[1]=(M+w)*V,l[2]=(b-R)*V,l[3]=0,l[4]=(M-w)*F,l[5]=(1-(S+g))*F,l[6]=(y+B)*F,l[7]=0,l[8]=(b+R)*L,l[9]=(y-B)*L,l[10]=(1-(S+E))*L,l[11]=0,l[12]=t.x,l[13]=t.y,l[14]=t.z,l[15]=1,this}decompose(t,i,s){const l=this.elements;let c=vr.set(l[0],l[1],l[2]).length();const h=vr.set(l[4],l[5],l[6]).length(),d=vr.set(l[8],l[9],l[10]).length();this.determinant()<0&&(c=-c),t.x=l[12],t.y=l[13],t.z=l[14],yi.copy(this);const p=1/c,_=1/h,v=1/d;return yi.elements[0]*=p,yi.elements[1]*=p,yi.elements[2]*=p,yi.elements[4]*=_,yi.elements[5]*=_,yi.elements[6]*=_,yi.elements[8]*=v,yi.elements[9]*=v,yi.elements[10]*=v,i.setFromRotationMatrix(yi),s.x=c,s.y=h,s.z=d,this}makePerspective(t,i,s,l,c,h,d=Oi,m=!1){const p=this.elements,_=2*c/(i-t),v=2*c/(s-l),S=(i+t)/(i-t),M=(s+l)/(s-l);let b,E;if(m)b=c/(h-c),E=h*c/(h-c);else if(d===Oi)b=-(h+c)/(h-c),E=-2*h*c/(h-c);else if(d===Vc)b=-h/(h-c),E=-h*c/(h-c);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return p[0]=_,p[4]=0,p[8]=S,p[12]=0,p[1]=0,p[5]=v,p[9]=M,p[13]=0,p[2]=0,p[6]=0,p[10]=b,p[14]=E,p[3]=0,p[7]=0,p[11]=-1,p[15]=0,this}makeOrthographic(t,i,s,l,c,h,d=Oi,m=!1){const p=this.elements,_=2/(i-t),v=2/(s-l),S=-(i+t)/(i-t),M=-(s+l)/(s-l);let b,E;if(m)b=1/(h-c),E=h/(h-c);else if(d===Oi)b=-2/(h-c),E=-(h+c)/(h-c);else if(d===Vc)b=-1/(h-c),E=-c/(h-c);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return p[0]=_,p[4]=0,p[8]=0,p[12]=S,p[1]=0,p[5]=v,p[9]=0,p[13]=M,p[2]=0,p[6]=0,p[10]=b,p[14]=E,p[3]=0,p[7]=0,p[11]=0,p[15]=1,this}equals(t){const i=this.elements,s=t.elements;for(let l=0;l<16;l++)if(i[l]!==s[l])return!1;return!0}fromArray(t,i=0){for(let s=0;s<16;s++)this.elements[s]=t[s+i];return this}toArray(t=[],i=0){const s=this.elements;return t[i]=s[0],t[i+1]=s[1],t[i+2]=s[2],t[i+3]=s[3],t[i+4]=s[4],t[i+5]=s[5],t[i+6]=s[6],t[i+7]=s[7],t[i+8]=s[8],t[i+9]=s[9],t[i+10]=s[10],t[i+11]=s[11],t[i+12]=s[12],t[i+13]=s[13],t[i+14]=s[14],t[i+15]=s[15],t}}const vr=new tt,yi=new Ze,hM=new tt(0,0,0),dM=new tt(1,1,1),Ha=new tt,gc=new tt,ni=new tt,$_=new Ze,t0=new Rs;class Ii{constructor(t=0,i=0,s=0,l=Ii.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=i,this._z=s,this._order=l}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,i,s,l=this._order){return this._x=t,this._y=i,this._z=s,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,i=this._order,s=!0){const l=t.elements,c=l[0],h=l[4],d=l[8],m=l[1],p=l[5],_=l[9],v=l[2],S=l[6],M=l[10];switch(i){case"XYZ":this._y=Math.asin(ye(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-_,M),this._z=Math.atan2(-h,c)):(this._x=Math.atan2(S,p),this._z=0);break;case"YXZ":this._x=Math.asin(-ye(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(d,M),this._z=Math.atan2(m,p)):(this._y=Math.atan2(-v,c),this._z=0);break;case"ZXY":this._x=Math.asin(ye(S,-1,1)),Math.abs(S)<.9999999?(this._y=Math.atan2(-v,M),this._z=Math.atan2(-h,p)):(this._y=0,this._z=Math.atan2(m,c));break;case"ZYX":this._y=Math.asin(-ye(v,-1,1)),Math.abs(v)<.9999999?(this._x=Math.atan2(S,M),this._z=Math.atan2(m,c)):(this._x=0,this._z=Math.atan2(-h,p));break;case"YZX":this._z=Math.asin(ye(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-_,p),this._y=Math.atan2(-v,c)):(this._x=0,this._y=Math.atan2(d,M));break;case"XZY":this._z=Math.asin(-ye(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(S,p),this._y=Math.atan2(d,c)):(this._x=Math.atan2(-_,M),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,s===!0&&this._onChangeCallback(),this}setFromQuaternion(t,i,s){return $_.makeRotationFromQuaternion(t),this.setFromRotationMatrix($_,i,s)}setFromVector3(t,i=this._order){return this.set(t.x,t.y,t.z,i)}reorder(t){return t0.setFromEuler(this),this.setFromQuaternion(t0,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],i=0){return t[i]=this._x,t[i+1]=this._y,t[i+2]=this._z,t[i+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ii.DEFAULT_ORDER="XYZ";class kd{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let pM=0;const e0=new tt,xr=new Rs,sa=new Ze,_c=new tt,Ho=new tt,mM=new tt,gM=new Rs,n0=new tt(1,0,0),i0=new tt(0,1,0),a0=new tt(0,0,1),s0={type:"added"},_M={type:"removed"},Sr={type:"childadded",child:null},Mh={type:"childremoved",child:null};class gn extends Ds{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:pM++}),this.uuid=Ko(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=gn.DEFAULT_UP.clone();const t=new tt,i=new Ii,s=new Rs,l=new tt(1,1,1);function c(){s.setFromEuler(i,!1)}function h(){i.setFromQuaternion(s,void 0,!1)}i._onChange(c),s._onChange(h),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new Ze},normalMatrix:{value:new me}}),this.matrix=new Ze,this.matrixWorld=new Ze,this.matrixAutoUpdate=gn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=gn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new kd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,i){this.quaternion.setFromAxisAngle(t,i)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,i){return xr.setFromAxisAngle(t,i),this.quaternion.multiply(xr),this}rotateOnWorldAxis(t,i){return xr.setFromAxisAngle(t,i),this.quaternion.premultiply(xr),this}rotateX(t){return this.rotateOnAxis(n0,t)}rotateY(t){return this.rotateOnAxis(i0,t)}rotateZ(t){return this.rotateOnAxis(a0,t)}translateOnAxis(t,i){return e0.copy(t).applyQuaternion(this.quaternion),this.position.add(e0.multiplyScalar(i)),this}translateX(t){return this.translateOnAxis(n0,t)}translateY(t){return this.translateOnAxis(i0,t)}translateZ(t){return this.translateOnAxis(a0,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(sa.copy(this.matrixWorld).invert())}lookAt(t,i,s){t.isVector3?_c.copy(t):_c.set(t,i,s);const l=this.parent;this.updateWorldMatrix(!0,!1),Ho.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?sa.lookAt(Ho,_c,this.up):sa.lookAt(_c,Ho,this.up),this.quaternion.setFromRotationMatrix(sa),l&&(sa.extractRotation(l.matrixWorld),xr.setFromRotationMatrix(sa),this.quaternion.premultiply(xr.invert()))}add(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(s0),Sr.child=t,this.dispatchEvent(Sr),Sr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const i=this.children.indexOf(t);return i!==-1&&(t.parent=null,this.children.splice(i,1),t.dispatchEvent(_M),Mh.child=t,this.dispatchEvent(Mh),Mh.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),sa.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),sa.multiply(t.parent.matrixWorld)),t.applyMatrix4(sa),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(s0),Sr.child=t,this.dispatchEvent(Sr),Sr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,i){if(this[t]===i)return this;for(let s=0,l=this.children.length;s<l;s++){const h=this.children[s].getObjectByProperty(t,i);if(h!==void 0)return h}}getObjectsByProperty(t,i,s=[]){this[t]===i&&s.push(this);const l=this.children;for(let c=0,h=l.length;c<h;c++)l[c].getObjectsByProperty(t,i,s);return s}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ho,t,mM),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ho,gM,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return t.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(t){t(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverseVisible(t)}traverseAncestors(t){const i=this.parent;i!==null&&(t(i),i.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].updateMatrixWorld(t)}updateWorldMatrix(t,i){const s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),i===!0){const l=this.children;for(let c=0,h=l.length;c<h;c++)l[c].updateWorldMatrix(!1,!0)}}toJSON(t){const i=t===void 0||typeof t=="string",s={};i&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.geometryInfo=this._geometryInfo.map(d=>({...d,boundingBox:d.boundingBox?d.boundingBox.toJSON():void 0,boundingSphere:d.boundingSphere?d.boundingSphere.toJSON():void 0})),l.instanceInfo=this._instanceInfo.map(d=>({...d})),l.availableInstanceIds=this._availableInstanceIds.slice(),l.availableGeometryIds=this._availableGeometryIds.slice(),l.nextIndexStart=this._nextIndexStart,l.nextVertexStart=this._nextVertexStart,l.geometryCount=this._geometryCount,l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.matricesTexture=this._matricesTexture.toJSON(t),l.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(l.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(l.boundingBox=this.boundingBox.toJSON()));function c(d,m){return d[m.uuid]===void 0&&(d[m.uuid]=m.toJSON(t)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=c(t.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const m=d.shapes;if(Array.isArray(m))for(let p=0,_=m.length;p<_;p++){const v=m[p];c(t.shapes,v)}else c(t.shapes,m)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(c(t.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let m=0,p=this.material.length;m<p;m++)d.push(c(t.materials,this.material[m]));l.material=d}else l.material=c(t.materials,this.material);if(this.children.length>0){l.children=[];for(let d=0;d<this.children.length;d++)l.children.push(this.children[d].toJSON(t).object)}if(this.animations.length>0){l.animations=[];for(let d=0;d<this.animations.length;d++){const m=this.animations[d];l.animations.push(c(t.animations,m))}}if(i){const d=h(t.geometries),m=h(t.materials),p=h(t.textures),_=h(t.images),v=h(t.shapes),S=h(t.skeletons),M=h(t.animations),b=h(t.nodes);d.length>0&&(s.geometries=d),m.length>0&&(s.materials=m),p.length>0&&(s.textures=p),_.length>0&&(s.images=_),v.length>0&&(s.shapes=v),S.length>0&&(s.skeletons=S),M.length>0&&(s.animations=M),b.length>0&&(s.nodes=b)}return s.object=l,s;function h(d){const m=[];for(const p in d){const _=d[p];delete _.metadata,m.push(_)}return m}}clone(t){return new this.constructor().copy(this,t)}copy(t,i=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),i===!0)for(let s=0;s<t.children.length;s++){const l=t.children[s];this.add(l.clone())}return this}}gn.DEFAULT_UP=new tt(0,1,0);gn.DEFAULT_MATRIX_AUTO_UPDATE=!0;gn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Mi=new tt,ra=new tt,Eh=new tt,oa=new tt,yr=new tt,Mr=new tt,r0=new tt,bh=new tt,Th=new tt,Ah=new tt,Rh=new en,Ch=new en,wh=new en;class Ei{constructor(t=new tt,i=new tt,s=new tt){this.a=t,this.b=i,this.c=s}static getNormal(t,i,s,l){l.subVectors(s,i),Mi.subVectors(t,i),l.cross(Mi);const c=l.lengthSq();return c>0?l.multiplyScalar(1/Math.sqrt(c)):l.set(0,0,0)}static getBarycoord(t,i,s,l,c){Mi.subVectors(l,i),ra.subVectors(s,i),Eh.subVectors(t,i);const h=Mi.dot(Mi),d=Mi.dot(ra),m=Mi.dot(Eh),p=ra.dot(ra),_=ra.dot(Eh),v=h*p-d*d;if(v===0)return c.set(0,0,0),null;const S=1/v,M=(p*m-d*_)*S,b=(h*_-d*m)*S;return c.set(1-M-b,b,M)}static containsPoint(t,i,s,l){return this.getBarycoord(t,i,s,l,oa)===null?!1:oa.x>=0&&oa.y>=0&&oa.x+oa.y<=1}static getInterpolation(t,i,s,l,c,h,d,m){return this.getBarycoord(t,i,s,l,oa)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(c,oa.x),m.addScaledVector(h,oa.y),m.addScaledVector(d,oa.z),m)}static getInterpolatedAttribute(t,i,s,l,c,h){return Rh.setScalar(0),Ch.setScalar(0),wh.setScalar(0),Rh.fromBufferAttribute(t,i),Ch.fromBufferAttribute(t,s),wh.fromBufferAttribute(t,l),h.setScalar(0),h.addScaledVector(Rh,c.x),h.addScaledVector(Ch,c.y),h.addScaledVector(wh,c.z),h}static isFrontFacing(t,i,s,l){return Mi.subVectors(s,i),ra.subVectors(t,i),Mi.cross(ra).dot(l)<0}set(t,i,s){return this.a.copy(t),this.b.copy(i),this.c.copy(s),this}setFromPointsAndIndices(t,i,s,l){return this.a.copy(t[i]),this.b.copy(t[s]),this.c.copy(t[l]),this}setFromAttributeAndIndices(t,i,s,l){return this.a.fromBufferAttribute(t,i),this.b.fromBufferAttribute(t,s),this.c.fromBufferAttribute(t,l),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Mi.subVectors(this.c,this.b),ra.subVectors(this.a,this.b),Mi.cross(ra).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ei.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,i){return Ei.getBarycoord(t,this.a,this.b,this.c,i)}getInterpolation(t,i,s,l,c){return Ei.getInterpolation(t,this.a,this.b,this.c,i,s,l,c)}containsPoint(t){return Ei.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ei.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,i){const s=this.a,l=this.b,c=this.c;let h,d;yr.subVectors(l,s),Mr.subVectors(c,s),bh.subVectors(t,s);const m=yr.dot(bh),p=Mr.dot(bh);if(m<=0&&p<=0)return i.copy(s);Th.subVectors(t,l);const _=yr.dot(Th),v=Mr.dot(Th);if(_>=0&&v<=_)return i.copy(l);const S=m*v-_*p;if(S<=0&&m>=0&&_<=0)return h=m/(m-_),i.copy(s).addScaledVector(yr,h);Ah.subVectors(t,c);const M=yr.dot(Ah),b=Mr.dot(Ah);if(b>=0&&M<=b)return i.copy(c);const E=M*p-m*b;if(E<=0&&p>=0&&b<=0)return d=p/(p-b),i.copy(s).addScaledVector(Mr,d);const y=_*b-M*v;if(y<=0&&v-_>=0&&M-b>=0)return r0.subVectors(c,l),d=(v-_)/(v-_+(M-b)),i.copy(l).addScaledVector(r0,d);const g=1/(y+E+S);return h=E*g,d=S*g,i.copy(s).addScaledVector(yr,h).addScaledVector(Mr,d)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const xv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ga={h:0,s:0,l:0},vc={h:0,s:0,l:0};function Dh(r,t,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?r+(t-r)*6*i:i<1/2?t:i<2/3?r+(t-r)*6*(2/3-i):r}class Me{constructor(t,i,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,i,s)}set(t,i,s){if(i===void 0&&s===void 0){const l=t;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(t,i,s);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,i=mi){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Ue.colorSpaceToWorking(this,i),this}setRGB(t,i,s,l=Ue.workingColorSpace){return this.r=t,this.g=i,this.b=s,Ue.colorSpaceToWorking(this,l),this}setHSL(t,i,s,l=Ue.workingColorSpace){if(t=eM(t,1),i=ye(i,0,1),s=ye(s,0,1),i===0)this.r=this.g=this.b=s;else{const c=s<=.5?s*(1+i):s+i-s*i,h=2*s-c;this.r=Dh(h,c,t+1/3),this.g=Dh(h,c,t),this.b=Dh(h,c,t-1/3)}return Ue.colorSpaceToWorking(this,l),this}setStyle(t,i=mi){function s(c){c!==void 0&&parseFloat(c)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(t)){let c;const h=l[1],d=l[2];switch(h){case"rgb":case"rgba":if(c=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(c[4]),this.setRGB(Math.min(255,parseInt(c[1],10))/255,Math.min(255,parseInt(c[2],10))/255,Math.min(255,parseInt(c[3],10))/255,i);if(c=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(c[4]),this.setRGB(Math.min(100,parseInt(c[1],10))/100,Math.min(100,parseInt(c[2],10))/100,Math.min(100,parseInt(c[3],10))/100,i);break;case"hsl":case"hsla":if(c=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return s(c[4]),this.setHSL(parseFloat(c[1])/360,parseFloat(c[2])/100,parseFloat(c[3])/100,i);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(t)){const c=l[1],h=c.length;if(h===3)return this.setRGB(parseInt(c.charAt(0),16)/15,parseInt(c.charAt(1),16)/15,parseInt(c.charAt(2),16)/15,i);if(h===6)return this.setHex(parseInt(c,16),i);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,i);return this}setColorName(t,i=mi){const s=xv[t.toLowerCase()];return s!==void 0?this.setHex(s,i):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=fa(t.r),this.g=fa(t.g),this.b=fa(t.b),this}copyLinearToSRGB(t){return this.r=Pr(t.r),this.g=Pr(t.g),this.b=Pr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=mi){return Ue.workingToColorSpace(Ln.copy(this),t),Math.round(ye(Ln.r*255,0,255))*65536+Math.round(ye(Ln.g*255,0,255))*256+Math.round(ye(Ln.b*255,0,255))}getHexString(t=mi){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,i=Ue.workingColorSpace){Ue.workingToColorSpace(Ln.copy(this),i);const s=Ln.r,l=Ln.g,c=Ln.b,h=Math.max(s,l,c),d=Math.min(s,l,c);let m,p;const _=(d+h)/2;if(d===h)m=0,p=0;else{const v=h-d;switch(p=_<=.5?v/(h+d):v/(2-h-d),h){case s:m=(l-c)/v+(l<c?6:0);break;case l:m=(c-s)/v+2;break;case c:m=(s-l)/v+4;break}m/=6}return t.h=m,t.s=p,t.l=_,t}getRGB(t,i=Ue.workingColorSpace){return Ue.workingToColorSpace(Ln.copy(this),i),t.r=Ln.r,t.g=Ln.g,t.b=Ln.b,t}getStyle(t=mi){Ue.workingToColorSpace(Ln.copy(this),t);const i=Ln.r,s=Ln.g,l=Ln.b;return t!==mi?`color(${t} ${i.toFixed(3)} ${s.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(s*255)},${Math.round(l*255)})`}offsetHSL(t,i,s){return this.getHSL(Ga),this.setHSL(Ga.h+t,Ga.s+i,Ga.l+s)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,i){return this.r=t.r+i.r,this.g=t.g+i.g,this.b=t.b+i.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,i){return this.r+=(t.r-this.r)*i,this.g+=(t.g-this.g)*i,this.b+=(t.b-this.b)*i,this}lerpColors(t,i,s){return this.r=t.r+(i.r-t.r)*s,this.g=t.g+(i.g-t.g)*s,this.b=t.b+(i.b-t.b)*s,this}lerpHSL(t,i){this.getHSL(Ga),t.getHSL(vc);const s=hh(Ga.h,vc.h,i),l=hh(Ga.s,vc.s,i),c=hh(Ga.l,vc.l,i);return this.setHSL(s,l,c),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const i=this.r,s=this.g,l=this.b,c=t.elements;return this.r=c[0]*i+c[3]*s+c[6]*l,this.g=c[1]*i+c[4]*s+c[7]*l,this.b=c[2]*i+c[5]*s+c[8]*l,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,i=0){return this.r=t[i],this.g=t[i+1],this.b=t[i+2],this}toArray(t=[],i=0){return t[i]=this.r,t[i+1]=this.g,t[i+2]=this.b,t}fromBufferAttribute(t,i){return this.r=t.getX(i),this.g=t.getY(i),this.b=t.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ln=new Me;Me.NAMES=xv;let vM=0;class Gr extends Ds{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:vM++}),this.uuid=Ko(),this.name="",this.type="Material",this.blending=Lr,this.side=qa,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Wh,this.blendDst=qh,this.blendEquation=ys,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Me(0,0,0),this.blendAlpha=0,this.depthFunc=zr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=W_,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=dr,this.stencilZFail=dr,this.stencilZPass=dr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const i in t){const s=t[i];if(s===void 0){console.warn(`THREE.Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(s):l&&l.isVector3&&s&&s.isVector3?l.copy(s):this[i]=s}}toJSON(t){const i=t===void 0||typeof t=="string";i&&(t={textures:{},images:{}});const s={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(s.dispersion=this.dispersion),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(t).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(t).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(t).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(t).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(t).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapRotation!==void 0&&(s.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.shadowSide!==null&&(s.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),this.blending!==Lr&&(s.blending=this.blending),this.side!==qa&&(s.side=this.side),this.vertexColors===!0&&(s.vertexColors=!0),this.opacity<1&&(s.opacity=this.opacity),this.transparent===!0&&(s.transparent=!0),this.blendSrc!==Wh&&(s.blendSrc=this.blendSrc),this.blendDst!==qh&&(s.blendDst=this.blendDst),this.blendEquation!==ys&&(s.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(s.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(s.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(s.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(s.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(s.blendAlpha=this.blendAlpha),this.depthFunc!==zr&&(s.depthFunc=this.depthFunc),this.depthTest===!1&&(s.depthTest=this.depthTest),this.depthWrite===!1&&(s.depthWrite=this.depthWrite),this.colorWrite===!1&&(s.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(s.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==W_&&(s.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(s.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(s.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==dr&&(s.stencilFail=this.stencilFail),this.stencilZFail!==dr&&(s.stencilZFail=this.stencilZFail),this.stencilZPass!==dr&&(s.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(s.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(s.rotation=this.rotation),this.polygonOffset===!0&&(s.polygonOffset=!0),this.polygonOffsetFactor!==0&&(s.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(s.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(s.linewidth=this.linewidth),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.dithering===!0&&(s.dithering=!0),this.alphaTest>0&&(s.alphaTest=this.alphaTest),this.alphaHash===!0&&(s.alphaHash=!0),this.alphaToCoverage===!0&&(s.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(s.premultipliedAlpha=!0),this.forceSinglePass===!0&&(s.forceSinglePass=!0),this.wireframe===!0&&(s.wireframe=!0),this.wireframeLinewidth>1&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(s.flatShading=!0),this.visible===!1&&(s.visible=!1),this.toneMapped===!1&&(s.toneMapped=!1),this.fog===!1&&(s.fog=!1),Object.keys(this.userData).length>0&&(s.userData=this.userData);function l(c){const h=[];for(const d in c){const m=c[d];delete m.metadata,h.push(m)}return h}if(i){const c=l(t.textures),h=l(t.images);c.length>0&&(s.textures=c),h.length>0&&(s.images=h)}return s}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const i=t.clippingPlanes;let s=null;if(i!==null){const l=i.length;s=new Array(l);for(let c=0;c!==l;++c)s[c]=i[c].clone()}return this.clippingPlanes=s,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class ca extends Gr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ii,this.combine=sv,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const fn=new tt,xc=new ue;let xM=0;class Pi{constructor(t,i,s=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:xM++}),this.name="",this.array=t,this.itemSize=i,this.count=t!==void 0?t.length/i:0,this.normalized=s,this.usage=q_,this.updateRanges=[],this.gpuType=ua,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,i){this.updateRanges.push({start:t,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,i,s){t*=this.itemSize,s*=i.itemSize;for(let l=0,c=this.itemSize;l<c;l++)this.array[t+l]=i.array[s+l];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let i=0,s=this.count;i<s;i++)xc.fromBufferAttribute(this,i),xc.applyMatrix3(t),this.setXY(i,xc.x,xc.y);else if(this.itemSize===3)for(let i=0,s=this.count;i<s;i++)fn.fromBufferAttribute(this,i),fn.applyMatrix3(t),this.setXYZ(i,fn.x,fn.y,fn.z);return this}applyMatrix4(t){for(let i=0,s=this.count;i<s;i++)fn.fromBufferAttribute(this,i),fn.applyMatrix4(t),this.setXYZ(i,fn.x,fn.y,fn.z);return this}applyNormalMatrix(t){for(let i=0,s=this.count;i<s;i++)fn.fromBufferAttribute(this,i),fn.applyNormalMatrix(t),this.setXYZ(i,fn.x,fn.y,fn.z);return this}transformDirection(t){for(let i=0,s=this.count;i<s;i++)fn.fromBufferAttribute(this,i),fn.transformDirection(t),this.setXYZ(i,fn.x,fn.y,fn.z);return this}set(t,i=0){return this.array.set(t,i),this}getComponent(t,i){let s=this.array[t*this.itemSize+i];return this.normalized&&(s=Io(s,this.array)),s}setComponent(t,i,s){return this.normalized&&(s=Xn(s,this.array)),this.array[t*this.itemSize+i]=s,this}getX(t){let i=this.array[t*this.itemSize];return this.normalized&&(i=Io(i,this.array)),i}setX(t,i){return this.normalized&&(i=Xn(i,this.array)),this.array[t*this.itemSize]=i,this}getY(t){let i=this.array[t*this.itemSize+1];return this.normalized&&(i=Io(i,this.array)),i}setY(t,i){return this.normalized&&(i=Xn(i,this.array)),this.array[t*this.itemSize+1]=i,this}getZ(t){let i=this.array[t*this.itemSize+2];return this.normalized&&(i=Io(i,this.array)),i}setZ(t,i){return this.normalized&&(i=Xn(i,this.array)),this.array[t*this.itemSize+2]=i,this}getW(t){let i=this.array[t*this.itemSize+3];return this.normalized&&(i=Io(i,this.array)),i}setW(t,i){return this.normalized&&(i=Xn(i,this.array)),this.array[t*this.itemSize+3]=i,this}setXY(t,i,s){return t*=this.itemSize,this.normalized&&(i=Xn(i,this.array),s=Xn(s,this.array)),this.array[t+0]=i,this.array[t+1]=s,this}setXYZ(t,i,s,l){return t*=this.itemSize,this.normalized&&(i=Xn(i,this.array),s=Xn(s,this.array),l=Xn(l,this.array)),this.array[t+0]=i,this.array[t+1]=s,this.array[t+2]=l,this}setXYZW(t,i,s,l,c){return t*=this.itemSize,this.normalized&&(i=Xn(i,this.array),s=Xn(s,this.array),l=Xn(l,this.array),c=Xn(c,this.array)),this.array[t+0]=i,this.array[t+1]=s,this.array[t+2]=l,this.array[t+3]=c,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==q_&&(t.usage=this.usage),t}}class Sv extends Pi{constructor(t,i,s){super(new Uint16Array(t),i,s)}}class yv extends Pi{constructor(t,i,s){super(new Uint32Array(t),i,s)}}class mn extends Pi{constructor(t,i,s){super(new Float32Array(t),i,s)}}let SM=0;const pi=new Ze,Uh=new gn,Er=new tt,ii=new Qo,Go=new Qo,yn=new tt;class Mn extends Ds{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:SM++}),this.uuid=Ko(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(_v(t)?yv:Sv)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,i){return this.attributes[t]=i,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,i,s=0){this.groups.push({start:t,count:i,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(t,i){this.drawRange.start=t,this.drawRange.count=i}applyMatrix4(t){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(t),i.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const c=new me().getNormalMatrix(t);s.applyNormalMatrix(c),s.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(t),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return pi.makeRotationFromQuaternion(t),this.applyMatrix4(pi),this}rotateX(t){return pi.makeRotationX(t),this.applyMatrix4(pi),this}rotateY(t){return pi.makeRotationY(t),this.applyMatrix4(pi),this}rotateZ(t){return pi.makeRotationZ(t),this.applyMatrix4(pi),this}translate(t,i,s){return pi.makeTranslation(t,i,s),this.applyMatrix4(pi),this}scale(t,i,s){return pi.makeScale(t,i,s),this.applyMatrix4(pi),this}lookAt(t){return Uh.lookAt(t),Uh.updateMatrix(),this.applyMatrix4(Uh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Er).negate(),this.translate(Er.x,Er.y,Er.z),this}setFromPoints(t){const i=this.getAttribute("position");if(i===void 0){const s=[];for(let l=0,c=t.length;l<c;l++){const h=t[l];s.push(h.x,h.y,h.z||0)}this.setAttribute("position",new mn(s,3))}else{const s=Math.min(t.length,i.count);for(let l=0;l<s;l++){const c=t[l];i.setXYZ(l,c.x,c.y,c.z||0)}t.length>i.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qo);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new tt(-1/0,-1/0,-1/0),new tt(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),i)for(let s=0,l=i.length;s<l;s++){const c=i[s];ii.setFromBufferAttribute(c),this.morphTargetsRelative?(yn.addVectors(this.boundingBox.min,ii.min),this.boundingBox.expandByPoint(yn),yn.addVectors(this.boundingBox.max,ii.max),this.boundingBox.expandByPoint(yn)):(this.boundingBox.expandByPoint(ii.min),this.boundingBox.expandByPoint(ii.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qc);const t=this.attributes.position,i=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new tt,1/0);return}if(t){const s=this.boundingSphere.center;if(ii.setFromBufferAttribute(t),i)for(let c=0,h=i.length;c<h;c++){const d=i[c];Go.setFromBufferAttribute(d),this.morphTargetsRelative?(yn.addVectors(ii.min,Go.min),ii.expandByPoint(yn),yn.addVectors(ii.max,Go.max),ii.expandByPoint(yn)):(ii.expandByPoint(Go.min),ii.expandByPoint(Go.max))}ii.getCenter(s);let l=0;for(let c=0,h=t.count;c<h;c++)yn.fromBufferAttribute(t,c),l=Math.max(l,s.distanceToSquared(yn));if(i)for(let c=0,h=i.length;c<h;c++){const d=i[c],m=this.morphTargetsRelative;for(let p=0,_=d.count;p<_;p++)yn.fromBufferAttribute(d,p),m&&(Er.fromBufferAttribute(t,p),yn.add(Er)),l=Math.max(l,s.distanceToSquared(yn))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,i=this.attributes;if(t===null||i.position===void 0||i.normal===void 0||i.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=i.position,l=i.normal,c=i.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Pi(new Float32Array(4*s.count),4));const h=this.getAttribute("tangent"),d=[],m=[];for(let X=0;X<s.count;X++)d[X]=new tt,m[X]=new tt;const p=new tt,_=new tt,v=new tt,S=new ue,M=new ue,b=new ue,E=new tt,y=new tt;function g(X,U,D){p.fromBufferAttribute(s,X),_.fromBufferAttribute(s,U),v.fromBufferAttribute(s,D),S.fromBufferAttribute(c,X),M.fromBufferAttribute(c,U),b.fromBufferAttribute(c,D),_.sub(p),v.sub(p),M.sub(S),b.sub(S);const z=1/(M.x*b.y-b.x*M.y);isFinite(z)&&(E.copy(_).multiplyScalar(b.y).addScaledVector(v,-M.y).multiplyScalar(z),y.copy(v).multiplyScalar(M.x).addScaledVector(_,-b.x).multiplyScalar(z),d[X].add(E),d[U].add(E),d[D].add(E),m[X].add(y),m[U].add(y),m[D].add(y))}let B=this.groups;B.length===0&&(B=[{start:0,count:t.count}]);for(let X=0,U=B.length;X<U;++X){const D=B[X],z=D.start,lt=D.count;for(let st=z,dt=z+lt;st<dt;st+=3)g(t.getX(st+0),t.getX(st+1),t.getX(st+2))}const R=new tt,w=new tt,V=new tt,F=new tt;function L(X){V.fromBufferAttribute(l,X),F.copy(V);const U=d[X];R.copy(U),R.sub(V.multiplyScalar(V.dot(U))).normalize(),w.crossVectors(F,U);const z=w.dot(m[X])<0?-1:1;h.setXYZW(X,R.x,R.y,R.z,z)}for(let X=0,U=B.length;X<U;++X){const D=B[X],z=D.start,lt=D.count;for(let st=z,dt=z+lt;st<dt;st+=3)L(t.getX(st+0)),L(t.getX(st+1)),L(t.getX(st+2))}}computeVertexNormals(){const t=this.index,i=this.getAttribute("position");if(i!==void 0){let s=this.getAttribute("normal");if(s===void 0)s=new Pi(new Float32Array(i.count*3),3),this.setAttribute("normal",s);else for(let S=0,M=s.count;S<M;S++)s.setXYZ(S,0,0,0);const l=new tt,c=new tt,h=new tt,d=new tt,m=new tt,p=new tt,_=new tt,v=new tt;if(t)for(let S=0,M=t.count;S<M;S+=3){const b=t.getX(S+0),E=t.getX(S+1),y=t.getX(S+2);l.fromBufferAttribute(i,b),c.fromBufferAttribute(i,E),h.fromBufferAttribute(i,y),_.subVectors(h,c),v.subVectors(l,c),_.cross(v),d.fromBufferAttribute(s,b),m.fromBufferAttribute(s,E),p.fromBufferAttribute(s,y),d.add(_),m.add(_),p.add(_),s.setXYZ(b,d.x,d.y,d.z),s.setXYZ(E,m.x,m.y,m.z),s.setXYZ(y,p.x,p.y,p.z)}else for(let S=0,M=i.count;S<M;S+=3)l.fromBufferAttribute(i,S+0),c.fromBufferAttribute(i,S+1),h.fromBufferAttribute(i,S+2),_.subVectors(h,c),v.subVectors(l,c),_.cross(v),s.setXYZ(S+0,_.x,_.y,_.z),s.setXYZ(S+1,_.x,_.y,_.z),s.setXYZ(S+2,_.x,_.y,_.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let i=0,s=t.count;i<s;i++)yn.fromBufferAttribute(t,i),yn.normalize(),t.setXYZ(i,yn.x,yn.y,yn.z)}toNonIndexed(){function t(d,m){const p=d.array,_=d.itemSize,v=d.normalized,S=new p.constructor(m.length*_);let M=0,b=0;for(let E=0,y=m.length;E<y;E++){d.isInterleavedBufferAttribute?M=m[E]*d.data.stride+d.offset:M=m[E]*_;for(let g=0;g<_;g++)S[b++]=p[M++]}return new Pi(S,_,v)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new Mn,s=this.index.array,l=this.attributes;for(const d in l){const m=l[d],p=t(m,s);i.setAttribute(d,p)}const c=this.morphAttributes;for(const d in c){const m=[],p=c[d];for(let _=0,v=p.length;_<v;_++){const S=p[_],M=t(S,s);m.push(M)}i.morphAttributes[d]=m}i.morphTargetsRelative=this.morphTargetsRelative;const h=this.groups;for(let d=0,m=h.length;d<m;d++){const p=h[d];i.addGroup(p.start,p.count,p.materialIndex)}return i}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const p in m)m[p]!==void 0&&(t[p]=m[p]);return t}t.data={attributes:{}};const i=this.index;i!==null&&(t.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const s=this.attributes;for(const m in s){const p=s[m];t.data.attributes[m]=p.toJSON(t.data)}const l={};let c=!1;for(const m in this.morphAttributes){const p=this.morphAttributes[m],_=[];for(let v=0,S=p.length;v<S;v++){const M=p[v];_.push(M.toJSON(t.data))}_.length>0&&(l[m]=_,c=!0)}c&&(t.data.morphAttributes=l,t.data.morphTargetsRelative=this.morphTargetsRelative);const h=this.groups;h.length>0&&(t.data.groups=JSON.parse(JSON.stringify(h)));const d=this.boundingSphere;return d!==null&&(t.data.boundingSphere=d.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=t.name;const s=t.index;s!==null&&this.setIndex(s.clone());const l=t.attributes;for(const p in l){const _=l[p];this.setAttribute(p,_.clone(i))}const c=t.morphAttributes;for(const p in c){const _=[],v=c[p];for(let S=0,M=v.length;S<M;S++)_.push(v[S].clone(i));this.morphAttributes[p]=_}this.morphTargetsRelative=t.morphTargetsRelative;const h=t.groups;for(let p=0,_=h.length;p<_;p++){const v=h[p];this.addGroup(v.start,v.count,v.materialIndex)}const d=t.boundingBox;d!==null&&(this.boundingBox=d.clone());const m=t.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const o0=new Ze,gs=new Yc,Sc=new qc,l0=new tt,yc=new tt,Mc=new tt,Ec=new tt,Nh=new tt,bc=new tt,c0=new tt,Tc=new tt;class wn extends gn{constructor(t=new Mn,i=new ca){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,i){return super.copy(t,i),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,s=Object.keys(i);if(s.length>0){const l=i[s[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,h=l.length;c<h;c++){const d=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=c}}}}getVertexPosition(t,i){const s=this.geometry,l=s.attributes.position,c=s.morphAttributes.position,h=s.morphTargetsRelative;i.fromBufferAttribute(l,t);const d=this.morphTargetInfluences;if(c&&d){bc.set(0,0,0);for(let m=0,p=c.length;m<p;m++){const _=d[m],v=c[m];_!==0&&(Nh.fromBufferAttribute(v,t),h?bc.addScaledVector(Nh,_):bc.addScaledVector(Nh.sub(i),_))}i.add(bc)}return i}raycast(t,i){const s=this.geometry,l=this.material,c=this.matrixWorld;l!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),Sc.copy(s.boundingSphere),Sc.applyMatrix4(c),gs.copy(t.ray).recast(t.near),!(Sc.containsPoint(gs.origin)===!1&&(gs.intersectSphere(Sc,l0)===null||gs.origin.distanceToSquared(l0)>(t.far-t.near)**2))&&(o0.copy(c).invert(),gs.copy(t.ray).applyMatrix4(o0),!(s.boundingBox!==null&&gs.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(t,i,gs)))}_computeIntersections(t,i,s){let l;const c=this.geometry,h=this.material,d=c.index,m=c.attributes.position,p=c.attributes.uv,_=c.attributes.uv1,v=c.attributes.normal,S=c.groups,M=c.drawRange;if(d!==null)if(Array.isArray(h))for(let b=0,E=S.length;b<E;b++){const y=S[b],g=h[y.materialIndex],B=Math.max(y.start,M.start),R=Math.min(d.count,Math.min(y.start+y.count,M.start+M.count));for(let w=B,V=R;w<V;w+=3){const F=d.getX(w),L=d.getX(w+1),X=d.getX(w+2);l=Ac(this,g,t,s,p,_,v,F,L,X),l&&(l.faceIndex=Math.floor(w/3),l.face.materialIndex=y.materialIndex,i.push(l))}}else{const b=Math.max(0,M.start),E=Math.min(d.count,M.start+M.count);for(let y=b,g=E;y<g;y+=3){const B=d.getX(y),R=d.getX(y+1),w=d.getX(y+2);l=Ac(this,h,t,s,p,_,v,B,R,w),l&&(l.faceIndex=Math.floor(y/3),i.push(l))}}else if(m!==void 0)if(Array.isArray(h))for(let b=0,E=S.length;b<E;b++){const y=S[b],g=h[y.materialIndex],B=Math.max(y.start,M.start),R=Math.min(m.count,Math.min(y.start+y.count,M.start+M.count));for(let w=B,V=R;w<V;w+=3){const F=w,L=w+1,X=w+2;l=Ac(this,g,t,s,p,_,v,F,L,X),l&&(l.faceIndex=Math.floor(w/3),l.face.materialIndex=y.materialIndex,i.push(l))}}else{const b=Math.max(0,M.start),E=Math.min(m.count,M.start+M.count);for(let y=b,g=E;y<g;y+=3){const B=y,R=y+1,w=y+2;l=Ac(this,h,t,s,p,_,v,B,R,w),l&&(l.faceIndex=Math.floor(y/3),i.push(l))}}}}function yM(r,t,i,s,l,c,h,d){let m;if(t.side===Wn?m=s.intersectTriangle(h,c,l,!0,d):m=s.intersectTriangle(l,c,h,t.side===qa,d),m===null)return null;Tc.copy(d),Tc.applyMatrix4(r.matrixWorld);const p=i.ray.origin.distanceTo(Tc);return p<i.near||p>i.far?null:{distance:p,point:Tc.clone(),object:r}}function Ac(r,t,i,s,l,c,h,d,m,p){r.getVertexPosition(d,yc),r.getVertexPosition(m,Mc),r.getVertexPosition(p,Ec);const _=yM(r,t,i,s,yc,Mc,Ec,c0);if(_){const v=new tt;Ei.getBarycoord(c0,yc,Mc,Ec,v),l&&(_.uv=Ei.getInterpolatedAttribute(l,d,m,p,v,new ue)),c&&(_.uv1=Ei.getInterpolatedAttribute(c,d,m,p,v,new ue)),h&&(_.normal=Ei.getInterpolatedAttribute(h,d,m,p,v,new tt),_.normal.dot(s.direction)>0&&_.normal.multiplyScalar(-1));const S={a:d,b:m,c:p,normal:new tt,materialIndex:0};Ei.getNormal(yc,Mc,Ec,S.normal),_.face=S,_.barycoord=v}return _}class Jo extends Mn{constructor(t=1,i=1,s=1,l=1,c=1,h=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:i,depth:s,widthSegments:l,heightSegments:c,depthSegments:h};const d=this;l=Math.floor(l),c=Math.floor(c),h=Math.floor(h);const m=[],p=[],_=[],v=[];let S=0,M=0;b("z","y","x",-1,-1,s,i,t,h,c,0),b("z","y","x",1,-1,s,i,-t,h,c,1),b("x","z","y",1,1,t,s,i,l,h,2),b("x","z","y",1,-1,t,s,-i,l,h,3),b("x","y","z",1,-1,t,i,s,l,c,4),b("x","y","z",-1,-1,t,i,-s,l,c,5),this.setIndex(m),this.setAttribute("position",new mn(p,3)),this.setAttribute("normal",new mn(_,3)),this.setAttribute("uv",new mn(v,2));function b(E,y,g,B,R,w,V,F,L,X,U){const D=w/L,z=V/X,lt=w/2,st=V/2,dt=F/2,et=L+1,I=X+1;let Y=0,q=0;const $=new tt;for(let rt=0;rt<I;rt++){const N=rt*z-st;for(let W=0;W<et;W++){const vt=W*D-lt;$[E]=vt*B,$[y]=N*R,$[g]=dt,p.push($.x,$.y,$.z),$[E]=0,$[y]=0,$[g]=F>0?1:-1,_.push($.x,$.y,$.z),v.push(W/L),v.push(1-rt/X),Y+=1}}for(let rt=0;rt<X;rt++)for(let N=0;N<L;N++){const W=S+N+et*rt,vt=S+N+et*(rt+1),Mt=S+(N+1)+et*(rt+1),K=S+(N+1)+et*rt;m.push(W,vt,K),m.push(vt,Mt,K),q+=6}d.addGroup(M,q,U),M+=q,S+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Jo(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Hr(r){const t={};for(const i in r){t[i]={};for(const s in r[i]){const l=r[i][s];l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)?l.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[i][s]=null):t[i][s]=l.clone():Array.isArray(l)?t[i][s]=l.slice():t[i][s]=l}}return t}function In(r){const t={};for(let i=0;i<r.length;i++){const s=Hr(r[i]);for(const l in s)t[l]=s[l]}return t}function MM(r){const t=[];for(let i=0;i<r.length;i++)t.push(r[i].clone());return t}function Mv(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Ue.workingColorSpace}const EM={clone:Hr,merge:In};var bM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,TM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ya extends Gr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=bM,this.fragmentShader=TM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Hr(t.uniforms),this.uniformsGroups=MM(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const i=super.toJSON(t);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const h=this.uniforms[l].value;h&&h.isTexture?i.uniforms[l]={type:"t",value:h.toJSON(t).uuid}:h&&h.isColor?i.uniforms[l]={type:"c",value:h.getHex()}:h&&h.isVector2?i.uniforms[l]={type:"v2",value:h.toArray()}:h&&h.isVector3?i.uniforms[l]={type:"v3",value:h.toArray()}:h&&h.isVector4?i.uniforms[l]={type:"v4",value:h.toArray()}:h&&h.isMatrix3?i.uniforms[l]={type:"m3",value:h.toArray()}:h&&h.isMatrix4?i.uniforms[l]={type:"m4",value:h.toArray()}:i.uniforms[l]={value:h}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const s={};for(const l in this.extensions)this.extensions[l]===!0&&(s[l]=!0);return Object.keys(s).length>0&&(i.extensions=s),i}}class Ev extends gn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ze,this.projectionMatrix=new Ze,this.projectionMatrixInverse=new Ze,this.coordinateSystem=Oi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,i){return super.copy(t,i),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,i){super.updateWorldMatrix(t,i),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Va=new tt,u0=new ue,f0=new ue;class gi extends Ev{constructor(t=50,i=1,s=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=s,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const i=.5*this.getFilmHeight()/t;this.fov=Ud*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Fc*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ud*2*Math.atan(Math.tan(Fc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,i,s){Va.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Va.x,Va.y).multiplyScalar(-t/Va.z),Va.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),s.set(Va.x,Va.y).multiplyScalar(-t/Va.z)}getViewSize(t,i){return this.getViewBounds(t,u0,f0),i.subVectors(f0,u0)}setViewOffset(t,i,s,l,c,h){this.aspect=t/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=c,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let i=t*Math.tan(Fc*.5*this.fov)/this.zoom,s=2*i,l=this.aspect*s,c=-.5*l;const h=this.view;if(this.view!==null&&this.view.enabled){const m=h.fullWidth,p=h.fullHeight;c+=h.offsetX*l/m,i-=h.offsetY*s/p,l*=h.width/m,s*=h.height/p}const d=this.filmOffset;d!==0&&(c+=t*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(c,c+l,i,i-s,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}const br=-90,Tr=1;class AM extends gn{constructor(t,i,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new gi(br,Tr,t,i);l.layers=this.layers,this.add(l);const c=new gi(br,Tr,t,i);c.layers=this.layers,this.add(c);const h=new gi(br,Tr,t,i);h.layers=this.layers,this.add(h);const d=new gi(br,Tr,t,i);d.layers=this.layers,this.add(d);const m=new gi(br,Tr,t,i);m.layers=this.layers,this.add(m);const p=new gi(br,Tr,t,i);p.layers=this.layers,this.add(p)}updateCoordinateSystem(){const t=this.coordinateSystem,i=this.children.concat(),[s,l,c,h,d,m]=i;for(const p of i)this.remove(p);if(t===Oi)s.up.set(0,1,0),s.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),c.up.set(0,0,-1),c.lookAt(0,1,0),h.up.set(0,0,1),h.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(t===Vc)s.up.set(0,-1,0),s.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),c.up.set(0,0,1),c.lookAt(0,1,0),h.up.set(0,0,-1),h.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const p of i)this.add(p),p.updateMatrixWorld()}update(t,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:l}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[c,h,d,m,p,_]=this.children,v=t.getRenderTarget(),S=t.getActiveCubeFace(),M=t.getActiveMipmapLevel(),b=t.xr.enabled;t.xr.enabled=!1;const E=s.texture.generateMipmaps;s.texture.generateMipmaps=!1,t.setRenderTarget(s,0,l),t.render(i,c),t.setRenderTarget(s,1,l),t.render(i,h),t.setRenderTarget(s,2,l),t.render(i,d),t.setRenderTarget(s,3,l),t.render(i,m),t.setRenderTarget(s,4,l),t.render(i,p),s.texture.generateMipmaps=E,t.setRenderTarget(s,5,l),t.render(i,_),t.setRenderTarget(v,S,M),t.xr.enabled=b,s.texture.needsPMREMUpdate=!0}}class bv extends qn{constructor(t=[],i=Ir,s,l,c,h,d,m,p,_){super(t,i,s,l,c,h,d,m,p,_),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class RM extends Cs{constructor(t=1,i={}){super(t,t,i),this.isWebGLCubeRenderTarget=!0;const s={width:t,height:t,depth:1},l=[s,s,s,s,s,s];this.texture=new bv(l),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},l=new Jo(5,5,5),c=new Ya({name:"CubemapFromEquirect",uniforms:Hr(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:Wn,blending:ja});c.uniforms.tEquirect.value=i;const h=new wn(l,c),d=i.minFilter;return i.minFilter===bs&&(i.minFilter=Li),new AM(1,10,this).update(t,h),i.minFilter=d,h.geometry.dispose(),h.material.dispose(),this}clear(t,i=!0,s=!0,l=!0){const c=t.getRenderTarget();for(let h=0;h<6;h++)t.setRenderTarget(this,h),t.clear(i,s,l);t.setRenderTarget(c)}}class Ts extends gn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const CM={type:"move"};class Lh{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ts,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ts,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new tt,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new tt),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ts,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new tt,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new tt),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const i=this._hand;if(i)for(const s of t.hand.values())this._getHandJoint(i,s)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,i,s){let l=null,c=null,h=null;const d=this._targetRay,m=this._grip,p=this._hand;if(t&&i.session.visibilityState!=="visible-blurred"){if(p&&t.hand){h=!0;for(const E of t.hand.values()){const y=i.getJointPose(E,s),g=this._getHandJoint(p,E);y!==null&&(g.matrix.fromArray(y.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=y.radius),g.visible=y!==null}const _=p.joints["index-finger-tip"],v=p.joints["thumb-tip"],S=_.position.distanceTo(v.position),M=.02,b=.005;p.inputState.pinching&&S>M+b?(p.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!p.inputState.pinching&&S<=M-b&&(p.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else m!==null&&t.gripSpace&&(c=i.getPose(t.gripSpace,s),c!==null&&(m.matrix.fromArray(c.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,c.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(c.linearVelocity)):m.hasLinearVelocity=!1,c.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(c.angularVelocity)):m.hasAngularVelocity=!1));d!==null&&(l=i.getPose(t.targetRaySpace,s),l===null&&c!==null&&(l=c),l!==null&&(d.matrix.fromArray(l.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,l.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(l.linearVelocity)):d.hasLinearVelocity=!1,l.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(l.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(CM)))}return d!==null&&(d.visible=l!==null),m!==null&&(m.visible=c!==null),p!==null&&(p.visible=h!==null),this}_getHandJoint(t,i){if(t.joints[i.jointName]===void 0){const s=new Ts;s.matrixAutoUpdate=!1,s.visible=!1,t.joints[i.jointName]=s,t.add(s)}return t.joints[i.jointName]}}class Xd{constructor(t,i=1,s=1e3){this.isFog=!0,this.name="",this.color=new Me(t),this.near=i,this.far=s}clone(){return new Xd(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class wM extends gn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ii,this.environmentIntensity=1,this.environmentRotation=new Ii,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,i){return super.copy(t,i),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const i=super.toJSON(t);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}const Oh=new tt,DM=new tt,UM=new me;class ka{constructor(t=new tt(1,0,0),i=0){this.isPlane=!0,this.normal=t,this.constant=i}set(t,i){return this.normal.copy(t),this.constant=i,this}setComponents(t,i,s,l){return this.normal.set(t,i,s),this.constant=l,this}setFromNormalAndCoplanarPoint(t,i){return this.normal.copy(t),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(t,i,s){const l=Oh.subVectors(s,i).cross(DM.subVectors(t,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,i){return i.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,i){const s=t.delta(Oh),l=this.normal.dot(s);if(l===0)return this.distanceToPoint(t.start)===0?i.copy(t.start):null;const c=-(t.start.dot(this.normal)+this.constant)/l;return c<0||c>1?null:i.copy(t.start).addScaledVector(s,c)}intersectsLine(t){const i=this.distanceToPoint(t.start),s=this.distanceToPoint(t.end);return i<0&&s>0||s<0&&i>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,i){const s=i||UM.getNormalMatrix(t),l=this.coplanarPoint(Oh).applyMatrix4(t),c=this.normal.applyMatrix3(s).normalize();return this.constant=-l.dot(c),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const _s=new qc,NM=new ue(.5,.5),Rc=new tt;class jd{constructor(t=new ka,i=new ka,s=new ka,l=new ka,c=new ka,h=new ka){this.planes=[t,i,s,l,c,h]}set(t,i,s,l,c,h){const d=this.planes;return d[0].copy(t),d[1].copy(i),d[2].copy(s),d[3].copy(l),d[4].copy(c),d[5].copy(h),this}copy(t){const i=this.planes;for(let s=0;s<6;s++)i[s].copy(t.planes[s]);return this}setFromProjectionMatrix(t,i=Oi,s=!1){const l=this.planes,c=t.elements,h=c[0],d=c[1],m=c[2],p=c[3],_=c[4],v=c[5],S=c[6],M=c[7],b=c[8],E=c[9],y=c[10],g=c[11],B=c[12],R=c[13],w=c[14],V=c[15];if(l[0].setComponents(p-h,M-_,g-b,V-B).normalize(),l[1].setComponents(p+h,M+_,g+b,V+B).normalize(),l[2].setComponents(p+d,M+v,g+E,V+R).normalize(),l[3].setComponents(p-d,M-v,g-E,V-R).normalize(),s)l[4].setComponents(m,S,y,w).normalize(),l[5].setComponents(p-m,M-S,g-y,V-w).normalize();else if(l[4].setComponents(p-m,M-S,g-y,V-w).normalize(),i===Oi)l[5].setComponents(p+m,M+S,g+y,V+w).normalize();else if(i===Vc)l[5].setComponents(m,S,y,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),_s.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const i=t.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),_s.copy(i.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(_s)}intersectsSprite(t){_s.center.set(0,0,0);const i=NM.distanceTo(t.center);return _s.radius=.7071067811865476+i,_s.applyMatrix4(t.matrixWorld),this.intersectsSphere(_s)}intersectsSphere(t){const i=this.planes,s=t.center,l=-t.radius;for(let c=0;c<6;c++)if(i[c].distanceToPoint(s)<l)return!1;return!0}intersectsBox(t){const i=this.planes;for(let s=0;s<6;s++){const l=i[s];if(Rc.x=l.normal.x>0?t.max.x:t.min.x,Rc.y=l.normal.y>0?t.max.y:t.min.y,Rc.z=l.normal.z>0?t.max.z:t.min.z,l.distanceToPoint(Rc)<0)return!1}return!0}containsPoint(t){const i=this.planes;for(let s=0;s<6;s++)if(i[s].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class wr extends Gr{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Me(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Xc=new tt,jc=new tt,h0=new Ze,Vo=new Yc,Cc=new qc,Ph=new tt,d0=new tt;class ko extends gn{constructor(t=new Mn,i=new wr){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,i){return super.copy(t,i),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const i=t.attributes.position,s=[0];for(let l=1,c=i.count;l<c;l++)Xc.fromBufferAttribute(i,l-1),jc.fromBufferAttribute(i,l),s[l]=s[l-1],s[l]+=Xc.distanceTo(jc);t.setAttribute("lineDistance",new mn(s,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,i){const s=this.geometry,l=this.matrixWorld,c=t.params.Line.threshold,h=s.drawRange;if(s.boundingSphere===null&&s.computeBoundingSphere(),Cc.copy(s.boundingSphere),Cc.applyMatrix4(l),Cc.radius+=c,t.ray.intersectsSphere(Cc)===!1)return;h0.copy(l).invert(),Vo.copy(t.ray).applyMatrix4(h0);const d=c/((this.scale.x+this.scale.y+this.scale.z)/3),m=d*d,p=this.isLineSegments?2:1,_=s.index,S=s.attributes.position;if(_!==null){const M=Math.max(0,h.start),b=Math.min(_.count,h.start+h.count);for(let E=M,y=b-1;E<y;E+=p){const g=_.getX(E),B=_.getX(E+1),R=wc(this,t,Vo,m,g,B,E);R&&i.push(R)}if(this.isLineLoop){const E=_.getX(b-1),y=_.getX(M),g=wc(this,t,Vo,m,E,y,b-1);g&&i.push(g)}}else{const M=Math.max(0,h.start),b=Math.min(S.count,h.start+h.count);for(let E=M,y=b-1;E<y;E+=p){const g=wc(this,t,Vo,m,E,E+1,E);g&&i.push(g)}if(this.isLineLoop){const E=wc(this,t,Vo,m,b-1,M,b-1);E&&i.push(E)}}}updateMorphTargets(){const i=this.geometry.morphAttributes,s=Object.keys(i);if(s.length>0){const l=i[s[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,h=l.length;c<h;c++){const d=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=c}}}}}function wc(r,t,i,s,l,c,h){const d=r.geometry.attributes.position;if(Xc.fromBufferAttribute(d,l),jc.fromBufferAttribute(d,c),i.distanceSqToSegment(Xc,jc,Ph,d0)>s)return;Ph.applyMatrix4(r.matrixWorld);const p=t.ray.origin.distanceTo(Ph);if(!(p<t.near||p>t.far))return{distance:p,point:d0.clone().applyMatrix4(r.matrixWorld),index:h,face:null,faceIndex:null,barycoord:null,object:r}}const p0=new tt,m0=new tt;class LM extends ko{constructor(t,i){super(t,i),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const i=t.attributes.position,s=[];for(let l=0,c=i.count;l<c;l+=2)p0.fromBufferAttribute(i,l),m0.fromBufferAttribute(i,l+1),s[l]=l===0?0:s[l-1],s[l+1]=s[l]+p0.distanceTo(m0);t.setAttribute("lineDistance",new mn(s,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Tv extends qn{constructor(t,i,s=As,l,c,h,d=Ti,m=Ti,p,_=qo,v=1){if(_!==qo&&_!==Yo)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const S={width:t,height:i,depth:v};super(S,l,c,h,d,m,_,s,p),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Vd(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const i=super.toJSON(t);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}class Zc extends Mn{constructor(t=1,i=1,s=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:i,widthSegments:s,heightSegments:l};const c=t/2,h=i/2,d=Math.floor(s),m=Math.floor(l),p=d+1,_=m+1,v=t/d,S=i/m,M=[],b=[],E=[],y=[];for(let g=0;g<_;g++){const B=g*S-h;for(let R=0;R<p;R++){const w=R*v-c;b.push(w,-B,0),E.push(0,0,1),y.push(R/d),y.push(1-g/m)}}for(let g=0;g<m;g++)for(let B=0;B<d;B++){const R=B+p*g,w=B+p*(g+1),V=B+1+p*(g+1),F=B+1+p*g;M.push(R,w,F),M.push(w,V,F)}this.setIndex(M),this.setAttribute("position",new mn(b,3)),this.setAttribute("normal",new mn(E,3)),this.setAttribute("uv",new mn(y,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zc(t.width,t.height,t.widthSegments,t.heightSegments)}}class Dr extends Mn{constructor(t=1,i=32,s=16,l=0,c=Math.PI*2,h=0,d=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:i,heightSegments:s,phiStart:l,phiLength:c,thetaStart:h,thetaLength:d},i=Math.max(3,Math.floor(i)),s=Math.max(2,Math.floor(s));const m=Math.min(h+d,Math.PI);let p=0;const _=[],v=new tt,S=new tt,M=[],b=[],E=[],y=[];for(let g=0;g<=s;g++){const B=[],R=g/s;let w=0;g===0&&h===0?w=.5/i:g===s&&m===Math.PI&&(w=-.5/i);for(let V=0;V<=i;V++){const F=V/i;v.x=-t*Math.cos(l+F*c)*Math.sin(h+R*d),v.y=t*Math.cos(h+R*d),v.z=t*Math.sin(l+F*c)*Math.sin(h+R*d),b.push(v.x,v.y,v.z),S.copy(v).normalize(),E.push(S.x,S.y,S.z),y.push(F+w,1-R),B.push(p++)}_.push(B)}for(let g=0;g<s;g++)for(let B=0;B<i;B++){const R=_[g][B+1],w=_[g][B],V=_[g+1][B],F=_[g+1][B+1];(g!==0||h>0)&&M.push(R,w,F),(g!==s-1||m<Math.PI)&&M.push(w,V,F)}this.setIndex(M),this.setAttribute("position",new mn(b,3)),this.setAttribute("normal",new mn(E,3)),this.setAttribute("uv",new mn(y,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Dr(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class OM extends Gr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mv,this.normalScale=new ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ii,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class PM extends Gr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=jy,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class zM extends Gr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Av extends gn{constructor(t,i=1){super(),this.isLight=!0,this.type="Light",this.color=new Me(t),this.intensity=i}dispose(){}copy(t,i){return super.copy(t,i),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const i=super.toJSON(t);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,this.groundColor!==void 0&&(i.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(i.object.distance=this.distance),this.angle!==void 0&&(i.object.angle=this.angle),this.decay!==void 0&&(i.object.decay=this.decay),this.penumbra!==void 0&&(i.object.penumbra=this.penumbra),this.shadow!==void 0&&(i.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(i.object.target=this.target.uuid),i}}class IM extends Av{constructor(t,i,s){super(t,s),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(gn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Me(i)}copy(t,i){return super.copy(t,i),this.groundColor.copy(t.groundColor),this}}const zh=new Ze,g0=new tt,_0=new tt;class BM{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ue(512,512),this.mapType=zi,this.map=null,this.mapPass=null,this.matrix=new Ze,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new jd,this._frameExtents=new ue(1,1),this._viewportCount=1,this._viewports=[new en(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const i=this.camera,s=this.matrix;g0.setFromMatrixPosition(t.matrixWorld),i.position.copy(g0),_0.setFromMatrixPosition(t.target.matrixWorld),i.lookAt(_0),i.updateMatrixWorld(),zh.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zh,i.coordinateSystem,i.reversedDepth),i.reversedDepth?s.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):s.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),s.multiply(zh)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Rv extends Ev{constructor(t=-1,i=1,s=1,l=-1,c=.1,h=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=i,this.top=s,this.bottom=l,this.near=c,this.far=h,this.updateProjectionMatrix()}copy(t,i){return super.copy(t,i),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,i,s,l,c,h){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=c,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let c=s-t,h=s+t,d=l+i,m=l-i;if(this.view!==null&&this.view.enabled){const p=(this.right-this.left)/this.view.fullWidth/this.zoom,_=(this.top-this.bottom)/this.view.fullHeight/this.zoom;c+=p*this.view.offsetX,h=c+p*this.view.width,d-=_*this.view.offsetY,m=d-_*this.view.height}this.projectionMatrix.makeOrthographic(c,h,d,m,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const i=super.toJSON(t);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class FM extends BM{constructor(){super(new Rv(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class v0 extends Av{constructor(t,i){super(t,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(gn.DEFAULT_UP),this.updateMatrix(),this.target=new gn,this.shadow=new FM}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class HM extends gi{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const x0=new Ze;class GM{constructor(t,i,s=0,l=1/0){this.ray=new Yc(t,i),this.near=s,this.far=l,this.camera=null,this.layers=new kd,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,i){this.ray.set(t,i)}setFromCamera(t,i){i.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(i.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(i).sub(this.ray.origin).normalize(),this.camera=i):i.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(i.near+i.far)/(i.near-i.far)).unproject(i),this.ray.direction.set(0,0,-1).transformDirection(i.matrixWorld),this.camera=i):console.error("THREE.Raycaster: Unsupported camera type: "+i.type)}setFromXRController(t){return x0.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(x0),this}intersectObject(t,i=!0,s=[]){return Nd(t,this,s,i),s.sort(S0),s}intersectObjects(t,i=!0,s=[]){for(let l=0,c=t.length;l<c;l++)Nd(t[l],this,s,i);return s.sort(S0),s}}function S0(r,t){return r.distance-t.distance}function Nd(r,t,i,s){let l=!0;if(r.layers.test(t.layers)&&r.raycast(t,i)===!1&&(l=!1),l===!0&&s===!0){const c=r.children;for(let h=0,d=c.length;h<d;h++)Nd(c[h],t,i,!0)}}class y0{constructor(t=1,i=0,s=0){this.radius=t,this.phi=i,this.theta=s}set(t,i,s){return this.radius=t,this.phi=i,this.theta=s,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=ye(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,i,s){return this.radius=Math.sqrt(t*t+i*i+s*s),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,s),this.phi=Math.acos(ye(i/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class M0 extends LM{constructor(t=10,i=10,s=4473924,l=8947848){s=new Me(s),l=new Me(l);const c=i/2,h=t/i,d=t/2,m=[],p=[];for(let S=0,M=0,b=-d;S<=i;S++,b+=h){m.push(-d,0,b,d,0,b),m.push(b,0,-d,b,0,d);const E=S===c?s:l;E.toArray(p,M),M+=3,E.toArray(p,M),M+=3,E.toArray(p,M),M+=3,E.toArray(p,M),M+=3}const _=new Mn;_.setAttribute("position",new mn(m,3)),_.setAttribute("color",new mn(p,3));const v=new wr({vertexColors:!0,toneMapped:!1});super(_,v),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class VM extends Ds{constructor(t,i=null){super(),this.object=t,this.domElement=i,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function E0(r,t,i,s){const l=kM(s);switch(i){case uv:return r*t;case hv:return r*t/l.components*l.byteLength;case Fd:return r*t/l.components*l.byteLength;case dv:return r*t*2/l.components*l.byteLength;case Hd:return r*t*2/l.components*l.byteLength;case fv:return r*t*3/l.components*l.byteLength;case bi:return r*t*4/l.components*l.byteLength;case Gd:return r*t*4/l.components*l.byteLength;case Oc:case Pc:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case zc:case Ic:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case rd:case ld:return Math.max(r,16)*Math.max(t,8)/4;case sd:case od:return Math.max(r,8)*Math.max(t,8)/2;case cd:case ud:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case fd:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case hd:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case dd:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case pd:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case md:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case gd:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case _d:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case vd:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case xd:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case Sd:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case yd:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case Md:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case Ed:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case bd:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case Td:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case Bc:case Ad:case Rd:return Math.ceil(r/4)*Math.ceil(t/4)*16;case pv:case Cd:return Math.ceil(r/4)*Math.ceil(t/4)*8;case wd:case Dd:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function kM(r){switch(r){case zi:case ov:return{byteLength:1,components:1};case jo:case lv:case Zo:return{byteLength:2,components:1};case Id:case Bd:return{byteLength:2,components:4};case As:case zd:case ua:return{byteLength:4,components:1};case cv:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Pd}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Pd);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Cv(){let r=null,t=!1,i=null,s=null;function l(c,h){i(c,h),s=r.requestAnimationFrame(l)}return{start:function(){t!==!0&&i!==null&&(s=r.requestAnimationFrame(l),t=!0)},stop:function(){r.cancelAnimationFrame(s),t=!1},setAnimationLoop:function(c){i=c},setContext:function(c){r=c}}}function XM(r){const t=new WeakMap;function i(d,m){const p=d.array,_=d.usage,v=p.byteLength,S=r.createBuffer();r.bindBuffer(m,S),r.bufferData(m,p,_),d.onUploadCallback();let M;if(p instanceof Float32Array)M=r.FLOAT;else if(typeof Float16Array<"u"&&p instanceof Float16Array)M=r.HALF_FLOAT;else if(p instanceof Uint16Array)d.isFloat16BufferAttribute?M=r.HALF_FLOAT:M=r.UNSIGNED_SHORT;else if(p instanceof Int16Array)M=r.SHORT;else if(p instanceof Uint32Array)M=r.UNSIGNED_INT;else if(p instanceof Int32Array)M=r.INT;else if(p instanceof Int8Array)M=r.BYTE;else if(p instanceof Uint8Array)M=r.UNSIGNED_BYTE;else if(p instanceof Uint8ClampedArray)M=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+p);return{buffer:S,type:M,bytesPerElement:p.BYTES_PER_ELEMENT,version:d.version,size:v}}function s(d,m,p){const _=m.array,v=m.updateRanges;if(r.bindBuffer(p,d),v.length===0)r.bufferSubData(p,0,_);else{v.sort((M,b)=>M.start-b.start);let S=0;for(let M=1;M<v.length;M++){const b=v[S],E=v[M];E.start<=b.start+b.count+1?b.count=Math.max(b.count,E.start+E.count-b.start):(++S,v[S]=E)}v.length=S+1;for(let M=0,b=v.length;M<b;M++){const E=v[M];r.bufferSubData(p,E.start*_.BYTES_PER_ELEMENT,_,E.start,E.count)}m.clearUpdateRanges()}m.onUploadCallback()}function l(d){return d.isInterleavedBufferAttribute&&(d=d.data),t.get(d)}function c(d){d.isInterleavedBufferAttribute&&(d=d.data);const m=t.get(d);m&&(r.deleteBuffer(m.buffer),t.delete(d))}function h(d,m){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const _=t.get(d);(!_||_.version<d.version)&&t.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const p=t.get(d);if(p===void 0)t.set(d,i(d,m));else if(p.version<d.version){if(p.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(p.buffer,d,m),p.version=d.version}}return{get:l,remove:c,update:h}}var jM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,WM=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,qM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,YM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ZM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,KM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,QM=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,JM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,$M=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,tE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,eE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,nE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,iE=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,aE=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,sE=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,rE=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,oE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,lE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,uE=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,fE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,hE=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,dE=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,pE=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,mE=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,gE=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,_E=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vE=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xE=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,SE=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,yE="gl_FragColor = linearToOutputTexel( gl_FragColor );",ME=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,EE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,bE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,TE=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,AE=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,RE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,CE=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,wE=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,DE=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,UE=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,NE=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,LE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,OE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,PE=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,zE=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,IE=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,BE=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,FE=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,HE=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,GE=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,VE=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,kE=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,XE=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,jE=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,WE=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,qE=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,YE=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ZE=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,KE=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,QE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,JE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$E=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,tb=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,eb=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,nb=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ib=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ab=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,sb=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rb=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ob=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lb=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,cb=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,ub=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fb=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hb=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,db=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,pb=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,mb=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,gb=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_b=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vb=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xb=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Sb=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,yb=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Mb=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Eb=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,bb=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Tb=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ab=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSEDEPTHBUF
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSEDEPTHBUF
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare , distribution.x );
		#endif
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Rb=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Cb=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,wb=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Db=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ub=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Nb=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Lb=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Ob=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Pb=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,zb=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ib=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Bb=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Fb=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Hb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Gb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,kb=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Xb=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,jb=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qb=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zb=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Qb=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSEDEPTHBUF
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Jb=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,$b=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,tT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,eT=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nT=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,iT=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,aT=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,sT=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rT=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,oT=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lT=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,cT=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,uT=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,fT=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,hT=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dT=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pT=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,mT=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gT=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_T=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vT=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,xT=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ST=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yT=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,MT=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ET=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ge={alphahash_fragment:jM,alphahash_pars_fragment:WM,alphamap_fragment:qM,alphamap_pars_fragment:YM,alphatest_fragment:ZM,alphatest_pars_fragment:KM,aomap_fragment:QM,aomap_pars_fragment:JM,batching_pars_vertex:$M,batching_vertex:tE,begin_vertex:eE,beginnormal_vertex:nE,bsdfs:iE,iridescence_fragment:aE,bumpmap_pars_fragment:sE,clipping_planes_fragment:rE,clipping_planes_pars_fragment:oE,clipping_planes_pars_vertex:lE,clipping_planes_vertex:cE,color_fragment:uE,color_pars_fragment:fE,color_pars_vertex:hE,color_vertex:dE,common:pE,cube_uv_reflection_fragment:mE,defaultnormal_vertex:gE,displacementmap_pars_vertex:_E,displacementmap_vertex:vE,emissivemap_fragment:xE,emissivemap_pars_fragment:SE,colorspace_fragment:yE,colorspace_pars_fragment:ME,envmap_fragment:EE,envmap_common_pars_fragment:bE,envmap_pars_fragment:TE,envmap_pars_vertex:AE,envmap_physical_pars_fragment:IE,envmap_vertex:RE,fog_vertex:CE,fog_pars_vertex:wE,fog_fragment:DE,fog_pars_fragment:UE,gradientmap_pars_fragment:NE,lightmap_pars_fragment:LE,lights_lambert_fragment:OE,lights_lambert_pars_fragment:PE,lights_pars_begin:zE,lights_toon_fragment:BE,lights_toon_pars_fragment:FE,lights_phong_fragment:HE,lights_phong_pars_fragment:GE,lights_physical_fragment:VE,lights_physical_pars_fragment:kE,lights_fragment_begin:XE,lights_fragment_maps:jE,lights_fragment_end:WE,logdepthbuf_fragment:qE,logdepthbuf_pars_fragment:YE,logdepthbuf_pars_vertex:ZE,logdepthbuf_vertex:KE,map_fragment:QE,map_pars_fragment:JE,map_particle_fragment:$E,map_particle_pars_fragment:tb,metalnessmap_fragment:eb,metalnessmap_pars_fragment:nb,morphinstance_vertex:ib,morphcolor_vertex:ab,morphnormal_vertex:sb,morphtarget_pars_vertex:rb,morphtarget_vertex:ob,normal_fragment_begin:lb,normal_fragment_maps:cb,normal_pars_fragment:ub,normal_pars_vertex:fb,normal_vertex:hb,normalmap_pars_fragment:db,clearcoat_normal_fragment_begin:pb,clearcoat_normal_fragment_maps:mb,clearcoat_pars_fragment:gb,iridescence_pars_fragment:_b,opaque_fragment:vb,packing:xb,premultiplied_alpha_fragment:Sb,project_vertex:yb,dithering_fragment:Mb,dithering_pars_fragment:Eb,roughnessmap_fragment:bb,roughnessmap_pars_fragment:Tb,shadowmap_pars_fragment:Ab,shadowmap_pars_vertex:Rb,shadowmap_vertex:Cb,shadowmask_pars_fragment:wb,skinbase_vertex:Db,skinning_pars_vertex:Ub,skinning_vertex:Nb,skinnormal_vertex:Lb,specularmap_fragment:Ob,specularmap_pars_fragment:Pb,tonemapping_fragment:zb,tonemapping_pars_fragment:Ib,transmission_fragment:Bb,transmission_pars_fragment:Fb,uv_pars_fragment:Hb,uv_pars_vertex:Gb,uv_vertex:Vb,worldpos_vertex:kb,background_vert:Xb,background_frag:jb,backgroundCube_vert:Wb,backgroundCube_frag:qb,cube_vert:Yb,cube_frag:Zb,depth_vert:Kb,depth_frag:Qb,distanceRGBA_vert:Jb,distanceRGBA_frag:$b,equirect_vert:tT,equirect_frag:eT,linedashed_vert:nT,linedashed_frag:iT,meshbasic_vert:aT,meshbasic_frag:sT,meshlambert_vert:rT,meshlambert_frag:oT,meshmatcap_vert:lT,meshmatcap_frag:cT,meshnormal_vert:uT,meshnormal_frag:fT,meshphong_vert:hT,meshphong_frag:dT,meshphysical_vert:pT,meshphysical_frag:mT,meshtoon_vert:gT,meshtoon_frag:_T,points_vert:vT,points_frag:xT,shadow_vert:ST,shadow_frag:yT,sprite_vert:MT,sprite_frag:ET},Bt={common:{diffuse:{value:new Me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new me},alphaMap:{value:null},alphaMapTransform:{value:new me},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new me}},envmap:{envMap:{value:null},envMapRotation:{value:new me},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new me}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new me}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new me},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new me},normalScale:{value:new ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new me},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new me}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new me}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new me}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new me},alphaTest:{value:0},uvTransform:{value:new me}},sprite:{diffuse:{value:new Me(16777215)},opacity:{value:1},center:{value:new ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new me},alphaMap:{value:null},alphaMapTransform:{value:new me},alphaTest:{value:0}}},Ni={basic:{uniforms:In([Bt.common,Bt.specularmap,Bt.envmap,Bt.aomap,Bt.lightmap,Bt.fog]),vertexShader:ge.meshbasic_vert,fragmentShader:ge.meshbasic_frag},lambert:{uniforms:In([Bt.common,Bt.specularmap,Bt.envmap,Bt.aomap,Bt.lightmap,Bt.emissivemap,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,Bt.fog,Bt.lights,{emissive:{value:new Me(0)}}]),vertexShader:ge.meshlambert_vert,fragmentShader:ge.meshlambert_frag},phong:{uniforms:In([Bt.common,Bt.specularmap,Bt.envmap,Bt.aomap,Bt.lightmap,Bt.emissivemap,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,Bt.fog,Bt.lights,{emissive:{value:new Me(0)},specular:{value:new Me(1118481)},shininess:{value:30}}]),vertexShader:ge.meshphong_vert,fragmentShader:ge.meshphong_frag},standard:{uniforms:In([Bt.common,Bt.envmap,Bt.aomap,Bt.lightmap,Bt.emissivemap,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,Bt.roughnessmap,Bt.metalnessmap,Bt.fog,Bt.lights,{emissive:{value:new Me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ge.meshphysical_vert,fragmentShader:ge.meshphysical_frag},toon:{uniforms:In([Bt.common,Bt.aomap,Bt.lightmap,Bt.emissivemap,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,Bt.gradientmap,Bt.fog,Bt.lights,{emissive:{value:new Me(0)}}]),vertexShader:ge.meshtoon_vert,fragmentShader:ge.meshtoon_frag},matcap:{uniforms:In([Bt.common,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,Bt.fog,{matcap:{value:null}}]),vertexShader:ge.meshmatcap_vert,fragmentShader:ge.meshmatcap_frag},points:{uniforms:In([Bt.points,Bt.fog]),vertexShader:ge.points_vert,fragmentShader:ge.points_frag},dashed:{uniforms:In([Bt.common,Bt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ge.linedashed_vert,fragmentShader:ge.linedashed_frag},depth:{uniforms:In([Bt.common,Bt.displacementmap]),vertexShader:ge.depth_vert,fragmentShader:ge.depth_frag},normal:{uniforms:In([Bt.common,Bt.bumpmap,Bt.normalmap,Bt.displacementmap,{opacity:{value:1}}]),vertexShader:ge.meshnormal_vert,fragmentShader:ge.meshnormal_frag},sprite:{uniforms:In([Bt.sprite,Bt.fog]),vertexShader:ge.sprite_vert,fragmentShader:ge.sprite_frag},background:{uniforms:{uvTransform:{value:new me},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ge.background_vert,fragmentShader:ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new me}},vertexShader:ge.backgroundCube_vert,fragmentShader:ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ge.cube_vert,fragmentShader:ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ge.equirect_vert,fragmentShader:ge.equirect_frag},distanceRGBA:{uniforms:In([Bt.common,Bt.displacementmap,{referencePosition:{value:new tt},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ge.distanceRGBA_vert,fragmentShader:ge.distanceRGBA_frag},shadow:{uniforms:In([Bt.lights,Bt.fog,{color:{value:new Me(0)},opacity:{value:1}}]),vertexShader:ge.shadow_vert,fragmentShader:ge.shadow_frag}};Ni.physical={uniforms:In([Ni.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new me},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new me},clearcoatNormalScale:{value:new ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new me},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new me},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new me},sheen:{value:0},sheenColor:{value:new Me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new me},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new me},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new me},transmissionSamplerSize:{value:new ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new me},attenuationDistance:{value:0},attenuationColor:{value:new Me(0)},specularColor:{value:new Me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new me},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new me},anisotropyVector:{value:new ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new me}}]),vertexShader:ge.meshphysical_vert,fragmentShader:ge.meshphysical_frag};const Dc={r:0,b:0,g:0},vs=new Ii,bT=new Ze;function TT(r,t,i,s,l,c,h){const d=new Me(0);let m=c===!0?0:1,p,_,v=null,S=0,M=null;function b(R){let w=R.isScene===!0?R.background:null;return w&&w.isTexture&&(w=(R.backgroundBlurriness>0?i:t).get(w)),w}function E(R){let w=!1;const V=b(R);V===null?g(d,m):V&&V.isColor&&(g(V,1),w=!0);const F=r.xr.getEnvironmentBlendMode();F==="additive"?s.buffers.color.setClear(0,0,0,1,h):F==="alpha-blend"&&s.buffers.color.setClear(0,0,0,0,h),(r.autoClear||w)&&(s.buffers.depth.setTest(!0),s.buffers.depth.setMask(!0),s.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function y(R,w){const V=b(w);V&&(V.isCubeTexture||V.mapping===Wc)?(_===void 0&&(_=new wn(new Jo(1,1,1),new Ya({name:"BackgroundCubeMaterial",uniforms:Hr(Ni.backgroundCube.uniforms),vertexShader:Ni.backgroundCube.vertexShader,fragmentShader:Ni.backgroundCube.fragmentShader,side:Wn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),_.geometry.deleteAttribute("normal"),_.geometry.deleteAttribute("uv"),_.onBeforeRender=function(F,L,X){this.matrixWorld.copyPosition(X.matrixWorld)},Object.defineProperty(_.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),l.update(_)),vs.copy(w.backgroundRotation),vs.x*=-1,vs.y*=-1,vs.z*=-1,V.isCubeTexture&&V.isRenderTargetTexture===!1&&(vs.y*=-1,vs.z*=-1),_.material.uniforms.envMap.value=V,_.material.uniforms.flipEnvMap.value=V.isCubeTexture&&V.isRenderTargetTexture===!1?-1:1,_.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,_.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,_.material.uniforms.backgroundRotation.value.setFromMatrix4(bT.makeRotationFromEuler(vs)),_.material.toneMapped=Ue.getTransfer(V.colorSpace)!==Ge,(v!==V||S!==V.version||M!==r.toneMapping)&&(_.material.needsUpdate=!0,v=V,S=V.version,M=r.toneMapping),_.layers.enableAll(),R.unshift(_,_.geometry,_.material,0,0,null)):V&&V.isTexture&&(p===void 0&&(p=new wn(new Zc(2,2),new Ya({name:"BackgroundMaterial",uniforms:Hr(Ni.background.uniforms),vertexShader:Ni.background.vertexShader,fragmentShader:Ni.background.fragmentShader,side:qa,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),l.update(p)),p.material.uniforms.t2D.value=V,p.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,p.material.toneMapped=Ue.getTransfer(V.colorSpace)!==Ge,V.matrixAutoUpdate===!0&&V.updateMatrix(),p.material.uniforms.uvTransform.value.copy(V.matrix),(v!==V||S!==V.version||M!==r.toneMapping)&&(p.material.needsUpdate=!0,v=V,S=V.version,M=r.toneMapping),p.layers.enableAll(),R.unshift(p,p.geometry,p.material,0,0,null))}function g(R,w){R.getRGB(Dc,Mv(r)),s.buffers.color.setClear(Dc.r,Dc.g,Dc.b,w,h)}function B(){_!==void 0&&(_.geometry.dispose(),_.material.dispose(),_=void 0),p!==void 0&&(p.geometry.dispose(),p.material.dispose(),p=void 0)}return{getClearColor:function(){return d},setClearColor:function(R,w=1){d.set(R),m=w,g(d,m)},getClearAlpha:function(){return m},setClearAlpha:function(R){m=R,g(d,m)},render:E,addToRenderList:y,dispose:B}}function AT(r,t){const i=r.getParameter(r.MAX_VERTEX_ATTRIBS),s={},l=S(null);let c=l,h=!1;function d(D,z,lt,st,dt){let et=!1;const I=v(st,lt,z);c!==I&&(c=I,p(c.object)),et=M(D,st,lt,dt),et&&b(D,st,lt,dt),dt!==null&&t.update(dt,r.ELEMENT_ARRAY_BUFFER),(et||h)&&(h=!1,w(D,z,lt,st),dt!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(dt).buffer))}function m(){return r.createVertexArray()}function p(D){return r.bindVertexArray(D)}function _(D){return r.deleteVertexArray(D)}function v(D,z,lt){const st=lt.wireframe===!0;let dt=s[D.id];dt===void 0&&(dt={},s[D.id]=dt);let et=dt[z.id];et===void 0&&(et={},dt[z.id]=et);let I=et[st];return I===void 0&&(I=S(m()),et[st]=I),I}function S(D){const z=[],lt=[],st=[];for(let dt=0;dt<i;dt++)z[dt]=0,lt[dt]=0,st[dt]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:lt,attributeDivisors:st,object:D,attributes:{},index:null}}function M(D,z,lt,st){const dt=c.attributes,et=z.attributes;let I=0;const Y=lt.getAttributes();for(const q in Y)if(Y[q].location>=0){const rt=dt[q];let N=et[q];if(N===void 0&&(q==="instanceMatrix"&&D.instanceMatrix&&(N=D.instanceMatrix),q==="instanceColor"&&D.instanceColor&&(N=D.instanceColor)),rt===void 0||rt.attribute!==N||N&&rt.data!==N.data)return!0;I++}return c.attributesNum!==I||c.index!==st}function b(D,z,lt,st){const dt={},et=z.attributes;let I=0;const Y=lt.getAttributes();for(const q in Y)if(Y[q].location>=0){let rt=et[q];rt===void 0&&(q==="instanceMatrix"&&D.instanceMatrix&&(rt=D.instanceMatrix),q==="instanceColor"&&D.instanceColor&&(rt=D.instanceColor));const N={};N.attribute=rt,rt&&rt.data&&(N.data=rt.data),dt[q]=N,I++}c.attributes=dt,c.attributesNum=I,c.index=st}function E(){const D=c.newAttributes;for(let z=0,lt=D.length;z<lt;z++)D[z]=0}function y(D){g(D,0)}function g(D,z){const lt=c.newAttributes,st=c.enabledAttributes,dt=c.attributeDivisors;lt[D]=1,st[D]===0&&(r.enableVertexAttribArray(D),st[D]=1),dt[D]!==z&&(r.vertexAttribDivisor(D,z),dt[D]=z)}function B(){const D=c.newAttributes,z=c.enabledAttributes;for(let lt=0,st=z.length;lt<st;lt++)z[lt]!==D[lt]&&(r.disableVertexAttribArray(lt),z[lt]=0)}function R(D,z,lt,st,dt,et,I){I===!0?r.vertexAttribIPointer(D,z,lt,dt,et):r.vertexAttribPointer(D,z,lt,st,dt,et)}function w(D,z,lt,st){E();const dt=st.attributes,et=lt.getAttributes(),I=z.defaultAttributeValues;for(const Y in et){const q=et[Y];if(q.location>=0){let $=dt[Y];if($===void 0&&(Y==="instanceMatrix"&&D.instanceMatrix&&($=D.instanceMatrix),Y==="instanceColor"&&D.instanceColor&&($=D.instanceColor)),$!==void 0){const rt=$.normalized,N=$.itemSize,W=t.get($);if(W===void 0)continue;const vt=W.buffer,Mt=W.type,K=W.bytesPerElement,xt=Mt===r.INT||Mt===r.UNSIGNED_INT||$.gpuType===zd;if($.isInterleavedBufferAttribute){const ut=$.data,Et=ut.stride,Dt=$.offset;if(ut.isInstancedInterleavedBuffer){for(let Gt=0;Gt<q.locationSize;Gt++)g(q.location+Gt,ut.meshPerAttribute);D.isInstancedMesh!==!0&&st._maxInstanceCount===void 0&&(st._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let Gt=0;Gt<q.locationSize;Gt++)y(q.location+Gt);r.bindBuffer(r.ARRAY_BUFFER,vt);for(let Gt=0;Gt<q.locationSize;Gt++)R(q.location+Gt,N/q.locationSize,Mt,rt,Et*K,(Dt+N/q.locationSize*Gt)*K,xt)}else{if($.isInstancedBufferAttribute){for(let ut=0;ut<q.locationSize;ut++)g(q.location+ut,$.meshPerAttribute);D.isInstancedMesh!==!0&&st._maxInstanceCount===void 0&&(st._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let ut=0;ut<q.locationSize;ut++)y(q.location+ut);r.bindBuffer(r.ARRAY_BUFFER,vt);for(let ut=0;ut<q.locationSize;ut++)R(q.location+ut,N/q.locationSize,Mt,rt,N*K,N/q.locationSize*ut*K,xt)}}else if(I!==void 0){const rt=I[Y];if(rt!==void 0)switch(rt.length){case 2:r.vertexAttrib2fv(q.location,rt);break;case 3:r.vertexAttrib3fv(q.location,rt);break;case 4:r.vertexAttrib4fv(q.location,rt);break;default:r.vertexAttrib1fv(q.location,rt)}}}}B()}function V(){X();for(const D in s){const z=s[D];for(const lt in z){const st=z[lt];for(const dt in st)_(st[dt].object),delete st[dt];delete z[lt]}delete s[D]}}function F(D){if(s[D.id]===void 0)return;const z=s[D.id];for(const lt in z){const st=z[lt];for(const dt in st)_(st[dt].object),delete st[dt];delete z[lt]}delete s[D.id]}function L(D){for(const z in s){const lt=s[z];if(lt[D.id]===void 0)continue;const st=lt[D.id];for(const dt in st)_(st[dt].object),delete st[dt];delete lt[D.id]}}function X(){U(),h=!0,c!==l&&(c=l,p(c.object))}function U(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:X,resetDefaultState:U,dispose:V,releaseStatesOfGeometry:F,releaseStatesOfProgram:L,initAttributes:E,enableAttribute:y,disableUnusedAttributes:B}}function RT(r,t,i){let s;function l(p){s=p}function c(p,_){r.drawArrays(s,p,_),i.update(_,s,1)}function h(p,_,v){v!==0&&(r.drawArraysInstanced(s,p,_,v),i.update(_,s,v))}function d(p,_,v){if(v===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(s,p,0,_,0,v);let M=0;for(let b=0;b<v;b++)M+=_[b];i.update(M,s,1)}function m(p,_,v,S){if(v===0)return;const M=t.get("WEBGL_multi_draw");if(M===null)for(let b=0;b<p.length;b++)h(p[b],_[b],S[b]);else{M.multiDrawArraysInstancedWEBGL(s,p,0,_,0,S,0,v);let b=0;for(let E=0;E<v;E++)b+=_[E]*S[E];i.update(b,s,1)}}this.setMode=l,this.render=c,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=m}function CT(r,t,i,s){let l;function c(){if(l!==void 0)return l;if(t.has("EXT_texture_filter_anisotropic")===!0){const L=t.get("EXT_texture_filter_anisotropic");l=r.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function h(L){return!(L!==bi&&s.convert(L)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(L){const X=L===Zo&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(L!==zi&&s.convert(L)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&L!==ua&&!X)}function m(L){if(L==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let p=i.precision!==void 0?i.precision:"highp";const _=m(p);_!==p&&(console.warn("THREE.WebGLRenderer:",p,"not supported, using",_,"instead."),p=_);const v=i.logarithmicDepthBuffer===!0,S=i.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),M=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),b=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),E=r.getParameter(r.MAX_TEXTURE_SIZE),y=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),g=r.getParameter(r.MAX_VERTEX_ATTRIBS),B=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),R=r.getParameter(r.MAX_VARYING_VECTORS),w=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),V=b>0,F=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:c,getMaxPrecision:m,textureFormatReadable:h,textureTypeReadable:d,precision:p,logarithmicDepthBuffer:v,reversedDepthBuffer:S,maxTextures:M,maxVertexTextures:b,maxTextureSize:E,maxCubemapSize:y,maxAttributes:g,maxVertexUniforms:B,maxVaryings:R,maxFragmentUniforms:w,vertexTextures:V,maxSamples:F}}function wT(r){const t=this;let i=null,s=0,l=!1,c=!1;const h=new ka,d=new me,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(v,S){const M=v.length!==0||S||s!==0||l;return l=S,s=v.length,M},this.beginShadows=function(){c=!0,_(null)},this.endShadows=function(){c=!1},this.setGlobalState=function(v,S){i=_(v,S,0)},this.setState=function(v,S,M){const b=v.clippingPlanes,E=v.clipIntersection,y=v.clipShadows,g=r.get(v);if(!l||b===null||b.length===0||c&&!y)c?_(null):p();else{const B=c?0:s,R=B*4;let w=g.clippingState||null;m.value=w,w=_(b,S,R,M);for(let V=0;V!==R;++V)w[V]=i[V];g.clippingState=w,this.numIntersection=E?this.numPlanes:0,this.numPlanes+=B}};function p(){m.value!==i&&(m.value=i,m.needsUpdate=s>0),t.numPlanes=s,t.numIntersection=0}function _(v,S,M,b){const E=v!==null?v.length:0;let y=null;if(E!==0){if(y=m.value,b!==!0||y===null){const g=M+E*4,B=S.matrixWorldInverse;d.getNormalMatrix(B),(y===null||y.length<g)&&(y=new Float32Array(g));for(let R=0,w=M;R!==E;++R,w+=4)h.copy(v[R]).applyMatrix4(B,d),h.normal.toArray(y,w),y[w+3]=h.constant}m.value=y,m.needsUpdate=!0}return t.numPlanes=E,t.numIntersection=0,y}}function DT(r){let t=new WeakMap;function i(h,d){return d===ed?h.mapping=Ir:d===nd&&(h.mapping=Br),h}function s(h){if(h&&h.isTexture){const d=h.mapping;if(d===ed||d===nd)if(t.has(h)){const m=t.get(h).texture;return i(m,h.mapping)}else{const m=h.image;if(m&&m.height>0){const p=new RM(m.height);return p.fromEquirectangularTexture(r,h),t.set(h,p),h.addEventListener("dispose",l),i(p.texture,h.mapping)}else return null}}return h}function l(h){const d=h.target;d.removeEventListener("dispose",l);const m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function c(){t=new WeakMap}return{get:s,dispose:c}}const Ur=4,b0=[.125,.215,.35,.446,.526,.582],Ms=20,Ih=new Rv,T0=new Me;let Bh=null,Fh=0,Hh=0,Gh=!1;const Ss=(1+Math.sqrt(5))/2,Ar=1/Ss,A0=[new tt(-Ss,Ar,0),new tt(Ss,Ar,0),new tt(-Ar,0,Ss),new tt(Ar,0,Ss),new tt(0,Ss,-Ar),new tt(0,Ss,Ar),new tt(-1,1,-1),new tt(1,1,-1),new tt(-1,1,1),new tt(1,1,1)],UT=new tt;class R0{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,i=0,s=.1,l=100,c={}){const{size:h=256,position:d=UT}=c;Bh=this._renderer.getRenderTarget(),Fh=this._renderer.getActiveCubeFace(),Hh=this._renderer.getActiveMipmapLevel(),Gh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(h);const m=this._allocateTargets();return m.depthBuffer=!0,this._sceneToCubeUV(t,s,l,m,d),i>0&&this._blur(m,0,0,i),this._applyPMREM(m),this._cleanup(m),m}fromEquirectangular(t,i=null){return this._fromTexture(t,i)}fromCubemap(t,i=null){return this._fromTexture(t,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=D0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=w0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Bh,Fh,Hh),this._renderer.xr.enabled=Gh,t.scissorTest=!1,Uc(t,0,0,t.width,t.height)}_fromTexture(t,i){t.mapping===Ir||t.mapping===Br?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Bh=this._renderer.getRenderTarget(),Fh=this._renderer.getActiveCubeFace(),Hh=this._renderer.getActiveMipmapLevel(),Gh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const s=i||this._allocateTargets();return this._textureToCubeUV(t,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,s={magFilter:Li,minFilter:Li,generateMipmaps:!1,type:Zo,format:bi,colorSpace:Fr,depthBuffer:!1},l=C0(t,i,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=C0(t,i,s);const{_lodMax:c}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=NT(c)),this._blurMaterial=LT(c,t,i)}return l}_compileMaterial(t){const i=new wn(this._lodPlanes[0],t);this._renderer.compile(i,Ih)}_sceneToCubeUV(t,i,s,l,c){const m=new gi(90,1,i,s),p=[1,-1,1,1,1,1],_=[1,1,1,-1,-1,-1],v=this._renderer,S=v.autoClear,M=v.toneMapping;v.getClearColor(T0),v.toneMapping=Wa,v.autoClear=!1,v.state.buffers.depth.getReversed()&&(v.setRenderTarget(l),v.clearDepth(),v.setRenderTarget(null));const E=new ca({name:"PMREM.Background",side:Wn,depthWrite:!1,depthTest:!1}),y=new wn(new Jo,E);let g=!1;const B=t.background;B?B.isColor&&(E.color.copy(B),t.background=null,g=!0):(E.color.copy(T0),g=!0);for(let R=0;R<6;R++){const w=R%3;w===0?(m.up.set(0,p[R],0),m.position.set(c.x,c.y,c.z),m.lookAt(c.x+_[R],c.y,c.z)):w===1?(m.up.set(0,0,p[R]),m.position.set(c.x,c.y,c.z),m.lookAt(c.x,c.y+_[R],c.z)):(m.up.set(0,p[R],0),m.position.set(c.x,c.y,c.z),m.lookAt(c.x,c.y,c.z+_[R]));const V=this._cubeSize;Uc(l,w*V,R>2?V:0,V,V),v.setRenderTarget(l),g&&v.render(y,m),v.render(t,m)}y.geometry.dispose(),y.material.dispose(),v.toneMapping=M,v.autoClear=S,t.background=B}_textureToCubeUV(t,i){const s=this._renderer,l=t.mapping===Ir||t.mapping===Br;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=D0()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=w0());const c=l?this._cubemapMaterial:this._equirectMaterial,h=new wn(this._lodPlanes[0],c),d=c.uniforms;d.envMap.value=t;const m=this._cubeSize;Uc(i,0,0,3*m,2*m),s.setRenderTarget(i),s.render(h,Ih)}_applyPMREM(t){const i=this._renderer,s=i.autoClear;i.autoClear=!1;const l=this._lodPlanes.length;for(let c=1;c<l;c++){const h=Math.sqrt(this._sigmas[c]*this._sigmas[c]-this._sigmas[c-1]*this._sigmas[c-1]),d=A0[(l-c-1)%A0.length];this._blur(t,c-1,c,h,d)}i.autoClear=s}_blur(t,i,s,l,c){const h=this._pingPongRenderTarget;this._halfBlur(t,h,i,s,l,"latitudinal",c),this._halfBlur(h,t,s,s,l,"longitudinal",c)}_halfBlur(t,i,s,l,c,h,d){const m=this._renderer,p=this._blurMaterial;h!=="latitudinal"&&h!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const _=3,v=new wn(this._lodPlanes[l],p),S=p.uniforms,M=this._sizeLods[s]-1,b=isFinite(c)?Math.PI/(2*M):2*Math.PI/(2*Ms-1),E=c/b,y=isFinite(c)?1+Math.floor(_*E):Ms;y>Ms&&console.warn(`sigmaRadians, ${c}, is too large and will clip, as it requested ${y} samples when the maximum is set to ${Ms}`);const g=[];let B=0;for(let L=0;L<Ms;++L){const X=L/E,U=Math.exp(-X*X/2);g.push(U),L===0?B+=U:L<y&&(B+=2*U)}for(let L=0;L<g.length;L++)g[L]=g[L]/B;S.envMap.value=t.texture,S.samples.value=y,S.weights.value=g,S.latitudinal.value=h==="latitudinal",d&&(S.poleAxis.value=d);const{_lodMax:R}=this;S.dTheta.value=b,S.mipInt.value=R-s;const w=this._sizeLods[l],V=3*w*(l>R-Ur?l-R+Ur:0),F=4*(this._cubeSize-w);Uc(i,V,F,3*w,2*w),m.setRenderTarget(i),m.render(v,Ih)}}function NT(r){const t=[],i=[],s=[];let l=r;const c=r-Ur+1+b0.length;for(let h=0;h<c;h++){const d=Math.pow(2,l);i.push(d);let m=1/d;h>r-Ur?m=b0[h-r+Ur-1]:h===0&&(m=0),s.push(m);const p=1/(d-2),_=-p,v=1+p,S=[_,_,v,_,v,v,_,_,v,v,_,v],M=6,b=6,E=3,y=2,g=1,B=new Float32Array(E*b*M),R=new Float32Array(y*b*M),w=new Float32Array(g*b*M);for(let F=0;F<M;F++){const L=F%3*2/3-1,X=F>2?0:-1,U=[L,X,0,L+2/3,X,0,L+2/3,X+1,0,L,X,0,L+2/3,X+1,0,L,X+1,0];B.set(U,E*b*F),R.set(S,y*b*F);const D=[F,F,F,F,F,F];w.set(D,g*b*F)}const V=new Mn;V.setAttribute("position",new Pi(B,E)),V.setAttribute("uv",new Pi(R,y)),V.setAttribute("faceIndex",new Pi(w,g)),t.push(V),l>Ur&&l--}return{lodPlanes:t,sizeLods:i,sigmas:s}}function C0(r,t,i){const s=new Cs(r,t,i);return s.texture.mapping=Wc,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function Uc(r,t,i,s,l){r.viewport.set(t,i,s,l),r.scissor.set(t,i,s,l)}function LT(r,t,i){const s=new Float32Array(Ms),l=new tt(0,1,0);return new Ya({name:"SphericalGaussianBlur",defines:{n:Ms,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:s},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:Wd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ja,depthTest:!1,depthWrite:!1})}function w0(){return new Ya({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Wd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ja,depthTest:!1,depthWrite:!1})}function D0(){return new Ya({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Wd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ja,depthTest:!1,depthWrite:!1})}function Wd(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function OT(r){let t=new WeakMap,i=null;function s(d){if(d&&d.isTexture){const m=d.mapping,p=m===ed||m===nd,_=m===Ir||m===Br;if(p||_){let v=t.get(d);const S=v!==void 0?v.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==S)return i===null&&(i=new R0(r)),v=p?i.fromEquirectangular(d,v):i.fromCubemap(d,v),v.texture.pmremVersion=d.pmremVersion,t.set(d,v),v.texture;if(v!==void 0)return v.texture;{const M=d.image;return p&&M&&M.height>0||_&&M&&l(M)?(i===null&&(i=new R0(r)),v=p?i.fromEquirectangular(d):i.fromCubemap(d),v.texture.pmremVersion=d.pmremVersion,t.set(d,v),d.addEventListener("dispose",c),v.texture):null}}}return d}function l(d){let m=0;const p=6;for(let _=0;_<p;_++)d[_]!==void 0&&m++;return m===p}function c(d){const m=d.target;m.removeEventListener("dispose",c);const p=t.get(m);p!==void 0&&(t.delete(m),p.dispose())}function h(){t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:h}}function PT(r){const t={};function i(s){if(t[s]!==void 0)return t[s];let l;switch(s){case"WEBGL_depth_texture":l=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":l=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":l=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":l=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:l=r.getExtension(s)}return t[s]=l,l}return{has:function(s){return i(s)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(s){const l=i(s);return l===null&&Or("THREE.WebGLRenderer: "+s+" extension not supported."),l}}}function zT(r,t,i,s){const l={},c=new WeakMap;function h(v){const S=v.target;S.index!==null&&t.remove(S.index);for(const b in S.attributes)t.remove(S.attributes[b]);S.removeEventListener("dispose",h),delete l[S.id];const M=c.get(S);M&&(t.remove(M),c.delete(S)),s.releaseStatesOfGeometry(S),S.isInstancedBufferGeometry===!0&&delete S._maxInstanceCount,i.memory.geometries--}function d(v,S){return l[S.id]===!0||(S.addEventListener("dispose",h),l[S.id]=!0,i.memory.geometries++),S}function m(v){const S=v.attributes;for(const M in S)t.update(S[M],r.ARRAY_BUFFER)}function p(v){const S=[],M=v.index,b=v.attributes.position;let E=0;if(M!==null){const B=M.array;E=M.version;for(let R=0,w=B.length;R<w;R+=3){const V=B[R+0],F=B[R+1],L=B[R+2];S.push(V,F,F,L,L,V)}}else if(b!==void 0){const B=b.array;E=b.version;for(let R=0,w=B.length/3-1;R<w;R+=3){const V=R+0,F=R+1,L=R+2;S.push(V,F,F,L,L,V)}}else return;const y=new(_v(S)?yv:Sv)(S,1);y.version=E;const g=c.get(v);g&&t.remove(g),c.set(v,y)}function _(v){const S=c.get(v);if(S){const M=v.index;M!==null&&S.version<M.version&&p(v)}else p(v);return c.get(v)}return{get:d,update:m,getWireframeAttribute:_}}function IT(r,t,i){let s;function l(S){s=S}let c,h;function d(S){c=S.type,h=S.bytesPerElement}function m(S,M){r.drawElements(s,M,c,S*h),i.update(M,s,1)}function p(S,M,b){b!==0&&(r.drawElementsInstanced(s,M,c,S*h,b),i.update(M,s,b))}function _(S,M,b){if(b===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(s,M,0,c,S,0,b);let y=0;for(let g=0;g<b;g++)y+=M[g];i.update(y,s,1)}function v(S,M,b,E){if(b===0)return;const y=t.get("WEBGL_multi_draw");if(y===null)for(let g=0;g<S.length;g++)p(S[g]/h,M[g],E[g]);else{y.multiDrawElementsInstancedWEBGL(s,M,0,c,S,0,E,0,b);let g=0;for(let B=0;B<b;B++)g+=M[B]*E[B];i.update(g,s,1)}}this.setMode=l,this.setIndex=d,this.render=m,this.renderInstances=p,this.renderMultiDraw=_,this.renderMultiDrawInstances=v}function BT(r){const t={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function s(c,h,d){switch(i.calls++,h){case r.TRIANGLES:i.triangles+=d*(c/3);break;case r.LINES:i.lines+=d*(c/2);break;case r.LINE_STRIP:i.lines+=d*(c-1);break;case r.LINE_LOOP:i.lines+=d*c;break;case r.POINTS:i.points+=d*c;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",h);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:t,render:i,programs:null,autoReset:!0,reset:l,update:s}}function FT(r,t,i){const s=new WeakMap,l=new en;function c(h,d,m){const p=h.morphTargetInfluences,_=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,v=_!==void 0?_.length:0;let S=s.get(d);if(S===void 0||S.count!==v){let D=function(){X.dispose(),s.delete(d),d.removeEventListener("dispose",D)};var M=D;S!==void 0&&S.texture.dispose();const b=d.morphAttributes.position!==void 0,E=d.morphAttributes.normal!==void 0,y=d.morphAttributes.color!==void 0,g=d.morphAttributes.position||[],B=d.morphAttributes.normal||[],R=d.morphAttributes.color||[];let w=0;b===!0&&(w=1),E===!0&&(w=2),y===!0&&(w=3);let V=d.attributes.position.count*w,F=1;V>t.maxTextureSize&&(F=Math.ceil(V/t.maxTextureSize),V=t.maxTextureSize);const L=new Float32Array(V*F*4*v),X=new vv(L,V,F,v);X.type=ua,X.needsUpdate=!0;const U=w*4;for(let z=0;z<v;z++){const lt=g[z],st=B[z],dt=R[z],et=V*F*4*z;for(let I=0;I<lt.count;I++){const Y=I*U;b===!0&&(l.fromBufferAttribute(lt,I),L[et+Y+0]=l.x,L[et+Y+1]=l.y,L[et+Y+2]=l.z,L[et+Y+3]=0),E===!0&&(l.fromBufferAttribute(st,I),L[et+Y+4]=l.x,L[et+Y+5]=l.y,L[et+Y+6]=l.z,L[et+Y+7]=0),y===!0&&(l.fromBufferAttribute(dt,I),L[et+Y+8]=l.x,L[et+Y+9]=l.y,L[et+Y+10]=l.z,L[et+Y+11]=dt.itemSize===4?l.w:1)}}S={count:v,texture:X,size:new ue(V,F)},s.set(d,S),d.addEventListener("dispose",D)}if(h.isInstancedMesh===!0&&h.morphTexture!==null)m.getUniforms().setValue(r,"morphTexture",h.morphTexture,i);else{let b=0;for(let y=0;y<p.length;y++)b+=p[y];const E=d.morphTargetsRelative?1:1-b;m.getUniforms().setValue(r,"morphTargetBaseInfluence",E),m.getUniforms().setValue(r,"morphTargetInfluences",p)}m.getUniforms().setValue(r,"morphTargetsTexture",S.texture,i),m.getUniforms().setValue(r,"morphTargetsTextureSize",S.size)}return{update:c}}function HT(r,t,i,s){let l=new WeakMap;function c(m){const p=s.render.frame,_=m.geometry,v=t.get(m,_);if(l.get(v)!==p&&(t.update(v),l.set(v,p)),m.isInstancedMesh&&(m.hasEventListener("dispose",d)===!1&&m.addEventListener("dispose",d),l.get(m)!==p&&(i.update(m.instanceMatrix,r.ARRAY_BUFFER),m.instanceColor!==null&&i.update(m.instanceColor,r.ARRAY_BUFFER),l.set(m,p))),m.isSkinnedMesh){const S=m.skeleton;l.get(S)!==p&&(S.update(),l.set(S,p))}return v}function h(){l=new WeakMap}function d(m){const p=m.target;p.removeEventListener("dispose",d),i.remove(p.instanceMatrix),p.instanceColor!==null&&i.remove(p.instanceColor)}return{update:c,dispose:h}}const wv=new qn,U0=new Tv(1,1),Dv=new vv,Uv=new uM,Nv=new bv,N0=[],L0=[],O0=new Float32Array(16),P0=new Float32Array(9),z0=new Float32Array(4);function Vr(r,t,i){const s=r[0];if(s<=0||s>0)return r;const l=t*i;let c=N0[l];if(c===void 0&&(c=new Float32Array(l),N0[l]=c),t!==0){s.toArray(c,0);for(let h=1,d=0;h!==t;++h)d+=i,r[h].toArray(c,d)}return c}function _n(r,t){if(r.length!==t.length)return!1;for(let i=0,s=r.length;i<s;i++)if(r[i]!==t[i])return!1;return!0}function vn(r,t){for(let i=0,s=t.length;i<s;i++)r[i]=t[i]}function Kc(r,t){let i=L0[t];i===void 0&&(i=new Int32Array(t),L0[t]=i);for(let s=0;s!==t;++s)i[s]=r.allocateTextureUnit();return i}function GT(r,t){const i=this.cache;i[0]!==t&&(r.uniform1f(this.addr,t),i[0]=t)}function VT(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(_n(i,t))return;r.uniform2fv(this.addr,t),vn(i,t)}}function kT(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else if(t.r!==void 0)(i[0]!==t.r||i[1]!==t.g||i[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),i[0]=t.r,i[1]=t.g,i[2]=t.b);else{if(_n(i,t))return;r.uniform3fv(this.addr,t),vn(i,t)}}function XT(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(_n(i,t))return;r.uniform4fv(this.addr,t),vn(i,t)}}function jT(r,t){const i=this.cache,s=t.elements;if(s===void 0){if(_n(i,t))return;r.uniformMatrix2fv(this.addr,!1,t),vn(i,t)}else{if(_n(i,s))return;z0.set(s),r.uniformMatrix2fv(this.addr,!1,z0),vn(i,s)}}function WT(r,t){const i=this.cache,s=t.elements;if(s===void 0){if(_n(i,t))return;r.uniformMatrix3fv(this.addr,!1,t),vn(i,t)}else{if(_n(i,s))return;P0.set(s),r.uniformMatrix3fv(this.addr,!1,P0),vn(i,s)}}function qT(r,t){const i=this.cache,s=t.elements;if(s===void 0){if(_n(i,t))return;r.uniformMatrix4fv(this.addr,!1,t),vn(i,t)}else{if(_n(i,s))return;O0.set(s),r.uniformMatrix4fv(this.addr,!1,O0),vn(i,s)}}function YT(r,t){const i=this.cache;i[0]!==t&&(r.uniform1i(this.addr,t),i[0]=t)}function ZT(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(_n(i,t))return;r.uniform2iv(this.addr,t),vn(i,t)}}function KT(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(_n(i,t))return;r.uniform3iv(this.addr,t),vn(i,t)}}function QT(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(_n(i,t))return;r.uniform4iv(this.addr,t),vn(i,t)}}function JT(r,t){const i=this.cache;i[0]!==t&&(r.uniform1ui(this.addr,t),i[0]=t)}function $T(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if(_n(i,t))return;r.uniform2uiv(this.addr,t),vn(i,t)}}function tA(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if(_n(i,t))return;r.uniform3uiv(this.addr,t),vn(i,t)}}function eA(r,t){const i=this.cache;if(t.x!==void 0)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if(_n(i,t))return;r.uniform4uiv(this.addr,t),vn(i,t)}}function nA(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l);let c;this.type===r.SAMPLER_2D_SHADOW?(U0.compareFunction=gv,c=U0):c=wv,i.setTexture2D(t||c,l)}function iA(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTexture3D(t||Uv,l)}function aA(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTextureCube(t||Nv,l)}function sA(r,t,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTexture2DArray(t||Dv,l)}function rA(r){switch(r){case 5126:return GT;case 35664:return VT;case 35665:return kT;case 35666:return XT;case 35674:return jT;case 35675:return WT;case 35676:return qT;case 5124:case 35670:return YT;case 35667:case 35671:return ZT;case 35668:case 35672:return KT;case 35669:case 35673:return QT;case 5125:return JT;case 36294:return $T;case 36295:return tA;case 36296:return eA;case 35678:case 36198:case 36298:case 36306:case 35682:return nA;case 35679:case 36299:case 36307:return iA;case 35680:case 36300:case 36308:case 36293:return aA;case 36289:case 36303:case 36311:case 36292:return sA}}function oA(r,t){r.uniform1fv(this.addr,t)}function lA(r,t){const i=Vr(t,this.size,2);r.uniform2fv(this.addr,i)}function cA(r,t){const i=Vr(t,this.size,3);r.uniform3fv(this.addr,i)}function uA(r,t){const i=Vr(t,this.size,4);r.uniform4fv(this.addr,i)}function fA(r,t){const i=Vr(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,i)}function hA(r,t){const i=Vr(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,i)}function dA(r,t){const i=Vr(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,i)}function pA(r,t){r.uniform1iv(this.addr,t)}function mA(r,t){r.uniform2iv(this.addr,t)}function gA(r,t){r.uniform3iv(this.addr,t)}function _A(r,t){r.uniform4iv(this.addr,t)}function vA(r,t){r.uniform1uiv(this.addr,t)}function xA(r,t){r.uniform2uiv(this.addr,t)}function SA(r,t){r.uniform3uiv(this.addr,t)}function yA(r,t){r.uniform4uiv(this.addr,t)}function MA(r,t,i){const s=this.cache,l=t.length,c=Kc(i,l);_n(s,c)||(r.uniform1iv(this.addr,c),vn(s,c));for(let h=0;h!==l;++h)i.setTexture2D(t[h]||wv,c[h])}function EA(r,t,i){const s=this.cache,l=t.length,c=Kc(i,l);_n(s,c)||(r.uniform1iv(this.addr,c),vn(s,c));for(let h=0;h!==l;++h)i.setTexture3D(t[h]||Uv,c[h])}function bA(r,t,i){const s=this.cache,l=t.length,c=Kc(i,l);_n(s,c)||(r.uniform1iv(this.addr,c),vn(s,c));for(let h=0;h!==l;++h)i.setTextureCube(t[h]||Nv,c[h])}function TA(r,t,i){const s=this.cache,l=t.length,c=Kc(i,l);_n(s,c)||(r.uniform1iv(this.addr,c),vn(s,c));for(let h=0;h!==l;++h)i.setTexture2DArray(t[h]||Dv,c[h])}function AA(r){switch(r){case 5126:return oA;case 35664:return lA;case 35665:return cA;case 35666:return uA;case 35674:return fA;case 35675:return hA;case 35676:return dA;case 5124:case 35670:return pA;case 35667:case 35671:return mA;case 35668:case 35672:return gA;case 35669:case 35673:return _A;case 5125:return vA;case 36294:return xA;case 36295:return SA;case 36296:return yA;case 35678:case 36198:case 36298:case 36306:case 35682:return MA;case 35679:case 36299:case 36307:return EA;case 35680:case 36300:case 36308:case 36293:return bA;case 36289:case 36303:case 36311:case 36292:return TA}}class RA{constructor(t,i,s){this.id=t,this.addr=s,this.cache=[],this.type=i.type,this.setValue=rA(i.type)}}class CA{constructor(t,i,s){this.id=t,this.addr=s,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=AA(i.type)}}class wA{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,i,s){const l=this.seq;for(let c=0,h=l.length;c!==h;++c){const d=l[c];d.setValue(t,i[d.id],s)}}}const Vh=/(\w+)(\])?(\[|\.)?/g;function I0(r,t){r.seq.push(t),r.map[t.id]=t}function DA(r,t,i){const s=r.name,l=s.length;for(Vh.lastIndex=0;;){const c=Vh.exec(s),h=Vh.lastIndex;let d=c[1];const m=c[2]==="]",p=c[3];if(m&&(d=d|0),p===void 0||p==="["&&h+2===l){I0(i,p===void 0?new RA(d,r,t):new CA(d,r,t));break}else{let v=i.map[d];v===void 0&&(v=new wA(d),I0(i,v)),i=v}}}class Hc{constructor(t,i){this.seq=[],this.map={};const s=t.getProgramParameter(i,t.ACTIVE_UNIFORMS);for(let l=0;l<s;++l){const c=t.getActiveUniform(i,l),h=t.getUniformLocation(i,c.name);DA(c,h,this)}}setValue(t,i,s,l){const c=this.map[i];c!==void 0&&c.setValue(t,s,l)}setOptional(t,i,s){const l=i[s];l!==void 0&&this.setValue(t,s,l)}static upload(t,i,s,l){for(let c=0,h=i.length;c!==h;++c){const d=i[c],m=s[d.id];m.needsUpdate!==!1&&d.setValue(t,m.value,l)}}static seqWithValue(t,i){const s=[];for(let l=0,c=t.length;l!==c;++l){const h=t[l];h.id in i&&s.push(h)}return s}}function B0(r,t,i){const s=r.createShader(t);return r.shaderSource(s,i),r.compileShader(s),s}const UA=37297;let NA=0;function LA(r,t){const i=r.split(`
`),s=[],l=Math.max(t-6,0),c=Math.min(t+6,i.length);for(let h=l;h<c;h++){const d=h+1;s.push(`${d===t?">":" "} ${d}: ${i[h]}`)}return s.join(`
`)}const F0=new me;function OA(r){Ue._getMatrix(F0,Ue.workingColorSpace,r);const t=`mat3( ${F0.elements.map(i=>i.toFixed(4))} )`;switch(Ue.getTransfer(r)){case Gc:return[t,"LinearTransferOETF"];case Ge:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function H0(r,t,i){const s=r.getShaderParameter(t,r.COMPILE_STATUS),c=(r.getShaderInfoLog(t)||"").trim();if(s&&c==="")return"";const h=/ERROR: 0:(\d+)/.exec(c);if(h){const d=parseInt(h[1]);return i.toUpperCase()+`

`+c+`

`+LA(r.getShaderSource(t),d)}else return c}function PA(r,t){const i=OA(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}function zA(r,t){let i;switch(t){case Iy:i="Linear";break;case By:i="Reinhard";break;case Fy:i="Cineon";break;case Hy:i="ACESFilmic";break;case Vy:i="AgX";break;case ky:i="Neutral";break;case Gy:i="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),i="Linear"}return"vec3 "+r+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const Nc=new tt;function IA(){Ue.getLuminanceCoefficients(Nc);const r=Nc.x.toFixed(4),t=Nc.y.toFixed(4),i=Nc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function BA(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Xo).join(`
`)}function FA(r){const t=[];for(const i in r){const s=r[i];s!==!1&&t.push("#define "+i+" "+s)}return t.join(`
`)}function HA(r,t){const i={},s=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let l=0;l<s;l++){const c=r.getActiveAttrib(t,l),h=c.name;let d=1;c.type===r.FLOAT_MAT2&&(d=2),c.type===r.FLOAT_MAT3&&(d=3),c.type===r.FLOAT_MAT4&&(d=4),i[h]={type:c.type,location:r.getAttribLocation(t,h),locationSize:d}}return i}function Xo(r){return r!==""}function G0(r,t){const i=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function V0(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const GA=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ld(r){return r.replace(GA,kA)}const VA=new Map;function kA(r,t){let i=ge[t];if(i===void 0){const s=VA.get(t);if(s!==void 0)i=ge[s],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,s);else throw new Error("Can not resolve #include <"+t+">")}return Ld(i)}const XA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function k0(r){return r.replace(XA,jA)}function jA(r,t,i,s){let l="";for(let c=parseInt(t);c<parseInt(i);c++)l+=s.replace(/\[\s*i\s*\]/g,"[ "+c+" ]").replace(/UNROLLED_LOOP_INDEX/g,c);return l}function X0(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function WA(r){let t="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===av?t="SHADOWMAP_TYPE_PCF":r.shadowMapType===gy?t="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===la&&(t="SHADOWMAP_TYPE_VSM"),t}function qA(r){let t="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case Ir:case Br:t="ENVMAP_TYPE_CUBE";break;case Wc:t="ENVMAP_TYPE_CUBE_UV";break}return t}function YA(r){let t="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case Br:t="ENVMAP_MODE_REFRACTION";break}return t}function ZA(r){let t="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case sv:t="ENVMAP_BLENDING_MULTIPLY";break;case Py:t="ENVMAP_BLENDING_MIX";break;case zy:t="ENVMAP_BLENDING_ADD";break}return t}function KA(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const i=Math.log2(t)-2,s=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:s,maxMip:i}}function QA(r,t,i,s){const l=r.getContext(),c=i.defines;let h=i.vertexShader,d=i.fragmentShader;const m=WA(i),p=qA(i),_=YA(i),v=ZA(i),S=KA(i),M=BA(i),b=FA(c),E=l.createProgram();let y,g,B=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(y=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b].filter(Xo).join(`
`),y.length>0&&(y+=`
`),g=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b].filter(Xo).join(`
`),g.length>0&&(g+=`
`)):(y=[X0(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+_:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xo).join(`
`),g=[X0(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+p:"",i.envMap?"#define "+_:"",i.envMap?"#define "+v:"",S?"#define CUBEUV_TEXEL_WIDTH "+S.texelWidth:"",S?"#define CUBEUV_TEXEL_HEIGHT "+S.texelHeight:"",S?"#define CUBEUV_MAX_MIP "+S.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor||i.batchingColor?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==Wa?"#define TONE_MAPPING":"",i.toneMapping!==Wa?ge.tonemapping_pars_fragment:"",i.toneMapping!==Wa?zA("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",ge.colorspace_pars_fragment,PA("linearToOutputTexel",i.outputColorSpace),IA(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(Xo).join(`
`)),h=Ld(h),h=G0(h,i),h=V0(h,i),d=Ld(d),d=G0(d,i),d=V0(d,i),h=k0(h),d=k0(d),i.isRawShaderMaterial!==!0&&(B=`#version 300 es
`,y=[M,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,g=["#define varying in",i.glslVersion===Y_?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===Y_?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const R=B+y+h,w=B+g+d,V=B0(l,l.VERTEX_SHADER,R),F=B0(l,l.FRAGMENT_SHADER,w);l.attachShader(E,V),l.attachShader(E,F),i.index0AttributeName!==void 0?l.bindAttribLocation(E,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(E,0,"position"),l.linkProgram(E);function L(z){if(r.debug.checkShaderErrors){const lt=l.getProgramInfoLog(E)||"",st=l.getShaderInfoLog(V)||"",dt=l.getShaderInfoLog(F)||"",et=lt.trim(),I=st.trim(),Y=dt.trim();let q=!0,$=!0;if(l.getProgramParameter(E,l.LINK_STATUS)===!1)if(q=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(l,E,V,F);else{const rt=H0(l,V,"vertex"),N=H0(l,F,"fragment");console.error("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(E,l.VALIDATE_STATUS)+`

Material Name: `+z.name+`
Material Type: `+z.type+`

Program Info Log: `+et+`
`+rt+`
`+N)}else et!==""?console.warn("THREE.WebGLProgram: Program Info Log:",et):(I===""||Y==="")&&($=!1);$&&(z.diagnostics={runnable:q,programLog:et,vertexShader:{log:I,prefix:y},fragmentShader:{log:Y,prefix:g}})}l.deleteShader(V),l.deleteShader(F),X=new Hc(l,E),U=HA(l,E)}let X;this.getUniforms=function(){return X===void 0&&L(this),X};let U;this.getAttributes=function(){return U===void 0&&L(this),U};let D=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=l.getProgramParameter(E,UA)),D},this.destroy=function(){s.releaseStatesOfProgram(this),l.deleteProgram(E),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=NA++,this.cacheKey=t,this.usedTimes=1,this.program=E,this.vertexShader=V,this.fragmentShader=F,this}let JA=0;class $A{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const i=t.vertexShader,s=t.fragmentShader,l=this._getShaderStage(i),c=this._getShaderStage(s),h=this._getShaderCacheForMaterial(t);return h.has(l)===!1&&(h.add(l),l.usedTimes++),h.has(c)===!1&&(h.add(c),c.usedTimes++),this}remove(t){const i=this.materialCache.get(t);for(const s of i)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const i=this.materialCache;let s=i.get(t);return s===void 0&&(s=new Set,i.set(t,s)),s}_getShaderStage(t){const i=this.shaderCache;let s=i.get(t);return s===void 0&&(s=new t1(t),i.set(t,s)),s}}class t1{constructor(t){this.id=JA++,this.code=t,this.usedTimes=0}}function e1(r,t,i,s,l,c,h){const d=new kd,m=new $A,p=new Set,_=[],v=l.logarithmicDepthBuffer,S=l.vertexTextures;let M=l.precision;const b={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function E(U){return p.add(U),U===0?"uv":`uv${U}`}function y(U,D,z,lt,st){const dt=lt.fog,et=st.geometry,I=U.isMeshStandardMaterial?lt.environment:null,Y=(U.isMeshStandardMaterial?i:t).get(U.envMap||I),q=Y&&Y.mapping===Wc?Y.image.height:null,$=b[U.type];U.precision!==null&&(M=l.getMaxPrecision(U.precision),M!==U.precision&&console.warn("THREE.WebGLProgram.getParameters:",U.precision,"not supported, using",M,"instead."));const rt=et.morphAttributes.position||et.morphAttributes.normal||et.morphAttributes.color,N=rt!==void 0?rt.length:0;let W=0;et.morphAttributes.position!==void 0&&(W=1),et.morphAttributes.normal!==void 0&&(W=2),et.morphAttributes.color!==void 0&&(W=3);let vt,Mt,K,xt;if($){const Re=Ni[$];vt=Re.vertexShader,Mt=Re.fragmentShader}else vt=U.vertexShader,Mt=U.fragmentShader,m.update(U),K=m.getVertexShaderID(U),xt=m.getFragmentShaderID(U);const ut=r.getRenderTarget(),Et=r.state.buffers.depth.getReversed(),Dt=st.isInstancedMesh===!0,Gt=st.isBatchedMesh===!0,Rt=!!U.map,Ut=!!U.matcap,O=!!Y,qt=!!U.aoMap,Pt=!!U.lightMap,Qt=!!U.bumpMap,Yt=!!U.normalMap,ke=!!U.displacementMap,Xt=!!U.emissiveMap,fe=!!U.metalnessMap,Je=!!U.roughnessMap,Qe=U.anisotropy>0,P=U.clearcoat>0,T=U.dispersion>0,at=U.iridescence>0,gt=U.sheen>0,Tt=U.transmission>0,pt=Qe&&!!U.anisotropyMap,ee=P&&!!U.clearcoatMap,Nt=P&&!!U.clearcoatNormalMap,$t=P&&!!U.clearcoatRoughnessMap,te=at&&!!U.iridescenceMap,Ct=at&&!!U.iridescenceThicknessMap,Lt=gt&&!!U.sheenColorMap,ne=gt&&!!U.sheenRoughnessMap,Ht=!!U.specularMap,zt=!!U.specularColorMap,he=!!U.specularIntensityMap,j=Tt&&!!U.transmissionMap,wt=Tt&&!!U.thicknessMap,Ot=!!U.gradientMap,kt=!!U.alphaMap,At=U.alphaTest>0,yt=!!U.alphaHash,jt=!!U.extensions;let le=Wa;U.toneMapped&&(ut===null||ut.isXRRenderTarget===!0)&&(le=r.toneMapping);const Pe={shaderID:$,shaderType:U.type,shaderName:U.name,vertexShader:vt,fragmentShader:Mt,defines:U.defines,customVertexShaderID:K,customFragmentShaderID:xt,isRawShaderMaterial:U.isRawShaderMaterial===!0,glslVersion:U.glslVersion,precision:M,batching:Gt,batchingColor:Gt&&st._colorsTexture!==null,instancing:Dt,instancingColor:Dt&&st.instanceColor!==null,instancingMorph:Dt&&st.morphTexture!==null,supportsVertexTextures:S,outputColorSpace:ut===null?r.outputColorSpace:ut.isXRRenderTarget===!0?ut.texture.colorSpace:Fr,alphaToCoverage:!!U.alphaToCoverage,map:Rt,matcap:Ut,envMap:O,envMapMode:O&&Y.mapping,envMapCubeUVHeight:q,aoMap:qt,lightMap:Pt,bumpMap:Qt,normalMap:Yt,displacementMap:S&&ke,emissiveMap:Xt,normalMapObjectSpace:Yt&&U.normalMapType===qy,normalMapTangentSpace:Yt&&U.normalMapType===mv,metalnessMap:fe,roughnessMap:Je,anisotropy:Qe,anisotropyMap:pt,clearcoat:P,clearcoatMap:ee,clearcoatNormalMap:Nt,clearcoatRoughnessMap:$t,dispersion:T,iridescence:at,iridescenceMap:te,iridescenceThicknessMap:Ct,sheen:gt,sheenColorMap:Lt,sheenRoughnessMap:ne,specularMap:Ht,specularColorMap:zt,specularIntensityMap:he,transmission:Tt,transmissionMap:j,thicknessMap:wt,gradientMap:Ot,opaque:U.transparent===!1&&U.blending===Lr&&U.alphaToCoverage===!1,alphaMap:kt,alphaTest:At,alphaHash:yt,combine:U.combine,mapUv:Rt&&E(U.map.channel),aoMapUv:qt&&E(U.aoMap.channel),lightMapUv:Pt&&E(U.lightMap.channel),bumpMapUv:Qt&&E(U.bumpMap.channel),normalMapUv:Yt&&E(U.normalMap.channel),displacementMapUv:ke&&E(U.displacementMap.channel),emissiveMapUv:Xt&&E(U.emissiveMap.channel),metalnessMapUv:fe&&E(U.metalnessMap.channel),roughnessMapUv:Je&&E(U.roughnessMap.channel),anisotropyMapUv:pt&&E(U.anisotropyMap.channel),clearcoatMapUv:ee&&E(U.clearcoatMap.channel),clearcoatNormalMapUv:Nt&&E(U.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:$t&&E(U.clearcoatRoughnessMap.channel),iridescenceMapUv:te&&E(U.iridescenceMap.channel),iridescenceThicknessMapUv:Ct&&E(U.iridescenceThicknessMap.channel),sheenColorMapUv:Lt&&E(U.sheenColorMap.channel),sheenRoughnessMapUv:ne&&E(U.sheenRoughnessMap.channel),specularMapUv:Ht&&E(U.specularMap.channel),specularColorMapUv:zt&&E(U.specularColorMap.channel),specularIntensityMapUv:he&&E(U.specularIntensityMap.channel),transmissionMapUv:j&&E(U.transmissionMap.channel),thicknessMapUv:wt&&E(U.thicknessMap.channel),alphaMapUv:kt&&E(U.alphaMap.channel),vertexTangents:!!et.attributes.tangent&&(Yt||Qe),vertexColors:U.vertexColors,vertexAlphas:U.vertexColors===!0&&!!et.attributes.color&&et.attributes.color.itemSize===4,pointsUvs:st.isPoints===!0&&!!et.attributes.uv&&(Rt||kt),fog:!!dt,useFog:U.fog===!0,fogExp2:!!dt&&dt.isFogExp2,flatShading:U.flatShading===!0&&U.wireframe===!1,sizeAttenuation:U.sizeAttenuation===!0,logarithmicDepthBuffer:v,reversedDepthBuffer:Et,skinning:st.isSkinnedMesh===!0,morphTargets:et.morphAttributes.position!==void 0,morphNormals:et.morphAttributes.normal!==void 0,morphColors:et.morphAttributes.color!==void 0,morphTargetsCount:N,morphTextureStride:W,numDirLights:D.directional.length,numPointLights:D.point.length,numSpotLights:D.spot.length,numSpotLightMaps:D.spotLightMap.length,numRectAreaLights:D.rectArea.length,numHemiLights:D.hemi.length,numDirLightShadows:D.directionalShadowMap.length,numPointLightShadows:D.pointShadowMap.length,numSpotLightShadows:D.spotShadowMap.length,numSpotLightShadowsWithMaps:D.numSpotLightShadowsWithMaps,numLightProbes:D.numLightProbes,numClippingPlanes:h.numPlanes,numClipIntersection:h.numIntersection,dithering:U.dithering,shadowMapEnabled:r.shadowMap.enabled&&z.length>0,shadowMapType:r.shadowMap.type,toneMapping:le,decodeVideoTexture:Rt&&U.map.isVideoTexture===!0&&Ue.getTransfer(U.map.colorSpace)===Ge,decodeVideoTextureEmissive:Xt&&U.emissiveMap.isVideoTexture===!0&&Ue.getTransfer(U.emissiveMap.colorSpace)===Ge,premultipliedAlpha:U.premultipliedAlpha,doubleSided:U.side===ai,flipSided:U.side===Wn,useDepthPacking:U.depthPacking>=0,depthPacking:U.depthPacking||0,index0AttributeName:U.index0AttributeName,extensionClipCullDistance:jt&&U.extensions.clipCullDistance===!0&&s.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(jt&&U.extensions.multiDraw===!0||Gt)&&s.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:s.has("KHR_parallel_shader_compile"),customProgramCacheKey:U.customProgramCacheKey()};return Pe.vertexUv1s=p.has(1),Pe.vertexUv2s=p.has(2),Pe.vertexUv3s=p.has(3),p.clear(),Pe}function g(U){const D=[];if(U.shaderID?D.push(U.shaderID):(D.push(U.customVertexShaderID),D.push(U.customFragmentShaderID)),U.defines!==void 0)for(const z in U.defines)D.push(z),D.push(U.defines[z]);return U.isRawShaderMaterial===!1&&(B(D,U),R(D,U),D.push(r.outputColorSpace)),D.push(U.customProgramCacheKey),D.join()}function B(U,D){U.push(D.precision),U.push(D.outputColorSpace),U.push(D.envMapMode),U.push(D.envMapCubeUVHeight),U.push(D.mapUv),U.push(D.alphaMapUv),U.push(D.lightMapUv),U.push(D.aoMapUv),U.push(D.bumpMapUv),U.push(D.normalMapUv),U.push(D.displacementMapUv),U.push(D.emissiveMapUv),U.push(D.metalnessMapUv),U.push(D.roughnessMapUv),U.push(D.anisotropyMapUv),U.push(D.clearcoatMapUv),U.push(D.clearcoatNormalMapUv),U.push(D.clearcoatRoughnessMapUv),U.push(D.iridescenceMapUv),U.push(D.iridescenceThicknessMapUv),U.push(D.sheenColorMapUv),U.push(D.sheenRoughnessMapUv),U.push(D.specularMapUv),U.push(D.specularColorMapUv),U.push(D.specularIntensityMapUv),U.push(D.transmissionMapUv),U.push(D.thicknessMapUv),U.push(D.combine),U.push(D.fogExp2),U.push(D.sizeAttenuation),U.push(D.morphTargetsCount),U.push(D.morphAttributeCount),U.push(D.numDirLights),U.push(D.numPointLights),U.push(D.numSpotLights),U.push(D.numSpotLightMaps),U.push(D.numHemiLights),U.push(D.numRectAreaLights),U.push(D.numDirLightShadows),U.push(D.numPointLightShadows),U.push(D.numSpotLightShadows),U.push(D.numSpotLightShadowsWithMaps),U.push(D.numLightProbes),U.push(D.shadowMapType),U.push(D.toneMapping),U.push(D.numClippingPlanes),U.push(D.numClipIntersection),U.push(D.depthPacking)}function R(U,D){d.disableAll(),D.supportsVertexTextures&&d.enable(0),D.instancing&&d.enable(1),D.instancingColor&&d.enable(2),D.instancingMorph&&d.enable(3),D.matcap&&d.enable(4),D.envMap&&d.enable(5),D.normalMapObjectSpace&&d.enable(6),D.normalMapTangentSpace&&d.enable(7),D.clearcoat&&d.enable(8),D.iridescence&&d.enable(9),D.alphaTest&&d.enable(10),D.vertexColors&&d.enable(11),D.vertexAlphas&&d.enable(12),D.vertexUv1s&&d.enable(13),D.vertexUv2s&&d.enable(14),D.vertexUv3s&&d.enable(15),D.vertexTangents&&d.enable(16),D.anisotropy&&d.enable(17),D.alphaHash&&d.enable(18),D.batching&&d.enable(19),D.dispersion&&d.enable(20),D.batchingColor&&d.enable(21),D.gradientMap&&d.enable(22),U.push(d.mask),d.disableAll(),D.fog&&d.enable(0),D.useFog&&d.enable(1),D.flatShading&&d.enable(2),D.logarithmicDepthBuffer&&d.enable(3),D.reversedDepthBuffer&&d.enable(4),D.skinning&&d.enable(5),D.morphTargets&&d.enable(6),D.morphNormals&&d.enable(7),D.morphColors&&d.enable(8),D.premultipliedAlpha&&d.enable(9),D.shadowMapEnabled&&d.enable(10),D.doubleSided&&d.enable(11),D.flipSided&&d.enable(12),D.useDepthPacking&&d.enable(13),D.dithering&&d.enable(14),D.transmission&&d.enable(15),D.sheen&&d.enable(16),D.opaque&&d.enable(17),D.pointsUvs&&d.enable(18),D.decodeVideoTexture&&d.enable(19),D.decodeVideoTextureEmissive&&d.enable(20),D.alphaToCoverage&&d.enable(21),U.push(d.mask)}function w(U){const D=b[U.type];let z;if(D){const lt=Ni[D];z=EM.clone(lt.uniforms)}else z=U.uniforms;return z}function V(U,D){let z;for(let lt=0,st=_.length;lt<st;lt++){const dt=_[lt];if(dt.cacheKey===D){z=dt,++z.usedTimes;break}}return z===void 0&&(z=new QA(r,D,U,c),_.push(z)),z}function F(U){if(--U.usedTimes===0){const D=_.indexOf(U);_[D]=_[_.length-1],_.pop(),U.destroy()}}function L(U){m.remove(U)}function X(){m.dispose()}return{getParameters:y,getProgramCacheKey:g,getUniforms:w,acquireProgram:V,releaseProgram:F,releaseShaderCache:L,programs:_,dispose:X}}function n1(){let r=new WeakMap;function t(h){return r.has(h)}function i(h){let d=r.get(h);return d===void 0&&(d={},r.set(h,d)),d}function s(h){r.delete(h)}function l(h,d,m){r.get(h)[d]=m}function c(){r=new WeakMap}return{has:t,get:i,remove:s,update:l,dispose:c}}function i1(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.z!==t.z?r.z-t.z:r.id-t.id}function j0(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function W0(){const r=[];let t=0;const i=[],s=[],l=[];function c(){t=0,i.length=0,s.length=0,l.length=0}function h(v,S,M,b,E,y){let g=r[t];return g===void 0?(g={id:v.id,object:v,geometry:S,material:M,groupOrder:b,renderOrder:v.renderOrder,z:E,group:y},r[t]=g):(g.id=v.id,g.object=v,g.geometry=S,g.material=M,g.groupOrder=b,g.renderOrder=v.renderOrder,g.z=E,g.group=y),t++,g}function d(v,S,M,b,E,y){const g=h(v,S,M,b,E,y);M.transmission>0?s.push(g):M.transparent===!0?l.push(g):i.push(g)}function m(v,S,M,b,E,y){const g=h(v,S,M,b,E,y);M.transmission>0?s.unshift(g):M.transparent===!0?l.unshift(g):i.unshift(g)}function p(v,S){i.length>1&&i.sort(v||i1),s.length>1&&s.sort(S||j0),l.length>1&&l.sort(S||j0)}function _(){for(let v=t,S=r.length;v<S;v++){const M=r[v];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:i,transmissive:s,transparent:l,init:c,push:d,unshift:m,finish:_,sort:p}}function a1(){let r=new WeakMap;function t(s,l){const c=r.get(s);let h;return c===void 0?(h=new W0,r.set(s,[h])):l>=c.length?(h=new W0,c.push(h)):h=c[l],h}function i(){r=new WeakMap}return{get:t,dispose:i}}function s1(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let i;switch(t.type){case"DirectionalLight":i={direction:new tt,color:new Me};break;case"SpotLight":i={position:new tt,direction:new tt,color:new Me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new tt,color:new Me,distance:0,decay:0};break;case"HemisphereLight":i={direction:new tt,skyColor:new Me,groundColor:new Me};break;case"RectAreaLight":i={color:new Me,position:new tt,halfWidth:new tt,halfHeight:new tt};break}return r[t.id]=i,i}}}function r1(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let i;switch(t.type){case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=i,i}}}let o1=0;function l1(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function c1(r){const t=new s1,i=r1(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let p=0;p<9;p++)s.probe.push(new tt);const l=new tt,c=new Ze,h=new Ze;function d(p){let _=0,v=0,S=0;for(let U=0;U<9;U++)s.probe[U].set(0,0,0);let M=0,b=0,E=0,y=0,g=0,B=0,R=0,w=0,V=0,F=0,L=0;p.sort(l1);for(let U=0,D=p.length;U<D;U++){const z=p[U],lt=z.color,st=z.intensity,dt=z.distance,et=z.shadow&&z.shadow.map?z.shadow.map.texture:null;if(z.isAmbientLight)_+=lt.r*st,v+=lt.g*st,S+=lt.b*st;else if(z.isLightProbe){for(let I=0;I<9;I++)s.probe[I].addScaledVector(z.sh.coefficients[I],st);L++}else if(z.isDirectionalLight){const I=t.get(z);if(I.color.copy(z.color).multiplyScalar(z.intensity),z.castShadow){const Y=z.shadow,q=i.get(z);q.shadowIntensity=Y.intensity,q.shadowBias=Y.bias,q.shadowNormalBias=Y.normalBias,q.shadowRadius=Y.radius,q.shadowMapSize=Y.mapSize,s.directionalShadow[M]=q,s.directionalShadowMap[M]=et,s.directionalShadowMatrix[M]=z.shadow.matrix,B++}s.directional[M]=I,M++}else if(z.isSpotLight){const I=t.get(z);I.position.setFromMatrixPosition(z.matrixWorld),I.color.copy(lt).multiplyScalar(st),I.distance=dt,I.coneCos=Math.cos(z.angle),I.penumbraCos=Math.cos(z.angle*(1-z.penumbra)),I.decay=z.decay,s.spot[E]=I;const Y=z.shadow;if(z.map&&(s.spotLightMap[V]=z.map,V++,Y.updateMatrices(z),z.castShadow&&F++),s.spotLightMatrix[E]=Y.matrix,z.castShadow){const q=i.get(z);q.shadowIntensity=Y.intensity,q.shadowBias=Y.bias,q.shadowNormalBias=Y.normalBias,q.shadowRadius=Y.radius,q.shadowMapSize=Y.mapSize,s.spotShadow[E]=q,s.spotShadowMap[E]=et,w++}E++}else if(z.isRectAreaLight){const I=t.get(z);I.color.copy(lt).multiplyScalar(st),I.halfWidth.set(z.width*.5,0,0),I.halfHeight.set(0,z.height*.5,0),s.rectArea[y]=I,y++}else if(z.isPointLight){const I=t.get(z);if(I.color.copy(z.color).multiplyScalar(z.intensity),I.distance=z.distance,I.decay=z.decay,z.castShadow){const Y=z.shadow,q=i.get(z);q.shadowIntensity=Y.intensity,q.shadowBias=Y.bias,q.shadowNormalBias=Y.normalBias,q.shadowRadius=Y.radius,q.shadowMapSize=Y.mapSize,q.shadowCameraNear=Y.camera.near,q.shadowCameraFar=Y.camera.far,s.pointShadow[b]=q,s.pointShadowMap[b]=et,s.pointShadowMatrix[b]=z.shadow.matrix,R++}s.point[b]=I,b++}else if(z.isHemisphereLight){const I=t.get(z);I.skyColor.copy(z.color).multiplyScalar(st),I.groundColor.copy(z.groundColor).multiplyScalar(st),s.hemi[g]=I,g++}}y>0&&(r.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Bt.LTC_FLOAT_1,s.rectAreaLTC2=Bt.LTC_FLOAT_2):(s.rectAreaLTC1=Bt.LTC_HALF_1,s.rectAreaLTC2=Bt.LTC_HALF_2)),s.ambient[0]=_,s.ambient[1]=v,s.ambient[2]=S;const X=s.hash;(X.directionalLength!==M||X.pointLength!==b||X.spotLength!==E||X.rectAreaLength!==y||X.hemiLength!==g||X.numDirectionalShadows!==B||X.numPointShadows!==R||X.numSpotShadows!==w||X.numSpotMaps!==V||X.numLightProbes!==L)&&(s.directional.length=M,s.spot.length=E,s.rectArea.length=y,s.point.length=b,s.hemi.length=g,s.directionalShadow.length=B,s.directionalShadowMap.length=B,s.pointShadow.length=R,s.pointShadowMap.length=R,s.spotShadow.length=w,s.spotShadowMap.length=w,s.directionalShadowMatrix.length=B,s.pointShadowMatrix.length=R,s.spotLightMatrix.length=w+V-F,s.spotLightMap.length=V,s.numSpotLightShadowsWithMaps=F,s.numLightProbes=L,X.directionalLength=M,X.pointLength=b,X.spotLength=E,X.rectAreaLength=y,X.hemiLength=g,X.numDirectionalShadows=B,X.numPointShadows=R,X.numSpotShadows=w,X.numSpotMaps=V,X.numLightProbes=L,s.version=o1++)}function m(p,_){let v=0,S=0,M=0,b=0,E=0;const y=_.matrixWorldInverse;for(let g=0,B=p.length;g<B;g++){const R=p[g];if(R.isDirectionalLight){const w=s.directional[v];w.direction.setFromMatrixPosition(R.matrixWorld),l.setFromMatrixPosition(R.target.matrixWorld),w.direction.sub(l),w.direction.transformDirection(y),v++}else if(R.isSpotLight){const w=s.spot[M];w.position.setFromMatrixPosition(R.matrixWorld),w.position.applyMatrix4(y),w.direction.setFromMatrixPosition(R.matrixWorld),l.setFromMatrixPosition(R.target.matrixWorld),w.direction.sub(l),w.direction.transformDirection(y),M++}else if(R.isRectAreaLight){const w=s.rectArea[b];w.position.setFromMatrixPosition(R.matrixWorld),w.position.applyMatrix4(y),h.identity(),c.copy(R.matrixWorld),c.premultiply(y),h.extractRotation(c),w.halfWidth.set(R.width*.5,0,0),w.halfHeight.set(0,R.height*.5,0),w.halfWidth.applyMatrix4(h),w.halfHeight.applyMatrix4(h),b++}else if(R.isPointLight){const w=s.point[S];w.position.setFromMatrixPosition(R.matrixWorld),w.position.applyMatrix4(y),S++}else if(R.isHemisphereLight){const w=s.hemi[E];w.direction.setFromMatrixPosition(R.matrixWorld),w.direction.transformDirection(y),E++}}}return{setup:d,setupView:m,state:s}}function q0(r){const t=new c1(r),i=[],s=[];function l(_){p.camera=_,i.length=0,s.length=0}function c(_){i.push(_)}function h(_){s.push(_)}function d(){t.setup(i)}function m(_){t.setupView(i,_)}const p={lightsArray:i,shadowsArray:s,camera:null,lights:t,transmissionRenderTarget:{}};return{init:l,state:p,setupLights:d,setupLightsView:m,pushLight:c,pushShadow:h}}function u1(r){let t=new WeakMap;function i(l,c=0){const h=t.get(l);let d;return h===void 0?(d=new q0(r),t.set(l,[d])):c>=h.length?(d=new q0(r),h.push(d)):d=h[c],d}function s(){t=new WeakMap}return{get:i,dispose:s}}const f1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,h1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function d1(r,t,i){let s=new jd;const l=new ue,c=new ue,h=new en,d=new PM({depthPacking:Wy}),m=new zM,p={},_=i.maxTextureSize,v={[qa]:Wn,[Wn]:qa,[ai]:ai},S=new Ya({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ue},radius:{value:4}},vertexShader:f1,fragmentShader:h1}),M=S.clone();M.defines.HORIZONTAL_PASS=1;const b=new Mn;b.setAttribute("position",new Pi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const E=new wn(b,S),y=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=av;let g=this.type;this.render=function(F,L,X){if(y.enabled===!1||y.autoUpdate===!1&&y.needsUpdate===!1||F.length===0)return;const U=r.getRenderTarget(),D=r.getActiveCubeFace(),z=r.getActiveMipmapLevel(),lt=r.state;lt.setBlending(ja),lt.buffers.depth.getReversed()?lt.buffers.color.setClear(0,0,0,0):lt.buffers.color.setClear(1,1,1,1),lt.buffers.depth.setTest(!0),lt.setScissorTest(!1);const st=g!==la&&this.type===la,dt=g===la&&this.type!==la;for(let et=0,I=F.length;et<I;et++){const Y=F[et],q=Y.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;l.copy(q.mapSize);const $=q.getFrameExtents();if(l.multiply($),c.copy(q.mapSize),(l.x>_||l.y>_)&&(l.x>_&&(c.x=Math.floor(_/$.x),l.x=c.x*$.x,q.mapSize.x=c.x),l.y>_&&(c.y=Math.floor(_/$.y),l.y=c.y*$.y,q.mapSize.y=c.y)),q.map===null||st===!0||dt===!0){const N=this.type!==la?{minFilter:Ti,magFilter:Ti}:{};q.map!==null&&q.map.dispose(),q.map=new Cs(l.x,l.y,N),q.map.texture.name=Y.name+".shadowMap",q.camera.updateProjectionMatrix()}r.setRenderTarget(q.map),r.clear();const rt=q.getViewportCount();for(let N=0;N<rt;N++){const W=q.getViewport(N);h.set(c.x*W.x,c.y*W.y,c.x*W.z,c.y*W.w),lt.viewport(h),q.updateMatrices(Y,N),s=q.getFrustum(),w(L,X,q.camera,Y,this.type)}q.isPointLightShadow!==!0&&this.type===la&&B(q,X),q.needsUpdate=!1}g=this.type,y.needsUpdate=!1,r.setRenderTarget(U,D,z)};function B(F,L){const X=t.update(E);S.defines.VSM_SAMPLES!==F.blurSamples&&(S.defines.VSM_SAMPLES=F.blurSamples,M.defines.VSM_SAMPLES=F.blurSamples,S.needsUpdate=!0,M.needsUpdate=!0),F.mapPass===null&&(F.mapPass=new Cs(l.x,l.y)),S.uniforms.shadow_pass.value=F.map.texture,S.uniforms.resolution.value=F.mapSize,S.uniforms.radius.value=F.radius,r.setRenderTarget(F.mapPass),r.clear(),r.renderBufferDirect(L,null,X,S,E,null),M.uniforms.shadow_pass.value=F.mapPass.texture,M.uniforms.resolution.value=F.mapSize,M.uniforms.radius.value=F.radius,r.setRenderTarget(F.map),r.clear(),r.renderBufferDirect(L,null,X,M,E,null)}function R(F,L,X,U){let D=null;const z=X.isPointLight===!0?F.customDistanceMaterial:F.customDepthMaterial;if(z!==void 0)D=z;else if(D=X.isPointLight===!0?m:d,r.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0||L.alphaToCoverage===!0){const lt=D.uuid,st=L.uuid;let dt=p[lt];dt===void 0&&(dt={},p[lt]=dt);let et=dt[st];et===void 0&&(et=D.clone(),dt[st]=et,L.addEventListener("dispose",V)),D=et}if(D.visible=L.visible,D.wireframe=L.wireframe,U===la?D.side=L.shadowSide!==null?L.shadowSide:L.side:D.side=L.shadowSide!==null?L.shadowSide:v[L.side],D.alphaMap=L.alphaMap,D.alphaTest=L.alphaToCoverage===!0?.5:L.alphaTest,D.map=L.map,D.clipShadows=L.clipShadows,D.clippingPlanes=L.clippingPlanes,D.clipIntersection=L.clipIntersection,D.displacementMap=L.displacementMap,D.displacementScale=L.displacementScale,D.displacementBias=L.displacementBias,D.wireframeLinewidth=L.wireframeLinewidth,D.linewidth=L.linewidth,X.isPointLight===!0&&D.isMeshDistanceMaterial===!0){const lt=r.properties.get(D);lt.light=X}return D}function w(F,L,X,U,D){if(F.visible===!1)return;if(F.layers.test(L.layers)&&(F.isMesh||F.isLine||F.isPoints)&&(F.castShadow||F.receiveShadow&&D===la)&&(!F.frustumCulled||s.intersectsObject(F))){F.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,F.matrixWorld);const st=t.update(F),dt=F.material;if(Array.isArray(dt)){const et=st.groups;for(let I=0,Y=et.length;I<Y;I++){const q=et[I],$=dt[q.materialIndex];if($&&$.visible){const rt=R(F,$,U,D);F.onBeforeShadow(r,F,L,X,st,rt,q),r.renderBufferDirect(X,null,st,rt,F,q),F.onAfterShadow(r,F,L,X,st,rt,q)}}}else if(dt.visible){const et=R(F,dt,U,D);F.onBeforeShadow(r,F,L,X,st,et,null),r.renderBufferDirect(X,null,st,et,F,null),F.onAfterShadow(r,F,L,X,st,et,null)}}const lt=F.children;for(let st=0,dt=lt.length;st<dt;st++)w(lt[st],L,X,U,D)}function V(F){F.target.removeEventListener("dispose",V);for(const X in p){const U=p[X],D=F.target.uuid;D in U&&(U[D].dispose(),delete U[D])}}}const p1={[Yh]:Zh,[Kh]:$h,[Qh]:td,[zr]:Jh,[Zh]:Yh,[$h]:Kh,[td]:Qh,[Jh]:zr};function m1(r,t){function i(){let j=!1;const wt=new en;let Ot=null;const kt=new en(0,0,0,0);return{setMask:function(At){Ot!==At&&!j&&(r.colorMask(At,At,At,At),Ot=At)},setLocked:function(At){j=At},setClear:function(At,yt,jt,le,Pe){Pe===!0&&(At*=le,yt*=le,jt*=le),wt.set(At,yt,jt,le),kt.equals(wt)===!1&&(r.clearColor(At,yt,jt,le),kt.copy(wt))},reset:function(){j=!1,Ot=null,kt.set(-1,0,0,0)}}}function s(){let j=!1,wt=!1,Ot=null,kt=null,At=null;return{setReversed:function(yt){if(wt!==yt){const jt=t.get("EXT_clip_control");yt?jt.clipControlEXT(jt.LOWER_LEFT_EXT,jt.ZERO_TO_ONE_EXT):jt.clipControlEXT(jt.LOWER_LEFT_EXT,jt.NEGATIVE_ONE_TO_ONE_EXT),wt=yt;const le=At;At=null,this.setClear(le)}},getReversed:function(){return wt},setTest:function(yt){yt?ut(r.DEPTH_TEST):Et(r.DEPTH_TEST)},setMask:function(yt){Ot!==yt&&!j&&(r.depthMask(yt),Ot=yt)},setFunc:function(yt){if(wt&&(yt=p1[yt]),kt!==yt){switch(yt){case Yh:r.depthFunc(r.NEVER);break;case Zh:r.depthFunc(r.ALWAYS);break;case Kh:r.depthFunc(r.LESS);break;case zr:r.depthFunc(r.LEQUAL);break;case Qh:r.depthFunc(r.EQUAL);break;case Jh:r.depthFunc(r.GEQUAL);break;case $h:r.depthFunc(r.GREATER);break;case td:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}kt=yt}},setLocked:function(yt){j=yt},setClear:function(yt){At!==yt&&(wt&&(yt=1-yt),r.clearDepth(yt),At=yt)},reset:function(){j=!1,Ot=null,kt=null,At=null,wt=!1}}}function l(){let j=!1,wt=null,Ot=null,kt=null,At=null,yt=null,jt=null,le=null,Pe=null;return{setTest:function(Re){j||(Re?ut(r.STENCIL_TEST):Et(r.STENCIL_TEST))},setMask:function(Re){wt!==Re&&!j&&(r.stencilMask(Re),wt=Re)},setFunc:function(Re,On,si){(Ot!==Re||kt!==On||At!==si)&&(r.stencilFunc(Re,On,si),Ot=Re,kt=On,At=si)},setOp:function(Re,On,si){(yt!==Re||jt!==On||le!==si)&&(r.stencilOp(Re,On,si),yt=Re,jt=On,le=si)},setLocked:function(Re){j=Re},setClear:function(Re){Pe!==Re&&(r.clearStencil(Re),Pe=Re)},reset:function(){j=!1,wt=null,Ot=null,kt=null,At=null,yt=null,jt=null,le=null,Pe=null}}}const c=new i,h=new s,d=new l,m=new WeakMap,p=new WeakMap;let _={},v={},S=new WeakMap,M=[],b=null,E=!1,y=null,g=null,B=null,R=null,w=null,V=null,F=null,L=new Me(0,0,0),X=0,U=!1,D=null,z=null,lt=null,st=null,dt=null;const et=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let I=!1,Y=0;const q=r.getParameter(r.VERSION);q.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(q)[1]),I=Y>=1):q.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),I=Y>=2);let $=null,rt={};const N=r.getParameter(r.SCISSOR_BOX),W=r.getParameter(r.VIEWPORT),vt=new en().fromArray(N),Mt=new en().fromArray(W);function K(j,wt,Ot,kt){const At=new Uint8Array(4),yt=r.createTexture();r.bindTexture(j,yt),r.texParameteri(j,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(j,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let jt=0;jt<Ot;jt++)j===r.TEXTURE_3D||j===r.TEXTURE_2D_ARRAY?r.texImage3D(wt,0,r.RGBA,1,1,kt,0,r.RGBA,r.UNSIGNED_BYTE,At):r.texImage2D(wt+jt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,At);return yt}const xt={};xt[r.TEXTURE_2D]=K(r.TEXTURE_2D,r.TEXTURE_2D,1),xt[r.TEXTURE_CUBE_MAP]=K(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),xt[r.TEXTURE_2D_ARRAY]=K(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),xt[r.TEXTURE_3D]=K(r.TEXTURE_3D,r.TEXTURE_3D,1,1),c.setClear(0,0,0,1),h.setClear(1),d.setClear(0),ut(r.DEPTH_TEST),h.setFunc(zr),Qt(!1),Yt(V_),ut(r.CULL_FACE),qt(ja);function ut(j){_[j]!==!0&&(r.enable(j),_[j]=!0)}function Et(j){_[j]!==!1&&(r.disable(j),_[j]=!1)}function Dt(j,wt){return v[j]!==wt?(r.bindFramebuffer(j,wt),v[j]=wt,j===r.DRAW_FRAMEBUFFER&&(v[r.FRAMEBUFFER]=wt),j===r.FRAMEBUFFER&&(v[r.DRAW_FRAMEBUFFER]=wt),!0):!1}function Gt(j,wt){let Ot=M,kt=!1;if(j){Ot=S.get(wt),Ot===void 0&&(Ot=[],S.set(wt,Ot));const At=j.textures;if(Ot.length!==At.length||Ot[0]!==r.COLOR_ATTACHMENT0){for(let yt=0,jt=At.length;yt<jt;yt++)Ot[yt]=r.COLOR_ATTACHMENT0+yt;Ot.length=At.length,kt=!0}}else Ot[0]!==r.BACK&&(Ot[0]=r.BACK,kt=!0);kt&&r.drawBuffers(Ot)}function Rt(j){return b!==j?(r.useProgram(j),b=j,!0):!1}const Ut={[ys]:r.FUNC_ADD,[vy]:r.FUNC_SUBTRACT,[xy]:r.FUNC_REVERSE_SUBTRACT};Ut[Sy]=r.MIN,Ut[yy]=r.MAX;const O={[My]:r.ZERO,[Ey]:r.ONE,[by]:r.SRC_COLOR,[Wh]:r.SRC_ALPHA,[Dy]:r.SRC_ALPHA_SATURATE,[Cy]:r.DST_COLOR,[Ay]:r.DST_ALPHA,[Ty]:r.ONE_MINUS_SRC_COLOR,[qh]:r.ONE_MINUS_SRC_ALPHA,[wy]:r.ONE_MINUS_DST_COLOR,[Ry]:r.ONE_MINUS_DST_ALPHA,[Uy]:r.CONSTANT_COLOR,[Ny]:r.ONE_MINUS_CONSTANT_COLOR,[Ly]:r.CONSTANT_ALPHA,[Oy]:r.ONE_MINUS_CONSTANT_ALPHA};function qt(j,wt,Ot,kt,At,yt,jt,le,Pe,Re){if(j===ja){E===!0&&(Et(r.BLEND),E=!1);return}if(E===!1&&(ut(r.BLEND),E=!0),j!==_y){if(j!==y||Re!==U){if((g!==ys||w!==ys)&&(r.blendEquation(r.FUNC_ADD),g=ys,w=ys),Re)switch(j){case Lr:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case k_:r.blendFunc(r.ONE,r.ONE);break;case X_:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case j_:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}else switch(j){case Lr:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case k_:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case X_:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case j_:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}B=null,R=null,V=null,F=null,L.set(0,0,0),X=0,y=j,U=Re}return}At=At||wt,yt=yt||Ot,jt=jt||kt,(wt!==g||At!==w)&&(r.blendEquationSeparate(Ut[wt],Ut[At]),g=wt,w=At),(Ot!==B||kt!==R||yt!==V||jt!==F)&&(r.blendFuncSeparate(O[Ot],O[kt],O[yt],O[jt]),B=Ot,R=kt,V=yt,F=jt),(le.equals(L)===!1||Pe!==X)&&(r.blendColor(le.r,le.g,le.b,Pe),L.copy(le),X=Pe),y=j,U=!1}function Pt(j,wt){j.side===ai?Et(r.CULL_FACE):ut(r.CULL_FACE);let Ot=j.side===Wn;wt&&(Ot=!Ot),Qt(Ot),j.blending===Lr&&j.transparent===!1?qt(ja):qt(j.blending,j.blendEquation,j.blendSrc,j.blendDst,j.blendEquationAlpha,j.blendSrcAlpha,j.blendDstAlpha,j.blendColor,j.blendAlpha,j.premultipliedAlpha),h.setFunc(j.depthFunc),h.setTest(j.depthTest),h.setMask(j.depthWrite),c.setMask(j.colorWrite);const kt=j.stencilWrite;d.setTest(kt),kt&&(d.setMask(j.stencilWriteMask),d.setFunc(j.stencilFunc,j.stencilRef,j.stencilFuncMask),d.setOp(j.stencilFail,j.stencilZFail,j.stencilZPass)),Xt(j.polygonOffset,j.polygonOffsetFactor,j.polygonOffsetUnits),j.alphaToCoverage===!0?ut(r.SAMPLE_ALPHA_TO_COVERAGE):Et(r.SAMPLE_ALPHA_TO_COVERAGE)}function Qt(j){D!==j&&(j?r.frontFace(r.CW):r.frontFace(r.CCW),D=j)}function Yt(j){j!==py?(ut(r.CULL_FACE),j!==z&&(j===V_?r.cullFace(r.BACK):j===my?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Et(r.CULL_FACE),z=j}function ke(j){j!==lt&&(I&&r.lineWidth(j),lt=j)}function Xt(j,wt,Ot){j?(ut(r.POLYGON_OFFSET_FILL),(st!==wt||dt!==Ot)&&(r.polygonOffset(wt,Ot),st=wt,dt=Ot)):Et(r.POLYGON_OFFSET_FILL)}function fe(j){j?ut(r.SCISSOR_TEST):Et(r.SCISSOR_TEST)}function Je(j){j===void 0&&(j=r.TEXTURE0+et-1),$!==j&&(r.activeTexture(j),$=j)}function Qe(j,wt,Ot){Ot===void 0&&($===null?Ot=r.TEXTURE0+et-1:Ot=$);let kt=rt[Ot];kt===void 0&&(kt={type:void 0,texture:void 0},rt[Ot]=kt),(kt.type!==j||kt.texture!==wt)&&($!==Ot&&(r.activeTexture(Ot),$=Ot),r.bindTexture(j,wt||xt[j]),kt.type=j,kt.texture=wt)}function P(){const j=rt[$];j!==void 0&&j.type!==void 0&&(r.bindTexture(j.type,null),j.type=void 0,j.texture=void 0)}function T(){try{r.compressedTexImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function at(){try{r.compressedTexImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function gt(){try{r.texSubImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Tt(){try{r.texSubImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function pt(){try{r.compressedTexSubImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ee(){try{r.compressedTexSubImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Nt(){try{r.texStorage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function $t(){try{r.texStorage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function te(){try{r.texImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ct(){try{r.texImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Lt(j){vt.equals(j)===!1&&(r.scissor(j.x,j.y,j.z,j.w),vt.copy(j))}function ne(j){Mt.equals(j)===!1&&(r.viewport(j.x,j.y,j.z,j.w),Mt.copy(j))}function Ht(j,wt){let Ot=p.get(wt);Ot===void 0&&(Ot=new WeakMap,p.set(wt,Ot));let kt=Ot.get(j);kt===void 0&&(kt=r.getUniformBlockIndex(wt,j.name),Ot.set(j,kt))}function zt(j,wt){const kt=p.get(wt).get(j);m.get(wt)!==kt&&(r.uniformBlockBinding(wt,kt,j.__bindingPointIndex),m.set(wt,kt))}function he(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),h.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),_={},$=null,rt={},v={},S=new WeakMap,M=[],b=null,E=!1,y=null,g=null,B=null,R=null,w=null,V=null,F=null,L=new Me(0,0,0),X=0,U=!1,D=null,z=null,lt=null,st=null,dt=null,vt.set(0,0,r.canvas.width,r.canvas.height),Mt.set(0,0,r.canvas.width,r.canvas.height),c.reset(),h.reset(),d.reset()}return{buffers:{color:c,depth:h,stencil:d},enable:ut,disable:Et,bindFramebuffer:Dt,drawBuffers:Gt,useProgram:Rt,setBlending:qt,setMaterial:Pt,setFlipSided:Qt,setCullFace:Yt,setLineWidth:ke,setPolygonOffset:Xt,setScissorTest:fe,activeTexture:Je,bindTexture:Qe,unbindTexture:P,compressedTexImage2D:T,compressedTexImage3D:at,texImage2D:te,texImage3D:Ct,updateUBOMapping:Ht,uniformBlockBinding:zt,texStorage2D:Nt,texStorage3D:$t,texSubImage2D:gt,texSubImage3D:Tt,compressedTexSubImage2D:pt,compressedTexSubImage3D:ee,scissor:Lt,viewport:ne,reset:he}}function g1(r,t,i,s,l,c,h){const d=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),p=new ue,_=new WeakMap;let v;const S=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(P,T){return M?new OffscreenCanvas(P,T):kc("canvas")}function E(P,T,at){let gt=1;const Tt=Qe(P);if((Tt.width>at||Tt.height>at)&&(gt=at/Math.max(Tt.width,Tt.height)),gt<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const pt=Math.floor(gt*Tt.width),ee=Math.floor(gt*Tt.height);v===void 0&&(v=b(pt,ee));const Nt=T?b(pt,ee):v;return Nt.width=pt,Nt.height=ee,Nt.getContext("2d").drawImage(P,0,0,pt,ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Tt.width+"x"+Tt.height+") to ("+pt+"x"+ee+")."),Nt}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Tt.width+"x"+Tt.height+")."),P;return P}function y(P){return P.generateMipmaps}function g(P){r.generateMipmap(P)}function B(P){return P.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?r.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function R(P,T,at,gt,Tt=!1){if(P!==null){if(r[P]!==void 0)return r[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let pt=T;if(T===r.RED&&(at===r.FLOAT&&(pt=r.R32F),at===r.HALF_FLOAT&&(pt=r.R16F),at===r.UNSIGNED_BYTE&&(pt=r.R8)),T===r.RED_INTEGER&&(at===r.UNSIGNED_BYTE&&(pt=r.R8UI),at===r.UNSIGNED_SHORT&&(pt=r.R16UI),at===r.UNSIGNED_INT&&(pt=r.R32UI),at===r.BYTE&&(pt=r.R8I),at===r.SHORT&&(pt=r.R16I),at===r.INT&&(pt=r.R32I)),T===r.RG&&(at===r.FLOAT&&(pt=r.RG32F),at===r.HALF_FLOAT&&(pt=r.RG16F),at===r.UNSIGNED_BYTE&&(pt=r.RG8)),T===r.RG_INTEGER&&(at===r.UNSIGNED_BYTE&&(pt=r.RG8UI),at===r.UNSIGNED_SHORT&&(pt=r.RG16UI),at===r.UNSIGNED_INT&&(pt=r.RG32UI),at===r.BYTE&&(pt=r.RG8I),at===r.SHORT&&(pt=r.RG16I),at===r.INT&&(pt=r.RG32I)),T===r.RGB_INTEGER&&(at===r.UNSIGNED_BYTE&&(pt=r.RGB8UI),at===r.UNSIGNED_SHORT&&(pt=r.RGB16UI),at===r.UNSIGNED_INT&&(pt=r.RGB32UI),at===r.BYTE&&(pt=r.RGB8I),at===r.SHORT&&(pt=r.RGB16I),at===r.INT&&(pt=r.RGB32I)),T===r.RGBA_INTEGER&&(at===r.UNSIGNED_BYTE&&(pt=r.RGBA8UI),at===r.UNSIGNED_SHORT&&(pt=r.RGBA16UI),at===r.UNSIGNED_INT&&(pt=r.RGBA32UI),at===r.BYTE&&(pt=r.RGBA8I),at===r.SHORT&&(pt=r.RGBA16I),at===r.INT&&(pt=r.RGBA32I)),T===r.RGB&&at===r.UNSIGNED_INT_5_9_9_9_REV&&(pt=r.RGB9_E5),T===r.RGBA){const ee=Tt?Gc:Ue.getTransfer(gt);at===r.FLOAT&&(pt=r.RGBA32F),at===r.HALF_FLOAT&&(pt=r.RGBA16F),at===r.UNSIGNED_BYTE&&(pt=ee===Ge?r.SRGB8_ALPHA8:r.RGBA8),at===r.UNSIGNED_SHORT_4_4_4_4&&(pt=r.RGBA4),at===r.UNSIGNED_SHORT_5_5_5_1&&(pt=r.RGB5_A1)}return(pt===r.R16F||pt===r.R32F||pt===r.RG16F||pt===r.RG32F||pt===r.RGBA16F||pt===r.RGBA32F)&&t.get("EXT_color_buffer_float"),pt}function w(P,T){let at;return P?T===null||T===As||T===Wo?at=r.DEPTH24_STENCIL8:T===ua?at=r.DEPTH32F_STENCIL8:T===jo&&(at=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===As||T===Wo?at=r.DEPTH_COMPONENT24:T===ua?at=r.DEPTH_COMPONENT32F:T===jo&&(at=r.DEPTH_COMPONENT16),at}function V(P,T){return y(P)===!0||P.isFramebufferTexture&&P.minFilter!==Ti&&P.minFilter!==Li?Math.log2(Math.max(T.width,T.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?T.mipmaps.length:1}function F(P){const T=P.target;T.removeEventListener("dispose",F),X(T),T.isVideoTexture&&_.delete(T)}function L(P){const T=P.target;T.removeEventListener("dispose",L),D(T)}function X(P){const T=s.get(P);if(T.__webglInit===void 0)return;const at=P.source,gt=S.get(at);if(gt){const Tt=gt[T.__cacheKey];Tt.usedTimes--,Tt.usedTimes===0&&U(P),Object.keys(gt).length===0&&S.delete(at)}s.remove(P)}function U(P){const T=s.get(P);r.deleteTexture(T.__webglTexture);const at=P.source,gt=S.get(at);delete gt[T.__cacheKey],h.memory.textures--}function D(P){const T=s.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),s.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let gt=0;gt<6;gt++){if(Array.isArray(T.__webglFramebuffer[gt]))for(let Tt=0;Tt<T.__webglFramebuffer[gt].length;Tt++)r.deleteFramebuffer(T.__webglFramebuffer[gt][Tt]);else r.deleteFramebuffer(T.__webglFramebuffer[gt]);T.__webglDepthbuffer&&r.deleteRenderbuffer(T.__webglDepthbuffer[gt])}else{if(Array.isArray(T.__webglFramebuffer))for(let gt=0;gt<T.__webglFramebuffer.length;gt++)r.deleteFramebuffer(T.__webglFramebuffer[gt]);else r.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&r.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&r.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let gt=0;gt<T.__webglColorRenderbuffer.length;gt++)T.__webglColorRenderbuffer[gt]&&r.deleteRenderbuffer(T.__webglColorRenderbuffer[gt]);T.__webglDepthRenderbuffer&&r.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const at=P.textures;for(let gt=0,Tt=at.length;gt<Tt;gt++){const pt=s.get(at[gt]);pt.__webglTexture&&(r.deleteTexture(pt.__webglTexture),h.memory.textures--),s.remove(at[gt])}s.remove(P)}let z=0;function lt(){z=0}function st(){const P=z;return P>=l.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+l.maxTextures),z+=1,P}function dt(P){const T=[];return T.push(P.wrapS),T.push(P.wrapT),T.push(P.wrapR||0),T.push(P.magFilter),T.push(P.minFilter),T.push(P.anisotropy),T.push(P.internalFormat),T.push(P.format),T.push(P.type),T.push(P.generateMipmaps),T.push(P.premultiplyAlpha),T.push(P.flipY),T.push(P.unpackAlignment),T.push(P.colorSpace),T.join()}function et(P,T){const at=s.get(P);if(P.isVideoTexture&&fe(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&at.__version!==P.version){const gt=P.image;if(gt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(gt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{xt(at,P,T);return}}else P.isExternalTexture&&(at.__webglTexture=P.sourceTexture?P.sourceTexture:null);i.bindTexture(r.TEXTURE_2D,at.__webglTexture,r.TEXTURE0+T)}function I(P,T){const at=s.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&at.__version!==P.version){xt(at,P,T);return}i.bindTexture(r.TEXTURE_2D_ARRAY,at.__webglTexture,r.TEXTURE0+T)}function Y(P,T){const at=s.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&at.__version!==P.version){xt(at,P,T);return}i.bindTexture(r.TEXTURE_3D,at.__webglTexture,r.TEXTURE0+T)}function q(P,T){const at=s.get(P);if(P.version>0&&at.__version!==P.version){ut(at,P,T);return}i.bindTexture(r.TEXTURE_CUBE_MAP,at.__webglTexture,r.TEXTURE0+T)}const $={[id]:r.REPEAT,[Es]:r.CLAMP_TO_EDGE,[ad]:r.MIRRORED_REPEAT},rt={[Ti]:r.NEAREST,[Xy]:r.NEAREST_MIPMAP_NEAREST,[uc]:r.NEAREST_MIPMAP_LINEAR,[Li]:r.LINEAR,[fh]:r.LINEAR_MIPMAP_NEAREST,[bs]:r.LINEAR_MIPMAP_LINEAR},N={[Yy]:r.NEVER,[tM]:r.ALWAYS,[Zy]:r.LESS,[gv]:r.LEQUAL,[Ky]:r.EQUAL,[$y]:r.GEQUAL,[Qy]:r.GREATER,[Jy]:r.NOTEQUAL};function W(P,T){if(T.type===ua&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===Li||T.magFilter===fh||T.magFilter===uc||T.magFilter===bs||T.minFilter===Li||T.minFilter===fh||T.minFilter===uc||T.minFilter===bs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(P,r.TEXTURE_WRAP_S,$[T.wrapS]),r.texParameteri(P,r.TEXTURE_WRAP_T,$[T.wrapT]),(P===r.TEXTURE_3D||P===r.TEXTURE_2D_ARRAY)&&r.texParameteri(P,r.TEXTURE_WRAP_R,$[T.wrapR]),r.texParameteri(P,r.TEXTURE_MAG_FILTER,rt[T.magFilter]),r.texParameteri(P,r.TEXTURE_MIN_FILTER,rt[T.minFilter]),T.compareFunction&&(r.texParameteri(P,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(P,r.TEXTURE_COMPARE_FUNC,N[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Ti||T.minFilter!==uc&&T.minFilter!==bs||T.type===ua&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||s.get(T).__currentAnisotropy){const at=t.get("EXT_texture_filter_anisotropic");r.texParameterf(P,at.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,l.getMaxAnisotropy())),s.get(T).__currentAnisotropy=T.anisotropy}}}function vt(P,T){let at=!1;P.__webglInit===void 0&&(P.__webglInit=!0,T.addEventListener("dispose",F));const gt=T.source;let Tt=S.get(gt);Tt===void 0&&(Tt={},S.set(gt,Tt));const pt=dt(T);if(pt!==P.__cacheKey){Tt[pt]===void 0&&(Tt[pt]={texture:r.createTexture(),usedTimes:0},h.memory.textures++,at=!0),Tt[pt].usedTimes++;const ee=Tt[P.__cacheKey];ee!==void 0&&(Tt[P.__cacheKey].usedTimes--,ee.usedTimes===0&&U(T)),P.__cacheKey=pt,P.__webglTexture=Tt[pt].texture}return at}function Mt(P,T,at){return Math.floor(Math.floor(P/at)/T)}function K(P,T,at,gt){const pt=P.updateRanges;if(pt.length===0)i.texSubImage2D(r.TEXTURE_2D,0,0,0,T.width,T.height,at,gt,T.data);else{pt.sort((Ct,Lt)=>Ct.start-Lt.start);let ee=0;for(let Ct=1;Ct<pt.length;Ct++){const Lt=pt[ee],ne=pt[Ct],Ht=Lt.start+Lt.count,zt=Mt(ne.start,T.width,4),he=Mt(Lt.start,T.width,4);ne.start<=Ht+1&&zt===he&&Mt(ne.start+ne.count-1,T.width,4)===zt?Lt.count=Math.max(Lt.count,ne.start+ne.count-Lt.start):(++ee,pt[ee]=ne)}pt.length=ee+1;const Nt=r.getParameter(r.UNPACK_ROW_LENGTH),$t=r.getParameter(r.UNPACK_SKIP_PIXELS),te=r.getParameter(r.UNPACK_SKIP_ROWS);r.pixelStorei(r.UNPACK_ROW_LENGTH,T.width);for(let Ct=0,Lt=pt.length;Ct<Lt;Ct++){const ne=pt[Ct],Ht=Math.floor(ne.start/4),zt=Math.ceil(ne.count/4),he=Ht%T.width,j=Math.floor(Ht/T.width),wt=zt,Ot=1;r.pixelStorei(r.UNPACK_SKIP_PIXELS,he),r.pixelStorei(r.UNPACK_SKIP_ROWS,j),i.texSubImage2D(r.TEXTURE_2D,0,he,j,wt,Ot,at,gt,T.data)}P.clearUpdateRanges(),r.pixelStorei(r.UNPACK_ROW_LENGTH,Nt),r.pixelStorei(r.UNPACK_SKIP_PIXELS,$t),r.pixelStorei(r.UNPACK_SKIP_ROWS,te)}}function xt(P,T,at){let gt=r.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(gt=r.TEXTURE_2D_ARRAY),T.isData3DTexture&&(gt=r.TEXTURE_3D);const Tt=vt(P,T),pt=T.source;i.bindTexture(gt,P.__webglTexture,r.TEXTURE0+at);const ee=s.get(pt);if(pt.version!==ee.__version||Tt===!0){i.activeTexture(r.TEXTURE0+at);const Nt=Ue.getPrimaries(Ue.workingColorSpace),$t=T.colorSpace===Xa?null:Ue.getPrimaries(T.colorSpace),te=T.colorSpace===Xa||Nt===$t?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,T.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,T.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);let Ct=E(T.image,!1,l.maxTextureSize);Ct=Je(T,Ct);const Lt=c.convert(T.format,T.colorSpace),ne=c.convert(T.type);let Ht=R(T.internalFormat,Lt,ne,T.colorSpace,T.isVideoTexture);W(gt,T);let zt;const he=T.mipmaps,j=T.isVideoTexture!==!0,wt=ee.__version===void 0||Tt===!0,Ot=pt.dataReady,kt=V(T,Ct);if(T.isDepthTexture)Ht=w(T.format===Yo,T.type),wt&&(j?i.texStorage2D(r.TEXTURE_2D,1,Ht,Ct.width,Ct.height):i.texImage2D(r.TEXTURE_2D,0,Ht,Ct.width,Ct.height,0,Lt,ne,null));else if(T.isDataTexture)if(he.length>0){j&&wt&&i.texStorage2D(r.TEXTURE_2D,kt,Ht,he[0].width,he[0].height);for(let At=0,yt=he.length;At<yt;At++)zt=he[At],j?Ot&&i.texSubImage2D(r.TEXTURE_2D,At,0,0,zt.width,zt.height,Lt,ne,zt.data):i.texImage2D(r.TEXTURE_2D,At,Ht,zt.width,zt.height,0,Lt,ne,zt.data);T.generateMipmaps=!1}else j?(wt&&i.texStorage2D(r.TEXTURE_2D,kt,Ht,Ct.width,Ct.height),Ot&&K(T,Ct,Lt,ne)):i.texImage2D(r.TEXTURE_2D,0,Ht,Ct.width,Ct.height,0,Lt,ne,Ct.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){j&&wt&&i.texStorage3D(r.TEXTURE_2D_ARRAY,kt,Ht,he[0].width,he[0].height,Ct.depth);for(let At=0,yt=he.length;At<yt;At++)if(zt=he[At],T.format!==bi)if(Lt!==null)if(j){if(Ot)if(T.layerUpdates.size>0){const jt=E0(zt.width,zt.height,T.format,T.type);for(const le of T.layerUpdates){const Pe=zt.data.subarray(le*jt/zt.data.BYTES_PER_ELEMENT,(le+1)*jt/zt.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,At,0,0,le,zt.width,zt.height,1,Lt,Pe)}T.clearLayerUpdates()}else i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,At,0,0,0,zt.width,zt.height,Ct.depth,Lt,zt.data)}else i.compressedTexImage3D(r.TEXTURE_2D_ARRAY,At,Ht,zt.width,zt.height,Ct.depth,0,zt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else j?Ot&&i.texSubImage3D(r.TEXTURE_2D_ARRAY,At,0,0,0,zt.width,zt.height,Ct.depth,Lt,ne,zt.data):i.texImage3D(r.TEXTURE_2D_ARRAY,At,Ht,zt.width,zt.height,Ct.depth,0,Lt,ne,zt.data)}else{j&&wt&&i.texStorage2D(r.TEXTURE_2D,kt,Ht,he[0].width,he[0].height);for(let At=0,yt=he.length;At<yt;At++)zt=he[At],T.format!==bi?Lt!==null?j?Ot&&i.compressedTexSubImage2D(r.TEXTURE_2D,At,0,0,zt.width,zt.height,Lt,zt.data):i.compressedTexImage2D(r.TEXTURE_2D,At,Ht,zt.width,zt.height,0,zt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):j?Ot&&i.texSubImage2D(r.TEXTURE_2D,At,0,0,zt.width,zt.height,Lt,ne,zt.data):i.texImage2D(r.TEXTURE_2D,At,Ht,zt.width,zt.height,0,Lt,ne,zt.data)}else if(T.isDataArrayTexture)if(j){if(wt&&i.texStorage3D(r.TEXTURE_2D_ARRAY,kt,Ht,Ct.width,Ct.height,Ct.depth),Ot)if(T.layerUpdates.size>0){const At=E0(Ct.width,Ct.height,T.format,T.type);for(const yt of T.layerUpdates){const jt=Ct.data.subarray(yt*At/Ct.data.BYTES_PER_ELEMENT,(yt+1)*At/Ct.data.BYTES_PER_ELEMENT);i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,yt,Ct.width,Ct.height,1,Lt,ne,jt)}T.clearLayerUpdates()}else i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,Ct.width,Ct.height,Ct.depth,Lt,ne,Ct.data)}else i.texImage3D(r.TEXTURE_2D_ARRAY,0,Ht,Ct.width,Ct.height,Ct.depth,0,Lt,ne,Ct.data);else if(T.isData3DTexture)j?(wt&&i.texStorage3D(r.TEXTURE_3D,kt,Ht,Ct.width,Ct.height,Ct.depth),Ot&&i.texSubImage3D(r.TEXTURE_3D,0,0,0,0,Ct.width,Ct.height,Ct.depth,Lt,ne,Ct.data)):i.texImage3D(r.TEXTURE_3D,0,Ht,Ct.width,Ct.height,Ct.depth,0,Lt,ne,Ct.data);else if(T.isFramebufferTexture){if(wt)if(j)i.texStorage2D(r.TEXTURE_2D,kt,Ht,Ct.width,Ct.height);else{let At=Ct.width,yt=Ct.height;for(let jt=0;jt<kt;jt++)i.texImage2D(r.TEXTURE_2D,jt,Ht,At,yt,0,Lt,ne,null),At>>=1,yt>>=1}}else if(he.length>0){if(j&&wt){const At=Qe(he[0]);i.texStorage2D(r.TEXTURE_2D,kt,Ht,At.width,At.height)}for(let At=0,yt=he.length;At<yt;At++)zt=he[At],j?Ot&&i.texSubImage2D(r.TEXTURE_2D,At,0,0,Lt,ne,zt):i.texImage2D(r.TEXTURE_2D,At,Ht,Lt,ne,zt);T.generateMipmaps=!1}else if(j){if(wt){const At=Qe(Ct);i.texStorage2D(r.TEXTURE_2D,kt,Ht,At.width,At.height)}Ot&&i.texSubImage2D(r.TEXTURE_2D,0,0,0,Lt,ne,Ct)}else i.texImage2D(r.TEXTURE_2D,0,Ht,Lt,ne,Ct);y(T)&&g(gt),ee.__version=pt.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function ut(P,T,at){if(T.image.length!==6)return;const gt=vt(P,T),Tt=T.source;i.bindTexture(r.TEXTURE_CUBE_MAP,P.__webglTexture,r.TEXTURE0+at);const pt=s.get(Tt);if(Tt.version!==pt.__version||gt===!0){i.activeTexture(r.TEXTURE0+at);const ee=Ue.getPrimaries(Ue.workingColorSpace),Nt=T.colorSpace===Xa?null:Ue.getPrimaries(T.colorSpace),$t=T.colorSpace===Xa||ee===Nt?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,T.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,T.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,$t);const te=T.isCompressedTexture||T.image[0].isCompressedTexture,Ct=T.image[0]&&T.image[0].isDataTexture,Lt=[];for(let yt=0;yt<6;yt++)!te&&!Ct?Lt[yt]=E(T.image[yt],!0,l.maxCubemapSize):Lt[yt]=Ct?T.image[yt].image:T.image[yt],Lt[yt]=Je(T,Lt[yt]);const ne=Lt[0],Ht=c.convert(T.format,T.colorSpace),zt=c.convert(T.type),he=R(T.internalFormat,Ht,zt,T.colorSpace),j=T.isVideoTexture!==!0,wt=pt.__version===void 0||gt===!0,Ot=Tt.dataReady;let kt=V(T,ne);W(r.TEXTURE_CUBE_MAP,T);let At;if(te){j&&wt&&i.texStorage2D(r.TEXTURE_CUBE_MAP,kt,he,ne.width,ne.height);for(let yt=0;yt<6;yt++){At=Lt[yt].mipmaps;for(let jt=0;jt<At.length;jt++){const le=At[jt];T.format!==bi?Ht!==null?j?Ot&&i.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,jt,0,0,le.width,le.height,Ht,le.data):i.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,jt,he,le.width,le.height,0,le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):j?Ot&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,jt,0,0,le.width,le.height,Ht,zt,le.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,jt,he,le.width,le.height,0,Ht,zt,le.data)}}}else{if(At=T.mipmaps,j&&wt){At.length>0&&kt++;const yt=Qe(Lt[0]);i.texStorage2D(r.TEXTURE_CUBE_MAP,kt,he,yt.width,yt.height)}for(let yt=0;yt<6;yt++)if(Ct){j?Ot&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,0,0,Lt[yt].width,Lt[yt].height,Ht,zt,Lt[yt].data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,he,Lt[yt].width,Lt[yt].height,0,Ht,zt,Lt[yt].data);for(let jt=0;jt<At.length;jt++){const Pe=At[jt].image[yt].image;j?Ot&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,jt+1,0,0,Pe.width,Pe.height,Ht,zt,Pe.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,jt+1,he,Pe.width,Pe.height,0,Ht,zt,Pe.data)}}else{j?Ot&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,0,0,Ht,zt,Lt[yt]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,he,Ht,zt,Lt[yt]);for(let jt=0;jt<At.length;jt++){const le=At[jt];j?Ot&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,jt+1,0,0,Ht,zt,le.image[yt]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+yt,jt+1,he,Ht,zt,le.image[yt])}}}y(T)&&g(r.TEXTURE_CUBE_MAP),pt.__version=Tt.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function Et(P,T,at,gt,Tt,pt){const ee=c.convert(at.format,at.colorSpace),Nt=c.convert(at.type),$t=R(at.internalFormat,ee,Nt,at.colorSpace),te=s.get(T),Ct=s.get(at);if(Ct.__renderTarget=T,!te.__hasExternalTextures){const Lt=Math.max(1,T.width>>pt),ne=Math.max(1,T.height>>pt);Tt===r.TEXTURE_3D||Tt===r.TEXTURE_2D_ARRAY?i.texImage3D(Tt,pt,$t,Lt,ne,T.depth,0,ee,Nt,null):i.texImage2D(Tt,pt,$t,Lt,ne,0,ee,Nt,null)}i.bindFramebuffer(r.FRAMEBUFFER,P),Xt(T)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,gt,Tt,Ct.__webglTexture,0,ke(T)):(Tt===r.TEXTURE_2D||Tt>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Tt<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,gt,Tt,Ct.__webglTexture,pt),i.bindFramebuffer(r.FRAMEBUFFER,null)}function Dt(P,T,at){if(r.bindRenderbuffer(r.RENDERBUFFER,P),T.depthBuffer){const gt=T.depthTexture,Tt=gt&&gt.isDepthTexture?gt.type:null,pt=w(T.stencilBuffer,Tt),ee=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Nt=ke(T);Xt(T)?d.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Nt,pt,T.width,T.height):at?r.renderbufferStorageMultisample(r.RENDERBUFFER,Nt,pt,T.width,T.height):r.renderbufferStorage(r.RENDERBUFFER,pt,T.width,T.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,ee,r.RENDERBUFFER,P)}else{const gt=T.textures;for(let Tt=0;Tt<gt.length;Tt++){const pt=gt[Tt],ee=c.convert(pt.format,pt.colorSpace),Nt=c.convert(pt.type),$t=R(pt.internalFormat,ee,Nt,pt.colorSpace),te=ke(T);at&&Xt(T)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,te,$t,T.width,T.height):Xt(T)?d.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,te,$t,T.width,T.height):r.renderbufferStorage(r.RENDERBUFFER,$t,T.width,T.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Gt(P,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(i.bindFramebuffer(r.FRAMEBUFFER,P),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const gt=s.get(T.depthTexture);gt.__renderTarget=T,(!gt.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),et(T.depthTexture,0);const Tt=gt.__webglTexture,pt=ke(T);if(T.depthTexture.format===qo)Xt(T)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Tt,0,pt):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Tt,0);else if(T.depthTexture.format===Yo)Xt(T)?d.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Tt,0,pt):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Tt,0);else throw new Error("Unknown depthTexture format")}function Rt(P){const T=s.get(P),at=P.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==P.depthTexture){const gt=P.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),gt){const Tt=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,gt.removeEventListener("dispose",Tt)};gt.addEventListener("dispose",Tt),T.__depthDisposeCallback=Tt}T.__boundDepthTexture=gt}if(P.depthTexture&&!T.__autoAllocateDepthBuffer){if(at)throw new Error("target.depthTexture not supported in Cube render targets");const gt=P.texture.mipmaps;gt&&gt.length>0?Gt(T.__webglFramebuffer[0],P):Gt(T.__webglFramebuffer,P)}else if(at){T.__webglDepthbuffer=[];for(let gt=0;gt<6;gt++)if(i.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer[gt]),T.__webglDepthbuffer[gt]===void 0)T.__webglDepthbuffer[gt]=r.createRenderbuffer(),Dt(T.__webglDepthbuffer[gt],P,!1);else{const Tt=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,pt=T.__webglDepthbuffer[gt];r.bindRenderbuffer(r.RENDERBUFFER,pt),r.framebufferRenderbuffer(r.FRAMEBUFFER,Tt,r.RENDERBUFFER,pt)}}else{const gt=P.texture.mipmaps;if(gt&&gt.length>0?i.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer[0]):i.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=r.createRenderbuffer(),Dt(T.__webglDepthbuffer,P,!1);else{const Tt=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,pt=T.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,pt),r.framebufferRenderbuffer(r.FRAMEBUFFER,Tt,r.RENDERBUFFER,pt)}}i.bindFramebuffer(r.FRAMEBUFFER,null)}function Ut(P,T,at){const gt=s.get(P);T!==void 0&&Et(gt.__webglFramebuffer,P,P.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),at!==void 0&&Rt(P)}function O(P){const T=P.texture,at=s.get(P),gt=s.get(T);P.addEventListener("dispose",L);const Tt=P.textures,pt=P.isWebGLCubeRenderTarget===!0,ee=Tt.length>1;if(ee||(gt.__webglTexture===void 0&&(gt.__webglTexture=r.createTexture()),gt.__version=T.version,h.memory.textures++),pt){at.__webglFramebuffer=[];for(let Nt=0;Nt<6;Nt++)if(T.mipmaps&&T.mipmaps.length>0){at.__webglFramebuffer[Nt]=[];for(let $t=0;$t<T.mipmaps.length;$t++)at.__webglFramebuffer[Nt][$t]=r.createFramebuffer()}else at.__webglFramebuffer[Nt]=r.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){at.__webglFramebuffer=[];for(let Nt=0;Nt<T.mipmaps.length;Nt++)at.__webglFramebuffer[Nt]=r.createFramebuffer()}else at.__webglFramebuffer=r.createFramebuffer();if(ee)for(let Nt=0,$t=Tt.length;Nt<$t;Nt++){const te=s.get(Tt[Nt]);te.__webglTexture===void 0&&(te.__webglTexture=r.createTexture(),h.memory.textures++)}if(P.samples>0&&Xt(P)===!1){at.__webglMultisampledFramebuffer=r.createFramebuffer(),at.__webglColorRenderbuffer=[],i.bindFramebuffer(r.FRAMEBUFFER,at.__webglMultisampledFramebuffer);for(let Nt=0;Nt<Tt.length;Nt++){const $t=Tt[Nt];at.__webglColorRenderbuffer[Nt]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,at.__webglColorRenderbuffer[Nt]);const te=c.convert($t.format,$t.colorSpace),Ct=c.convert($t.type),Lt=R($t.internalFormat,te,Ct,$t.colorSpace,P.isXRRenderTarget===!0),ne=ke(P);r.renderbufferStorageMultisample(r.RENDERBUFFER,ne,Lt,P.width,P.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Nt,r.RENDERBUFFER,at.__webglColorRenderbuffer[Nt])}r.bindRenderbuffer(r.RENDERBUFFER,null),P.depthBuffer&&(at.__webglDepthRenderbuffer=r.createRenderbuffer(),Dt(at.__webglDepthRenderbuffer,P,!0)),i.bindFramebuffer(r.FRAMEBUFFER,null)}}if(pt){i.bindTexture(r.TEXTURE_CUBE_MAP,gt.__webglTexture),W(r.TEXTURE_CUBE_MAP,T);for(let Nt=0;Nt<6;Nt++)if(T.mipmaps&&T.mipmaps.length>0)for(let $t=0;$t<T.mipmaps.length;$t++)Et(at.__webglFramebuffer[Nt][$t],P,T,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Nt,$t);else Et(at.__webglFramebuffer[Nt],P,T,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Nt,0);y(T)&&g(r.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(ee){for(let Nt=0,$t=Tt.length;Nt<$t;Nt++){const te=Tt[Nt],Ct=s.get(te);let Lt=r.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Lt=P.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(Lt,Ct.__webglTexture),W(Lt,te),Et(at.__webglFramebuffer,P,te,r.COLOR_ATTACHMENT0+Nt,Lt,0),y(te)&&g(Lt)}i.unbindTexture()}else{let Nt=r.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Nt=P.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(Nt,gt.__webglTexture),W(Nt,T),T.mipmaps&&T.mipmaps.length>0)for(let $t=0;$t<T.mipmaps.length;$t++)Et(at.__webglFramebuffer[$t],P,T,r.COLOR_ATTACHMENT0,Nt,$t);else Et(at.__webglFramebuffer,P,T,r.COLOR_ATTACHMENT0,Nt,0);y(T)&&g(Nt),i.unbindTexture()}P.depthBuffer&&Rt(P)}function qt(P){const T=P.textures;for(let at=0,gt=T.length;at<gt;at++){const Tt=T[at];if(y(Tt)){const pt=B(P),ee=s.get(Tt).__webglTexture;i.bindTexture(pt,ee),g(pt),i.unbindTexture()}}}const Pt=[],Qt=[];function Yt(P){if(P.samples>0){if(Xt(P)===!1){const T=P.textures,at=P.width,gt=P.height;let Tt=r.COLOR_BUFFER_BIT;const pt=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ee=s.get(P),Nt=T.length>1;if(Nt)for(let te=0;te<T.length;te++)i.bindFramebuffer(r.FRAMEBUFFER,ee.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+te,r.RENDERBUFFER,null),i.bindFramebuffer(r.FRAMEBUFFER,ee.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+te,r.TEXTURE_2D,null,0);i.bindFramebuffer(r.READ_FRAMEBUFFER,ee.__webglMultisampledFramebuffer);const $t=P.texture.mipmaps;$t&&$t.length>0?i.bindFramebuffer(r.DRAW_FRAMEBUFFER,ee.__webglFramebuffer[0]):i.bindFramebuffer(r.DRAW_FRAMEBUFFER,ee.__webglFramebuffer);for(let te=0;te<T.length;te++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(Tt|=r.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(Tt|=r.STENCIL_BUFFER_BIT)),Nt){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ee.__webglColorRenderbuffer[te]);const Ct=s.get(T[te]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Ct,0)}r.blitFramebuffer(0,0,at,gt,0,0,at,gt,Tt,r.NEAREST),m===!0&&(Pt.length=0,Qt.length=0,Pt.push(r.COLOR_ATTACHMENT0+te),P.depthBuffer&&P.resolveDepthBuffer===!1&&(Pt.push(pt),Qt.push(pt),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Qt)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,Pt))}if(i.bindFramebuffer(r.READ_FRAMEBUFFER,null),i.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Nt)for(let te=0;te<T.length;te++){i.bindFramebuffer(r.FRAMEBUFFER,ee.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+te,r.RENDERBUFFER,ee.__webglColorRenderbuffer[te]);const Ct=s.get(T[te]).__webglTexture;i.bindFramebuffer(r.FRAMEBUFFER,ee.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+te,r.TEXTURE_2D,Ct,0)}i.bindFramebuffer(r.DRAW_FRAMEBUFFER,ee.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&m){const T=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[T])}}}function ke(P){return Math.min(l.maxSamples,P.samples)}function Xt(P){const T=s.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function fe(P){const T=h.render.frame;_.get(P)!==T&&(_.set(P,T),P.update())}function Je(P,T){const at=P.colorSpace,gt=P.format,Tt=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||at!==Fr&&at!==Xa&&(Ue.getTransfer(at)===Ge?(gt!==bi||Tt!==zi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",at)),T}function Qe(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(p.width=P.naturalWidth||P.width,p.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(p.width=P.displayWidth,p.height=P.displayHeight):(p.width=P.width,p.height=P.height),p}this.allocateTextureUnit=st,this.resetTextureUnits=lt,this.setTexture2D=et,this.setTexture2DArray=I,this.setTexture3D=Y,this.setTextureCube=q,this.rebindTextures=Ut,this.setupRenderTarget=O,this.updateRenderTargetMipmap=qt,this.updateMultisampleRenderTarget=Yt,this.setupDepthRenderbuffer=Rt,this.setupFrameBufferTexture=Et,this.useMultisampledRTT=Xt}function _1(r,t){function i(s,l=Xa){let c;const h=Ue.getTransfer(l);if(s===zi)return r.UNSIGNED_BYTE;if(s===Id)return r.UNSIGNED_SHORT_4_4_4_4;if(s===Bd)return r.UNSIGNED_SHORT_5_5_5_1;if(s===cv)return r.UNSIGNED_INT_5_9_9_9_REV;if(s===ov)return r.BYTE;if(s===lv)return r.SHORT;if(s===jo)return r.UNSIGNED_SHORT;if(s===zd)return r.INT;if(s===As)return r.UNSIGNED_INT;if(s===ua)return r.FLOAT;if(s===Zo)return r.HALF_FLOAT;if(s===uv)return r.ALPHA;if(s===fv)return r.RGB;if(s===bi)return r.RGBA;if(s===qo)return r.DEPTH_COMPONENT;if(s===Yo)return r.DEPTH_STENCIL;if(s===hv)return r.RED;if(s===Fd)return r.RED_INTEGER;if(s===dv)return r.RG;if(s===Hd)return r.RG_INTEGER;if(s===Gd)return r.RGBA_INTEGER;if(s===Oc||s===Pc||s===zc||s===Ic)if(h===Ge)if(c=t.get("WEBGL_compressed_texture_s3tc_srgb"),c!==null){if(s===Oc)return c.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===Pc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===zc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===Ic)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(c=t.get("WEBGL_compressed_texture_s3tc"),c!==null){if(s===Oc)return c.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===Pc)return c.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===zc)return c.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===Ic)return c.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===sd||s===rd||s===od||s===ld)if(c=t.get("WEBGL_compressed_texture_pvrtc"),c!==null){if(s===sd)return c.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===rd)return c.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===od)return c.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===ld)return c.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===cd||s===ud||s===fd)if(c=t.get("WEBGL_compressed_texture_etc"),c!==null){if(s===cd||s===ud)return h===Ge?c.COMPRESSED_SRGB8_ETC2:c.COMPRESSED_RGB8_ETC2;if(s===fd)return h===Ge?c.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:c.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===hd||s===dd||s===pd||s===md||s===gd||s===_d||s===vd||s===xd||s===Sd||s===yd||s===Md||s===Ed||s===bd||s===Td)if(c=t.get("WEBGL_compressed_texture_astc"),c!==null){if(s===hd)return h===Ge?c.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:c.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===dd)return h===Ge?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:c.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===pd)return h===Ge?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:c.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===md)return h===Ge?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:c.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===gd)return h===Ge?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:c.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===_d)return h===Ge?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:c.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===vd)return h===Ge?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:c.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===xd)return h===Ge?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:c.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===Sd)return h===Ge?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:c.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===yd)return h===Ge?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:c.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===Md)return h===Ge?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:c.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===Ed)return h===Ge?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:c.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===bd)return h===Ge?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:c.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===Td)return h===Ge?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:c.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===Bc||s===Ad||s===Rd)if(c=t.get("EXT_texture_compression_bptc"),c!==null){if(s===Bc)return h===Ge?c.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:c.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===Ad)return c.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===Rd)return c.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===pv||s===Cd||s===wd||s===Dd)if(c=t.get("EXT_texture_compression_rgtc"),c!==null){if(s===Bc)return c.COMPRESSED_RED_RGTC1_EXT;if(s===Cd)return c.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===wd)return c.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===Dd)return c.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===Wo?r.UNSIGNED_INT_24_8:r[s]!==void 0?r[s]:null}return{convert:i}}class Lv extends qn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}}const v1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,x1=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class S1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,i){if(this.texture===null){const s=new Lv(t.texture);(t.depthNear!==i.depthNear||t.depthFar!==i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const i=t.cameras[0].viewport,s=new Ya({vertexShader:v1,fragmentShader:x1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new wn(new Zc(20,20),s)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class y1 extends Ds{constructor(t,i){super();const s=this;let l=null,c=1,h=null,d="local-floor",m=1,p=null,_=null,v=null,S=null,M=null,b=null;const E=new S1,y={},g=i.getContextAttributes();let B=null,R=null;const w=[],V=[],F=new ue;let L=null;const X=new gi;X.viewport=new en;const U=new gi;U.viewport=new en;const D=[X,U],z=new HM;let lt=null,st=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let xt=w[K];return xt===void 0&&(xt=new Lh,w[K]=xt),xt.getTargetRaySpace()},this.getControllerGrip=function(K){let xt=w[K];return xt===void 0&&(xt=new Lh,w[K]=xt),xt.getGripSpace()},this.getHand=function(K){let xt=w[K];return xt===void 0&&(xt=new Lh,w[K]=xt),xt.getHandSpace()};function dt(K){const xt=V.indexOf(K.inputSource);if(xt===-1)return;const ut=w[xt];ut!==void 0&&(ut.update(K.inputSource,K.frame,p||h),ut.dispatchEvent({type:K.type,data:K.inputSource}))}function et(){l.removeEventListener("select",dt),l.removeEventListener("selectstart",dt),l.removeEventListener("selectend",dt),l.removeEventListener("squeeze",dt),l.removeEventListener("squeezestart",dt),l.removeEventListener("squeezeend",dt),l.removeEventListener("end",et),l.removeEventListener("inputsourceschange",I);for(let K=0;K<w.length;K++){const xt=V[K];xt!==null&&(V[K]=null,w[K].disconnect(xt))}lt=null,st=null,E.reset();for(const K in y)delete y[K];t.setRenderTarget(B),M=null,S=null,v=null,l=null,R=null,Mt.stop(),s.isPresenting=!1,t.setPixelRatio(L),t.setSize(F.width,F.height,!1),s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){c=K,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){d=K,s.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return p||h},this.setReferenceSpace=function(K){p=K},this.getBaseLayer=function(){return S!==null?S:M},this.getBinding=function(){return v},this.getFrame=function(){return b},this.getSession=function(){return l},this.setSession=async function(K){if(l=K,l!==null){if(B=t.getRenderTarget(),l.addEventListener("select",dt),l.addEventListener("selectstart",dt),l.addEventListener("selectend",dt),l.addEventListener("squeeze",dt),l.addEventListener("squeezestart",dt),l.addEventListener("squeezeend",dt),l.addEventListener("end",et),l.addEventListener("inputsourceschange",I),g.xrCompatible!==!0&&await i.makeXRCompatible(),L=t.getPixelRatio(),t.getSize(F),typeof XRWebGLBinding<"u"&&(v=new XRWebGLBinding(l,i)),v!==null&&"createProjectionLayer"in XRWebGLBinding.prototype){let ut=null,Et=null,Dt=null;g.depth&&(Dt=g.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,ut=g.stencil?Yo:qo,Et=g.stencil?Wo:As);const Gt={colorFormat:i.RGBA8,depthFormat:Dt,scaleFactor:c};S=v.createProjectionLayer(Gt),l.updateRenderState({layers:[S]}),t.setPixelRatio(1),t.setSize(S.textureWidth,S.textureHeight,!1),R=new Cs(S.textureWidth,S.textureHeight,{format:bi,type:zi,depthTexture:new Tv(S.textureWidth,S.textureHeight,Et,void 0,void 0,void 0,void 0,void 0,void 0,ut),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:S.ignoreDepthValues===!1,resolveStencilBuffer:S.ignoreDepthValues===!1})}else{const ut={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:c};M=new XRWebGLLayer(l,i,ut),l.updateRenderState({baseLayer:M}),t.setPixelRatio(1),t.setSize(M.framebufferWidth,M.framebufferHeight,!1),R=new Cs(M.framebufferWidth,M.framebufferHeight,{format:bi,type:zi,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil,resolveDepthBuffer:M.ignoreDepthValues===!1,resolveStencilBuffer:M.ignoreDepthValues===!1})}R.isXRRenderTarget=!0,this.setFoveation(m),p=null,h=await l.requestReferenceSpace(d),Mt.setContext(l),Mt.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return E.getDepthTexture()};function I(K){for(let xt=0;xt<K.removed.length;xt++){const ut=K.removed[xt],Et=V.indexOf(ut);Et>=0&&(V[Et]=null,w[Et].disconnect(ut))}for(let xt=0;xt<K.added.length;xt++){const ut=K.added[xt];let Et=V.indexOf(ut);if(Et===-1){for(let Gt=0;Gt<w.length;Gt++)if(Gt>=V.length){V.push(ut),Et=Gt;break}else if(V[Gt]===null){V[Gt]=ut,Et=Gt;break}if(Et===-1)break}const Dt=w[Et];Dt&&Dt.connect(ut)}}const Y=new tt,q=new tt;function $(K,xt,ut){Y.setFromMatrixPosition(xt.matrixWorld),q.setFromMatrixPosition(ut.matrixWorld);const Et=Y.distanceTo(q),Dt=xt.projectionMatrix.elements,Gt=ut.projectionMatrix.elements,Rt=Dt[14]/(Dt[10]-1),Ut=Dt[14]/(Dt[10]+1),O=(Dt[9]+1)/Dt[5],qt=(Dt[9]-1)/Dt[5],Pt=(Dt[8]-1)/Dt[0],Qt=(Gt[8]+1)/Gt[0],Yt=Rt*Pt,ke=Rt*Qt,Xt=Et/(-Pt+Qt),fe=Xt*-Pt;if(xt.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(fe),K.translateZ(Xt),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Dt[10]===-1)K.projectionMatrix.copy(xt.projectionMatrix),K.projectionMatrixInverse.copy(xt.projectionMatrixInverse);else{const Je=Rt+Xt,Qe=Ut+Xt,P=Yt-fe,T=ke+(Et-fe),at=O*Ut/Qe*Je,gt=qt*Ut/Qe*Je;K.projectionMatrix.makePerspective(P,T,at,gt,Je,Qe),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function rt(K,xt){xt===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(xt.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(l===null)return;let xt=K.near,ut=K.far;E.texture!==null&&(E.depthNear>0&&(xt=E.depthNear),E.depthFar>0&&(ut=E.depthFar)),z.near=U.near=X.near=xt,z.far=U.far=X.far=ut,(lt!==z.near||st!==z.far)&&(l.updateRenderState({depthNear:z.near,depthFar:z.far}),lt=z.near,st=z.far),z.layers.mask=K.layers.mask|6,X.layers.mask=z.layers.mask&3,U.layers.mask=z.layers.mask&5;const Et=K.parent,Dt=z.cameras;rt(z,Et);for(let Gt=0;Gt<Dt.length;Gt++)rt(Dt[Gt],Et);Dt.length===2?$(z,X,U):z.projectionMatrix.copy(X.projectionMatrix),N(K,z,Et)};function N(K,xt,ut){ut===null?K.matrix.copy(xt.matrixWorld):(K.matrix.copy(ut.matrixWorld),K.matrix.invert(),K.matrix.multiply(xt.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(xt.projectionMatrix),K.projectionMatrixInverse.copy(xt.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Ud*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(S===null&&M===null))return m},this.setFoveation=function(K){m=K,S!==null&&(S.fixedFoveation=K),M!==null&&M.fixedFoveation!==void 0&&(M.fixedFoveation=K)},this.hasDepthSensing=function(){return E.texture!==null},this.getDepthSensingMesh=function(){return E.getMesh(z)},this.getCameraTexture=function(K){return y[K]};let W=null;function vt(K,xt){if(_=xt.getViewerPose(p||h),b=xt,_!==null){const ut=_.views;M!==null&&(t.setRenderTargetFramebuffer(R,M.framebuffer),t.setRenderTarget(R));let Et=!1;ut.length!==z.cameras.length&&(z.cameras.length=0,Et=!0);for(let Ut=0;Ut<ut.length;Ut++){const O=ut[Ut];let qt=null;if(M!==null)qt=M.getViewport(O);else{const Qt=v.getViewSubImage(S,O);qt=Qt.viewport,Ut===0&&(t.setRenderTargetTextures(R,Qt.colorTexture,Qt.depthStencilTexture),t.setRenderTarget(R))}let Pt=D[Ut];Pt===void 0&&(Pt=new gi,Pt.layers.enable(Ut),Pt.viewport=new en,D[Ut]=Pt),Pt.matrix.fromArray(O.transform.matrix),Pt.matrix.decompose(Pt.position,Pt.quaternion,Pt.scale),Pt.projectionMatrix.fromArray(O.projectionMatrix),Pt.projectionMatrixInverse.copy(Pt.projectionMatrix).invert(),Pt.viewport.set(qt.x,qt.y,qt.width,qt.height),Ut===0&&(z.matrix.copy(Pt.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),Et===!0&&z.cameras.push(Pt)}const Dt=l.enabledFeatures;if(Dt&&Dt.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&v){const Ut=v.getDepthInformation(ut[0]);Ut&&Ut.isValid&&Ut.texture&&E.init(Ut,l.renderState)}if(Dt&&Dt.includes("camera-access")&&(t.state.unbindTexture(),v))for(let Ut=0;Ut<ut.length;Ut++){const O=ut[Ut].camera;if(O){let qt=y[O];qt||(qt=new Lv,y[O]=qt);const Pt=v.getCameraImage(O);qt.sourceTexture=Pt}}}for(let ut=0;ut<w.length;ut++){const Et=V[ut],Dt=w[ut];Et!==null&&Dt!==void 0&&Dt.update(Et,xt,p||h)}W&&W(K,xt),xt.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:xt}),b=null}const Mt=new Cv;Mt.setAnimationLoop(vt),this.setAnimationLoop=function(K){W=K},this.dispose=function(){}}}const xs=new Ii,M1=new Ze;function E1(r,t){function i(y,g){y.matrixAutoUpdate===!0&&y.updateMatrix(),g.value.copy(y.matrix)}function s(y,g){g.color.getRGB(y.fogColor.value,Mv(r)),g.isFog?(y.fogNear.value=g.near,y.fogFar.value=g.far):g.isFogExp2&&(y.fogDensity.value=g.density)}function l(y,g,B,R,w){g.isMeshBasicMaterial||g.isMeshLambertMaterial?c(y,g):g.isMeshToonMaterial?(c(y,g),v(y,g)):g.isMeshPhongMaterial?(c(y,g),_(y,g)):g.isMeshStandardMaterial?(c(y,g),S(y,g),g.isMeshPhysicalMaterial&&M(y,g,w)):g.isMeshMatcapMaterial?(c(y,g),b(y,g)):g.isMeshDepthMaterial?c(y,g):g.isMeshDistanceMaterial?(c(y,g),E(y,g)):g.isMeshNormalMaterial?c(y,g):g.isLineBasicMaterial?(h(y,g),g.isLineDashedMaterial&&d(y,g)):g.isPointsMaterial?m(y,g,B,R):g.isSpriteMaterial?p(y,g):g.isShadowMaterial?(y.color.value.copy(g.color),y.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function c(y,g){y.opacity.value=g.opacity,g.color&&y.diffuse.value.copy(g.color),g.emissive&&y.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(y.map.value=g.map,i(g.map,y.mapTransform)),g.alphaMap&&(y.alphaMap.value=g.alphaMap,i(g.alphaMap,y.alphaMapTransform)),g.bumpMap&&(y.bumpMap.value=g.bumpMap,i(g.bumpMap,y.bumpMapTransform),y.bumpScale.value=g.bumpScale,g.side===Wn&&(y.bumpScale.value*=-1)),g.normalMap&&(y.normalMap.value=g.normalMap,i(g.normalMap,y.normalMapTransform),y.normalScale.value.copy(g.normalScale),g.side===Wn&&y.normalScale.value.negate()),g.displacementMap&&(y.displacementMap.value=g.displacementMap,i(g.displacementMap,y.displacementMapTransform),y.displacementScale.value=g.displacementScale,y.displacementBias.value=g.displacementBias),g.emissiveMap&&(y.emissiveMap.value=g.emissiveMap,i(g.emissiveMap,y.emissiveMapTransform)),g.specularMap&&(y.specularMap.value=g.specularMap,i(g.specularMap,y.specularMapTransform)),g.alphaTest>0&&(y.alphaTest.value=g.alphaTest);const B=t.get(g),R=B.envMap,w=B.envMapRotation;R&&(y.envMap.value=R,xs.copy(w),xs.x*=-1,xs.y*=-1,xs.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(xs.y*=-1,xs.z*=-1),y.envMapRotation.value.setFromMatrix4(M1.makeRotationFromEuler(xs)),y.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,y.reflectivity.value=g.reflectivity,y.ior.value=g.ior,y.refractionRatio.value=g.refractionRatio),g.lightMap&&(y.lightMap.value=g.lightMap,y.lightMapIntensity.value=g.lightMapIntensity,i(g.lightMap,y.lightMapTransform)),g.aoMap&&(y.aoMap.value=g.aoMap,y.aoMapIntensity.value=g.aoMapIntensity,i(g.aoMap,y.aoMapTransform))}function h(y,g){y.diffuse.value.copy(g.color),y.opacity.value=g.opacity,g.map&&(y.map.value=g.map,i(g.map,y.mapTransform))}function d(y,g){y.dashSize.value=g.dashSize,y.totalSize.value=g.dashSize+g.gapSize,y.scale.value=g.scale}function m(y,g,B,R){y.diffuse.value.copy(g.color),y.opacity.value=g.opacity,y.size.value=g.size*B,y.scale.value=R*.5,g.map&&(y.map.value=g.map,i(g.map,y.uvTransform)),g.alphaMap&&(y.alphaMap.value=g.alphaMap,i(g.alphaMap,y.alphaMapTransform)),g.alphaTest>0&&(y.alphaTest.value=g.alphaTest)}function p(y,g){y.diffuse.value.copy(g.color),y.opacity.value=g.opacity,y.rotation.value=g.rotation,g.map&&(y.map.value=g.map,i(g.map,y.mapTransform)),g.alphaMap&&(y.alphaMap.value=g.alphaMap,i(g.alphaMap,y.alphaMapTransform)),g.alphaTest>0&&(y.alphaTest.value=g.alphaTest)}function _(y,g){y.specular.value.copy(g.specular),y.shininess.value=Math.max(g.shininess,1e-4)}function v(y,g){g.gradientMap&&(y.gradientMap.value=g.gradientMap)}function S(y,g){y.metalness.value=g.metalness,g.metalnessMap&&(y.metalnessMap.value=g.metalnessMap,i(g.metalnessMap,y.metalnessMapTransform)),y.roughness.value=g.roughness,g.roughnessMap&&(y.roughnessMap.value=g.roughnessMap,i(g.roughnessMap,y.roughnessMapTransform)),g.envMap&&(y.envMapIntensity.value=g.envMapIntensity)}function M(y,g,B){y.ior.value=g.ior,g.sheen>0&&(y.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),y.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(y.sheenColorMap.value=g.sheenColorMap,i(g.sheenColorMap,y.sheenColorMapTransform)),g.sheenRoughnessMap&&(y.sheenRoughnessMap.value=g.sheenRoughnessMap,i(g.sheenRoughnessMap,y.sheenRoughnessMapTransform))),g.clearcoat>0&&(y.clearcoat.value=g.clearcoat,y.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(y.clearcoatMap.value=g.clearcoatMap,i(g.clearcoatMap,y.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(y.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,i(g.clearcoatRoughnessMap,y.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(y.clearcoatNormalMap.value=g.clearcoatNormalMap,i(g.clearcoatNormalMap,y.clearcoatNormalMapTransform),y.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Wn&&y.clearcoatNormalScale.value.negate())),g.dispersion>0&&(y.dispersion.value=g.dispersion),g.iridescence>0&&(y.iridescence.value=g.iridescence,y.iridescenceIOR.value=g.iridescenceIOR,y.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],y.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(y.iridescenceMap.value=g.iridescenceMap,i(g.iridescenceMap,y.iridescenceMapTransform)),g.iridescenceThicknessMap&&(y.iridescenceThicknessMap.value=g.iridescenceThicknessMap,i(g.iridescenceThicknessMap,y.iridescenceThicknessMapTransform))),g.transmission>0&&(y.transmission.value=g.transmission,y.transmissionSamplerMap.value=B.texture,y.transmissionSamplerSize.value.set(B.width,B.height),g.transmissionMap&&(y.transmissionMap.value=g.transmissionMap,i(g.transmissionMap,y.transmissionMapTransform)),y.thickness.value=g.thickness,g.thicknessMap&&(y.thicknessMap.value=g.thicknessMap,i(g.thicknessMap,y.thicknessMapTransform)),y.attenuationDistance.value=g.attenuationDistance,y.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(y.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(y.anisotropyMap.value=g.anisotropyMap,i(g.anisotropyMap,y.anisotropyMapTransform))),y.specularIntensity.value=g.specularIntensity,y.specularColor.value.copy(g.specularColor),g.specularColorMap&&(y.specularColorMap.value=g.specularColorMap,i(g.specularColorMap,y.specularColorMapTransform)),g.specularIntensityMap&&(y.specularIntensityMap.value=g.specularIntensityMap,i(g.specularIntensityMap,y.specularIntensityMapTransform))}function b(y,g){g.matcap&&(y.matcap.value=g.matcap)}function E(y,g){const B=t.get(g).light;y.referencePosition.value.setFromMatrixPosition(B.matrixWorld),y.nearDistance.value=B.shadow.camera.near,y.farDistance.value=B.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:l}}function b1(r,t,i,s){let l={},c={},h=[];const d=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function m(B,R){const w=R.program;s.uniformBlockBinding(B,w)}function p(B,R){let w=l[B.id];w===void 0&&(b(B),w=_(B),l[B.id]=w,B.addEventListener("dispose",y));const V=R.program;s.updateUBOMapping(B,V);const F=t.render.frame;c[B.id]!==F&&(S(B),c[B.id]=F)}function _(B){const R=v();B.__bindingPointIndex=R;const w=r.createBuffer(),V=B.__size,F=B.usage;return r.bindBuffer(r.UNIFORM_BUFFER,w),r.bufferData(r.UNIFORM_BUFFER,V,F),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,R,w),w}function v(){for(let B=0;B<d;B++)if(h.indexOf(B)===-1)return h.push(B),B;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function S(B){const R=l[B.id],w=B.uniforms,V=B.__cache;r.bindBuffer(r.UNIFORM_BUFFER,R);for(let F=0,L=w.length;F<L;F++){const X=Array.isArray(w[F])?w[F]:[w[F]];for(let U=0,D=X.length;U<D;U++){const z=X[U];if(M(z,F,U,V)===!0){const lt=z.__offset,st=Array.isArray(z.value)?z.value:[z.value];let dt=0;for(let et=0;et<st.length;et++){const I=st[et],Y=E(I);typeof I=="number"||typeof I=="boolean"?(z.__data[0]=I,r.bufferSubData(r.UNIFORM_BUFFER,lt+dt,z.__data)):I.isMatrix3?(z.__data[0]=I.elements[0],z.__data[1]=I.elements[1],z.__data[2]=I.elements[2],z.__data[3]=0,z.__data[4]=I.elements[3],z.__data[5]=I.elements[4],z.__data[6]=I.elements[5],z.__data[7]=0,z.__data[8]=I.elements[6],z.__data[9]=I.elements[7],z.__data[10]=I.elements[8],z.__data[11]=0):(I.toArray(z.__data,dt),dt+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,lt,z.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function M(B,R,w,V){const F=B.value,L=R+"_"+w;if(V[L]===void 0)return typeof F=="number"||typeof F=="boolean"?V[L]=F:V[L]=F.clone(),!0;{const X=V[L];if(typeof F=="number"||typeof F=="boolean"){if(X!==F)return V[L]=F,!0}else if(X.equals(F)===!1)return X.copy(F),!0}return!1}function b(B){const R=B.uniforms;let w=0;const V=16;for(let L=0,X=R.length;L<X;L++){const U=Array.isArray(R[L])?R[L]:[R[L]];for(let D=0,z=U.length;D<z;D++){const lt=U[D],st=Array.isArray(lt.value)?lt.value:[lt.value];for(let dt=0,et=st.length;dt<et;dt++){const I=st[dt],Y=E(I),q=w%V,$=q%Y.boundary,rt=q+$;w+=$,rt!==0&&V-rt<Y.storage&&(w+=V-rt),lt.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),lt.__offset=w,w+=Y.storage}}}const F=w%V;return F>0&&(w+=V-F),B.__size=w,B.__cache={},this}function E(B){const R={boundary:0,storage:0};return typeof B=="number"||typeof B=="boolean"?(R.boundary=4,R.storage=4):B.isVector2?(R.boundary=8,R.storage=8):B.isVector3||B.isColor?(R.boundary=16,R.storage=12):B.isVector4?(R.boundary=16,R.storage=16):B.isMatrix3?(R.boundary=48,R.storage=48):B.isMatrix4?(R.boundary=64,R.storage=64):B.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",B),R}function y(B){const R=B.target;R.removeEventListener("dispose",y);const w=h.indexOf(R.__bindingPointIndex);h.splice(w,1),r.deleteBuffer(l[R.id]),delete l[R.id],delete c[R.id]}function g(){for(const B in l)r.deleteBuffer(l[B]);h=[],l={},c={}}return{bind:m,update:p,dispose:g}}class T1{constructor(t={}){const{canvas:i=iM(),context:s=null,depth:l=!0,stencil:c=!1,alpha:h=!1,antialias:d=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:p=!1,powerPreference:_="default",failIfMajorPerformanceCaveat:v=!1,reversedDepthBuffer:S=!1}=t;this.isWebGLRenderer=!0;let M;if(s!==null){if(typeof WebGLRenderingContext<"u"&&s instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");M=s.getContextAttributes().alpha}else M=h;const b=new Uint32Array(4),E=new Int32Array(4);let y=null,g=null;const B=[],R=[];this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Wa,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const w=this;let V=!1;this._outputColorSpace=mi;let F=0,L=0,X=null,U=-1,D=null;const z=new en,lt=new en;let st=null;const dt=new Me(0);let et=0,I=i.width,Y=i.height,q=1,$=null,rt=null;const N=new en(0,0,I,Y),W=new en(0,0,I,Y);let vt=!1;const Mt=new jd;let K=!1,xt=!1;const ut=new Ze,Et=new tt,Dt=new en,Gt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Rt=!1;function Ut(){return X===null?q:1}let O=s;function qt(C,Z){return i.getContext(C,Z)}try{const C={alpha:!0,depth:l,stencil:c,antialias:d,premultipliedAlpha:m,preserveDrawingBuffer:p,powerPreference:_,failIfMajorPerformanceCaveat:v};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${Pd}`),i.addEventListener("webglcontextlost",Ot,!1),i.addEventListener("webglcontextrestored",kt,!1),i.addEventListener("webglcontextcreationerror",At,!1),O===null){const Z="webgl2";if(O=qt(Z,C),O===null)throw qt(Z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let Pt,Qt,Yt,ke,Xt,fe,Je,Qe,P,T,at,gt,Tt,pt,ee,Nt,$t,te,Ct,Lt,ne,Ht,zt,he;function j(){Pt=new PT(O),Pt.init(),Ht=new _1(O,Pt),Qt=new CT(O,Pt,t,Ht),Yt=new m1(O,Pt),Qt.reversedDepthBuffer&&S&&Yt.buffers.depth.setReversed(!0),ke=new BT(O),Xt=new n1,fe=new g1(O,Pt,Yt,Xt,Qt,Ht,ke),Je=new DT(w),Qe=new OT(w),P=new XM(O),zt=new AT(O,P),T=new zT(O,P,ke,zt),at=new HT(O,T,P,ke),Ct=new FT(O,Qt,fe),Nt=new wT(Xt),gt=new e1(w,Je,Qe,Pt,Qt,zt,Nt),Tt=new E1(w,Xt),pt=new a1,ee=new u1(Pt),te=new TT(w,Je,Qe,Yt,at,M,m),$t=new d1(w,at,Qt),he=new b1(O,ke,Qt,Yt),Lt=new RT(O,Pt,ke),ne=new IT(O,Pt,ke),ke.programs=gt.programs,w.capabilities=Qt,w.extensions=Pt,w.properties=Xt,w.renderLists=pt,w.shadowMap=$t,w.state=Yt,w.info=ke}j();const wt=new y1(w,O);this.xr=wt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const C=Pt.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=Pt.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(C){C!==void 0&&(q=C,this.setSize(I,Y,!1))},this.getSize=function(C){return C.set(I,Y)},this.setSize=function(C,Z,ct=!0){if(wt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}I=C,Y=Z,i.width=Math.floor(C*q),i.height=Math.floor(Z*q),ct===!0&&(i.style.width=C+"px",i.style.height=Z+"px"),this.setViewport(0,0,C,Z)},this.getDrawingBufferSize=function(C){return C.set(I*q,Y*q).floor()},this.setDrawingBufferSize=function(C,Z,ct){I=C,Y=Z,q=ct,i.width=Math.floor(C*ct),i.height=Math.floor(Z*ct),this.setViewport(0,0,C,Z)},this.getCurrentViewport=function(C){return C.copy(z)},this.getViewport=function(C){return C.copy(N)},this.setViewport=function(C,Z,ct,ft){C.isVector4?N.set(C.x,C.y,C.z,C.w):N.set(C,Z,ct,ft),Yt.viewport(z.copy(N).multiplyScalar(q).round())},this.getScissor=function(C){return C.copy(W)},this.setScissor=function(C,Z,ct,ft){C.isVector4?W.set(C.x,C.y,C.z,C.w):W.set(C,Z,ct,ft),Yt.scissor(lt.copy(W).multiplyScalar(q).round())},this.getScissorTest=function(){return vt},this.setScissorTest=function(C){Yt.setScissorTest(vt=C)},this.setOpaqueSort=function(C){$=C},this.setTransparentSort=function(C){rt=C},this.getClearColor=function(C){return C.copy(te.getClearColor())},this.setClearColor=function(){te.setClearColor(...arguments)},this.getClearAlpha=function(){return te.getClearAlpha()},this.setClearAlpha=function(){te.setClearAlpha(...arguments)},this.clear=function(C=!0,Z=!0,ct=!0){let ft=0;if(C){let Q=!1;if(X!==null){const bt=X.texture.format;Q=bt===Gd||bt===Hd||bt===Fd}if(Q){const bt=X.texture.type,It=bt===zi||bt===As||bt===jo||bt===Wo||bt===Id||bt===Bd,Zt=te.getClearColor(),Ft=te.getClearAlpha(),ie=Zt.r,oe=Zt.g,ae=Zt.b;It?(b[0]=ie,b[1]=oe,b[2]=ae,b[3]=Ft,O.clearBufferuiv(O.COLOR,0,b)):(E[0]=ie,E[1]=oe,E[2]=ae,E[3]=Ft,O.clearBufferiv(O.COLOR,0,E))}else ft|=O.COLOR_BUFFER_BIT}Z&&(ft|=O.DEPTH_BUFFER_BIT),ct&&(ft|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(ft)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){i.removeEventListener("webglcontextlost",Ot,!1),i.removeEventListener("webglcontextrestored",kt,!1),i.removeEventListener("webglcontextcreationerror",At,!1),te.dispose(),pt.dispose(),ee.dispose(),Xt.dispose(),Je.dispose(),Qe.dispose(),at.dispose(),zt.dispose(),he.dispose(),gt.dispose(),wt.dispose(),wt.removeEventListener("sessionstart",si),wt.removeEventListener("sessionend",kr),Ai.stop()};function Ot(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),V=!0}function kt(){console.log("THREE.WebGLRenderer: Context Restored."),V=!1;const C=ke.autoReset,Z=$t.enabled,ct=$t.autoUpdate,ft=$t.needsUpdate,Q=$t.type;j(),ke.autoReset=C,$t.enabled=Z,$t.autoUpdate=ct,$t.needsUpdate=ft,$t.type=Q}function At(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function yt(C){const Z=C.target;Z.removeEventListener("dispose",yt),jt(Z)}function jt(C){le(C),Xt.remove(C)}function le(C){const Z=Xt.get(C).programs;Z!==void 0&&(Z.forEach(function(ct){gt.releaseProgram(ct)}),C.isShaderMaterial&&gt.releaseShaderCache(C))}this.renderBufferDirect=function(C,Z,ct,ft,Q,bt){Z===null&&(Z=Gt);const It=Q.isMesh&&Q.matrixWorld.determinant()<0,Zt=ha(C,Z,ct,ft,Q);Yt.setMaterial(ft,It);let Ft=ct.index,ie=1;if(ft.wireframe===!0){if(Ft=T.getWireframeAttribute(ct),Ft===void 0)return;ie=2}const oe=ct.drawRange,ae=ct.attributes.position;let _e=oe.start*ie,Le=(oe.start+oe.count)*ie;bt!==null&&(_e=Math.max(_e,bt.start*ie),Le=Math.min(Le,(bt.start+bt.count)*ie)),Ft!==null?(_e=Math.max(_e,0),Le=Math.min(Le,Ft.count)):ae!=null&&(_e=Math.max(_e,0),Le=Math.min(Le,ae.count));const Xe=Le-_e;if(Xe<0||Xe===1/0)return;zt.setup(Q,ft,Zt,ct,Ft);let Oe,ve=Lt;if(Ft!==null&&(Oe=P.get(Ft),ve=ne,ve.setIndex(Oe)),Q.isMesh)ft.wireframe===!0?(Yt.setLineWidth(ft.wireframeLinewidth*Ut()),ve.setMode(O.LINES)):ve.setMode(O.TRIANGLES);else if(Q.isLine){let Kt=ft.linewidth;Kt===void 0&&(Kt=1),Yt.setLineWidth(Kt*Ut()),Q.isLineSegments?ve.setMode(O.LINES):Q.isLineLoop?ve.setMode(O.LINE_LOOP):ve.setMode(O.LINE_STRIP)}else Q.isPoints?ve.setMode(O.POINTS):Q.isSprite&&ve.setMode(O.TRIANGLES);if(Q.isBatchedMesh)if(Q._multiDrawInstances!==null)Or("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ve.renderMultiDrawInstances(Q._multiDrawStarts,Q._multiDrawCounts,Q._multiDrawCount,Q._multiDrawInstances);else if(Pt.get("WEBGL_multi_draw"))ve.renderMultiDraw(Q._multiDrawStarts,Q._multiDrawCounts,Q._multiDrawCount);else{const Kt=Q._multiDrawStarts,We=Q._multiDrawCounts,Ce=Q._multiDrawCount,bn=Ft?P.get(Ft).bytesPerElement:1,Bi=Xt.get(ft).currentProgram.getUniforms();for(let xn=0;xn<Ce;xn++)Bi.setValue(O,"_gl_DrawID",xn),ve.render(Kt[xn]/bn,We[xn])}else if(Q.isInstancedMesh)ve.renderInstances(_e,Xe,Q.count);else if(ct.isInstancedBufferGeometry){const Kt=ct._maxInstanceCount!==void 0?ct._maxInstanceCount:1/0,We=Math.min(ct.instanceCount,Kt);ve.renderInstances(_e,Xe,We)}else ve.render(_e,Xe)};function Pe(C,Z,ct){C.transparent===!0&&C.side===ai&&C.forceSinglePass===!1?(C.side=Wn,C.needsUpdate=!0,Yn(C,Z,ct),C.side=qa,C.needsUpdate=!0,Yn(C,Z,ct),C.side=ai):Yn(C,Z,ct)}this.compile=function(C,Z,ct=null){ct===null&&(ct=C),g=ee.get(ct),g.init(Z),R.push(g),ct.traverseVisible(function(Q){Q.isLight&&Q.layers.test(Z.layers)&&(g.pushLight(Q),Q.castShadow&&g.pushShadow(Q))}),C!==ct&&C.traverseVisible(function(Q){Q.isLight&&Q.layers.test(Z.layers)&&(g.pushLight(Q),Q.castShadow&&g.pushShadow(Q))}),g.setupLights();const ft=new Set;return C.traverse(function(Q){if(!(Q.isMesh||Q.isPoints||Q.isLine||Q.isSprite))return;const bt=Q.material;if(bt)if(Array.isArray(bt))for(let It=0;It<bt.length;It++){const Zt=bt[It];Pe(Zt,ct,Q),ft.add(Zt)}else Pe(bt,ct,Q),ft.add(bt)}),g=R.pop(),ft},this.compileAsync=function(C,Z,ct=null){const ft=this.compile(C,Z,ct);return new Promise(Q=>{function bt(){if(ft.forEach(function(It){Xt.get(It).currentProgram.isReady()&&ft.delete(It)}),ft.size===0){Q(C);return}setTimeout(bt,10)}Pt.get("KHR_parallel_shader_compile")!==null?bt():setTimeout(bt,10)})};let Re=null;function On(C){Re&&Re(C)}function si(){Ai.stop()}function kr(){Ai.start()}const Ai=new Cv;Ai.setAnimationLoop(On),typeof self<"u"&&Ai.setContext(self),this.setAnimationLoop=function(C){Re=C,wt.setAnimationLoop(C),C===null?Ai.stop():Ai.start()},wt.addEventListener("sessionstart",si),wt.addEventListener("sessionend",kr),this.render=function(C,Z){if(Z!==void 0&&Z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(V===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),Z.parent===null&&Z.matrixWorldAutoUpdate===!0&&Z.updateMatrixWorld(),wt.enabled===!0&&wt.isPresenting===!0&&(wt.cameraAutoUpdate===!0&&wt.updateCamera(Z),Z=wt.getCamera()),C.isScene===!0&&C.onBeforeRender(w,C,Z,X),g=ee.get(C,R.length),g.init(Z),R.push(g),ut.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),Mt.setFromProjectionMatrix(ut,Oi,Z.reversedDepth),xt=this.localClippingEnabled,K=Nt.init(this.clippingPlanes,xt),y=pt.get(C,B.length),y.init(),B.push(y),wt.enabled===!0&&wt.isPresenting===!0){const bt=w.xr.getDepthSensingMesh();bt!==null&&Us(bt,Z,-1/0,w.sortObjects)}Us(C,Z,0,w.sortObjects),y.finish(),w.sortObjects===!0&&y.sort($,rt),Rt=wt.enabled===!1||wt.isPresenting===!1||wt.hasDepthSensing()===!1,Rt&&te.addToRenderList(y,C),this.info.render.frame++,K===!0&&Nt.beginShadows();const ct=g.state.shadowsArray;$t.render(ct,C,Z),K===!0&&Nt.endShadows(),this.info.autoReset===!0&&this.info.reset();const ft=y.opaque,Q=y.transmissive;if(g.setupLights(),Z.isArrayCamera){const bt=Z.cameras;if(Q.length>0)for(let It=0,Zt=bt.length;It<Zt;It++){const Ft=bt[It];Ls(ft,Q,C,Ft)}Rt&&te.render(C);for(let It=0,Zt=bt.length;It<Zt;It++){const Ft=bt[It];Ns(y,C,Ft,Ft.viewport)}}else Q.length>0&&Ls(ft,Q,C,Z),Rt&&te.render(C),Ns(y,C,Z);X!==null&&L===0&&(fe.updateMultisampleRenderTarget(X),fe.updateRenderTargetMipmap(X)),C.isScene===!0&&C.onAfterRender(w,C,Z),zt.resetDefaultState(),U=-1,D=null,R.pop(),R.length>0?(g=R[R.length-1],K===!0&&Nt.setGlobalState(w.clippingPlanes,g.state.camera)):g=null,B.pop(),B.length>0?y=B[B.length-1]:y=null};function Us(C,Z,ct,ft){if(C.visible===!1)return;if(C.layers.test(Z.layers)){if(C.isGroup)ct=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(Z);else if(C.isLight)g.pushLight(C),C.castShadow&&g.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||Mt.intersectsSprite(C)){ft&&Dt.setFromMatrixPosition(C.matrixWorld).applyMatrix4(ut);const It=at.update(C),Zt=C.material;Zt.visible&&y.push(C,It,Zt,ct,Dt.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||Mt.intersectsObject(C))){const It=at.update(C),Zt=C.material;if(ft&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Dt.copy(C.boundingSphere.center)):(It.boundingSphere===null&&It.computeBoundingSphere(),Dt.copy(It.boundingSphere.center)),Dt.applyMatrix4(C.matrixWorld).applyMatrix4(ut)),Array.isArray(Zt)){const Ft=It.groups;for(let ie=0,oe=Ft.length;ie<oe;ie++){const ae=Ft[ie],_e=Zt[ae.materialIndex];_e&&_e.visible&&y.push(C,It,_e,ct,Dt.z,ae)}}else Zt.visible&&y.push(C,It,Zt,ct,Dt.z,null)}}const bt=C.children;for(let It=0,Zt=bt.length;It<Zt;It++)Us(bt[It],Z,ct,ft)}function Ns(C,Z,ct,ft){const Q=C.opaque,bt=C.transmissive,It=C.transparent;g.setupLightsView(ct),K===!0&&Nt.setGlobalState(w.clippingPlanes,ct),ft&&Yt.viewport(z.copy(ft)),Q.length>0&&Za(Q,Z,ct),bt.length>0&&Za(bt,Z,ct),It.length>0&&Za(It,Z,ct),Yt.buffers.depth.setTest(!0),Yt.buffers.depth.setMask(!0),Yt.buffers.color.setMask(!0),Yt.setPolygonOffset(!1)}function Ls(C,Z,ct,ft){if((ct.isScene===!0?ct.overrideMaterial:null)!==null)return;g.state.transmissionRenderTarget[ft.id]===void 0&&(g.state.transmissionRenderTarget[ft.id]=new Cs(1,1,{generateMipmaps:!0,type:Pt.has("EXT_color_buffer_half_float")||Pt.has("EXT_color_buffer_float")?Zo:zi,minFilter:bs,samples:4,stencilBuffer:c,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ue.workingColorSpace}));const bt=g.state.transmissionRenderTarget[ft.id],It=ft.viewport||z;bt.setSize(It.z*w.transmissionResolutionScale,It.w*w.transmissionResolutionScale);const Zt=w.getRenderTarget(),Ft=w.getActiveCubeFace(),ie=w.getActiveMipmapLevel();w.setRenderTarget(bt),w.getClearColor(dt),et=w.getClearAlpha(),et<1&&w.setClearColor(16777215,.5),w.clear(),Rt&&te.render(ct);const oe=w.toneMapping;w.toneMapping=Wa;const ae=ft.viewport;if(ft.viewport!==void 0&&(ft.viewport=void 0),g.setupLightsView(ft),K===!0&&Nt.setGlobalState(w.clippingPlanes,ft),Za(C,ct,ft),fe.updateMultisampleRenderTarget(bt),fe.updateRenderTargetMipmap(bt),Pt.has("WEBGL_multisampled_render_to_texture")===!1){let _e=!1;for(let Le=0,Xe=Z.length;Le<Xe;Le++){const Oe=Z[Le],ve=Oe.object,Kt=Oe.geometry,We=Oe.material,Ce=Oe.group;if(We.side===ai&&ve.layers.test(ft.layers)){const bn=We.side;We.side=Wn,We.needsUpdate=!0,Xr(ve,ct,ft,Kt,We,Ce),We.side=bn,We.needsUpdate=!0,_e=!0}}_e===!0&&(fe.updateMultisampleRenderTarget(bt),fe.updateRenderTargetMipmap(bt))}w.setRenderTarget(Zt,Ft,ie),w.setClearColor(dt,et),ae!==void 0&&(ft.viewport=ae),w.toneMapping=oe}function Za(C,Z,ct){const ft=Z.isScene===!0?Z.overrideMaterial:null;for(let Q=0,bt=C.length;Q<bt;Q++){const It=C[Q],Zt=It.object,Ft=It.geometry,ie=It.group;let oe=It.material;oe.allowOverride===!0&&ft!==null&&(oe=ft),Zt.layers.test(ct.layers)&&Xr(Zt,Z,ct,Ft,oe,ie)}}function Xr(C,Z,ct,ft,Q,bt){C.onBeforeRender(w,Z,ct,ft,Q,bt),C.modelViewMatrix.multiplyMatrices(ct.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),Q.onBeforeRender(w,Z,ct,ft,C,bt),Q.transparent===!0&&Q.side===ai&&Q.forceSinglePass===!1?(Q.side=Wn,Q.needsUpdate=!0,w.renderBufferDirect(ct,Z,ft,Q,C,bt),Q.side=qa,Q.needsUpdate=!0,w.renderBufferDirect(ct,Z,ft,Q,C,bt),Q.side=ai):w.renderBufferDirect(ct,Z,ft,Q,C,bt),C.onAfterRender(w,Z,ct,ft,Q,bt)}function Yn(C,Z,ct){Z.isScene!==!0&&(Z=Gt);const ft=Xt.get(C),Q=g.state.lights,bt=g.state.shadowsArray,It=Q.state.version,Zt=gt.getParameters(C,Q.state,bt,Z,ct),Ft=gt.getProgramCacheKey(Zt);let ie=ft.programs;ft.environment=C.isMeshStandardMaterial?Z.environment:null,ft.fog=Z.fog,ft.envMap=(C.isMeshStandardMaterial?Qe:Je).get(C.envMap||ft.environment),ft.envMapRotation=ft.environment!==null&&C.envMap===null?Z.environmentRotation:C.envMapRotation,ie===void 0&&(C.addEventListener("dispose",yt),ie=new Map,ft.programs=ie);let oe=ie.get(Ft);if(oe!==void 0){if(ft.currentProgram===oe&&ft.lightsStateVersion===It)return En(C,Zt),oe}else Zt.uniforms=gt.getUniforms(C),C.onBeforeCompile(Zt,w),oe=gt.acquireProgram(Zt,Ft),ie.set(Ft,oe),ft.uniforms=Zt.uniforms;const ae=ft.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(ae.clippingPlanes=Nt.uniform),En(C,Zt),ft.needsLights=Qc(C),ft.lightsStateVersion=It,ft.needsLights&&(ae.ambientLightColor.value=Q.state.ambient,ae.lightProbe.value=Q.state.probe,ae.directionalLights.value=Q.state.directional,ae.directionalLightShadows.value=Q.state.directionalShadow,ae.spotLights.value=Q.state.spot,ae.spotLightShadows.value=Q.state.spotShadow,ae.rectAreaLights.value=Q.state.rectArea,ae.ltc_1.value=Q.state.rectAreaLTC1,ae.ltc_2.value=Q.state.rectAreaLTC2,ae.pointLights.value=Q.state.point,ae.pointLightShadows.value=Q.state.pointShadow,ae.hemisphereLights.value=Q.state.hemi,ae.directionalShadowMap.value=Q.state.directionalShadowMap,ae.directionalShadowMatrix.value=Q.state.directionalShadowMatrix,ae.spotShadowMap.value=Q.state.spotShadowMap,ae.spotLightMatrix.value=Q.state.spotLightMatrix,ae.spotLightMap.value=Q.state.spotLightMap,ae.pointShadowMap.value=Q.state.pointShadowMap,ae.pointShadowMatrix.value=Q.state.pointShadowMatrix),ft.currentProgram=oe,ft.uniformsList=null,oe}function rn(C){if(C.uniformsList===null){const Z=C.currentProgram.getUniforms();C.uniformsList=Hc.seqWithValue(Z.seq,C.uniforms)}return C.uniformsList}function En(C,Z){const ct=Xt.get(C);ct.outputColorSpace=Z.outputColorSpace,ct.batching=Z.batching,ct.batchingColor=Z.batchingColor,ct.instancing=Z.instancing,ct.instancingColor=Z.instancingColor,ct.instancingMorph=Z.instancingMorph,ct.skinning=Z.skinning,ct.morphTargets=Z.morphTargets,ct.morphNormals=Z.morphNormals,ct.morphColors=Z.morphColors,ct.morphTargetsCount=Z.morphTargetsCount,ct.numClippingPlanes=Z.numClippingPlanes,ct.numIntersection=Z.numClipIntersection,ct.vertexAlphas=Z.vertexAlphas,ct.vertexTangents=Z.vertexTangents,ct.toneMapping=Z.toneMapping}function ha(C,Z,ct,ft,Q){Z.isScene!==!0&&(Z=Gt),fe.resetTextureUnits();const bt=Z.fog,It=ft.isMeshStandardMaterial?Z.environment:null,Zt=X===null?w.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:Fr,Ft=(ft.isMeshStandardMaterial?Qe:Je).get(ft.envMap||It),ie=ft.vertexColors===!0&&!!ct.attributes.color&&ct.attributes.color.itemSize===4,oe=!!ct.attributes.tangent&&(!!ft.normalMap||ft.anisotropy>0),ae=!!ct.morphAttributes.position,_e=!!ct.morphAttributes.normal,Le=!!ct.morphAttributes.color;let Xe=Wa;ft.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(Xe=w.toneMapping);const Oe=ct.morphAttributes.position||ct.morphAttributes.normal||ct.morphAttributes.color,ve=Oe!==void 0?Oe.length:0,Kt=Xt.get(ft),We=g.state.lights;if(K===!0&&(xt===!0||C!==D)){const hn=C===D&&ft.id===U;Nt.setState(ft,C,hn)}let Ce=!1;ft.version===Kt.__version?(Kt.needsLights&&Kt.lightsStateVersion!==We.state.version||Kt.outputColorSpace!==Zt||Q.isBatchedMesh&&Kt.batching===!1||!Q.isBatchedMesh&&Kt.batching===!0||Q.isBatchedMesh&&Kt.batchingColor===!0&&Q.colorTexture===null||Q.isBatchedMesh&&Kt.batchingColor===!1&&Q.colorTexture!==null||Q.isInstancedMesh&&Kt.instancing===!1||!Q.isInstancedMesh&&Kt.instancing===!0||Q.isSkinnedMesh&&Kt.skinning===!1||!Q.isSkinnedMesh&&Kt.skinning===!0||Q.isInstancedMesh&&Kt.instancingColor===!0&&Q.instanceColor===null||Q.isInstancedMesh&&Kt.instancingColor===!1&&Q.instanceColor!==null||Q.isInstancedMesh&&Kt.instancingMorph===!0&&Q.morphTexture===null||Q.isInstancedMesh&&Kt.instancingMorph===!1&&Q.morphTexture!==null||Kt.envMap!==Ft||ft.fog===!0&&Kt.fog!==bt||Kt.numClippingPlanes!==void 0&&(Kt.numClippingPlanes!==Nt.numPlanes||Kt.numIntersection!==Nt.numIntersection)||Kt.vertexAlphas!==ie||Kt.vertexTangents!==oe||Kt.morphTargets!==ae||Kt.morphNormals!==_e||Kt.morphColors!==Le||Kt.toneMapping!==Xe||Kt.morphTargetsCount!==ve)&&(Ce=!0):(Ce=!0,Kt.__version=ft.version);let bn=Kt.currentProgram;Ce===!0&&(bn=Yn(ft,Z,Q));let Bi=!1,xn=!1,Qa=!1;const Ee=bn.getUniforms(),Dn=Kt.uniforms;if(Yt.useProgram(bn.program)&&(Bi=!0,xn=!0,Qa=!0),ft.id!==U&&(U=ft.id,xn=!0),Bi||D!==C){Yt.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Ee.setValue(O,"projectionMatrix",C.projectionMatrix),Ee.setValue(O,"viewMatrix",C.matrixWorldInverse);const nn=Ee.map.cameraPosition;nn!==void 0&&nn.setValue(O,Et.setFromMatrixPosition(C.matrixWorld)),Qt.logarithmicDepthBuffer&&Ee.setValue(O,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(ft.isMeshPhongMaterial||ft.isMeshToonMaterial||ft.isMeshLambertMaterial||ft.isMeshBasicMaterial||ft.isMeshStandardMaterial||ft.isShaderMaterial)&&Ee.setValue(O,"isOrthographic",C.isOrthographicCamera===!0),D!==C&&(D=C,xn=!0,Qa=!0)}if(Q.isSkinnedMesh){Ee.setOptional(O,Q,"bindMatrix"),Ee.setOptional(O,Q,"bindMatrixInverse");const hn=Q.skeleton;hn&&(hn.boneTexture===null&&hn.computeBoneTexture(),Ee.setValue(O,"boneTexture",hn.boneTexture,fe))}Q.isBatchedMesh&&(Ee.setOptional(O,Q,"batchingTexture"),Ee.setValue(O,"batchingTexture",Q._matricesTexture,fe),Ee.setOptional(O,Q,"batchingIdTexture"),Ee.setValue(O,"batchingIdTexture",Q._indirectTexture,fe),Ee.setOptional(O,Q,"batchingColorTexture"),Q._colorsTexture!==null&&Ee.setValue(O,"batchingColorTexture",Q._colorsTexture,fe));const Pn=ct.morphAttributes;if((Pn.position!==void 0||Pn.normal!==void 0||Pn.color!==void 0)&&Ct.update(Q,ct,bn),(xn||Kt.receiveShadow!==Q.receiveShadow)&&(Kt.receiveShadow=Q.receiveShadow,Ee.setValue(O,"receiveShadow",Q.receiveShadow)),ft.isMeshGouraudMaterial&&ft.envMap!==null&&(Dn.envMap.value=Ft,Dn.flipEnvMap.value=Ft.isCubeTexture&&Ft.isRenderTargetTexture===!1?-1:1),ft.isMeshStandardMaterial&&ft.envMap===null&&Z.environment!==null&&(Dn.envMapIntensity.value=Z.environmentIntensity),xn&&(Ee.setValue(O,"toneMappingExposure",w.toneMappingExposure),Kt.needsLights&&jr(Dn,Qa),bt&&ft.fog===!0&&Tt.refreshFogUniforms(Dn,bt),Tt.refreshMaterialUniforms(Dn,ft,q,Y,g.state.transmissionRenderTarget[C.id]),Hc.upload(O,rn(Kt),Dn,fe)),ft.isShaderMaterial&&ft.uniformsNeedUpdate===!0&&(Hc.upload(O,rn(Kt),Dn,fe),ft.uniformsNeedUpdate=!1),ft.isSpriteMaterial&&Ee.setValue(O,"center",Q.center),Ee.setValue(O,"modelViewMatrix",Q.modelViewMatrix),Ee.setValue(O,"normalMatrix",Q.normalMatrix),Ee.setValue(O,"modelMatrix",Q.matrixWorld),ft.isShaderMaterial||ft.isRawShaderMaterial){const hn=ft.uniformsGroups;for(let nn=0,Os=hn.length;nn<Os;nn++){const Ri=hn[nn];he.update(Ri,bn),he.bind(Ri,bn)}}return bn}function jr(C,Z){C.ambientLightColor.needsUpdate=Z,C.lightProbe.needsUpdate=Z,C.directionalLights.needsUpdate=Z,C.directionalLightShadows.needsUpdate=Z,C.pointLights.needsUpdate=Z,C.pointLightShadows.needsUpdate=Z,C.spotLights.needsUpdate=Z,C.spotLightShadows.needsUpdate=Z,C.rectAreaLights.needsUpdate=Z,C.hemisphereLights.needsUpdate=Z}function Qc(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return L},this.getRenderTarget=function(){return X},this.setRenderTargetTextures=function(C,Z,ct){const ft=Xt.get(C);ft.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,ft.__autoAllocateDepthBuffer===!1&&(ft.__useRenderToTexture=!1),Xt.get(C.texture).__webglTexture=Z,Xt.get(C.depthTexture).__webglTexture=ft.__autoAllocateDepthBuffer?void 0:ct,ft.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,Z){const ct=Xt.get(C);ct.__webglFramebuffer=Z,ct.__useDefaultFramebuffer=Z===void 0};const Jc=O.createFramebuffer();this.setRenderTarget=function(C,Z=0,ct=0){X=C,F=Z,L=ct;let ft=!0,Q=null,bt=!1,It=!1;if(C){const Ft=Xt.get(C);if(Ft.__useDefaultFramebuffer!==void 0)Yt.bindFramebuffer(O.FRAMEBUFFER,null),ft=!1;else if(Ft.__webglFramebuffer===void 0)fe.setupRenderTarget(C);else if(Ft.__hasExternalTextures)fe.rebindTextures(C,Xt.get(C.texture).__webglTexture,Xt.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const ae=C.depthTexture;if(Ft.__boundDepthTexture!==ae){if(ae!==null&&Xt.has(ae)&&(C.width!==ae.image.width||C.height!==ae.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");fe.setupDepthRenderbuffer(C)}}const ie=C.texture;(ie.isData3DTexture||ie.isDataArrayTexture||ie.isCompressedArrayTexture)&&(It=!0);const oe=Xt.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(oe[Z])?Q=oe[Z][ct]:Q=oe[Z],bt=!0):C.samples>0&&fe.useMultisampledRTT(C)===!1?Q=Xt.get(C).__webglMultisampledFramebuffer:Array.isArray(oe)?Q=oe[ct]:Q=oe,z.copy(C.viewport),lt.copy(C.scissor),st=C.scissorTest}else z.copy(N).multiplyScalar(q).floor(),lt.copy(W).multiplyScalar(q).floor(),st=vt;if(ct!==0&&(Q=Jc),Yt.bindFramebuffer(O.FRAMEBUFFER,Q)&&ft&&Yt.drawBuffers(C,Q),Yt.viewport(z),Yt.scissor(lt),Yt.setScissorTest(st),bt){const Ft=Xt.get(C.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Ft.__webglTexture,ct)}else if(It){const Ft=Z;for(let ie=0;ie<C.textures.length;ie++){const oe=Xt.get(C.textures[ie]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+ie,oe.__webglTexture,ct,Ft)}}else if(C!==null&&ct!==0){const Ft=Xt.get(C.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ft.__webglTexture,ct)}U=-1},this.readRenderTargetPixels=function(C,Z,ct,ft,Q,bt,It,Zt=0){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ft=Xt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&It!==void 0&&(Ft=Ft[It]),Ft){Yt.bindFramebuffer(O.FRAMEBUFFER,Ft);try{const ie=C.textures[Zt],oe=ie.format,ae=ie.type;if(!Qt.textureFormatReadable(oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Qt.textureTypeReadable(ae)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Z>=0&&Z<=C.width-ft&&ct>=0&&ct<=C.height-Q&&(C.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Zt),O.readPixels(Z,ct,ft,Q,Ht.convert(oe),Ht.convert(ae),bt))}finally{const ie=X!==null?Xt.get(X).__webglFramebuffer:null;Yt.bindFramebuffer(O.FRAMEBUFFER,ie)}}},this.readRenderTargetPixelsAsync=async function(C,Z,ct,ft,Q,bt,It,Zt=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ft=Xt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&It!==void 0&&(Ft=Ft[It]),Ft)if(Z>=0&&Z<=C.width-ft&&ct>=0&&ct<=C.height-Q){Yt.bindFramebuffer(O.FRAMEBUFFER,Ft);const ie=C.textures[Zt],oe=ie.format,ae=ie.type;if(!Qt.textureFormatReadable(oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Qt.textureTypeReadable(ae))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const _e=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,_e),O.bufferData(O.PIXEL_PACK_BUFFER,bt.byteLength,O.STREAM_READ),C.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Zt),O.readPixels(Z,ct,ft,Q,Ht.convert(oe),Ht.convert(ae),0);const Le=X!==null?Xt.get(X).__webglFramebuffer:null;Yt.bindFramebuffer(O.FRAMEBUFFER,Le);const Xe=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await aM(O,Xe,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,_e),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,bt),O.deleteBuffer(_e),O.deleteSync(Xe),bt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,Z=null,ct=0){const ft=Math.pow(2,-ct),Q=Math.floor(C.image.width*ft),bt=Math.floor(C.image.height*ft),It=Z!==null?Z.x:0,Zt=Z!==null?Z.y:0;fe.setTexture2D(C,0),O.copyTexSubImage2D(O.TEXTURE_2D,ct,0,0,It,Zt,Q,bt),Yt.unbindTexture()};const $o=O.createFramebuffer(),Ka=O.createFramebuffer();this.copyTextureToTexture=function(C,Z,ct=null,ft=null,Q=0,bt=null){bt===null&&(Q!==0?(Or("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),bt=Q,Q=0):bt=0);let It,Zt,Ft,ie,oe,ae,_e,Le,Xe;const Oe=C.isCompressedTexture?C.mipmaps[bt]:C.image;if(ct!==null)It=ct.max.x-ct.min.x,Zt=ct.max.y-ct.min.y,Ft=ct.isBox3?ct.max.z-ct.min.z:1,ie=ct.min.x,oe=ct.min.y,ae=ct.isBox3?ct.min.z:0;else{const Pn=Math.pow(2,-Q);It=Math.floor(Oe.width*Pn),Zt=Math.floor(Oe.height*Pn),C.isDataArrayTexture?Ft=Oe.depth:C.isData3DTexture?Ft=Math.floor(Oe.depth*Pn):Ft=1,ie=0,oe=0,ae=0}ft!==null?(_e=ft.x,Le=ft.y,Xe=ft.z):(_e=0,Le=0,Xe=0);const ve=Ht.convert(Z.format),Kt=Ht.convert(Z.type);let We;Z.isData3DTexture?(fe.setTexture3D(Z,0),We=O.TEXTURE_3D):Z.isDataArrayTexture||Z.isCompressedArrayTexture?(fe.setTexture2DArray(Z,0),We=O.TEXTURE_2D_ARRAY):(fe.setTexture2D(Z,0),We=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,Z.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Z.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,Z.unpackAlignment);const Ce=O.getParameter(O.UNPACK_ROW_LENGTH),bn=O.getParameter(O.UNPACK_IMAGE_HEIGHT),Bi=O.getParameter(O.UNPACK_SKIP_PIXELS),xn=O.getParameter(O.UNPACK_SKIP_ROWS),Qa=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,Oe.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Oe.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,ie),O.pixelStorei(O.UNPACK_SKIP_ROWS,oe),O.pixelStorei(O.UNPACK_SKIP_IMAGES,ae);const Ee=C.isDataArrayTexture||C.isData3DTexture,Dn=Z.isDataArrayTexture||Z.isData3DTexture;if(C.isDepthTexture){const Pn=Xt.get(C),hn=Xt.get(Z),nn=Xt.get(Pn.__renderTarget),Os=Xt.get(hn.__renderTarget);Yt.bindFramebuffer(O.READ_FRAMEBUFFER,nn.__webglFramebuffer),Yt.bindFramebuffer(O.DRAW_FRAMEBUFFER,Os.__webglFramebuffer);for(let Ri=0;Ri<Ft;Ri++)Ee&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Xt.get(C).__webglTexture,Q,ae+Ri),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Xt.get(Z).__webglTexture,bt,Xe+Ri)),O.blitFramebuffer(ie,oe,It,Zt,_e,Le,It,Zt,O.DEPTH_BUFFER_BIT,O.NEAREST);Yt.bindFramebuffer(O.READ_FRAMEBUFFER,null),Yt.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(Q!==0||C.isRenderTargetTexture||Xt.has(C)){const Pn=Xt.get(C),hn=Xt.get(Z);Yt.bindFramebuffer(O.READ_FRAMEBUFFER,$o),Yt.bindFramebuffer(O.DRAW_FRAMEBUFFER,Ka);for(let nn=0;nn<Ft;nn++)Ee?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Pn.__webglTexture,Q,ae+nn):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Pn.__webglTexture,Q),Dn?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,hn.__webglTexture,bt,Xe+nn):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,hn.__webglTexture,bt),Q!==0?O.blitFramebuffer(ie,oe,It,Zt,_e,Le,It,Zt,O.COLOR_BUFFER_BIT,O.NEAREST):Dn?O.copyTexSubImage3D(We,bt,_e,Le,Xe+nn,ie,oe,It,Zt):O.copyTexSubImage2D(We,bt,_e,Le,ie,oe,It,Zt);Yt.bindFramebuffer(O.READ_FRAMEBUFFER,null),Yt.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else Dn?C.isDataTexture||C.isData3DTexture?O.texSubImage3D(We,bt,_e,Le,Xe,It,Zt,Ft,ve,Kt,Oe.data):Z.isCompressedArrayTexture?O.compressedTexSubImage3D(We,bt,_e,Le,Xe,It,Zt,Ft,ve,Oe.data):O.texSubImage3D(We,bt,_e,Le,Xe,It,Zt,Ft,ve,Kt,Oe):C.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,bt,_e,Le,It,Zt,ve,Kt,Oe.data):C.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,bt,_e,Le,Oe.width,Oe.height,ve,Oe.data):O.texSubImage2D(O.TEXTURE_2D,bt,_e,Le,It,Zt,ve,Kt,Oe);O.pixelStorei(O.UNPACK_ROW_LENGTH,Ce),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,bn),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Bi),O.pixelStorei(O.UNPACK_SKIP_ROWS,xn),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Qa),bt===0&&Z.generateMipmaps&&O.generateMipmap(We),Yt.unbindTexture()},this.copyTextureToTexture3D=function(C,Z,ct=null,ft=null,Q=0){return Or('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(C,Z,ct,ft,Q)},this.initRenderTarget=function(C){Xt.get(C).__webglFramebuffer===void 0&&fe.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?fe.setTextureCube(C,0):C.isData3DTexture?fe.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?fe.setTexture2DArray(C,0):fe.setTexture2D(C,0),Yt.unbindTexture()},this.resetState=function(){F=0,L=0,X=null,Yt.reset(),zt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Oi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const i=this.getContext();i.drawingBufferColorSpace=Ue._getDrawingBufferColorSpace(t),i.unpackColorSpace=Ue._getUnpackColorSpace()}}const Y0={type:"change"},qd={type:"start"},Ov={type:"end"},Lc=new Yc,Z0=new ka,A1=Math.cos(70*nM.DEG2RAD),pn=new tt,jn=2*Math.PI,Ve={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},kh=1e-6;class R1 extends VM{constructor(t,i=null){super(t,i),this.state=Ve.NONE,this.target=new tt,this.cursor=new tt,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Nr.ROTATE,MIDDLE:Nr.DOLLY,RIGHT:Nr.PAN},this.touches={ONE:Cr.ROTATE,TWO:Cr.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new tt,this._lastQuaternion=new Rs,this._lastTargetPosition=new tt,this._quat=new Rs().setFromUnitVectors(t.up,new tt(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new y0,this._sphericalDelta=new y0,this._scale=1,this._panOffset=new tt,this._rotateStart=new ue,this._rotateEnd=new ue,this._rotateDelta=new ue,this._panStart=new ue,this._panEnd=new ue,this._panDelta=new ue,this._dollyStart=new ue,this._dollyEnd=new ue,this._dollyDelta=new ue,this._dollyDirection=new tt,this._mouse=new ue,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=w1.bind(this),this._onPointerDown=C1.bind(this),this._onPointerUp=D1.bind(this),this._onContextMenu=I1.bind(this),this._onMouseWheel=L1.bind(this),this._onKeyDown=O1.bind(this),this._onTouchStart=P1.bind(this),this._onTouchMove=z1.bind(this),this._onMouseDown=U1.bind(this),this._onMouseMove=N1.bind(this),this._interceptControlDown=B1.bind(this),this._interceptControlUp=F1.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Y0),this.update(),this.state=Ve.NONE}update(t=null){const i=this.object.position;pn.copy(i).sub(this.target),pn.applyQuaternion(this._quat),this._spherical.setFromVector3(pn),this.autoRotate&&this.state===Ve.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let s=this.minAzimuthAngle,l=this.maxAzimuthAngle;isFinite(s)&&isFinite(l)&&(s<-Math.PI?s+=jn:s>Math.PI&&(s-=jn),l<-Math.PI?l+=jn:l>Math.PI&&(l-=jn),s<=l?this._spherical.theta=Math.max(s,Math.min(l,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(s+l)/2?Math.max(s,this._spherical.theta):Math.min(l,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let c=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const h=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),c=h!=this._spherical.radius}if(pn.setFromSpherical(this._spherical),pn.applyQuaternion(this._quatInverse),i.copy(this.target).add(pn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let h=null;if(this.object.isPerspectiveCamera){const d=pn.length();h=this._clampDistance(d*this._scale);const m=d-h;this.object.position.addScaledVector(this._dollyDirection,m),this.object.updateMatrixWorld(),c=!!m}else if(this.object.isOrthographicCamera){const d=new tt(this._mouse.x,this._mouse.y,0);d.unproject(this.object);const m=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),c=m!==this.object.zoom;const p=new tt(this._mouse.x,this._mouse.y,0);p.unproject(this.object),this.object.position.sub(p).add(d),this.object.updateMatrixWorld(),h=pn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;h!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(h).add(this.object.position):(Lc.origin.copy(this.object.position),Lc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Lc.direction))<A1?this.object.lookAt(this.target):(Z0.setFromNormalAndCoplanarPoint(this.object.up,this.target),Lc.intersectPlane(Z0,this.target))))}else if(this.object.isOrthographicCamera){const h=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),h!==this.object.zoom&&(this.object.updateProjectionMatrix(),c=!0)}return this._scale=1,this._performCursorZoom=!1,c||this._lastPosition.distanceToSquared(this.object.position)>kh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>kh||this._lastTargetPosition.distanceToSquared(this.target)>kh?(this.dispatchEvent(Y0),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?jn/60*this.autoRotateSpeed*t:jn/60/60*this.autoRotateSpeed}_getZoomScale(t){const i=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*i)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,i){pn.setFromMatrixColumn(i,0),pn.multiplyScalar(-t),this._panOffset.add(pn)}_panUp(t,i){this.screenSpacePanning===!0?pn.setFromMatrixColumn(i,1):(pn.setFromMatrixColumn(i,0),pn.crossVectors(this.object.up,pn)),pn.multiplyScalar(t),this._panOffset.add(pn)}_pan(t,i){const s=this.domElement;if(this.object.isPerspectiveCamera){const l=this.object.position;pn.copy(l).sub(this.target);let c=pn.length();c*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*c/s.clientHeight,this.object.matrix),this._panUp(2*i*c/s.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/s.clientWidth,this.object.matrix),this._panUp(i*(this.object.top-this.object.bottom)/this.object.zoom/s.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,i){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const s=this.domElement.getBoundingClientRect(),l=t-s.left,c=i-s.top,h=s.width,d=s.height;this._mouse.x=l/h*2-1,this._mouse.y=-(c/d)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(jn*this._rotateDelta.x/i.clientHeight),this._rotateUp(jn*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let i=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(jn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),i=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-jn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),i=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(jn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),i=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-jn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),i=!0;break}i&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),l=.5*(t.pageY+i.y);this._rotateStart.set(s,l)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),l=.5*(t.pageY+i.y);this._panStart.set(s,l)}}_handleTouchStartDolly(t){const i=this._getSecondPointerPosition(t),s=t.pageX-i.x,l=t.pageY-i.y,c=Math.sqrt(s*s+l*l);this._dollyStart.set(0,c)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const s=this._getSecondPointerPosition(t),l=.5*(t.pageX+s.x),c=.5*(t.pageY+s.y);this._rotateEnd.set(l,c)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(jn*this._rotateDelta.x/i.clientHeight),this._rotateUp(jn*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),l=.5*(t.pageY+i.y);this._panEnd.set(s,l)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const i=this._getSecondPointerPosition(t),s=t.pageX-i.x,l=t.pageY-i.y,c=Math.sqrt(s*s+l*l);this._dollyEnd.set(0,c),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const h=(t.pageX+i.x)*.5,d=(t.pageY+i.y)*.5;this._updateZoomParameters(h,d)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==t.pointerId){this._pointers.splice(i,1);return}}_isTrackingPointer(t){for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==t.pointerId)return!0;return!1}_trackPointer(t){let i=this._pointerPositions[t.pointerId];i===void 0&&(i=new ue,this._pointerPositions[t.pointerId]=i),i.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const i=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[i]}_customWheelEvent(t){const i=t.deltaMode,s={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(i){case 1:s.deltaY*=16;break;case 2:s.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(s.deltaY*=10),s}}function C1(r){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(r.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(r)&&(this._addPointer(r),r.pointerType==="touch"?this._onTouchStart(r):this._onMouseDown(r)))}function w1(r){this.enabled!==!1&&(r.pointerType==="touch"?this._onTouchMove(r):this._onMouseMove(r))}function D1(r){switch(this._removePointer(r),this._pointers.length){case 0:this.domElement.releasePointerCapture(r.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Ov),this.state=Ve.NONE;break;case 1:const t=this._pointers[0],i=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:i.x,pageY:i.y});break}}function U1(r){let t;switch(r.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Nr.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(r),this.state=Ve.DOLLY;break;case Nr.ROTATE:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=Ve.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=Ve.ROTATE}break;case Nr.PAN:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=Ve.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=Ve.PAN}break;default:this.state=Ve.NONE}this.state!==Ve.NONE&&this.dispatchEvent(qd)}function N1(r){switch(this.state){case Ve.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(r);break;case Ve.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(r);break;case Ve.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(r);break}}function L1(r){this.enabled===!1||this.enableZoom===!1||this.state!==Ve.NONE||(r.preventDefault(),this.dispatchEvent(qd),this._handleMouseWheel(this._customWheelEvent(r)),this.dispatchEvent(Ov))}function O1(r){this.enabled!==!1&&this._handleKeyDown(r)}function P1(r){switch(this._trackPointer(r),this._pointers.length){case 1:switch(this.touches.ONE){case Cr.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(r),this.state=Ve.TOUCH_ROTATE;break;case Cr.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(r),this.state=Ve.TOUCH_PAN;break;default:this.state=Ve.NONE}break;case 2:switch(this.touches.TWO){case Cr.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(r),this.state=Ve.TOUCH_DOLLY_PAN;break;case Cr.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(r),this.state=Ve.TOUCH_DOLLY_ROTATE;break;default:this.state=Ve.NONE}break;default:this.state=Ve.NONE}this.state!==Ve.NONE&&this.dispatchEvent(qd)}function z1(r){switch(this._trackPointer(r),this.state){case Ve.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(r),this.update();break;case Ve.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(r),this.update();break;case Ve.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(r),this.update();break;case Ve.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(r),this.update();break;default:this.state=Ve.NONE}}function I1(r){this.enabled!==!1&&r.preventDefault()}function B1(r){r.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function F1(r){r.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class K0 extends gn{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new ue(.5,.5),this.addEventListener("removed",function(){this.traverse(function(i){i.element instanceof i.element.ownerDocument.defaultView.Element&&i.element.parentNode!==null&&i.element.remove()})})}copy(t,i){return super.copy(t,i),this.element=t.element.cloneNode(!0),this.center=t.center,this}}const Rr=new tt,Q0=new Ze,J0=new Ze,$0=new tt,tv=new tt;class H1{constructor(t={}){const i=this;let s,l,c,h;const d={objects:new WeakMap},m=t.element!==void 0?t.element:document.createElement("div");m.style.overflow="hidden",this.domElement=m,this.getSize=function(){return{width:s,height:l}},this.render=function(b,E){b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),E.parent===null&&E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),Q0.copy(E.matrixWorldInverse),J0.multiplyMatrices(E.projectionMatrix,Q0),_(b,b,E),M(b)},this.setSize=function(b,E){s=b,l=E,c=s/2,h=l/2,m.style.width=b+"px",m.style.height=E+"px"};function p(b){b.isCSS2DObject&&(b.element.style.display="none");for(let E=0,y=b.children.length;E<y;E++)p(b.children[E])}function _(b,E,y){if(b.visible===!1){p(b);return}if(b.isCSS2DObject){Rr.setFromMatrixPosition(b.matrixWorld),Rr.applyMatrix4(J0);const g=Rr.z>=-1&&Rr.z<=1&&b.layers.test(y.layers)===!0,B=b.element;B.style.display=g===!0?"":"none",g===!0&&(b.onBeforeRender(i,E,y),B.style.transform="translate("+-100*b.center.x+"%,"+-100*b.center.y+"%)translate("+(Rr.x*c+c)+"px,"+(-Rr.y*h+h)+"px)",B.parentNode!==m&&m.appendChild(B),b.onAfterRender(i,E,y));const R={distanceToCameraSquared:v(y,b)};d.objects.set(b,R)}for(let g=0,B=b.children.length;g<B;g++)_(b.children[g],E,y)}function v(b,E){return $0.setFromMatrixPosition(b.matrixWorld),tv.setFromMatrixPosition(E.matrixWorld),$0.distanceToSquared(tv)}function S(b){const E=[];return b.traverseVisible(function(y){y.isCSS2DObject&&E.push(y)}),E}function M(b){const E=S(b).sort(function(g,B){if(g.renderOrder!==B.renderOrder)return B.renderOrder-g.renderOrder;const R=d.objects.get(g).distanceToCameraSquared,w=d.objects.get(B).distanceToCameraSquared;return R-w}),y=E.length;for(let g=0,B=E.length;g<B;g++)E[g].element.style.zIndex=y-g}}}const G1={front:{dir:[0,-1,0],up:[0,0,1]},back:{dir:[0,1,0],up:[0,0,1]},left:{dir:[-1,0,0],up:[0,0,1]},right:{dir:[1,0,0],up:[0,0,1]},top:{dir:[0,0,1],up:[0,1,0]},bottom:{dir:[0,0,-1],up:[0,-1,0]}},V1=11187396,ev=4674921,nv=2766406,Xh=3718648,jh=16096779,k1=14870768;function iv(r,t){const i=new tt(...t.min),s=new tt(...t.max),l=i.clone().add(s).multiplyScalar(.5),c=s.clone().sub(i).length()||1,h=r.camera;h.fov=40,h.near=c/100,h.far=c*20,h.position.copy(l).add(new tt(c*.9,-c*1.1,c*.8)),h.up.set(0,0,1),h.lookAt(l),h.updateProjectionMatrix(),r.controls.target.copy(l),r.controls.update()}function X1(r){return r==="PASS"?"pass":r==="FAIL"?"fail":""}function j1({model:r,mesh:t,statuses:i,selectedId:s,onSelect:l,pickMode:c,pickTarget:h,pickedRefs:d,onPickRef:m}){const p=Vt.useRef(null),_=Vt.useRef(null),v=Vt.useRef(l);v.current=l;const S=Vt.useRef(r);S.current=r;const M=Vt.useRef(t);M.current=t;const b=Vt.useRef(s);b.current=s;const E=Vt.useRef(c);E.current=c;const y=Vt.useRef(h??"auto");y.current=h??"auto";const g=Vt.useRef(m);g.current=m,Vt.useEffect(()=>{const R=p.current,w=new T1({antialias:!0,alpha:!0});w.setPixelRatio(Math.min(window.devicePixelRatio,2)),w.setSize(R.clientWidth,R.clientHeight),w.domElement.style.position="absolute",w.domElement.style.inset="0",R.appendChild(w.domElement);const V=new H1;V.setSize(R.clientWidth,R.clientHeight),V.domElement.style.position="absolute",V.domElement.style.inset="0",V.domElement.style.pointerEvents="none",R.appendChild(V.domElement);const F=new wM;F.background=new Me(988970),F.fog=new Xd(988970,400,3e3);const L=new gi(40,R.clientWidth/R.clientHeight,.1,5e3);L.up.set(0,0,1),L.position.set(150,-150,120);const X=new R1(L,w.domElement);X.enableDamping=!0,X.dampingFactor=.12,F.add(new IM(12571903,1976635,1.3));const U=new v0(16777215,1.5);U.position.set(1,-1.5,2),F.add(U);const D=new v0(11454207,.5);D.position.set(-1.5,1,-.5),F.add(D);const z=new M0(400,40,ev,nv);z.rotation.x=Math.PI/2,z.material.transparent=!0,z.material.opacity=.6,F.add(z);const lt=new Ts,st=new Ts,dt=new Ts;F.add(lt,st,dt);const et=new GM;et.params.Line={threshold:1};let I=0;const Y=()=>{I=requestAnimationFrame(Y),X.update(),w.render(F,L),V.render(F,L)};Y();const q=new ResizeObserver(()=>{const ut=R.clientWidth,Et=R.clientHeight;!ut||!Et||(w.setSize(ut,Et),V.setSize(ut,Et),L.aspect=ut/Et,L.updateProjectionMatrix())});q.observe(R);const $=ut=>{const Et=w.domElement.getBoundingClientRect();return new ue((ut.clientX-Et.left)/Et.width*2-1,-((ut.clientY-Et.top)/Et.height)*2+1)},rt=ut=>{var Rt,Ut;const Et=_.current;if(!Et||!Et.partMesh)return null;if(et.setFromCamera(ut,L),y.current!=="edge"&&y.current!=="face"&&Et.vertexPoints.length){const O=et.intersectObjects(Et.vertexPoints.map(qt=>qt.mesh),!1);if(O.length){const qt=O.sort((Qt,Yt)=>Qt.distance-Yt.distance)[0].object,Pt=(Rt=Et.vertexPoints.find(Qt=>Qt.mesh===qt))==null?void 0:Rt.vertexId;if(Pt!==void 0)return{kind:"vertex",id:Pt}}}if(y.current==="vertex")return null;if(y.current!=="face"&&Et.edgeLines.length){const O=et.intersectObjects(Et.edgeLines.map(qt=>qt.line),!1);if(O.length){const qt=O.sort((Qt,Yt)=>Qt.distance-Yt.distance)[0].object,Pt=(Ut=Et.edgeLines.find(Qt=>Qt.line===qt))==null?void 0:Ut.edgeId;if(Pt!==void 0)return{kind:"edge",id:Pt}}}if(y.current==="edge")return null;const Dt=et.intersectObject(Et.partMesh,!1);if(!Dt.length||Dt[0].faceIndex===void 0)return null;const Gt=Et.partMesh.userData.faceLookup(Dt[0].faceIndex??-1);return Gt>=0?{kind:"face",id:Gt}:null},N=()=>{const ut=_.current;ut!=null&&ut.hoverHighlight&&(ut.pmiGroup.remove(ut.hoverHighlight),ut.hoverHighlight=null)};let W=null;const vt=ut=>W=[ut.clientX,ut.clientY],Mt=ut=>{var Rt,Ut;const Et=_.current,Dt=M.current;if(!Et||!E.current)return;const Gt=rt($(ut));if(N(),!(!Gt||!Dt)){if(Gt.kind==="vertex"){const O=Dt.vertices.find(Yt=>Yt.vertex_id===Gt.id);if(!O)return;const qt=(Rt=Et.vertexPoints.find(Yt=>Yt.vertexId===Gt.id))==null?void 0:Rt.mesh,Pt=((Ut=qt==null?void 0:qt.geometry)==null?void 0:Ut.parameters.radius)??.5,Qt=new wn(new Dr(Pt*1.6),new ca({color:Xh,depthTest:!1}));Qt.position.set(...O.point),Qt.renderOrder=14,Et.hoverHighlight=Qt,Et.pmiGroup.add(Qt)}else if(Gt.kind==="face"&&Et.partMesh){const O=Dt.face_ranges.find(Qt=>Qt.face_id===Gt.id);if(!O||!O.index_count)return;const qt=new Mn;qt.setAttribute("position",Et.partMesh.geometry.getAttribute("position")),qt.setIndex(Dt.indices.slice(O.index_start,O.index_start+O.index_count));const Pt=new wn(qt,new ca({color:Xh,transparent:!0,opacity:.45,side:ai,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3,depthWrite:!1}));Et.hoverHighlight=Pt,Et.pmiGroup.add(Pt)}else if(Gt.kind==="edge"){const O=Dt.edges.find(Qt=>Qt.edge_id===Gt.id);if(!O)return;const qt=new Mn;qt.setAttribute("position",new mn(O.points,3));const Pt=new ko(qt,new wr({color:Xh,depthTest:!1}));Pt.renderOrder=13,Et.hoverHighlight=Pt,Et.pmiGroup.add(Pt)}}},K=ut=>{var Pt;if(!W||Math.hypot(ut.clientX-W[0],ut.clientY-W[1])>4)return;const Et=_.current,Dt=S.current;if(!Et||!Et.partMesh||!Dt)return;const Gt=$(ut);if(E.current){const Qt=rt(Gt);Qt&&((Pt=g.current)==null||Pt.call(g,Qt.kind,Qt.id));return}et.setFromCamera(Gt,L);const Rt=et.intersectObject(Et.partMesh,!1);if(!Rt.length||Rt[0].faceIndex===void 0){v.current(null);return}const Ut=Et.partMesh.userData.faceLookup(Rt[0].faceIndex??-1),O=Dt.characteristics.filter(Qt=>Qt.face_ids.includes(Ut));if(!O.length){v.current(null);return}const qt=O.findIndex(Qt=>Qt.id===b.current);v.current(O[(qt+1)%O.length].id)};w.domElement.addEventListener("pointerdown",vt),w.domElement.addEventListener("pointerup",K),w.domElement.addEventListener("pointermove",Mt),w.domElement.addEventListener("pointerleave",N);const xt=ut=>{const Et=S.current;if(!Et)return;if(ut==="iso"){iv(_.current,Et.bbox);return}const Dt=new tt(...Et.bbox.min),Gt=new tt(...Et.bbox.max),Rt=Dt.clone().add(Gt).multiplyScalar(.5),Ut=Gt.clone().sub(Dt).length()||1,{dir:O,up:qt}=G1[ut];L.fov=2,L.near=Ut*5,L.far=Ut*200,L.position.copy(Rt).addScaledVector(new tt(...O),Ut*50),L.up.set(...qt),L.lookAt(Rt),L.updateProjectionMatrix(),X.target.copy(Rt),X.update()};return _.current={renderer:w,labelRenderer:V,scene:F,camera:L,controls:X,modelGroup:lt,pmiGroup:st,highlightGroup:dt,grid:z,partMesh:null,edgeLines:[],vertexPoints:[],balloons:new Map,raycaster:et,hoverHighlight:null,setView:xt,dispose:()=>{cancelAnimationFrame(I),q.disconnect(),w.domElement.removeEventListener("pointerdown",vt),w.domElement.removeEventListener("pointerup",K),w.domElement.removeEventListener("pointermove",Mt),w.domElement.removeEventListener("pointerleave",N),X.dispose(),w.dispose(),w.domElement.remove(),V.domElement.remove()}},()=>{var ut;return(ut=_.current)==null?void 0:ut.dispose()}},[]),Vt.useEffect(()=>{const R=_.current;if(!R||(R.modelGroup.clear(),R.pmiGroup.clear(),R.highlightGroup.clear(),R.balloons.clear(),R.partMesh=null,R.edgeLines=[],R.vertexPoints=[],R.hoverHighlight=null,!r||!t))return;const w=new Mn;w.setAttribute("position",new mn(t.positions,3)),w.setAttribute("normal",new mn(t.normals,3)),w.setIndex(t.indices);const V=new OM({color:V1,metalness:.15,roughness:.55,side:ai}),F=new wn(w,V),L=t.face_ranges;F.userData.faceLookup=rt=>{const N=rt*3;let W=0,vt=L.length-1;for(;W<=vt;){const Mt=W+vt>>1,K=L[Mt];if(N<K.index_start)vt=Mt-1;else if(N>=K.index_start+K.index_count)W=Mt+1;else return K.face_id}return-1},R.modelGroup.add(F),R.partMesh=F;const X=new wr({color:988970,transparent:!0,opacity:.65});for(const rt of t.edges){const N=new Mn;N.setAttribute("position",new mn(rt.points,3));const W=new ko(N,X);R.modelGroup.add(W),R.edgeLines.push({line:W,edgeId:rt.edge_id})}const U=new tt(...r.bbox.max).sub(new tt(...r.bbox.min)).length()||1;R.raycaster.params.Line={threshold:U/250};const D=Math.max(U/200,.05),z=new Dr(D),lt=new ca({color:k1,transparent:!0,opacity:.85});for(const rt of t.vertices){const N=new wn(z,lt);N.position.set(...rt.point),N.renderOrder=9,R.modelGroup.add(N),R.vertexPoints.push({mesh:N,vertexId:rt.vertex_id})}const st=(rt,N,W)=>{const vt=new Mn().setFromPoints([new tt(...rt),new tt(...N)]),Mt=new ko(vt,new wr({color:W,depthTest:!1}));Mt.renderOrder=10;const K=new wn(new Dr(r.bbox?Math.max(new tt(...r.bbox.max).sub(new tt(...r.bbox.min)).length()/220,.05):.5),new ca({color:W,depthTest:!1}));return K.position.set(...rt),K.renderOrder=11,R.pmiGroup.add(Mt,K),Mt};for(const rt of r.characteristics){if(!rt.anchor||!rt.label_pos)continue;const N=document.createElement("div");N.className="balloon-wrap";const W=document.createElement("div");W.className="balloon",W.textContent=String(rt.index),W.title=`${rt.id} · ${rt.feature_name}`;const vt=document.createElement("div");vt.className="balloon-tip",vt.textContent=`${rt.id} ${rt.requirement}${rt.feature_name?" — "+rt.feature_name:""}`,N.append(W,vt),N.style.pointerEvents="auto",W.addEventListener("click",xt=>{xt.stopPropagation(),v.current(rt.id)});const Mt=new K0(N);Mt.position.set(...rt.label_pos),R.pmiGroup.add(Mt);const K=st(rt.anchor,rt.label_pos,4674921);R.balloons.set(rt.id,{obj:Mt,el:W,leader:K})}for(const rt of r.datums){if(!rt.anchor||!rt.label_pos)continue;const N=document.createElement("div");N.className="datum-flag",N.textContent=rt.label,N.title=`Datum ${rt.label}`;const W=new K0(N);W.position.set(...rt.label_pos),R.pmiGroup.add(W),st(rt.anchor,rt.label_pos,11817737)}iv(R,r.bbox);const dt=new tt(...r.bbox.min),et=new tt(...r.bbox.max),I=dt.clone().add(et).multiplyScalar(.5),Y=Math.max(et.x-dt.x,et.y-dt.y)||1,q=Math.pow(10,Math.ceil(Math.log10(Y*2.5))),$=Math.max(10,Math.round(q/Math.pow(10,Math.floor(Math.log10(q/20)))));R.scene.remove(R.grid),R.grid.geometry.dispose(),R.grid.material.dispose(),R.grid=new M0(q,$,ev,nv),R.grid.rotation.x=Math.PI/2,R.grid.material.transparent=!0,R.grid.material.opacity=.6,R.grid.position.set(I.x,I.y,dt.z-Y*.02),R.scene.add(R.grid)},[r,t]),Vt.useEffect(()=>{if(c)return;const R=_.current;R!=null&&R.hoverHighlight&&(R.pmiGroup.remove(R.hoverHighlight),R.hoverHighlight=null)},[c]),Vt.useEffect(()=>{const R=_.current;if(R)for(const[w,V]of R.balloons){V.el.classList.remove("pass","fail");const F=X1(i[w]);F&&V.el.classList.add(F);const L=F==="pass"?1483594:F==="fail"?14427686:4674921;V.leader.material.color.setHex(L)}},[i,r]),Vt.useEffect(()=>{const R=_.current;if(!R)return;R.highlightGroup.clear();for(const[U,D]of R.balloons)D.el.classList.toggle("selected",U===s),D.obj.element.classList.toggle("selected",U===s);if(!s||!r||!t||!R.partMesh)return;const w=r.characteristics.find(U=>U.id===s);if(!w)return;const V=i[s],F=V==="PASS"?2278750:V==="FAIL"?15680580:3900150,L=R.partMesh.geometry.getAttribute("position"),X=R.partMesh.geometry.getAttribute("normal");for(const U of w.face_ids){const D=t.face_ranges.find(st=>st.face_id===U);if(!D||!D.index_count)continue;const z=new Mn;z.setAttribute("position",L),z.setAttribute("normal",X),z.setIndex(t.indices.slice(D.index_start,D.index_start+D.index_count));const lt=new wn(z,new ca({color:F,transparent:!0,opacity:.55,side:ai,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,depthWrite:!1}));R.highlightGroup.add(lt)}},[s,r,t,i]),Vt.useEffect(()=>{var L,X;const R=_.current;if(!R||!R.partMesh||!t||!(d!=null&&d.length))return;const w=R.partMesh.geometry.getAttribute("position"),V=R.partMesh.geometry.getAttribute("normal"),F=[];for(const U of d)if(U.kind==="vertex"){const D=t.vertices.find(dt=>dt.vertex_id===U.ref_id);if(!D)continue;const z=(L=R.vertexPoints.find(dt=>dt.vertexId===U.ref_id))==null?void 0:L.mesh,lt=((X=z==null?void 0:z.geometry)==null?void 0:X.parameters.radius)??.5,st=new wn(new Dr(lt*1.6),new ca({color:jh,depthTest:!1}));st.position.set(...D.point),st.renderOrder=12,R.pmiGroup.add(st),F.push(st)}else if(U.kind==="face"){const D=t.face_ranges.find(st=>st.face_id===U.ref_id);if(!D||!D.index_count)continue;const z=new Mn;z.setAttribute("position",w),z.setAttribute("normal",V),z.setIndex(t.indices.slice(D.index_start,D.index_start+D.index_count));const lt=new wn(z,new ca({color:jh,transparent:!0,opacity:.6,side:ai,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3,depthWrite:!1}));R.pmiGroup.add(lt),F.push(lt)}else{const D=t.edges.find(st=>st.edge_id===U.ref_id);if(!D)continue;const z=new Mn;z.setAttribute("position",new mn(D.points,3));const lt=new ko(z,new wr({color:jh,depthTest:!1,linewidth:3}));lt.renderOrder=12,R.pmiGroup.add(lt),F.push(lt)}return()=>{for(const U of F)R.pmiGroup.remove(U)}},[d,t]);const B=[{view:"iso",label:"Iso"},{view:"front",label:"Front"},{view:"back",label:"Back"},{view:"top",label:"Top"},{view:"bottom",label:"Bottom"},{view:"left",label:"Left"},{view:"right",label:"Right"}];return H.jsxs("div",{className:"relative h-full w-full overflow-hidden",children:[H.jsx("div",{ref:p,className:`absolute inset-0 ${c?"cursor-crosshair":""}`}),r&&H.jsx("div",{className:"pointer-events-auto absolute right-3 top-3 flex gap-0.5 rounded bg-slate-900/85 p-1 text-xs shadow-lg ring-1 ring-slate-700",children:B.map(R=>H.jsx("button",{onClick:()=>{var w;return(w=_.current)==null?void 0:w.setView(R.view)},title:R.view==="iso"?"Reset to angled view":`Look straight along ${R.label} (edges lie flat on screen - easier to pick)`,className:"rounded px-1.5 py-1 text-slate-300 hover:bg-slate-700 hover:text-slate-100",children:R.label},R.view))}),!r&&H.jsx("div",{className:"pointer-events-none absolute inset-0 flex items-center justify-center text-slate-400",children:H.jsxs("div",{className:"text-center",children:[H.jsx("div",{className:"text-5xl",children:"⬡"}),H.jsx("p",{className:"mt-2 text-sm",children:"Upload a STEP AP242 file or load a sample to begin"})]})})]})}const W1={part_number:"",part_name:"",serial_number:"",fai_report_number:"",drawing_revision:"",model_file_name:"",model_id:""},q1={name:"",inspector_id:"",instrument:"",notes:""};function Y1(){const[r,t]=Vt.useState(null),[i,s]=Vt.useState(null),[l,c]=Vt.useState([]),[h,d]=Vt.useState(null),[m,p]=Vt.useState(null),[_,v]=Vt.useState(null),[S,M]=Vt.useState(null),[b,E]=Vt.useState({}),[y,g]=Vt.useState({}),[B,R]=Vt.useState(W1),[w,V]=Vt.useState(q1),[F,L]=Vt.useState(null),[X,U]=Vt.useState(!1),[D,z]=Vt.useState(!1),[lt,st]=Vt.useState("auto"),[dt,et]=Vt.useState([]),[I,Y]=Vt.useState(!1),q=Vt.useRef(null);Vt.useEffect(()=>{QS().then(c).catch(()=>c([]))},[]),Vt.useEffect(()=>{if(!_)return;const Rt=setTimeout(()=>v(null),4e3);return()=>clearTimeout(Rt)},[_]);const $=(r==null?void 0:r.characteristics)??[],rt=Vt.useMemo(()=>{const Rt={};for(const Ut of $)Rt[Ut.id]=uy(Ut,b[Ut.id]);return Rt},[$,b]),N=Vt.useMemo(()=>{const Rt={};for(const Ut in rt)Rt[Ut]=rt[Ut].status;return Rt},[rt]),W=fy($.map(Rt=>{var Ut;return((Ut=rt[Rt.id])==null?void 0:Ut.status)??"PENDING"})),vt=$.reduce((Rt,Ut)=>{var O;return Rt[((O=rt[Ut.id])==null?void 0:O.status)??"PENDING"]++,Rt},{PASS:0,FAIL:0,PENDING:0}),Mt=Vt.useCallback(async Rt=>{var O;d("Building mesh…");const Ut=await $S(Rt.model_id);t(Rt),s(Ut),E({}),g({}),L(null),M(((O=Rt.characteristics[0])==null?void 0:O.id)??null),R(qt=>({...qt,part_number:qt.part_number||Rt.part_name,part_name:qt.part_name||Rt.part_name,model_file_name:Rt.file_name,model_id:Rt.model_id}))},[]),K=async(Rt,Ut)=>{d(Rt),p(null);try{await Ut()}catch(O){p(O instanceof Error?O.message:String(O))}finally{d(null)}},xt=Rt=>{Rt&&K(`Parsing ${Rt.name}…`,async()=>Mt(await KS(Rt)))},ut=()=>r?B.part_number.trim()?w.name.trim()?null:"Inspector name is required.":"Part number is required.":"Load a STEP model first.",Et=()=>K("Saving session…",async()=>{const Rt=ut();if(Rt)throw new Error(Rt);const Ut=await ty(B_(B,w,$,b,y,{pmi_source:r.pmi_source,schema:r.schema}));L(Ut),v(`Inspection session #${Ut.id} saved (${Ut.overall_status}).`)}),Dt=Rt=>K(`Generating AS9102 Form 3 (${Rt.toUpperCase()})…`,async()=>{const Ut=ut();if(Ut)throw new Error(Ut);await ey(B_(B,w,$,b,y),Rt,F==null?void 0:F.id)}),Gt=(Rt,Ut)=>{E(O=>({...O,[Rt]:Ut})),L(null)};return H.jsxs("div",{className:"flex h-full flex-col",children:[H.jsxs("header",{className:"flex items-center gap-3 border-b bg-slate-900 px-4 py-2 text-white",children:[H.jsx("div",{className:"text-base font-semibold tracking-tight",children:"PMI STEP Inspector"}),H.jsx("div",{className:"text-xs text-slate-400",children:"AP242 semantic PMI · AS9102 Form 3"}),H.jsxs("div",{className:"ml-auto flex items-center gap-2",children:[H.jsx("input",{ref:q,type:"file",accept:".step,.stp,.p21",className:"hidden",onChange:Rt=>{var Ut;return xt((Ut=Rt.target.files)==null?void 0:Ut[0])}}),H.jsx("button",{onClick:()=>{var Rt;return(Rt=q.current)==null?void 0:Rt.click()},disabled:!!h,className:"rounded bg-blue-600 px-3 py-1.5 text-sm font-medium hover:bg-blue-500 disabled:opacity-50",children:"Upload STEP"}),l.length>0&&H.jsxs("select",{className:"rounded border border-slate-600 bg-slate-800 px-2 py-1.5 text-sm",value:"",disabled:!!h,onChange:Rt=>{const Ut=Rt.target.value;Ut&&K(`Loading ${Ut}…`,async()=>Mt(await JS(Ut)))},children:[H.jsx("option",{value:"",children:"Load sample…"}),l.map(Rt=>H.jsx("option",{value:Rt,children:Rt},Rt))]}),H.jsx("span",{className:"mx-1 h-6 w-px bg-slate-700"}),H.jsx("button",{onClick:Et,disabled:!!h||!r,className:"rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50",children:"Save Inspection Session"}),H.jsx("button",{onClick:()=>Dt("xlsx"),disabled:!!h||!r,className:"rounded bg-slate-700 px-3 py-1.5 text-sm font-medium hover:bg-slate-600 disabled:opacity-50",children:"Export AS9102 Form 3 (Excel)"}),H.jsx("button",{onClick:()=>Dt("pdf"),disabled:!!h||!r,className:"rounded bg-slate-700 px-3 py-1.5 text-sm font-medium hover:bg-slate-600 disabled:opacity-50",children:"PDF"}),H.jsx("span",{className:"mx-1 h-6 w-px bg-slate-700"}),H.jsx("button",{onClick:()=>{et([]),st("auto"),z(!0),Y(!0)},disabled:!r||I,className:"rounded border border-slate-600 px-3 py-1.5 text-sm font-medium hover:bg-slate-800 disabled:opacity-50",children:"Add GD&T…"}),H.jsx("button",{onClick:()=>U(!0),disabled:!r,className:"rounded border border-slate-600 px-3 py-1.5 text-sm font-medium hover:bg-slate-800 disabled:opacity-50",children:"STEP Metadata"}),H.jsx("button",{onClick:()=>K("Downloading…",async()=>ay(r.model_id,r.file_name)),disabled:!r,className:"rounded border border-slate-600 px-3 py-1.5 text-sm font-medium hover:bg-slate-800 disabled:opacity-50",children:"Download .step"})]})]}),(m||h||_)&&H.jsxs("div",{className:`px-4 py-1.5 text-sm ${m?"bg-red-950 text-red-300":_?"bg-emerald-950 text-emerald-300":"bg-amber-950 text-amber-300"}`,children:[m??_??h,m&&H.jsx("button",{className:"ml-3 underline",onClick:()=>p(null),children:"dismiss"})]}),H.jsxs("div",{className:"grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(520px,46%)]",children:[H.jsxs("section",{className:"relative min-h-0 border-r border-slate-800",children:[H.jsx(j1,{model:r,mesh:i,statuses:N,selectedId:S,onSelect:M,pickMode:D,pickTarget:lt,pickedRefs:dt,onPickRef:(Rt,Ut)=>et(O=>{const qt=O.findIndex(Pt=>Pt.kind===Rt&&Pt.ref_id===Ut);return qt>=0?O.filter((Pt,Qt)=>Qt!==qt):O.length>=2?[O[1],{kind:Rt,ref_id:Ut}]:[...O,{kind:Rt,ref_id:Ut}]})}),r&&H.jsxs("div",{className:"pointer-events-none absolute left-3 top-3 rounded bg-slate-900/85 px-3 py-2 text-xs shadow-lg ring-1 ring-slate-700",children:[H.jsx("div",{className:"font-semibold text-slate-100",children:r.part_name}),H.jsxs("div",{className:"text-slate-400",children:[r.file_name," · ",r.face_count," faces · PMI via ",r.pmi_source," · ",r.datums.length," datum(s)"]}),H.jsxs("div",{className:"mt-1 flex gap-2",children:[H.jsxs("span",{className:"rounded bg-green-900/60 px-1.5 text-green-300",children:["PASS ",vt.PASS]}),H.jsxs("span",{className:"rounded bg-red-900/60 px-1.5 text-red-300",children:["FAIL ",vt.FAIL]}),H.jsxs("span",{className:"rounded bg-slate-800 px-1.5 text-slate-300",children:["PENDING ",vt.PENDING]}),H.jsx("span",{className:`rounded px-1.5 font-semibold ${W==="PASS"?"bg-green-600 text-white":W==="FAIL"?"bg-red-600 text-white":"bg-slate-700 text-slate-200"}`,children:W})]}),r.warnings.map(Rt=>H.jsxs("div",{className:"mt-1 max-w-md text-amber-400",children:["⚠ ",Rt]},Rt))]}),H.jsx("div",{className:"pointer-events-none absolute bottom-2 left-3 text-[11px] text-slate-500",children:D?"Click faces or edges to pick them for the new characteristic (click again to unpick)":"Drag to orbit · scroll to zoom · right-drag to pan · click a face or balloon to select"})]}),H.jsxs("aside",{className:"flex min-h-0 flex-col bg-slate-900",children:[H.jsx(oy,{header:B,inspector:w,onHeader:R,onInspector:V}),H.jsx(dy,{characteristics:$,evaluated:rt,readings:b,ncr:y,selectedId:S,onSelect:M,onReading:Gt,onNcr:(Rt,Ut)=>g(O=>({...O,[Rt]:Ut}))}),H.jsxs("footer",{className:"flex items-center gap-3 border-t border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-400",children:[F?H.jsxs("span",{className:"text-emerald-400",children:["Saved as session #",F.id]}):H.jsx("span",{children:"Unsaved"}),H.jsxs("span",{className:"ml-auto",children:[$.length," characteristics"]})]})]})]}),X&&r&&H.jsx(cy,{modelId:r.model_id,fileName:r.file_name,onClose:()=>U(!1)}),I&&r&&H.jsx(ry,{model:r,mesh:i,pickedRefs:dt,pickTarget:lt,onPickTargetChange:st,onClose:()=>{Y(!1),z(!1),et([])},onClearPicks:()=>et([]),onAdded:Rt=>{K(`Reloading ${Rt.file_name}…`,async()=>Mt(Rt)),Y(!1),z(!1),v("PMI added and written to the STEP file.")}})]})}ZS.createRoot(document.getElementById("root")).render(H.jsx(Vt.StrictMode,{children:H.jsx(Y1,{})}));
