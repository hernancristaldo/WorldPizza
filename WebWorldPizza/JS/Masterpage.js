import AsyncFetch from '/js/Utilidades/Asyncfetch.js';
import InstanciaCry from '/js/Utilidades/cry.js';
import CampanitaNotificaciones from '/js/Utilidades/CampanitaNotificaciones.js';

document.addEventListener('DOMContentLoaded', () => {
    new Nav();
})

class Nav {
    constructor() {
        this.navDesktop = document.querySelector(".nav-desktop")
        this.novMobile = document.querySelector(".menu-mobile div")
        this.btnMenuMobile = document.querySelector(".btn-menu-mobile")
        this.divMenuMobile = document.querySelector(".div-menu-mobile")
        this.barraSuperior = document.querySelector(".barra-superior")
        this.asyncFetch = new AsyncFetch()

        // Empleado para recuperar notificaciones
        this.empleado = null

        this.main();

    }
    // Main.
    async main() {
        this.eventos();
        await this.llenarNavDesktop();
        this.getEmpleado();
    }
    async getEmpleado() {

        // Se recupera el empleado para recuperar las notificaciones.
        const usuario = await InstanciaCry.decSer(sessionStorage.getItem('sessionUsr'));
        const sessionUser = JSON.parse(usuario);

        if (sessionUser.usuario.resultado === "Ok") this.empleado = sessionUser.usuario.empleado;

        // Metodo para obtener notificaciones periodicamente.
        this.iniciarIntervaloNotificaciones(this.empleado);

        return;
    }
    async iniciarIntervaloNotificaciones(empleado) {

        const intervalMinutes = 1;
        const intervalMilliseconds = intervalMinutes * 60 * 1000;

        this.campanitaNotificaciones = new CampanitaNotificaciones();

        const checkNotificaciones = async () => {
            await this.campanitaNotificaciones.recuperarNotificaciones(empleado);
        };

        // Ejecutar inmediatamente la primera vez
        await checkNotificaciones();

        // Configurar el intervalo
        setInterval(checkNotificaciones, intervalMilliseconds);

        return;
    }
    // Eventos.
    eventos() {
        this.evtClickNavMobile();
        this.evtClickBtnMobile();
        this.evtClickBarraSuperior();
    }
    evtClickNavMobile() {

        this.novMobile.addEventListener('click', e => {

            // Ocultamos todos los ul que no pertenezcan al ul a mostrar.
            let ulChildren = document.querySelectorAll("ul .children");
            let ulChildren2 = document.querySelectorAll("ul .children2");
            let ulChildren3 = document.querySelectorAll("ul .children3");

            if (e.target.parentElement.querySelector("ul").className === "children") {

                ulChildren.forEach(chil => {
                    if (chil != e.target.parentElement.querySelector("ul")) {
                        chil.style.display = "none";
                    }
                })

                ulChildren2.forEach(chil => {
                    if (chil != e.target.parentElement.querySelector("ul")) {
                        chil.style.display = "none";
                    }
                })

                ulChildren3.forEach(chil => {
                    if (chil != e.target.parentElement.querySelector("ul")) {
                        chil.style.display = "none";
                    }
                })

            }

            if (e.target.parentElement.querySelector("ul").className === "children2") {

                ulChildren2.forEach(chil => {
                    if (chil != e.target.parentElement.querySelector("ul")) {
                        chil.style.display = "none";
                    }
                })

                ulChildren3.forEach(chil => {
                    if (chil != e.target.parentElement.querySelector("ul")) {
                        chil.style.display = "none";
                    }
                })

            }

            if (e.target.parentElement.querySelector("ul").className === "children3") {

                ulChildren3.forEach(chil => {
                    if (chil != e.target.parentElement.querySelector("ul")) {
                        chil.style.display = "none";
                    }
                })

            }

            // Mostramos u ocultamos según corresponda.
            if (e.target.parentElement.querySelector("ul").style.display === "none") {
                e.target.parentElement.querySelector("ul").style.display = "block";
            }
            else e.target.parentElement.querySelector("ul").style.display = "none";

        })
    }
    evtClickBtnMobile() {

        this.btnMenuMobile.addEventListener('click', e => {

            if (this.divMenuMobile.classList.contains("nav-mobile-active")) {
                this.divMenuMobile.classList.remove("nav-mobile-active");
                e.target.innerHTML = "&#8943;";
            }
            else {
                this.divMenuMobile.classList.add("nav-mobile-active");
                e.target.innerHTML = "&#215;";
            }

        })

    }
    evtClickBarraSuperior() {

        this.barraSuperior.addEventListener('click', e => {

            let elem = e.target.dataset.element;

            if (elem === "user") {

            }

            if (elem === "notificacion") {

            }

            return;

        })

    }
    async llenarNavDesktop() {

        const menusRol = await InstanciaCry.decSer(sessionStorage.getItem('menusRol'));
        const menuUsuario = JSON.parse(menusRol)

        // Filtrar los elementos con id_padre nulo y ordenar por la propiedad orden de forma ascendente.
        const menuFiltrado = menuUsuario.filter(({ id_padre }) => id_padre === null);
        const menuOrdenado = menuFiltrado.sort((a, b) => a.orden - b.orden);

        // Filtrar los elementos con id_padre no nulo y ordenar por la propiedad orden de forma ascendente.
        const subMenuFiltrado = menuUsuario.filter(({ id_padre }) => id_padre != null);
        const subMenuOrdenado = subMenuFiltrado.sort((a, b) => a.orden - b.orden);

        // Seteamos menu.
        await menuOrdenado.forEach(({ id, link, nombre }) => {
            let ul = document.createElement("ul");
            this.navDesktop.appendChild(ul);

            let li = document.createElement("li");
            li.dataset.idmenu = id;
            ul.appendChild(li);

            let a = document.createElement("a");
            a.href = link;
            a.innerHTML = nombre;
            li.appendChild(a);

            // Creamos un ul para los submenús
            let ulChildren = document.createElement("ul");
            ulChildren.className = "children";
            ulChildren.style.display = "none"; // Iniciar oculto
            li.appendChild(ulChildren);

            // Verificar si tiene submenús
            const submenus = subMenuOrdenado.filter(({ id_padre }) => id_padre === id);

            if (submenus.length > 0) {

                // Agregar flecha
                let flecha = document.createElement("span");
                flecha.className = "flecha";
                flecha.innerHTML = "▼"; // Flecha hacia abajo por defecto
                flecha.style.float = "right"; // Flecha al lado derecho
                flecha.style.padding = "5px"; // Agregar padding
                a.appendChild(flecha);

                // Agregar evento para abrir/cerrar submenú
                a.addEventListener("click", (e) => {

                    e.preventDefault(); // Prevenir la navegación
                    const isHidden = ulChildren.style.display === "none";

                    // Alternar la visibilidad del submenú
                    ulChildren.style.display = isHidden ? "block" : "none";

                    // Alternar la flecha
                    flecha.innerHTML = isHidden ? "▲" : "▼"; // Cambiar flecha

                });

            }
            else {

                // Si no hay submenús, el enlace debe ser accesible
                a.addEventListener("click", (e) => {

                    window.location.href = link; // Navegar al link

                });

            }
        });

        // Seteamos submenu.
        subMenuOrdenado.forEach(({ id_padre, link, nombre, id }) => {

            let ulMenu = document.querySelector(`.nav-desktop [data-idmenu='${id_padre}'] .children`);

            if (ulMenu) {
                let li = document.createElement("li");
                li.dataset.idsubmenu = id; // Asignar el id del submenu
                ulMenu.appendChild(li);

                let a = document.createElement("a");
                a.href = link;
                a.innerHTML = nombre;
                li.appendChild(a);
            }

        });

        // Evento utilizado para setear el menu o sub-menu clickeado.
        document.querySelectorAll('a').forEach(a => {

            a.addEventListener("click", (e) => {

                const href = a.getAttribute('href');

                // Comprobar si el href no es vacío y no es simplemente '#'
                if (href && href !== '#') {

                    const enlaceMenu = e.target.parentElement.dataset.idmenu;
                    const enlaceSubMenu = e.target.parentElement.dataset.idsubmenu;

                    if (enlaceMenu) {
                        sessionStorage.removeItem('enlaceSubMenu');
                        sessionStorage.setItem('enlaceMenu', e.target.parentElement.dataset.idmenu);
                    }

                    if (enlaceSubMenu) {
                        sessionStorage.removeItem('enlaceMenu');
                        sessionStorage.setItem('enlaceSubMenu', e.target.parentElement.dataset.idsubmenu);
                    }

                }
                else {
                    e.preventDefault();
                }

            });

        });

        // Activar el menu al cargar la página
        const navDesktop = document.querySelector(".nav-desktop");

        const menuActivoId = sessionStorage.getItem('enlaceMenu');
        if (menuActivoId) {

            // Buscar el submenu por su id y agregar la clase "li-active"
            const menuItem = navDesktop.querySelector(`[data-idmenu='${menuActivoId}']`);

            if (menuItem) {
                menuItem.classList.add('li-active');
            }

        }

        // Activar el submenu al cargar la página
        const submenuActivoId = sessionStorage.getItem('enlaceSubMenu');
        if (submenuActivoId) {

            // Buscar el submenu por su id y agregar la clase "li-active"
            const submenuItem = navDesktop.querySelector(`[data-idsubmenu='${submenuActivoId}']`);

            if (submenuItem) {
                submenuItem.classList.add('li-active');
            }

            // Alternar la visibilidad del submenú
            const isHidden = submenuItem.parentElement.style.display === "none";
            submenuItem.parentElement.style.display = isHidden ? "block" : "none";

        }

        if (!menuActivoId && !submenuActivoId) {

            // Buscar el submenu por su id y agregar la clase "li-active"
            const menuItem = navDesktop.querySelector(`[data-idmenu='11']`);

            if (menuItem) {
                menuItem.classList.add('li-active');
            }

        }

    }

}