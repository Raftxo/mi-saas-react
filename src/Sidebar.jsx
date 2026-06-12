// COMPONENTE: Sidebar (Menú lateral)
import logo from './assets/fistro_ia_logo.svg';

function Sidebar({ historial, chatActual, onNuevoChat, onCargarChat }) {
    // Manejar click en "Nuevo Chat"
    const manejarNuevoChat = () => {
        // Crear nuevo chat (sin título inicial, se generará automático)
        onNuevoChat();
    };

    // Manejar click en un chat del historial
    const manejarCargarChat = (chatId) => {
        onCargarChat(chatId);
    };

    return (
        <aside className="sidebar">
            <div className="logo-area">
                <img src={logo} alt="Mister IA Logo" className="logo-img" />
            </div>
            <nav className="menu-lateral">
                <button onClick={manejarNuevoChat}>+ Nuevo Chat</button>
                <div className="historial">
                    <p>Historial reciente</p>
                    <ul>
                        {historial.map((chat) => (
                            <li 
                                key={chat.id} 
                                className={chatActual?.id === chat.id ? 'activo' : ''}
                                onClick={() => manejarCargarChat(chat.id)}
                            >
                                {chat.titulo}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
            <div className="perfil">
                <a href="https://github.com/Raftxo" target="_blank" rel="noopener noreferrer" className="copyright-link">
                    © raftxo
                </a>
            </div>
        </aside>
    );
}

export default Sidebar;