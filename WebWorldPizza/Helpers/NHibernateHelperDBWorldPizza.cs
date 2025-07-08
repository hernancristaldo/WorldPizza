using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using NHibernate;
using WebWorldPizza.WSWorldPizza;

namespace WebWorldPizza.Helpers
{
    public class NHibernateHelperDBWorldPizza
    {
        private static ISessionFactory _sessionFactory;

        private static ISessionFactory SessionFactory
        {
            get
            {
                if (_sessionFactory == null)

                    InitializeSessionFactory();
                return _sessionFactory;
            }
        }


        private static void InitializeSessionFactory()
        {
            _sessionFactory = Fluently.Configure()
                .Database(MsSqlConfiguration.MsSql2008
                              .ConnectionString(
                               @"Server=DESKTOP-C0ORRC2;database=DBWorldPizza;user=usuario;password=WorldPizza2025!;")
                              .Dialect<CustomMsSqlDialect>()
                              .ShowSql()
                )
                .Mappings(m =>
                          m.FluentMappings
                              .AddFromAssemblyOf<IServiceWorldPizza>())

                .BuildSessionFactory();
        }

        public static ISession OpenSession()
        {
            return SessionFactory.OpenSession();
        }
    }
}