const configSpoty={    
    url_token:'https://accounts.spotify.com/api/token',
    new_releases:'https://api.spotify.com/v1/browse/new-releases',
    grant_type:'client_credentials',
    client_id:'bdfbed63b6d24d3db079f2a7c3eb3a37',
    client_secret:'29b35d35b35a44bcadc96885e2efc1c0',
    }

const getLocalStorage=(id) =>{
        return JSON.parse(localStorage.getItem(id));
    } 
const setLocalStorage=(id, valor)=>{
        localStorage.setItem(id, JSON.stringify(valor));
    }
const encabezado=()=>{
    token = getLocalStorage('autenticacion');
       return  {
        headers: { 
            'Authorization': `${token.token_type} ${token.access_token}`
          }
       }
    }

const autenticacion = async()=>{
    const respuesta = await fetch(configSpoty.url_token,{
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded',},
        body:`grant_type=${configSpoty.grant_type}&client_id=${configSpoty.client_id}&client_secret=${configSpoty.client_secret}`,
    });
    if(respuesta.status == 200){
        respuestaOjeto = await respuesta.json();
        setLocalStorage('autenticacion', respuestaOjeto);
    }
}

const nuevosLanzamientos = async()=>{
    const respuesta = await fetch(configSpoty.new_releases,{
        headers: encabezado(),
    });
    if(respuesta.status == 200){
        respuestaOjeto = await respuesta.json();
        console.log(respuestaOjeto)
        // setLocalStorage('autenticacion', respuestaOjeto);
    }
}



autenticacion();
nuevosLanzamientos();