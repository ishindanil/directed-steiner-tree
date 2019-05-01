import { IEdge } from 'types/edges';
import { Vertex } from 'types/vertex';

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

export interface IPathListMap {
    [vertex: string]: IPathWithDst[];
}

export interface IPathWithAssociatedEdge extends IPath {
    edge: IEdge;
}

export interface IPathWithAssociatedEdgeMap {
    [vertex: string]: IPathWithAssociatedEdge;
}

export interface IPathWithAssociatedEdgeMatrix {
    [vertex: string]: IPathWithAssociatedEdgeMap;
}

export interface IPathWithDst {
    path: IPath;
    dst: Vertex;
}
