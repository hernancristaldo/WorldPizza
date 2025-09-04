using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebWorldPizza.Models
{
    public class Resultado
    {
        public string resultado { get; set; }
        public List<Errores> errores { get; set; }
    }
}