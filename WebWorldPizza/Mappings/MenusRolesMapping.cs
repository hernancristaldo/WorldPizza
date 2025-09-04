using FluentNHibernate.Mapping;
using WebWorldPizza.Models;

namespace WebWorldPizza.Mappings
{
    public class MenusRolesMapping : ClassMap<MenusRoles>
    {
        public MenusRolesMapping()
        {
            Id(x => x.id);
            References(x => x.menu).Column("id_menu").Not.LazyLoad();
            References(x => x.rol).Column("id_rol").Not.LazyLoad();

            Table("MenusRoles");
        }
    }
}