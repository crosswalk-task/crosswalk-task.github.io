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
# │  Yes
cd demo
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

(webenv_setup_exp)=
## How to Set Up an Experiment

The minimal example above can be extended to support a more realistic experimental setup. In a typical experiment, each participant should (1) be assigned a unique subject ID and (2) participate in multiple sessions with different configurations, such as practice and main sessions. This can be implemented conveniently using [React Router](https://reactrouter.com/) by passing the participant's subject ID through a URL query parameter and mapping different URL paths to different experiment configurations.

Using the same project created in the previous section, install React Router:

```bash
npm install react-router@^8.3.0
```

To use React Router features, wrap the `App` component with `BrowserRouter` by replacing `demo/src/main.jsx` with the following code:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

Next, replace `demo/src/App.jsx` with the following code. In this example, the participant's ID is provided through the `subjectId` query parameter, while the URL path determines which session configuration is used.

```jsx
import ExperimentPage from "crosswalk-web-env";
import { Routes, Route, Navigate, useSearchParams } from "react-router";

export default function App() {
  const [searchParams] = useSearchParams();
  // NOTE: If "subjectId" is missing, consider preventing access to main sessions rather than using "anonymous" as a fallback.
  const subjectId = searchParams.get("subjectId") ?? "anonymous";
  return (
    <Routes>
      <Route 
        path="/practice" 
        element={<ExperimentPage sessionId={0} maxSeconds={300} localSave={false} />}
      />
      <Route 
        path="/main/1" 
        element={<ExperimentPage subjectId={subjectId} sessionId={1} maxSeconds={1200} localSave={true} />}
      />
      <Route 
        path="/main/2" 
        element={<ExperimentPage subjectId={subjectId} sessionId={2} maxSeconds={1200} localSave={true} />}
      />
      <Route path="*" element={<Navigate to="/practice" replace />} />
    </Routes>
  );
}
```

This setup defines three experiment sessions with different configurations:

* `/practice` runs a 5-minute practice session (`sessionId={0}`) with local data saving disabled.
* `/main/1` runs the first 20-minute main session (`sessionId={1}`) with local data saving enabled.
* `/main/2` runs the second 20-minute main session (`sessionId={2}`) with local data saving enabled.

In both main sessions, the collected behavioral data are saved locally in files that include the participant's `subjectId` and the corresponding `sessionId`. Because no behavioral data are saved during the practice session, `subjectId` is not required for `/practice`. Any other path is automatically redirected to `/practice`.

Start the development server:

```bash
npm run dev
```

For example, try opening [http://localhost:5173/main/1?subjectId=1000](http://localhost:5173/main/1?subjectId=1000) in a web browser. The path `/main/1` selects the first main-session configuration, while the query parameter `subjectId=1000` assigns `1000` as the participant's subject ID. This value is passed to the `ExperimentPage` component through the `subjectId` prop.

By assigning a different `subjectId` query parameter to each participant and mapping different experiment configurations to different URL paths, the same application can be used for multiple participants and sessions without modifying the application code for each run.
