import { useState } from 'react'
import TrackerPage from './features/tracker/TrackerPage'
import Footer from './components/layouts/Footer'
import ToDo from './features/todo/ToDo'
import Home from './features/Home'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
 {/* <TrackerPage/>
 <Footer/> */}
 {/* <ToDo/> */}
 <Routes>
  <Route path='/' element={ <Home/>} />
  <Route path='/tracker' element={<TrackerPage/>} />
  <Route path='/todo' element={<ToDo/>} />
 </Routes>
    </>
  )
}

export default App
