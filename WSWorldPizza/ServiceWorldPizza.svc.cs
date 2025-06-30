using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WSWorldPizza
{
    public class ServiceWorldPizza : IServiceWorldPizza
    {
        public string bienvenida()
        {
            return "Bienvenido a World Pizza!";
        }
    }
}