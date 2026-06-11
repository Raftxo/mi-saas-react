// componente principal: App
// 1. Importamos la hoja de estilos App.css
import './App.css';
// 2. Importamos las dos grandes mitades de nuestra pantalla: Sidebar y ChatArea
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { useState, useCallback, useEffect } from 'react';

function App() {
  // Estado para el historial de chats (inicialmente vacío)
  const [historial, setHistorial] = useState([]);
  
  // Estado para el chat actual
  const [chatActual, setChatActual] = useState(null);
  
  // Estado para el tema (oscuro por defecto)
  const [temaOscuro, setTemaOscuro] = useState(() => {
    const guardado = localStorage.getItem('temaOscuro');
    return guardado !== null ? JSON.parse(guardado) : true;
  });

  // Efecto para guardar el tema en localStorage y aplicar la clase al body
  useEffect(() => {
    localStorage.setItem('temaOscuro', JSON.stringify(temaOscuro));
    if (temaOscuro) {
      document.body.classList.remove('tema-claro');
    } else {
      document.body.classList.add('tema-claro');
    }
  }, [temaOscuro]);

  // Función para extraer palabras significativas de un texto
  const extraerPalabraSignificativa = useCallback((texto) => {
    // Palabras vacías (stop words) en español e inglés
    const stopWords = new Set([
      'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
      'de', 'del', 'al', 'en', 'con', 'sin', 'sobre', 'entre',
      'por', 'para', 'desde', 'hasta', 'hacia', 'que', 'cual',
      'cual', 'quien', 'quienes', 'donde', 'cuando', 'como',
      'que', 'y', 'o', 'pero', 'si', 'no', 'también', 'solo',
      'más', 'menos', 'muy', 'tan', 'tanto', 'poco', 'mucho',
      'todo', 'toda', 'todos', 'todas', 'nada', 'algo', 'esto',
      'eso', 'aquello', 'mi', 'tu', 'su', 'nuestro', 'vuestro',
      'me', 'te', 'se', 'nos', 'os', 'lo', 'le', 'les', 'la',
      'las', 'los', 'a', 'ante', 'bajo', 'cabe', 'contra',
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at',
      'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are',
      'was', 'were', 'be', 'been', 'being', 'have', 'has',
      'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'shall', 'can',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me',
      'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its',
      'our', 'their', 'what', 'which', 'who', 'whom', 'whose',
      'this', 'that', 'these', 'those', 'am', 'is', 'are',
      'how', 'when', 'where', 'why', 'if', 'then', 'so',
      'not', 'no', 'nor', 'both', 'few', 'more', 'most',
      'other', 'some', 'such', 'than', 'too', 'very', 'just'
    ]);

    // Limpiar texto: quitar signos de puntuación y convertir a minúsculas
    const textoLimpio = texto.toLowerCase()
      .replace(/[¿?¡!.,"''()[\]{}:;<>|@#$%^&*_+=`~]/g, ' ')
      .trim();

    // Dividir en palabras
    const palabras = textoLimpio.split(/\s+/).filter(p => p.length > 2);

    // Encontrar la primera palabra significativa
    for (const palabra of palabras) {
      if (!stopWords.has(palabra) && palabra.length > 3) {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1);
      }
    }

    // Si no hay palabras significativas, usar las primeras palabras
    if (palabras.length > 0) {
      return palabras[0].charAt(0).toUpperCase() + palabras[0].slice(1);
    }

    return 'Chat';
  }, []);

  // Función para crear un nuevo chat
  const nuevoChat = useCallback((titulo) => {
    // Si no se proporciona título, usar uno por defecto
    const tituloChat = titulo ? extraerPalabraSignificativa(titulo) : `Chat ${historial.length + 1}`;
    
    // Crear nuevo chat con ID único
    const nuevoChatObj = {
      id: Date.now(),
      titulo: tituloChat,
      mensajes: []
    };
    
    // Añadir al historial (al principio)
    setHistorial(prev => [nuevoChatObj, ...prev]);
    
    // Establecer como chat actual
    setChatActual(nuevoChatObj);
    
    return nuevoChatObj;
  }, [historial.length, extraerPalabraSignificativa]);
  
  // Función para cargar un chat del historial
  const cargarChat = useCallback((chatId) => {
    const chat = historial.find(c => c.id === chatId);
    if (chat) {
      setChatActual(chat);
    }
  }, [historial]);
  
  // Función para generar título a partir de múltiples mensajes (2-3 primeros)
  const generarTituloDesdeMensajes = useCallback((mensajes) => {
    // Filtrar solo los mensajes del usuario (máximo 3)
    const mensajesUsuario = mensajes
      .filter(m => m.rol === 'usuario')
      .slice(0, 3);
    
    if (mensajesUsuario.length === 0) return 'Chat';
    
    // Extraer palabras significativas de cada mensaje
    const palabrasClave = mensajesUsuario
      .map(m => extraerPalabraSignificativa(m.texto))
      .filter(p => p && p !== 'Chat');
    
    if (palabrasClave.length === 0) return 'Chat';
    
    // Unir las palabras clave (máximo 3)
    return palabrasClave.slice(0, 3).join(' · ');
  }, [extraerPalabraSignificativa]);

  // Función para actualizar el título del chat actual basado en los primeros mensajes
  const actualizarTituloChat = useCallback((promptUsuario) => {
    if (!chatActual || (!chatActual.titulo.startsWith('Chat ') && chatActual.titulo !== 'Chat')) {
      return;
    }

    // Contamos cuántos mensajes de usuario llevamos
    const mensajesUsuarioCount = chatActual.mensajes.filter(m => m.rol === 'usuario').length;
    
    // Si ya tenemos 3 o más mensajes de usuario, no actualizamos más el título
    if (mensajesUsuarioCount >= 3) {
      return;
    }

    // Añadimos el nuevo mensaje a la lista temporal
    const mensajesActualizados = [...chatActual.mensajes, { rol: 'usuario', texto: promptUsuario }];
    
    // Generamos el título basado en los primeros 2-3 mensajes
    const nuevoTitulo = generarTituloDesdeMensajes(mensajesActualizados);
    
    setHistorial(prev => prev.map(chat => 
      chat.id === chatActual.id ? { ...chat, titulo: nuevoTitulo } : chat
    ));
    
    setChatActual(prev => ({ ...prev, titulo: nuevoTitulo }));
  }, [chatActual, generarTituloDesdeMensajes]);

  // Función para alternar entre tema claro y oscuro
  const alternarTema = useCallback(() => {
    setTemaOscuro(prev => !prev);
  }, []);

  return (
    // Contenedor principal que usa flexbox (definido en App.css)
    // para poner las cosas lado a lado
    <div className="app-container">
      {/* inyectamos la mitad izquierda */}  
        <Sidebar 
          historial={historial}
          chatActual={chatActual}
          onNuevoChat={nuevoChat}
          onCargarChat={cargarChat}
        />
      {/* inyectamos la mitad derecha */}
        <ChatArea 
          chatActual={chatActual}
          onActualizarTitulo={actualizarTituloChat}
          temaOscuro={temaOscuro}
          onAlternarTema={alternarTema}
        />
    </div>
    
  );
}

export default App;
