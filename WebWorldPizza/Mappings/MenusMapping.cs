using FluentNHibernate.Mapping;
using WebWorldPizza.Models;

namespace WebWorldPizza.Mappings
{
    public class MenusMapping : ClassMap<Menus>
    {
        public MenusMapping()
        {
            Id(x => x.id);
            Map(x => x.nombre);
            Map(x => x.id_padre);
            Map(x => x.orden);
            Map(x => x.link);

            Table("Menus");
        }
    }
}