# Generation

## Tunnelers

- Basic Tunneler — axis-aligned corridors punched outward from a starting room
- CogMind-style Tunneler — tunneler that tracks corridor history, avoids backtracking, produces more intentional layouts
- Drunkard's Walk — random walk carving, no corridor structure, produces organic sprawl
- Agent-based Digger — multiple simultaneous drunkards with tunable behavior (turn probability, room probability, death conditions)

## Room Placers

- Random Room Placement — attempt placement, reject on overlap, simple but foundational
- BSP Rooms — recursive bisection, rooms fit inside leaves, corridors connect siblings
- Messy BSP — BSP partitions but random walk connectors instead of straight corridors, much more organic feel
- Poisson Disk Rooms — rooms placed with minimum distance separation, more natural distribution than pure random

## Mazes

- Recursive Backtracker — depth-first maze, produces long winding corridors, very few dead ends when pruned
- Prim's Algorithm — grows maze from a seed, more uniform texture than backtracker
- Eller's Algorithm — row-by-row maze generation, memory efficient
- Bob Nystrom's Rooms + Maze — place rooms, fill remaining space with Prim's maze, connect via doors, prune dead ends. One of the best general purpose algorithms

## Cellular Automata

- Standard CA — seed with noise, apply birth/survival rules repeatedly, produces caves
- Multi-pass CA — different rule sets per pass, more controlled cave shapes
- Weighted CA — cells near edges have different thresholds, produces caves that hug boundaries or open toward center

## Noise Based

- Perlin/Simplex Threshold — sample noise, threshold to floor/wall, fast and tunable
- Domain Warped Noise — warp the noise coordinates before sampling, produces dramatically more organic shapes than plain threshold
- Layered Noise — multiple noise passes at different frequencies combined, good for large terrain-like maps

## Graph First

- Brogue-style — design a graph of room connections first with specific topological properties (loops, dead ends, critical path), then embed into space. Brogue specifically targets a certain ratio of cycles to dead ends and places keys/locks on the critical path
- Lock and Key Graph — explicit narrative graph with gate nodes, embed via any layout algorithm. The formal version of what Brogue approximates

## Special Purpose

- City/Buildings — axis-aligned building blocks with streets between them, BSP variant but with street logic instead of corridors
- Dungeon Rooms — interior room subdivision: one large space subdivided by interior walls with doorways, produces building interiors rather than dungeons
- Cavern + Room Hybrid — CA cave pass followed by room stamping into open areas, connections handled by flood fill
- Winding River — single drunkard walk producing a main artery, rooms branching off it, produces linear but organic layouts good for narrative dungeons

# Post-processing

## Connection Strategies

- MST (Kruskal's) — connect every component with minimum total distance, no redundant connections. Good default, guarantees full connectivity with fewest corridors.
- MST + extra edges — MST first, then add k random extra connections. This is your cyclic enrichment at the physical level — more loops, more interesting navigation.
- Nearest neighbor — each component connects only to its single nearest neighbor. Fast, sometimes leaves disconnected clusters. Useful for intentionally isolated regions.

## Carvers

- L-corridor — horizontal then vertical, or vertical then horizontal. Fastest, most artificial looking:
- Drunkard tunnel — biased random walk toward the target. Produces natural-looking connections, especially good between cave regions:
- A* carver — finds shortest path through existing floor/wall, prefers floor cells (so it follows existing corridors where possible). Best for room-based dungeons where you want corridors to feel intentional:
