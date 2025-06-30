using System.Runtime.Serialization;

namespace WSWorldPizza.Models
{
    [DataContract]
    public class SomeError
    {
        [DataMember]
        public string Content;
    }
}