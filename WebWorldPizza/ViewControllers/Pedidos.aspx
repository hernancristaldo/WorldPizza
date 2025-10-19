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
                        <input id="filtro" class="form-control" type="text" placeholder="cliente, direccion, barrio" />
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
            <div id="spinnerTabla">
                <div id="tablaPedidos"></div>
            </div>
        </div>
    </template>

    <template id="bodyEdicion">
        <div>
            <div class="contenedor-generico">
                 <div class="contenedor-doble">
                    <div class="contenedor-principal">                
                        <div id="resetModal"></div>
                    </div>
                    <div class="contenedor-secundario">
                        <div class="margin-10" style="display: flex; justify-content: flex-end" id="switchEdicion"></div>
                    </div>
                </div>
                <div class="formulario-4">
                     <div class="formulario__grupo">
                        <label class="formbold-form-label">Codigo</label>
                        <input id="codigo" class="form-control" type="text" disabled />
                    </div> 
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Cliente</label>
                        <input id="cliente" class="form-control" type="text" disabled />
                    </div> 
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Direccion</label>
                        <input id="direccion" class="form-control" type="text" disabled />
                    </div> 
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Importe</label>
                        <input id="importe" class="form-control" type="text" disabled />
                    </div>
                    <div class="formulario__grupo">                
			            <label class="formbold-form-label">Pago</label>
                        <select id="pago" class="form-control" data-editable="true" disabled>
                            <option value="0">No pagado</option>
                            <option value="1">Pagado</option>
                        </select>
                    </div>
                    <div class="formulario__grupo">                
			            <label class="formbold-form-label">Tipo Pago</label>
                        <select id="tipoPago" class="form-control" data-editable="true" disabled></select>
                    </div>
                    <div class="formulario__grupo">                
			            <label class="formbold-form-label">Estado</label>
                        <select id="estado" class="form-control" data-editable="true" disabled></select>
                    </div>
                    <div class="formulario__grupo">                
			            <label class="formbold-form-label">Asignado a</label>
                        <select id="rol" class="form-control" data-editable="true" disabled></select>
                    </div>
                </div>

                <button data-element="btnGuardar" type="button" class="custom-btn-guardar">Guardar cambios</button>
            </div>
        </div>
    </template>

    <script type="module" src="/js/Pedidos.js"></script>

</asp:content>
