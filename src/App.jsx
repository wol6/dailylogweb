import TrackerPage from './features/tracker/TrackerPage'
import ToDo from './features/todo/ToDo'
import Home from './features/Home'
import { Route, Routes } from 'react-router-dom'
import ToDoDashBoard from './features/todo/ToDoDashBoard'
import ToDoOverView from './features/todo/ToDoOverView'
import DailyDashboard from './features/dailyreps/DailyDashboard'
import DailyEventsAdd from './features/dailyreps/DailyEventsAdd'
import ViewEvent from './features/dailyreps/ViewEvent'
import TrackerDashBoard from './features/tracker/TrackerDashBoard'
import AddBook from './features/tracker/AddBook'

function App() {

  return (
    <>
 <Routes>
  <Route path='/' element={ <Home/>} />
  <Route path='/tracker' element={ <TrackerDashBoard/>} />
  <Route path='/tracker/addbook' element={<AddBook/>} />
  <Route path='/tracker/viewbook' element={<TrackerPage/>} />
  <Route path='/todo' element={<ToDoDashBoard/>} />
  <Route path='/todo/overview' element={<ToDoOverView/>} />
  <Route path='/todo/add' element={<ToDo/>} />
  <Route path='/dailyrep' element={<DailyDashboard/>} />
  <Route path='/dailyrep/add' element={<DailyEventsAdd/>} />
  <Route path='/dailyrep/view' element={<ViewEvent/>} />
 </Routes>
    </>
  )
}

export default App
