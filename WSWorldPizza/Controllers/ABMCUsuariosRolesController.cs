using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WSWorldPizza.Models;
using WSWorldPizza.Helpers;
using NHibernate.Criterion;

namespace WSWorldPizza.Controllers
{
    public class ABMCUsuariosRolesController
    {
        public List<UsuariosRoles> CUsuarioRoles(string usuario)
        {
            // Instanciamos una lista de objetos.
            List<UsuariosRoles> usuarioRolesList = new List<UsuariosRoles>();

            // Instanciamos objeto.
            UsuariosRoles rol = new UsuariosRoles();

            // Instanciamos una lista de Errores.
            List<Errores> errores = new List<Errores>();

            // Se instancia la clase Errores.
            Errores error = new Errores();

            
            try
            {

                using (var sessionDBGestionesMM = NHibernateHelperDBWorldPizza.OpenSession())
                {

                    try
                    {

                        var query = sessionDBGestionesMM.QueryOver<UsuariosRoles>()
                                                        .Where(a => a.usuario.usuario != "");

                        if (usuario != "") query.And(a => a.usuario.usuario.IsLike(usuario, MatchMode.Exact));

                        usuarioRolesList = new List<UsuariosRoles>(query.List());

                        // Si la búsqueda no retorna resultados.
                        if (usuarioRolesList.Count == 0)
                        {
                            error = new Errores()
                            {
                                descripcion = $"No se recupero ningun rol que coincida con su usuario.",
                                cod_error = "0001"
                            };

                            errores.Add(error);

                            rol.resultado = "Error";
                            rol.errores = errores;

                            usuarioRolesList.Add(rol);

                        }
                        else
                        {
                            // A cada objeto recuperado le seteamos la variable resultado en "Ok".
                            foreach (UsuariosRoles a in usuarioRolesList) { a.resultado = "Ok"; }
                        }
                    }                    
                    catch (Exception ex)
                    {

                        // Se agrega el error a la lista.
                        errores.Add(new Errores { 
                            cod_error = "0001",
                            descripcion = "Error al consultar los roles del usuario."
                        });

                        // Se setea la variable 'resultado' en "Error"
                        rol.resultado = "Error";

                        rol.errores = errores;

                        usuarioRolesList.Add(rol);
                    }
                }
            }
            catch (Exception ex)
            {

                // Se el error a la lista.
                errores.Add(new Errores { 
                    cod_error = "0001",
                    descripcion = "Error al intentar conectarse con la base de datos."
                });

                rol.errores = errores;

                // Se setea la variable 'resultado' en "Error".
                rol.resultado = "Error";

                usuarioRolesList.Add(rol);

            }

            return usuarioRolesList;

        }

        public List<UsuariosRoles> CUsuariosRol(int id_rol)
        {
            // Instanciamos una lista de objetos.
            List<UsuariosRoles> usuarioRolesList = new List<UsuariosRoles>();

            // Instanciamos objeto.
            UsuariosRoles rol = new UsuariosRoles();

            // Instanciamos una lista de Errores.
            List<Errores> errores = new List<Errores>();

            // Se instancia la clase Errores.
            Errores error = new Errores();

            try
            {

                using (var sessionDBGestionesMM = NHibernateHelperDBWorldPizza.OpenSession())
                {
                    try
                    {
                        var query = sessionDBGestionesMM.QueryOver<UsuariosRoles>()
                                                        .Where(a => a.roles.id == id_rol);

                        usuarioRolesList = new List<UsuariosRoles>(query.List());

                        // Si la búsqueda no retorna resultados.
                        if (usuarioRolesList.Count == 0)
                        {
                            error = new Errores()
                            {
                                descripcion = $"No se recupero ningun usuario que coincida con el rol.",
                                cod_error = "0001"
                            };

                            errores.Add(error);

                            rol.resultado = "Error";
                            rol.errores = errores;

                            usuarioRolesList.Add(rol);
                        }
                        else
                        {
                            // A cada objeto recuperado le seteamos la variable resultado en "Ok".
                            foreach (UsuariosRoles a in usuarioRolesList) { a.resultado = "Ok"; }
                        }                        

                    }
                    catch (Exception ex)
                    {

                        // Se agrega el rol a la lista.
                        errores.Add(new Errores { 
                            cod_error = "0001",
                            descripcion = "Error al consultar los usuarios del rol."
                        });

                        // Se setea la variable 'resultado' en "Error"
                        rol.resultado = "Error";

                        rol.errores = errores;

                        usuarioRolesList.Add(rol);

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

                rol.errores = errores;

                // Se setea la variable 'resultado' en "Error".
                rol.resultado = "Error";

                usuarioRolesList.Add(rol);

            }

            return usuarioRolesList;

        }
    }
}