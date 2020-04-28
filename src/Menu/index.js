import React, { useState } from 'react';
import AuthService from '../services/AuthService';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'reactstrap'
import {  FiPower } from 'react-icons/fi';

export default function Menu(){
   
    const [usu, setUsu] = useState('');

    setUsu(localStorage.getItem('usu'));
  

    return (
        <>
          <Navbar color="light" light expand="md">
            <Nav className="ml-auto" navbar>
               <NavItem align="left">
                  <Link to="/listar-atendido">
                     <p>Atendidos</p>
                  </Link>
               </NavItem>
               <br />
               <NavItem>
               </NavItem>
               <NavItem>
                  <p>Olá, {usu}</p>
               </NavItem>
               <NavItem>
                  <Link to="/">
                     <button onClick={AuthService.logout}>
                        <FiPower size={18} color="#E02041" />
                     </button>
                  </Link>
               </NavItem>
            </Nav>
         </Navbar>
        </>
    )
}