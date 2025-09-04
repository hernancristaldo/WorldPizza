using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebWorldPizza.Models
{
    public class Pantallas
    {
        public virtual int id { get; set; }
        public virtual string nombre_pantalla { get; set; }
        public virtual string nombre_descriptivo { get; set; }

        [NotMapped]
        public virtual string resultado { get; set; }

        [NotMapped]
        public virtual List<Errores> errores { get; set; }
    }
}