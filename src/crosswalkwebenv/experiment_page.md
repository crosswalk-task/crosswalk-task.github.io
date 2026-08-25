(webenv_experiment_page)=
# ExperimentPage API

`ExperimentPage` is the main React component provided by `crosswalk-web-env`. It provides an entry screen where participants can review the task instructions and start a Crosswalk Task session, during which multiple episodes are played consecutively without a break.

* Pressing **Instructions** opens the full task instructions.
* Pressing **Start Game** runs a single session according to the configuration specified through the component's props.

```{video} /_static/videos/webenv_two_buttons.mp4
:width: 100%
:class: max-width-400
:autoplay:
:loop:
:muted:
:playsinline:
:align: center
```

This page describes the configuration options available for `ExperimentPage`. For a complete example of setting up a React application using `ExperimentPage`, see {ref}`webenv_getting_started`.

## Props

| Prop          | Type               | Default       | Description                                                                                                                       |
| ------------- | ------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `subjectId`   | `number \| string` | `"anonymous"` | Identifier of the participant associated with the collected data.                                                                 |
| `sessionId`   | `number`           | `1`           | Non-negative integer identifying the experiment session.                                                                          |
| `maxEpisodes` | `number`           | `-1`          | Finite integer specifying the maximum number of episodes allowed in the session. A non-positive value disables the episode limit. |
| `maxSeconds`  | `number`           | `-1`          | Finite integer specifying the maximum session duration in seconds. A non-positive value disables the time limit.                  |
| `localSave`   | `boolean`          | `false`       | Whether episode results are automatically saved locally as ZIP files.                                                             |

```{important}
Props are validated when `ExperimentPage` is rendered. Invalid values prevent the component from rendering and produce an error in the browser's developer console.

At most one of `maxEpisodes` and `maxSeconds` can be enabled at a time. Enable a limit by setting the corresponding prop to a positive integer. The other prop should be omitted or set to a non-positive value. If both are omitted, neither termination limit is enabled.
```

### `subjectId`

```text
Type: string | number
Default: "anonymous"
```
`subjectId` identifies the participant associated with a Crosswalk Task session. It is used only as an identifier in the saved behavioral data and does not affect the task itself. Thus, both string and number values are accepted, with numeric values converted to strings before being stored.
```jsx
<ExperimentPage subjectId="ABC123" />
```
or:
```jsx
<ExperimentPage subjectId={1000} />
```

If no `subjectId` is provided, the default value `"anonymous"` is used. 

For an actual data-collection experiment, assigning a unique `subjectId` to each participant is recommended. See {ref}`webenv_exp_setup` for an example of automatically assigning `subjectId` from a URL query parameter.

### `sessionId`

```text
Type: number
Default: 1
Constraint: non-negative integer
```
`sessionId` identifies a particular experiment session and must be a non-negative integer. It also determines the range of environment seeds used for the episodes within that session.

`ExperimentPage` computes `initialSeed` from `sessionId` as follows:

```text
initialSeed = sessionId * 1000
```

The seed is then incremented by one for each episode within the session:

```text
episodeSeed = initialSeed + n (n ≥ 1)
```

For example:

* `sessionId={0}` for a practice session → episode seeds `1, 2, 3, ...`
* `sessionId={1}` for the first main session → episode seeds `1001, 1002, 1003, ...`
* `sessionId={2}` for the second main session → episode seeds `2001, 2002, 2003, ...`

```{note}
Seed ranges are separated in blocks of 1000 and may overlap if a single session exceeds 1000 episodes. This design assumes that, given practical limits on sustained human attention and performance, participants are unlikely to complete more than 1000 episodes within a single session.
```

### `maxEpisodes`

```text
Type: number
Default: -1
Constraint: finite integer
```

`maxEpisodes` enables session termination based on the number of completed episodes.

When the experimental protocol requires each participant to complete a fixed number of episodes regardless of how long they take, set `maxEpisodes` to a positive integer.

