import { IPathMatrix } from 'types/paths';

import Graph from 'models/graph/graph';

export class FloydWarshall {
    private graph: Graph;
    private shortestPaths: IPathMatrix = {};

    constructor(graph: Graph) {
        this.graph = graph;

        this.initialize();
    }

    private initialize() {
        const { vertices } = this.graph;

        vertices.forEach(firstVertex => {
            this.shortestPaths[firstVertex] = {};

            vertices.forEach(secondVertex => {
                this.shortestPaths[firstVertex][secondVertex] = {
                    cost: Infinity,
                    edges: []
                };
            });

            this.shortestPaths[firstVertex][firstVertex].cost = 0;
        });
    }

    public calculate() {
        const { vertices, edges } = this.graph;

        edges.forEach(edge => {
            if (edge.src === edge.dst) {
                return;
            }

            this.shortestPaths[edge.src][edge.dst] = {
                cost: edge.cost,
                edges: [edge]
            };
        });

        vertices.forEach(k => {
            vertices.forEach(i => {
                vertices.forEach(j => {
                    const currentPath = this.shortestPaths[i][j];
                    const currentCost = currentPath.cost;

                    const firstPath = this.shortestPaths[i][k];
                    const secondPath = this.shortestPaths[k][j];
                    const possibleCost = firstPath.cost + secondPath.cost;

                    if (possibleCost < currentCost) {
                        currentPath.cost = possibleCost;
                        currentPath.edges = [...firstPath.edges, ...secondPath.edges];
                    }
                });
            });
        });

        return this.shortestPaths;
    }
}
