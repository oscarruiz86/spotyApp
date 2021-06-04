const configSpoty = {
    url_token: 'https://accounts.spotify.com/api/token',
    url_base: 'https://api.spotify.com/v1',
    url_new_releases: '/browse/new-releases',
    url_artists: '/artists/',
    grant_type: 'client_credentials',
    client_id: 'bdfbed63b6d24d3db079f2a7c3eb3a37',
    client_secret: '29b35d35b35a44bcadc96885e2efc1c0',
    offset:0,
    limit:24
}

const getLocalStorage = (id) => {
    return JSON.parse(localStorage.getItem(id));
}
const setLocalStorage = (id, valor) => {
    localStorage.setItem(id, JSON.stringify(valor));
}
const encabezado = () => {
    token = getLocalStorage('autenticacion');
    return {
        'Authorization': `${token.token_type} ${token.access_token}`
    }
}

const autenticacion = async () => {
    const respuesta = await fetch(configSpoty.url_token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
        body: `grant_type=${configSpoty.grant_type}&client_id=${configSpoty.client_id}&client_secret=${configSpoty.client_secret}`,
    });
    if (respuesta.status == 200) {
        respuestaOjeto = await respuesta.json();
        setLocalStorage('autenticacion', respuestaOjeto);
    }
}


const peticionGet = async (url) => {
    url = `${configSpoty.url_base}${url}`;
    const respuesta = await fetch(url, {
        headers: encabezado(),
    });
    if (respuesta.status == 200) {
        return await respuesta.json();
    }
    return 'error';
}

const nuevosLanzamientos = async (url) => {
    peticion = await peticionGet(url)
    console.log(peticion)
    if (peticion !== "error") {
        covers= peticion.albums.items.map((cover)=>{

            const artists =  cover.artists.map((artist) => {
                    return `<a href="#">${artist.name}</a> &`
            });
            // console.log(cover)
            return`<div class="col-6 col-sm-4 col-lg-2">
            <div class="album">
                <div class="album__cover">
                    <img src="${cover.images.find(image=>image.height===300)?.url}" alt="">
                    <a href="http://dmitryvolkov.me/demo/volna/release.html">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M18.54,9,8.88,3.46a3.42,3.42,0,0,0-5.13,3V17.58A3.42,3.42,0,0,0,7.17,21a3.43,3.43,0,0,0,1.71-.46L18.54,15a3.42,3.42,0,0,0,0-5.92Zm-1,4.19L7.88,18.81a1.44,1.44,0,0,1-1.42,0,1.42,1.42,0,0,1-.71-1.23V6.42a1.42,1.42,0,0,1,.71-1.23A1.51,1.51,0,0,1,7.17,5a1.54,1.54,0,0,1,.71.19l9.66,5.58a1.42,1.42,0,0,1,0,2.46Z"/></svg></a>
                    <span class="album__stat">
                        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3.71,16.29a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21,1,1,0,0,0-.21.33,1,1,0,0,0,.21,1.09,1.15,1.15,0,0,0,.33.21.94.94,0,0,0,.76,0,1.15,1.15,0,0,0,.33-.21,1,1,0,0,0,.21-1.09A1,1,0,0,0,3.71,16.29ZM7,8H21a1,1,0,0,0,0-2H7A1,1,0,0,0,7,8ZM3.71,11.29a1,1,0,0,0-1.09-.21,1.15,1.15,0,0,0-.33.21,1,1,0,0,0-.21.33.94.94,0,0,0,0,.76,1.15,1.15,0,0,0,.21.33,1.15,1.15,0,0,0,.33.21.94.94,0,0,0,.76,0,1.15,1.15,0,0,0,.33-.21,1.15,1.15,0,0,0,.21-.33.94.94,0,0,0,0-.76A1,1,0,0,0,3.71,11.29ZM21,11H7a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2ZM3.71,6.29a1,1,0,0,0-.33-.21,1,1,0,0,0-1.09.21,1.15,1.15,0,0,0-.21.33.94.94,0,0,0,0,.76,1.15,1.15,0,0,0,.21.33,1.15,1.15,0,0,0,.33.21,1,1,0,0,0,1.09-.21,1.15,1.15,0,0,0,.21-.33.94.94,0,0,0,0-.76A1.15,1.15,0,0,0,3.71,6.29ZM21,16H7a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"/></svg> ${cover.total_tracks}</span>
                        
                    </span>
                </div>
                <div class="album__title">
                    <h3><a href="http://dmitryvolkov.me/demo/volna/release.html">${cover.name}</a></h3>
                    <span>${artists}</span>
                </div>
            </div>
        </div>`
        }).join("");
        document.querySelector('#covers').innerHTML += covers;
    }
}

const seleccionArtista = async (id) => {
    const url = `${configSpoty.url_artists}${id}`
    peticion = await peticionGet(url)
    if (peticion !== "error") {
        console.log(peticion)
    }
}

document.querySelector('#paginaMas').addEventListener('click',()=>{
    console.log('hola')
})



// autenticacion();
nuevosLanzamientos(`${configSpoty.url_new_releases}?limit=${configSpoty.limit}`);
// seleccionArtista('3OsRAKCvk37zwYcnzRf5XF')