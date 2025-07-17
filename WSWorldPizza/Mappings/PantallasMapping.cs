using FluentNHibernate.Mapping;
using WSWorldPizza.Models;

namespace WSWorldPizza.Mappings
{
    public class PantallasMapping : ClassMap<Pantallas>
    {
        public PantallasMapping()
        {
            Id(x => x.id);
            Map(x => x.nombre_pantalla);
            Map(x => x.nombre_descriptivo);

            Table("Pantallas");
        }
    }
}