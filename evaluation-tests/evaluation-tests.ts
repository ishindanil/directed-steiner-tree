import * as fs from 'fs';
import * as path from 'path';
import { boundMethod } from 'autobind-decorator';

import { Charikar } from 'algorithms/steiner-tree/charikar';
import { GreedyFlac } from 'algorithms/steiner-tree/greedy-flac';
import { ShortestPathsGreedyFlac } from 'algorithms/steiner-tree/shortest-paths-greedy-flac';
import { Roos } from 'algorithms/steiner-tree/roos';
import { ShortestPaths } from 'algorithms/steiner-tree/shortest-paths';
import { Dynamic } from 'algorithms/steiner-tree/dynamic';

import { IInstanceEvaluationData } from 'evaluation-tests/types';

import { writeVisualPresentation } from 'helpers/visual-presentation';
import { createDirectory } from 'helpers/directory';
import { deepCopyGraph } from 'helpers/graph';

import { Graph } from 'models/graph/graph';

import { buildDirectedInstance, IInstance } from 'steinlib';

import { Vertex } from 'types/vertex';

export class EvaluationTests {
    private static readonly algorithms = [
        // { run: EvaluationTests.runCharikar2, name: 'charikar-2' },
        // { run: EvaluationTests.runCharikar3, name: 'Charikar 3' },
        { run: EvaluationTests.runGreedyFlac, name: 'greedy-flac' },
        { run: EvaluationTests.runShortestPathsGreedyFlac, name: 'shortest-path-greedy-flac' },
        { run: EvaluationTests.runShortestPaths, name: 'shortest-paths' },
        { run: EvaluationTests.runRoos, name: 'roos' }
        // { run: EvaluationTests.runDynamic, name: 'dynamic' },
    ];

    private readonly instances: IInstance[];

    private timeFile: string;
    private costFile: string;
    private rationFile: string;
    private visualDir: string;

    constructor(instances: IInstance[], outputDir: string) {
        this.instances = instances;

        this.timeFile = path.join(outputDir, 'times.csv');
        this.costFile = path.join(outputDir, 'costs.csv');
        this.rationFile = path.join(outputDir, 'ratios.csv');
        this.visualDir = path.join(outputDir, 'visuals');

        createDirectory(outputDir);
        createDirectory(this.visualDir);
    }

    public run() {
        this.writeHeaders();

        this.instances.forEach(this.runInstance);
    }

    @boundMethod
    private runInstance(instance: IInstance) {
        const { graph, root, terminals } = buildDirectedInstance(instance.path);
        const visualsPath = path.join(this.visualDir, instance.name);

        console.log(`Running ${instance.name} instance`);

        writeVisualPresentation(instance.name, graph, path.join(visualsPath, `${instance.name}.png`));

        const times: number[][] = [];
        const costs: number[] = [];
        const ratios: number[] = [];

        EvaluationTests.algorithms.forEach(algorithm => {
            console.log(`Running ${algorithm.name} algorithm for ${instance.name} instance`);

            const graphCopy = deepCopyGraph(graph);

            const hrstart = process.hrtime();
            const steinerTree = algorithm.run(graphCopy, root, terminals);
            const hrend = process.hrtime(hrstart);

            const cost = steinerTree.countCost();

            times.push(hrend);
            costs.push(cost);
            ratios.push(cost / instance.optimal);

            writeVisualPresentation(instance.name, steinerTree, path.join(visualsPath, `${algorithm.name}.png`));
        });

        const evaluationData: IInstanceEvaluationData = {
            name: instance.name,
            n: graph.vertices.size,
            m: graph.edges.size,
            k: terminals.length,
            optimal: instance.optimal,
            times,
            costs,
            ratios
        };

        this.writeInstanceResults(evaluationData);
    }

    private writeHeaders() {
        const algorithmNames = EvaluationTests.algorithms.map(algorithm => algorithm.name);
        const headerItems = ['name', 'n', 'm', 'k', 'optimal', ...algorithmNames];
        const header = headerItems.join(',');

        [this.timeFile, this.costFile, this.rationFile].forEach(path => {
            fs.writeFileSync(path, `${header}\n`);
        });
    }

    private writeInstanceResults({ name, n, m, k, optimal, times, costs, ratios }: IInstanceEvaluationData) {
        const instanceInfo = [name, n, m, k, optimal].join(',');

        const timesInfo = times.map(hrtime => `${hrtime[0]}s ${hrtime[1] / 1000000}ms`).join(',');
        const costsInfo = costs.join(',');
        const ratiosInfo = ratios.map(ratio => ratio.toFixed(3)).join(',');

        fs.appendFileSync(this.timeFile, `${instanceInfo},${timesInfo}\n`);
        fs.appendFileSync(this.costFile, `${instanceInfo},${costsInfo}\n`);
        fs.appendFileSync(this.rationFile, `${instanceInfo},${ratiosInfo}\n`);
    }

    private static runCharikar2(graph: Graph, root: Vertex, terminals: Vertex[]) {
        return new Charikar(graph, root, terminals).calculate(2);
    }

    private static runCharikar3(graph: Graph, root: Vertex, terminals: Vertex[]) {
        return new Charikar(graph, root, terminals).calculate(3);
    }

    private static runGreedyFlac(graph: Graph, root: Vertex, terminals: Vertex[]) {
        return new GreedyFlac(graph, root, terminals).calculate();
    }

    private static runShortestPathsGreedyFlac(graph: Graph, root: Vertex, terminals: Vertex[]) {
        return new ShortestPathsGreedyFlac(graph, root, terminals).calculate();
    }

    private static runShortestPaths(graph: Graph, root: Vertex, terminals: Vertex[]) {
        return new ShortestPaths(graph, root, terminals).calculate();
    }

    private static runRoos(graph: Graph, root: Vertex, terminals: Vertex[]) {
        return new Roos(graph, root, terminals).calculate();
    }

    private static runDynamic(graph: Graph, root: Vertex, terminals: Vertex[]) {
        return new Dynamic(graph, root, terminals).calculate();
    }
}
