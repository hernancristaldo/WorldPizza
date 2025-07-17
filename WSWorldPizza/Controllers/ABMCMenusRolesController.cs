using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WSWorldPizza.Helpers;
using WSWorldPizza.Models;
using WSWorldPizza.Exceptions;

namespace WSWorldPizza.Controllers
{
    public class ABMCMenusRolesController
    {
        string objeto = "'Menu'";

        /// <summary>
        /// El metodo se utiliza para recuperar todos los menusRoles de acuerdo a los parametros de busqueda.
        /// </summary>
        /// <param name="id_menu"></param>
        /// <param name="id_rol"></param>
        /// <returns>
        /// Retorna el listado de menus o la lista de errores en caso de que los haya.
        /// </returns>
        public List<MenusRoles> CMenusRoles(int? id_menu, int? id_rol)
        {
            // Instanciamos una lista de objetos.
            List<MenusRoles> menusRolesList = new List<MenusRoles>();

            // Instanciamos objeto.
            MenusRoles menuRol = new MenusRoles();

            // Instanciamos una lista de Errores.
            List<Errores> errores = new List<Errores>();

            // Se instancia la clase Errores.
            Errores error = new Errores();

            try
            {
                MenusRoles mr = null;

                using (var sessionDBGestionesMM = NHibernateHelperDBWorldPizza.OpenSession())
                {
                    try
                    {
                        var query = sessionDBGestionesMM.QueryOver(() => mr)
                                                        .Where(m => m.id != 0);

                        if (id_menu != null) query.JoinQueryOver(m => mr.menu)
                                                      .Where(m => m.id == id_menu);

                        if (id_rol != null) query.JoinQueryOver(r => mr.rol)
                                                      .Where(r => r.id == id_rol);

                        menusRolesList = new List<MenusRoles>(query.List());

                        // Si la búsqueda no retorna resultados.
                        if (menusRolesList.Count == 0)
                        {
                            error = new Errores()
                            {
                                descripcion = $"No se recupero ningun {objeto} que coincida con su busqueda",
                                cod_error = "0001"
                            };

                            errores.Add(error);

                            menuRol.resultado = "Error";
                            menuRol.errores = errores;

                            menusRolesList.Add(menuRol);
                        }
                        else
                        {
                            // A cada objeto recuperado le seteamos la variable resultado en "Ok".
                            foreach (MenusRoles a in menusRolesList) { a.resultado = "Ok"; }
                        }
                    }                    
                    catch (Exception ex)
                    {
                        // Se agrega el error a la lista de errores.
                        errores.Add(new Errores
                        {
                            cod_error = "0001",
                            descripcion = $"Error al consultar el {objeto}"
                        });

                        // Se setea la variable 'resultado' en "Error"
                        menuRol.resultado = "Error";

                        menuRol.errores = errores;

                        menusRolesList.Add(menuRol);
                    }
                }
            }
            catch (Exception ex)
            {
                // Se agrega el error a la lista.
                errores.Add(new Errores { 
                    cod_error = "0001",
                    descripcion = "Error al intentar conectarse con la base de datos."
                });

                menuRol.errores = errores;

                // Se setea la variable 'resultado' en "Error".
                menuRol.resultado = "Error";

                menusRolesList.Add(menuRol);
            }

            return menusRolesList;
        }
    }
}