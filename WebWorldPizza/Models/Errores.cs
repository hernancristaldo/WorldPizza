using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebWorldPizza.Models
{
    public class Errores
    {
        public string cod_error { get; set; }
        public string descripcion { get; set; }
        public string mensaje { get; set; }
        public string propiedad { get; set; }
    }
}