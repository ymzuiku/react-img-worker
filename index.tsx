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
    const { isLoading } = this.state;

    return (
      <div ref={r => (this.div = r)} {...rest}>
        {Loading && isLoading && (
          <Loading key="img-worker-loading" isLoaing={isLoading} />
        )}
      </div>
    );
  }
}
