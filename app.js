const path = require('path');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const session = require('express-session');

// Middleware
app.use(express.urlencoded({ extended: true }));

// Konfigurasi view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware untuk file statis (CSS, gambar, JS di sisi klien)
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '68b79e18-d7d8-8332-92ed-5181de87c653', // ganti dengan yang lebih aman
  resave: false,
  saveUninitialized: false
}));

// Middleware cek login
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login');
}


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const match = username=='adminpst51' && password=='uti@5100';

  if (!match) {
    return res.render('login', { error: 'Password salah' });
  }

  // Simpan user ke session
  req.session.user = { username: username };
  res.redirect('/');
});

// Routing
app.get('/',isAuthenticated, (req, res) => {
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

app.get('/logout',isAuthenticated, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});


app.get('/login', (req, res) => {
    res.render('login', { title: 'Login', year: new Date().getFullYear() });
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