using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Web;
using WSWorldPizza.Models;

namespace WSWorldPizza
{
    [ServiceContract]
    public interface IServiceWorldPizza
    {
        [OperationContract]
        [FaultContract(typeof(SomeError))]
        string bienvenida();
    }
}