For example, the following configuration limits the session to 10 episodes:

```jsx
<ExperimentPage maxEpisodes={10} />
```

Any non-positive value disables the episode limit. Omitting `maxEpisodes` leaves the episode limit disabled, as its default value is `-1`.

If the episode limit is enabled, the time limit must remain disabled by setting `maxSeconds` to a non-positive value or omitting it.

### `maxSeconds`

```text
Type: number
Default: -1
Constraint: finite integer
```

`maxSeconds` enables session termination based on the total elapsed time of the session, in seconds.

When the experimental protocol requires participants to interact with Crosswalk Task for a fixed amount of time, set `maxSeconds` to a positive integer.

For example, the following configuration limits the session to 20 minutes:

```jsx
<ExperimentPage maxSeconds={1200} />
```

Any non-positive value disables the time limit. Omitting `maxSeconds` leaves the time limit disabled, as its default value is `-1`.

If the time limit is enabled, the episode limit must remain disabled by setting `maxEpisodes` to a non-positive value or omitting it.

Common durations include:

| Duration | `maxSeconds` |
| --- | ---: |
| 5 minutes | `300` |
| 10 minutes | `600` |
| 20 minutes | `1200` |

### `localSave`

```text
Type: boolean
Default: false
```

`localSave` controls whether the behavioral data collected during each episode are automatically saved to the participant's local device.

Set `localSave={true}` to enable automatic saving:

```jsx
<ExperimentPage subjectId="ABC123" sessionId={1} maxEpisodes={5} localSave={true} />
```

```{video} /_static/videos/webenv_localsave.mp4
:width: 100%
:class: max-width-500
:autoplay:
:loop:
:muted:
:playsinline:
:align: center
```
When enabled, the result of each completed episode is saved as a separate ZIP file. The filename is generated from the `subjectId`, `sessionId`, and the environment seed used for that episode. For the example above, the downloaded files are:

* `subject_ABC123_session_1_seed_1001.zip`
* `subject_ABC123_session_1_seed_1002.zip`
* ...
* `subject_ABC123_session_1_seed_1005.zip`

Each ZIP archive contains the episode data as a set of JSON files that record the player's state-action trajectory, rewards, detailed play logs, and the configuration used to generate the episode:

| File | Description |
| --- | --- |
| `actions.json` | Sequence of player actions taken during the episode. |
| `obsList.json` | Sequence of environment observations recorded throughout the episode. |
| `rewards.json` | Sequence of rewards and penalties corresponding to the player's actions. |
| `playInfos.json` | Detailed play logs recorded throughout the episode, including game, map, agent, and nearby-vehicle information. |
| `episodeMetadata.json` | Configuration used to generate the episode, including the environment settings, seed, agent, roads, and vehicles. |
| `manifest.json` | Archive manifest containing `subjectId`, `sessionId`, `episodeSeed`, `createdAt`, `formatVersion`, and the list of included files. |

Omitting `localSave` leaves automatic saving disabled, as its default value is `false`. This is useful for sessions such as practice sessions where the collected behavioral data do not need to be retained.

```{admonition} Server-side data collection
During the experiment used to validate the Crosswalk Task, behavioral data were uploaded to a server through HTTP requests for scalable data collection. However, network failures occasionally caused data loss in that setup, so we do not recommend server-based collection as the *default* data-saving method.

In the current version of `crosswalk-web-env`, `localSave` is the only built-in mechanism for saving participant behavioral data. Because each completed episode is saved directly to the participant's local device, data storage does not require a network connection and avoids the risk of data loss caused by network failures during upload.

If server-based data collection is required for scalability, you can fork the [crosswalk-web-env GitHub repository](https://github.com/crosswalk-task/crosswalk-web-env), set up a server to receive the collected data, and implement custom logic to send episode results to the server through HTTP requests.
```
