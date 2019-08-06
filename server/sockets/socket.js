const { io } = require('../server');
const { Usuario } = require('../classes/usuarios');
const { Utilidad } = require('../util/utilidades');

const user = new Usuario();
const util = new Utilidad();

io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {

        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: "El nombre es necesario"
            });
        }

        client.join(usuario.sala);

        user.agregarUsuario(client.id, usuario.nombre, usuario.sala, true);
        let usuariosActualizados = user.obtenerUsuarioDeSala(usuario.sala);
        client.broadcast.to(usuario.sala).emit('listaUsuarios', usuariosActualizados);
        client.emit("listarMensajes", util.obtenerMensajes(usuario.nombre, usuario.sala));
        callback(usuariosActualizados);


    });

    client.on("listarMensajesIndividuales", (data, callback) => {
        let emisor = user.buscarUsuario(client.id);
        let receptor = user.buscarUsuarioNombre(data.recep);
        let mensajes = util.obtenerMensajesIndividual(emisor.nombre, receptor.nombre);
        callback(mensajes);
    });

    client.on('crearMensaje', (mensaje, callback) => {
        let usuario = user.buscarUsuario(client.id);
        let msn = util.crearMensaje(usuario.nombre, mensaje.mensaje, usuario.sala);
        client.broadcast.to(usuario.sala).emit('crearMensaje', msn);
        callback(msn);
    });

    client.on('disconnect', () => {
        let usuarioBorrado = user.actualizarEstado(client.id);
        client.broadcast.to(usuarioBorrado.sala).emit('crearMensaje', util.crearMensaje("Administrador", `${usuarioBorrado.nombre} abandonó el chat`));
        client.broadcast.to(usuarioBorrado.sala).emit('listaUsuarios', user.obtenerUsuarioDeSala(usuarioBorrado.sala));
    });

    client.on('mensajePrivado', (mensaje,callback) => {
        let emisor = user.buscarUsuario(client.id);
        let receptor = user.buscarUsuarioNombre(mensaje.para);
        let mensajePrivado = util.crearMensajeIndividual(emisor.nombre, receptor.nombre, mensaje.mensaje);
        client.broadcast.to(receptor.id).emit('mensajePrivado', mensajePrivado);
        callback(mensajePrivado);
    });

});