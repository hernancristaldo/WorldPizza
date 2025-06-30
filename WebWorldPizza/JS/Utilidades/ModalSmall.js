export default class ModalSmall {
    constructor({ id_contenedor, htmlInsertar }) {
        this.divConteiner = document.querySelector(`#${id_contenedor}`);
        this.elemPrincipal = null;
        this.body = null;
        this.errores = null;
        this.htmlBody = htmlInsertar;
        this.modalHtml = `
          <div class="custom-modal">
            <div class="custom-modal-content-small">
              <span class="custom-modal-close-small" data-element="cerrarModal">&times;</span>
              <header class="custom-modal-header-small">
              </header>
              <div class="content-spinner">
                <div class="spinner"></div>
              </div>
              <div class="custom-modal-body"></div>
            </div>
          </div>
        `;
        this.divConteiner.innerHTML = "";

        this.eventListenersAdded = false;
        this.initializeModal();

    }
    initializeModal() {

        if (!this.elemPrincipal) {
            this.createModal();
            this.initializeElements();
            if (!this.eventListenersAdded) {
                this.addEventListeners();
            }
        }

        this.actualizarBody();
        this.showModal();

    }
    initializeElements() {
        this.elemPrincipal = this.divConteiner.querySelector(".custom-modal");
        this.body = this.elemPrincipal.querySelector(".custom-modal-body");
        this.spinner = this.divConteiner.querySelector(".custom-modal .spinner");
    }
    addEventListeners() {

        this.divConteiner.querySelector(".custom-modal").addEventListener("click", (e) => {

            let elem = e.target.dataset.element;

            if (elem === "cerrarModal") {
                this.ocultarModal();
                e.stopPropagation();
                return;
            }

        });

        this.eventListenersAdded = true;

    }
    ocultarModal() {
        this.elemPrincipal.classList.add('modal-hidden');
    }
    showModal() {
        this.elemPrincipal.style.display = "block";
    }
    hideModal() {
        this.elemPrincipal.style.display = "none";
    }
    actualizarBody() {
        this.body.innerHTML = "";
        if (this.htmlBody) this.body.appendChild(this.htmlBody);
    }
    createModal() {
        this.divConteiner.innerHTML = this.modalHtml;
    }
    mostrarSpinner() {
        this.body.style.display = "none";
        this.spinner.classList.add("show");
    }
    ocultarSpinner() {
        this.body.style.display = "block";
        this.spinner.classList.remove("show");
    }
}