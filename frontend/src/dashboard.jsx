//import Table from "./pages/Table";
//import Menu from "./pages/menu/Menu";
//import Courses from "./pages/Courses";
import NavbarComponent from './components/NavBar';
import {Routes, Route} from 'react-router-dom';
import Cursos from './pages/Courses';

// import Perfil from "./pages/Perfil";
// import {
//   BrowserRouter as Router,
//   Route
// } from "react-router-dom";

// ReactDOM.render(
//   <Router>
//     <Switch>
//       <Route path="/perfil" component={Perfil} />
//       <Route path="/" component={App} />
//     </Switch>
//   </Router>,
//   document.getElementById('root')
// );


function App() {

  return (
    <div>
    
    <NavbarComponent/>
    <Routes>
        
        <Route path="/cursos" element={<Cursos />} />
      </Routes>
    </div>
    
  )
}

export default App
