import { FloydWarshall } from 'algorithms/shortest-paths/floyd-warshall';
import { ShortestPaths } from 'algorithms/steiner-tree/shortest-paths';

import { restoreOriginalPaths } from 'helpers/graph';

import Graph from 'models/graph/graph';

import { Vertex } from 'types/vertex';
import { IPathWithAssociatedEdgeMatrix, IPathWithAssociatedEdge } from 'types/paths';

export class Charikar {
    private readonly graph: Graph;
    private readonly root: Vertex;
    private readonly terminals: Vertex[];
    private shortestPathMatrix: IPathWithAssociatedEdgeMatrix;

    constructor(graph: Graph, root: Vertex, terminals: Vertex[]) {
        this.graph = graph;
        this.root = root;
        this.terminals = terminals;

        this.initShortestPathMatrix();
    }

    private initShortestPathMatrix() {
        const shortestPathMatrix = new FloydWarshall(this.graph).calculate();

        this.graph.vertices.forEach(firstVertex => {
            this.graph.vertices.forEach(secondVertex => {
                const path = shortestPathMatrix[firstVertex][secondVertex] as IPathWithAssociatedEdge;
                path.edge = { src: firstVertex, dst: secondVertex, cost: path.cost };
            });
        });

        this.shortestPathMatrix = shortestPathMatrix as IPathWithAssociatedEdgeMatrix;
    }

    public calculate(level = Infinity) {
        const { steinerTree } = this.findSteinerTree(this.root, this.terminals, this.terminals.length, level);

        const restored = restoreOriginalPaths(steinerTree, this.shortestPathMatrix);
        return new ShortestPaths(restored, this.root, this.terminals).calculate();
    }

    private findSteinerTree(root: Vertex, terminals: Vertex[], terminalsCount: number, level, visited: Vertex[] = []) {
        const result = new Graph();
        const resultTerminals: Vertex[] = [];
        visited = [...visited, root];

        const reachable = this.countReachableTerminals(root, terminals);

        if (reachable < terminalsCount) {
            return { steinerTree: result, cost: 0, coveredTerminals: resultTerminals };
        }

        while (terminalsCount > 0) {
            let bestTree = new Graph();
            let bestDensity = Infinity;
            let bestCost = Infinity;
            let bestTreeTerminals: Vertex[] = [];

            this.graph.vertices.forEach(vertex => {
                const path = this.shortestPathMatrix[root][vertex];

                if (visited.includes(vertex) || path.cost === Infinity) {
                    return;
                }

                for (let i = 1; i <= terminalsCount; i++) {
                    let { steinerTree, cost, coveredTerminals } =
                        level > 1
                            ? this.findSteinerTree(vertex, terminals, i, level - 1, [...visited, root])
                            : { steinerTree: new Graph(), cost: 0, coveredTerminals: [] };

                    cost += path.cost;
                    steinerTree.addEdge(path.edge);

                    if (terminals.includes(vertex)) {
                        coveredTerminals.push(vertex);
                    }

                    const density = cost / coveredTerminals.length;

                    if (bestDensity > density) {
                        bestCost = cost;
                        bestTree = steinerTree;
                        bestDensity = density;
                        bestTreeTerminals = coveredTerminals;
                    }
                }
            });

            result.addEdges(bestTree.edges);
            resultTerminals.push(...bestTreeTerminals);
            terminals = terminals.filter(terminal => !bestTreeTerminals.includes(terminal));
            terminalsCount = terminalsCount - bestTreeTerminals.length;
        }

        return { steinerTree: result, cost: result.countCost(), coveredTerminals: resultTerminals };
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

    // private countDensity(tree: Graph, terminals: Vertex[]) {
    //     let terminalsCount = 0;
    //     terminals.forEach(terminal => {
    //         if (tree.vertices.has(terminal)) {
    //             terminalsCount++;
    //         }
    //     });
    //
    //     if (terminalsCount === 0) {
    //         return Infinity;
    //     }
    //
    //     return tree.countCost() / terminalsCount;
    // }
}
