const configSpoty={    
    url_token:'https://accounts.spotify.com/api/token',
        grant_type:'client_credentials',
        client_id:'bdfbed63b6d24d3db079f2a7c3eb3a37',
        client_secret:'29b35d35b35a44bcadc96885e2efc1c0',
    }


const Aunticacion = async()=>{
    const reponse = await fetch(configSpoty.url_token,{
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded',},
        body:`grant_type=${configSpoty.grant_type}&client_id=${configSpoty.client_id}&client_secret=${configSpoty.client_secret};`,
    });
    console.log(await reponse.json())
}

Aunticacion();