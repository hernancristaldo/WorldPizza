import Principal from '/js/Utilidades/Principal.js';
import InstanciaCry from '/js/Utilidades/Cry.js';
import Spinner from '/js/Utilidades/Spinner.js';
import AsyncFetch from '/js/Utilidades/Asyncfetch.js';

document.addEventListener('DOMContentLoaded', () => {
    new Pedidos();
});

class Pedidos {
    constructor() {
        this.asyncFetch = new AsyncFetch()
        this.estados = []
        this.tiposPagos = []
        this.pedidos = []
        this.roles = []
        this.editar = false
        this.token = null

        this.main();
    }
    async main() {
        this.token = await InstanciaCry.decSer(sessionStorage.getItem('tkn'));
        this.iniciarPrincipal();

        //this.permisos();

        
        //this.evtClickPrincipal();
    }
    async iniciarPrincipal() {

        document.querySelector("#principal").innerHTML = "";
        const template = document.querySelector('#bodyPrincipal');
        const clone = template.content.cloneNode(true);

        // Insertamos el html en el body.
        this.principal = new Principal({
            id_elemento: 'principal',
            tituloContent: "Busqueda de Pedidos",
            htmlInsertar: clone
        });


        //this.evtClickPrincipal();

        // Se instancia el spinner para la tabla.
        this.spinnerTabla = new Spinner({
            id_elemento: "spinnerTabla"
        });



        //// Se llena el select de empresas.
        //let selectEmpresas = document.querySelector("#selectEmpresa");

        //if (empresas.length !== 0) {
        //    empresas.forEach(({ nombre, id }) => {
        //        let option = document.createElement("option");
        //        option.innerHTML = nombre;
        //        option.value = id;
        //        selectEmpresas.appendChild(option);
        //    });
        //}

        this.principal.ocultarSpinner();

    }
    async permisos() {

        // Recuperamos las pantallas del usuario.
        const arrayPantallas = await InstanciaCry.decSer(sessionStorage.getItem('pantallasRol'));

        const pantallaPedidos = "Pedidos";


        if (arrayPantallas.includes(pantallaPedidos)) {
            
            this.editar = true;
            //window.location.href = "/ViewControllers/Pedidos.aspx";
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