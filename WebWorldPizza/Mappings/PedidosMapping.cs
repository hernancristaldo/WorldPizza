using FluentNHibernate.Mapping;
using WebWorldPizza.Models;

namespace WebWorldPizza.Mappings
{
    public class PedidosMapping : ClassMap<Pedidos>
    {
        public PedidosMapping()
        {
            Id(x => x.id);
            Map(x => x.nombre_cliente);
            Map(x => x.barrio);
            Map(x => x.pagado);
            References(x => x.tipoPago).Column("id_tipoPago").Not.LazyLoad();
            References(x => x.estado).Column("id_estado").Not.LazyLoad();
            Map(x => x.fecha_alta);
            Map(x => x.fecha_entrega);
            References(x => x.rol).Column("id_rol").Not.LazyLoad();
            Map(x => x.importe);

            Table("Pedidos");
        }
    }
}