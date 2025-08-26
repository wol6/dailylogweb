import TrackerPage from './features/tracker/TrackerPage'
import ToDo from './features/todo/ToDo'
import Home from './features/Home'
import { Route, Routes } from 'react-router-dom'
import ToDoDashBoard from './features/todo/ToDoDashBoard'
import ToDoOverView from './features/tracker/ToDoOverView'
import DailyDashboard from './features/dailyreps/DailyDashboard'
import DailyEventsAdd from './features/dailyreps/DailyEventsAdd'

function App() {

  return (
    <>
 <Routes>
  <Route path='/' element={ <Home/>} />
  <Route path='/tracker' element={<TrackerPage/>} />
  <Route path='/todo' element={<ToDoDashBoard/>} />
  <Route path='/todo/overview' element={<ToDoOverView/>} />
  <Route path='/todo/add' element={<ToDo/>} />
  <Route path='/dailyrep' element={<DailyDashboard/>} />
  <Route path='/dailyrep/add' element={<DailyEventsAdd/>} />
 </Routes>
    </>
  )
}

export default App
