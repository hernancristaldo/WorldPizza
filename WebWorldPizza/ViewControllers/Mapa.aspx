<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/ViewControllers/MasterPage.Master" %>

<asp:content id="Content1" contentplaceholderid="head" runat="server">
</asp:content>

<asp:content id="Content2" contentplaceholderid="contenidoPrincipal" runat="server">
    
    <!-- Principal -->
    <div id="principal"></div>   

    <!-- Listados -->
    <template id="bodyPrincipal">       
        <div>           
            <div class="contenedor-generico">
                <div id="contenedor-mapa"></div>
            </div>
        </div>
    </template>

    
    
    <script type="module" src="/js/Mapa.js"></script>

</asp:content>
