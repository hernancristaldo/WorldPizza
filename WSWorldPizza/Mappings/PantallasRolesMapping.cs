using FluentNHibernate.Mapping;
using WSWorldPizza.Models;

namespace WSWorldPizza.Mappings
{
    public class PantallasRolesMapping : ClassMap<PantallasRoles>
    {
        public PantallasRolesMapping()
        {
            Id(x => x.id);
            References(x => x.roles).Column("id_rol").Not.LazyLoad();
            References(x => x.pantalla).Column("id_pantalla").Not.LazyLoad();

            Table("PantallasRoles");
        }
    }
}