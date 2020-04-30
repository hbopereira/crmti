import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import geral from '../../geral/geral';
import AuthService from '../../services/AuthService';
import EventoService from '../../services/EventoService';
import AtendidoService from '../../services/AtendidoService';

import Pagination from "react-js-pagination";

import { FiTrash2, FiEdit, FiPower } from 'react-icons/fi';

import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
   DatePicker,
   KeyboardDatePicker,
   MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { Table, FormGroup, Modal, ModalHeader, ModalFooter, Label, ModalBody, Navbar, Nav, NavItem } from 'reactstrap'

export default function ListarEvento({history}) {
   // states para configurações gerais 
   const [eventos, setEventos] = useState([]);
   const [atendidos, setAtendidos] = useState([]);
   const [modal, setModal] = useState(false);
   const [modalSalvar, setModalSalvar] = useState(false);
   const [razcli, setRazCli] = useState('');
   const [usu, setUsu] = useState('');

   // state para editar o evento
   const [evento, setEvento] = useState({ cod: '', tex: '', fun: '', dat: '', datage: '', sta: '', filcli: '', atendido: { cod: '' } });

   // states para salvar evento
   const [fun, setFun] = useState('');
   const [tex, setTex] = useState('');
   const [sta, setSta] = useState('');
   const [filCli, setFilCli] = useState('');
   const [dat, setDat] = useState(new Date());
   const [datage, setDatAge] = useState(new Date());

   // state para setar cod do atendido na hora de salvar um evento
   const [codatesal, setCodAteSal] = useState();

   // paginação
   const [totalRegistrosPorPagina, setTotalRegistrosPorPagina] = useState('');
   const [totalRegistros, setTotalRegistros] = useState('');
   const [itemsPorPagina, setItemsPorPagina] = useState('');
   const [totalPaginas, setTotalPaginas] = useState('');
   const [paginaAtual, setPaginaAtual] = useState('');

   //filtros para pesquisa
   const [func, setFunc] = useState('');
   const [razate, setRazAte] = useState('');
   const [status, setStatus] = useState('');
   const [datageini, setDatAgeini] = useState('');
   const [datagefin, setDatAgefin] = useState('');

   // modal
   const fecharModal = () => setModal(false);
   const abrirModal = () => setModal(true);
   const fecharModalSalvar = () => setModalSalvar(false);
   const abrirModalSalvar = () => setModalSalvar(true);

   // state para mostrar botao novo evento
   const [mostraBotaoSalvar, setMostrarBotaoSalvar] = useState();

   // variaveis globais para filtro para receber resultados dos states de filtros
   let formatadorData = new Intl.DateTimeFormat('pt-BR');
   let pag = 0;
   let datageiniformatada = '';
   let datagefinformatada = '';
   let pesquisaStatus = '';
   let pesquisaFunc = '';
   let pesquisaRazAte = '';
   let codate = '';


   function pegarRazaoSocialCliente() {
      setRazCli(localStorage.getItem('razcli'));
   }

   function pegarUsuarioLogado() {
      setUsu(localStorage.getItem('usu'));
   }

   async function salvar() {
      const codate = localStorage.getItem('codate');
      const evento = { tex: tex, fun: fun, sta: sta, filcli: filCli, dat: dat, datage: datage, atendido: { cod: codate } };
      await EventoService.salvar(evento);

      setModalSalvar(false);
      setFun(null);
      setTex(null);
      setFilCli(null)
      setSta(null);
      pesquisar(0);
   }

   async function editar() {
      geral.tratarDatasParaEditar2(evento);
      await EventoService.editar(evento);
      setModal(false);
      pesquisar(paginaAtual + 1);
   }

   async function excluir(cod) {
      await EventoService.excluir(cod);
      setEventos(eventos.filter(evento => evento.cod !== cod));
   }  

   function setarCodAte(codate) {
      localStorage.setItem('codate', codate);
      setMostrarBotaoSalvar(1);
   }


   function pegarEvento(eve) {
      alert("codate: "+eve.codate + " " +eve.cod);
      evento.cod = eve.cod;
      evento.tex = eve.tex;
      evento.fun = eve.fun;
      evento.sta = eve.sta;
      evento.dat = eve.dat;
      evento.datage = eve.datage;
      evento.filcli = eve.filcli;
      evento.atendido.cod = eve.codate;
      alert(evento.datage);
   }

   async function pesquisar(pagina) {
      const codcli = localStorage.getItem('codcli');
      codate = localStorage.getItem('codate');

      if (pagina != 0) {
         pag = pagina - 1;
      }

      if (codate == null) {
         codate = '';
      }

      if (datageini == '' && datagefin == '' || datageini == null && datagefin == null) {
         datageiniformatada = new Date("Mon Apr 13 2000 23:02:37 GMT-0300 (Horário Padrão de Brasília");
         datagefinformatada = new Date();

      } else {
         datageiniformatada = datageini;
         datagefinformatada = datagefin;
      }

      pesquisaStatus = status;

      if (pesquisaStatus == 'Selecione') {
         pesquisaStatus = '';
      }

      pesquisaFunc = func;
      pesquisaRazAte = razate;

      const filtroPesquisa = {
         codcli: codcli,
         codate: codate,
         datageini: datageiniformatada,
         datagefin: datagefinformatada,
         func: pesquisaFunc,
         status: pesquisaStatus,
         razate: pesquisaRazAte,
         page: pag
      }

      await EventoService.pesquisar(filtroPesquisa).then(response => {
         setEventos(response.data.content);
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

   async function listarAtendidosSemPaginacao() {
      const codcli = localStorage.getItem('codcli');
      await AtendidoService.listarAtendidosSemPaginacao(codcli).then(response => {
         setAtendidos(response.data);
      })
   }


   useEffect(() => {
      listarAtendidosSemPaginacao().catch(() => {
         history.push('/');
      });

      setDatAgeini(null);
      setDatAgefin(null);
      pegarRazaoSocialCliente();
      pegarUsuarioLogado();
      pesquisar(0);
   }, []);

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


         <div className="container-fluid">
            <div className="row">
               <div className="col-md-6" align="left">
                  <h4 >{razcli}</h4>
               </div>
               <div className="col-md-6" align="right">
                  <button style={mostraBotaoSalvar ? {} : { display: 'none' }} onClick={abrirModalSalvar} className="btn btn-success">Novo Evento
                  </button>
               </div>
            </div>
         </div>

         <div>
            <div className="row">
               <div className="col-md-5">
               </div>
               <div className="col-md-5">
                  <div align="center">
                     <h3 align="center">Eventos Registrados</h3>
                  </div>
               </div>
            </div>

            <div className="row">
               <div className="col-md-3">
                  <div className="container-fluid">
                  <InputLabel>Data Agendamento</InputLabel>
                     <div className="row">
                        <div className="col-md-6">
                           <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                 margin="normal"
                                 style={{ width: 140 }}
                                 id="date-picker-dialog"
                                 value={datageini}
                                 format='dd/MM/yyyy'
                                 onChange={event => setDatAgeini(event)}
                                 KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                 }}
                              />
                           </MuiPickersUtilsProvider>
                        </div>
                        <div className="col-md-6">
                           <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                 margin="normal"
                                 style={{ width: 140 }}
                                 id="date-picker-dialog"
                                 value={datagefin}
                                 format='dd/MM/yyyy'
                                 onChange={event => setDatAgefin(event)}
                                 KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                 }}
                              />
                           </MuiPickersUtilsProvider>
                        </div>
                     </div>
                     <br />
                     <div>
                        <InputLabel>Atendente</InputLabel>
                        <Input
                           placeholder="Pesquisar..."
                           style={{ width: 300 }}
                           value={func}
                           onChange={event => setFunc(event.target.value)} />
                     </div>
                     <br />
                     <br />
                     <div>
                        <InputLabel>Atendido</InputLabel>
                        <Autocomplete       
                           onChange={(event, value) => {
                              !value ? setRazAte('') : setRazAte(value.raz);
                              !value ? setarCodAte('') : setarCodAte(value.cod);
                           }}
                           style={{ width: 300 }}
                           options={atendidos}
                           getOptionLabel={(option) => option.raz}               
                           renderInput={(params) => <TextField {...params} label="Pesquisar..." margin="normal" />}

                        />
                     </div>
                     <br />
                     <div>
                        <InputLabel>Status Evento</InputLabel>
                        <Select style={{ width: 300 }} value={status} onChange={event => setStatus(event.target.value)}>
                           <option value="Selecione">Selecione</option>
                           <option value="Pendente">Pendente</option>
                           <option value="Concluido">Concluido</option>
                           <option value="Cancelado">Cancelado</option></Select>
                     </div>


                     <br />
                     <button className="btn btn-primary" onClick={() => {
                        pesquisar(0)
                     }}>pesquisar</button>
                  </div>
               </div>
               <div className="col-md-9">
                  <Table striped bordered hover>
                     <thead>
                        <tr>
                           <th>Atendido</th>
                           <th>Inserção</th>
                           <th>Agendado</th>
                           <th>Texto abordado</th>
                           <th>Status</th>
                           <th>Ações</th>
                        </tr>
                     </thead>
                     <tbody>
                        {eventos.map(eve => (
                           <tr key={eve.cod}>
                              <td>{eve.raz}</td>
                              <td>{geral.formatDate2(eve.dat)}</td>
                              <td>{geral.formatDate2(eve.datage)}</td>
                              <td>{eve.tex}</td>
                              <td>{eve.sta}</td>
                              <td>
                                 <button className="btn btn-info" onClick={() => {
                                    abrirModal();
                                    pegarEvento(eve)
                                 }}><FiEdit size={18} color="white" /></button>
                                 <button className="btn btn-danger" onClick={() => excluir(eve.cod)}><FiTrash2 size={18} color="white" /></button>
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
                           onChange={pesquisar.bind(this)} />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <Modal isOpen={modalSalvar}>
            <ModalHeader>
               Novo Evento
        </ModalHeader>
            <ModalBody>
               <FormGroup>
                  <div className="row">
                     <div className="col-md-6">
                        <InputLabel>Data Inserção</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                           <DatePicker
                              timePicker={false}
                              format='dd-MM-yyyy'
                              value={dat}
                              onChange={event => setDat(event)} />
                        </MuiPickersUtilsProvider>
                     </div>
                     <div className="col-md-6">
                        <InputLabel>Data Agendamento</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                           <DatePicker
                              timePicker={false}
                              format='dd-MM-yyyy'
                              value={datage}
                              onChange={event => setDatAge(event)} />
                        </MuiPickersUtilsProvider>
                     </div>
                  </div>
                  <br />
                  <div className="row">
                     <div className="col-md-6">
                        <InputLabel>Atendente</InputLabel>
                        <Input value={fun}
                           onChange={event => setFun(event.target.value)} />
                     </div>
                     <div className="col-md-6">
                        <InputLabel>Assunto Abordado</InputLabel>
                        <Input value={tex}
                           onChange={event => setTex(event.target.value)} />
                     </div>
                  </div>
                  <br />
                  <div className="row">
                     <div className="col-md-6">
                        <InputLabel>Status Evento</InputLabel>
                        <Select value={sta} onChange={event => setSta(event.target.value)} >
                           <option value="Pendente">Pendente</option>
                           <option value="Concluido">Concluido</option>
                           <option value="Cancelado">Cancelado</option></Select>
                     </div>
                     <div className="col-md-6">
                        <InputLabel>Filial Cliente</InputLabel>
                        <Input value={filCli}
                           onChange={event => setFilCli(event.target.value)} />
                     </div>
                  </div>

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

         <Modal isOpen={modal}>
            <ModalHeader>
               Salvar Evento
        </ModalHeader>
            <ModalBody>
               <FormGroup>

                  <div className="row">
                     <div className="col-md-6">
                        <InputLabel>Texto Abordado</InputLabel>
                        <Input value={evento.tex}
                           onChange={(event) => {
                              evento.tex = event.target.value;
                              setEvento({ cod: evento.cod, tex: evento.tex, fun: evento.fun, dat: evento.dat, datage: evento.datage, sta: evento.sta, filcli: evento.filcli, atendido: { cod: evento.atendido.cod } });
                           }} />
                     </div>

                     <div className="col-md-6">
                        <InputLabel>Atendente</InputLabel>
                        <Input value={evento.fun}
                           onChange={(event) => {
                              evento.fun = event.target.value;
                              setEvento({ cod: evento.cod, tex: evento.tex, fun: evento.fun, dat: evento.dat, datage: evento.datage, sta: evento.sta, filcli: evento.filcli, atendido: { cod: evento.atendido.cod } });
                           }} />
                     </div>
                  </div>
                  <br />
                  <div className="row">
                     <div className="col-md-6">
                        <InputLabel>Status Evento</InputLabel>
                        <Select type="select" value={evento.sta}
                           onChange={(event) => {
                              evento.sta = event.target.value;
                              setEvento({ cod: evento.cod, tex: evento.tex, fun: evento.fun, dat: evento.dat, datage: evento.datage, sta: evento.sta, filcli: evento.filcli, atendido: { cod: evento.atendido.cod } });
                           }}>
                           <option value="Pendente">Pendente</option>
                           <option value="Concluido">Concluido</option>
                           <option value="Cancelado">Cancelado</option></Select>
                     </div>

                     <div className="col-md-6">
                        <InputLabel>Filial Cliente</InputLabel>
                        <Input value={evento.filcli}
                           onChange={(event) => {
                              evento.filcli = event.target.value;
                              setEvento({ cod: evento.cod, tex: evento.tex, fun: evento.fun, dat: evento.dat, datage: evento.datage, sta: evento.sta, filcli: evento.filcli, atendido: { cod: evento.atendido.cod } });
                           }} />
                     </div>
                  </div>

               </FormGroup>
            </ModalBody>
            <ModalFooter>
               <div align="center">
                  <Link>
                     <button className="btn btn-primary" onClick={() =>
                        editar()}>
                        Salvar
                 </button>
                  </Link>
                  <button className="btn btn-warning" onClick={fecharModal}>
                     Cancelar
               </button>
               </div>
            </ModalFooter>
         </Modal>
      </>
   )
}

















