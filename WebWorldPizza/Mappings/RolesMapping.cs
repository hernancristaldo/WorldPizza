using FluentNHibernate.Mapping;
using WebWorldPizza.Models;

namespace WebWorldPizza.Mappings
{
    public class RolesMapping : ClassMap<Roles>
    {
        public RolesMapping()
        {
            Id(x => x.id);
            Map(x => x.nombre);
            Map(x => x.descripcion);

            Table("Roles");
        }
    }
}