import { FibonacciHeap } from '@tyriar/fibonacci-heap';

import Graph from 'models/graph/graph';

import { Vertex } from 'types/vertex';
import { IPathMap } from 'types/paths';
import { IFibonacciNodeMap } from 'types/fibonacci-heap';
import { ISetOfEdgeMap } from 'types/edges';

export class Dijkstra {
    private root: Vertex;
    private graph: Graph;
    private outputEdges: ISetOfEdgeMap;

    private shortestPaths: IPathMap = {};

    private heap = new FibonacciHeap<number, Vertex>();
    private heapNodes: IFibonacciNodeMap<number, Vertex> = {};

    constructor(graph: Graph, root: Vertex) {
        this.graph = graph;
        this.root = root;
        this.outputEdges = this.graph.getOutputEdges();

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

            this.outputEdges[vertex].forEach(outputEdge => {
                const heapNode = this.heapNodes[outputEdge.dst];

                if (heapNode === null) {
                    return;
                }

                const currentCost = this.shortestPaths[outputEdge.dst].cost;
                const possibleCost = shortestPath.cost + outputEdge.cost;

                if (currentCost > possibleCost) {
                    this.shortestPaths[outputEdge.dst] = {
                        cost: possibleCost,
                        edges: [...shortestPath.edges, outputEdge]
                    };

                    this.heap.decreaseKey(heapNode, possibleCost);
                }
            });
        }

        return this.shortestPaths;
    }
}
