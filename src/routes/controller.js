const express = require('express');
const routes = express.Router();
const mysql = require('mysql');

// routes.use(express.json());

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
            return res.json({
                "message": "Petugas Gagal Login",
                "status": false,
            });
        }

        return res.json({
            "message": "Petugas Berhasil Login",
            "status": true,
            "username": paramsUid
        });
    });

});

routes.post("/test", (req, res) => {

    console.log(req.body)

})

routes.post("/logoutpenguji/:uid", (req, res) => {
    console.log(req.params);
    const paramsUid = req.params.username;
    const queryPost = "UPDATE tb_admin SET admin_status = 0 WHERE admin_username = ?";
    connection().query(queryPost, [paramsUid], (err, rows, fields) => {
        if(err) {
            console.log("Logout Gagal");
            console.log(req.body);
            return res.json({
                "message": "Petugas Gagal Logout",
                "status": false,
            });
        }
        return res.json({
            "message": "Petugas Berhasil Logout",
            "status": true,
        });
    });

});


routes.post("/soal", (req, res) => {
    console.log(req.body);
    const reqBody = req.body;
    const soal = reqBody.soal;
    const comments = reqBody.comments;
    const pesertaId = comments.peserta_id;
    const pengetahuan = comments.pengetahuan;
    const teknik = comments.teknik;
    const perilaku = comments.perilaku;
    const penguji = comments.penguji;
    const queryAnswer = "INSERT INTO tb_jawaban_praktek (soal_id, peserta_id, nilai, tanggal) VALUES(?,?,?,?)";
    const queryComment = "INSERT INTO tb_komentar_praktek (peserta_id, pengetahuan, teknik, perilaku, admin_username) VALUES(?,?,?,?,?)";
    for (i=0;i<soal.length; i++){
        let soalId = soal[i].soal_id;
        let pesertaId = soal[i].peserta_id;
        let hasil = soal[i].hasil;
        let start = soal[i].start;
        connection().query(queryAnswer, [soalId, pesertaId, hasil, start], (err, rows, fields) => {
                    if(err) {
                console.log("Submit Gagal");
                return res.json({
                    "message": "Gagal input data",
                    "status": false,
                });
            }
        }); 
    }
    connection().query(queryComment, [pesertaId, pengetahuan, teknik, perilaku, penguji], (err, rows, fields) => {
            if(err) {
            console.log("Submit Gagal");
            return res.json({
                "message": "Gagal input data",
                "status": false,
            });
        }
    });
    // for (i=0;i<reqBody.length; i++){
    //     connection().query(queryAnswer, [reqBody[i].soal_id, reqBody[i].peserta_id, reqBody[i].hasil, reqBody[i].start], (err, rows, fields) => {
    
    return res.json({
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
            return res.json({
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
                kategori: rows[i].kategori
            });
        }
        return res.json({
            data: data,
            message: "Berhasil membaca data peserta",
            soal: soal,
            status: true
        });
    });
});
module.exports = routes;