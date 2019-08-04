"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
var React = require("react");
var webWorkerScript = "\n  self.addEventListener('message', event => {\n    const url = event.data;\n    fetch(url, {\n        method: 'GET',\n        mode: 'no-cors',\n        cache: 'default'\n    }).then(response => {\n        return response.blob();\n    }).then(_ => postMessage(url)).catch(console.error);\n  })\n";
var createWorker = function (script) {
    return new Worker(URL.createObjectURL(new Blob([script], { type: 'application/javascript' })));
};
var ImgWorker = /** @class */ (function (_super) {
    __extends(ImgWorker, _super);
    function ImgWorker(props) {
        var _this = _super.call(this, props) || this;
        _this.image = undefined;
        _this.state = {
            isLoading: true,
            src: ''
        };
        _this.worker = createWorker(webWorkerScript);
        _this.loadImage = function (url) {
            var image = new Image();
            _this.image = image;
            image.src = url;
            image.decode !== undefined
                ? image
                    .decode()
                    .then(_this.onLoad)["catch"](_this.onLoad)
                : (image.onload = _this.onLoad);
        };
        _this.onLoad = function () {
            _this.setState({
                src: _this.image.src,
                isLoading: false
            });
        };
        _this.worker.onmessage = function (event) {
            _this.loadImage(event.data);
        };
        return _this;
    }
    ImgWorker.prototype.componentDidMount = function () {
        this.worker.postMessage(this.props.src);
    };
    ImgWorker.prototype.componentWillUnmount = function () {
        if (this.image) {
            this.image.onload = null;
            this.image.onerror = null;
        }
        this.worker.terminate();
    };
    ImgWorker.prototype.render = function () {
        var _a = this.props, boxProps = _a.boxProps, Loading = _a.renderLoading, _src = _a.src, rest = __rest(_a, ["boxProps", "renderLoading", "src"]);
        var _b = this.state, isLoading = _b.isLoading, src = _b.src;
        return (<>
        {Loading && isLoading && (<Loading key="img-worker-loading" isLoaing={isLoading}/>)}
        {!isLoading && <img key="img-worker" alt="" src={src} {...rest}/>}
      </>);
    };
    return ImgWorker;
}(React.Component));
exports.ImgWorker = ImgWorker;
