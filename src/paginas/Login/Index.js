import React, { useState } from 'react';
import './login.css';
import axios from 'axios';


export default function Login({ history }){
  const [usu, setUsu] = useState('');
  const [sen, setSen] = useState('');

  async function logar(event) {
    event.preventDefault();
    const headers = new Headers();
    headers.append('gyjContent-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bGFy');
    const body = `username=${usu}&password=${sen}&grant_type=password`;

    const response = await axios('https://crm-tifire-api.herokuapp.com/oauth/token',{
        method: 'POST',
        data: body,
        headers, withCredentials: true });

    const token = response.data;
    localStorage.setItem('token',token.access_token);
    localStorage.setItem('codusu',token.codusu);
    localStorage.setItem('usu',token.usu);
    localStorage.setItem('codcli',token.codcli);
    localStorage.setItem('razcli',token.razcli);
    history.push('/home');

  }

  return (
     <>
     <div className="container">
      <h2>Login</h2>
      <div className="content">
         <form onSubmit={logar}>
            <label htmlFor="raz">Usuário</label>
            <input placeholder="usuário" value={usu} onChange={event => setUsu(event.target.value)}/>

            <label htmlFor="senha">Senha</label>
            <input placeholder="senha" type="password" value={sen} onChange={event => setSen(event.target.value)}/>
            <button className="btn" type="submit">Login</button>
         </form>
      </div>
      </div>
     </>
  )
}