import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../../../services/AuthService';
import { FiPower } from 'react-icons/fi';
import axios from 'axios';
import { Navbar, Nav, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'


export default function NovoAtendido({ history }) {

   const [raz, setRaz] = useState('');
   const [ativo, setAtivo] = useState('');


   async function salvar(event) {
      event.preventDefault();
      AuthService.verificarSeTokenExpirou();
      AuthService.obterNovoAccessToken();
      const token = localStorage.getItem('token');
      const codcli = localStorage.getItem('codcli');

      const atendido = {
         raz: raz,
         ativo: ativo,
         cliente: {
            cod: codcli
         }
      };

      await axios('http://localhost:8080/api/atendidos', {
         method: 'POST',
         data: atendido,
         headers: {
            'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
         }
      })
      history.push('/home');
   }
   return (
      <>
         <Navbar color="light" light expand="md">
            <Nav className="ml-auto" navbar>
               <UncontrolledDropdown align="left" setActiveFromChild>
                  <DropdownToggle tag="a" className="nav-link" caret>
                     Ações
                  </DropdownToggle>
                  <DropdownMenu>
                     <DropdownItem header>Eventos</DropdownItem>
                     <DropdownItem>
                        <Link to="/novo-evento">
                           <p>Novo Evento</p>
                        </Link>
                     </DropdownItem>
                     <DropdownItem>
                        <Link to="/listar">
                           <p>Eventos Registrados</p>
                        </Link>
                     </DropdownItem>
                     <DropdownItem header>Atendidos</DropdownItem>
                     <DropdownItem>
                        <Link to="/novo-atendido">
                           <p>Novo Atendido</p>
                        </Link>
                     </DropdownItem>
                     <DropdownItem>
                        <Link to="/home">
                           <p>Atendidos Registrados</p>
                        </Link>
                     </DropdownItem>
                  </DropdownMenu>
               </UncontrolledDropdown>
               <NavItem>
                  Teste
               </NavItem>
               <NavItem>
                  Teste
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
         <br />
         <div className="row">
            <div className="col-md-4">
               <div align="left" className="container-fluid">
                  <Link to="/home">
                     <button className="btn btn-success">Pagina Inicial</button>
                  </Link>
               </div>
            </div>
            <div className="col-md-4">
               <h3>Novo Atendido</h3>
            </div>
            <br />
         </div>
         <div className="container-fluid">
            <div align="right">
               <Link to="/listar-atendido">
                  <button className="btn btn-success">Atendidos Registrados</button>
               </Link>
            </div>
            <br />
            <form onSubmit={salvar}>
               <div className="form-group">
                  <div className="row">
                     <div className="col-md-6">
                        <label>Razão Social</label>
                        <input
                           className="form-control"
                           value={raz}
                           onChange={event => setRaz(event.target.value)} />
                     </div>
                     <div className="col-md-6">
                        <label>Ativo</label>
                        <input
                           className="form-control"
                           value={ativo}
                           onChange={event => setAtivo(event.target.value)} />
                     </div>
                  </div>
               </div>
               <button type="submit" className="btn btn-primary">Salvar</button>
            </form>
         </div>
      </>
   )

}