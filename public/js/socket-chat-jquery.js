
var parametros = new URLSearchParams(window.location.search);

var nombre = parametros.get("nombre");
var sala = parametros.get("sala");

var divUsuarios = $("#divUsuarios");
var divChatbox = $("#divChatbox");
var formEnviar = $("#formEnviar");
var txtMensaje = $("#txtMensaje");
var txtReceptor = $("#receptor");

function renderizarUsuarios(usuarios) {
    var html = "";
    var ventanasChat = "";

    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span> ' + sala + '</span></a>';
    html += '</li>';

    for (let i = 0; i < usuarios.length; i++) {
        var color = "";
        var estado = "";
        if (usuarios[i].estado) {
            color = "success";
            estado = "En linea";
        } else {
            color = "danger";
            estado = "Sin Conexión"; 
        }
        html += '<li>';
        html += '<a data-id="' + usuarios[i].nombre + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg"';
        html += 'alt="user-img" class="img-circle"> <span> ' + usuarios[i].nombre + ' <span class="text-danger" id="'+usuarios[i].nombre+'"></span><small';
        html += ' class="text-' + color + '">' + estado + '</small></span></a>';
        html += '</li>';
        
        ventanasChat += '<ul class="chat-list p-20 d-none" id="divChatboxPrivado'+usuarios[i].nombre+'"></ul>';
    }

    html += '<li class="p-20"></li>';

    divUsuarios.html(html);
    $("#ventanasChat").html(ventanasChat);
}

function cargarMensajes(data) {
    var html = "";
    var conversacion = data.mensajes;
    var sesion = data.sesion;

    for (var i = 0; i < conversacion.length; i++) {
        var fecha = new Date(conversacion[i].fecha);
        var hora = fecha.toLocaleString('es-CO', { hour: 'numeric', minute: 'numeric', hour12: true });

        if (sesion === conversacion[i].usuario) {
            html += '<li class="reverse">';
            html += '<div class="chat-content">';
            html += '<h5>' + conversacion[i].usuario + '</h5>';
            html += '<div class="box bg-light-inverse">' + conversacion[i].mensaje + '</div>';
            html += '</div>';
            html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" />';
            html += '</div>';
            html += '<div class="chat-time">' + hora + '</div>';
            html += '</li><hr>';
        } else {
            html += '<li class="animated fadeIn">';
            if (conversacion[i].usuario !== "Administrador") {
                html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
            }
            html += '<div class="chat-content">';
            html += '<h5>' + conversacion[i].usuario + '</h5>';
            html += '<div class="box bg-light-info">' + conversacion[i].mensaje + '</div>';
            html += '</div>';
            html += '<div class="chat-time">' + hora + '</div>';
            html += '</li><hr>';
        }
    }
    divChatbox.html(html);
}

function renderizarMensajes(mensaje, yo) {
    var html = "";
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.toLocaleString('es-CO', { hour: 'numeric', minute: 'numeric', hour12: true });

    var adminClass = "info";
    if (mensaje.usuario === "Administrador") {
        adminClass = "danger";
    }

    if (yo) {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.usuario + '</h5>';
        html += '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" />';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li><hr>';
    } else {
        html += '<li class="animated fadeIn">';
        if (mensaje.usuario !== "Administrador") {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.usuario + '</h5>';
        html += '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li><hr>';
    }

    divChatbox.append(html);
}

function scrollBottom() {
    var newMessage = divChatbox.children("li:last-child");

    var clientHeight = divChatbox.prop("clientHeight");
    var scrollTop = divChatbox.prop("scrollTop");
    var scrollHeight = divChatbox.prop("scrollHeight");
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
} 

function scrollBottomIndividual() {
}  

divUsuarios.on("click", "a", function () {
    var id = $(this).data("id");
    if (id) {
        obtenerMensajes(id);
        scrollBottomIndividual();
        divChatbox.hide();
        $("#"+id).text("");
        $("#ventanasChat ul").addClass("d-none");
        $("#divChatboxPrivado"+id).html("");
        $("#divChatboxPrivado"+id).removeClass("d-none");
        txtReceptor.val(id);
    } else {
        location.reload();
    }
});

function obtenerMensajes(receptor) {
    socket.emit("listarMensajesIndividuales", { recep: receptor }, function (mensajes) {
        cargarMensajesIndividuales(mensajes);
    });
}

function cargarMensajesIndividuales(data) {
    var html = "";
    var conversacion = data.mensajes;
    var sesion = data.sesion;

    for (var i = 0; i < conversacion.length; i++) {
        var fecha = new Date(conversacion[i].fecha);
        var hora = fecha.toLocaleString('es-CO', { hour: 'numeric', minute: 'numeric', hour12: true });

        if (sesion === conversacion[i].emisor) {
            html += '<li class="reverse">';
            html += '<div class="chat-content">';
            html += '<h5>' + conversacion[i].emisor + '</h5>';
            html += '<div class="box bg-light-inverse">' + conversacion[i].mensaje + '</div>';
            html += '</div>';
            html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" />';
            html += '</div>';
            html += '<div class="chat-time">' + hora + '</div>';
            html += '</li><hr>';
        } else {
            html += '<li class="animated fadeIn">';
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
            html += '<div class="chat-content">';
            html += '<h5>' + conversacion[i].emisor + '</h5>';
            html += '<div class="box bg-light-info">' + conversacion[i].mensaje + '</div>';
            html += '</div>';
            html += '<div class="chat-time">' + hora + '</div>';
            html += '</li><hr>';
        }
    }
    if(sesion === conversacion[0].receptor){
        $("#divChatboxPrivado"+conversacion[0].emisor).append(html);
    }else{
        $("#divChatboxPrivado"+conversacion[0].receptor).append(html);        
    }
}

function renderizarMensajesIndividuales(mensaje,yo) {
    var html = "";
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.toLocaleString('es-CO', { hour: 'numeric', minute: 'numeric', hour12: true });

    var adminClass = "info";

    if (yo) {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.emisor + '</h5>';
        html += '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" />';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li><hr>';
    } else {
        html += '<li class="animated fadeIn">';
        html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.emisor + '</h5>';
        html += '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li><hr>';
    }

    if(yo){
        $("#divChatboxPrivado"+mensaje.receptor).append(html);
    }else{
        $("#divChatboxPrivado"+mensaje.emisor).append(html);
        $("#"+mensaje.emisor).text("✉");
    }
}
formEnviar.on("submit", function (e) {

    e.preventDefault();

    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    var receptor = txtReceptor.val();

    if (receptor.trim().length === 0) {
        socket.emit("crearMensaje", {
            mensaje: txtMensaje.val()
        }, function (mensaje) {
            txtMensaje.val("").focus();
            renderizarMensajes(mensaje, true);
            scrollBottom();
        });
    } else {
        socket.emit("mensajePrivado", {
            mensaje: txtMensaje.val(),
            para: receptor
        }, function (mensaje) {
            txtMensaje.val("").focus();
            renderizarMensajesIndividuales(mensaje,true);
            scrollBottomIndividual();
        });
    }

});