// componente principal: App
// 1. Importamos la hoja de estilos App.css
import './App.css';
// 2. Importamos las dos grandes mitades de nuestra pantalla: Sidebar y ChatArea
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
function App() {
  return (
    // Contenedor principal que usa flexbox (definido en App.css)
    // para poner las cosas lado a lado
    <div className="app-container">
      {/* inyectamos la mitad izquierda */}  
        <Sidebar />
      {/* inyectamos la mitad derecha */}
        <ChatArea />  
    </div>
    
  );
}

export default App;
