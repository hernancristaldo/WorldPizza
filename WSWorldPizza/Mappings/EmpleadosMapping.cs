using FluentNHibernate.Mapping;
using WSWorldPizza.Models;

namespace WSWorldPizza.Mappings
{
    public class EmpleadosMapping : ClassMap<Empleados>
    {
        public EmpleadosMapping()
        {
            Id(x => x.id);
            Map(x => x.dni);
            Map(x => x.apellido_nombre);
            Map(x => x.fecha_nacimiento);
            Map(x => x.mail);
            Map(x => x.fecha_alta);
            Map(x => x.fecha_baja);
            Map(x => x.usuario_abm);

            Table("Empleados");
        }
    }
}