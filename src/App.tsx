import ShowData from './components/ShowData'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/*" element={<ShowData />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
