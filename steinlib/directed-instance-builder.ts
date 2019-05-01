import Graph from 'models/graph/graph';

import { IDirectedInstance } from 'steinlib';
import { parseSteinLibFile } from 'steinlib/parser';

export function buildDirectedInstance(steinLibFile: string): IDirectedInstance {
    const { edges, terminals } = parseSteinLibFile(steinLibFile);

    const graph = new Graph();

    edges.forEach(edge => {
        graph.addEdge({ src: edge.src, dst: edge.dst, cost: edge.cost });
        graph.addEdge({ src: edge.dst, dst: edge.src, cost: edge.cost });
    });

    const root = terminals.shift();

    return { graph, root, terminals };
}
