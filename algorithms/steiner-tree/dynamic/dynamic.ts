const moize = require('moize').default;

import { IFindSteinerTreeFunc } from 'algorithms/steiner-tree/dynamic/types';

import { getAllSubsets, getHash, getSortedHash } from 'helpers/array';
import { mergeGraphs, restoreOriginalPaths } from 'helpers/graph';
import { computeShortestPathMatrixWithAssociatedEdge } from 'helpers/shortest-paths';

import Graph from 'models/graph/graph';

import { Vertex } from 'types/vertex';
import { IPathWithAssociatedEdgeMatrix } from 'types/paths';

export class Dynamic {
    private readonly graph: Graph;
    private readonly root: Vertex;
    private readonly terminals: Vertex[];
    private readonly terminalSubsets: Vertex[][];
    private readonly shortestPathMatrix: IPathWithAssociatedEdgeMatrix;

    private readonly findSteinerTreeMemoized: IFindSteinerTreeFunc = moize(this.findSteinerTree.bind(this), {
        isSerialized: true,
        serializer: args => {
            const subsetHash = getHash(args[0]);
            const root = args[1];

            return `${subsetHash}__${root}`;
        }
    });

    constructor(graph: Graph, root: Vertex, terminals: Vertex[]) {
        this.graph = graph;
        this.root = root;
        this.terminals = terminals.slice();
        this.terminals.sort();
        this.terminalSubsets = getAllSubsets(terminals);
        this.terminalSubsets.shift(); // removing empty set
        this.terminalSubsets.sort((a, b) => (a.length > b.length ? 1 : -1));
        this.terminalSubsets.forEach(subset => {
            subset.sort();
        });
        this.shortestPathMatrix = computeShortestPathMatrixWithAssociatedEdge(graph);
    }

    public calculate() {
        const tree = this.findSteinerTreeMemoized(this.terminals, this.root, []);

        return restoreOriginalPaths(tree, this.shortestPathMatrix);
    }

    private findSteinerTree(subset: Vertex[], root: Vertex, visited: Vertex[]) {
        if (subset.length === 1) {
            return this.findSteinerTreeForSimpleSubset(subset, root);
        }

        const [bestByTransition, bestBySplittingSubset] = [
            this.findSteinerTreeByTransition(subset, root, visited),
            this.findSteinerTreeBySplittingSubset(subset, root, visited)
        ];

        if (bestByTransition.cost < bestBySplittingSubset.cost) {
            return bestByTransition.tree;
        }

        return bestBySplittingSubset.tree;
    }

    private findSteinerTreeForSimpleSubset(subset: Vertex[], root: Vertex) {
        const [terminal] = subset;
        const path = this.shortestPathMatrix[root][terminal];

        if (path.cost === Infinity) {
            return null;
        }

        return new Graph([path.edge], root);
    }

    private findSteinerTreeByTransition(subset: Vertex[], root: Vertex, visited: Vertex[]) {
        const possibleTrees: Array<Graph | null> = [];
        visited = [...visited, root];

        for (const vertex of this.graph.vertices) {
            if (visited.includes(vertex)) {
                continue;
            }

            if (!this.hasPath(root, vertex)) {
                continue;
            }

            const path = this.shortestPathMatrix[root][vertex];

            const steinerTree = this.findSteinerTreeMemoized(subset, vertex, visited);

            if (steinerTree === null) {
                possibleTrees.push(null);

                continue;
            }

            const possibleTree = new Graph(steinerTree.edges, root);
            possibleTree.addEdge(path.edge);

            possibleTrees.push(possibleTree);
        }

        return this.findMinimumTree(possibleTrees);
    }

    private findSteinerTreeBySplittingSubset(subset: Vertex[], root: Vertex, visited: Vertex[]) {
        const hash = getHash(subset);
        const possibleTrees: Array<Graph | null> = [];
        visited = [...visited, root];

        for (let i = 0; i < this.terminalSubsets.length; i++) {
            const firstSubset = this.terminalSubsets[i];

            if (firstSubset.length >= subset.length) {
                break;
            }

            for (let j = i + 1; j < this.terminalSubsets.length; j++) {
                const secondSubset = this.terminalSubsets[j];

                if (secondSubset.length >= subset.length) {
                    break;
                }

                if (firstSubset.length + secondSubset.length !== subset.length) {
                    continue;
                }

                const unionHash = getSortedHash([...firstSubset, ...secondSubset]);

                if (hash !== unionHash) {
                    continue;
                }

                const firstTree = this.findSteinerTreeMemoized(firstSubset, root, visited);
                const secondTree = this.findSteinerTreeMemoized(secondSubset, root, visited);

                if (firstTree === null || secondTree === null) {
                    possibleTrees.push(null);

                    continue;
                }

                const possibleTree = mergeGraphs([firstTree, secondTree]);
                possibleTrees.push(possibleTree);
            }
        }

        return this.findMinimumTree(possibleTrees);
    }

    private hasPath(root: Vertex, vertex: Vertex) {
        const path = this.shortestPathMatrix[root][vertex];

        return path.cost !== Infinity;
    }

    private findMinimumTree(trees: Array<Graph | null>) {
        let minimumCost = Infinity;
        let minimumTree: Graph | null = null;

        trees.forEach(tree => {
            if (tree === null) {
                return;
            }

            const cost = tree.countCost();

            if (cost < minimumCost) {
                minimumCost = cost;
                minimumTree = tree;
            }
        });

        return { tree: minimumTree, cost: minimumCost };
    }
}
