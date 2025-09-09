using FluentNHibernate.Mapping;
using WebWorldPizza.Models;

namespace WebWorldPizza.Mappings
{
    public class UsuariosMapping : ClassMap<Usuarios>
    {
        public UsuariosMapping()
        {
            Id(x => x.usuario);
            Map(x => x.pass);
            References(x => x.empleado).Column("id_empleado").Not.LazyLoad();

            Table("Usuarios");
        }
    }
}