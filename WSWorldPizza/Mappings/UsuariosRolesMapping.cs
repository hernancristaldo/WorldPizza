using FluentNHibernate.Mapping;
using WSWorldPizza.Models;

namespace WSWorldPizza.Mappings
{
    public class UsuariosRolesMapping : ClassMap<UsuariosRoles>
    {
        public UsuariosRolesMapping()
        {
            Id(x => x.id);
            References(x => x.usuario).Column("usuario").Not.LazyLoad();
            References(x => x.roles).Column("id_rol").Not.LazyLoad();

            Table("UsuariosRoles");
        }
    }
}