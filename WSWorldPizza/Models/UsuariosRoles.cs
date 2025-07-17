using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WSWorldPizza.Models
{
    public class UsuariosRoles
    {
        public virtual int id { get; set; }

        public virtual Usuarios usuario { get; set; }

        public virtual Roles roles { get; set; }

        [NotMapped]
        public virtual string resultado { get; set; }

        [NotMapped]
        public virtual List<Errores> errores { get; set; }
    }
}