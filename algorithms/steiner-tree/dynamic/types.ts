import Graph from 'models/graph/graph';

import { Vertex } from 'types/vertex';

export type IFindSteinerTreeFunc = (subset: Vertex[], root: Vertex, visited: Vertex[]) => Graph | null;
