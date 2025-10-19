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
using WebWorldPizza.Models.ViewModels;


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

            Metodos metodo = new Metodos();

            using (var session = NHibernateHelperDBWorldPizza.OpenSession())
            {
                try
                {                   

                    Usuarios usuario = metodo.CUsuario(user.Value, pass.Value);

                    // Si las credenciales de usuario son correctas.
                    if (usuario.resultado == "Ok")
                    {
                        // Generar un token CSRF
                        string csrfToken = Guid.NewGuid().ToString();

                        // Almacenar el nombre del usuario para tener control de la session en masterpage.
                        Session["CSRFToken"] = csrfToken;                        

                        // Recuperamos el rol al que pertenece el usuario.
                        List<UsuariosRoles> usuarioRolesList = metodo.CUsuarioRoles(usuario.usuario, null);

                        UsuarioSesionVM usuarioSesionVM = new UsuarioSesionVM()
                        {
                            usuario = usuario,
                            empleado = usuario.empleado,                            
                            usuarioRoles = usuarioRolesList
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
                        string pantallasRol = getEncriptedPantallasRol(usuarioRolesList, claveEncriptacionHex);

                        // Recuperamos los menus pertenecientes al rol.
                        string menusRol = getEncriptedMenuRol(usuarioRolesList, claveEncriptacionHex);                        

                        string script2 = $@"
                            <script>
                                sessionStorage.setItem('name', '{nombre}');
                                sessionStorage.setItem('number', '{number}');
                                sessionStorage.setItem('salt', '{saltAleatorio}');
                                sessionStorage.setItem('tkn', '{csrfTokenEncrypt}');
                                sessionStorage.setItem('sessionUsr', '{encryptedJson}');        
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
                catch
                {
                    // Se llama al método que realiza el registro de errores
                    errores.Add(new Errores
                    {
                        cod_error = "0001",
                        descripcion = $"Error validar las credenciales del usuario: {user.Value}, pass: {pass.Value}. Contáctese con sistemas."
                    });

                }

            }
        }

        public static string getEncriptedPantallasRol(List<UsuariosRoles> usuarioRolesList, string claveEncriptacion)
        {
            Metodos metodo = new Metodos();

            List<string> listaPantallas = usuarioRolesList
                .SelectMany(elem => metodo.CPantallasRoles(elem.rol.id))
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
            Metodos metodo = new Metodos();

            List<Menus> listaPantallas = usuariosRolesList
                .SelectMany(elem => metodo.CMenusRoles(null, elem.rol.id))
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