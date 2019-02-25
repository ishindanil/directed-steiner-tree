import Graph from 'models/graph/graph';

import { IEdge } from 'types/edges';

export interface IPath {
    cost: number;
    edges: IEdge[];
}

export interface IPathMap {
    [vertex: string]: IPath;
}

export interface IPathMatrix {
    [vertex: string]: IPathMap;
}
