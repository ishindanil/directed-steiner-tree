import { Dijkstra } from 'algorithms/shortest-paths/dijkstra';

import Graph from 'models/graph/graph';

import { Vertex } from 'types/vertex';

export class ShortestPaths {
    private readonly graph: Graph;
    private readonly root: Vertex;
    private readonly terminals: Vertex[];

    constructor(graph: Graph, root: Vertex, terminals: Vertex[]) {
        this.graph = graph;
        this.root = root;
        this.terminals = terminals;
    }

    public calculate() {
        const shortestPaths = new Dijkstra(this.graph, this.root).calculate();

        const steinerTree = new Graph();

        this.terminals.forEach(terminal => {
            steinerTree.addEdges(shortestPaths[terminal].edges);
        });

        return steinerTree;
    }
}
