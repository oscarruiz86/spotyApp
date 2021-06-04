const configSpoty = {
    url_token: 'https://accounts.spotify.com/api/token',
    url_base: 'https://api.spotify.com/v1',
    url_new_releases: '/browse/new-releases',
    url_artists: '/artists/',
    url_albums: '/albums/',
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


const peticionGet = async (urlComplemento) => {
    url = `${configSpoty.url_base}${urlComplemento}`;
    const respuesta = await fetch(url, {
        headers: encabezado(),
    });
    if (respuesta.status == 200) {
        return await respuesta.json();
    } else if(respuesta.status == 401){
      autenticacion().then(()=>{
        peticionGet(urlComplemento)
      })
      
    } else{
        return 'error';
    }    
}

const nuevosLanzamientos = async (url) => {
    peticion = await peticionGet(url)
    if (peticion !== "error") {
        const covers= peticion.albums.items.map((cover)=>{
            const artists =  cover.artists.map((artist) => {
                    return `<a href="#">${artist.name}</a>`
            }).join(" & ");
            // console.log(cover)
            return`<div class="col-6 col-sm-4 col-lg-2">
            <div class="album">
                <div class="album__cover">
                    <img src="${cover.images.find(image=>image.height===300)?.url}" alt="">
                    <a href="release.html?id=${cover.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M18.54,9,8.88,3.46a3.42,3.42,0,0,0-5.13,3V17.58A3.42,3.42,0,0,0,7.17,21a3.43,3.43,0,0,0,1.71-.46L18.54,15a3.42,3.42,0,0,0,0-5.92Zm-1,4.19L7.88,18.81a1.44,1.44,0,0,1-1.42,0,1.42,1.42,0,0,1-.71-1.23V6.42a1.42,1.42,0,0,1,.71-1.23A1.51,1.51,0,0,1,7.17,5a1.54,1.54,0,0,1,.71.19l9.66,5.58a1.42,1.42,0,0,1,0,2.46Z"/></svg></a>
                    <span class="album__stat">
                        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3.71,16.29a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21,1,1,0,0,0-.21.33,1,1,0,0,0,.21,1.09,1.15,1.15,0,0,0,.33.21.94.94,0,0,0,.76,0,1.15,1.15,0,0,0,.33-.21,1,1,0,0,0,.21-1.09A1,1,0,0,0,3.71,16.29ZM7,8H21a1,1,0,0,0,0-2H7A1,1,0,0,0,7,8ZM3.71,11.29a1,1,0,0,0-1.09-.21,1.15,1.15,0,0,0-.33.21,1,1,0,0,0-.21.33.94.94,0,0,0,0,.76,1.15,1.15,0,0,0,.21.33,1.15,1.15,0,0,0,.33.21.94.94,0,0,0,.76,0,1.15,1.15,0,0,0,.33-.21,1.15,1.15,0,0,0,.21-.33.94.94,0,0,0,0-.76A1,1,0,0,0,3.71,11.29ZM21,11H7a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2ZM3.71,6.29a1,1,0,0,0-.33-.21,1,1,0,0,0-1.09.21,1.15,1.15,0,0,0-.21.33.94.94,0,0,0,0,.76,1.15,1.15,0,0,0,.21.33,1.15,1.15,0,0,0,.33.21,1,1,0,0,0,1.09-.21,1.15,1.15,0,0,0,.21-.33.94.94,0,0,0,0-.76A1.15,1.15,0,0,0,3.71,6.29ZM21,16H7a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"/></svg> ${cover.total_tracks}</span>
                        
                    </span>
                </div>
                <div class="album__title">
                    <h3><a href="release.html?id=${cover.id}">${cover.name}</a></h3>
                    <span>${artists}</span>
                </div>
            </div>
        </div>`
        }).join("");
        document.querySelector('#covers').innerHTML += covers;
    }
}

const seleccionAlbum = async (id) => {
    const url = `${configSpoty.url_albums}${id}`
    peticion = await peticionGet(url)
    if (peticion !== "error") {

        const coverAlbum = `<div class="release__cover">
        <img src="${peticion.images.find(imagen => imagen.height === 640)?.url}" alt="">
            </div>
            <div class="release__stat">
                <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.65,2.24a1,1,0,0,0-.8-.23l-13,2A1,1,0,0,0,7,5V15.35A3.45,3.45,0,0,0,5.5,15,3.5,3.5,0,1,0,9,18.5V10.86L20,9.17v4.18A3.45,3.45,0,0,0,18.5,13,3.5,3.5,0,1,0,22,16.5V3A1,1,0,0,0,21.65,2.24ZM5.5,20A1.5,1.5,0,1,1,7,18.5,1.5,1.5,0,0,1,5.5,20Zm13-2A1.5,1.5,0,1,1,20,16.5,1.5,1.5,0,0,1,18.5,18ZM20,7.14,9,8.83v-3L20,4.17Z"/></svg> ${peticion.total_tracks} tracks</span>
                <!-- <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,13.18V11A8,8,0,0,0,4,11v2.18A3,3,0,0,0,2,16v2a3,3,0,0,0,3,3H8a1,1,0,0,0,1-1V14a1,1,0,0,0-1-1H6V11a6,6,0,0,1,12,0v2H16a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h3a3,3,0,0,0,3-3V16A3,3,0,0,0,20,13.18ZM7,15v4H5a1,1,0,0,1-1-1V16a1,1,0,0,1,1-1Zm13,3a1,1,0,0,1-1,1H17V15h2a1,1,0,0,1,1,1Z"/></svg> 19 503</span> -->
            </div>
            <!-- <a href="#modal-buy" class="release__buy open-modal">Buy album – $18</a> -->`
            document.querySelector('#cover_album').innerHTML = coverAlbum;

            const albumName = `<h1 id="albumName">${peticion.name}</h1>`
            document.querySelector('#album_name').innerHTML = albumName;

            const tracks = peticion.tracks.items.map((track,id)=>{
                return `<li class="single-item">
                <a data-playlist data-title="1. Got What I Got" data-artist="Jason Aldean" data-img="http://dmitryvolkov.me/demo/volna/img/covers/cover.svg" href="https://dmitryvolkov.me/demo/blast2.0/audio/12071151_epic-cinematic-trailer_by_audiopizza_preview.mp3" class="single-item__cover">
                    <img src="http://dmitryvolkov.me/demo/volna/img/covers/cover.svg" alt="">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.54,9,8.88,3.46a3.42,3.42,0,0,0-5.13,3V17.58A3.42,3.42,0,0,0,7.17,21a3.43,3.43,0,0,0,1.71-.46L18.54,15a3.42,3.42,0,0,0,0-5.92Zm-1,4.19L7.88,18.81a1.44,1.44,0,0,1-1.42,0,1.42,1.42,0,0,1-.71-1.23V6.42a1.42,1.42,0,0,1,.71-1.23A1.51,1.51,0,0,1,7.17,5a1.54,1.54,0,0,1,.71.19l9.66,5.58a1.42,1.42,0,0,1,0,2.46Z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16,2a3,3,0,0,0-3,3V19a3,3,0,0,0,6,0V5A3,3,0,0,0,16,2Zm1,17a1,1,0,0,1-2,0V5a1,1,0,0,1,2,0ZM8,2A3,3,0,0,0,5,5V19a3,3,0,0,0,6,0V5A3,3,0,0,0,8,2ZM9,19a1,1,0,0,1-2,0V5A1,1,0,0,1,9,5Z"/></svg>
                </a>
                <div class="single-item__title">
                    <h4><a href="#">1. Got What I Got</a></h4>
                    <span><a href="#">Jason Aldean</a></span>
                </div>
                
                <span class="single-item__time">2:58</span>
            </li>`
            }).join("")
            document.querySelector('#tracks').innerHTML = tracks;

            

        console.log(peticion)
    }
}

const obtenerParametroUrl = (parametro)=>{
    let params = (new URL(document.location)).searchParams;
    return params.get(parametro)
}

document.querySelector('#paginaMas')?.addEventListener('click',()=>{
    configSpoty.offset += configSpoty.limit;
    nuevosLanzamientos(`${configSpoty.url_new_releases}?limit=${configSpoty.limit}&offset=${configSpoty.offset}`);
})


autenticacion().then(()=>{
    parametroIdUrl = obtenerParametroUrl('id')
    if(parametroIdUrl === null){
        nuevosLanzamientos(`${configSpoty.url_new_releases}?limit=${configSpoty.limit}&offset=${configSpoty.offset}`);
    }else{
        seleccionAlbum(parametroIdUrl)
    }
    
  })
