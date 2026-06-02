// COMPONENTE: Sidebar (Menú lateral)
function Sidebar() {
    // Este componente no tiene lógica compleja,
    // solo devuelve la estructura visual.
    return (
        // Recuerda: Convertimos el <aside class="sidebar"> en <div class="sidebar">
        <div class="sidebar">
        <aside className="sidebar">
            <div className="logo-area">
                <h2>IA MASTER</h2>
        </div>
        <nav className="menu-lateral">
            <button>+ Nuevo Chat</button>
            <div className="historial">
                <p>Historial reciente</p>
                <ul>
                    <li>¿Cómo hacer dieta?</li>
                    <li>Receta de pizza</li>
                </ul>
            </div>
        </nav>
        <div className="perfil">
            <span>Usuario Pro</span>
        </div>
        </aside>
        
        </div>
    );
}

export default Sidebar;