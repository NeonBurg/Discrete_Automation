function ModalForm() {

    var diagramId = null;

    //console.log('title: ' + _data.title + ' content: ' + _data.content);

    //console.log('------------> X: ' + elem.matrix.e);
    //console.log('------------> Y: ' + elem.matrix.f);

    var last_modal_type = null;

    this.input_variables_modal = 1;
    this.output_variables_modal = 2;
    this.connection_modal = 3;
    this.save_diagram_modal = 4;

    var conn_index = null;


    // -------------------- Отобразим модальное окно Содержимое диаграммы --------------------------
    this.showModalDialog = function (modal_type, _conn_index) {
        //console.log('title: ' + _data.title + ' content: ' + _data.content);
        //$('#ClassName').val(_data.title);
        //$('#DiagramText').val(_data.content);
        //diagramId = _diagramId;

        console.log('arguments.length = ' + arguments.length);

        this.create_view(modal_type);

        if(arguments.length === 2) conn_index = _conn_index;
        else conn_index = null;

        event.preventDefault(); // выключaем стaндaртную рoль элементa
        $('#overlay').fadeIn(200, // снaчaлa плaвнo пoкaзывaем темную пoдлoжку
            function () { // пoсле выпoлнения предъидущей aнимaции
                $('#modal_form')
                    .css('display', 'block') // убирaем у мoдaльнoгo oкнa display: none;
                    .animate({opacity: 1, top: '50%'}, 100); // плaвнo прибaвляем прoзрaчнoсть oднoвременнo сo съезжaнием вниз
            });
    };

    // ------------------- Удаляем представление ---------------------
    function remove_view() {
        //document.getElementById('modal_form').removeChild(document.getElementById('modal_form').getElementsByTagName('div')[0]);
        document.getElementById('modal_dynamic_content').remove();
    }


    // ------------------ Создаем модальное представление ----------------------
    this.create_view = function(modal_type) {
        var modal_dynamic_content = document.createElement('div');
        modal_dynamic_content.id = "modal_dynamic_content";
        switch(modal_type) {
            // --------- Представление для ввода ВХОДНЫХ переменных
            case this.input_variables_modal:
                modal_dynamic_content.innerHTML = 'Входные переменные:<br>' +
                                            '<div><input type="button" onclick="addVariable(null, true, false)" value="Добавить" style="height:20px; margin-right:10px;"></div>' +
                                            '<div id="input_variables_modal_content" style="width:100%;"></div>';

                document.getElementById('modal_form').appendChild(modal_dynamic_content);

                var input_variables = DiagramModel.getInputVariables();
                for(var key_name in input_variables) {
                    addVariable(key_name, true, false);
                }
                break;

            // --------- Представление для ввода ВЫХОДНЫХ переменных
            case this.output_variables_modal:
                modal_dynamic_content.innerHTML = 'Выходные переменные:<br>' +
                    '<div><input type="button" onclick="addVariable(null, false, false)" value="Добавить" style="height:20px; margin-right:10px;"></div>' +
                    '<div id="output_variables_modal_content" style="width:100%;"></div>';

                document.getElementById('modal_form').appendChild(modal_dynamic_content);

                var output_variables = DiagramModel.getOutputVariables();
                for(var key_name in output_variables) {
                    addVariable(key_name, false, false);
                }
                break;

            // --------- Представление для создания соединения
            case this.connection_modal:
                modal_dynamic_content.innerHTML = 'Создание связи<br>' +
                    'Входные переменные:<br>' +
                    '<div><input type="button" onclick="addVariable(null, true, true)" value="Добавить" style="height:20px; margin-right:10px;"></div>' +
                    '<div id="input_variables_modal_content" style="width:100%;"></div>' +
                    'Выходные переменные:<br>' +
                    '<div><input type="button" onclick="addVariable(null, false, true)" value="Добавить" style="height:20px; margin-right:10px;"></div>' +
                    '<div id="output_variables_modal_content" style="width:100%;"></div>';

                document.getElementById('modal_form').appendChild(modal_dynamic_content);

                var input_variables = DiagramModel.getInputVariables();
                for(var key_name in input_variables) {
                    addVariable(key_name, true, true);
                }

                var output_variables = DiagramModel.getOutputVariables();
                for(var key_name in output_variables) {
                    addVariable(key_name, false, true);
                }
                break;
            case this.save_diagram_modal:
                modal_dynamic_content.innerHTML = '<div style="margin-right:5px; display:block;">' +
                        '<div style="text-align:center;"><h3>Сохранение проекта</h3></div>' +
                        'Название проекта:<br>' +
                        '<div id="error_msg_save" style="color:crimson; font-size:10pt;"></div>' +
                        '<input id="ProjNameInput" style="width:100%;">' +
                        '<div style="overflow: auto;"><input type="button" onclick="controller.save_project_clicked()" value="Сохранить" style="height:25px; float:right; padding: 0 10px; margin-top:10px;"></div>' +
                        '<div style=""><div style="text-align:center; margin-top:15px;"><h3>Загрузка проекта</h3></div>' +
                        '<div id="error_msg_load" style="color:crimson; font-size:10pt;"></div>' +
                        '<select id="ProjSelect" style="width:100%;"></select>' +
                        '<input type="button" onclick="controller.load_project_clicked()" value="Загрузить" style="height:25px; position:rleative; float:right; padding: 0 10px; margin-top:10px;"></div>' +
                    '</div>';

                document.getElementById('modal_form').appendChild(modal_dynamic_content);

                $.get("/getProjectsNamesList", {}, function(response) {
                    var projects_filenames = JSON.parse(response);
                    var projSel = document.getElementById('ProjSelect');
                    for(var i=0; i<projects_filenames.length; i++) {
                        projSel.options[i] = new Option(projects_filenames[i], projects_filenames[i]);
                    }

                    if(DiagramModel.current_project_index !== -1) {
                        $('#ProjNameInput').val(DiagramModel.current_project_name);
                        projSel.options[DiagramModel.current_project_index].selected = true;
                    }
                    else if(projSel.options.length > 0) {
                        projSel.options[0].selected = true;
                    }
                });

                break;
        }
        last_modal_type = modal_type;
    };


    // ----------- Сохраняем данные в модель после закрытия модального окна ------------
    function save_model_data() {
        //console.log('save_data: last_modal_type = ' + last_modal_type);
        switch(last_modal_type) {
            case modal_form.input_variables_modal:
                saveInputsModel();
                break;

            case modal_form.output_variables_modal:
                saveOutputsModel();
                break;

            case modal_form.connection_modal:
                saveInputsModel();
                saveOutputsModel();
                break;
        }
    };

    function saveInputsModel() {
        let input_variables = DiagramModel.getInputVariables();
        DiagramModel.clearInputVariables();
        for(let key_name in input_variables) {
            //console.log('----------------------');
            //console.log('key_name = ' + key_name);
            let v_name = document.getElementById('inptNameId_'+key_name).value;
            let v_value = document.getElementById('inptValueId_'+key_name).value;
            //document.getElementById('inputCheckBoxId_'+key_name).id = 'inputCheckBoxId_'+v_name;
            //console.log('inptNameId_'+key_name+' = ' + v_name);
            //console.log('inptValueId_'+key_name+' = ' + v_value);
            DiagramModel.addInputVariable(v_name, v_value);
        }
    }

    function saveOutputsModel() {
        let output_variables = DiagramModel.getOutputVariables();
        DiagramModel.clearOutputVariables();
        for(let key_name in output_variables) {
            let v_name = document.getElementById('outputNameId_'+key_name).value;
            let v_value = document.getElementById('outputValueId_'+key_name).value;
            //document.getElementById('outputCheckBoxId_'+key_name).id = 'outputCheckBoxId_'+v_name;
            DiagramModel.addOutputVariable(v_name, v_value);
        }
    }

    function create_conn_text() {
        console.log('create_conn_text');

        let conn_input_vars = [];
        let conn_output_vars = [];

        let input_variables = DiagramModel.getInputVariables();
        let input_count = 0;
        for(let key_name in input_variables) {
            console.log('key_name = ' + key_name);
            let check_box = document.getElementById('inputCheckBoxId_'+key_name);
            console.log('checkbox = ' + check_box.checked);
            if(check_box.checked) {
                conn_input_vars.push(document.getElementById('inptNameId_'+key_name).value);
                input_count++;
            }
        }


        let output_variables = DiagramModel.getOutputVariables();

        let output_count = 0;
        for(let key_name in output_variables) {
            console.log('key_name = ' + key_name);
            let check_box = document.getElementById('outputCheckBoxId_'+key_name);
            console.log('checkbox = ' + check_box.checked);
            if(check_box.checked) {
                conn_output_vars.push(document.getElementById('outputNameId_'+key_name).value);
                output_count++;
            }
        }

        controller.setConnectionVariables(conn_index, conn_input_vars, conn_output_vars);
    }


    $('#modal_close, #overlay').click(function () { // лoвим клик пo крестику или пoдлoжке

        controller.selectTool(0);

        if(conn_index !== null) {
            create_conn_text();
        }
        else {
            console.log('conn_index undifined!');
        }

        save_model_data();

        //console.log('modal_form.conn_index = ' + conn_index);

        remove_view();

        $('#modal_form')
            .animate({opacity: 0, top: '45%'}, 200,  // плaвнo меняем прoзрaчнoсть нa 0 и oднoвременнo двигaем oкнo вверх
                function () { // пoсле aнимaции
                    $(this).css('display', 'none'); // делaем ему display: none;
                    $('#overlay').fadeOut(400); // скрывaем пoдлoжку
                }
            );
    });



    this.getSelectedDiagramId = function () {
        return diagramId;
    }
}