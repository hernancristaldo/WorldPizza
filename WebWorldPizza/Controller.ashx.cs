using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using WebWorldPizza.Models;

namespace WebWorldPizza
{
    /// <summary>
    /// Descripción breve de Controller
    /// </summary>
    public class Controller : IHttpHandler, System.Web.SessionState.IReadOnlySessionState
    {
        Metodos metodo = new Metodos();

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                context.Response.ContentType = "application/json";

                if (!IsAuthorized(context.Request))
                {
                    throw new UnauthorizedAccessException("Acceso no autorizado");
                }

                var requestData = GetRequestData(context);

                if (requestData == null || string.IsNullOrEmpty(requestData.accion))
                {
                    throw new ArgumentException("Solicitud no válida");
                }

                switch (requestData.accion)
                {
                    case "CrearApiKey":
                        context.Response.Write(JsonConvert.SerializeObject(CrearApiKey()));
                        break;

                    case "CProductos":
                        context.Response.Write(JsonConvert.SerializeObject(CProductos(requestData)));
                        break;

                    case "AProducto":
                        context.Response.Write(JsonConvert.SerializeObject(AProducto(requestData)));
                        break;

                    case "BProducto":
                        context.Response.Write(JsonConvert.SerializeObject(BProducto(requestData)));
                        break;

                    case "MProducto":
                        context.Response.Write(JsonConvert.SerializeObject(MProducto(requestData)));
                        break;

                    case "CEmpleados":
                        context.Response.Write(JsonConvert.SerializeObject(CEmpleados(requestData)));
                        break;

                    case "AEmpleado":
                        context.Response.Write(JsonConvert.SerializeObject(AEmpleado(requestData)));
                        break;

                    case "BEmpleado":
                        context.Response.Write(JsonConvert.SerializeObject(BEmpleado(requestData)));
                        break;

                    case "MEmpleado":
                        context.Response.Write(JsonConvert.SerializeObject(MEmpleado(requestData)));
                        break;

                    default:
                        throw new ArgumentException("Solicitud no válida");
                }
            }
            catch (UnauthorizedAccessException)
            {
                HandleError(context, "Error", "Acceso no autorizado", HttpStatusCode.Forbidden);
            }
            catch (ArgumentException)
            {
                HandleError(context, "Error", "Solicitud no válida", HttpStatusCode.BadRequest);
            }
            catch (Exception)
            {
                HandleError(context, "Error", "Se produjo un error al procesar la solicitud", HttpStatusCode.InternalServerError);
            }
        }

        private string GetRequestBody(HttpContext context)
        {
            using (var reader = new StreamReader(context.Request.InputStream, context.Request.ContentEncoding))
            {
                return reader.ReadToEnd();
            }
        }

        /// <summary>
        /// Obtiene los datos de la request: si hay JSON en el body lo deserializa,
        /// si no, convierte el QueryString en JSON y lo deserializa en RequestData.
        /// </summary>
        private RequestData GetRequestData(HttpContext context)
        {
            string requestBody = GetRequestBody(context);

            if (!string.IsNullOrEmpty(requestBody))
            {
                // Caso POST con JSON
                return JsonConvert.DeserializeObject<RequestData>(requestBody);
            }
            else if (context.Request.QueryString.HasKeys())
            {
                // Caso GET con querystring → convertir a diccionario → JSON
                var dict = context.Request.QueryString.AllKeys
                    .Where(k => k != null)
                    .ToDictionary(k => k, k => context.Request.QueryString[k]);

                string json = JsonConvert.SerializeObject(dict);
                return JsonConvert.DeserializeObject<RequestData>(json);
            }

            return null;
        }

        void HandleError(HttpContext context, string resultado, string descripcion, HttpStatusCode statusCode)
        {
            Errores error = new Errores() { descripcion = descripcion };
            List<Errores> errores = new List<Errores>() { error };
            Resultado resultadoObj = new Resultado() { resultado = resultado, errores = errores };

            context.Response.StatusCode = (int)statusCode;
            context.Response.Write(JsonConvert.SerializeObject(resultadoObj));
        }

        public class RequestData
        {
            public string accion { get; set; }
            public string filtroBusqueda { get; set; }
            public Productos producto { get; set; }
            public int id_producto { get; set; }
            public Empleados empleado { get; set; }
            public int id_empleado { get; set; }
            
        }

        private bool IsAuthorized(HttpRequest request)
        {
            // 1. Validación por token de sesión (uso interno)
            string csrfHeader = request.Headers["X-CSRF-Token"];
            if (!string.IsNullOrEmpty(csrfHeader))
            {
                string csrfToken = HttpContext.Current.Session["CSRFToken"] as string;
                if (string.Equals(csrfHeader, csrfToken))
                    return true;
            }

            // 2. Validación por API Key (uso externo)
            string apiKey = request.Headers["X-Api-Key"]; // primero pruebo por header
            if (string.IsNullOrEmpty(apiKey))
            {
                apiKey = request.QueryString["apiKey"]; // si no viene por header, busco en query
            }

            if (!string.IsNullOrEmpty(apiKey))
            {
                return ValidateApiKey(apiKey); // validar contra BD
            }

            return false;
        }

        private bool ValidateApiKey(string apiKey)
        {
            // Acá deberías validar en la base de datos si existe la API Key
            // Ejemplo simplificado:
            return !string.IsNullOrEmpty(apiKey);
        }

        private string CrearApiKey()
        {
            return metodo.GenerateApiKey();
        }

        private List<Productos> CProductos(RequestData data)
        {
            return metodo.CProductos(data.filtroBusqueda);
        }

        private Productos AProducto(RequestData data)
        {
            return metodo.AProducto(data.producto);
        }

        private Resultado MProducto(RequestData data)
        {
            return metodo.MProducto(data.producto);
        }

        private Resultado BProducto(RequestData data)
        {
            return metodo.BProducto(data.id_producto);
        }

        private List<Empleados> CEmpleados(RequestData data)
        {
            return metodo.CEmpleados(data.filtroBusqueda);
        }

        private Empleados AEmpleado(RequestData data)
        {
            return metodo.AEmpleado(data.empleado);
        }

        private Resultado MEmpleado(RequestData data)
        {
            return metodo.MEmpleado(data.empleado);
        }

        private Resultado BEmpleado(RequestData data)
        {
            return metodo.BEmpleado(data.id_empleado);
        }

        public bool IsReusable => false;
    }
}