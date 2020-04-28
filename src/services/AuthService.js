import decode from 'jwt-decode';
import axios from 'axios';

export async function verificarSeTokenExpirou() {
  const token = localStorage.getItem('token');
  try {
    const verificar = decode(token);
    if (verificar.exp < Date.now() / 1000) {

      localStorage.setItem('token', null);

      const headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bGFy');

      const body = 'grant_type=refresh_token';
      return await axios('https://crm-tifire-api.herokuapp.com/oauth/token', {
        method: 'POST',
        data: body,
        headers, withCredentials: true
      }).then((response) => {
        localStorage.setItem('token',response.data.access_token);
        return response.data.access_token;
      });

    } else {
      return token;
    }
  } catch (erro) {
    return erro;
  }
}



export function logout() {
  localStorage.clear();
}

export default { verificarSeTokenExpirou, logout }




