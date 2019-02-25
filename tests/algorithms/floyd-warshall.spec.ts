import { FloydWarshall } from 'algorithms/shortest-paths/floyd-warshall';

import Graph from 'models/graph';

import { IPathMatrix } from 'types/paths';

describe('Floyd-Warshall Algorithm', () => {
    test('should set path to the same vertex to 0', () => {
        const edges = [{ src: 'a', dst: 'a', cost: 2 }, { src: 'a', dst: 'a', cost: 3 }];

        const graph = new Graph(edges);

        const expected: IPathMatrix = {
            a: {
                a: { cost: 0, edges: [] }
            }
        };

        const recieved = new FloydWarshall(graph).calculate();

        expect(recieved).toEqual(expected);
    });

    test('should find correct paths when graph does not have cycles', () => {
        const edges = [
            { src: 'a', dst: 'b', cost: 1 },
            { src: 'a', dst: 'c', cost: 6 },
            { src: 'b', dst: 'c', cost: 4 },
            { src: 'b', dst: 'd', cost: 1 },
            { src: 'd', dst: 'c', cost: 1 }
        ];

        const graph = new Graph(edges);

        const expected: IPathMatrix = {
            a: {
                a: { cost: 0, edges: [] },
                b: { cost: 1, edges: [{ src: 'a', dst: 'b', cost: 1 }] },
                c: {
                    cost: 3,
                    edges: [
                        { src: 'a', dst: 'b', cost: 1 },
                        { src: 'b', dst: 'd', cost: 1 },
                        { src: 'd', dst: 'c', cost: 1 }
                    ]
                },
                d: {
                    cost: 2,
                    edges: [{ src: 'a', dst: 'b', cost: 1 }, { src: 'b', dst: 'd', cost: 1 }]
                }
            },
            b: {
                a: { cost: Infinity, edges: [] },
                b: { cost: 0, edges: [] },
                c: {
                    cost: 2,
                    edges: [{ src: 'b', dst: 'd', cost: 1 }, { src: 'd', dst: 'c', cost: 1 }]
                },
                d: { cost: 1, edges: [{ src: 'b', dst: 'd', cost: 1 }] }
            },
            c: {
                a: { cost: Infinity, edges: [] },
                b: { cost: Infinity, edges: [] },
                c: { cost: 0, edges: [] },
                d: { cost: Infinity, edges: [] }
            },
            d: {
                a: { cost: Infinity, edges: [] },
                b: { cost: Infinity, edges: [] },
                c: { cost: 1, edges: [{ src: 'd', dst: 'c', cost: 1 }] },
                d: { cost: 0, edges: [] }
            }
        };

        const recieved = new FloydWarshall(graph).calculate();

        expect(recieved).toEqual(expected);
    });

    test('should find correct paths when graph have not negative cycle', () => {
        const edges = [
            { src: 'a', dst: 'a', cost: 2 },
            { src: 'a', dst: 'b', cost: 8 },
            { src: 'a', dst: 'c', cost: 5 },
            { src: 'b', dst: 'a', cost: 3 },
            { src: 'b', dst: 'c', cost: 4 },
            { src: 'c', dst: 'b', cost: 2 }
        ];

        const graph = new Graph(edges);

        const expected: IPathMatrix = {
            a: {
                a: { cost: 0, edges: [] },
                b: {
                    cost: 7,
                    edges: [{ src: 'a', dst: 'c', cost: 5 }, { src: 'c', dst: 'b', cost: 2 }]
                },
                c: { cost: 5, edges: [{ src: 'a', dst: 'c', cost: 5 }] }
            },
            b: {
                a: { cost: 3, edges: [{ src: 'b', dst: 'a', cost: 3 }] },
                b: { cost: 0, edges: [] },
                c: { cost: 4, edges: [{ src: 'b', dst: 'c', cost: 4 }] }
            },
            c: {
                a: {
                    cost: 5,
                    edges: [{ src: 'c', dst: 'b', cost: 2 }, { src: 'b', dst: 'a', cost: 3 }]
                },
                b: { cost: 2, edges: [{ src: 'c', dst: 'b', cost: 2 }] },
                c: { cost: 0, edges: [] }
            }
        };

        const recieved = new FloydWarshall(graph).calculate();

        expect(recieved).toEqual(expected);
    });
});
