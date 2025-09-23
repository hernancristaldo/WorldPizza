
using NHibernate.Criterion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web;
using WebWorldPizza.Helpers;
using WebWorldPizza.Models;
using WebWorldPizza.Validators;
using FluentValidation.Results;
using FluentValidation;

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

        #region ABMCUsuarios
        public Usuarios CUsuario(string user, string pass)
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

                        usuario = sessionDBGestionesMM.QueryOver<Usuarios>()
                                                        .Where(a => a.usuario == user)
                                                        .And(a => a.pass == pass)
                                                        .SingleOrDefault();

                        // Si la consulta retorna resultados.
                        if (usuario == null)
                        {
                            usuario = new Usuarios();

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

        public List<Usuarios> CUsuarios(string filtroBusqueda, int? id_empleado)
        {
            // Instanciamos una lista de objetos.
            List<Usuarios> usuariosList = new List<Usuarios>();

            // Instanciamos objeto.
            Usuarios usuario = new Usuarios();

            // Instanciamos una lista de Errores.
            List<Errores> errores = new List<Errores>();            

            try
            {
                using (var session = NHibernateHelperDBWorldPizza.OpenSession())
                {
                    try
                    {
                        Usuarios u = null;
                        
                        var query = session.QueryOver<Usuarios>(() => u)
                                                        .Where(a => a.usuario != "");

                        // Se busca el filtro de busqueda. Solo se ejecuta si el filtro de busqueda no es null.
                        if (filtroBusqueda != null) query.And(m => m.usuario.IsLike(filtroBusqueda, MatchMode.Anywhere));

                        // Se busca por el id_empleado.
                        if (id_empleado != null) query.JoinQueryOver(e => u.empleado)
                                                      .Where(e => e.id == id_empleado);

                        usuariosList = new List<Usuarios>(query.List());

                        // Si la búsqueda no retorna resultados.
                        if (usuariosList.Count == 0) {

                            errores.Add(new Errores { cod_error = "0001", descripcion = "No se encontro ningun usuario que coincida con su busqueda." });
                            usuario.resultado = "Error";
                            usuario.errores = errores;
                            usuariosList.Add(usuario);
                        }
                        else
                        {
                            // A cada objeto recuperado le seteamos la variable resultado en "Ok".
                            foreach (Usuarios a in usuariosList) { a.resultado = "Ok"; }
                        }                      

                    }
                    catch
                    {                      
                        // Se guarda el error.
                        errores.Add(new Errores { cod_error = "0001", descripcion = "Error al consultar los usuraios."});                        
                        usuario.resultado = "Error";
                        usuario.errores = errores;
                        usuariosList.Add(usuario);
                    }
                }
            }
            catch
            {
                // Se guarda el error.
                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al intentar conectarse a la base de datos." });
                usuario.resultado = "Error";
                usuario.errores = errores;
                usuariosList.Add(usuario);
            }

            return usuariosList;
        }

        public Usuarios AUsuario(Usuarios usuario)
        {
            // Se instancia la clase Errores como una lista.
            List<Errores> errores = new List<Errores>();

            try
            {
                // Se instancia la clase UsuariosValidator.
                UsuariosValidator validator = new UsuariosValidator();

                // Se llama al metodo de validacion pasandole como parametros la validacion y regla a validar.
                ValidationResult result = validator.Validate(usuario, ruleSet: "Create");

                // Si no hubo errores en la validacion.
                if (result.IsValid)
                {
                    // Se abre session con la Base de Datos.
                    using (var session = NHibernateHelperDBWorldPizza.OpenSession())
                    {
                        // Se abre transaccion.
                        using (var transaction = session.BeginTransaction())
                        {
                            try
                            {
                                // Se guarda la Marca en la Base de Datos y se recupera el id generado.
                                session.Save(usuario);

                                // Se confirma transaccion.
                                transaction.Commit();

                                usuario.resultado = "Ok";
                            }
                            // Si hubo errores en el alta de la Marca.
                            catch
                            {
                                // Se vuelve atras la transaccion.
                                transaction.Rollback();

                                // Guarda el error
                                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al dar de alta el usuario." });
                                usuario.errores = errores;
                                usuario.resultado = "Error";
                            }
                        }
                    }
                }
                else
                {
                    foreach (ValidationFailure detalleError in result.Errors)
                    {
                        // Se agrega a la lista el código y detalle del error de validación.
                        errores.Add(new Errores()
                        {
                            cod_error = detalleError.ErrorCode,
                            descripcion = detalleError.ErrorMessage,
                            propiedad = detalleError.PropertyName
                        });
                    }

                    // Se guardan los errores.
                    usuario.resultado = "Error";
                    usuario.errores = errores;
                }
            }
            catch
            {
                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al intentar conectarse a la base de datos." });
                usuario.errores = errores;
                usuario.resultado = "Error";
            }

            return usuario;
        }

        public Resultado BUsuario(Usuarios usuario)
        {
            // Se instancia la clase Resultado y se setea la variable en "Ok".
            Resultado resultado = new Resultado() { resultado = "Ok" };            

            // Se instancia la clase Errores como una lista.
            List<Errores> errores = new List<Errores>();


            try
            {
                // Se instancia la clase UsuariosValidator.
                UsuariosValidator validator = new UsuariosValidator();

                // Se llama al metodo de validacion pasandole como parametros la validacion y la regla de validacion.
                ValidationResult result = validator.Validate(usuario, ruleSet: "Delete");

                // Si no hay errores en la validacion.
                if (result.IsValid)
                {
                    // Se abre sesion con la Base de Datos.
                    using (var session = NHibernateHelperDBWorldPizza.OpenSession())
                    {                      

                        // Se comienza transaccion.
                        using (var transaction = session.BeginTransaction())
                        {
                            try
                            {
                                // Se elimina el usuario.
                                session.Delete(usuario);

                                // Se confirma transaccion.
                                transaction.Commit();
                            }
                            // En caso de haber errores en la baja.
                            catch
                            {
                                // Se vuelve atras la transaccion.
                                transaction.Rollback();

                                // Se guarda el error.
                                errores.Add(new Errores { cod_error = "0001", descripcion = "Error en la baja del usuario." });                                
                                resultado.errores = errores;                                
                                resultado.resultado = "Error";
                            }
                        }
                    }
                }
                else
                {
                    foreach (ValidationFailure detalleError in result.Errors)
                    {
                        // Se agrega a la lista el código y detalle del error de validación.
                        errores.Add(new Errores()
                        {
                            cod_error = detalleError.ErrorCode,
                            descripcion = detalleError.ErrorMessage,
                            propiedad = detalleError.PropertyName
                        });
                    }

                    // Se guardan los errores.
                    resultado.resultado = "Error";
                    resultado.errores = errores;

                }
            }
            // En caso de haber errores en el proceso.
            catch
            {
                // Se guarda el error.
                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al intentar conectarse a la base de datos." });                
                resultado.errores = errores;                
                resultado.resultado = "Error";
            }
            
            return resultado;
        }

        public Resultado MUsuario(Usuarios usuario)
        {
            // Se instancia la clase Resultado y se setea la variable en "Ok".
            Resultado resultado = new Resultado() { resultado = "Ok" };

            // Se instancia la clase Errores como una lista.
            List<Errores> errores = new List<Errores>();


            try
            {
                // Se instancia la clase UsuariosValidator
                UsuariosValidator validator = new UsuariosValidator();

                // Se llama al metodo de validacion pasandole el objeto a validar y la regla de validacion.
                ValidationResult result = validator.Validate(usuario, ruleSet: "Edit");

                // Si no hubo errores en la validacion.
                if (result.IsValid)
                {
                    // Se abre sesion con la Base de Datos.
                    using (var session = NHibernateHelperDBWorldPizza.OpenSession())
                    {
                        // Se comienza transaccion.
                        using (var transaction = session.BeginTransaction())
                        {
                            try
                            {
                                // Se actualizan los datos del usuario.
                                session.Update(usuario);

                                // Se confirma transaccion.
                                transaction.Commit();
                            }
                            // En caso de haber errores en la actualizacion de datos.
                            catch
                            {
                                // Se vuelve atras la transaccion.
                                transaction.Rollback();

                                // Se guarda el error.
                                errores.Add(new Errores { cod_error = "0001", descripcion = "Error en la edicion del usuario." });
                                resultado.errores = errores;                                
                                resultado.resultado = "Error";
                            }
                        }
                    }
                }
                else
                {
                    foreach (ValidationFailure detalleError in result.Errors)
                    {
                        // Se agrega a la lista el código y detalle del error de validación.
                        errores.Add(new Errores()
                        {
                            cod_error = detalleError.ErrorCode,
                            descripcion = detalleError.ErrorMessage,
                            propiedad = detalleError.PropertyName
                        });
                    }

                    // Se guardan los errores.
                    resultado.resultado = "Error";
                    resultado.errores = errores;
                }
            }
            catch
            {
                // Se guarda el error.
                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al intentar conectarse con la base de datos." });                
                resultado.errores = errores;               
                resultado.resultado = "Error";
            }
           
            return resultado;
        }
        #endregion ABMCUsuarios

        #region ABMCProductos
        public List<Productos> CProductos(string filtroBusqueda)
        {
            // Se instancia la clase Productos como una lista.
            List<Productos> productosList = new List<Productos>();

            // Se instancia la clase Productos para guardar los errores y resultados de la busqueda.
            Productos producto = new Productos();

            // Se instancia la clase Errores como una lista.
            List<Errores> errores = new List<Errores>();

            try
            {
                // Si el filtro de busqueda el null se setea como vacio.
                if (filtroBusqueda == null) filtroBusqueda = "";

                // Se abre session con la Base de Datos.
                using (var session = NHibernateHelperDBWorldPizza.OpenSession())
                {
                    try
                    {
                        // Se realiza la busqueda de Productos de acuerdo al filtro de busqueda aplicado.
                        productosList = session.QueryOver<Productos>()
                                        .Where(Restrictions.Where<Productos>(m => filtroBusqueda == ""
                                                                               || m.nombre.IsLike("%" + filtroBusqueda + "%")))
                                        .List().ToList();

                        // A todos los resultados le asigno un msj, ya sea Ok o Error.
                        if (productosList.Count > 0)
                        {
                            foreach (Productos p in productosList) { p.resultado = "Ok"; }
                        }
                        else
                        {

                            errores.Add(new Errores { cod_error = "0001", descripcion = "No se recupero ningun producto que coincida con su busqueda." });

                            producto.errores = errores;
                            producto.resultado = "Error";
                            productosList.Add(producto);
                        }
                    }

                    catch
                    {
                        errores.Add(new Errores { cod_error = "0001", descripcion = "Error al consultar los productos." });

                        producto.errores = errores;
                        producto.resultado = "Error";
                        productosList.Add(producto);
                    }

                }


            }
            // En caso de errores en la busqueda.
            catch
            {
                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al intentar conectarse con la base de datos." });

                producto.errores = errores;
                producto.resultado = "Error";
                productosList.Add(producto);
            }


            return productosList;
        }

        public Productos AProducto(Productos producto)
        {
            // Se instancia la clase Errores como una lista.
            List<Errores> errores = new List<Errores>();

            try
            {
                // Se instancia la clase ProductosValidator.
                ProductosValidator validator = new ProductosValidator();

                // Se llama al metodo de validacion pasandole como parametros la validacion y regla a validar.
                ValidationResult result = validator.Validate(producto, ruleSet: "Create");

                // Si no hubo errores en la validacion.
                if (result.IsValid)
                {
                    // Se abre session con la Base de Datos.
                    using (var session = NHibernateHelperDBWorldPizza.OpenSession())
                    {
                        // Se abre transaccion.
                        using (var transaction = session.BeginTransaction())
                        {
                            try
                            {
                                // Se guarda la Marca en la Base de Datos y se recupera el id generado.
                                producto.id = (int)session.Save(producto);

                                // Se confirma transaccion.
                                transaction.Commit();

                                producto.resultado = "Ok";
                            }
                            // Si hubo errores en el alta de la Marca.
                            catch
                            {
                                // Se vuelve atras la transaccion.
                                transaction.Rollback();

                                // Se llama al metodo que realiza el registro de errores y se agrega a la lista de errores el objeto devuelto por el metodo.
                                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al dar de alta el producto." });

                                // Se agrega al cliente a la lista de errores.
                                producto.errores = errores;

                                // Se setea la variable del objeto indicando que hubo error.
                                producto.resultado = "Error";
                            }
                        }
                    }
                }
                else
                {
                    

                    foreach (ValidationFailure detalleError in result.Errors)
                    {
                        // Se agrega a la lista el código y detalle del error de validación.
                        errores.Add(new Errores()
                        {
                            cod_error = detalleError.ErrorCode,
                            descripcion = detalleError.ErrorMessage,
                            propiedad = detalleError.PropertyName
                        });
                    }

                    // Se guarda en el objeto cliente el objeto resultado con el resultado de la validacion de la Marca al dar de alta.
                    producto.resultado = "Error";
                    producto.errores = errores;
                }
            }
            catch
            {
                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al intentar conectarse a la base de datos." });
                producto.errores = errores;
                producto.resultado = "Error";
            }


            return producto;
        }

        public Resultado MProducto(Productos producto)
        {
            // Se instancia la clase Resultado y se setea la variable en "Ok".
            Resultado resultado = new Resultado() { resultado = "Ok" };

            // Se instancia la clase Errores como una lista.
            List<Errores> errores = new List<Errores>();

            
            try
            {
                // Se instancia la clase ProductosValidator
                ProductosValidator validator = new ProductosValidator();

                // Se llama al metodo de validacion pasandole el objeto a validar y la regla de validacion.
                ValidationResult result = validator.Validate(producto, ruleSet: "Edit");

                // Si no hubo errores en la validacion.
                if (result.IsValid)
                {
                    // Se abre sesion con la Base de Datos.
                    using (var session = NHibernateHelperDBWorldPizza.OpenSession())
                    {
                        // Se comienza transaccion.
                        using (var transaction = session.BeginTransaction())
                        {
                            try
                            {
                                // Se actualizan los datos del producto.
                                session.Update(producto);

                                // Se confirma transaccion.
                                transaction.Commit();
                            }
                            // En caso de haber errores en la actualizacion de datos.
                            catch
                            {
                                // Se vuelve atras la transaccion.
                                transaction.Rollback();

                                
                                errores.Add(new Errores { cod_error = "0001", descripcion = "Error en la edicion del producto."});

                                // Se agrega el resultado a la lista de errores.
                                resultado.errores = errores;

                                // Se setea la variable del objeto indicando que hubo error.
                                resultado.resultado = "Error";
                            }
                        }
                    }
                }
                else
                {
                    

                    foreach (ValidationFailure detalleError in result.Errors)
                    {
                        // Se agrega a la lista el código y detalle del error de validación.
                        errores.Add(new Errores()
                        {
                            cod_error = detalleError.ErrorCode,
                            descripcion = detalleError.ErrorMessage,
                            propiedad = detalleError.PropertyName
                        });
                    }

                    // Se guarda en el objeto cliente el objeto resultado con el resultado de la validacion de la Marca al dar de baja.
                    resultado.resultado = "Error";
                    resultado.errores = errores;
                }
            }
            catch
            {
                // Se llama al metodo que registra los errores y se agrega a la lista de errores el objeto devuelto por el metodo.
                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al intentar conectarse con la base de datos."});

                // Se agrega el resultado a la lista de errores.
                resultado.errores = errores;

                // Se setea la variable del objeto indicando que hubo error.
                resultado.resultado = "Error";
            }

            // Se devuelve el resultado de la modificacion de la Marca.
            return resultado;
        }

        public Resultado BProducto(int id_producto)
        {
            // Se instancia la clase Resultado y se setea la variable en "Ok".
            Resultado resultado = new Resultado() { resultado = "Ok" };

            // Se instancia la clase Productos.
            Productos producto = new Productos() { id = id_producto };

            // Se instancia la clase Errores como una lista.
            List<Errores> errores = new List<Errores>();

           
            try
            {
                // Se instancia la clase ProductosValidator.
                ProductosValidator validator = new ProductosValidator();

                // Se llama al metodo de validacion pasandole como parametros la validacion y la regla de validacion.
                ValidationResult result = validator.Validate(producto, ruleSet: "Delete");

                // Si no hay errores en la validacion.
                if (result.IsValid)
                {
                    // Se abre sesion con la Base de Datos.
                    using (var session = NHibernateHelperDBWorldPizza.OpenSession())
                    {
                        // Se busca en la Base de Datos el producto por su id.
                        producto = session.Get<Productos>(id_producto);

                        // Se comienza transaccion.
                        using (var transaction = session.BeginTransaction())
                        {
                            try
                            {
                                // Se elimina el producto.
                                session.Delete(producto);

                                // Se confirma transaccion.
                                transaction.Commit();                              
                            }
                            // En caso de haber errores en la baja.
                            catch
                            {
                                // Se vuelve atras la transaccion.
                                transaction.Rollback();

                                // Se llama al metodo que realiza el registro de errores y se agrega a la lista de errores el objeto devuelto por el metodo.
                                errores.Add(new Errores { cod_error = "0001", descripcion = "Error en la baja del producto."});

                                // Se agrega al resultado la lista de errores.
                                resultado.errores = errores;

                                // Se setea la variable del objeto indicando que hubo un error.
                                resultado.resultado = "Error";
                            }
                        }
                    }
                }
                else
                {
                    foreach (ValidationFailure detalleError in result.Errors)
                    {
                        // Se agrega a la lista el código y detalle del error de validación.
                        errores.Add(new Errores()
                        {
                            cod_error = detalleError.ErrorCode,
                            descripcion = detalleError.ErrorMessage,
                            propiedad = detalleError.PropertyName
                        });
                    }

                    // Se guarda en el objeto cliente el objeto resultado con el resultado de la validacion de la Marca al dar de baja.
                    resultado.resultado = "Error";
                    resultado.errores = errores;

                }
            }
            // En caso de haber errores en el proceso.
            catch
            {
                // Se llama al metodo que realiza el registro de errores y se agrega a la lista de errores el objeto devuelto por el metodo.
                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al intentar conectarse a la base de datos."});

                // Se agrega al resultado la lista de errores.
                resultado.errores = errores;

                // Se setea la variable del objeto indicando que hubo un error.
                resultado.resultado = "Error";
            }

            // Se retorna el resultado el resultado de la baja.
            return resultado;
        }
        #endregion ABMCProductos

        #region ABMCEmpleados
        public List<Empleados> CEmpleados(string filtroBusqueda)
        {
            // Se instancia la clase Empleados como una lista.
            List<Empleados> empleadosList = new List<Empleados>();

            // Se instancia la clase Empleados para guardar los errores y resultados de la busqueda.
            Empleados empleado = new Empleados();

            // Se instancia la clase Errores como una lista.
            List<Errores> errores = new List<Errores>();

            try
            {
                // Si el filtro de busqueda el null se setea como vacio.
                if (filtroBusqueda == null) filtroBusqueda = "";

                // Se abre session con la Base de Datos.
                using (var session = NHibernateHelperDBWorldPizza.OpenSession())
                {
                    try
                    {
                        // Se realiza la busqueda de Empleados de acuerdo al filtro de busqueda aplicado.
                        empleadosList = session.QueryOver<Empleados>()
                                        .Where(Restrictions.Where<Empleados>(m => filtroBusqueda == ""
                                                                               || m.apellido_nombre.IsLike("%" + filtroBusqueda + "%")))
                                        .List().ToList();

                        // A todos los resultados le asigno un msj, ya sea Ok o Error.
                        if (empleadosList.Count > 0)
                        {
                            foreach (Empleados e in empleadosList) { e.resultado = "Ok"; }
                        }
                        else
                        {

                            errores.Add(new Errores { cod_error = "0001", descripcion = "No se recupero ningun empleado que coincida con su busqueda." });

                            empleado.errores = errores;
                            empleado.resultado = "Error";
                            empleadosList.Add(empleado);
                        }
                    }
                    catch
                    {
                        errores.Add(new Errores { cod_error = "0001", descripcion = "Error al consultar los empleados." });

                        empleado.errores = errores;
                        empleado.resultado = "Error";
                        empleadosList.Add(empleado);
                    }
                }
            }
            // En caso de errores en la busqueda.
            catch
            {
                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al intentar conectarse con la base de datos." });

                empleado.errores = errores;
                empleado.resultado = "Error";
                empleadosList.Add(empleado);
            }

            return empleadosList;
        }

        public Empleados AEmpleado(Empleados empleado)
        {
            // Se instancia la clase Errores como una lista.
            List<Errores> errores = new List<Errores>();

            try
            {
                // Se instancia la clase EmpleadosValidator.
                EmpleadosValidator validator = new EmpleadosValidator();

                // Se llama al metodo de validacion pasandole como parametros la validacion y regla a validar.
                ValidationResult result = validator.Validate(empleado, ruleSet: "Create");

                // Si no hubo errores en la validacion.
                if (result.IsValid)
                {
                    // Se abre session con la Base de Datos.
                    using (var session = NHibernateHelperDBWorldPizza.OpenSession())
                    {
                        empleado.fecha_alta = DateTime.Now;

                        // Se abre transaccion.
                        using (var transaction = session.BeginTransaction())
                        {
                            try
                            {
                                // Se guarda la Marca en la Base de Datos y se recupera el id generado.
                                empleado.id = (int)session.Save(empleado);

                                // Se confirma transaccion.
                                transaction.Commit();

                                empleado.resultado = "Ok";
                            }
                            // Si hubo errores en el alta de la Marca.
                            catch
                            {
                                // Se vuelve atras la transaccion.
                                transaction.Rollback();

                                // Se llama al metodo que realiza el registro de errores y se agrega a la lista de errores el objeto devuelto por el metodo.
                                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al dar de alta el empleado." });

                                // Se agrega al cliente a la lista de errores.
                                empleado.errores = errores;

                                // Se setea la variable del objeto indicando que hubo error.
                                empleado.resultado = "Error";
                            }
                        }
                    }
                }
                else
                {
                    foreach (ValidationFailure detalleError in result.Errors)
                    {
                        // Se agrega a la lista el código y detalle del error de validación.
                        errores.Add(new Errores()
                        {
                            cod_error = detalleError.ErrorCode,
                            descripcion = detalleError.ErrorMessage,
                            propiedad = detalleError.PropertyName
                        });
                    }

                    // Se guarda en el objeto cliente el objeto resultado con el resultado de la validacion de la Marca al dar de alta.
                    empleado.resultado = "Error";
                    empleado.errores = errores;
                }
            }
            catch
            {
                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al intentar conectarse a la base de datos." });
                empleado.errores = errores;
                empleado.resultado = "Error";
            }


            return empleado;
        }

        public Resultado MEmpleado(Empleados empleado)
        {
            // Se instancia la clase Resultado y se setea la variable en "Ok".
            Resultado resultado = new Resultado() { resultado = "Ok" };

            // Se instancia la clase Errores como una lista.
            List<Errores> errores = new List<Errores>();


            try
            {
                // Se instancia la clase EmpleadosValidator
                EmpleadosValidator validator = new EmpleadosValidator();

                // Se llama al metodo de validacion pasandole el objeto a validar y la regla de validacion.
                ValidationResult result = validator.Validate(empleado, ruleSet: "Edit");

                // Si no hubo errores en la validacion.
                if (result.IsValid)
                {
                    // Se abre sesion con la Base de Datos.
                    using (var session = NHibernateHelperDBWorldPizza.OpenSession())
                    {
                        // Se comienza transaccion.
                        using (var transaction = session.BeginTransaction())
                        {
                            try
                            {
                                // Se actualizan los datos del empleado.
                                session.Update(empleado);

                                // Se confirma transaccion.
                                transaction.Commit();


                                empleado.resultado = "Ok";
                            }
                            // En caso de haber errores en la actualizacion de datos.
                            catch
                            {
                                // Se vuelve atras la transaccion.
                                transaction.Rollback();


                                errores.Add(new Errores { cod_error = "0001", descripcion = "Error en la edicion del empleado." });

                                // Se agrega el resultado a la lista de errores.
                                resultado.errores = errores;

                                // Se setea la variable del objeto indicando que hubo error.
                                resultado.resultado = "Error";
                            }
                        }
                    }
                }
                else
                {


                    foreach (ValidationFailure detalleError in result.Errors)
                    {
                        // Se agrega a la lista el código y detalle del error de validación.
                        errores.Add(new Errores()
                        {
                            cod_error = detalleError.ErrorCode,
                            descripcion = detalleError.ErrorMessage,
                            propiedad = detalleError.PropertyName
                        });
                    }

                    // Se guarda en el objeto cliente el objeto resultado con el resultado de la validacion de la Marca al dar de baja.
                    resultado.resultado = "Error";
                    resultado.errores = errores;
                }
            }
            catch
            {
                // Se llama al metodo que registra los errores y se agrega a la lista de errores el objeto devuelto por el metodo.
                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al intentar conectarse con la base de datos." });

                // Se agrega el resultado a la lista de errores.
                resultado.errores = errores;

                // Se setea la variable del objeto indicando que hubo error.
                resultado.resultado = "Error";
            }

            // Se devuelve el resultado de la modificacion de la Marca.
            return resultado;
        }

        public Resultado BEmpleado(int id_empleado)
        {
            // Se instancia la clase Resultado y se setea la variable en "Ok".
            Resultado resultado = new Resultado() { resultado = "Ok" };

            // Se instancia la clase Empleados.
            Empleados empleado = new Empleados() { id = id_empleado };

            // Se instancia la clase Errores como una lista.
            List<Errores> errores = new List<Errores>();


            try
            {
                // Se instancia la clase EmpleadosValidator.
                EmpleadosValidator validator = new EmpleadosValidator();

                // Se llama al metodo de validacion pasandole como parametros la validacion y la regla de validacion.
                ValidationResult result = validator.Validate(empleado, ruleSet: "Delete");

                // Si no hay errores en la validacion.
                if (result.IsValid)
                {
                    // Se abre sesion con la Base de Datos.
                    using (var session = NHibernateHelperDBWorldPizza.OpenSession())
                    {
                        // Se busca en la Base de Datos el empleado por su id.
                        empleado = session.Get<Empleados>(id_empleado);
                        empleado.fecha_baja = DateTime.Now;

                        // Se comienza transaccion.
                        using (var transaction = session.BeginTransaction())
                        {
                            try
                            {
                                // Se elimina el empleado.
                                session.Update(empleado);

                                // Se confirma transaccion.
                                transaction.Commit();
                            }
                            // En caso de haber errores en la baja.
                            catch
                            {
                                // Se vuelve atras la transaccion.
                                transaction.Rollback();

                                // Se llama al metodo que realiza el registro de errores y se agrega a la lista de errores el objeto devuelto por el metodo.
                                errores.Add(new Errores { cod_error = "0001", descripcion = "Error en la baja del empleado." });

                                // Se agrega al resultado la lista de errores.
                                resultado.errores = errores;

                                // Se setea la variable del objeto indicando que hubo un error.
                                resultado.resultado = "Error";
                            }
                        }
                    }
                }
                else
                {
                    foreach (ValidationFailure detalleError in result.Errors)
                    {
                        // Se agrega a la lista el código y detalle del error de validación.
                        errores.Add(new Errores()
                        {
                            cod_error = detalleError.ErrorCode,
                            descripcion = detalleError.ErrorMessage,
                            propiedad = detalleError.PropertyName
                        });
                    }

                    // Se guarda en el objeto cliente el objeto resultado con el resultado de la validacion de la Marca al dar de baja.
                    resultado.resultado = "Error";
                    resultado.errores = errores;

                }
            }
            // En caso de haber errores en el proceso.
            catch
            {
                // Se llama al metodo que realiza el registro de errores y se agrega a la lista de errores el objeto devuelto por el metodo.
                errores.Add(new Errores { cod_error = "0001", descripcion = "Error al intentar conectarse a la base de datos." });

                // Se agrega al resultado la lista de errores.
                resultado.errores = errores;

                // Se setea la variable del objeto indicando que hubo un error.
                resultado.resultado = "Error";
            }

            // Se retorna el resultado el resultado de la baja.
            return resultado;
        }
        #endregion ABMCEmpleados

    }
}