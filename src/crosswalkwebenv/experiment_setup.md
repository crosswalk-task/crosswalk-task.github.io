(webenv_exp_setup)=
# Experiment Setup

In a typical experiment, each participant should (1) be assigned a unique subject ID and (2) participate in multiple sessions with different configurations, such as practice and main sessions. This can be implemented conveniently using [React Router](https://reactrouter.com/) by passing the participant's subject ID through a URL query parameter and mapping different URL paths to different experiment configurations.

## Project Setup

Start by setting up a React app with [Vite](https://vite.dev/). The example below was tested using Node.js `v22.23.2`, npm `v10.9.8`, [create-vite](https://www.npmjs.com/package/create-vite) `v9.1.2`, and [Vite](https://www.npmjs.com/package/vite) `v8.2.2`.

```bash
npm create vite@9.1.2 demo -- --template react
# ◇  Which linter to use?
# │  ESLint
# │
# ◇  Install with npm and start now?
# │  No
```

Install `crosswalk-web-env` and React Router:

```bash
cd demo
npm install
npm install crosswalk-web-env react-router@^8.3.0
```

To use React Router, wrap the `App` component with `BrowserRouter` by replacing `demo/src/main.jsx` with the following code:

```jsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

```{important}
The generated React application may include a global stylesheet, such as `index.css`, that is imported from the application entry point. If you want to apply your own global styles to the application, you can keep or add an import such as `import './index.css'` and modify the stylesheet as needed.

However, global CSS rules may override or interfere with the styles provided by `crosswalk-web-env`, potentially causing unexpected layout or rendering issues. Therefore, unless custom global styling is necessary, we recommend omitting the global stylesheet and using the default styles provided by `crosswalk-web-env`.
```

## Subject Identification

First, configure the application so that the same experiment can be run for different participants. Replace `demo/src/App.jsx` with the following code, which reads the participant's subject ID from the `subjectId` query parameter:

```jsx
import ExperimentPage from "crosswalk-web-env";
import { Routes, Route, useSearchParams } from "react-router";

export default function App() {
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get("subjectId") ?? "anonymous";
  return (
    <Routes>
      <Route
        path="/main/1"
        element={
          <ExperimentPage
            subjectId={subjectId}
            sessionId={1}
            maxSeconds={1200}
            localSave={true}
          />
        }
      />
    </Routes>
  );
}
```

Now start the development server:

```bash
npm run dev
```

For example, open [http://localhost:5173/main/1?subjectId=1000](http://localhost:5173/main/1?subjectId=1000) in a web browser. The query parameter `subjectId=1000` is read by the application and passed to `ExperimentPage` through the `subjectId` prop.

Changing only the query parameter allows the same experiment configuration to be used for different participants without modifying the application code. For example:

```text
http://localhost:5173/main/1?subjectId=1000
http://localhost:5173/main/1?subjectId=1001
http://localhost:5173/main/1?subjectId=1002
```

## Multiple Experiment Sessions

Next, extend the `App` component so that different URL paths correspond to different Crosswalk Task sessions. Replace `demo/src/App.jsx` with the following code:

```jsx
import ExperimentPage from "crosswalk-web-env";
import { Routes, Route, Navigate, useSearchParams } from "react-router";

export default function App() {
  const [searchParams] = useSearchParams();

  // NOTE: If "subjectId" is missing, consider preventing access to
  // main sessions rather than using "anonymous" as a fallback.
  const subjectId = searchParams.get("subjectId") ?? "anonymous";

  return (
    <Routes>
      <Route
        path="/practice"
        element={
          <ExperimentPage
            sessionId={0}
            maxSeconds={300}
            localSave={false}
          />
        }
      />

      <Route
        path="/main/1"
        element={
          <ExperimentPage
            subjectId={subjectId}
            sessionId={1}
            maxSeconds={1200}
            localSave={true}
          />
        }
      />

      <Route
        path="/main/2"
        element={
          <ExperimentPage
            subjectId={subjectId}
            sessionId={2}
            maxSeconds={1200}
            localSave={true}
          />
        }
      />

      <Route path="*" element={<Navigate to="/practice" replace />} />
    </Routes>
  );
}
```

The URL path now determines which experiment session is run:

* `/practice` runs a 5-minute practice session (`sessionId={0}`) with local data saving disabled.
* `/main/1` runs the first 20-minute main session (`sessionId={1}`) with local data saving enabled.
* `/main/2` runs the second 20-minute main session (`sessionId={2}`) with local data saving enabled.

For example,

```text
http://localhost:5173/main/1?subjectId=1000
```

runs the first main session for participant `1000`, whereas

```text
http://localhost:5173/main/2?subjectId=1000
```

runs the second main session for the same participant.

In both main sessions, the collected behavioral data are saved locally in files associated with the participant's `subjectId` and the corresponding `sessionId`. Because behavioral data are not saved during the practice session, `subjectId` is not required for `/practice`. Any unrecognized path is automatically redirected to `/practice`.
