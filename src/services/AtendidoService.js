import AuthService from '../services/AuthService';
import axios from 'axios';

let token = '';

async function salvar(atendido) {
   token = await AuthService.verificarSeTokenExpirou();

   await axios('https://crm-tifire-api.herokuapp.com/api/atendidos', {
      method: 'POST',
      data: atendido,
      headers: {
         'Authorization': `bearer ${token}`,
         'Content-Type': 'application/json'
      }
   })
}

async function editar(atendido) {
   token = await AuthService.verificarSeTokenExpirou();

   await axios('https://crm-tifire-api.herokuapp.com/api/atendidos', {
      method: 'PUT',
      data: atendido,
      headers: {
         'Authorization': `bearer ${token}`,
         'Content-Type': 'application/json'
      }
   }).then(() => {
      alert("Atendido editado com sucesso!");

   })
}

async function excluir(cod) {
   try {
      token = await AuthService.verificarSeTokenExpirou();
      await axios(`https://crm-tifire-api.herokuapp.com/api/atendidos/${cod}`, {
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


async function listarAtendidos(filtroPesquisa) {
   token = await AuthService.verificarSeTokenExpirou();

   return await axios('https://crm-tifire-api.herokuapp.com/api/atendidos/listarTodosOsAtendidosPorCodCli', {
      method: 'GET',
      params: {
         codcli: `${filtroPesquisa.codcli}`,
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

async function listarAtendidosSemPaginacao(codcli) {
   token = await AuthService.verificarSeTokenExpirou();
   return await axios('https://crm-tifire-api.herokuapp.com/api/atendidos/listarTodosOsAtendidosPorCodCliSemPaginacao', {
      method: 'GET',
      params: {
         codcli: `${codcli}`,
      },
      headers: {
         'Authorization': `bearer ${token}`,
         'Content-Type': 'application/json'
      }
   }).then((response) => {
      return response;
   })
}

export default { salvar, editar, excluir, listarAtendidos, listarAtendidosSemPaginacao }