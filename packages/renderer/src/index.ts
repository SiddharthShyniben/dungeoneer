import { DefaultRNG, Cave, Grid, createFilledRegion, generatorId } from "@dungeoneer/core";
import { render } from "./renderer.ts";

const grid = new Grid(100, 100);
const region = createFilledRegion(100, 100);

const rng = new DefaultRNG("seed");
const generator = new Cave(generatorId());

generator.generate(grid, region, rng);

render(grid);