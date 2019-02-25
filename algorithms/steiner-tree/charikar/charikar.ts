import { FloydWarshall } from 'algorithms/shortest-paths/floyd-warshall';

import { Vertex } from 'types/vertex';

import Graph from 'models/graph/graph';
import { IPathMatrix } from 'types/paths';

export class Charikar {
    readonly graph: Graph;
    readonly root: Vertex;
    readonly terminals: Vertex[];
    readonly shortestPathMatrix: IPathMatrix;

    constructor(graph: Graph, root: Vertex, terminals: Vertex[]) {
        this.graph = graph;
        this.root = root;
        this.terminals = terminals;
        this.shortestPathMatrix = new FloydWarshall(graph).calculate();
    }

    public calculate(level = Infinity) {
        return this.recursiveApproximate(this.root, this.terminals, this.terminals.length, level);
    }

    private recursiveApproximate(
        root: Vertex,
        terminals: Vertex[],
        terminalsCount: number,
        level,
        visited: Vertex[] = []
    ) {
        const { vertices } = this.graph;
        const result = new Graph();

        const reachable = this.countReachableTerminals(root, terminals);

        if (reachable < terminalsCount) {
            return result;
        }

        while (terminalsCount > 0) {
            let bestDensity = Infinity;
            let bestTree: Graph;

            vertices.forEach(vertex => {
                if (vertex === root || visited.includes(vertex)) {
                    return;
                }

                const path = this.shortestPathMatrix[root][vertex];

                if (path.cost === Infinity) {
                    return;
                }

                for (let i = 1; i <= terminalsCount; i++) {
                    const tree =
                        level > 1
                            ? this.recursiveApproximate(vertex, terminals, i, level - 1, [...visited, root])
                            : new Graph();
                    tree.addEdges(path.edges);

                    const density = this.countDensity(tree, terminals);

                    if (bestDensity > density) {
                        bestTree = tree;
                        bestDensity = density;
                    }
                }
            });

            if (!bestTree) {
                break;
            }

            result.addEdges(bestTree.edges);
            const oldTerminalsLength = terminals.length;
            terminals = terminals.filter(terminal => !bestTree.vertices.has(terminal));
            terminalsCount = terminalsCount - (oldTerminalsLength - terminals.length);
        }

        return result;
    }

    private countReachableTerminals(root: Vertex, terminals: Vertex[]) {
        let counter = 0;

        terminals.forEach(terminal => {
            if (this.shortestPathMatrix[root][terminal].cost < Infinity) {
                counter++;
            }
        });

        const selfPath = this.shortestPathMatrix[root][root];

        if (terminals.includes(root) && selfPath.cost < Infinity) {
            counter--;
        }

        return counter;
    }

    private countDensity(tree: Graph, terminals: Vertex[]) {
        let terminalsCount = 0;
        terminals.forEach(terminal => {
            if (tree.vertices.has(terminal)) {
                terminalsCount++;
            }
        });

        if (terminalsCount === 0) {
            return Infinity;
        }

        return tree.countCost() / terminalsCount;
    }
}
