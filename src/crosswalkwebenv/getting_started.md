(webenv_getting_started)=
# Getting Started with CrosswalkWebEnv

**CrosswalkWebEnv** is a React-based reimplementation of **CrosswalkEnv** for running Crosswalk Task in a web browser. It is not designed to train reinforcement learning models directly. Instead, it provides infrastructure for scalable data collection, enabling web applications to collect human behavioral data in the form of state-action trajectories. The collected data can then be used with CrosswalkEnv for downstream model training, including imitation learning (IL) and inverse reinforcement learning (IRL).

## Installation

`crosswalk-web-env` is provided as a React component and is intended to be used within a React-based project. It requires the following peer dependencies:

- React 19.2.8+
- React DOM 19.2.8+
- styled-components 6.5.2+

The latest stable version can be installed with `npm`:

```bash
npm install crosswalk-web-env
```

## How to Run Crosswalk Task in a Web Browser

A Live Demo is available at [https://crosswalk-task.github.io/demo](https://crosswalk-task.github.io/demo/). You can use the demo to run and interact with Crosswalk Task directly in a web browser without setting up a local React project.

To set up a similar web application, start by creating a minimal React app with [Vite](https://vite.dev/). The following commands generate the boilerplate code and install `crosswalk-web-env`. The example below was tested using Node.js `v22.23.2`, npm `v10.9.8`, [create-vite](https://www.npmjs.com/package/create-vite) `v9.1.2`, and [Vite](https://www.npmjs.com/package/vite) `v8.2.2`.

```bash
npm create vite@9.1.2 demo -- --template react
# ◇  Which linter to use?
# │  ESLint
# │
# ◇  Install with npm and start now?
# │  No

cd demo
npm install
npm install crosswalk-web-env
```

Create a web page for running Crosswalk Task by replacing `demo/src/App.jsx` with the following code:

```jsx
import ExperimentPage from 'crosswalk-web-env';

export default function App() {
  return (
    <ExperimentPage
      subjectId="anonymous"
      sessionId={1}
      maxSeconds={-1}
      localSave={true}
    />
  );
}
```

Start the development server with the following command:

```bash
npm run dev
```

Then open [http://localhost:5173/](http://localhost:5173/) in a web browser. Accessing the root path (`/`) renders the `ExperimentPage` component and allows you to run and interact with Crosswalk Task using the configuration specified above.

```{important}
This minimal setup is intended only as a quick way to run and interact with Crosswalk Task in a web browser. Depending on the project template, the generated application may include boilerplate code, such as global CSS styles, that can interfere with the styles provided by `crosswalk-web-env` and cause unexpected layout or rendering issues. For setting up a data-collection experiment, including participant and session configuration, as well as customization of the page layout and CSS styles, see {ref}`webenv_exp_setup`.
```
