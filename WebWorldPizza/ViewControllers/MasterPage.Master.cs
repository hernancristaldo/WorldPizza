using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebWorldPizza.ViewControllers
{
    public partial class MasterPage : System.Web.UI.MasterPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                try
                {
                    // Obtenemos y encriptamos el token.
                    var csrfToken = Session["CSRFToken"].ToString();
                }
                catch
                {
                    // Redirige al usuario a una página de cierre de sesión o a la página de inicio de sesión
                    Response.Redirect("~/ViewControllers/Login.aspx");
                }
            }
        }
    }
}