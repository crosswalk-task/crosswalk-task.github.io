(env_obs_space)=
# Observation Space

The environment extracts information available from the current game screen and encodes it as a one-dimensional observation vector.

In the current implementation, the observation space is defined as:

```python
gym.spaces.Box(low=np.zeros(113), high=np.ones(113), dtype=np.float64)
```

The resulting observation has a fixed shape of `(113,)`, uses `float64` values, and is bounded within `[0.0, 1.0]`. Most observations are normalized continuous values, while some are restricted to discrete values or binary values `{0, 1}`.

The observation vector is divided into five groups.

| Indices | Size | Category | Description |
| :-----: | :--: | -------- | ----------- |
| `0–4` | 5 | Temporal and Spatial Context | Remaining time and closeness to map boundary |
| `5–12` | 8 | Nearby Grid Features | Road lanes and crosswalk activation tiles around the agent |
| `13–23` | 11 | Target Road Information | Information about the road the agent is crossing or is about to cross |
| `24–32` | 9 | Crosswalk Location | Relative location of up to three nearby crosswalks |
| `33–112` | 80 | Car Observations | Adjacent tile car occupancy and nearby car information |

For the complete index-by-index reference, see the {ref}`env_full_obs_table`.

---

## Temporal and Spatial Context

**Indices `0–4`**

Temporal and spatial context provides information about the remaining episode time and the agent's position relative to the map boundaries.

### Remaining Time

`obs[0]` represents the normalized amount of time remaining in the episode.

| Value | Meaning |
| :---: | ------- |
| `1.0` | Episode has just started |
| `0.0–1.0` | Normalized remaining time |
| `0.0` | Episode terminated |

A value of `0.0` is used whenever the episode terminates, including both successfully clearing the game and game-over conditions (e.g., Time Over or Run Over).

### Closeness to Map Boundary

`obs[1:5]` describes how close the agent is to the map boundary in each direction.

| Index | Direction |
| ----: | --------- |
| `1` | Up |
| `2` | Down |
| `3` | Right |
| `4` | Left |

The values are discrete values and interpreted as:

| Value | Meaning |
| :---: | ------- |
| `0.0` | No map boundary is visible in that direction |
| `0.0–1.0` | Closeness to the nearest boundary |
| `1.0` | The agent cannot move further in that direction |

These observations serve slightly different purposes depending on direction.
- For `Down`, `Left`, and `Right`, the boundary values help the agent avoid unnecessary movement attempts beyond the reachable area.
- For `Up`, the boundary value serves as an indicator of progress toward the final goal, which is to reach the top of the map.

---

## Nearby Grid Features

**Indices `5–12`**

These observations provide binary information about road lanes and crosswalk activation tiles around the agent. Values corresponding to unreachable rows or tiles are set to `0`.

### Road Lanes

| Index | Position |
| ----: | -------- |
| `5` | Current lane |
| `6` | Next lane (UP) |
| `7` | Previous lane (DOWN) |

Each observation indicates whether cars can appear in the corresponding lane:

```text
0 = cars cannot appear (safe zone or unreachable row)
1 = cars may appear (road)
```

### Crosswalk Activation Tiles

```{list-table}
:header-rows: 0
:widths: 1 1 1

* - 
  - Up (9)
  - 
* - Left (12)
  - Agent (8)
  - Right (11)
* - 
  - Down (10)
  - 
```

Each observation indicates whether the corresponding position is a crosswalk activation tile:

```text
0 = not a crosswalk activation tile (including unreachable tiles)
1 = crosswalk activation tile
```

Crosswalk activation tiles include both the crosswalk tiles within a road and the associated activation tiles in the safe zone. The crosswalk itself also acts as an activation tile, ensuring that it remains activated while the agent is crossing.

---

## Target Road Information

**Indices `13–23`**

The **target road** is the road that the agent is currently crossing or should cross next. These observations summarize its crosswalk visibility, collision penalty, crossing progress, traffic density, and approaching traffic.

Once the agent reaches the top of the map, there is no remaining target road. In this final state, the target-road observations fall back to their default values: all values are `0.0` except `obs[15]`, which is `1.0`.

