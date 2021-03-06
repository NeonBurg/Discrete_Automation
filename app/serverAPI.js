module.exports = function (app) {

    var fs = require('fs'); // File System
    var projDirPath = './projects';

    // Выполняем сохранение проекта в файл json
    app.post('/saveProject', function(req, res, next) {

        //console.log('saveProject method');

        if(req.body.pName && req.body.pData) {

            if(!fs.existsSync(projDirPath)) {
                fs.mkdirSync(projDirPath);
            }

            var pFilePath = './projects/' + req.body.pName + '.json';
            fs.writeFile(pFilePath, req.body.pData, function () {
                res.end('true');
            });
        }
        else {
            console.log('undefined pName && pData');
            res.end('false');
        }

    });


    app.post('/readProjectFile', function(req, res) {

        if(req.body.pFileName) {

            var pFilePath = projDirPath + '/' + req.body.pFileName + '.json';
            if(fs.existsSync(pFilePath)) {
                var fileText = fs.readFileSync(pFilePath, 'utf8');
                var result = {'pData' : fileText};
                res.end(JSON.stringify(result));
            }
            else {
                console.log('file: ' + pFilePath + 'does not exist')
                res.end('false');
            }
        }
        else {
            console.log('undefined pFileName');
            res.end('false');
        }

    });


    // Получаем список сохраненных проектов
    app.get('/getProjectsNamesList', function(req, res) {

        //console.log('getProjectsList');

        var projects_filenames_list = [];
        var projects_files = fs.readdirSync(projDirPath);

        for(var i=0; i<projects_files.length; i++) {
            projects_filenames_list.push(projects_files[i].substring(0, projects_files[i].length-5));
            //console.log('file: ' + projects_files[i]);
        }

        res.end(JSON.stringify(projects_filenames_list));
    });

    app.post('/getIsProjectNameUnique', function(req, res) {

        console.log("pName: " + req.body.pName);

        var is_name_unique = true;

        if(req.body.pName) {
            var projects_files = fs.readdirSync(projDirPath);

            for(var i=0; i<projects_files.length; i++) {
                var exist_project_name = projects_files[i].substring(0, projects_files[i].length-5);
                console.log('exist_project_name = ' + exist_project_name + ' | pName = ' + req.body.pName);
                if(exist_project_name === req.body.pName) is_name_unique = false;
            }
        }

        res.end(is_name_unique.toString());
    });

};