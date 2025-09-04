import Principal from '/js/Utilidades/Principal.js';
import InstanciaCry from '/js/Utilidades/Cry.js';

document.addEventListener('DOMContentLoaded', () => {
    new Home();
});

class Home {
    constructor() {

        //this.main();
    }
    async main() {
        this.iniciarPrincipal();
        this.evtClickPrincipal();
    }
    async iniciarPrincipal() {

        this.principal = new Principal({
            id_elemento: 'principal',
            tituloContent: 'HOME',
            htmlInsertar: "",
        });

        this.principal.ocultarSpinner();

        //await this.Permisos();

    }
    async Permisos() {

        // Recuperamos las pantallas del usuario.
        const arrayPantallas = await InstanciaCry.decSer(sessionStorage.getItem('pantallasRol'));

        const pantallaGestiones = "home-gestiones";
        const pantallaAsignaciones = "home-asignaciones";
        const pantallaAbonados = "home-abonados";

        if (arrayPantallas.includes(pantallaGestiones)) {
            const html = `<a href="#" data-element="link2" class="link-pestana">Gestiones</a>`;
            document.querySelector("#divContenedorPestanasHome").insertAdjacentHTML('beforeend', html);

            // Cargamos la pestaña predeterminada.
            this.cargarPestana({ id: 'link2', title: 'Gestiones', template: '#page2' });
        }

        if (arrayPantallas.includes(pantallaAbonados)) {
            const html = `<a href="#" data-element="link1" class="link-pestana">Abonados</a>`;
            document.querySelector("#divContenedorPestanasHome").insertAdjacentHTML('beforeend', html);
        }

        if (arrayPantallas.includes(pantallaAsignaciones)) {
            const html = `<a href="#" data-element="link3" class="link-pestana">Asignaciones</a>`;
            document.querySelector("#divContenedorPestanasHome").insertAdjacentHTML('beforeend', html);
        }

    }
    evtClickPrincipal() {

        document.querySelector('#divContenedorPestanasHome').addEventListener('click', (e) => {

            const elem = e.target.dataset.element;

            const tabInfo = this.pestanas.find((tab) => tab.id === elem);

            if (tabInfo) {
                this.cargarPestana(tabInfo);
            }

            return;

        });

    }
    cargarPestana(tabInfo) {
        this.insertarContenidoPestana(tabInfo);
    }
    async insertarContenidoPestana(tabInfo) {

        document.querySelector('#contentPestana').innerHTML = '';
        document.querySelector('#contentPestana').appendChild(document.querySelector(tabInfo.template).content.cloneNode(true));
        document.querySelectorAll('.link-pestana-active').forEach((elem) => elem.classList.remove('link-pestana-active'));
        document.querySelector(`[data-element="${tabInfo.id}"]`).classList.add('link-pestana-active');

        if (tabInfo.title === "Gestiones") {

            if (!this.ModuloGestiones) {
                const { default: ModuloGestiones } = await import('/js/Home/Gestiones/Gestiones.js');
                this.ModuloGestiones = ModuloGestiones;
            }

            new this.ModuloGestiones();
            return;

        }

        if (tabInfo.title === "Abonados") {

            if (!this.ModuloAbonados) {
                const { default: ModuloAbonados } = await import('/js/Home/Abonados/Abonados.js');
                this.ModuloAbonados = ModuloAbonados;
            }

            new this.ModuloAbonados();
            return;
        }

        if (tabInfo.title === "Asignaciones") {


            if (!this.ModuloAsignaciones) {
                const { default: AsignacionesIndex } = await import('/js/Home/AsignacionesIndex/AsignacionesIndex.js');
                this.ModuloAsignaciones = AsignacionesIndex;
            }

            new this.ModuloAsignaciones();
            return;

        }

    }

}