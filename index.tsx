import * as React from 'react';

const webWorkerScript = `
  self.addEventListener('message', event => {
    const url = event.data;
    fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'default'
    }).then(response => {
        return response.blob();
    }).then(_ => postMessage(url)).catch(console.error);
  })
`;

const createWorker = (script: string) => {
  return new Worker(
    URL.createObjectURL(new Blob([script], { type: 'application/javascript' }))
  );
};

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
  public needReloadSrc = !!this.props.miniSrc;
  public state = {
    isLoading: true,
    src: '',
  };
  public worker = createWorker(webWorkerScript);
  public constructor(props: IImgWorkerProps) {
    super(props);
    this.worker.onmessage = (event: any) => {
      this.loadImage(event.data);
    };
  }

  public componentDidMount() {
    // 如果有minSrc，先加载minSrc
    if (this.needReloadSrc) {
      this.worker.postMessage(this.props.miniSrc);
    } else {
      this.worker.postMessage(this.props.src);
    }
  }

  public componentWillUnmount() {
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
    }

    this.worker.terminate();
  }

  public loadImage = (url: string) => {
    const image = new Image();
    this.image = image;

    image.src = url;
    image.decode !== undefined
      ? image
          .decode()
          .then(this.onLoad)
          .catch(this.onLoad)
      : (image.onload = this.onLoad);
  };

  public onLoad = () => {
    this.setState(
      {
        src: this.image.src,
        isLoading: false,
      },
      () => {
        // 如果有minSrc，先加载minSrc
        if (this.needReloadSrc) {
          this.needReloadSrc = false;
          this.worker.postMessage(this.props.src);
        }
      }
    );
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
