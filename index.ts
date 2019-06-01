import { EvaluationTests } from 'evaluation-tests';

import { instanceMap } from 'steinlib';

import { evaluationOutputPath, evaluationTestSet } from 'env';

const instances = instanceMap[evaluationTestSet];

const test = new EvaluationTests(instances, evaluationOutputPath);
test.run();
