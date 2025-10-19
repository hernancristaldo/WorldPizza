using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebWorldPizza.Models
{
    public class Pedidos
    {
        public virtual int id { get; set; }
        public virtual string nombre_cliente { get; set; }
        public virtual string direccion { get; set; }
        public virtual string barrio { get; set; }
        public virtual bool pagado { get; set; }
        public virtual TiposPagos tipoPago { get; set; }
        public virtual Estados estado { get; set; }
        public virtual DateTime fecha_alta { get; set; }
        public virtual DateTime? fecha_entrega { get; set; }
        public virtual Roles rol { get; set; }
        public virtual decimal importe { get; set; }
        public virtual Usuarios repartidor { get; set; }

        [NotMapped]
        public virtual string resultado { get; set; }
        [NotMapped]
        public virtual List<Errores> errores { get; set; }
    }
}