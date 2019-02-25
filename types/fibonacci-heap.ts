import { INode } from '@tyriar/fibonacci-heap';

export interface IFibonacciNodeMap<K, V> {
    [vertex: string]: INode<K, V> | null;
}
