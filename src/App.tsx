import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import LiveMap from './pages/LiveMap'
import Incidents from './pages/Incidents'
import Resources from './pages/Resources'
import Weather from './pages/Weather'
import Timeline from './pages/Timeline'
import Alerts from './pages/Alerts'
import Feeds from './pages/Feeds'
import Settings from './pages/Settings'
import Evaluation from './pages/Evaluation'
const router=createBrowserRouter([{path:'/',element:<Layout/>,children:[{index:true,element:<Navigate to="/dashboard" replace/>},{path:'dashboard',element:<Dashboard/>},{path:'map',element:<LiveMap/>},{path:'incidents',element:<Incidents/>},{path:'resources',element:<Resources/>},{path:'weather',element:<Weather/>},{path:'timeline',element:<Timeline/>},{path:'alerts',element:<Alerts/>},{path:'feeds',element:<Feeds/>},
      {path:'evaluation',element:<Evaluation/>},{path:'settings',element:<Settings/>},{path:'*',element:<Navigate to="/dashboard" replace/>}]}])
export default function App(){return <RouterProvider router={router}/>}
