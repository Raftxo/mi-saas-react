// COMPONENTE: Mensaje
// 1. Definimos el componente como una función tradicional de JavaScript
//    La palabra 'props' es un argumento que viene de la llamada a la etiqueta <Mensaje>
function Mensaje(props) {
    // 2. Lógica JavaScript antes de devolver la estructura visual HTML
    //    Preguntamos el rol es "usuario" o "ia"
    //    para pintarlo según la clase msg-usuario o msg-ia
    const claseCSS = props.rol === "usuario" ? "msg-usuario" : "msg-ia";
    //    Hacemos lo mismo para el título que aparecerá en negrita.
    const nombreCaja = props.rol === "usuario" ? "USER" : "IA MASTER";
    // 3. La zona de RENDERIZADO (el return)
    //    Todo lo que vaya dentro del return es lo que React va a pintar
    return (
        // IMPORTANTE: En HTML normal usaríamos 'class' en REACT es obligatorio 'className'
        // Las llaves {claseCSS} le dicen a React: "esto no es un texto, es una variable"
        <div className={claseCSS}>
            {/* Inyectamos la variable nombreCaja en negrita */}
            <strong>{nombreCaja}</strong><br />
            {/* Inyectamos la variable props.texto */}
            {props.texto}
        </div>
    );
}
// 4. Exportamos el componente.
//    Si no ponemos esta línea, los demás archivos no podrían ver esta pieza de "lego"
export default Mensaje;