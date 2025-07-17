using WSWorldPizza.Models;
using FluentNHibernate.Mapping;

namespace WSWorldPizza.Mappings
{
    public class UsuariosMapping : ClassMap<Usuarios>
    {
        public UsuariosMapping()
        {
            Id(x => x.usuario);
            References(x => x.empleado).Column("id_empleado").Not.LazyLoad();

            Table("Usuarios");
        }
    }
}