<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/ViewControllers/MasterPage.Master" %>

<asp:content id="Content1" contentplaceholderid="head" runat="server">

</asp:content>

<asp:content id="Content2" contentplaceholderid="contenidoPrincipal" runat="server">
    
    <!-- Principal -->
    <div id="principal"></div>
    <div id="modal"></div>

   
    <!-- Usuarios -->
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
                <div id="tablaUsuarios"></div> 
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
                <div class="formulario-2">
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Empleado</label>
                        <input type="text" id="editEmpleado" class="formbold-form-input" disabled />  
                    </div>
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Usuario</label>
                        <input type="text" id="editUsuario" class="formbold-form-input" data-validate="usuario" data-editable="true" required disabled />   
                        <div class="individual-errores"></div>
                    </div>                    
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Pass</label>
                        <input type="text" id="editPass" class="formbold-form-input" data-validate="pass" data-editable="true" required disabled/>                    
                        <div class="individual-errores"></div>
                    </div>  
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Rol</label>
                        <select id="editRoles" data-editable="true"></select>
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
                <div class="formulario-2">                    
                    <div class="formulario__grupo">   
                        <label class="formbold-form-label">Empleado</label>
                        <input list="listEmpleados" id="inputList"/>
                        <datalist id="listEmpleados"></datalist>
                    </div>
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Usuario</label>
                        <input type="text" id="usuario" class="formbold-form-input" data-validate="usuario" data-editable="true" required/>   
                        <div class="individual-errores"></div>
                    </div>                    
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Pass</label>
                        <input type="text" id="pass" class="formbold-form-input" data-validate="pass" data-editable="true" required/> 
                        <div class="individual-errores"></div>
                    </div>     
                    <div class="formulario__grupo">
                        <label class="formbold-form-label">Rol</label>
                        <select id="roles" data-editable="true"></select>
                    </div>
                </div>
                       
                
                <button data-element="btnGuardar" class="custom-btn-guardar" type="button">Guardar</button>
            </div>
        </div>
    </template>
    

    <script type="module" src="/js/Usuarios.js"></script>

</asp:content>
