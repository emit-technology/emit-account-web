/*! For license information please see 2.b1cdb368.chunk.js.LICENSE.txt */
(this["webpackJsonpemit-core-account"]=this["webpackJsonpemit-core-account"]||[]).push([[2],{193:function(e,t,n){"use strict";n.r(t),n.d(t,"startFocusVisible",(function(){return r}));var o="ion-focused",s=["Tab","ArrowDown","Space","Escape"," ","Shift","Enter","ArrowLeft","ArrowRight","ArrowUp","Home","End"],r=function(e){var t=[],n=!0,r=e?e.shadowRoot:document,c=e||document.body,i=function(e){t.forEach((function(e){return e.classList.remove(o)})),e.forEach((function(e){return e.classList.add(o)})),t=e},u=function(){n=!1,i([])},a=function(e){(n=s.includes(e.key))||i([])},d=function(e){if(n&&e.composedPath){var t=e.composedPath().filter((function(e){return!!e.classList&&e.classList.contains("ion-focusable")}));i(t)}},f=function(){r.activeElement===c&&i([])};r.addEventListener("keydown",a),r.addEventListener("focusin",d),r.addEventListener("focusout",f),r.addEventListener("touchstart",u),r.addEventListener("mousedown",u);return{destroy:function(){r.removeEventListener("keydown",a),r.removeEventListener("focusin",d),r.removeEventListener("focusout",f),r.removeEventListener("touchstart",u),r.removeEventListener("mousedown",u)},setFocus:i}}}}]);
//# sourceMappingURL=2.b1cdb368.chunk.js.map