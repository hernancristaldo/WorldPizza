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
                <div class="formulario-3">
                    <div class="formulario__grupo">
                        <label class="formbold-form-label"> Filtrar por </label>
                        <select id="tipoFiltro" class="form-control">
                            <option value="0">Estado</option>
                            <option value="1">Producto</option>
                            <option value="2">Direccion</option>
                            <option value="3">Tipo Pago</option>
                            <option value="4">Fecha</option>
                            <option value="5">Importe</option>
                            <option value="6">Cliente</option>
                            <option value="7">Rol</option>
                        </select>
                    </div>   
                    <div class="formulario__grupo" id="grupo1" style="display: none;">
                    </div>
                    <div class="formulario__grupo" id="grupo2" style="display: none;">
                    </div>
                </div>

                <button data-element="btnBuscar" class="custom-btn-guardar" type="button">Buscar pedidos</button>
                <button data-element="btnPDF" class="custom-btn-guardar" type="button" style="display: none;">Generar PDF</button>
                <button data-element="btnExcel" class="custom-btn-guardar" type="button" style="display: none;">Generar Excel</button>
            </div>
        </div>
    </template>

    

    
    <!--CDN PDF-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
    <!--CDN EXCEL-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js"></script>

    <script type="module" src="/js/Listados.js"></script>

</asp:content>
