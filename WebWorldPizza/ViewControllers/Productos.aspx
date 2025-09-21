<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/ViewControllers/MasterPage.Master" %>

<asp:content id="Content1" contentplaceholderid="head" runat="server">

</asp:content>

<asp:content id="Content2" contentplaceholderid="contenidoPrincipal" runat="server">
    
    <!-- Principal -->
    <div id="principal"></div>
    <div id="modal"></div>

   
    <!-- Pedidos -->
    <template id="bodyPrincipal">       
        <div>
            <div id="contenedorLinkAlta" class="btn-link"></div>
            
            <div class="contenedor-generico">
                <div class="formulario-1">
                    <div class="formulario__grupo">
                        <label class="formbold-form-label"> Busqueda: </label>
                        <input id="txtBusqueda" class="formbold-form-input"/>
                    </div>                    
                </div>

                <button data-element="btnBuscar" class="custom-btn-guardar" type="button">Buscar</button>
            </div>
            <br />

            <div id="tabla">
                <div id="tablaProductos"></div> 
            </div>  
        </div>
    </template>

    <template id="bodyEdicion">
        <div>       
            <div class="contenedor-doble">
                <div class="contenedor-principal">                
                    <div id="resetModal"></div>
                </div>
                <div class="contenedor-secundario">
                    <div class="margin-10" style="display: flex; justify-content: flex-end" id="switchEdicion"></div>
                </div>
            </div>            

            <div class="contenedor-generico">
                <div class="formulario-3">
                    <div class="formulario__grupo">
			            <label class="formbold-form-label">Nombre</label>
                        <input id="editNombre" type="text" class="formbold-form-input" data-validate="nombre" data-editable="true" required disabled/> 
                        <div class="individual-errores"></div>
                    </div>
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Descripcion</label>
                        <input id="editDescripcion" type="text" class="formbold-form-input" data-editable="true" disabled/>
                    </div>             
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Precio</label>
                        <input id="editPrecio" type="number" class="formbold-form-input" data-validate="precio" data-editable="true" required disabled/>
                        <div class="individual-errores"></div>
                    </div>  
                </div> 
            </div>         

            <button data-element="btnGuardar" style="display:none" class="custom-btn-guardar" type="button">Editar</button>        
            <button data-element="btnEliminar" style="display:none" class="custom-btn-guardar" type="button">Eliminar</button>
        </div>        
    </template>

    <template id="bodyAlta">
        <div>            
            <div class="contenedor-generico">
                <div class="formulario-3">
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Nombre</label>
                        <input type="text" id="nombre" class="formbold-form-input" data-validate="nombre" data-editable="true" required/>   
                        <div class="individual-errores"></div>
                    </div>                     
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Descripcion</label>
                        <input type="text" id="descripcion" class="formbold-form-input" data-editable="true"/>                    
                    </div>                     
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Precio</label>
                        <input type="number" id="precio" class="formbold-form-input" data-validate="precio" data-editable="true" required/>                    
                        <div class="individual-errores"></div>
                    </div>                    
                </div>        
                
                <button data-element="btnGuardar" class="custom-btn-guardar" type="button">Guardar</button>
            </div>
        </div>
    </template>
    

    <script type="module" src="/js/Productos.js"></script>

</asp:content>
