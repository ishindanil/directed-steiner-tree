import Graph from 'models/graph/graph';

export function mergeGraphs(graphs: Graph[]) {
    const mergedGraph = new Graph();

    graphs.forEach(graph => {
        mergedGraph.addEdges(graph.edges);
        mergedGraph.addVertices(graph.vertices);
    });

    return mergedGraph;
}
