using FluentValidation;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using WebWorldPizza.Helpers;
using WebWorldPizza.Models;

namespace WebWorldPizza.Validators
{
    public class UsuariosRolesValidator : AbstractValidator<UsuariosRoles>
    {
        public UsuariosRolesValidator()
        {
            // Si se quiere validar un alta.
            RuleSet("Create", () =>
            {
                //RuleFor(p => p.empleado.id).Cascade(CascadeMode.StopOnFirstFailure)
                //                   .NotEmpty().WithMessage("El empleado es obligatorio.").WithErrorCode("0001")
                //                   .Must(CEmpleado).WithMessage("El empleado no existe.").WithErrorCode("0001");
                //RuleFor(p => p.usuario).Cascade(CascadeMode.StopOnFirstFailure)
                //                   .NotEmpty().WithMessage("El usuario es obligatorio.").WithErrorCode("0001")
                //                   .Must(CUsuario).WithMessage("El usuario ya existe.").WithErrorCode("0001");
                //RuleFor(p => p.pass).NotEmpty().WithMessage("La contaseña es obligatoria.").WithErrorCode("0001");

            });

            // Si se quiere validar una baja.
            RuleSet("Delete", () =>
            {
                //RuleFor(p => p.usuario).Must(CUsuariosRoles).WithMessage("El usuario esta asociado a un rol.").WithErrorCode("0001");
            });

            // Si se quiere validar una edicion.
            RuleSet("Edit", () =>
            {
                //RuleFor(p => p.empleado.id).Cascade(CascadeMode.StopOnFirstFailure)
                //                  .NotEmpty().WithMessage("El empleado es obligatorio.").WithErrorCode("0001")
                //                  .Must(CEmpleado).WithMessage("El empleado no existe.").WithErrorCode("0001");
                //RuleFor(p => p.usuario).Cascade(CascadeMode.StopOnFirstFailure)
                //                   .NotEmpty().WithMessage("El usuario es obligatorio.").WithErrorCode("0001")
                //                   .Must(CUsuario).WithMessage("El usuario ya existe.").WithErrorCode("0001");
                //RuleFor(p => p.pass).NotEmpty().WithMessage("La contaseña es obligatoria.").WithErrorCode("0001");
            });
        }
    }
}