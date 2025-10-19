using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebWorldPizza.Models.ViewModels
{
    public class PedidosVM
    {
        public virtual Pedidos pedido { get; set; }
        public virtual List<DetallesPedidos> detalles { get; set; }

        [NotMapped]
        public virtual string resultado { get; set; }
        [NotMapped]
        public virtual List<Errores> errores { get; set; }
    }
}