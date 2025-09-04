using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebWorldPizza.Models
{
    public class Usuarios
    {
        public virtual string usuario { get; set; }
        public virtual Empleados empleado { get; set; }

        [NotMapped]
        public virtual string resultado { get; set; }

        [NotMapped]
        public virtual string strPass { get; set; }

        [NotMapped]
        public virtual List<Errores> errores { get; set; }
    }
}