(this["webpackJsonpemit-core-account"]=this["webpackJsonpemit-core-account"]||[]).push([[75],{278:function(t,e,n){"use strict";n.r(e),n.d(e,"createSwipeBackGesture",(function(){return o}));var r=n(17),i=n(271),c=n(102),o=(n(66),function(t,e,n,o,a){var u=t.ownerDocument.defaultView,s=Object(i.i)(t),f=function(t){return s?-t.deltaX:t.deltaX},h=function(t){return s?-t.velocityX:t.velocityX};return Object(c.createGesture)({el:t,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:function(t){return function(t){var e=t.startX;return s?e>=u.innerWidth-50:e<=50}(t)&&e()},onStart:n,onMove:function(t){var e=f(t)/u.innerWidth;o(e)},onEnd:function(t){var e=f(t),n=u.innerWidth,i=e/n,c=h(t),o=c>=0&&(c>.2||e>n/2),s=(o?1-i:i)*n,d=0;if(s>5){var v=s/Math.abs(c);d=Math.min(v,540)}a(o,i<=0?.01:Object(r.k)(0,i,.9999),d)}})})}}]);