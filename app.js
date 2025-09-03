const path = require('path');
const express = require('express');
const app = express();


// Konfigurasi view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware untuk file statis (CSS, gambar, JS di sisi klien)
app.use(express.static(path.join(__dirname, 'public')));


// Routing
app.get('/', (req, res) => {
    var jwt = require("jsonwebtoken");

    var METABASE_SITE_URL = "https://metabase.statsbali.id";
    var METABASE_SECRET_KEY = "e0d77f022c36172beafd31f743aa08e432a150e3d3df880c94ea8a7f3febcb14";

    var payload = {
        resource: { dashboard: 12 },
        params: {},
        exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
    };
    var token = jwt.sign(payload, METABASE_SECRET_KEY);

    var iframeUrl = METABASE_SITE_URL + "/embed/dashboard/" + token +
        "#bordered=true&titled=true";
    res.render('index', { title: 'Beranda', year: new Date().getFullYear() ,iframeUrl : iframeUrl});
});


app.get('/about', (req, res) => {
    res.render('about', { title: 'Tentang', year: new Date().getFullYear() });
});


// 404 handler (opsional)
app.use((req, res) => {
    res.status(404).render('about', { title: '404 - Tidak Ditemukan', year: new Date().getFullYear() });
});


// Jalankan server
const PORT = process.env.PORT || 9101;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});