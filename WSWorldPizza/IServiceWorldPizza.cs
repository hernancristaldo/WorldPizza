using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Web;
using WSWorldPizza.Models;
using WSWorldPizza.Controllers;

namespace WSWorldPizza
{
    [ServiceContract]
    public interface IServiceWorldPizza
    {
        [OperationContract]
        [FaultContract(typeof(SomeError))]
        string bienvenida();

        #region MenusRoles
        [OperationContract]
        [FaultContract(typeof(SomeError))]
        List<MenusRoles> CMenusRoles(int? id_menu, int? id_rol);
        #endregion MenusRoles

        #region Usuarios
        [OperationContract]
        [FaultContract(typeof(SomeError))]
        Usuarios CUsuario(string nombreUsuario, int? id_empleado);

        [OperationContract]
        [FaultContract(typeof(SomeError))]
        List<Usuarios> CUsuarios(string filtroBusqueda);
        #endregion Usuarios

        #region UsuariosRoles
        [OperationContract]
        [FaultContract(typeof(SomeError))]
        List<UsuariosRoles> CUsuarioRoles(string usuario);

        [OperationContract]
        [FaultContract(typeof(SomeError))]
        List<UsuariosRoles> CUsuariosRol(int id_rol);
        #endregion UsuariosRoles
    }
}