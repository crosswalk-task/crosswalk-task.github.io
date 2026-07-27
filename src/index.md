---
hide-toc: true
firstpage:
lastpage:
---

```{project-heading}
Gymnasium environment for risky decision-making tasks
```

```{video} _static/videos/crosswalk_task_demo.mp4
:width: 500
:autoplay:
:loop:
:muted:
:playsinline:
:align: center
```

**CrosswalkEnv** is a [Gymnasium](https://gymnasium.farama.org/) environment for studying decision-making under risky pedestrian crossing scenarios.

**Crosswalk Task** is a behavioral task for collecting human decision-making data in **CrosswalkEnv**, providing sequential state–action trajectories through the Gymnasium interface. Unlike traditional trial-based behavioral tasks that yield only aggregate behavioral measures, it supports both conventional behavioral analyses and reinforcement learning-based approaches.

```python
import gymnasium as gym
import crosswalk_env

gym.register_envs(crosswalk_env)

# initialize the gymnasium environment
env = gym.make("crosswalk-v1")

# simulate 5 episodes
for _ in range(5):
    # start a new episode and get initial observation
    obs, info = env.reset()
    while True:
        # choose the next action based on the current policy
        action = env.action_space.sample()

        # transition through the environment with the action to receive the next observation and reward
        obs, reward, terminated, truncated, info = env.step(action)

        # exit if the episode has ended
        if terminated or truncated:
            break

env.close()
```

<!-- This documentation provides: -->

<!-- 1. a {ref}`quick start guide <quickstart>` describing the environments and how to get started; -->
<!-- 1. a {ref}`quick start guide <quickstart>` describing the environments and how to get started; -->
<!-- 2. a description of the available {ref}`environments <environments>` and their configuration options;
3. a {ref}`detailed guide <user_guide>` covering the nuts and bolts of the project, and how *you* can contribute. -->

(index-how-to-cite-this-work)=
# How to cite this work?

If you use this package, please consider citing it with this piece of BibTeX:
<!-- TODO: replace with published paper -->

```bibtex
@misc{crosswalk-env,
  author = {Jeong, Jinwoo},
  title = {CrosswalkEnv},
  year = {2026},
  publisher = {GitHub},
  journal = {GitHub repository},
  howpublished = {\url{https://github.com/crosswalk-task/CrosswalkEnv}},
}
```

<!-- sections for the main navigation bar -->
```{toctree}
:hidden:
:caption: Getting Started
```

```{toctree}
:hidden:
:caption: Development

GitHub <https://github.com/crosswalk-task/CrosswalkEnv>
release_notes/index
```

<!-- ```{toctree}
:hidden:
:caption: Getting Started

installation
quickstart
```

```{toctree}
:hidden:
:caption: Environments

environments/index
```

```{toctree}
:hidden:
:caption: User Guide

content/algorithms
user_guide
faq
```

```{toctree}
:hidden:
:caption: Reference

List of Publications <content/publications>
bibliography/index
```

```{toctree}
:hidden:
:caption: Development

GitHub <https://github.com/Farama-Foundation/HighwayEnv>
release_notes/index
Contribute to the Docs <https://github.com/Farama-Foundation/HighwayEnv/blob/main/CONTRIBUTING.md>
``` -->
