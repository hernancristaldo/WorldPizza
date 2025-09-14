using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebWorldPizza.Models.ViewModels
{
    public class UsuarioSesionVM
    {
        public virtual Usuarios usuario { get; set; }
        public virtual Empleados empleado { get; set; }
        public virtual List<UsuariosRoles> usuarioRoles { get; set; }        
    }
}