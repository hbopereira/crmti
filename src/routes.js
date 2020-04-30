import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './paginas/Login/Index';
import Home from './paginas/Home/Index';
import ListarAtendido from './paginas/Atendido/Listar/index';
import ListarUsuario from './paginas/Usuario/Listar/index';

export default function routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login" exact component={Login} />
                <Route path="/home" component={Home} />
                <Route path="/listar-atendido" component={ListarAtendido} />
                <Route path="/listar-usuario" component={ListarUsuario} />
            </Switch>
        </BrowserRouter>
    )
}