图片加载占据了一个 web 应用的较多资源。

这篇文章中，我们实现一个 ImgWorker 组件，满足以下功能：

- image 可选择的 worker 加载，并且做好优雅降级
- decode 解码，并且做好优雅降级
- miniSrc 和 src 竞速加载

> 注意，在性能较低的机器，开启 worker 进程下载的开销大于直接使用主进程下载的开销;
> 使用 worker 需要主动传递 worker 属性为 true 开启

## 组件代码

先上代码，后续对关键代码做一些解释：

src/react-img-worker.js :

```jsx
import * as React from 'react';

const blobUrl = new Blob(
  [
    `
self.addEventListener('message', event => {
  const [url, type] = event.data;
  fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'default'
  }).then(response => {
      return response.blob();
  }).then(_ => postMessage([url, type])).catch(console.error);
})
`,
  ],
  { type: 'application/javascript' }
);

interface IImgWorkerProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  boxProps?: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >;
  miniSrc?: string;
  renderLoading?: any;
  worker?: boolean;
}

interface IImgWorkerState {
  isLoading: boolean;
  src: string;
}

export class ImgWorker extends React.Component<
  IImgWorkerProps,
  IImgWorkerState
> {
  public div: any = null;
  public image: HTMLImageElement = new Image();
  public isLoadedSrcLock = false;
  public state = {
    isLoading: true,
    src: '',
  };
  public worker: Worker = null as any;
  public constructor(props: IImgWorkerProps) {
    super(props);
    this.image.style.width = '100%';
    this.image.style.height = '100%';
    this.image.style.display = 'none';

    // 如果使用 worker 并且浏览器支持 worker
    if (this.props.worker && typeof Worker !== 'undefined') {
      this.worker = new Worker(URL.createObjectURL(blobUrl));
      this.worker.addEventListener('message', event => {
        const [url, type] = event.data;

        this.loadImage(url, type);
      });
    }
  }

  public componentDidMount() {
    this.div.appendChild(this.image);
    this.postMessage(this.props);
  }

  public componentWillReceiveProps(nextProps: IImgWorkerProps) {
    let isPostMessage = false;
    if (nextProps.miniSrc !== this.props.miniSrc) {
      isPostMessage = true;
    }
    if (nextProps.src !== this.props.src) {
      isPostMessage = true;
    }

    // 如果 src 或 miniSrc 更新，重新请求
    if (isPostMessage) {
      this.isLoadedSrcLock = false;
      this.postMessage(nextProps);
    }
  }

  public componentWillUnmount() {
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
    }
    if (this.worker) {
      this.worker.terminate();
    }
  }

  public loadImage = (url: string, type: string) => {
    // 如果 src 已经被设置，拦截后续的更新
    if (this.isLoadedSrcLock) {
      return;
    }
    if (type === 'src') {
      this.isLoadedSrcLock = true;
    }

    this.image.src = url;
    this.image.decoding = 'async';
    this.image.decode !== undefined
      ? this.image
          .decode()
          .then(this.onLoad)
          .catch(this.onLoad)
      : (this.image.onload = this.onLoad);
  };

  public onLoad = () => {
    this.image.style.display = 'block';
    this.setState({
      src: this.image.src,
      isLoading: false,
    });
  };

  public postMessage = (props: IImgWorkerProps) => {
    if (props.miniSrc) {
      if (this.worker) {
        this.worker.postMessage([props.miniSrc, 'miniSrc']);
      } else {
        this.loadImage(props.miniSrc, 'miniSrc');
      }
    }

    if (props.src) {
      if (this.worker) {
        this.worker.postMessage(this.worker.postMessage([props.src, 'src']));
      } else {
        this.loadImage(props.src, 'miniSrc');
      }
    }
  };

  public render() {
    const { boxProps, renderLoading: Loading, src: _src, ...rest } = this.props;
    const { isLoading, src } = this.state;

    return (
      <div ref={r => (this.div = r)} {...rest}>
        {Loading && isLoading && (
          <Loading key="img-worker-loading" isLoaing={isLoading} />
        )}
      </div>
    );
  }
}
```

代码是 typescript 编写的，这是为了组件发版可以更简便的生成.d.ts 文件，内容很简单，其中关键在于两处：

1. 创建一个 worker

```jsx
this.worker = new Worker(URL.createObjectURL(blobUrl));
```

2. 使用 decode

decode 的功能网上有许多文章，这里不展开

```jsx
const image = new Image();
image.src = url;
image.decoding = 'async';
image.decode !== undefined
  ? image
      .decode()
      .then(this.onLoad)
      .catch(this.onLoad)
  : (image.onload = this.onLoad);
```

## 使用

使用默认 image loader, ImgWorker 保留了 `<img />` 标签原有的所有 api

```tsx
import { ImgWorker } from './react-img-worker';

export default () => {
  return <ImgWorker src="http://example.png" />;
};
```

使用 worker loader:

```tsx
import { ImgWorker } from './react-img-worker';

export default () => {
  return <ImgWorker worker src="http://example.png" />;
};
```

支持 mini 图片，如果 设置了 miniSrc 会并行加载 miniSrc 和 src；若 miniSrc 优先加载完，显示 miniSrc；若 src 优先加载完会拦截此次后续的图片更新。

使用 worker + miniSrc + src：

```tsx
import { ImgWorker } from './react-img-worker';

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

## 直接使用 react-img-worker 库

为了方便使用，以上代码已发布至 npm，可以直接使用

```sh
$ yarn add react-img-worker
```

希望有对君有帮助：）
