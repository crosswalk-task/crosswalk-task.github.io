(env_getting_started)=
# Getting Started with CrosswalkEnv

**CrosswalkEnv** is a Python/[Gymnasium](https://gymnasium.farama.org/) implementation of the Crosswalk Task for human behavioral data collection and reinforcement learning research. It provides a simple interface for running behavioral experiments while following the standard Gymnasium API for model training and evaluation.

## Installation

The latest stable version can be installed with `pip`:

```bash
pip install crosswalk-env
```

The latest development version can be installed directly from GitHub:

```bash
pip install git+https://github.com/crosswalk-task/CrosswalkEnv.git
```

Note that the development version may contain unstable or unreleased changes.

## How to Run Crosswalk Task Sessions

Crosswalk Task can be run locally using either the Python API or the command-line interface (CLI).

### Python API

Import the `task` module and call `run_session()` to launch a session.

For example, a practice session can be launched without saving the collected data:

```python
from crosswalk_env import task

task.run_session(subj_id=1, session_id=0, max_seconds=300, save=False)
```

A main experimental session can be launched separately using a different configuration:

```python
from crosswalk_env import task

task.run_session(subj_id=1, session_id=1, max_seconds=1200)
```

### Command-Line Interface

Sessions can also be launched from the command line.

For example, a practice session can be launched with:

```bash
python -m crosswalk_env.task \
    --subj-id=1 \
    --session-id=0 \
    --max-seconds=300 \
    --no-save
```

A main experimental session can be launched separately with:

```bash
python -m crosswalk_env.task \
    --subj-id=1 \
    --session-id=1 \
    --max-seconds=1200
```
