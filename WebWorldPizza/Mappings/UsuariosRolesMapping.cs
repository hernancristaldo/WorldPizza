using FluentNHibernate.Mapping;
using WebWorldPizza.Models;

namespace WebWorldPizza.Mappings
{
    public class UsuariosRolesMapping : ClassMap<UsuariosRoles>
    {
        public UsuariosRolesMapping()
        {
            Id(x => x.id);
            References(x => x.usuario).Column("usuario").Not.LazyLoad();
            References(x => x.rol).Column("id_rol").Not.LazyLoad();

            Table("UsuariosRoles");
        }
    }
}