import * as React from 'react';
interface IImgWorkerProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    boxProps?: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
    miniSrc?: string;
    renderLoading?: any;
    worker?: boolean;
}
interface IImgWorkerState {
    isLoading: boolean;
    src: string;
}
export declare class ImgWorker extends React.Component<IImgWorkerProps, IImgWorkerState> {
    image: HTMLImageElement;
    isLoadedSrcLock: boolean;
    state: {
        isLoading: boolean;
        src: string;
    };
    worker: Worker;
    constructor(props: IImgWorkerProps);
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: IImgWorkerProps): void;
    componentWillUnmount(): void;
    loadImage: (url: string, type: string) => void;
    onLoad: () => void;
    postMessage: (props: IImgWorkerProps) => void;
    render(): JSX.Element;
}
export {};
