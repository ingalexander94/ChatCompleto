var socket = io();

var parametros = new URLSearchParams(window.location.search);

if(!parametros.has("nombre") || !parametros.has("sala")){
    window.location = "index.html";
    throw new Error("El nombre es necesario");
}

var usuario = {
    nombre: parametros.get("nombre"),
    sala: parametros.get("sala")
}

socket.on("connect", function() {
    console.log("Conectado al servidor");
    socket.emit("entrarChat",usuario,function(data){
        renderizarUsuarios(data);
    });
});

socket.on("disconnect", function() {
    console.log("Servidor","Perdimos conexión con el servidor");
});
 
socket.on("crearMensaje",function(mensaje){
    renderizarMensajes(mensaje,false);
    scrollBottom();
});

socket.on("mensajePrivado",function(mensaje){
    renderizarMensajesIndividuales(mensaje,false);
    scrollBottomIndividual();
});

socket.on("listaUsuarios",function(usuarios){
    renderizarUsuarios(usuarios);
});

socket.on("listarMensajes",function(mensajes){
    cargarMensajes(mensajes);
});
