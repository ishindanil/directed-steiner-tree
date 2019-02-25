import { SortedList } from 'helpers/sorted-list';

import { Vertex } from 'types/vertex';

export interface IEdge {
    src: Vertex;
    dst: Vertex;
    cost: number;
}

export interface ISetOfEdgeMap {
    [vertex: string]: Set<IEdge>;
}

export interface IListOfEdgeMap {
    [vertex: string]: IEdge[];
}

export interface ISortedListOfEdgeMap {
    [vertex: string]: SortedList<IEdge>;
}
