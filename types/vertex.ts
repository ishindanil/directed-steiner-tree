export type Vertex = string;

export interface ISetOfVerticesMap {
    [vertex: string]: Set<Vertex>;
}
