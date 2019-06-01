import { FloydWarshall } from 'algorithms/shortest-paths/floyd-warshall';

import Graph from 'models/graph/graph';

import { IPathWithAssociatedEdge, IPathWithAssociatedEdgeMatrix } from 'types/paths';

export function computeShortestPathMatrixWithAssociatedEdge(graph: Graph) {
    const shortestPathMatrix = new FloydWarshall(graph).calculate();

    graph.vertices.forEach(firstVertex => {
        graph.vertices.forEach(secondVertex => {
            const path = shortestPathMatrix[firstVertex][secondVertex] as IPathWithAssociatedEdge;
            path.edge = { src: firstVertex, dst: secondVertex, cost: path.cost };
        });
    });

    return shortestPathMatrix as IPathWithAssociatedEdgeMatrix;
}
