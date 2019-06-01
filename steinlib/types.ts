import Graph from 'models/graph/graph';

import { Vertex } from 'types/vertex';

export interface IInstance {
    path: string;
    optimal: number;
    name: string;
    t?: number;
}

export interface IInstanceMap {
    [name: string]: IInstance[];
}

export interface IDirectedInstance {
    graph: Graph;
    root: Vertex;
    terminals: Vertex[];
}
