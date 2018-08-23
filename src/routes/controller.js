const express = require('express');
const mysql = require('mysql');

const routes = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'db_sdc'
    
});

function connection(){
    return pool;
}
routes.post("/loginpenguji/:uid", (req, res) => {
    const paramsUid = req.params.uid;
    const queryPost = "UPDATE tb_admin SET admin_status = 1 WHERE admin_username = ?";
    connection().query(queryPost, [paramsUid], (err, rows, fields) => {
        if(err) {
            console.log("Login Gagal");
            res.json({
                "message": "Petugas Gagal Login",
                "status": false,
            });
        }

        res.json({
            "message": "Petugas Berhasil Login",
            "status": true,
            "username": paramsUid
        });
    });

});

routes.post("/logoutpenguji/:uid", (req, res) => {
    const paramsUid = req.params.uid;
    const queryPost = "UPDATE tb_admin SET admin_status = 0 WHERE admin_username = ?";
    connection().query(queryPost, [paramsUid], (err, rows, fields) => {
        if(err) {
            console.log("Logout Gagal");
            res.json({
                "message": "Petugas Gagal Logout",
                "status": false,
            });
        }
        res.json({
            "message": "Petugas Berhasil Logout",
            "status": true,
        });
    });

});

routes.post("/soal", (req, res) => {
    let bodySoal = [req.body.soal];
    let bodyComments = req.body.comments;
    const queryAnswer = "INSERT INTO tb_jawaban_praktek (soal_id, peserta_id, nilai, tanggal) VALUES(?,?,?,?)";
    const queryComment = "INSERT INTO tb_komentar_praktek (peserta_id, pengetahuan, teknik, perilaku, admin_id) VALUES(?,?,?,?,?)";
    connection().query(queryComment, [bodyComments.peserta_id, bodyComments.pengetahuan, bodyComments.teknik, bodyComments.perilaku, bodyComments.penguji], (err, rows, fields) => {
        if(err) {
            console.log("Submit Gagal");
            res.json({
                "message": "Gagal input data",
                "status": false,
            });
        }
    });
    for (i=0;i<bodySoal.length; i++){
        connection().query(queryAnswer, [bodySoal[i].soal_id, bodySoal[i].peserta_id, bodySoal[i].hasil, bodySoal[i].start], (err, rows, fields) => {
            if(err) {
                console.log("Submit Gagal");
                res.json({
                    "message": "Gagal input data",
                    "status": false,
                });
            }
        }); 
    }
    res.json({
        "message": "Data sudah berhasil di input",
        "status": true
    });
});

routes.get("/peserta/:id", (req, res) => {
    const paramsId = req.params.id;
    const queryGetData = "SELECT tb_peserta.peserta_id, tb_peserta.peserta_nama, tb_peserta.kategori, tb_soal_praktek.soal_id, tb_soal_praktek.nomor, tb_soal_praktek.kategori, tb_soal_praktek.soal FROM tb_peserta INNER JOIN tb_soal_praktek ON tb_peserta.kategori = tb_soal_praktek.kategori WHERE peserta_id = ? ORDER BY nomor";
    connection().query(queryGetData, [paramsId], (err, rows, fields) => {
        if(err) {
            console.log("Login Gagal");
            res.json({
                "message": "Gagal membaca data peserta",
                "status": false,
            });
        }
        let data = {
            p_id: JSON.stringify(rows[0].peserta_id),
            nama: rows[0].peserta_nama,
            cate: rows[0].kategori
        }
        let soal = [];
        for(let i=0; i<rows.length; i++){
            soal.push({
                id: rows[i].soal_id,
                nomor: rows[i].nomor,
                soal:rows[i].soal,
                cate: JSON.stringify(rows[i].kategori)
            });
        }
        res.json({
            data: data,
            message: "Berhasil membaca data peserta",
            soal: soal,
            status: true
        });
    });
});
module.exports = routes;