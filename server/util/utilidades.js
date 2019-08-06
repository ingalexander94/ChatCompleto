const fs = require('fs');

class Utilidad {

    constructor() {
        this.mensajes = [];
        this.mensajesIndividuales = [];
        this.hoy = new Date().getDate();
        let dataGrupal = require('../data/grupal.json');
        let dataIndividual = require('../data/individual.json');
        if (dataGrupal.hoy === this.hoy) {
            this.mensajes = dataGrupal.mensajes;
            this.mensajesIndividuales = dataIndividual.mensajes;
        } else {
            this.reiniciarJSON();
        }
    }

    crearMensaje(usuario, mensaje, sala) {
        let mensajeNuevo = {
            usuario,
            mensaje,
            sala,
            fecha: new Date().getTime()
        }
        this.mensajes.push(mensajeNuevo);
        if (usuario !== "Administrador") {
            this.grabarArchivo();
        }
        return mensajeNuevo;
    };

    obtenerMensajes(sesion, sala) {
        let mensajes = this.mensajes.filter(mensaje => mensaje.sala === sala);
        return {
            "mensajes": mensajes,
            sesion
        }
    };

    obtenerMensajesIndividual(emisor, receptor) {
        let mensajes = this.mensajesIndividuales.filter(mensaje => mensaje.emisor === emisor && mensaje.receptor === receptor || mensaje.emisor === receptor && mensaje.receptor === emisor);
        return {
            "mensajes": mensajes,
            sesion : emisor
        }
    };

    crearMensajeIndividual(emisor, receptor, mensaje) {
        let mensajeNuevo = {
            emisor,
            receptor,
            mensaje,
            fecha: new Date().getTime()
        }
        this.mensajesIndividuales.push(mensajeNuevo);
        this.grabarArchivoIndividual();

        return mensajeNuevo;
    };

    grabarArchivo() {
        let jsonData = {
            hoy: this.hoy,
            mensajes: this.mensajes
        }

        let JsonDataString = JSON.stringify(jsonData);
        fs.writeFileSync("./server/data/grupal.json", JsonDataString);
    }

    grabarArchivoIndividual() {
        let jsonData = {
            hoy: this.hoy,
            mensajes: this.mensajesIndividuales
        }

        let JsonDataString = JSON.stringify(jsonData);
        fs.writeFileSync("./server/data/individual.json", JsonDataString);
    }

    reiniciarJSON() {
        this.mensajes = [];
        this.grabarArchivo();
        this.mensajesIndividuales = [];
        this.grabarArchivoIndividual();
    }

}

module.exports = {
    Utilidad
}