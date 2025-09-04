<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/ViewControllers/MasterPage.Master" %>

<asp:content id="Content1" contentplaceholderid="head" runat="server">

</asp:content>

<asp:content id="Content2" contentplaceholderid="contenidoPrincipal" runat="server">
    
    <!-- Principal -->
    <div id="principal"></div>
    

    <%--<!-- Pestañas -->
    <template id="templatePestanas">
        <div class="flex-center" id="divContenedorPestanasHome">
        </div>
        <div class="contentPestana" id="contentPestana"></div>
    </template>

    <!-- Abonados -->
    <template id="page1">
        <div id="contenedorBusquedaAbonados">
            <div class="btn-link" id="linkAddAbonado" data-element="altaAbonado"></div>
            <div class="barra-busqueda">
                <div class="barra-busqueda-medio">
                    <div class="fullcontenido">
                        <label class="filtro-label">Abonado</label> 
                        <input id="inputBusquedaAbonados" class="input-buscar busqueda-redondeadoizq" placeholder="Ingrese el nombre, codigo, calle, DNI-CUIL o equipos del abonado" />
                    </div>
                </div>       
            </div>
            <!-- Tabla gestiones -->
            <div id="contenedor-tabla-abonados" class="padding-20-0">
                <div id="contenedorTablaAbonados"></div>
            </div>
        </div>
    </template>

    <!-- Gestiones -->
    <template id="page2">       
        <div id="contenedorBusquedaGestiones">
            <div class="btn-link" id="linkAdd" data-element="altaGestion"></div>
            <div class="barra-busqueda">
                <div class="barra-busqueda-izquierda">
                    <select id="selectFiltros" class="select-busqueda2">
                        <option value="1" data-filtro="FiltroAbonado" data-name="filtroBusqueda">Abonado</option>
                        <option value="2" data-filtro="FiltroLocalidad" data-name="id_localidad">Localidad</option>
                        <option value="3" data-filtro="FiltroEstado" data-name="id_estadosGestiones">Estado</option>
                    </select>
                </div>
                <div class="barra-busqueda-medio">
                    <div id="contenidoFiltro" class="fullcontenido">
                    </div>
                </div>
                <div class="barra-busqueda-derecha">
                    <button class="custom-btn-sumar" data-element="btnsumar" type="button">+</button>
                </div>           
            </div>
            <!-- Filtros aplicados -->
            <div class="flex-center" id="contenedorFiltros">
            </div>
            <!-- Botón búsqueda -->
            <button type="button" id="btn-guardar" class="custom-btn-guardar" data-element="realizarBusqueda">Buscar</button>
            <!-- Tabla gestiones -->
            <div id="contenedor-tabla-gestion" class="padding-20-0">
                <div id="contenedorTablaGestiones"></div>
            </div>
            <div id="modalGestiones"></div>
            <div id="modal-alta"></div>
        </div>
    </template>

    <!-- Asignaciones -->
    <template id="page3">
    </template>--%>

    <script type="module" src="/js/Home.js"></script>

</asp:content>
