import ExperimentPage from 'crosswalk-web-env';

export default function App() {
  return (
    <ExperimentPage 
      subjectId="demo"
      sessionId={1}
      maxSeconds={-1}
      localSave={true}
    />
  );
}
