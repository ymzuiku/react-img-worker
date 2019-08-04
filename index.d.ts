import * as React from 'react';
interface IImgWorkerProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    boxProps?: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
    renderLoading?: any;
}
interface IImgWorkerState {
    isLoading: boolean;
    src: string;
}
export declare class ImgWorker extends React.Component<IImgWorkerProps, IImgWorkerState> {
    image: HTMLImageElement;
    state: {
        isLoading: boolean;
        src: string;
    };
    worker: Worker;
    constructor(props: IImgWorkerProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    loadImage: (url: string) => void;
    onLoad: () => void;
    render(): JSX.Element;
}
export {};
