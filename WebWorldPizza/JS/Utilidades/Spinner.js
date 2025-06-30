export default class Spinner {
    constructor({ id_elemento }) {
        this.elemento = document.querySelector(`#${id_elemento}`);
    }
    mostrarSpinner() {

        this.elemento.style.display = "none";

        this.spinner = document.createElement("div");
        this.spinner.className = "content-spinner";
        this.spinner.innerHTML = `<div class="spinner show"></div>`;

        // Agregamos el spinner.
        const elementoPadre = this.elemento.parentNode;
        elementoPadre.insertBefore(this.spinner, this.elemento.nextSibling);

    }
    ocultarSpinner() {

        // Mostramos el contenido ocultado y quitamos el spinner.
        this.elemento.style.display = "block";
        this.spinner.remove();

    }

}