module.exports = function (app) {

    app.get('/', function (req, res) {
        res.redirect('/home');
    });

    app.get('/home', function(req, res) {
        res.render('home.html');
    });

    app.get('/test', function(req, res) {
        res.render('test.html');
    });

}