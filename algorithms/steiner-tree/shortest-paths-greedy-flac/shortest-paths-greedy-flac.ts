import { FloydWarshall } from 'algorithms/shortest-paths/floyd-warshall';
import { GreedyFlac } from 'algorithms/steiner-tree/greedy-flac';
import { ShortestPaths } from 'algorithms/steiner-tree/shortest-paths';

import { buildShortestPathGraph, restoreOriginalPaths } from 'helpers/graph';

import Graph from 'models/graph/graph';

import { Vertex } from 'types/vertex';
import { IPathMatrix } from 'types/paths';

export class ShortestPathsGreedyFlac {
    private readonly root: Vertex;
    private readonly terminals: Vertex[];
    private readonly graph: Graph;

    private readonly shortestPathMatrix: IPathMatrix;

    constructor(graph: Graph, root: Vertex, terminals: Vertex[]) {
        this.graph = graph;
        this.root = root;
        this.terminals = terminals;

        this.shortestPathMatrix = new FloydWarshall(graph).calculate();
    }

    public calculate() {
        const shortestPathsGraph = buildShortestPathGraph(this.graph, this.shortestPathMatrix);

        const steinerTree = new GreedyFlac(shortestPathsGraph, this.root, this.terminals).calculate();

        const restored = restoreOriginalPaths(steinerTree, this.shortestPathMatrix);
        return new ShortestPaths(restored, this.root, this.terminals).calculate();
    }
}
