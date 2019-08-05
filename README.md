# 使用 worker 加载 image

此库仅是在 [https://github.com/nitish24p/react-worker-image](https://github.com/nitish24p/react-worker-image) 的基础上修改了部分逻辑，和添加 typescript 支持

```tsx
import { ImgWorker } from 'react-img-worker';

export default () => {
  return <ImgWorker src="http://example.png" />;
};
```

支持 mini 图片，会先加载 miniSrc, 再加载 src

```tsx
import { ImgWorker } from 'react-img-worker';

export default () => {
  return (
    <ImgWorker miniSrc="http://example.mini.png" src="http://example.png" />
  );
};
```
