import * as path from 'path';

export const graphVizPath = process.env.GRAPH_VIZ_PATH || '/usr/local/Cellar/graphviz/2.40.1/bin';
export const evaluationOutputPath =
    process.env.EVALUATION_OUTPUT_PATH || path.join(process.cwd(), 'evaluation-results');
