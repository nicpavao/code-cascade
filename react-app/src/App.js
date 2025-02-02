import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome to Code Cascade.
        </p>
        <p>
          Solve the code. Join the branch. Climb the Leaderboard.
        </p>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://nicpavao.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          More Info
        </a>
      </header>
    </div>
  );
}

export default App;
