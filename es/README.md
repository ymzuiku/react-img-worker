# 使用 worker 加载 image

此库仅是在 [https://github.com/nitish24p/react-worker-image](https://github.com/nitish24p/react-worker-image) 的基础上修改了部分逻辑，和添加 typescript 支持

```tsx
import { ImgWorker } from 'react-img-worker';

export default () => {
  return <ImgWorker src="http://example.png" />;
};
```
