import express from "express";

const router = express.Router();


router.get('/', (req,res) =>{ res.render('login')});
router.get('/index', (req, res) => {res.render('index');});
router.get('/historial_paciente', (req, res) => {res.render('historial_paciente');})
router.get('/admin_panel', (req, res) => {res.render('admin_panel'); });
export { router} 
