import Graph from 'models/graph/graph';

import { IPathMatrix } from 'types/paths';

export function mergeGraphs(graphs: Graph[]) {
    const mergedGraph = new Graph();

    graphs.forEach(graph => {
        mergedGraph.addEdges(graph.edges);
        mergedGraph.addVertices(graph.vertices);
    });

    return mergedGraph;
}

export function buildShortestPathGraph(graph: Graph, shortestPathMatrix: IPathMatrix) {
    const shortestPathsGraph = new Graph();

    graph.vertices.forEach(vertex1 => {
        graph.vertices.forEach(vertex2 => {
            const shortestPath = shortestPathMatrix[vertex1][vertex2];

            if (shortestPath.cost < Infinity) {
                const edge = { src: vertex1, dst: vertex2, cost: shortestPath.cost };
                shortestPathsGraph.addEdge(edge);
            }
        });
    });

    return shortestPathsGraph;
}

export function restoreOriginalPaths(graph: Graph, shortestPathMatrix: IPathMatrix) {
    const graphWithOriginalPaths = new Graph();

    graph.edges.forEach(edge => {
        const { src, dst } = edge;
        const originalPath = shortestPathMatrix[src][dst];

        graphWithOriginalPaths.addEdges(originalPath.edges);
    });

    return graphWithOriginalPaths;
}

export function deepCopyGraph(graph: Graph) {
    const copy = new Graph();

    graph.edges.forEach(edge => {
        copy.addEdge({ ...edge });
    });

    return copy;
}
