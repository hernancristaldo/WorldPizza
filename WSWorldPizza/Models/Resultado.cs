using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WSWorldPizza.Models
{
    public class Resultado
    {
        public string resultado { get; set; }

        public List<Errores> errores { get; set; }
    }
}