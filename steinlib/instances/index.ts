import * as path from 'path';

import { IInstance } from 'steinlib';

const root = path.join(__dirname, '..', '..');

const B = [
    {
        path: 'steinlib/instances/B/b01.stp',
        optimal: 82,
        name: 'b01'
    },
    {
        path: 'steinlib/instances/B/b02.stp',
        optimal: 83,
        name: 'b02'
    },
    {
        path: 'steinlib/instances/B/b03.stp',
        optimal: 138,
        name: 'b03'
    },
    {
        path: 'steinlib/instances/B/b04.stp',
        optimal: 59,
        name: 'b04'
    },
    {
        path: 'steinlib/instances/B/b05.stp',
        optimal: 61,
        name: 'b05'
    },
    {
        path: 'steinlib/instances/B/b06.stp',
        optimal: 122,
        name: 'b06'
    },
    {
        path: 'steinlib/instances/B/b07.stp',
        optimal: 111,
        name: 'b07'
    },
    {
        path: 'steinlib/instances/B/b08.stp',
        optimal: 104,
        name: 'b08'
    },
    {
        path: 'steinlib/instances/B/b09.stp',
        optimal: 220,
        name: 'b09'
    },
    {
        path: 'steinlib/instances/B/b10.stp',
        optimal: 86,
        name: 'b10'
    },
    {
        path: 'steinlib/instances/B/b11.stp',
        optimal: 88,
        name: 'b11'
    },
    {
        path: 'steinlib/instances/B/b12.stp',
        optimal: 174,
        name: 'b12'
    },
    {
        path: 'steinlib/instances/B/b13.stp',
        optimal: 165,
        name: 'b13'
    },
    {
        path: 'steinlib/instances/B/b14.stp',
        optimal: 235,
        name: 'b14'
    },
    {
        path: 'steinlib/instances/B/b15.stp',
        optimal: 318,
        name: 'b15'
    },
    {
        path: 'steinlib/instances/B/b16.stp',
        optimal: 127,
        name: 'b16'
    },
    {
        path: 'steinlib/instances/B/b17.stp',
        optimal: 131,
        name: 'b17'
    },
    {
        path: 'steinlib/instances/B/b18.stp',
        optimal: 218,
        name: 'b18'
    }
];

export const instances: IInstance[] = [...B].map(instance => ({
    ...instance,
    path: path.join(root, instance.path)
}));
