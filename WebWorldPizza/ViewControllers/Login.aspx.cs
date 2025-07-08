using NHibernate.Transform;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;
using WebWorldPizza.Helpers;
using WebWorldPizza.Models;
using WebWorldPizza.WSWorldPizza;
using WSWorldPizza.Models;

namespace WebWorldPizza.ViewControllers
{
    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void btnLogin_Click(object sender, EventArgs e)
        {
            // Instanciamos la clase errores como una lista.
            List<Errores> errores = new List<Errores>();

            //// Se instancia la clase utilidades.
            //Utilidades utilidades = new Utilidades();

            using (var session = NHibernateHelperDBWorldPizza.OpenSession())
            {
                try
                {
                    // Se ejecuta el procedure que valida que el nombre de usuario u cla
                    outErrorVM outError = session.CreateSQLQuery("exec SP_Login :musuario, :mpass, :mkey")
                                            .SetParameter("musuario", user.Value)
                                            .SetParameter("mpass", pass.Value)
                                            .SetParameter("mkey", "bc548tdk_GestionesMMTesting")
                                            .SetResultTransformer(new AliasToBeanResultTransformer(typeof(outErrorVM)))
                                            .List<outErrorVM>().SingleOrDefault();

                    // Si las credenciales de usuario son correctas.
                    if (outError.error == 0)
                    {
                        // Generar un token CSRF
                        string csrfToken = Guid.NewGuid().ToString();

                        // Almacenar el nombre del usuario para tener control de la session en masterpage.
                        Session["CSRFToken"] = csrfToken;

                        // Conexión al WS-GestionesMM.
                        var _serv = new WSWorldPizza.ServiceWorldPizzaClient();

                        Usuarios usuario = _serv.CUsuario(user.Value, null);

                        // Recuperamos los/el 'EmpleadosSubDepartamentos' para obtener los 'SubDepartamentos', los 'Departamentos' y las 'Areas' al que pertenece.
                        List<EmpleadosSubDepartamentos> empleadosSubDepartamentos = _serv.CEmpleadosSubDepartamentos(usuario.empleado.id, null).ToList();

                        // Recuperamos el rol al que pertenece el usuario.
                        List<UsuariosRoles> usuariosRolesList = _serv.CUsuarioRoles(usuario.usuario);

                        UsuarioSesionVM usuarioSesionVM = new UsuarioSesionVM()
                        {
                            usuario = usuario,
                            empleado = usuario.empleado,
                            //empleadoSubDepartamentoList = empleadosSubDepartamentos,
                            UsuariosRoles = usuariosRolesList
                        };

                        // Generamos una clave con datos y encriptacion convenida, que luego va a ser generada de la misma manera en el cliente para encriptar y desencriptar datos sin tener la clave almacenada.
                        string nombre = user.Value;
                        int number = new Random().Next();
                        string saltAleatorio = GenerateRandomString(20);
                        string clave = nombre + number.ToString();
                        byte[] claveEncriptacion = GenerateKeyFromData(clave, saltAleatorio);
                        string claveEncriptacionHex = BitConverter.ToString(claveEncriptacion).Replace("-", string.Empty);

                        // Encriptamos el token de usuario.
                        string csrfTokenEncrypt = Encrypt(csrfToken, claveEncriptacionHex);

                        // Encriptamos y guardamos datos del usuario que inició session.
                        JavaScriptSerializer serializer = new JavaScriptSerializer();
                        string json = serializer.Serialize(usuarioSesionVM);
                        string encryptedJson = Encrypt(json, claveEncriptacionHex);

                        // Recuperamos las pantallas pertenecientes al rol.
                        string pantallasRol = getEncriptedPantallasRol(usuariosRolesList, claveEncriptacionHex);

                        // Recuperamos los menus pertenecientes al rol.
                        string menusRol = getEncriptedMenuRol(usuariosRolesList, claveEncriptacionHex);

                        // Localidades sistema.
                        List<Localidades> localidadesList = _serv.CLocalidades("");
                        string json2 = serializer.Serialize(localidadesList);
                        string encryptedJsonLocalidades = Encrypt(json2, claveEncriptacionHex);

                        // Estados gestiones.
                        List<EstadosGestiones> estadosList = _serv.CEstadosGestiones("");
                        string jsonEstados = serializer.Serialize(estadosList);
                        string encryptedEstados = Encrypt(jsonEstados, claveEncriptacionHex);

                        string script2 = $@"
                            <script>
                                sessionStorage.setItem('name', '{nombre}');
                                sessionStorage.setItem('number', '{number.ToString()}');
                                sessionStorage.setItem('salt', '{saltAleatorio}');
                                sessionStorage.setItem('tkn', '{csrfTokenEncrypt.ToString()}');
                                sessionStorage.setItem('sessionUsr', '{encryptedJson}');
                                sessionStorage.setItem('localidadesSistema', '{encryptedJsonLocalidades}');
                                sessionStorage.setItem('estadosGestiones', '{encryptedEstados}');
                                sessionStorage.setItem('pantallasRol', '{pantallasRol}');
                                sessionStorage.setItem('menusRol', '{menusRol}');
                                window.location.href = '/ViewControllers/Home.aspx';
                            </script>";
                        ClientScriptManager cs = Page.ClientScript;
                        cs.RegisterStartupScript(this.GetType(), "SetSessionData", script2);

                    }
                    else
                    {
                        divError.Visible = true;
                    }

                }
                // Si se presentó un error al intentar validar un usuario.
                catch (Exception ex)
                {
                    // Se llama al método que realiza el registro de errores
                    errores.Add(utilidades.Aerror(
                        "0001",
                        "Login",
                        "DBGestionesMM",
                        $"Error validar las credenciales del usuario({user.Value}, pass({pass.Value})) " +
                        "Contáctese con sistemas.",
                        "",
                        false,
                        ex.Message
                        ));

                }

            }
        }

