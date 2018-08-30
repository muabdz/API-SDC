const express = require('express');
const app = express();
const morgan = require('morgan');
const mysql = require('mysql');
const bodyParser = require('body-parser');

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: false}));

const connection = mysql.createConnection({
    host: '192.168.43.220',
    user: 'root',
    database: 'db_sdc'
    
});

app.post("/loginpenguji/:uid", (req, res) => {
    const paramsUid = req.params.uid;
    const queryPost = "UPDATE tb_admin SET admin_status = 1 WHERE admin_username = ?";
    connection.query(queryPost, [paramsUid], (err, rows, fields) => {
        if(err) {
            console.log("Login Gagal");
            res.sendStatus(500);
            throw err;
        }
        res.json({
            "message": "Petugas Berhasil Login",
            "status": true,
            "username": paramsUid
        });
    });

});

app.get("/loginpeserta/:id", (req, res) => {
    const paramsId = req.params.id;
        const queryGetData = "SELECT peserta_id, peserta_nama, kategori FROM tb_peserta WHERE peserta_id = ?";
    connection.query(queryGetData, [paramsId], (err, rows, fields) => {
        if(err) {
            console.log("Login Gagal");
            res.sendStatus(500);
            throw err;
        }
        res.json(rows);
    });

});

export default app;