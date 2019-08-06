"use strict";var __extends=this&&this.__extends||function(){var o=function(e,t){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)};return function(e,t){function r(){this.constructor=e}o(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}}(),__assign=this&&this.__assign||function(){return(__assign=Object.assign||function(e){for(var t,r=1,o=arguments.length;r<o;r++)for(var n in t=arguments[r])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e}).apply(this,arguments)},__rest=this&&this.__rest||function(e,t){var r={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(r[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(o=Object.getOwnPropertySymbols(e);n<o.length;n++)t.indexOf(o[n])<0&&Object.prototype.propertyIsEnumerable.call(e,o[n])&&(r[o[n]]=e[o[n]])}return r};exports.__esModule=!0;var React=require("react"),blobUrl=new Blob(["\nself.addEventListener('message', event => {\n  const [url, type] = event.data;\n  fetch(url, {\n      method: 'GET',\n      mode: 'no-cors',\n      cache: 'default'\n  }).then(response => {\n      return response.blob();\n  }).then(_ => postMessage([url, type])).catch(console.error);\n})\n"],{type:"application/javascript"}),ImgWorker=function(t){function e(e){var n=t.call(this,e)||this;return n.div=null,n.image=new Image,n.isLoadedSrcLock=!1,n.state={isLoading:!0,src:""},n.worker=null,n.loadImage=function(e,t){n.isLoadedSrcLock||("src"===t&&(n.isLoadedSrcLock=!0),n.image.src=e,n.image.decoding="async",void 0!==n.image.decode?n.image.decode().then(n.onLoad).catch(n.onLoad):n.image.onload=n.onLoad)},n.onLoad=function(){n.image.style.display="block",n.setState({src:n.image.src,isLoading:!1})},n.postMessage=function(e){e.miniSrc&&(n.worker?n.worker.postMessage([e.miniSrc,"miniSrc"]):n.loadImage(e.miniSrc,"miniSrc")),e.src&&(n.worker?n.worker.postMessage(n.worker.postMessage([e.src,"src"])):n.loadImage(e.src,"miniSrc"))},n.image.style.width="100%",n.image.style.height="100%",n.image.style.display="none",n.props.worker&&"undefined"!=typeof Worker&&(n.worker=new Worker(URL.createObjectURL(blobUrl)),n.worker.addEventListener("message",function(e){var t=e.data,r=t[0],o=t[1];n.loadImage(r,o)})),n}return __extends(e,t),e.prototype.componentDidMount=function(){this.div.appendChild(this.image),this.postMessage(this.props)},e.prototype.componentWillReceiveProps=function(e){var t=!1;e.miniSrc!==this.props.miniSrc&&(t=!0),e.src!==this.props.src&&(t=!0),t&&(this.isLoadedSrcLock=!1,this.postMessage(e))},e.prototype.componentWillUnmount=function(){this.image&&(this.image.onload=null,this.image.onerror=null),this.worker&&this.worker.terminate()},e.prototype.render=function(){var t=this,e=this.props,r=(e.boxProps,e.renderLoading),o=(e.src,__rest(e,["boxProps","renderLoading","src"])),n=this.state.isLoading;return React.createElement("div",__assign({ref:function(e){return t.div=e}},o),r&&n&&React.createElement(r,{key:"img-worker-loading",isLoaing:n}))},e}(React.Component);exports.ImgWorker=ImgWorker;