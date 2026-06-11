// ==========================================
// COMPONENTE: ChatArea (Zona derecha principal)
// ==========================================

import { useState, useRef, useEffect } from "react";
import Mensaje from "./Mensaje";

function ChatArea({ chatActual, onActualizarTitulo }) {
  // ==========================================
  //  ZONA DE MEMORIA (ESTADOS)
  // ==========================================

  const [textoInput, setTextoInput] = useState("");

  // Estado local para los mensajes del chat actual
  const [listaMensajes, setListaMensajes] = useState([
    {
      rol: "ia",
      texto:
        "¡Hola! Soy IA Master. Conectado a la velocidad de Groq. ¿En qué te ayudo hoy?",
    },
  ]);

  // Referencia al contenedor de mensajes para el scroll automático
  const mensajesContainerRef = useRef(null);

  // Efecto para hacer scroll automático al final cuando hay nuevos mensajes
  useEffect(() => {
    if (mensajesContainerRef.current) {
      mensajesContainerRef.current.scrollTop =
        mensajesContainerRef.current.scrollHeight;
    }
  }, [listaMensajes]);

  // Efecto para cargar mensajes cuando cambia el chat actual
  useEffect(() => {
    if (chatActual && chatActual.mensajes && chatActual.mensajes.length > 0) {
      setListaMensajes(chatActual.mensajes);
    } else {
      // Mensaje de bienvenida por defecto
      setListaMensajes([
        {
          rol: "ia",
          texto: "¡Hola! Soy Mister IA. Un sabelotodo. ¿En qué te ayudo hoy?",
        },
      ]);
    }
  }, [chatActual]);

  // ==========================================
  // ⚙️ ZONA DE LÓGICA (ACCIONES - GROQ API)
  // ==========================================

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    if (textoInput.trim() === "") return;

    // 1. Guardamos el texto del usuario
    const promptUsuario = textoInput;
    const mensajeUsuario = { rol: "usuario", texto: promptUsuario };

    // Actualizar título del chat si es el primer mensaje
    if (listaMensajes.length <= 1) {
      onActualizarTitulo(promptUsuario);
    }

    // Mostramos el mensaje del usuario inmediatamente y el "Pensando..."
    const nuevosMensajes = [
      ...listaMensajes,
      mensajeUsuario,
      { rol: "ia", texto: "Procesando a la velocidad de la luz..." },
    ];
    setListaMensajes(nuevosMensajes);
    setTextoInput("");

    try {
      // 2. CONEXIÓN AL CEREBRO DE GROQ
      const API_KEY = import.meta.env.VITE_GROQ_API_KEY_I2; // no expiration key I2 and A3, R1 expires in September
      // const API_KEY = import.meta.env.VITE_GROQ_API_KEY; // esta api_key está en .env.local y no funciona
      const URL = "https://api.groq.com/openai/v1/chat/completions";

      const respuesta = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Groq exige que la clave vaya aquí, como un "Bearer token"
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `
Eres un comediante español (de España) con humor cínico, irónico y un poco borde.

IMPORTANTE:
- Responde siempre en español natural
- NO traduzcas chistes del inglés
- Evita expresiones que suenen artificiales
- Usa humor que un español entienda fácilmente
- Puedes ser absurdo, pero que suene natural
- Usa emojis con moderación 😏

Tu objetivo es hacer respuestas graciosas, no resolver el problema.
`,
            },
            {
              role: "user",
              content: "No tengo ganas de trabajar hoy",
            },
            {
              role: "assistant",
              content:
                "Tranquilo, es un síntoma bastante común de estar vivo 😌",
            },
            {
              role: "user",
              content: promptUsuario,
            },
          ],
          temperature: 0.5,
        }),
      });

      const datos = await respuesta.json();

      // Escudo de seguridad por si falla la clave
      if (!respuesta.ok) {
        console.error("Error de Groq:", datos);
        throw new Error(
          datos.error?.message || "La API de Groq rechazó la conexión",
        );
      }

      // 3. EXTRAEMOS LA RESPUESTA DE GROQ
      // La ruta para encontrar el texto en Groq/OpenAI es esta:
      const textoIA = datos.choices[0].message.content;
      const mensajeIA = { rol: "ia", texto: textoIA };

      // 4. ACTUALIZAMOS LA PANTALLA
      setListaMensajes((listaActual) => {
        const listaSinPensando = listaActual.slice(0, -1);
        return [...listaSinPensando, mensajeIA];
      });
    } catch (error) {
      console.error("Error conectando con Groq:", error);

      setListaMensajes((listaActual) => {
        const listaSinPensando = listaActual.slice(0, -1);
        return [
          ...listaSinPensando,
          { rol: "ia", texto: `❌ Error neuronal: ${error.message}` },
        ];
      });
    }
  };

  // ==========================================
  //  ZONA VISUAL (LO QUE VE EL USUARIO)
  // ==========================================
  return (
    <main className="chat-area">
      <section
        className="mensajes-container"
        id="caja-mensajes"
        ref={mensajesContainerRef}
      >
        {listaMensajes.map((msg, indice) => (
          <Mensaje key={indice} rol={msg.rol} texto={msg.texto} />
        ))}
      </section>

      <footer className="input-area">
        <form className="chat-form" onSubmit={manejarEnvio}>
          <input
            type="text"
            id="mensaje-input"
            placeholder="Escribe tu prompt para Groq..."
            autoComplete="off"
            value={textoInput}
            onChange={(evento) => setTextoInput(evento.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
      </footer>
    </main>
  );
}

export default ChatArea;
