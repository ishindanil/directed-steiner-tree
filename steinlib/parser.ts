import * as fs from 'fs';

import { IEdge } from 'types/edges';
import { Vertex } from 'types/vertex';

export function parseSteinLibFile(fileName: string) {
    const edges: IEdge[] = [];
    const terminals: Vertex[] = [];

    const fileContent = fs.readFileSync(fileName, 'utf8');
    const lines = fileContent.split('\n');

    while (lines.length > 0) {
        const line = lines.shift();

        if (line === 'SECTION Graph') {
            parseGraphSection();
        }

        if (line === 'SECTION Terminals') {
            parseTerminalsSection();
        }
    }

    return { edges, terminals };

    function parseGraphSection() {
        lines.shift(); // skip number of nodes line
        lines.shift(); // skip number of edges line

        let line = lines.shift();
        while (line !== 'END') {
            const [type, src, dst, cost] = line.split(' ');

            const edge = { src, dst, cost: Number.parseInt(cost) };
            edges.push(edge);

            line = lines.shift();
        }
    }

    function parseTerminalsSection() {
        lines.shift(); // skip number of terminals line

        let line = lines.shift();
        while (line !== 'END') {
            const [type, vertex] = line.split(' ');

            terminals.push(vertex);

            line = lines.shift();
        }
    }
}
