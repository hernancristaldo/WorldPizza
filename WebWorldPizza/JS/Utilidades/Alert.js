export default class Alert {
	constructor({ mensaje, title, type }) {
		this.mensaje = mensaje
		this.title = title
		this.type = type
		this.eventos = {};

		this.mostrarCard();
	}
	mostrarCard() {
		this.deleteCard();
		const html = this.getHtml();
		document.body.appendChild(html);
		this.evtClick();
	}
	getHtml() {

		let btnTemplate = `<button class="alert-button ${this.type}-bg ${this.type}-btn" data-element="aceptar">Aceptar</button>`;

		if (this.type === 'question') {

			btnTemplate =
				`
				<div class="question-buttons">
					<button class="confirm-button ${this.type}-bg ${this.type}-btn" data-element="aceptar">Aceptar</button>
					<button class="cancel-button error-bg error-btn" data-element="cancelar">Cancelar</button>
				</div>
			`;

		}

		const icons = {
			'warning': 'priority_high',
			'question': 'question_mark',
			'success': 'done',
			'error': 'error'
		}

		const contenedor = document.createElement("div");
		contenedor.className = "conteiner-alert";

		const html =
			`
			<div class="alert ${this.type}-bg">
				<div class="alert-close-circle">X</div>
				<div class="alert-header  ${this.type}-bg">
				<span class="material-symbols-outlined" style="font-size: 100px">${icons[this.type]}</span>
				</div>
				<div class="alert-body">
				  <span class="alert-title">${this.title}</span>
				  <span class="alert-message">${this.mensaje}</span>
				  ${btnTemplate}
			</div>
			</div>
		`

		contenedor.innerHTML = html;

		return contenedor;

	}
	evtClick() {

		const closeBtn = document.querySelector('.conteiner-alert .alert-close-circle');
		closeBtn.addEventListener('click', () => {
			this.deleteCard();
		});

		const btns = document.querySelector('.alert-body');
		btns.addEventListener('click', e => {

			if (e.target.dataset.element === "aceptar") {
				this.pub('aceptar', '');
				this.deleteCard();
				return;
			}

			if (e.target.dataset.element === "cancelar") {
				this.pub('cancelar', '');
				this.deleteCard();
				return;
			}

		});

	}
	deleteCard() {
		const elementToRemove = document.querySelector(".conteiner-alert");
		if (elementToRemove) {
			elementToRemove.remove();
		}
	}
	sub(evento, callback) {
		if (!this.eventos[evento]) {
			this.eventos[evento] = [];
		}
		this.eventos[evento].push(callback);
	}
	pub(evento, datos) {
		if (this.eventos[evento]) {
			this.eventos[evento].forEach(callback => {
				callback(datos);
			});
		}
	}

}