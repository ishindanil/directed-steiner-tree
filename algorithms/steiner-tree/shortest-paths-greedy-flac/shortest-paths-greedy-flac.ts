import { FloydWarshall } from 'algorithms/shortest-paths/floyd-warshall';
import { GreedyFlac } from 'algorithms/steiner-tree/greedy-flac';

import Graph from 'models/graph/graph';

import { Vertex } from 'types/vertex';
import { IPathMatrix } from 'types/paths';

export class ShortestPathsGreedyFlac {
    private root: Vertex;
    private terminals: Vertex[];
    private graph: Graph;

    readonly shortestPathMatrix: IPathMatrix;

    constructor(graph: Graph, root: Vertex, terminals: Vertex[]) {
        this.graph = graph;
        this.root = root;
        this.terminals = terminals;

        this.shortestPathMatrix = new FloydWarshall(graph).calculate();
    }

    public calculate() {
        const shortestPathsGraph = this.buildShortestPathGraph();

        const steinerTree = new GreedyFlac(shortestPathsGraph, this.root, this.terminals).calculate();

        return this.restoreOriginalPaths(steinerTree);
    }

    public buildShortestPathGraph() {
        const shortestPathsGraph = new Graph();

        this.graph.vertices.forEach(vertex1 => {
            this.graph.vertices.forEach(vertex2 => {
                const shortestPath = this.shortestPathMatrix[vertex1][vertex2];

                if (shortestPath.cost < Infinity) {
                    const edge = { src: vertex1, dst: vertex2, cost: shortestPath.cost };
                    shortestPathsGraph.addEdge(edge);
                }
            });
        });

        return shortestPathsGraph;
    }

    public restoreOriginalPaths(graph: Graph) {
        const graphWithOriginalPaths = new Graph();

        graph.edges.forEach(edge => {
            const { src, dst } = edge;
            const originalPath = this.shortestPathMatrix[src][dst];

            graphWithOriginalPaths.addEdges(originalPath.edges);
        });

        return graphWithOriginalPaths;
    }
}
