const fs = require('fs');


class Usuario {

    constructor() {
        this.usuarios = [];
        this.hoy = new Date().getDate();

        let data = require('../data/usuarios.json');
        if (data.hoy === this.hoy) {
            this.usuarios = data.usuarios;
        } else {
            this.reiniciarJSON();
        }
    }

    agregarUsuario(id, nombre, sala, estado) {
        let usuario = this.usuarios.filter(user => user.nombre === nombre)[0];
        if (usuario) {
            this.eliminarUsuario(usuario.id);
            usuario.id = id;
            usuario.estado = estado;
            this.usuarios.push(usuario);
        } else {
            let usuario = { id, nombre, sala, estado };
            this.usuarios.push(usuario);
        }
        this.grabarArchivo();
        return this.usuarios;
    }

    obtenerUsuarios() {
        return this.usuarios;
    }
 
    buscarUsuario(id) {
        let usuario = this.usuarios.filter(user => user.id === id)[0];
        return usuario;
    }

    buscarUsuarioNombre(nombre) {
        let usuario = this.usuarios.filter(user => user.nombre === nombre)[0];
        return usuario;
    }

    eliminarUsuario(id) {
        let usuarioBorrado = this.buscarUsuario(id);
        this.usuarios = this.usuarios.filter(user => user.id != id);
        return usuarioBorrado;
    }

    actualizarEstado(id){
        let usuarioBorrado = this.buscarUsuario(id);
        usuarioBorrado.estado = false;
        this.eliminarUsuario(id);
        this.usuarios.push(usuarioBorrado);
        this.grabarArchivo();
        return usuarioBorrado;
    } 

    obtenerUsuarioDeSala(sala) {
        let usuariosSala = this.usuarios.filter(user => user.sala === sala);
        return usuariosSala;
    }

    grabarArchivo() {
        let jsonData = {
            hoy: this.hoy,
            usuarios: this.usuarios
        }

        let JsonDataString = JSON.stringify(jsonData);
        fs.writeFileSync("./server/data/usuarios.json", JsonDataString);
    }

    reiniciarJSON() {
        this.usuarios = [];
        this.grabarArchivo();
    }

}

module.exports = {
    Usuario
}