const moize = require('moize').default;

import { FloydWarshall } from 'algorithms/shortest-paths/floyd-warshall';

import { getAllSubsets, getHash } from 'helpers/array';
import { mergeGraphs } from 'helpers/graph';

import Graph from 'models/graph/graph';

import { Vertex } from 'types/vertex';
import { IPathMatrix } from 'types/paths';

export class Dynamic {
    readonly graph: Graph;
    readonly root: Vertex;
    readonly terminals: Vertex[];
    readonly shortestPathMatrix: IPathMatrix;
    readonly terminalSubsets: Vertex[][];

    private readonly findSteinerTreeMemoized = moize(this.findSteinerTree.bind(this), {
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
        this.terminals = terminals;
        this.shortestPathMatrix = new FloydWarshall(graph).calculate();
        this.terminalSubsets = getAllSubsets(terminals);
        this.terminalSubsets.shift(); // removing empty set
        this.terminalSubsets.sort((a, b) => (a.length > b.length ? 1 : -1));
    }

    public calculate() {
        return this.findSteinerTreeMemoized(this.terminals, this.root, []);
    }

    private findSteinerTree(subset: Vertex[], root: Vertex, visited: Vertex[]) {
        if (subset.length === 1) {
            return this.findSteinerTreeForSimpleSubset(subset, root);
        }

        const trees = [
            this.findSteinerTreeByTransition(subset, root, visited),
            this.findSteinerTreeBySplittingSubset(subset, root, visited)
        ];

        return this.findMinimumTree(trees);
    }

    private findSteinerTreeForSimpleSubset(subset: Vertex[], root: Vertex) {
        const [terminal] = subset;
        const path = this.shortestPathMatrix[root][terminal];

        if (path.cost === Infinity) {
            return null;
        }

        return new Graph(path.edges, root);
    }

    private findSteinerTreeByTransition(subset: Vertex[], root: Vertex, visited: Vertex[]) {
        const possibleTrees: Array<Graph | null> = [];

        for (const vertex of this.graph.vertices) {
            const path = this.shortestPathMatrix[root][vertex];

            if (root === vertex) {
                continue;
            }

            if (!this.hasPath(root, vertex)) {
                continue;
            }

            if (visited.includes(vertex)) {
                continue;
            }

            const steinerTree = this.findSteinerTreeMemoized(subset, vertex, [...visited, root]);

            if (steinerTree === null) {
                possibleTrees.push(null);

                continue;
            }

            const possibleTree = new Graph(steinerTree.edges, root);
            possibleTree.addEdges(path.edges);

            possibleTrees.push(possibleTree);
        }

        return this.findMinimumTree(possibleTrees);
    }

    private findSteinerTreeBySplittingSubset(subset: Vertex[], root: Vertex, visited: Vertex[]) {
        const hash = getHash(subset);
        const possibleTrees = [];

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

                const unionHash = getHash([...firstSubset, ...secondSubset]);

                if (hash !== unionHash) {
                    continue;
                }

                const firstTree = this.findSteinerTreeMemoized(firstSubset, root, [...visited, root]);
                const secondTree = this.findSteinerTreeMemoized(secondSubset, root, [...visited, root]);

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
        let minimumTree: Graph = null;

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

        return minimumTree;
    }
}