        public static string getEncriptedPantallasRol(List<UsuariosRoles> usuariosRoles, string claveEncriptacion)
        {
            var _serv = new ServiceWorldPizzaClient();

            List<string> listaPantallas = usuariosRoles
                .SelectMany(elem => _serv.CPantallasRoles(elem.id))
                .Select(pant => pant.pantalla.nombre_pantalla)
                .ToList();

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            string json = serializer.Serialize(listaPantallas);
            string encryptedJson = Encrypt(json, claveEncriptacion);

            return encryptedJson;
        }

        public static string Encrypt(string plainText, string encryptionKey)
        {
            byte[] plainBytes = Encoding.UTF8.GetBytes(plainText);
            using (Aes aes = Aes.Create())
            {
                aes.Key = StringToByteArray(encryptionKey);
                aes.Mode = CipherMode.ECB;
                aes.Padding = PaddingMode.PKCS7;

                using (ICryptoTransform encryptor = aes.CreateEncryptor())
                {
                    byte[] encryptedBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);
                    return Convert.ToBase64String(encryptedBytes);
                }
            }
        }

        public static byte[] StringToByteArray(string hex)
        {
            int length = hex.Length;
            byte[] bytes = new byte[length / 2];
            for (int i = 0; i < length; i += 2)
            {
                bytes[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
            }
            return bytes;
        }

        public static byte[] GenerateKeyFromData(string data, string saltAleatorio)
        {
            byte[] salt = Encoding.UTF8.GetBytes(saltAleatorio); // Salt aleatorio para mayor seguridad
            int iterations = 1500; // Número de iteraciones

            using (Rfc2898DeriveBytes pbkdf2 = new Rfc2898DeriveBytes(data, salt, iterations))
            {
                return pbkdf2.GetBytes(32); // 32 bytes = 256 bits (tamaño de clave AES)
            }
        }

        public static string getEncriptedMenuRol(List<UsuariosRoles> usuariosRolesList, string claveEncriptacionHex)
        {

            var _serv = new ServiceWorldPizzaClient();

            List<Menus> listaPantallas = usuariosRolesList
                .SelectMany(elem => _serv.CMenusRoles(null, elem.id))
                .Select(menu => menu.menu)
                .ToList();

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            string json = serializer.Serialize(listaPantallas);
            string encryptedJson = Encrypt(json, claveEncriptacionHex);

            return encryptedJson;

        }

        public static string GenerateRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            Random random = new Random();
            char[] randomChars = new char[length];

            for (int i = 0; i < length; i++)
            {
                randomChars[i] = chars[random.Next(chars.Length)];
            }

            return new string(randomChars);
        }
    }
}