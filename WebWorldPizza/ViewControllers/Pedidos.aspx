<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/ViewControllers/MasterPage.Master" %>

<asp:content id="Content1" contentplaceholderid="head" runat="server">

</asp:content>

<asp:content id="Content2" contentplaceholderid="contenidoPrincipal" runat="server">
    
    <!-- Principal -->
    <div id="principal"></div>
    <div id="modal"></div>

   
    <!-- Pedidos -->
    <template id="bodyPrincipal">       
        <div id="contenedorBusquedaGestiones">
            
            <div class="formulario-4">
                    <div class="formulario__grupo">                
			            <label class="formbold-form-label">Estado</label>
                        <select id="selectEstado" class="form-control">
                            <option value="0">Todos</option>
                        </select>
                    </div>
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Tipo Pago</label>
                        <select id="selectTipoPago" class="form-control">
                            <option value="0">Todos</option>
                        </select>
                    </div>
                    
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Filtro</label>
                        <input id="codigoEnvio" class="form-control" type="text" placeholder="cliente, direccion, barrio" />
                    </div> 
                    <div class="formulario__grupo">
                        <div class="contenedor-checkbox">
                            <label> Pagado </label>
                            <input type="checkbox" data-element="pagado" data-editable="true" />
                        </div>
                    </div>
                </div>
                

                <button data-element="btnBuscar" type="button" class="custom-btn-guardar">Buscar</button> 
            <br />
            <div id="tabla">
                <div id="tablaPedidos"></div>
            </div>
        </div>
    </template>

    

    <script type="module" src="/js/Pedidos.js"></script>

</asp:content>
