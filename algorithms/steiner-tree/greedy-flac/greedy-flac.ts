import { Flac } from 'algorithms/steiner-tree/flac';

import Graph from 'models/graph/graph';

import { Vertex } from 'types/vertex';

export class GreedyFlac {
    private readonly root: Vertex;
    private terminals: Vertex[];
    private readonly graph: Graph;

    constructor(graph: Graph, root: Vertex, terminals: Vertex[]) {
        this.graph = graph;
        this.root = root;
        this.terminals = terminals;
    }

    public calculate() {
        const steinerTree = new Graph();

        while (this.terminals.length > 0) {
            const tree = new Flac(this.graph, this.root, this.terminals).calculate();

            steinerTree.addEdges(tree.edges);

            this.terminals = this.terminals.filter(terminal => !tree.vertices.has(terminal));
        }

        return steinerTree;
    }
}
