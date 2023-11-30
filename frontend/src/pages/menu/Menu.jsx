import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './menu.css';
import { Navigate } from 'react-router-dom'; // Importa Navigate en lugar de Redirect

function Menu() {
    const [click, setClick] = useState(true);
    const handleClick = () => setClick(!click);
    const [redirectToCursos, setRedirectToCursos] = useState(false);
const cursos = () => {
    setRedirectToCursos(true);
}
    function activeMenu() {
        handleClick();
        if (click) {

            document.querySelector('.menu-portafolio').classList.remove('active');
            document.querySelector('.dashboard').classList.add('active');
            document.querySelector('.list').classList.add('active');
        } else {
            document.querySelector('.menu-portafolio').classList.add('active');
            document.querySelector('.dashboard').classList.remove('active');
            document.querySelector('.list').classList.remove('active');
        }
    }

 if (redirectToCursos) {
    return <Navigate to="/cursos" />;
  }

    return (
        <div className='menu-portafolio active'>

            <div className="full"><button onClick={activeMenu}><i className="bi bi-arrows-angle-expand"></i></button></div>

            <div>
                <ul className='list'>
                    <li className='menu-item '> <button className='btn1' >  <span> PERFIL  </span>   <i className="bi bi-key-fill">             </i>    </button></li>
                    <li className='menu-item '> <button className='btn1'>  <span> CARRERAS    </span>   <i className="bi bi-list">                 </i>    </button></li>
                    <li className='menu-item '> <button className='btn1' onClick={cursos}>  <span> CURSOS   </span>   <i className="bi bi-browser-edge">         </i>    </button></li>
                </ul>
            </div>

        </div>
    )
}
export default Menu