### Crosswalk Visibility

`obs[13]` indicates whether the crosswalk on the target road is currently visible.

```text
0 = crosswalk not visible
1 = crosswalk visible
```

### Car Penalty

`obs[14]` represents the normalized collision penalty associated with cars on the target road.

```text
0.0 = no target road (top of the map)
0.1 = penalty level 100
0.5 = penalty level 500
1.0 = penalty level 1000
```

The configured penalty levels are normalized by dividing them by the maximum penalty value, `1000`. A larger value therefore indicates a higher risk when crossing the target road.

### Road Crossing Progress

`obs[15]` and `obs[16]` describe the agent's vertical position relative to the target road. These values indicate how many tiles the agent needs to move up or down to leave the road and reach a safe zone.

For `obs[15]`, the distance from the **end** of the road is:

| Value | Meaning |
| ----: | ------- |
| `0.0` | The agent can leave the road after moving **up** one more tile |
| `0.25` | Two upward moves remain |
| `0.5` | Three upward moves remain |
| `0.75` | Four upward moves remain |
| `1.0` | The agent is in the safe zone before entering the road |

For `obs[16]`, the distance from the **start** of the road is:

| Value | Meaning |
| ----: | ------- |
| `0.0` | The agent is in the safe zone before entering the road |
| `0.25` | The agent can leave the road after moving **down** one tile |
| `0.5` | Two downward moves are required |
| `0.75` | Three downward moves are required |
| `1.0` | Four downward moves are required |

Using both values, the agent's progress through the target road can be identified from entry to exit.

### Car Density

`obs[17]` represents the normalized number of cars currently visible on the target road.

All visible cars on the target road are included, regardless of whether they are moving toward or away from the agent. Cars outside the visible screen area are not counted.

The number of visible cars is normalized by the maximum number of cars per road, `6`:

```text
0.0 = no cars visible
0.0–1.0 = normalized visible car count
1.0 = 6 cars visible
```

### Approaching Car Counts

**Indices `18–23`**

These observations represent the number of cars approaching the agent from six relative directions:

```{list-table}
:header-rows: 0
:widths: 1 1 1

* - NW (18)
  -
  - NE (19)
* - W (22)
  - **Agent**
  - E (23)
* - SW (21)
  -
  - SE (20)
```

Cars moving away from the agent are excluded. Each directional count is normalized by the maximum number of cars per road, `6`:

```text
0.0 = no approaching cars in that direction
0.0–1.0 = normalized approaching car count in that direction
1.0 = 6 approaching cars in that direction
```

---

## Crosswalk Location

**Indices `24–32`**

Crosswalk location provides the relative positions of up to three nearby crosswalks. For each crosswalk, three directional closeness values are provided: `Up`, `Right`, and `Left`.

| Crosswalk | Left | Up | Right |
| ---------- | ---: | -: | ----: |
| 3rd Closest | `32` | `30` | `31` |
| 2nd Closest | `29` | `27` | `28` |
| Closest | `26` | `24` | `25` |

The values are interpreted as:

| Value | Meaning |
| :---: | ------- |
| `0.0` | The crosswalk is not visible in that direction |
| `0.0–1.0` | Normalized closeness to the crosswalk |
| `1.0` | The agent is aligned with the crosswalk on the corresponding row or column |

If fewer than three crosswalks are available in the visible area, the unused entries are filled with `0.0`.

```{admonition} Crosswalk Ordering
The entries are assigned by crosswalk, not by road: roads without a crosswalk do not occupy an entry.

For example, if only the 1st and 3rd nearby roads contain visible crosswalks, their information is stored as the **Closest** and **2nd Closest** crosswalks, while the **3rd Closest** entry remains empty.
```

---

## Car Observations

**Indices `33–112`**

Car observations consist of 80 values and are divided into two groups:

1. **Adjacent Tile Car Occupancy (`33–40`)**: 8 binary values indicating whether any part of a car overlaps the tiles surrounding the agent.
2. **Nearby Car Information (`41–112`)**: 72 continuous values describing the position and speed of nearby cars approaching the agent.

