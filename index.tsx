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
  public image: HTMLImageElement = undefined as any;
  public isLoadedSrcLock = false;
  public state = {
    isLoading: true,
    src: '',
  };
  public worker: Worker = null as any;
  public constructor(props: IImgWorkerProps) {
    super(props);

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
    this.postMessage(this.props);
  }

  // 为了兼容旧版 react 使用 componentWillReceiveProps
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

    const image = new Image();
    this.image = image;

    image.src = url;
    image.decoding = 'async';
    image.decode !== undefined
      ? image
          .decode()
          .then(this.onLoad)
          .catch(this.onLoad)
      : (image.onload = this.onLoad);
  };

  public onLoad = () => {
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
      <>
        {Loading && isLoading && (
          <Loading key="img-worker-loading" isLoaing={isLoading} />
        )}
        {!isLoading && <img key="img-worker" alt="" src={src} {...rest} />}
      </>
    );
  }
}
