import * as path from 'path';
import * as graphviz from 'graphviz';

import { createDirectory } from 'helpers/directory';

import Graph from 'models/graph/graph';

import { graphVizPath } from 'env';

export function writeVisualPresentation(name: string, graph: Graph, filepath: string) {
    createDirectory(path.dirname(filepath));

    const digraph = graphviz.digraph(name);

    graph.edges.forEach(edge => {
        digraph.addEdge(edge.src, edge.dst, { label: edge.cost });
    });

    digraph.setGraphVizPath(graphVizPath);

    digraph.output('png', filepath, function(code, out, err) {
        console.error(err);
    });
}
