import { FibonacciHeap } from '@tyriar/fibonacci-heap';

import Graph from 'models/graph/graph';

import { Vertex } from 'types/vertex';
import { IPathMap } from 'types/paths';
import { IFibonacciNodeMap } from 'types/fibonacci-heap';
import { ISetOfEdgeMap } from 'types/edges';

export class InverseDijkstra {
    private root: Vertex;
    private graph: Graph;
    private inputEdges: ISetOfEdgeMap;

    private shortestPaths: IPathMap = {};

    private heap = new FibonacciHeap<number, Vertex>();
    private heapNodes: IFibonacciNodeMap<number, Vertex> = {};

    constructor(graph: Graph, root: Vertex) {
        this.graph = graph;
        this.root = root;
        this.inputEdges = this.graph.getInputEdges();

        this.initialize();
    }

    private initialize() {
        this.graph.vertices.forEach(vertex => {
            this.shortestPaths[vertex] = { cost: Infinity, edges: [] };
            this.heapNodes[vertex] = this.heap.insert(Infinity, vertex);
        });

        this.shortestPaths[this.root] = { cost: 0, edges: [] };
        this.heap.decreaseKey(this.heapNodes[this.root], 0);
    }

    public calculate() {
        while (!this.heap.isEmpty()) {
            const { value: vertex } = this.heap.extractMinimum();
            const shortestPath = this.shortestPaths[vertex];

            this.heapNodes[vertex] = null;

            this.inputEdges[vertex].forEach(inputEdge => {
                const heapNode = this.heapNodes[inputEdge.src];

                if (heapNode === null) {
                    return;
                }

                const currentCost = this.shortestPaths[inputEdge.src].cost;
                const possibleCost = shortestPath.cost + inputEdge.cost;

                if (currentCost > possibleCost) {
                    this.shortestPaths[inputEdge.src] = {
                        cost: possibleCost,
                        edges: [...shortestPath.edges, inputEdge]
                    };

                    this.heap.decreaseKey(heapNode, possibleCost);
                }
            });
        }

        return this.shortestPaths;
    }
}
