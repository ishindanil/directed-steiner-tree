import * as path from 'path';

import { IInstanceMap } from 'steinlib';

const root = path.join(__dirname, '..');

const B = [
    { path: 'steinlib/instances/B/b01.stp', optimal: 82, name: 'b01' },
    { path: 'steinlib/instances/B/b02.stp', optimal: 83, name: 'b02' },
    { path: 'steinlib/instances/B/b03.stp', optimal: 138, name: 'b03' },
    { path: 'steinlib/instances/B/b04.stp', optimal: 59, name: 'b04' },
    { path: 'steinlib/instances/B/b05.stp', optimal: 61, name: 'b05' },
    { path: 'steinlib/instances/B/b06.stp', optimal: 122, name: 'b06' },
    { path: 'steinlib/instances/B/b07.stp', optimal: 111, name: 'b07' },
    { path: 'steinlib/instances/B/b08.stp', optimal: 104, name: 'b08' },
    { path: 'steinlib/instances/B/b09.stp', optimal: 220, name: 'b09' },
    { path: 'steinlib/instances/B/b10.stp', optimal: 86, name: 'b10' },
    { path: 'steinlib/instances/B/b11.stp', optimal: 88, name: 'b11' },
    { path: 'steinlib/instances/B/b12.stp', optimal: 174, name: 'b12' },
    { path: 'steinlib/instances/B/b13.stp', optimal: 165, name: 'b13' },
    { path: 'steinlib/instances/B/b14.stp', optimal: 235, name: 'b14' },
    { path: 'steinlib/instances/B/b15.stp', optimal: 318, name: 'b15' },
    { path: 'steinlib/instances/B/b16.stp', optimal: 127, name: 'b16' },
    { path: 'steinlib/instances/B/b17.stp', optimal: 131, name: 'b17' },
    { path: 'steinlib/instances/B/b18.stp', optimal: 218, name: 'b18' }
];

const C = [
    { path: 'steinlib/instances/C/c01.stp', optimal: 85, name: 'c01' },
    { path: 'steinlib/instances/C/c02.stp', optimal: 144, name: 'c02' },
    { path: 'steinlib/instances/C/c03.stp', optimal: 754, name: 'c03' },
    { path: 'steinlib/instances/C/c04.stp', optimal: 1079, name: 'c04' },
    { path: 'steinlib/instances/C/c05.stp', optimal: 1579, name: 'c05' },
    { path: 'steinlib/instances/C/c06.stp', optimal: 55, name: 'c06' },
    { path: 'steinlib/instances/C/c07.stp', optimal: 102, name: 'c07' },
    { path: 'steinlib/instances/C/c08.stp', optimal: 509, name: 'c08' },
    { path: 'steinlib/instances/C/c09.stp', optimal: 707, name: 'c09' },
    { path: 'steinlib/instances/C/c10.stp', optimal: 1093, name: 'c10' },
    { path: 'steinlib/instances/C/c11.stp', optimal: 32, name: 'c11' },
    { path: 'steinlib/instances/C/c12.stp', optimal: 46, name: 'c12' },
    { path: 'steinlib/instances/C/c13.stp', optimal: 258, name: 'c13' },
    { path: 'steinlib/instances/C/c14.stp', optimal: 323, name: 'c14' },
    { path: 'steinlib/instances/C/c15.stp', optimal: 556, name: 'c15' },
    { path: 'steinlib/instances/C/c16.stp', optimal: 11, name: 'c16' },
    { path: 'steinlib/instances/C/c17.stp', optimal: 18, name: 'c17' },
    { path: 'steinlib/instances/C/c18.stp', optimal: 113, name: 'c18' },
    { path: 'steinlib/instances/C/c19.stp', optimal: 146, name: 'c19' },
    { path: 'steinlib/instances/C/c20.stp', optimal: 267, name: 'c20' }
];

const D = [
    { path: 'steinlib/instances/D/d01.stp', optimal: 106, name: 'd01' },
    { path: 'steinlib/instances/D/d02.stp', optimal: 220, name: 'd02' },
    { path: 'steinlib/instances/D/d03.stp', optimal: 1565, name: 'd03' },
    { path: 'steinlib/instances/D/d04.stp', optimal: 1935, name: 'd04' },
    { path: 'steinlib/instances/D/d05.stp', optimal: 3250, name: 'd05' },
    { path: 'steinlib/instances/D/d06.stp', optimal: 67, name: 'd06' },
    { path: 'steinlib/instances/D/d07.stp', optimal: 103, name: 'd07' },
    { path: 'steinlib/instances/D/d08.stp', optimal: 1072, name: 'd08' },
    { path: 'steinlib/instances/D/d09.stp', optimal: 1448, name: 'd09' },
    { path: 'steinlib/instances/D/d10.stp', optimal: 2110, name: 'd10' },
    { path: 'steinlib/instances/D/d11.stp', optimal: 29, name: 'd11' },
    { path: 'steinlib/instances/D/d12.stp', optimal: 42, name: 'd12' },
    { path: 'steinlib/instances/D/d13.stp', optimal: 500, name: 'd13' },
    { path: 'steinlib/instances/D/d14.stp', optimal: 667, name: 'd14' },
    { path: 'steinlib/instances/D/d15.stp', optimal: 1116, name: 'd15' },
    { path: 'steinlib/instances/D/d16.stp', optimal: 13, name: 'd16' },
    { path: 'steinlib/instances/D/d17.stp', optimal: 23, name: 'd17' },
    { path: 'steinlib/instances/D/d18.stp', optimal: 223, name: 'd18' },
    { path: 'steinlib/instances/D/d19.stp', optimal: 310, name: 'd19' },
    { path: 'steinlib/instances/D/d20.stp', optimal: 537, name: 'd20' }
];

export const instanceMap: IInstanceMap = {
    B: B.map(instance => ({ ...instance, path: path.join(root, instance.path) })),
    C: C.map(instance => ({ ...instance, path: path.join(root, instance.path) })),
    D: D.map(instance => ({ ...instance, path: path.join(root, instance.path) }))
};
