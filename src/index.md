---
hide-toc: true
# firstpage:
# lastpage:
---
<!-- 
```{project-heading}
Crosswalk Task: A naturalistic reinforcement learning paradigm for risky decision-making
``` -->
```{project-heading}
Gymnasium environment for risky decision-making
```

```{video} /_static/videos/crosswalk_task_demo.mp4
:width: 100%
:class: max-width-600
:loop:
:muted:
:playsinline:
:align: center
:autoplay:
```

{.hidden-page-title} 
# Home 

# Crosswalk Task

**Crosswalk Task** is a naturalistic reinforcement learning paradigm for studying risk taking through real-time decision making. Inspired by road-crossing games such as [Crossy Road](https://crossyroadgame.io) and [Frogger](https://en.wikipedia.org/wiki/Frogger), participants cross roads while avoiding collisions with vehicles. The task introduces *crosswalks*, requiring participants to continuously choose between jaywalking as a risk-taking strategy and using crosswalks as a risk-averse strategy.

# CrosswalkEnv [![PyPI version](https://img.shields.io/pypi/v/crosswalk-env.svg)](https://pypi.org/project/crosswalk-env/)

**CrosswalkEnv** is the Python/Gymnasium implementation of the Crosswalk Task. It is designed as an integrated framework for **human behavioral data collection** and **reinforcement learning model training**.

Behavioral experiments with human participants can be launched with a single function call:

```python
from crosswalk_env import task

task.run_session(subj_id=1000, session_id=1, max_seconds=1200)
```

Because **CrosswalkEnv** follows the standard [Gymnasium](https://gymnasium.farama.org/) API. State–action trajectories collected from human participants can be used to fit models using approaches such as imitation learning (IL) and inverse reinforcement learning (IRL). The environment can also be used directly to train and evaluate reinforcement learning agents without human data:

```python
import gymnasium as gym
import crosswalk_env

gym.register_envs(crosswalk_env)
env = gym.make("crosswalk-v1")
for _ in range(5):
    obs, info = env.reset()
    while True:
        # choose an action according to a policy (random policy for demonstration)
        action = env.action_space.sample()
        obs, reward, terminated, truncated, info = env.step(action)
        if terminated or truncated:
            break

env.close()
```

# CrosswalkWebEnv [![npm version](https://img.shields.io/npm/v/crosswalk-web-env.svg)](https://www.npmjs.com/package/crosswalk-web-env)

**CrosswalkWebEnv** is a React-based web implementation of the Crosswalk Task, designed for deploying experiments online and collecting behavioral data at scale. It records state–action trajectories in the same format as **CrosswalkEnv**, allowing collected data to be used directly for downstream model training and analysis, including imitation learning (IL) and inverse reinforcement learning (IRL).

```jsx
import ExperimentPage from 'crosswalk-web-env';

export default function App() {
  return (
    <ExperimentPage subjectId={1000} sessionId={1} maxSeconds={1200} localSave={true} />
  );
}
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
:caption: Crosswalk Task

Task Structure <crosswalktask/tast_structure>
```

```{toctree}
:hidden:
:caption: CrosswalkEnv

Getting Started <crosswalkenv/getting_started>
Observation Space <crosswalkenv/obs_space>
```
<!-- Running Crosswalk Tasks <crosswalkenv/task> -->
<!-- CrosswalkEnv API <crosswalkenv/environment> -->
<!-- Training RL Agents <crosswalkenv/training_agents> -->
<!-- GitHub <https://github.com/crosswalk-task/CrosswalkEnv> -->
<!-- Release Notes <crosswalkenv/release_notes> -->

```{toctree}
:hidden:
:caption: CrosswalkWebEnv

Getting Started <crosswalkwebenv/getting_started>
Experiment Setup <crosswalkwebenv/experiment_setup>
ExperimentPage API <crosswalkwebenv/experiment_page>
Live Demo <https://crosswalk-task.github.io/demo/>
```
<!-- GitHub <https://github.com/crosswalk-task/CrosswalkWebEnv> -->
<!-- Release Notes <crosswalkwebenv/release_notes> -->
