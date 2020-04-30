import React, { useEffect, useState } from 'react';
import AtendidoService from '../../../services/AtendidoService'
import { Link } from 'react-router-dom';
import AuthService from '../../../services/AuthService';
import axios from 'axios';
import { FiEdit, FiPower, FiTrash2 } from 'react-icons/fi';
import Pagination from "react-js-pagination";
import { FormGroup, Modal, ModalHeader, ModalFooter, Label, ModalBody, Input, Navbar, Nav, NavItem, UncontrolledDropdown, Table, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

export default function ListarAtendido({ history }) {
   const [atendidos, setAtendidos] = useState([]);
   const [atendido, setAtendido] = useState({ cod: '', ativo: '', raz: '', cliente: { cod: '' } });

   const [usu, setUsu] = useState('');

   // states para salvar atendidio
   const [raz, setRaz] = useState('');
   const [ativo, setAtivo] = useState('');
   const [cgc, setCgc] = useState('');
   let pag = 0;

   // paginação
   const [totalRegistrosPorPagina, setTotalRegistrosPorPagina] = useState('');
   const [totalRegistros, setTotalRegistros] = useState('');
   const [itemsPorPagina, setItemsPorPagina] = useState('');
   const [totalPaginas, setTotalPaginas] = useState('');
   const [paginaAtual, setPaginaAtual] = useState('');

   // states para modal
   const [modal, setModal] = useState(false);
   const [modalSalvar, setModalSalvar] = useState(false);

   // modals
   const fecharModal = () => setModal(false);
   const abrirModal = () => setModal(true);
   const fecharModalSalvar = () => setModalSalvar(false);
   const abrirModalSalvar = () => setModalSalvar(true);


   function pegarUsuarioLogado() {
      setUsu(localStorage.getItem('usu'));
   }

   async function salvar() {
      const codcli = localStorage.getItem('codcli');
      alert(codcli);
      const atendido = { raz: raz, ativo: ativo, cgc: cgc, cliente: { cod: codcli } };
      await AtendidoService.salvar(atendido);
      setModalSalvar(false);
      listarAtendidos(paginaAtual + 1);
   }

   async function editar() {
      await AtendidoService.editar(atendido);
      listarAtendidos(paginaAtual + 1);
      setModal(false);
   }

   function pegarAtendido(ate) {
    //  alert(ate.cod)
      const codcli = localStorage.getItem('codcli');
      atendido.cod = ate.cod;
      atendido.ativo = ate.ativo;
      atendido.raz = ate.raz;
      atendido.cgc = ate.cgc;
      atendido.cliente.cod = codcli;
      alert(atendido.cliente.cod);
   }

   function setarCodAteParaVazio() {
      localStorage.setItem('codate', '');
   }

   async function listarAtendidos(pagina) {
      const codcli = localStorage.getItem("codcli");
      if (pagina != 0) {
         pag = pagina - 1;
      }

      const filtroPesquisa = {
         codcli: codcli,
         page: pag
      }

      await AtendidoService.listarAtendidos(filtroPesquisa).then(response => {
         setAtendidos(response.data.content);
         setTotalRegistrosPorPagina(response.data.numberOfElements);
         setTotalRegistros(response.data.totalElements);
         setItemsPorPagina(response.data.size);
         setPaginaAtual(response.data.pageable.pageNumber);
         setTotalPaginas(response.data.totalPages);
      }).catch(() => {
         alert("Sua sessão expirou");
         localStorage.clear();
         history.push('/login');
      })

   }

   async function excluir(cod) {
      await AtendidoService.excluir(cod);
      setAtendidos(atendidos.filter(atendido => atendido.cod !== cod));
   }


   useEffect(() => {
      pegarUsuarioLogado();
      listarAtendidos(0);
   }, []);

   return (
      <>
         <Navbar color="light" light expand="md">
            <Nav className="ml-auto" navbar>
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
         <div className="container-fluid">
            <div className="row">
               <div className="col-md-4">
                  <div align="left">
                     <Link to="/home">
                        <button onChange={setarCodAteParaVazio()} className="btn btn-success">Pagina Inicial</button>
                     </Link>
                  </div>
               </div>
               <div className="col-md-4">
                  <h3 align="center">Atendidos Registrados</h3>
               </div>
               <div className="col-md-4" align="right">
                  <button onClick={abrirModalSalvar} className="btn btn-success">Novo Atendido</button>
               </div>
            </div>
         </div>

         <div className="container-fluid">
            <Table striped bordered hover>
               <thead>
                  <tr>
                     <th>Razão Social</th>
                     <th>Cgc</th>
                     <th>Ações</th>
                  </tr>
               </thead>
               <tbody>
                  {atendidos.map(ate => (
                     <tr key={ate.cod}>
                        <td>
                           {ate.raz}
                        </td>
                        <td>
                           {ate.cgc}
                        </td>
                        <td>
                           <button className="btn btn-info" onClick={() => {
                              abrirModal();
                              pegarAtendido(ate)
                           }}><FiEdit size={18} color="white" /></button>
                           <button className="btn btn-danger" onClick={() => excluir(ate.cod)}><FiTrash2 size={18} color="white" /></button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </Table>
            <div className="row">
               <div align="left" className="col-md-5">
                  Mostrando {totalRegistrosPorPagina} de {totalRegistros} registros
               </div>
               <div className="col-md-7">
                  <Pagination itemClass="page-item" linkClass="page-link"
                     activePage={paginaAtual + 1}
                     pageRangeDisplayed={5}
                     itemsCountPerPage={totalRegistrosPorPagina}
                     totalItemsCount={totalRegistros}
                     onChange={listarAtendidos.bind(this)} />
               </div>
            </div>
         </div>

         <Modal isOpen={modal}>
            <ModalHeader>
               Editar Atendido
        </ModalHeader>
            <ModalBody>
               <FormGroup>
                  <Label>Razao Social</Label>
                  <Input value={atendido.raz}
                     onChange={(event) => {
                        atendido.raz = event.target.value;
                        setAtendido({ cod: atendido.cod, raz: atendido.raz, cgc: atendido.cgc, ativo: atendido.ativo, cliente: { cod: atendido.cliente.cod } });
                     }} />
                  <Label>Cgc</Label>
                  <Input value={atendido.cgc}
                     onChange={(event) => {
                        atendido.cgc = event.target.value;
                        setAtendido({ cod: atendido.cod, raz: atendido.raz, cgc: atendido.cgc, ativo: atendido.ativo, cliente: { cod: atendido.cliente.cod } });
                     }} />
                  <Label>Ativo</Label>
                  <Input value={atendido.ativo}
                     onChange={(event) => {
                        atendido.ativo = event.target.value;
                        setAtendido({ cod: atendido.cod, raz: atendido.raz, cgc: atendido.cgc, ativo: atendido.ativo, cliente: { cod: atendido.cliente.cod } });
                     }} />
               </FormGroup>
            </ModalBody>
            <ModalFooter>
               <Link>
                  <button className="btn btn-primary" onClick={() =>
                     editar()}>
                     Editar
                 </button>
               </Link>
               <button className="btn btn-warning" onClick={fecharModal}>
                  Cancelar
               </button>
            </ModalFooter>
         </Modal>



         <Modal isOpen={modalSalvar}>
            <ModalHeader>
               Novo Atendido
        </ModalHeader>
            <ModalBody>
               <FormGroup>
                  <Label>Razao Social</Label>
                  <Input value={raz}
                     onChange={event => setRaz(event.target.value)} />

                  <Label>Cgc</Label>
                  <Input value={cgc}
                     onChange={event => setCgc(event.target.value)} />

                  <Label>Ativo</Label>
                  <Input value={ativo}
                     onChange={event => setAtivo(event.target.value)} />
               </FormGroup>
            </ModalBody>
            <ModalFooter>
               <Link>
                  <button className="btn btn-primary" onClick={() =>
                     salvar()}>
                     Salvar
                 </button>
               </Link>
               <button className="btn btn-warning" onClick={fecharModalSalvar}>
                  Cancelar
               </button>
            </ModalFooter>
         </Modal>
      </>
   )
}

















