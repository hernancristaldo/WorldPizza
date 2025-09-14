import Principal from '/js/Utilidades/Principal.js';
import InstanciaCry from '/js/Utilidades/Cry.js';
import Spinner from '/js/Utilidades/Spinner.js';

document.addEventListener('DOMContentLoaded', () => {
    new Home();
});

class Home {
    constructor() {
        
        this.main();       
    }    
    async main() {
        this.permisos();
    }    
    async permisos() {

        // Recuperamos las pantallas del usuario.
        const arrayPantallas = await InstanciaCry.decSer(sessionStorage.getItem('pantallasRol'));
        const pantallaPedidos = "Pedidos";        

        if (arrayPantallas.includes(pantallaPedidos)) {            
            window.location.href = "/ViewControllers/Pedidos.aspx";
        }
    }  

}