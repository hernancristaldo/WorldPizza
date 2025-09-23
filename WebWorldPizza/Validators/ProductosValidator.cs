using FluentValidation;
using WebWorldPizza.Helpers;
using WebWorldPizza.Models;


namespace WebWorldPizza.Validators
{
    public class ProductosValidator : AbstractValidator<Productos>
    {
        public ProductosValidator()
        {
            // Si se quiere validar un alta.
            RuleSet("Create", () =>
            {               
                RuleFor(p => p.nombre).NotEmpty().WithMessage("El nombre es obligatorio.").WithErrorCode("0001");                                       
                RuleFor(p => p.precio).NotEmpty().WithMessage("El precio es obligatorio.").WithErrorCode("0001");                
                RuleFor(p => p).Must(CNombre).WithMessage("El nombre ya existe.").WithErrorCode("0001");
            });

            // Si se quiere validar una baja.
            RuleSet("Delete", () =>
            {                
                RuleFor(m => m.id).Must(CDetallePedido).WithMessage("El producto esta asociado a un detalle de pedido.").WithErrorCode("0001");
            });

            // Si se quiere validar una edicion.
            RuleSet("Edit", () =>
            {
                RuleFor(p => p.precio).NotEmpty().WithMessage("El precio es obligatorio.").WithErrorCode("0001");
                RuleFor(p => p).Must(CNombre).WithMessage("El nombre ya existe.").WithErrorCode("0001");
                RuleFor(p => p.nombre).NotEmpty().WithMessage("El nombre es obligatorio.").WithErrorCode("0001");
            });
        }

        // Se verifica si el nombre del producto ya existe.
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

        // Se verifica si el producto esta asociado a un detlle de pedido.
        private bool CDetallePedido(int id_producto)
        {
            bool result = true;

            return result;
        }
    }
}