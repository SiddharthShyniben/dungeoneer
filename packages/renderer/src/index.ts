import { DefaultRNG, Cave, Grid, generatorId, CompositeGenerator, Connector, NearestNeighborStrategy, DrunkardCarver, runPipeline, DiagonalPartitioner } from "@dungeoneer/core";
import { render } from "./renderer.ts";

const grid = new Grid(200, 100);
const rng = new DefaultRNG("seed");
const partitioner = new DiagonalPartitioner();

const generator = new CompositeGenerator(
    (region, rng) => {
        const regions = partitioner.partition(region, rng);
        return [regions, regions.map((_, i) => i % 2)]
    },
    [new Cave(generatorId()), new Cave(generatorId(), 0.3)]
);

generator.generate(grid, rng);

const pipeline = [
    new Connector(
        new NearestNeighborStrategy(),
        new DrunkardCarver(0.4)
    )
];

runPipeline(grid, rng, pipeline)

render(grid);