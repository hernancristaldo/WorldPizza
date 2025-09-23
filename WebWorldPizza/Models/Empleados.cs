using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebWorldPizza.Models
{

    public class Empleados
    {
        public virtual int id { get; set; }
        public virtual string dni { get; set; }
        public virtual string apellido_nombre { get; set; }
        public virtual DateTime? fecha_nacimiento { get; set; }
        public virtual string mail { get; set; }
        public virtual DateTime fecha_alta { get; set; }
        public virtual DateTime? fecha_baja { get; set; }
        public virtual string usuario_abm { get; set; }
        public virtual string domicilio { get; set; }
        public virtual string nro_telefono { get; set; }

        [NotMapped]
        public virtual string resultado { get; set; }

        [NotMapped]
        public virtual List<Errores> errores { get; set; }
    }
}