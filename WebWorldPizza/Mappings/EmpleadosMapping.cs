using FluentNHibernate.Mapping;
using WebWorldPizza.Models;

namespace WebWorldPizza.Mappings
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
            Map(x => x.domicilio);
            Map(x => x.nro_telefono);

            Table("Empleados");
        }
    }
}