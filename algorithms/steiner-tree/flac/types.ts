export interface IBooleanMatrix {
    [vertex: string]: {
        [terminal: string]: boolean;
    };
}

export interface IFlowRateMap {
    [vertex: string]: number;
}
