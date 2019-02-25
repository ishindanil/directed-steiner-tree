import { Dynamic } from 'algorithms/steiner-tree/dynamic';

import Graph from 'models/graph';

describe('Dynamic Steiner Tree Algorithm', () => {
    test('should find correct steiner tree when only one marked vertex presented', () => {
        const edges = [
            { src: 'a', dst: 'b', cost: 1 },
            { src: 'a', dst: 'c', cost: 1 },
            { src: 'c', dst: 'b', cost: 1 },
            { src: 'd', dst: 'c', cost: 1 }
        ];

        const graph = new Graph(edges);

        const expectedRoot = 'd';
        const expectedEdges = new Set([{ src: 'd', dst: 'c', cost: 1 }, { src: 'c', dst: 'b', cost: 1 }]);
        const expectedVertices = new Set(['c', 'b', 'd']);

        const recieved = new Dynamic(graph, 'd', ['b']).calculate();

        expect(recieved.root).toEqual(expectedRoot);
        expect(recieved.edges).toEqual(expectedEdges);
        expect(recieved.vertices).toEqual(expectedVertices);
    });

    test('should find correct steiner tree when graph does not have cycles', () => {
        const edges = [
            { src: 'a', dst: 'k', cost: 1 },
            { src: 'a', dst: 'd', cost: 5 },
            { src: 'k', dst: 'b', cost: 1 },
            { src: 'k', dst: 'c', cost: 3 },
            { src: 'b', dst: 'c', cost: 1 },
            { src: 'b', dst: 'r', cost: 6 },
            { src: 'c', dst: 'e', cost: 1 },
            { src: 'c', dst: 'e', cost: 1 },
            { src: 'e', dst: 'd', cost: 2 },
            { src: 'r', dst: 'd', cost: 1 }
        ];

        const graph = new Graph(edges);

        const expectedRoot = 'a';
        const expectedEdges = new Set([
            { src: 'a', dst: 'k', cost: 1 },
            { src: 'k', dst: 'b', cost: 1 },
            { src: 'b', dst: 'c', cost: 1 },
            { src: 'c', dst: 'e', cost: 1 },
            { src: 'e', dst: 'd', cost: 2 }
        ]);
        const expectedVertices = new Set(['a', 'k', 'b', 'c', 'd', 'e']);

        const recieved = new Dynamic(graph, 'a', ['b', 'c', 'd']).calculate();

        expect(recieved.root).toEqual(expectedRoot);
        expect(recieved.edges).toEqual(expectedEdges);
        expect(recieved.vertices).toEqual(expectedVertices);
    });

    test('should find correct steiner tree when graph has non-negative cycle', () => {
        const edges = [
            { src: 'a', dst: 'b', cost: 1 },
            { src: 'b', dst: 'c', cost: 1 },
            { src: 'c', dst: 'a', cost: 1 }
        ];

        const graph = new Graph(edges);

        const expectedRoot = 'a';
        const expectedEdges = new Set([{ src: 'a', dst: 'b', cost: 1 }, { src: 'b', dst: 'c', cost: 1 }]);
        const expectedVertices = new Set(['a', 'b', 'c']);

        const recieved = new Dynamic(graph, 'a', ['b', 'c']).calculate();

        expect(recieved.root).toEqual(expectedRoot);
        expect(recieved.edges).toEqual(expectedEdges);
        expect(recieved.vertices).toEqual(expectedVertices);
    });
});
