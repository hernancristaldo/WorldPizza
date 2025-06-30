using System.Data;
using NHibernate.Dialect;

namespace WSWorldPizza.Helpers
{
    public class CustomMsSqlDialect : MsSql2008Dialect
    {
        protected override void RegisterNumericTypeMappings()
        {
            base.RegisterNumericTypeMappings();
            RegisterColumnType(DbType.UInt32, "INT");
        }
    }
}