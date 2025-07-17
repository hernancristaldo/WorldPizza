using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;


namespace WSWorldPizza.Models
{
    public class Menus
    {
        public virtual int id { get; set; }

        public virtual string nombre { get; set; }

        public virtual int? id_padre { get; set; }

        public virtual int orden { get; set; }

        public virtual string link { get; set; }

        [NotMapped]
        public virtual string resultado { get; set; }

        [NotMapped]
        public virtual List<Errores> errores { get; set; }
    }
}