Adjacent-tile observations include any car that overlaps a surrounding tile, regardless of its direction of travel. In contrast, the detailed nearby-car observations only include cars *approaching* the agent; cars moving away are ignored.

### Adjacent Tile Car Occupancy

**Indices `33–40`**

These observations indicate whether any part of a car overlaps one of the eight tiles surrounding the agent. The indices are assigned clockwise, starting from the northwest (`NW`) tile.

```{list-table}
:header-rows: 0
:widths: 1 1 1

* - NW (33)
  - N (34)
  - NE (35)
* - W (40)
  - **Agent**
  - E (36)
* - SW (39)
  - S (38)
  - SE (37)
```

Each observation is binary:

```text
0 = no part of a car overlaps the tile
1 = any part of a car overlaps the tile
```

The value is determined by overlap between the tile rectangle and the car hitbox. Even a slight overlap is sufficient for the observation to become `1`; the car does not need to be centered within the tile.

### Nearby Car Information

**Indices `41–112`**

Location and speed of approaching cars are organized by row relative to the agent.

Six rows are represented:

| Relative row | Indices |
| ------------ | ------: |
| 4 rows ahead | `41–52` |
| 3 rows ahead | `53–64` |
| 2 rows ahead | `65–76` |
| 1 row ahead | `77–88` |
| Same row | `89–100` |
| Previous row | `101–112` |

Each row uses the same 12-value structure:

| Offset | Observation |
| -----: | ----------- |
| `+0` | Head closeness (closest left car) |
| `+1` | Tail closeness (closest left car) |
| `+2` | Tail distance (closest left car) |
| `+3` | Speed (closest left car) |
| `+4` | Head closeness (closest right car) |
| `+5` | Tail closeness (closest right car) |
| `+6` | Tail distance (closest right car) |
| `+7` | Speed (closest right car) |
| `+8` | Head closeness (2nd closest left car) |
| `+9` | Tail closeness (2nd closest left car) |
| `+10` | Head closeness (2nd closest right car) |
| `+11` | Tail closeness (2nd closest right car) |

Together, the six rows contribute 72 continuous values (`6 × 12`) to the observation vector.

Approaching cars on each side are sorted by head closeness. Since each lane can contain at most two cars, up to two cars are represented in the observation. Missing car slots are filled with zeros.

#### Head Closeness

Head closeness is computed from the horizontal gap between the **front** of an approaching car and the agent, normalized so that a larger value indicates a closer car.

```text
0.0 = no approaching car in sight
0.0–1.0 = closeness of the car head
1.0 = car head has reached or overlaps the agent's horizontal position
```

As head closeness approaches `1.0`, the car is about to reach the agent. If the agent remains in that lane, it may be run over by the car.

#### Tail Closeness

Tail closeness is computed from the horizontal gap between the **rear** of an approaching car and the agent, normalized so that a larger value indicates a closer tail.

```text
0.0 = no approaching car in sight
0.0–1.0 = closeness of the car tail
1.0 = car tail has reached the agent's horizontal position
```

Tail closeness tracks the rear of the car as it approaches and passes the agent. The value increases as the car tail gets closer to the agent, even before the car begins to overlap horizontally. A value of `1.0` indicates that the car tail has reached the agent's horizontal span and is passing through it.

#### Tail Distance

Tail distance is provided only for the closest car on each side. It represents the normalized distance the car still needs to travel for its tail to clear the agent while the car overlaps the agent horizontally.

```text
0.0 = no horizontal overlap, or the car tail has cleared the agent
0.0–1.0 = normalized remaining distance until the car tail clears the agent
1.0 = maximum remaining distance
```

Tail distance becomes positive when the car begins horizontally overlapping the agent and decreases toward `0.0` as the car passes and its tail clears the agent. A positive value indicates horizontal overlap with the car in the given lane.

#### Speed

Speed is provided only for the closest car on each side. This is sufficient because, even if the second-closest car is configured to be faster, once it catches up to the closest car, it follows directly behind at the same speed as the car in front.

```text
0.0 = no approaching car in sight, or the closest car is stopped
0.0–1.0 = normalized car speed
```

