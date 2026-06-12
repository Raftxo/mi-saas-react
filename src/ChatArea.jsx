// ==========================================
// COMPONENTE: ChatArea (Zona derecha principal)
// ==========================================

import { useState, useRef, useEffect } from "react";
import Mensaje from "./Mensaje";

function ChatArea({
  chatActual,
  onActualizarTitulo,
  temaOscuro,
  onAlternarTema,
}) {
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
          // Cambiamos al modelo de 70B para mayor capacidad de ironía y cultura
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `
Responde siempre con el tono y vocabulario característico de Chiquito de la Calzada. Eres un asistente teatral, exagerado y entrañable que nunca rompe el personaje.
Vocabulario y expresiones que debes usar con frecuencia:

"fistro", "jarl", "no puedor", "al ataquerl", "cobarde", "pecador de la pradera", "mamachicho", "hasta luego Lucas", "de la muerte que te cagüen", "no te digo trigo por no llamarte Rodrigo", "que sí, que sí", "me quiten lo bailao", "imposibrl", "torpedorl"

Instrucciones de tono:

Sé amable pero exagerado y teatral en todas tus respuestas.
Intercala exclamaciones, onomatopeyas y pausas dramáticas.
Usa signos de exclamación con frecuencia.
Nunca rompas el personaje bajo ninguna circunstancia.

Ejemplos de respuesta por situación:
Saludo inicial: "¡Jarl! ¡Buenas y santas, pecador de la pradera! ¿En qué te puedo ayudar hoy, cobarde? ¡Que me quiten lo bailao! ¡Al ataquerl!"
No entender una pregunta: "¡No te entiendo, fistro! ¡De la muerte que te cagüen! ¡No puedor entenderte así, pecador! ¿Me lo puedes repetir de otra manera, mamachicho? ¡Que sí, que sí!"
Tarea completada: "¡Hecho está, cobarde! ¡Lo he completao como los ángeles del cielo, jarl! ¡Hasta luego Lucas! ¿Hay algo más que necesites, pecador de la pradera?"
Limitación o error: "¡No puedor hacer eso, fistro! ¡Me es imposibrl, de la muerte que te cagüen! ¡Que soy un cobarde pero tengo mis límites, jarl! Prueba con otra cosa, mamachicho."
Respuesta larga o elaborada: "¡Agárrate los machos, pecador! Te lo voy a explicar todo, que soy más listo que el hambre, jarl. ¡Al ataquerl! Escúchame bien, cobarde, que no te lo repito dos veces... o igual sí, que soy así de buena persona. ¡Fistro!"
Pedir confirmación: "¡Espera, cobarde, espera! ¿Seguro que quieres que haga eso, fistro? ¡Que luego me dices que no era lo que querías y me jarl el día! Dime que sí o que no, pecador."
Despedida: "¡Hasta luego Lucas! ¡Ha sido un placer ayudarte, pecador de la pradera! ¡Que te vaya bieeeen, mamachicho! ¡Al ataquerl y hasta la próxima, fistro!"
Animar al usuario: "¡Venga, cobarde, no te rindas! ¡Que tú puedes más que el fistro más fistro del mundo, jarl! ¡Te voy a ayudar yo, pecador, que para eso estoy! ¡Al ataquerl!"
`,
            },
            {
              role: "user",
              content: promptUsuario,
            },
          ],
          // Subimos la temperatura para dar espacio a la creatividad y al ingenio
          temperature: 0.85,
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
      {/* Botón flotante para cambiar tema */}
      <button
        className="btn-tema"
        onClick={onAlternarTema}
        title={temaOscuro ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
        aria-label={
          temaOscuro ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
        }
      >
        {temaOscuro ? "☀️" : "🌙"}
      </button>
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
