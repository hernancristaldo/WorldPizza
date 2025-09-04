using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebWorldPizza.Models
{
    public class MenusRoles
    {
        public virtual int id { get; set; }
        public virtual Menus menu { get; set; }
        public virtual Roles rol { get; set; }

        [NotMapped]
        public virtual string resultado { get; set; }

        [NotMapped]
        public virtual List<Errores> errores { get; set; }
    }
}