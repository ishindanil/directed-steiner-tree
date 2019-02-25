import { FibonacciHeap } from '@tyriar/fibonacci-heap';

import { IBooleanMatrix, IFlowRateMap } from 'algorithms/steiner-tree/flac/types';

import { SortedList } from 'helpers/sorted-list';
import { shallowCopy } from 'helpers/object';

import Graph from 'models/graph/graph';

import { Vertex, ISetOfVerticesMap } from 'types/vertex';
import { IEdge, IListOfEdgeMap, ISortedListOfEdgeMap } from 'types/edges';
import { IFibonacciNodeMap } from 'types/fibonacci-heap';

export class Flac {
    private readonly root: Vertex;
    private readonly terminals: Vertex[];

    private t = 0;

    private heap = new FibonacciHeap<number, IEdge>();
    private nextSaturatedEdges: IFibonacciNodeMap<number, IEdge> = {};

    private reachedVertices: ISetOfVerticesMap = {};

    private sortedInputEdges: ISortedListOfEdgeMap = {};
    private saturatedInputEdges: IListOfEdgeMap = {};
    private saturatedOutputEdges: IListOfEdgeMap = {};

    private feedingTerminals: IBooleanMatrix = {};

    private flowRates: IFlowRateMap = {};

    private readonly edgeCompare = (a, b) => (a.cost >= b.cost ? 1 : -1);

    constructor(graph: Graph, root: Vertex, terminals: Vertex[]) {
        this.root = root;
        this.terminals = terminals;

        graph.vertices.forEach(vertex => {
            this.nextSaturatedEdges[vertex] = null;

            this.reachedVertices[vertex] = new Set<Vertex>();
            this.reachedVertices[vertex].add(vertex);

            this.sortedInputEdges[vertex] = new SortedList<IEdge>(this.edgeCompare);
            this.saturatedInputEdges[vertex] = [];
            this.saturatedOutputEdges[vertex] = [];

            this.feedingTerminals[vertex] = {};

            this.flowRates[vertex] = 0;

            terminals.forEach(terminal => {
                this.feedingTerminals[vertex][terminal] = false;
            });
        });

        graph.edges.forEach(edge => {
            this.sortedInputEdges[edge.dst].add(edge);
        });

        terminals.forEach(terminal => {
            const edge = this.sortedInputEdges[terminal].extractFirstElement();
            const saturateTime = this.t + edge.cost;

            this.nextSaturatedEdges[terminal] = this.heap.insert(saturateTime, edge);

            this.feedingTerminals[terminal][terminal] = true;

            this.flowRates[terminal] = 1;
        });
    }

    public calculate() {
        while (true) {
            const edge = this.getNextSaturatedEdge();

            this.updateNextSaturatedEdge(edge);

            if (edge.src === this.root) {
                this.updatePathInfo(edge);

                return this.buildTree();
            }

            const reached = this.getAllReachedVertices(edge.src);

            if (this.isFlowDegenerate(edge.dst, reached)) {
                continue;
            }

            this.updateFlowRates(edge, reached);
        }
    }

    private getNextSaturatedEdge() {
        const node = this.heap.extractMinimum();
        this.t = node.key;

        return node.value;
    }

    private isFlowDegenerate(v: Vertex, reached: Set<Vertex>) {
        for (const w of reached) {
            for (const y of this.terminals) {
                if (this.feedingTerminals[w][y] && this.feedingTerminals[v][y]) {
                    return true;
                }
            }
        }

        return false;
    }

    private updateFlowRates(saturatedEdge: IEdge, reached: Set<Vertex>) {
        const { dst: v } = saturatedEdge;
        this.updatePathInfo(saturatedEdge);

        reached.forEach(w => {
            const fibonacciNode = this.nextSaturatedEdges[w];

            if (!fibonacciNode) {
                const nextSaturatedEdge = this.sortedInputEdges[w].extractFirstElement();

                if (!nextSaturatedEdge) {
                    return;
                }

                const nextSaturateTime = this.t + nextSaturatedEdge.cost / this.flowRates[v];

                this.setNextSaturatedEdge(w, nextSaturateTime, nextSaturatedEdge);
                this.copyFeedingTerminals(v, w);

                return;
            }

            const oldFlowRate = this.flowRates[w];

            this.disjointFeedingTerminals(w, v);

            const newFlowRate = this.flowRates[w];
            const newSaturateTime = this.t + ((fibonacciNode.key - this.t) * oldFlowRate) / newFlowRate;

            this.heap.decreaseKey(fibonacciNode, newSaturateTime);
        });
    }

    private updateNextSaturatedEdge(edge: IEdge) {
        const nextSaturatedEdge = this.sortedInputEdges[edge.dst].extractFirstElement();

        if (nextSaturatedEdge) {
            const flowRate = this.flowRates[edge.dst];
            const saturateTime = this.t + (nextSaturatedEdge.cost - edge.cost) / flowRate;
            this.setNextSaturatedEdge(edge.dst, saturateTime, nextSaturatedEdge);
        } else {
            this.removeNextSaturatedEdge(edge.dst);
        }
    }

    private getAllReachedVertices(v: Vertex, visited: Vertex[] = []) {
        const reachedByOneEdge = this.reachedVertices[v];
        const reached = new Set<Vertex>(reachedByOneEdge);
        const nextVisited = [...visited, ...reachedByOneEdge];

        reachedByOneEdge.forEach(u => {
            if (visited.includes(u)) {
                return;
            }

            this.getAllReachedVertices(u, nextVisited).forEach(w => {
                reached.add(w);
            });
        });

        return reached;
    }

    private setNextSaturatedEdge(v: Vertex, saturateTime: number, edge: IEdge) {
        this.nextSaturatedEdges[v] = this.heap.insert(saturateTime, edge);
    }

    private removeNextSaturatedEdge(v: Vertex) {
        this.nextSaturatedEdges[v] = null;
    }

    private updatePathInfo(edge: IEdge) {
        this.reachedVertices[edge.dst].add(edge.src);
        this.saturatedInputEdges[edge.dst].push(edge);
        this.saturatedOutputEdges[edge.src].push(edge);
    }

    private copyFeedingTerminals(from: Vertex, to: Vertex) {
        this.feedingTerminals[to] = shallowCopy(this.feedingTerminals[from]);
        this.updateFlowRate(to);
    }

    private updateFlowRate(v: Vertex) {
        this.flowRates[v] = this.calculateFlowRate(v);
    }

    private calculateFlowRate(v: Vertex) {
        return this.terminals.reduce((acc, y) => {
            return this.feedingTerminals[v][y] ? acc + 1 : acc;
        }, 0);
    }

    private disjointFeedingTerminals(w: Vertex, v: Vertex) {
        this.terminals.forEach(terminal => {
            this.feedingTerminals[w][terminal] =
                this.feedingTerminals[w][terminal] || this.feedingTerminals[v][terminal];
        });

        this.updateFlowRate(w);
    }

    private buildTree() {
        const tree = new Graph();
        const stack = [...this.saturatedOutputEdges[this.root]];

        while (stack.length > 0) {
            const edge = stack.shift();
            tree.addEdge(edge);

            stack.push(...this.saturatedOutputEdges[edge.dst]);
        }

        return tree;
    }
}
