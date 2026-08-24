(task_structure)=
# Task Structure

The Crosswalk Task was designed to elicit risk taking behavior that could reflect participants' trait-level risk taking propensity. 

In each episode, the player navigates through a series of roads while avoiding collisions with cars to maximize the total score.

```{video} /_static/videos/crosswalk_task_demo.mp4
:width: 100%
:class: max-width-600
:loop:
:muted:
:playsinline:
:align: center
:autoplay:
```

## Map Layout

The player starts at the **bottom** of the map and must reach the **top** as quickly as possible.

```{figure} ../_static/images/start_goal.png
:align: center
:width: 70%
```

The dark areas at the left and right ends of the map are **unreachable**. Cars can enter and exit through these areas, but the player cannot enter them.

```{figure} ../_static/images/unreachable.png
:align: center
:width: 80%
```

## Controls

The player can move **UP**, **DOWN**, **LEFT**, or **RIGHT** using either the **arrow keys** or the **WASD keys** on the keyboard. Note that you must **keep the key pressed** until the player reaches the desired position, rather than just tapping it.

```{figure} ../_static/images/control.png
:align: center
:width: 80%
```

## Scores

Every time the player successfully crosses a road, the **basic score** increases in proportion to the vertical distance traveled, at a rate of **50 points per unit distance**.

If the player successfully reaches the top within the 30-second time limit, an additional **bonus score** is awarded. The bonus is calculated as **50 points for each second remaining**.

```{figure} ../_static/images/basic_and_bonus_score.png
:align: center
:width: 70%
```

In the example above, a bonus score of **500 points** (= 50 points × 10 seconds) is added to the basic score of **1200 points** (50 points × 24 rows advanced).

Thus, progressing farther increases the basic score, while reaching the destination as fast as possible results in a larger bonus.

## Episode Termination

One session of the Crosswalk Task consists of repeated **30-second episodes**.

An episode ends when one of the following occurs:

* The player successfully reaches the top of the map.
* The player is run over by a car, resulting in a **Run Over**.
* The 30-second time limit expires, resulting in a **Time Over**.

### Time Over

The player has **30 seconds** to reach the top of the map. The remaining time is continuously displayed on the screen. When fewer than **10 seconds** remain, the timer turns red.

If the player does not reach the goal within the 30-second time limit, the episode ends with a **Time Over**.

```{figure} ../_static/images/time_over_full.png
:align: center
:width: 80%
```

In the example above, the episode ended with a basic score of **450 points** (50 points × 9 rows advanced).

No additional penalty or bonus is applied for a **Time Over**.

### Run Over

When the player makes contact with a car, the episode ends immediately with a **Run Over**.

A penalty is then applied according to the **color of the car** that hit the player.

```{figure} ../_static/images/game_over.png
:align: center
:width: 70%
```

Cars can have one of three traffic-light colors corresponding to different penalty values:

* **Green**: 100-point penalty
* **Yellow**: 500-point penalty
* **Red**: 1000-point penalty

Thus, green car zones have the lowest collision penalty, whereas red car zones have the highest.

```{figure} ../_static/images/road_descriptions.png
:align: center
:width: 70%
```

For each road, all the cars share the same color. Thus, crossing each road involves different levels of risk corresponding to the color of the cars on it.

## Crosswalks

Each road can have **at most one crosswalk**. Some roads contain a crosswalk, while others do not.

Standing **in front of or inside a crosswalk** activates it. When a crosswalk is activated, approaching cars stop before entering the crosswalk and wait for the player to cross safely.

```{video} /_static/videos/crosswalk_activation.mp4
:width: 100%
:class: max-width-600
:loop:
:muted:
:playsinline:
:align: center
:autoplay:
```

Using a crosswalk provides a safer way to cross a road, but locating and activating one may require additional time.

The player can therefore choose between **taking the time to use a crosswalk** (e.g., moving sideways to search for a crosswalk, approaching a visible crosswalk to reduce the risk of collision) and **jaywalking to save time**.

This creates a tradeoff between **safety and speed**: completing the map faster results in a larger bonus, while using safer crossing strategies reduces the risk of collision penalties.

```{admonition} Crosswalk Activation Check
Cars check whether a crosswalk is activated *before entering it*.

Therefore, a car that has already entered the crosswalk continues moving forward even if the crosswalk becomes activated. This allows the car to clear the player's path as quickly as possible rather than stopping inside the crosswalk and blocking it.
```

## Episode Variation

The traffic environment is procedurally varied across episodes to encourage robust decision-making across diverse traffic conditions rather than memorization of a fixed crossing pattern.

The size of the roads (2 vs. 4 lanes) and the location of the crosswalks can vary across episodes.

### Car Variation

Cars on each road can also differ in their **size, width, and speed**, creating diverse traffic situations while preserving the same underlying task structure.

Small cars can have one of 15 different shapes with different widths. A small car occupies only **one lane**, so the player is at risk of collision when occupying the same lane.

```{figure} ../_static/images/small_cars.png
:align: center
:width: 80%
```

Big cars can have one of 4 different shapes with different widths. A big car occupies **two lanes**, so the player is at risk of collision when occupying either lane.

```{figure} ../_static/images/big_cars.png
:align: center
:width: 80%
```

The red boxes surrounding the cars and the player represent their **hitboxes**. A collision occurs when the player's hitbox makes contact with a car's hitbox.

Although the traffic environment varies across episodes, the **goal, controls, and risk–reward structure** remain the same.
