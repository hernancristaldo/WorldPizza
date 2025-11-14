import Principal from '/js/Utilidades/Principal.js';
import InstanciaCry from '/js/Utilidades/Cry.js';
import AsyncFetch from '/js/Utilidades/Asyncfetch.js';
import Alert from '/js/Utilidades/Alert.js';
import Toast from '/js/Utilidades/Toast.js';


document.addEventListener('DOMContentLoaded', () => {
    new Mapa();
});


function loadGoogleMaps(apiKey) {
    return new Promise((resolve, reject) => {

        // Si ya está cargado
        if (window.google && window.google.maps) {
            resolve();
            return;
        }

        // Callback que Google Maps espera
        window.__initGM = () => {
            resolve();
            delete window.__initGM;
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__initGM&libraries=marker&loading=async`;
        script.async = true;
        script.defer = true;
        script.onerror = reject;

        document.head.appendChild(script);
    });
}

class Mapa {

    constructor() {
        this.asyncFetch = new AsyncFetch();
        this.estados = [];
        this.tiposPagos = [];
        this.pedidos = [];
        this.roles = [];
        this.editar = false;



        if (Mapa.instance) {
            this.sessionUser = Mapa.instance.sessionUser;
            this.token = Mapa.instance.token;
            return Mapa.instance;
        }

        Mapa.instance = this;
        this.main();
    }

    async main() {
        await loadGoogleMaps("AIzaSyDRZNUspAj7J1LwfcFhXCWthM7VJ1xkROQ");

        // --- 2) Decodificar token ---
        this.token = await InstanciaCry.decSer(sessionStorage.getItem('tkn'));

        // --- 3) Cargar la UI y luego el mapa ---
        await this.iniciarPrincipal();
        await this.iniciarMapa();
    }

    async iniciarPrincipal() {
        document.querySelector("#principal").innerHTML = "";
        const template = document.querySelector('#bodyPrincipal');
        const clone = template.content.cloneNode(true);

        this.principal = new Principal({
            id_elemento: 'principal',
            tituloContent: "Mapa de Pedidos",
            htmlInsertar: clone
        });

        this.principal.ocultarSpinner();
    }

    iniciarMapa() {
        const div = document.querySelector('#contenedor-mapa');
        div.style.width = "100%";
        div.style.height = "500px";
        div.style.display = "block";

        // 5) ¡Ahora Google Maps funciona sin error!
        this.mapa = new google.maps.Map(div, {
            center: { lat: -31.6766491, lng: -61.7434883 },
            zoom: 14,
            mapId: "Pedidos"
        });

        const pedidos = [
            { direccion: "Belgrano 450, Rafaela", nombre: "Pedido 1" },
            { direccion: "Av. Italia 200, Rafaela", nombre: "Pedido 2" },
            { direccion: "9 de Julio 55, Rafaela", nombre: "Pedido 3" }
        ];

        for (let p of pedidos) {
            this.agregarMarcadorPorDireccion(p.direccion, p.nombre);
        }
    }
    async agregarMarcadorPorDireccion(direccion, titulo = "") {
        try {
            const location = await this.geocodificarDireccion(direccion);

            const marker = new google.maps.marker.AdvancedMarkerElement({
                position: location,
                map: this.mapa,
                title: titulo
            });

            return marker;

        } catch (error) {
            console.error(error);
        }
    }
    async geocodificarDireccion(direccion) {
        return new Promise((resolve, reject) => {
            const geocoder = new google.maps.Geocoder();

            geocoder.geocode({ address: direccion }, (results, status) => {
                if (status === "OK" && results.length > 0) {
                    resolve(results[0].geometry.location); // lat/lng
                } else {
                    reject("No se pudo geocodificar la dirección: " + direccion);
                }
            });
        });
    }
}
