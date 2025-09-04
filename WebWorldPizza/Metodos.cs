using NHibernate.Criterion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web;
using WebWorldPizza.Helpers;
using WebWorldPizza.Models;

namespace WebWorldPizza
{
    public class Metodos
    {
        public string GenerateApiKey()
        {
            using (var rng = new RNGCryptoServiceProvider())
            {
                var byteArray = new byte[32]; // 256 bits
                rng.GetBytes(byteArray);
                return Convert.ToBase64String(byteArray);
            }
        }

        public Usuarios CUsuario(string nombreUsuario, int? id_empleado)
        {
            // Instanciamos Resultado y seteamos la varaible resultado en "Ok".
            Usuarios usuario = new Usuarios();

            // Se instancia la clase errores como una lista.
            List<Errores> errores = new List<Errores>();

            // Se instancia la clase Errores.
            Errores error = new Errores();            

            try
            {
                using (var sessionDBGestionesMM = NHibernateHelperDBWorldPizza.OpenSession())
                {
                    try
                    {

                        var query = sessionDBGestionesMM.QueryOver<Usuarios>()
                                                        .Where(a => a.usuario != "");

                        if (!string.IsNullOrEmpty(nombreUsuario))
                        {
                            query.WhereRestrictionOn(x => x.usuario).IsLike(nombreUsuario, MatchMode.Anywhere);
                        }

                        if (id_empleado != null)
                        {
                            query.JoinQueryOver(b => b.empleado)
                                 .And(b => b.id == id_empleado);
                        }

                        usuario = query.SingleOrDefault();

                        // Si la consulta retorna resultados.
                        if (usuario == null)
                        {
                            error = new Errores()
                            {
                                descripcion = $"No se recupero ningun usuario que coincida con su busqueda.",
                                cod_error = "0001"
                            };

                            errores.Add(error);                           

                            usuario.resultado = "Error";
                            usuario.errores = errores;

                        }
                        else
                        {
                            // Seteamos resultado en "Ok".
                            usuario.resultado = "Ok";
                        }                       

                    }                    
                    catch
                    {

                        usuario = new Usuarios();

                        // Se llama al método que realiza el registro de errores
                        // y se agrega a la lista de errores el objeto devuelto por el método.
                        errores.Add(new Errores { cod_error = "0001", descripcion = "Error al consultar el usuario." });

                        // Se setea la variable resultado en "Error"
                        usuario.resultado = "Error";
                        usuario.errores = errores;

                    }
                }
            }
            catch
            {

                // Se llama al método que realiza el registro de errores
                // y se agrega a la lista de errores el objeto devuelto por el método.
                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al intentar conectarse a la base de datos." });

                // Se setea la variable resultado en "Error"
                usuario.resultado = "Error";
                usuario.errores = errores;

            }

            return usuario;

        }

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
                                descripcion = $"No se recupero ningun rol para el usuario.",
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
                    catch
                    {

                        // Se llama al método que realiza el registro de errores
                        // y se agrega a la lista de errores el objeto devuelto por el método.
                        errores.Add(new Errores { cod_error = "0001", descripcion = "Error al consultar los roles del usuario."});

                        // Se setea la variable 'resultado' en "Error"
                        rol.resultado = "Error";

                        rol.errores = errores;

                        usuarioRolesList.Add(rol);

                    }

                }
            }
            catch
            {

                // Se llama al método que realiza el registro de errores
                // y se agrega a la lista de errores el objeto devuelto por el método.
                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al intentar conectarse a la base de datos."});

                rol.errores = errores;

                // Se setea la variable 'resultado' en "Error".
                rol.resultado = "Error";

                usuarioRolesList.Add(rol);

            }

            return usuarioRolesList;

        }

        public List<PantallasRoles> CPantallasRoles(int? id_rol)
        {
            // Instanciamos una lista de objetos.
            List<PantallasRoles> pantallasRolesList = new List<PantallasRoles>();

            // Instanciamos objeto.
            PantallasRoles pantallaRol = new PantallasRoles();

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

                        var query = sessionDBGestionesMM.QueryOver<PantallasRoles>()
                                                        .Where(a => a.id != 0);

                        if (id_rol != null) query.And(c => c.roles.id == id_rol);

                        pantallasRolesList = new List<PantallasRoles>(query.List());

                        // Si la búsqueda no retorna resultados.
                        if (pantallasRolesList.Count == 0)
                        {
                            error = new Errores()
                            {
                                descripcion = $"No se recupero ninguna pantalla para el rol.",
                                cod_error = "0001"
                            };

                            errores.Add(error);

                            pantallaRol.resultado = "Error";
                            pantallaRol.errores = errores;

                            pantallasRolesList.Add(pantallaRol);

                        }
                        else
                        {
                            // A cada objeto recuperado le seteamos la variable resultado en "Ok".
                            foreach (PantallasRoles a in pantallasRolesList) { a.resultado = "Ok"; }
                        }

                        

                    }
                    
                    catch
                    {

                        // Se llama al método que realiza el registro de errores
                        // y se agrega a la lista de errores el objeto devuelto por el método.
                        errores.Add(new Errores { cod_error = "0001", descripcion = "Error al consultar las pantallas del rol."});

                        // Se setea la variable 'resultado' en "Error"
                        pantallaRol.resultado = "Error";

                        pantallaRol.errores = errores;

                        pantallasRolesList.Add(pantallaRol);

                    }

                }
            }
            catch
            {

                // Se llama al método que realiza el registro de errores
                // y se agrega a la lista de errores el objeto devuelto por el método.
                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al intentar conectarse a la base de datos."});

                pantallaRol.errores = errores;

                // Se setea la variable 'resultado' en "Error".
                pantallaRol.resultado = "Error";

                pantallasRolesList.Add(pantallaRol);

            }

            return pantallasRolesList;

        }

        public List<MenusRoles> CMenusRoles(int? id_menu, int? id_rol)
        {
            // Instanciamos una lista de objetos.
            List<MenusRoles> menuList = new List<MenusRoles>();

            // Instanciamos objeto.
            MenusRoles menu = new MenusRoles();

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

                        menuList = new List<MenusRoles>(query.List());

                        // Si la búsqueda no retorna resultados.
                        if (menuList.Count == 0)
                        {
                            error = new Errores()
                            {
                                descripcion = $"No se recupero ningun menu que coincida con su busqueda.",
                                cod_error = "0001"
                            };

                            errores.Add(error);

                            menu.resultado = "Error";
                            menu.errores = errores;

                            menuList.Add(menu);
                        }
                        else
                        {
                            // A cada objeto recuperado le seteamos la variable resultado en "Ok".
                            foreach (MenusRoles a in menuList) { a.resultado = "Ok"; }
                        }
                    }                    
                    catch
                    {
                        // Se llama al método que realiza el registro de errores
                        // y se agrega a la lista de errores el objeto devuelto por el método.
                        errores.Add(new Errores { cod_error = "0001", descripcion = "Error al consultar el menu."});

                        // Se setea la variable 'resultado' en "Error"
                        menu.resultado = "Error";

                        menu.errores = errores;

                        menuList.Add(menu);
                    }
                }
            }
            catch
            {
                // Se llama al método que realiza el registro de errores
                // y se agrega a la lista de errores el objeto devuelto por el método.
                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al intentar conectarse a la base de datos."});

                menu.errores = errores;

                // Se setea la variable 'resultado' en "Error".
                menu.resultado = "Error";

                menuList.Add(menu);
            }

            return menuList;
        }
    }
}