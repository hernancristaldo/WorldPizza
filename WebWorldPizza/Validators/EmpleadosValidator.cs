using FluentValidation;
using WebWorldPizza.Helpers;
using WebWorldPizza.Models;

namespace WebWorldPizza.Validators
{
    public class EmpleadosValidator : AbstractValidator<Empleados>
    {
        public EmpleadosValidator()
        {
            // Si se quiere validar un alta.
            RuleSet("Create", () =>
            {
                // Se crea una validacion en cascada para verificar si se ingreso un nombre y si el nombre ingresado ya existe.
                //RuleFor(p => p.nombre).NotEmpty().WithMessage("El nombre es obligatorio.").WithErrorCode("0001");
                //RuleFor(p => p.precio).NotEmpty().WithMessage("El precio es obligatorio.").WithErrorCode("0001");
                //RuleFor(p => p).Must(CNombre).WithMessage("El nombre ya existe.").WithErrorCode("0001");
            });

            // Si se quiere validar una baja.
            RuleSet("Delete", () =>
            {
                // Se crea una validacion en cascada sin stop ante el primer error de validacion para el id de la marca.
                RuleFor(m => m.id).Must(CDetallePedido).WithMessage("El producto esta asociado a un detalle de pedido.").WithErrorCode("0001");
            });

            // Si se quiere validar una edicion.
            RuleSet("Edit", () =>
            {
                //RuleFor(p => p.precio).NotEmpty().WithMessage("El precio es obligatorio.").WithErrorCode("0001");
                //RuleFor(p => p).Must(CNombre).WithMessage("El nombre ya existe.").WithErrorCode("0001");
                //RuleFor(p => p.nombre).NotEmpty().WithMessage("El nombre es obligatorio.").WithErrorCode("0001");
            });
        }

        private bool CNombre(Productos producto)
        {
            bool result = true;

            using (var session = NHibernateHelperDBWorldPizza.OpenSession())
            {
                // Se realiza la busqueda de Productos.
                Productos prod = session.QueryOver<Productos>()
                          .Where(p => p.nombre == producto.nombre)
                          .SingleOrDefault();

                if (prod != null && producto.id != prod.id) result = false;
            }

            return result;
        }

        private bool CDetallePedido(int id_producto)
        {
            bool result = true;

            return result;
        }
    }
}