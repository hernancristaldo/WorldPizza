using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebWorldPizza.Models
{
    public class Productos
    {
        public virtual int id { get; set; }
        public virtual string nombre { get; set; }
        public virtual string descripcion { get; set; }
        public virtual decimal precio { get; set; }

        [NotMapped]
        public virtual string resultado { get; set; }
        [NotMapped]
        public virtual List<Errores> errores { get; set; }
    }
}