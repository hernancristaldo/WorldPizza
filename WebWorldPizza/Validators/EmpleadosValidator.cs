using FluentValidation;
using System.Collections.Generic;
using System.Text.RegularExpressions;
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
                RuleFor(p => p.apellido_nombre).NotEmpty().WithMessage("El nombre y apellido es obligatorio.").WithErrorCode("0001");
                RuleFor(p => p.nro_telefono).NotEmpty().WithMessage("El nro de telefono es obligatorio.").WithErrorCode("0001");
                RuleFor(p => p.domicilio).NotEmpty().WithMessage("La direccion es obligatoria.").WithErrorCode("0001");
                //RuleFor(p => p.usuario_abm).Cascade(CascadeMode.StopOnFirstFailure)
                //                   .NotEmpty().WithMessage("El usuario es obligatorio.").WithErrorCode("0001")
                //                   .Must(CUsuario).WithMessage("El usuario ya existe.").WithErrorCode("0001");
                RuleFor(p => p.dni).Cascade(CascadeMode.StopOnFirstFailure)
                                   .NotEmpty().WithMessage("El DNI/CUIT es obligatorio.").WithErrorCode("0001")
                                   .Must(ValidacionDNI).WithMessage("El DNI/CUIT ingresado es incorrecto.").WithErrorCode("0001");
                RuleFor(p => p).Must(CDNI).WithMessage("El DNI/CUIT ya existe.").WithErrorCode("0001");
            });

            // Si se quiere validar una baja.
            RuleSet("Delete", () =>
            {                
                RuleFor(m => m.id).Must(CUsuarios).WithMessage("El empleado esta asociado a un usuario.").WithErrorCode("0001");
            });

            // Si se quiere validar una edicion.
            RuleSet("Edit", () =>
            {
                RuleFor(p => p.apellido_nombre).NotEmpty().WithMessage("El nombre y apellido es obligatorio.").WithErrorCode("0001");
                RuleFor(p => p.nro_telefono).NotEmpty().WithMessage("El nro de telefono es obligatorio.").WithErrorCode("0001");
                RuleFor(p => p.domicilio).NotEmpty().WithMessage("La direccion es obligatoria.").WithErrorCode("0001");
                //RuleFor(p => p.usuario_abm).Cascade(CascadeMode.StopOnFirstFailure)
                //                   .NotEmpty().WithMessage("El usuario es obligatorio.").WithErrorCode("0001")
                //                   .Must(CUsuario).WithMessage("El usuario ya existe.").WithErrorCode("0001");
                RuleFor(p => p.dni).Cascade(CascadeMode.StopOnFirstFailure)
                                   .NotEmpty().WithMessage("El DNI/CUIT es obligatorio.").WithErrorCode("0001")
                                   .Must(ValidacionDNI).WithMessage("El DNI/CUIT ingresado es incorrecto.").WithErrorCode("0001");
                RuleFor(p => p).Must(CDNI).WithMessage("El DNI/CUIT ya existe.").WithErrorCode("0001");
            });
        }

        // Validacion de nro de DNI/CUIT
        private bool ValidacionDNI(string dni)
        {
            bool result;

            string limpio = dni.Replace(".", "").Replace("-", "").Trim();

            // Si tiene entre 7 y 8 dígitos → DNI
            if (Regex.IsMatch(limpio, @"^\d{7,8}$"))
            {
                result = true;
            }
            // Si tiene 11 dígitos → CUIT/CUIL
            else if (Regex.IsMatch(limpio, @"^\d{11}$"))
            {
                int[] multiplicadores = { 5, 4, 3, 2, 7, 6, 5, 4, 3, 2 };
                int suma = 0;

                for (int i = 0; i < 10; i++)
                    suma += int.Parse(limpio[i].ToString()) * multiplicadores[i];

                int resto = suma % 11;
                int digitoVerificador = resto == 0 ? 0 : resto == 1 ? 9 : 11 - resto;

                result = digitoVerificador == int.Parse(limpio[10].ToString());
            }
            else
            {
                result = false;
            }

            return result;
        }

        // Se verifica si ya existe el DNI entre los empleados registrados.
        private bool CDNI(Empleados empleado)
        {
            bool result = true;

            using (var session = NHibernateHelperDBWorldPizza.OpenSession())
            {
                // Se realiza la busqueda de Empleados.
                Empleados emp = session.QueryOver<Empleados>()
                          .Where(p => p.dni == empleado.dni)
                          .SingleOrDefault();

                if (emp != null && empleado.id != emp.id) result = false;
            }

            return result;
        }

        // Se verifica si el usuario ya existe en el sistema.
        private bool CUsuario(string usuario)
        {
            bool result = true;

            Metodos metodo = new Metodos();

            List<Usuarios> usuarios = metodo.CUsuarios(usuario, null);

            if (usuarios[0].resultado == "Ok") result = false;

            return result;
        }

        // Se verifica si el empleado esta asociado a un usuario.
        private bool CUsuarios(int id_empleado)
        {
            bool result = true;

            Metodos metodo = new Metodos();

            List<Usuarios> usuarios = metodo.CUsuarios(null, id_empleado);

            if (usuarios[0].resultado == "Ok") result = false;

            return result;
        }
    }
}