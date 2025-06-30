export default class Toast {
    constructor({ mensaje, type, timmer = null }) {
        this.mensaje = mensaje;
        this.type = type;
        this.timmer = timmer;

        this.contenedorToast = document.getElementById('contenedor-toast');

        if (!this.contenedorToast) {

            this.contenedorToast = document.createElement('div');
            this.contenedorToast.id = 'contenedor-toast';
            this.contenedorToast.className = 'toast-container';
            document.body.appendChild(this.contenedorToast);

            this.evtClick();

        }
        else {
            this.contenedorToast = document.getElementById('contenedor-toast');
        }

        const html = this.getHtml();
        this.contenedorToast.appendChild(html);

        // Agrega el toast actual a la lista de toasts en sessionStorage
        this.addToSessionStorage();

        // Configura el temporizador si es necesario
        this.startTimer();

    }
    static get toasts() {
        // Obtiene la lista de toasts almacenados en sessionStorage
        const toastsString = sessionStorage.getItem('toasts');
        return toastsString ? JSON.parse(toastsString) : [];
    }
    static set toasts(toasts) {
        // Almacena la lista de toasts en sessionStorage
        sessionStorage.setItem('toasts', JSON.stringify(toasts));
    }
    addToSessionStorage() {
        // Agrega el toast actual a la lista de toasts en sessionStorage
        const allToasts = Toast.toasts;
        allToasts.push(this);
        Toast.toasts = allToasts;
    }
    getHtml() {

        const icons = {
            'warning': 'priority_high',
            'success': 'done',
            'error': 'error'
        }

        const contenedor = document.createElement("div");
        contenedor.className = "conteiner-toast";

        const toast = this.timmer ? `<div class="toast-timer ${this.type}-timer" style="animation: timer ${this.timmer}ms linear;"/>` : '';

        const html = `
          <div class="${this.type}-toast">
            <div>
              <div class="toast-frame">
                <span class="material-symbols-outlined" style="font-size: 30px">${icons[this.type]}</span>
                <span class="toast-message">${this.mensaje}</span>
                <div class="toast-close" data-id="${Toast.toasts.indexOf(this)}">X</div>
              </div>
              ${toast}
            </div>
          </div>
        `;

        contenedor.innerHTML = html;

        return contenedor;
    }
    evtClick() {
        const contenedor = document.querySelector('#contenedor-toast');

        contenedor.addEventListener('click', (e) => {
            if (e.target.className === "toast-close") {
                this.deleteCard({ id_contenedor: e.target.dataset.id });
            }
        });
    }
    startTimer() {
        if (this.timmer !== null) {
            setTimeout(() => {
                this.deleteCard({ id_contenedor: Toast.toasts.indexOf(this) });
            }, this.timmer);
        }
    }
    deleteCard({ id_contenedor }) {
        const elementToRemove = document.querySelector(`#contenedor-toast [data-id="${id_contenedor}"]`);
        if (elementToRemove) {
            elementToRemove.parentElement.parentElement.remove();
            // Elimina el toast del array de toasts en sessionStorage
            const allToasts = Toast.toasts;
            allToasts.splice(id_contenedor, 1);
            Toast.toasts = allToasts;
        }
    }

}