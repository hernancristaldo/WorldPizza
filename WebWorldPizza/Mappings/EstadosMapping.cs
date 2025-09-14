using FluentNHibernate.Mapping;
using WebWorldPizza.Models;

namespace WebWorldPizza.Mappings
{
    public class EstadosMapping : ClassMap<Estados>
    {
        public EstadosMapping()
        {
            Id(x => x.id);
            Map(x => x.nombre);

            Table("Estados");
        }
    }
}