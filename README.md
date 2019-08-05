# 使用 worker 加载 image

此库实现了 image 的 worker 加载、decode 解码，及 miniSrc 和 src 竞速加载，并且对 worker 和 decode 做了降级处理

> 注意，在性能较低的机器，开启 worker 进程下载的开销大于直接使用主进程下载的开销;
> 使用 worker 需要主动传递 worker 属性为 true 开启

## 安装

```sh
$ yarn add react-img-worker
```

## 使用

使用默认 image loader, ImgWorker 保留了 `<img />` 标签原有的所有 api

```tsx
import { ImgWorker } from 'react-img-worker';

export default () => {
  return <ImgWorker src="http://example.png" />;
};
```

使用 worker loader:

```tsx
import { ImgWorker } from 'react-img-worker';

export default () => {
  return <ImgWorker worker src="http://example.png" />;
};
```

支持 mini 图片，如果 设置了 miniSrc 会并行加载 miniSrc 和 src；若 miniSrc 优先加载完，显示 miniSrc；若 src 优先加载完，miniSrc 的回调会被中断.

使用 worker + miniSrc + src：

```tsx
import { ImgWorker } from 'react-img-worker';

export default () => {
  return (
    <ImgWorker
      worker
      miniSrc="http://example.mini.png"
      src="http://example.png"
    />
  );
};
```
