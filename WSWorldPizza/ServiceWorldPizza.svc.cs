using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WSWorldPizza.Controllers;
using WSWorldPizza.Models;

namespace WSWorldPizza
{
    public class ServiceWorldPizza : IServiceWorldPizza
    {
        public string bienvenida()
        {

            return "Bienvenido a World Pizza!";
        }

        #region MenusRoles
        public List<MenusRoles> CMenusRoles(int? id_menu, int? id_rol)
        {
            ABMCMenusRolesController aBMCMenusRoles = new ABMCMenusRolesController();
            return aBMCMenusRoles.CMenusRoles(id_menu, id_rol);
        }
        #endregion MenusRoles

        #region Usuarios
        public Usuarios CUsuario(string nombreUsuario, int? id_empleado)
        {
            ABMCUsuariosController aBMCUsuarios = new ABMCUsuariosController();
            return aBMCUsuarios.CUsuario(nombreUsuario, id_empleado);
        }

        public List<Usuarios> CUsuarios(string filtroBusqueda)
        {
            ABMCUsuariosController aBMCUsuarios = new ABMCUsuariosController();
            return aBMCUsuarios.CUsuarios(filtroBusqueda);
        }
        #endregion Usuarios

        #region UsuariosRoles
        public List<UsuariosRoles> CUsuarioRoles(string usuario)
        {
            ABMCUsuariosRolesController aBMCUsuariosRoles = new ABMCUsuariosRolesController();
            return aBMCUsuariosRoles.CUsuarioRoles(usuario);
        }

        public List<UsuariosRoles> CUsuariosRol(int id_rol)
        {
            ABMCUsuariosRolesController aBMCUsuariosRoles = new ABMCUsuariosRolesController();
            return aBMCUsuariosRoles.CUsuariosRol(id_rol);
        }
        #endregion UsuariosRoles
    }
}