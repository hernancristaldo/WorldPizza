using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WSWorldPizza.Models;
using WSWorldPizza.Helpers;
using NHibernate.Criterion;

namespace WSWorldPizza.Controllers
{
    public class ABMCUsuariosController
    {
        string objeto = "usuario";

        public Usuarios AUsuario(Usuarios usuarioAlta)
        {
            //// Se instancia la clase Errores como una lista
            //List<Errores> errores = new List<Errores>();

            
            //try
            //{
            //    using (var sessionDBGestionesMM = NHibernateHelperDBWorldPizza.OpenSession())
            //    {
            //        using (var transaction = sessionDBGestionesMM.BeginTransaction())
            //        {
            //            try
            //            {

            //                UsuariosValidator validator = new UsuariosValidator();

            //                // Validamos el objeto a dar de alta.
            //                ValidationResult result = validator.Validate(usuarioAlta, ruleSet: "Create");

            //                // Si la validación no es correcta retornamos los errores.
            //                if (!result.IsValid) throw new ResultErrorException("", utilidades.AErroresValidacion(result.Errors));

            //                sessionDBGestionesMM.CreateSQLQuery($@"OPEN SYMMETRIC KEY bc548tdk_GestionesMMTesting DECRYPTION BY CERTIFICATE CertificadoDBGestionesMMTesting; 
            //                            INSERT INTO Usuarios VALUES ('{usuarioAlta.usuario}', EncryptByKey( Key_GUID('bc548tdk_GestionesMMTesting'), CONVERT(varchar,'{usuarioAlta.strPass}')), {usuarioAlta.empleado.id})
            //                            CLOSE SYMMETRIC KEY bc548tdk_GestionesMMTesting; ").ExecuteUpdate();

            //                transaction.Commit();

            //                usuarioAlta.resultado = "Ok";

            //            }
            //            // Este catch es llamado si se produce un error de validación.
            //            catch (ResultErrorException result)
            //            {

            //                usuarioAlta.resultado = "Error";
            //                usuarioAlta.errores = result.Errores;

            //            }
            //            catch (Exception ex)
            //            {

            //                transaction.Rollback();

            //                // Se llama al método que realiza el registro de errores
            //                // y se agrega a la lista de errores el objeto devuelto por el método.
            //                errores.Add(utilidades.Aerror(
            //                    "0000",
            //                    MethodBase.GetCurrentMethod().Name,
            //                    "DBGestionesMM",
            //                    "No se pudo guardar el objeto. " +
            //                    "Contáctese con sistemas.",
            //                    "",
            //                    false,
            //                    ex.Message
            //                    ));

            //                // Se setea la variable resultado en "Error"
            //                usuarioAlta.resultado = "Error";

            //                usuarioAlta.errores = errores;

            //            }
            //        }

            //    }

            //}
            //catch (Exception ex)
            //{
            //    // Se llama al método que realiza el registro de errores
            //    // y se agrega a la lista de errores el objeto devuelto por el método.
            //    errores.Add(utilidades.Aerror(
            //        "0000",
            //        MethodBase.GetCurrentMethod().Name,
            //        "DBGestionesMM",
            //        "Error al intentar conectarse a la base de datos. " +
            //        "Contáctese con sistemas.",
            //        "",
            //        false,
            //        ex.Message
            //        ));

            //    // Se setea la variable resultado en "Error"
            //    usuarioAlta.resultado = "Error";

            //    usuarioAlta.errores = errores;

            //}

            return usuarioAlta;

        }

