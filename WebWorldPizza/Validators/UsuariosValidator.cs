using FluentValidation;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using WebWorldPizza.Helpers;
using WebWorldPizza.Models;

namespace WebWorldPizza.Validators
{
    public class UsuariosValidator : AbstractValidator<Usuarios>
    {
        public UsuariosValidator()
        {
            // Si se quiere validar un alta.
            RuleSet("Create", () =>
            {
                RuleFor(p => p.usuario).Cascade(CascadeMode.StopOnFirstFailure)
                                   .NotEmpty().WithMessage("El usuario es obligatorio.").WithErrorCode("0001")
                                   .Must(CUsuario).WithMessage("El usuario ya existe.").WithErrorCode("0001");
                RuleFor(p => p.pass).NotEmpty().WithMessage("La contaseña es obligatoria.").WithErrorCode("0001");                
                
            });

            // Si se quiere validar una baja.
            RuleSet("Delete", () =>
            {
                RuleFor(p => p.usuario).Must(CUsuariosRoles).WithMessage("El usuario esta asociado a un rol.").WithErrorCode("0001");
            });

            // Si se quiere validar una edicion.
            RuleSet("Edit", () =>
            {
                RuleFor(p => p.usuario).Cascade(CascadeMode.StopOnFirstFailure)
                                   .NotEmpty().WithMessage("El usuario es obligatorio.").WithErrorCode("0001")
                                   .Must(CUsuario).WithMessage("El usuario ya existe.").WithErrorCode("0001");
                RuleFor(p => p.pass).NotEmpty().WithMessage("La contaseña es obligatoria.").WithErrorCode("0001");
            });
        }

        // Se verifica si el usuario ya existe.
        private bool CUsuario(string usuario)
        {
            bool result = true;

            Metodos metodo = new Metodos();

            List<Usuarios> usuarios = metodo.CUsuarios(usuario, null);

            if (usuarios[0].resultado == "Ok") result = false;

            return result;
        }

        // Se verifica si el usuario esta asociado a un rol.
        private bool CUsuariosRoles(string usuario)
        {
            bool result = true;

            Metodos metodo = new Metodos();

            List<UsuariosRoles> usuariosRoles = metodo.CUsuarioRoles(usuario);

            if (usuariosRoles[0].resultado == "Ok") result = false;

            return result;
        }
    }
}