A car waiting in front of an activated crosswalk has a speed value of `0.0`. Even when the speed is `0.0`, the presence and position of the stopped car can still be identified from the corresponding car position observations, such as Head Closeness and Tail Closeness.

For moving cars, the normalized speed is computed as `abs(car_speed) / max_car_speed`.

---

(env_full_obs_table)=
## Full Observation Table

The following table provides the complete index-level definition of the 113-dimensional observation vector, including the meaning and value type of each observation.

| Index | Observation | Type |
| :---: | ----------- | ---- |
|   0 | Remaining Time | Continuous `[0, 1]` |
|   1 | Closeness to Map Boundary (Up) | Discrete `{0, 0.2, 0.4, 0.6, 0.8, 1.0}` |
|   2 | Closeness to Map Boundary (Down) | Discrete `{0, 1}` |
|   3 | Closeness to Map Boundary (Right) | Discrete `{0, 0.2, 0.4, 0.6, 0.8, 1.0}` |
|   4 | Closeness to Map Boundary (Left) | Discrete `{0, 0.2, 0.4, 0.6, 0.8, 1.0}` |
|   5 | Road Row (Current Lane) | Binary `{0, 1}` |
|   6 | Road Row (Next Lane) | Binary `{0, 1}` |
|   7 | Road Row (Previous Lane) | Binary `{0, 1}` |
|   8 | Crosswalk Activation Tile (Current) | Binary `{0, 1}` |
|   9 | Crosswalk Activation Tile (Up) | Binary `{0, 1}` |
|  10 | Crosswalk Activation Tile (Down) | Binary `{0, 1}` |
|  11 | Crosswalk Activation Tile (Right) | Binary `{0, 1}` |
|  12 | Crosswalk Activation Tile (Left) | Binary `{0, 1}` |
|  13 | Target Road - Crosswalk Visibility | Binary `{0, 1}` |
|  14 | Target Road - Car Penalty | Discrete `{0.0, 0.1, 0.5, 1.0}` |
|  15 | Target Road - Distance from the End of the Road | Discrete `{0, 0.25, 0.5, 0.75, 1.0}` |
|  16 | Target Road - Distance from the Start of the Road | Discrete `{0, 0.25, 0.5, 0.75, 1.0}` |
|  17 | Target Road - Car Density | Discrete `{0/6, 1/6, 2/6, 3/6, 4/6, 5/6, 6/6}` |
|  18 | Target Road - Approaching Car Counts (NW) | Discrete `{0/6, 1/6, 2/6, 3/6, 4/6, 5/6, 6/6}` |
|  19 | Target Road - Approaching Car Counts (NE) | Discrete `{0/6, 1/6, 2/6, 3/6, 4/6, 5/6, 6/6}` |
|  20 | Target Road - Approaching Car Counts (SE) | Discrete `{0/6, 1/6, 2/6, 3/6, 4/6, 5/6, 6/6}` |
|  21 | Target Road - Approaching Car Counts (SW) | Discrete `{0/6, 1/6, 2/6, 3/6, 4/6, 5/6, 6/6}` |
|  22 | Target Road - Approaching Car Counts (W) | Discrete `{0/6, 1/6, 2/6, 3/6, 4/6, 5/6, 6/6}` |
|  23 | Target Road - Approaching Car Counts (E) | Discrete `{0/6, 1/6, 2/6, 3/6, 4/6, 5/6, 6/6}` |
|  24 | Closest Crosswalk Closeness (Up) | Continuous `[0, 1]` |
|  25 | Closest Crosswalk Closeness (Right) | Continuous `[0, 1]` |
|  26 | Closest Crosswalk Closeness (Left) | Continuous `[0, 1]` |
|  27 | 2nd Closest Crosswalk Closeness (Up) | Continuous `[0, 1]` |
|  28 | 2nd Closest Crosswalk Closeness (Right) | Continuous `[0, 1]` |
|  29 | 2nd Closest Crosswalk Closeness (Left) | Continuous `[0, 1]` |
|  30 | 3rd Closest Crosswalk Closeness (Up) | Continuous `[0, 1]` |
|  31 | 3rd Closest Crosswalk Closeness (Right) | Continuous `[0, 1]` |
|  32 | 3rd Closest Crosswalk Closeness (Left) | Continuous `[0, 1]` |
|  33 | Adjacent Tile Car Occupancy (NW) | Binary `{0, 1}` |
|  34 | Adjacent Tile Car Occupancy (N) | Binary `{0, 1}` |
|  35 | Adjacent Tile Car Occupancy (NE) | Binary `{0, 1}` |
|  36 | Adjacent Tile Car Occupancy (E) | Binary `{0, 1}` |
|  37 | Adjacent Tile Car Occupancy (SE) | Binary `{0, 1}` |
|  38 | Adjacent Tile Car Occupancy (S) | Binary `{0, 1}` |
|  39 | Adjacent Tile Car Occupancy (SW) | Binary `{0, 1}` |
|  40 | Adjacent Tile Car Occupancy (W) | Binary `{0, 1}` |
|  41 | Head Closeness (4 rows ahead, closest left car) | Continuous `[0, 1]` |
|  42 | Tail Closeness (4 rows ahead, closest left car) | Continuous `[0, 1]` |
|  43 | Tail Distance (4 rows ahead, closest left car) | Continuous `[0, 1]` |
|  44 | Speed (4 rows ahead, closest left car) | Continuous `[0, 1]` |
|  45 | Head Closeness (4 rows ahead, closest right car) | Continuous `[0, 1]` |
|  46 | Tail Closeness (4 rows ahead, closest right car) | Continuous `[0, 1]` |
|  47 | Tail Distance (4 rows ahead, closest right car) | Continuous `[0, 1]` |
|  48 | Speed (4 rows ahead, closest right car) | Continuous `[0, 1]` |
|  49 | Head Closeness (4 rows ahead, 2nd closest left car) | Continuous `[0, 1]` |
|  50 | Tail Closeness (4 rows ahead, 2nd closest left car) | Continuous `[0, 1]` |
|  51 | Head Closeness (4 rows ahead, 2nd closest right car) | Continuous `[0, 1]` |
|  52 | Tail Closeness (4 rows ahead, 2nd closest right car) | Continuous `[0, 1]` |
|  53 | Head Closeness (3 rows ahead, closest left car) | Continuous `[0, 1]` |
|  54 | Tail Closeness (3 rows ahead, closest left car) | Continuous `[0, 1]` |
|  55 | Tail Distance (3 rows ahead, closest left car) | Continuous `[0, 1]` |
|  56 | Speed (3 rows ahead, closest left car) | Continuous `[0, 1]` |
|  57 | Head Closeness (3 rows ahead, closest right car) | Continuous `[0, 1]` |
|  58 | Tail Closeness (3 rows ahead, closest right car) | Continuous `[0, 1]` |
|  59 | Tail Distance (3 rows ahead, closest right car) | Continuous `[0, 1]` |
|  60 | Speed (3 rows ahead, closest right car) | Continuous `[0, 1]` |
|  61 | Head Closeness (3 rows ahead, 2nd closest left car) | Continuous `[0, 1]` |
|  62 | Tail Closeness (3 rows ahead, 2nd closest left car) | Continuous `[0, 1]` |
|  63 | Head Closeness (3 rows ahead, 2nd closest right car) | Continuous `[0, 1]` |
|  64 | Tail Closeness (3 rows ahead, 2nd closest right car) | Continuous `[0, 1]` |
|  65 | Head Closeness (2 rows ahead, closest left car) | Continuous `[0, 1]` |
|  66 | Tail Closeness (2 rows ahead, closest left car) | Continuous `[0, 1]` |
|  67 | Tail Distance (2 rows ahead, closest left car) | Continuous `[0, 1]` |
|  68 | Speed (2 rows ahead, closest left car) | Continuous `[0, 1]` |
|  69 | Head Closeness (2 rows ahead, closest right car) | Continuous `[0, 1]` |
|  70 | Tail Closeness (2 rows ahead, closest right car) | Continuous `[0, 1]` |
|  71 | Tail Distance (2 rows ahead, closest right car) | Continuous `[0, 1]` |
|  72 | Speed (2 rows ahead, closest right car) | Continuous `[0, 1]` |
|  73 | Head Closeness (2 rows ahead, 2nd closest left car) | Continuous `[0, 1]` |
|  74 | Tail Closeness (2 rows ahead, 2nd closest left car) | Continuous `[0, 1]` |
|  75 | Head Closeness (2 rows ahead, 2nd closest right car) | Continuous `[0, 1]` |
|  76 | Tail Closeness (2 rows ahead, 2nd closest right car) | Continuous `[0, 1]` |
|  77 | Head Closeness (1 row ahead, closest left car) | Continuous `[0, 1]` |
|  78 | Tail Closeness (1 row ahead, closest left car) | Continuous `[0, 1]` |
|  79 | Tail Distance (1 row ahead, closest left car) | Continuous `[0, 1]` |
|  80 | Speed (1 row ahead, closest left car) | Continuous `[0, 1]` |
|  81 | Head Closeness (1 row ahead, closest right car) | Continuous `[0, 1]` |
|  82 | Tail Closeness (1 row ahead, closest right car) | Continuous `[0, 1]` |
|  83 | Tail Distance (1 row ahead, closest right car) | Continuous `[0, 1]` |
|  84 | Speed (1 row ahead, closest right car) | Continuous `[0, 1]` |
|  85 | Head Closeness (1 row ahead, 2nd closest left car) | Continuous `[0, 1]` |
|  86 | Tail Closeness (1 row ahead, 2nd closest left car) | Continuous `[0, 1]` |
|  87 | Head Closeness (1 row ahead, 2nd closest right car) | Continuous `[0, 1]` |
|  88 | Tail Closeness (1 row ahead, 2nd closest right car) | Continuous `[0, 1]` |
|  89 | Head Closeness (current row, closest left car) | Continuous `[0, 1]` |
|  90 | Tail Closeness (current row, closest left car) | Continuous `[0, 1]` |
|  91 | Tail Distance (current row, closest left car) | Continuous `[0, 1]` |
|  92 | Speed (current row, closest left car) | Continuous `[0, 1]` |
|  93 | Head Closeness (current row, closest right car) | Continuous `[0, 1]` |
|  94 | Tail Closeness (current row, closest right car) | Continuous `[0, 1]` |
|  95 | Tail Distance (current row, closest right car) | Continuous `[0, 1]` |
|  96 | Speed (current row, closest right car) | Continuous `[0, 1]` |
|  97 | Head Closeness (current row, 2nd closest left car) | Continuous `[0, 1]` |
|  98 | Tail Closeness (current row, 2nd closest left car) | Continuous `[0, 1]` |
|  99 | Head Closeness (current row, 2nd closest right car) | Continuous `[0, 1]` |
| 100 | Tail Closeness (current row, 2nd closest right car) | Continuous `[0, 1]` |
| 101 | Head Closeness (previous row, closest left car) | Continuous `[0, 1]` |
| 102 | Tail Closeness (previous row, closest left car) | Continuous `[0, 1]` |
| 103 | Tail Distance (previous row, closest left car) | Continuous `[0, 1]` |
| 104 | Speed (previous row, closest left car) | Continuous `[0, 1]` |
| 105 | Head Closeness (previous row, closest right car) | Continuous `[0, 1]` |
| 106 | Tail Closeness (previous row, closest right car) | Continuous `[0, 1]` |
| 107 | Tail Distance (previous row, closest right car) | Continuous `[0, 1]` |
| 108 | Speed (previous row, closest right car) | Continuous `[0, 1]` |
| 109 | Head Closeness (previous row, 2nd closest left car) | Continuous `[0, 1]` |
| 110 | Tail Closeness (previous row, 2nd closest left car) | Continuous `[0, 1]` |
| 111 | Head Closeness (previous row, 2nd closest right car) | Continuous `[0, 1]` |
| 112 | Tail Closeness (previous row, 2nd closest right car) | Continuous `[0, 1]` |
