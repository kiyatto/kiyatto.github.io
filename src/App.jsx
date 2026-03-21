import './App.css'
import HomeView from './components/HomeView.jsx';
import GraphView from './components/GraphView.jsx';

function App() {
  return (
    <>
      <div className='px-104 py-136 flex flex-row gap-100'>
        <HomeView />
        <GraphView />
      </div>
    </>
  )
}

export default App
