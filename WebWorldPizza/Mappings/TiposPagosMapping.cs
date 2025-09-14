using FluentNHibernate.Mapping;
using WebWorldPizza.Models;

namespace WebWorldPizza.Mappings
{
    public class TiposPagosMapping : ClassMap<TiposPagos>
    {
        public TiposPagosMapping()
        {
            Id(x => x.id);
            Map(x => x.nombre);

            Table("TiposPagos");
        }
    }
}