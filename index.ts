import { EvaluataionTests } from 'evaluation-tests';

import { instances } from 'steinlib';

import { evaluationOutputPath } from 'env';

const test = new EvaluataionTests(instances, evaluationOutputPath);
test.run();
