using FluentNHibernate.Mapping;
using WSWorldPizza.Models;

namespace WSWorldPizza.Mappings
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