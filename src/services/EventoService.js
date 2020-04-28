import AuthService from '../services/AuthService';
import AtendidoService from '../services/AtendidoService';
import axios from 'axios';

let token = '';

export async function salvar(evento) {
   token = await AuthService.verificarSeTokenExpirou();

   await axios('https://crm-tifire-api.herokuapp.com/api/eventos', {
      method: 'POST',
      data: evento,
      headers: {
         'Authorization': `bearer ${token}`,
         'Content-Type': 'application/json'
      }
   }).then(() => {
      alert("Evento Salvo com sucesso!");
   }).catch(() => {
      alert("Erro ao salvar este registro!");
   })
}

async function editar(evento) {
   token = await AuthService.verificarSeTokenExpirou();

   await axios('https://crm-tifire-api.herokuapp.com/api/eventos', {
      method: 'PUT',
      data: evento,
      headers: {
         'Authorization': `bearer ${token}`,
         'Content-Type': 'application/json'
      }
   }).then(() => {
      alert("Evento editado com sucesso!");
   }).catch(() => {
      alert("Erro ao editar este registro!");
   })
}

async function excluir(cod) {
   try {
      token = await AuthService.verificarSeTokenExpirou();
      await axios(`https://crm-tifire-api.herokuapp.com/api/eventos/${cod}`, {
         method: 'DELETE',
         headers: {
            'Authorization': `bearer ${token}`,
            'Content-Type': 'application/json'
         }
      })

   } catch (erro) {
      alert("Erro ao excluir este registro");
   }
}

async function pesquisar(filtroPesquisa) {
   token = await AuthService.verificarSeTokenExpirou();

   return await axios('https://crm-tifire-api.herokuapp.com/api/eventos/listarTodosOsEventosEFiltros', {
      method: 'GET',
      params: {
         codcli: `${filtroPesquisa.codcli}`,
         codate: `${filtroPesquisa.codate}`,
         datageini: `${filtroPesquisa.datageini}`,
         datagefin: `${filtroPesquisa.datagefin}`,
         func: `${filtroPesquisa.func}`,
         status: `${filtroPesquisa.status}`,
         razate: `${filtroPesquisa.razate}`,
         page: `${filtroPesquisa.page}`
      },
      headers: {
         'Authorization': `bearer ${token}`,
         'Content-Type': 'application/json'
      }
   }).then((response) => {
      return response;
   })


}


export default { salvar, editar, excluir, pesquisar }