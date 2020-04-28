import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../../../services/AuthService';
import axios from 'axios';
import { FiEdit, FiPower, FiTrash2 } from 'react-icons/fi';
import Pagination from "react-js-pagination";
import { FormGroup, Modal, ModalHeader, ModalFooter, Label, ModalBody, Input, Navbar, Nav, NavItem, UncontrolledDropdown, Table, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

export default function ListarUsuario() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuario, setUsuario] = useState({ cod: '', usu: '', sen: '', cliente: { cod: '' } });
    // const [usu, setUsu] = useState('');
    const [usu, setUsu] = useState('');
    const [sen, setSen] = useState('');

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


    async function salvar() {
        AuthService.verificarSeTokenExpirou();
        AuthService.obterNovoAccessToken();
        const token = localStorage.getItem('token');
        const codcli = localStorage.getItem('codcli');

        const usuario = {
            usu: usu,
            sen: sen,
            cliente: {
                cod: codcli
            }
        };

        await axios('http://localhost:8080/api/usuarios', {
            method: 'POST',
            data: usuario,
            headers: {
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        setModalSalvar(false);
        getUsuarios(paginaAtual + 1);
    }

    function pegarUsuario(usu) {
        const codcli = localStorage.getItem('codcli');
        usuario.cod = usu.cod;
        usuario.usu = usu.usu;
        usuario.sen = usu.sen;
        usuario.cliente.cod = codcli;
    }

    async function editar() {
        AuthService.verificarSeTokenExpirou();
        AuthService.obterNovoAccessToken();
        const token = localStorage.getItem('token');

        await axios('http://localhost:8080/api/usuarios', {
            method: 'PUT',
            data: usuario,
            headers: {
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(() => {
            alert("Usuario editado com sucesso!");
            getUsuarios(paginaAtual + 1);
            setModal(false);
        })
    }

    async function getUsuarios(pagina) {
        const pag = pagina - 1
        AuthService.verificarSeTokenExpirou();
        AuthService.obterNovoAccessToken();

        const codcli = localStorage.getItem('codcli');
        const token = localStorage.getItem('token');
        const response = await axios('http://localhost:8080/api/usuarios/listarTodosOsUsuariosPorCodCli', {
            method: 'GET',
            params: {
                codcli: `${codcli}`,
                page: `${pag}`
            },
            headers: {
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        setUsuarios(response.data.content);
        setTotalRegistrosPorPagina(response.data.numberOfElements);
        setItemsPorPagina(response.data.size);
        setPaginaAtual(response.data.pageable.pageNumber);
        setTotalPaginas(response.data.totalPages);
    }

    async function excluir(cod) {
        try {
            AuthService.verificarSeTokenExpirou();
            AuthService.obterNovoAccessToken();
            const token = localStorage.getItem('token');
            await axios(`http://localhost:8080/api/usuarios/${cod}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            setUsuarios(usuarios.filter(usuario => usuario.cod !== cod));
        } catch (erro) {
            alert("Erro ao excluir este registro");
        }
    }


    useEffect(() => {
        async function listarUsuarios() {
            AuthService.verificarSeTokenExpirou();
            let token = localStorage.getItem('token');
            if (token == null) {
                AuthService.obterNovoAccessToken();
                token = localStorage.getItem('token');
            }

            const codcli = localStorage.getItem('codcli');
            const response = await axios('http://localhost:8080/api/usuarios/listarTodosOsUsuariosPorCodCli', {
                method: 'GET',
                params: {
                    codcli: `${codcli}`,
                    page: `${0}`
                },
                headers: {
                    'Authorization': `bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            setUsuarios(response.data.content);
            setTotalRegistrosPorPagina(response.data.numberOfElements);
            setTotalRegistros(response.data.totalElements);
            setItemsPorPagina(response.data.size);
            setPaginaAtual(response.data.pageable.pageNumber);
            setTotalPaginas(response.data.totalPages);

        }
        listarUsuarios();
    }, []);

    return (
        <>
            <Navbar color="light" light expand="md">
                <Nav className="ml-auto" navbar>
                    <NavItem>
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
                                <button className="btn btn-success">Pagina Inicial</button>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <h3 align="center">Usuarios Registrados</h3>
                    </div>
                    <div className="col-md-4" align="right">
                        <button onClick={abrirModalSalvar} className="btn btn-success">Novo Usuario</button>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Senha</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usu => (
                            <tr key={usu.cod}>
                                <td>
                                    {usu.usu}
                                </td>
                                <td>
                                    {usu.sen}
                                </td>
                                <td>
                                    <button className="btn btn-info" onClick={() => {
                                        abrirModal();
                                        pegarUsuario(usu)
                                    }}><FiEdit size={18} color="white" /></button>
                                    <button className="btn btn-danger" onClick={() => excluir(usu.cod)}><FiTrash2 size={18} color="white" /></button>
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
                            pageRangeDisplayed={totalPaginas}
                            itemsCountPerPage={2}
                            totalItemsCount={totalRegistrosPorPagina}
                            onChange={getUsuarios.bind(this)} />
                    </div>
                </div>
            </div>

            <Modal isOpen={modal}>
                <ModalHeader>
                    Editar Usuario
        </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>Usuário</Label>
                        <Input value={usuario.usu}
                            onChange={(event) => {
                                usuario.usu = event.target.value;
                                setUsuario({ cod: usuario.cod, usu: usuario.usu, sen: usuario.sen, cliente: { cod: usuario.cliente.cod } });
                            }} />
                        <Label>Ativo</Label>
                        <Input value={usuario.sen}
                            onChange={(event) => {
                                usuario.sen = event.target.value;
                                setUsuario({ cod: usuario.cod, usu: usuario.usu, sen: usuario.sen, cliente: { cod: usuario.cliente.cod } });
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
                    Novo Usuario
        </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>Usuário</Label>
                        <Input value={usu}
                            onChange={event => setUsu(event.target.value)} />
                        <Label>Senha</Label>
                        <Input value={sen}
                            onChange={event => setSen(event.target.value)} />
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

