        public Usuarios MUsuario(Usuarios usuarioEditado)
        {
            //// Instanciamos Errores.
            //List<Errores> errores = new List<Errores>();

            

            //try
            //{
            //    using (var sessionDBGestionesMM = NHibernateHelperDBGestionesMM.OpenSession())
            //    {
            //        using (var transaction = sessionDBGestionesMM.BeginTransaction())
            //        {
            //            try
            //            {

            //                UsuariosValidator validator = new UsuariosValidator();

            //                // Validamos el objeto a dar de alta.
            //                ValidationResult result = validator.Validate(usuarioEditado, ruleSet: "Edit");

            //                // Si la validación no es correcta retornamos los errores.
            //                if (!result.IsValid) throw new ResultErrorException("", utilidades.AErroresValidacion(result.Errors));

            //                sessionDBGestionesMM.CreateSQLQuery($@"OPEN SYMMETRIC KEY bc548tdk_GestionesMMTesting DECRYPTION BY CERTIFICATE CertificadoDBGestionesMMTesting; 
            //                        UPDATE Usuarios
            //                        set pass = EncryptByKey(Key_GUID('bc548tdk_GestionesMMTesting'), CONVERT(varchar, '{usuarioEditado.strPass}'))
            //                        where usuario = '{usuarioEditado.usuario}'
            //                        CLOSE SYMMETRIC KEY bc548tdk_GestionesMMTesting;").ExecuteUpdate();

            //                transaction.Commit();

            //                usuarioEditado.resultado = "Ok";

            //            }
            //            // Este catch es llamado si se produce un error de validación.
            //            catch (ResultErrorException result)
            //            {

            //                usuarioEditado.resultado = "Error";
            //                usuarioEditado.errores = result.Errores;

            //            }
            //            catch (Exception ex)
            //            {

            //                transaction.Rollback();

            //                // Se llama al método que realiza el registro de errores
            //                // y se agrega a la lista de errores el objeto devuelto por el método.
            //                errores.Add(utilidades.Aerror(
            //                    "0000",
            //                    MethodBase.GetCurrentMethod().Name,
            //                    "DBGestionesMM",
            //                    "No se pudo editar el objeto. " +
            //                    "Contáctese con sistemas.",
            //                    "",
            //                    false,
            //                    ex.Message
            //                    ));

            //                // Se setea la variable resultado en "Error"
            //                usuarioEditado.resultado = "Error";

            //                usuarioEditado.errores = errores;

            //            }
            //        }

            //    }

            //}
            //catch (Exception ex)
            //{
            //    // Se llama al método que realiza el registro de errores
            //    // y se agrega a la lista de errores el objeto devuelto por el método.
            //    errores.Add(utilidades.Aerror(
            //        "0000",
            //        MethodBase.GetCurrentMethod().Name,
            //        "DBGestionesMM",
            //        "Error al intentar conectarse a la base de datos. " +
            //        "Contáctese con sistemas.",
            //        "",
            //        false,
            //        ex.Message
            //        ));

            //    // Se setea la variable resultado en "Error"
            //    usuarioEditado.resultado = "Error";

            //    usuarioEditado.errores = errores;

            //}

            return usuarioEditado;

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

                        if (nombreUsuario != "") query.And(a => a.usuario.IsLike(nombreUsuario));

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
                                descripcion = $"No se recupero ningun {objeto} que coincida con su busqueda.",
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
                    catch (Exception ex)
                    {
                        // Se agrega el error a la lista.
                        errores.Add(new Errores { 
                            cod_error = "0001",
                            descripcion = $"Error al consultar el {objeto}."
                        });

                        // Se setea la variable resultado en "Error"
                        usuario.resultado = "Error";

                        usuario.errores = errores;

                    }
                }

            }
            catch (Exception ex)
            {

                // Se agrega el error a la lista.
                errores.Add(new Errores { 
                    cod_error = "0001",
                    descripcion = "Error al intentar conectarse a la base de datos."
                });

                // Se setea la variable resultado en "Error"
                usuario.resultado = "Error";

                usuario.errores = errores;

            }

            return usuario;

        }

        public List<Usuarios> CUsuarios(string filtroBusqueda)
        {
            // Instanciamos una lista de objetos.
            List<Usuarios> usuariosList = new List<Usuarios>();

            // Instanciamos objeto.
            Usuarios usuario = new Usuarios();

            // Instanciamos una lista de Errores.
            List<Errores> errores = new List<Errores>();

            Errores error = new Errores();

            try
            {
                using (var sessionDBGestionesMM = NHibernateHelperDBWorldPizza.OpenSession())
                {
                    try
                    {

                        var query = sessionDBGestionesMM.QueryOver<Usuarios>()
                                                        .Where(a => a.usuario != "");

                        if (filtroBusqueda != "") query.And(c => c.usuario.IsLike(filtroBusqueda, MatchMode.Anywhere));

                        usuariosList = new List<Usuarios>(query.List());

                        // Si la búsqueda no retorna resultados.
                        if (usuariosList.Count == 0) {

                            error = new Errores()
                            {
                                descripcion = $"No se recupero ningun {objeto} que coincida con su busqueda",
                                cod_error = "0001"
                            };

                            errores.Add(error);

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
                    catch (Exception ex)
                    {
                        // Se agrega el error a la lista de errores.
                        errores.Add(new Errores
                        {
                            cod_error = "0001",
                            descripcion = $"Error al consultar el {objeto}"
                        });

                        // Se setea la variable 'resultado' en "Error"
                        usuario.resultado = "Error";

                        usuario.errores = errores;

                        usuariosList.Add(usuario);
                    }
                }
            }
            catch (Exception ex)
            {

                // Se agrega el error a la lista.
                errores.Add(new Errores
                {
                    cod_error = "0001",
                    descripcion = "Error al intentar conectarse con la base de datos."
                });

                usuario.errores = errores;

                // Se setea la variable 'resultado' en "Error".
                usuario.resultado = "Error";

                usuariosList.Add(usuario);

            }

            return usuariosList;

        }
    }
}