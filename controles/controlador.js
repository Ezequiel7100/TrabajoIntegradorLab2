import conexion from "../conexion.js"

async function login(req,res) {
    console.log(req.body);

    const user = req.body.user;
    const password = req.body.pass;  

    // Verificar si los campos estan completos
    if (!user || !password) {
        return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
    }

    // Consulta para encontrar al usuario en la base de datos
    const login = 'SELECT * FROM profesionales WHERE usuario = ?';
    conexion.query(login, [user], (error, results) => {
        if (error) {
            return res.status(500).send({ status: "Error", message: "Error en la base de datos" });
        }

        // Verificar si se encontro el usuario
        if (results.length === 0) {
            return res.status(400).send({ status: "Error", message: "Usuario no encontrado" });
        }

        const usuarioARevisar = results[0]; // Toma el primer resultado

        // Comparar la contraseña directamente
        if (usuarioARevisar.contrasena !== password) {
            return res.status(400).send({ status: "Error", message: "Contraseña incorrecta" });
        }
       
        // guarda el id_profesional en la sesión
        req.session.id_profesional = usuarioARevisar.id_profesional;

        // verifica si el usuario es admin
        const redirectUrl = (user === "admin") ? "/admin_panel" : "/index";
        


        // Si el login es exitoso, enviar una respuesta positiva con redirección
        return res.status(200).json({ 
            status: "ok", 
            message: "Usuario loggeado", 
            redirect: redirectUrl, 
            id_profesional: req.session.id_profesional 
        });
        //return res.status(200).json({ status: "ok", message: "Usuario loggeado", redirect: redirectUrl });
    });
    
}

export const metodo = {
    login
}