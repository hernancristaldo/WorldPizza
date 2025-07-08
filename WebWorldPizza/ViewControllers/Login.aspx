<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="WebWorldPizza.ViewControllers.Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <link href="/Content/style/Login.css" rel="stylesheet" />
</head>
<body id="bodyLogin">
    <form id="form1" runat="server">
        <div class="wrapper fadeInDown">
            <div id="formContent">
            <!-- Tabs Titles -->

                <!-- Icon -->
                <div class="fadeIn first">
                    <%-- <img src="#" id="icon" alt="User Icon" style="width:35%; height:35%;"/> --%>
                </div>

                <!-- Login Form  -->
                <div>
                    <input type="text" id="user" runat="server" class="fadeIn second" name="login" placeholder="Usuario"/>
                    <input type="password" id="pass"  runat="server" class="fadeIn third" name="login" placeholder="Contraseña"/>         
                        <div id="divError" runat="server" visible="false" class="alert alert-danger" role="alert">
                            Usuario o contraseña incorrectos
                        </div>                   
                
                    <asp:Button ID="btnLogin" runat="server" Text="Ingresar" CssClass="fadeIn fourth" OnClick="btnLogin_Click" />
                </div>
            </div>
        </div>
    </form>

</body>
</html>
