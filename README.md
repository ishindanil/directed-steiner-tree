# Directed Steiner Tree.

This project contains implementation of algorithms for directed Steiner tree problem.

## List of implemented algorithms:

- *Charikar algorithm*, from "Approximation algorithms for directed steiner problems" by Charikar et al.
- *Roos algorithm*, from "FasterDSP: A faster approximation algorithm for directed Steiner tree problem" by Hsieh, Ming-I et Al.
- *FLAC, GreedyFlac and ShortestPathGreedyFlac*, described in "A practical Greedy Algorithm for the Directed Steiner Tree problem" by Watel and Weisser
- *ShortestPathsAlgorithm* - simple algorithm, which compute shortest paths from the root to each terminal with Dijkstra's algorithm and includes this paths into result
- *Dynamic* - dynamic programming algorithm for finding the exact solution of directed Steiner tree problem

You can find all this algorithms in `algorithms/steiner-tree`

To run evaluation:
```
npm install
npm run build
npm run evaluate
```
