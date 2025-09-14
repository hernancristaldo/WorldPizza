using FluentNHibernate.Mapping;
using WebWorldPizza.Models;

namespace WebWorldPizza.Mappings
{
    public class ProductosMapping : ClassMap<Productos>
    {
        public ProductosMapping()
        {
            Id(x => x.id);
            Map(x => x.nombre);
            Map(x => x.descripcion);
            Map(x => x.precio);

            Table("Productos");
        }
    }
}