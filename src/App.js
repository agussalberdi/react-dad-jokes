import './App.css';
import JokeList from './components/JokeList';

function App() {
  return (
    <div className="App">
      <JokeList maxJokes={10} />
    </div>
  );
}

export default App;
