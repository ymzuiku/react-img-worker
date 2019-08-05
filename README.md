# 使用 worker 加载 image

词库实现了 image 的 worker 加载、decode 解码，及 miniSrc 和 src 竞速加载，并且对 worker 和 decode 做了降级处理

## 安装

```sh
$ yarn add react-img-worker
```

## 使用

使用默认 image loader:

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
