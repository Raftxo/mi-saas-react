// COMPONENTE ChatArea (Zona derecha principal)
// 1. Importar componentes hijos
import Mensaje from './Mensaje';

function ChatArea() {
    // Este componente no tiene lógica compleja,
    // solo devuelve la estructura visual.
    return (
        // La etiqueta <main> envuelve toda la parte derecha de la pantalla.
        <main className="chat-area">
            {/* Zona 1. Historial de mensajes */}
            <section className="mensajes-container" id='caja-mensajes'>
            {/* Aquí llamamos a nuestro componente Mensaje */}
                <Mensaje rol="ia" texto="Hola, usuario React, ¿en qué puedo ayudarte?"/>
                <Mensaje rol="usuario" texto="Quiero hacer dieta y aprender a usar componentes React."/>
                <Mensaje rol="ia" texto="Muy bien, te ayudaré a hacerlo."/>
            </section>
            {/* Zona 2. La caja para escribir (el input) */}
            <footer className="input-area">
                <form className="chat-form">
                    <input type="text" placeholder="Escribe tu pregunta aqui..." id="mensaje-input" autoComplete="off" />
                    <button type="submit">Enviar</button>
                </form>
            </footer>
        </main>
    );
}

export default ChatArea;