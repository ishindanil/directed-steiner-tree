import { boundMethod } from 'autobind-decorator';

import { IEdge, ISetOfEdgeMap } from 'types/edges';
import { Vertex } from 'types/vertex';

export class Graph {
    readonly edges = new Set<IEdge>();
    readonly vertices = new Set<Vertex>();

    public root?: Vertex;

    constructor(edges: IEdge[] | Set<IEdge> = [], root?: Vertex) {
        this.root = root;

        edges.forEach(this.addEdge);
    }

    @boundMethod
    public addEdges(edges: IEdge[] | Set<IEdge>) {
        edges.forEach(this.addEdge);
    }

    @boundMethod
    public addEdge(edge: IEdge) {
        this.addVertex(edge.src);
        this.addVertex(edge.dst);

        this.edges.add(edge);
    }

    @boundMethod
    public addVertices(vertices: Vertex[] | Set<Vertex>) {
        vertices.forEach(this.addVertex);
    }

    @boundMethod
    public addVertex(vertex: Vertex) {
        this.vertices.add(vertex);
    }

    public getOutputEdges() {
        const outputEdges: ISetOfEdgeMap = {};

        this.edges.forEach(edge => {
            if (!outputEdges[edge.src]) {
                outputEdges[edge.src] = new Set<IEdge>();
            }

            if (!outputEdges[edge.dst]) {
                outputEdges[edge.dst] = new Set<IEdge>();
            }

            outputEdges[edge.src].add(edge);
        });

        return outputEdges;
    }

    public countCost() {
        let cost = 0;
        this.edges.forEach(edge => {
            cost += edge.cost;
        });

        return cost;
    }
}

export default Graph;
