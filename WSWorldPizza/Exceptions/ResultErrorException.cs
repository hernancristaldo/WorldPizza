using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using WSWorldPizza.Models;

namespace WSWorldPizza.Exceptions
{
    public class ResultErrorException : Exception
    {
        public List<Errores> Errores { get; }

        public ResultErrorException(string message) : base(message)
        {
        }

        public ResultErrorException(string message, List<Errores> errores)
        : this(message)
        {
            Errores = errores;
        }
    }
}