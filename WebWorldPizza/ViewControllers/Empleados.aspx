<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/ViewControllers/MasterPage.Master" %>

<asp:content id="Content1" contentplaceholderid="head" runat="server">

</asp:content>

<asp:content id="Content2" contentplaceholderid="contenidoPrincipal" runat="server">
    
    <!-- Principal -->
    <div id="principal"></div>
    <div id="modal"></div>

   
    <!-- Empleados -->
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
                <div id="tablaEmpleados"></div> 
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
                        <label class="formbold-form-label">DNI/CUIT</label>
                        <input type="text" id="editDni" class="formbold-form-input" data-validate="dni" data-editable="true" required disabled />   
                        <div class="individual-errores"></div>
                    </div>
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Apellido y Nombre</label>
                        <input type="text" id="editNombre" class="formbold-form-input" data-validate="apellido_nombre" data-editable="true" required disabled />   
                        <div class="individual-errores"></div>
                    </div>                    
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Domicilio</label>
                        <input type="text" id="editDomicilio" class="formbold-form-input" data-validate="domicilio" data-editable="true" required disabled/>                    
                        <div class="individual-errores"></div>
                    </div>
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Telefono</label>
                        <input type="text" id="editTelefono" class="formbold-form-input" data-validate="nro_telefono" data-editable="true" required disabled />   
                        <div class="individual-errores"></div>
                    </div>
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Mail</label>
                        <input type="email" id="editMail" class="formbold-form-input" data-validate="mail" data-editable="true" value="@" disabled />                  
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
                        <label class="formbold-form-label">DNI/CUIT</label>
                        <input type="text" id="dni" class="formbold-form-input" data-validate="dni" data-editable="true" required/>   
                        <div class="individual-errores"></div>
                    </div>
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Apellido y Nombre</label>
                        <input type="text" id="nombre" class="formbold-form-input" data-validate="apellido_nombre" data-editable="true" required/>   
                        <div class="individual-errores"></div>
                    </div>                    
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Domicilio</label>
                        <input type="text" id="domicilio" class="formbold-form-input" data-validate="domicilio" data-editable="true" required/> 
                        <div class="individual-errores"></div>
                    </div> 
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Telefono</label>
                        <input type="text" id="telefono" class="formbold-form-input" data-validate="nro_telefono" data-editable="true" required/>                    
                        <div class="individual-errores"></div>
                    </div> 
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Mail</label>
                        <input type="email" id="mail" class="formbold-form-input" data-editable="true" value="@"/>                   
                    </div> 
                </div>
                       
                
                <button data-element="btnGuardar" class="custom-btn-guardar" type="button">Guardar</button>
            </div>
        </div>
    </template>
    

    <script type="module" src="/js/Empleados.js"></script>

</asp:content>
