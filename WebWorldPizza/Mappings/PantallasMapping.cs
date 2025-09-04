using FluentNHibernate.Mapping;
using WebWorldPizza.Models;

namespace WebWorldPizza.Mappings
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