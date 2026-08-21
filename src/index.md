---
hide-toc: true
firstpage:
lastpage:
---

```{project-heading}
Gymnasium environment for risky decision-making tasks
```

```{video} /_static/videos/crosswalk_task_demo.mp4
:width: 100%
:class: max-width-600
:loop:
:muted:
:playsinline:
:align: center
```

{.hidden-page-title}
# Home

# CrosswalkEnv

**CrosswalkEnv** is a [Gymnasium](https://gymnasium.farama.org/) environment for studying decision-making under risky pedestrian crossing scenarios. It follows the standard Gymnasium API, where agent–environment interactions generate trajectories of observations, actions, and rewards:

```python
import gymnasium as gym
import crosswalk_env

gym.register_envs(crosswalk_env)

# initialize the environment
env = gym.make("crosswalk-v1")

# run 5 episodes
for _ in range(5):
    # start a new episode and get initial observation
    obs, info = env.reset()
    while True:
        # choose the next action using a policy (randomly sampled for demonstration)
        action = env.action_space.sample()

        # interact with the environment by taking the action and receiving the next observation and reward
        obs, reward, terminated, truncated, info = env.step(action)

        # exit if the episode has ended
        if terminated or truncated:
            break

env.close()
```

# Crosswalk Task

**Crosswalk Task** is a behavioral task built on **CrosswalkEnv** for collecting human decision-making data. Each session records sequential observation–action trajectories, making the resulting data compatible with both conventional behavioral analyses and reinforcement learning-based approaches. Each behavioral session can be launched with a single function call:

```python
from crosswalk_env import task

# practice session (5 minutes)
task.run_session(subj_id=1, session_id=0, max_seconds=300, save=False)

# main session (20 minutes)
task.run_session(subj_id=1, session_id=1, max_seconds=1200)
```

<!-- This documentation provides: -->

<!-- 1. a {ref}`quick start guide <quickstart>` describing the environments and how to get started; -->
<!-- 1. a {ref}`quick start guide <quickstart>` describing the environments and how to get started; -->
<!-- 2. a description of the available {ref}`environments <environments>` and their configuration options;
3. a {ref}`detailed guide <user_guide>` covering the nuts and bolts of the project, and how *you* can contribute. -->

<!-- (index-how-to-cite-this-work)= -->
<!-- # How to cite this work? -->

<!-- If you use this package, please consider citing it with this piece of BibTeX: -->
<!-- TODO: replace with preprint -->

<!-- ```bibtex
@misc{crosswalk-env,
  author = {Jeong, Jinwoo},
  title = {CrosswalkEnv},
  year = {2026},
  publisher = {GitHub},
  journal = {GitHub repository},
  howpublished = {\url{https://github.com/crosswalk-task/CrosswalkEnv}},
}
``` -->

<!-- sections for the main navigation bar -->
```{toctree}
:hidden:
:caption: Getting Started
```

```{toctree}
:hidden:
:caption: Crosswalk Web Env

Getting Started <crosswalkwebenv/getting_started>
ExperimentPage <crosswalkwebenv/experiement_page>
Live Demo <https://crosswalk-task.github.io/demo/>
GitHub <https://github.com/crosswalk-task/CrosswalkWebEnv>
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
