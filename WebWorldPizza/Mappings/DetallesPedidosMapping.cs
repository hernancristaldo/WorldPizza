using FluentNHibernate.Mapping;
using WebWorldPizza.Models;

namespace WebWorldPizza.Mappings
{
    public class DetallesPedidosMapping : ClassMap<DetallesPedidos>
    {
        public DetallesPedidosMapping()
        {
            Id(x => x.id);
            References(x => x.pedido).Column("id_pedido").Not.LazyLoad();
            References(x => x.producto).Column("id_producto").Not.LazyLoad();
            Map(x => x.cantidad);
            References(x => x.estado).Column("id_estado").Not.LazyLoad();
            Map(x => x.subtotal);

            Table("DetallesPedidos");
        }
    }
}