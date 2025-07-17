using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WSWorldPizza.Models
{
    public class PantallasRoles
    {
        public virtual int id { get; set; }

        public virtual Roles roles { get; set; }
        public virtual Pantallas pantalla { get; set; }

        [NotMapped]
        public virtual string resultado { get; set; }

        [NotMapped]
        public virtual List<Errores> errores { get; set; }
    }
}