using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebWorldPizza.Models
{
    public class DetallesPedidos
    {
        public virtual int id { get; set; }
        public virtual Pedidos pedido { get; set; }
        public virtual Productos producto { get; set; }
        public virtual int cantidad { get; set; }
        public virtual Estados estado { get; set; }
        public virtual decimal subtotal { get; set; }

        [NotMapped]
        public virtual string resultado { get; set; }
        [NotMapped]
        public virtual List<Errores> errores { get; set; }
    }
}