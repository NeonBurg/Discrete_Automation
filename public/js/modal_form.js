function ModalForm() {

    let diagramId = null;

    //console.log('title: ' + _data.title + ' content: ' + _data.content);

    //console.log('------------> X: ' + elem.matrix.e);
    //console.log('------------> Y: ' + elem.matrix.f);

    let last_modal_type = null;

    this.input_variables_modal = 1;
    this.output_variables_modal = 2;
    this.connection_modal = 3;
    this.save_diagram_modal = 4;
    this.node_info_modal = 5;

    let conn_index = null;
    let node_index = null;
    let connection_info_text = null;


    // -------------------- Отобразим модальное окно Содержимое диаграммы --------------------------
    this.showModalDialog = function (modal_type, _conn_index, data) {
        //console.log('title: ' + _data.title + ' content: ' + _data.content);
        //$('#ClassName').val(_data.title);
        //$('#DiagramText').val(_data.content);
        //diagramId = _diagramId;

        console.log('arguments.length = ' + arguments.length);

        if(arguments.length >= 2 && _conn_index !== null) conn_index = _conn_index;
        else if(arguments.length === 1) conn_index = null;

        if(arguments.length >= 3) {
            //console.log('data = ' + JSON.stringify(data));
            //console.log('conn: ' + data.connectsFrom + ' - ' + data.connectsTo);
            if('connectsFrom' in data && 'connectsTo' in data) {
                connection_info_text = DiagramModel.getNodeTitleByIndex(data.connectsFrom) + ' -> ' + DiagramModel.getNodeTitleByIndex(data.connectsTo);
                console.log('conn: ' + connection_info_text);
                //$('#connection_from_to').append(connection_info_text);
            }
            else if('node_index' in data) {
                node_index = data.node_index;
                let node_title = DiagramModel.getNodeTitleByIndex(node_index);
                $('#node_title_text').append(node_title);
            }
        }

        this.create_view(modal_type);

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
                modal_dynamic_content.innerHTML = 'Создание связи <div id="connection_from_to" style="display:inline-block;"></div><br>' +
                    'Входные переменные:<br>' +
                    '<div><input type="button" onclick="addVariable(null, true, true)" value="Добавить" style="height:20px; margin-right:10px;"></div>' +
                    '<div id="input_variables_modal_content" style="width:100%;"></div>' +
                    'Выходные переменные:<br>' +
                    '<div><input type="button" onclick="addVariable(null, false, true)" value="Добавить" style="height:20px; margin-right:10px;"></div>' +
                    '<div id="output_variables_modal_content" style="width:100%;"></div>';

                document.getElementById('modal_form').appendChild(modal_dynamic_content);

                if(connection_info_text !== null) {
                    console.log('connection_info_text = ' + connection_info_text);
                    $('#connection_from_to').append(connection_info_text);
                }

                var input_variables = DiagramModel.getInputVariables();
                for(var key_name in input_variables) {
                    addVariable(key_name, true, true);
                }

                var output_variables = DiagramModel.getOutputVariables();
                for(var key_name in output_variables) {
                    addVariable(key_name, false, true);
                }

                if(conn_index !== null) {
                    let conn_input_vars = DiagramModel.getConnectInputVariables(conn_index);
                    for(key in conn_input_vars) {
                        //console.log('key = ' + conn_input_vars[key]);
                        document.getElementById('inputCheckBoxId_'+conn_input_vars[key]).checked = true;
                    }

                    let conn_output_vars = DiagramModel.getConnectOutputVariables(conn_index);
                    for(key in conn_output_vars) {
                        //console.log('key = ' + conn_output_vars[key]);
                        document.getElementById('outputCheckBoxId_'+conn_output_vars[key]).checked = true;
                    }
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
            case this.node_info_modal:
                modal_dynamic_content.innerHTML = '<div style="padding-bottom:10px;">Редактирование вершины \'<div id="node_title_text" style="display:inline-block;"></div>\'</div>' +
                                                '<div style="margin-bottom:5px; cursor:pointer;" onclick="modal_form.node_state_changed(0)"><input type="checkbox" id="start_node_state" style="width:18px; height:18px; display: inline-block; margin-right:5px; margin-top:3px; cursor:pointer;" onclick="modal_form.node_state_changed(0)">' +
                                                '<div style="display:inline-block; vertical-align: top;">Начальное состояние</div></div>' +
                                                '<div style="cursor:pointer;" onclick="modal_form.node_state_changed(1)"><input type="checkbox" id="end_node_state" style="width:18px; height:18px; display: inline-block; margin-right:5px; margin-top:3px; cursor:pointer;" onclick="modal_form.node_state_changed(1)">' +
                                                '<div style="display:inline-block; vertical-align: top;">Конечное состояние</div></div>';
                document.getElementById('modal_form').appendChild(modal_dynamic_content);

                if(node_index === DiagramModel.getStartDiagramIndex()) {
                    document.getElementById('start_node_state').checked = true;
                }
                else if(node_index === DiagramModel.getEndDiagramIndex()) {
                    document.getElementById('end_node_state').checked = true;
                }

                break;
        }
        last_modal_type = modal_type;
    };

    this.node_state_changed = function(node_state) {
        console.log('node_state_changed');
        let start_node = document.getElementById('start_node_state');
        let end_node = document.getElementById('end_node_state');
        if(node_state === 0) {
            start_node.checked = !start_node.checked;
            end_node.checked = false;
        }
        else if(node_state === 1) {
            end_node.checked = !end_node.checked;
            start_node.checked = false;
        }
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
            case modal_form.node_info_modal:
                if(node_index !== null) {
                    let node_state_text = null;
                    if(document.getElementById('start_node_state').checked) {
                        let old_start_node_index = DiagramModel.getStartDiagramIndex();
                        console.log('old_start_node_index = ' + old_start_node_index);
                        if(old_start_node_index !== -1) {
                            DiagramModel.getDrawableByIndex(old_start_node_index).select('.nodeStateText').attr({visibility: 'hidden', text: ''});
                        }

                        DiagramModel.setStartDiagramIndex(node_index);
                        node_state_text = 'start';
                    }
                    else if(document.getElementById('end_node_state').checked) {
                        let old_end_node_index = DiagramModel.getEndDiagramIndex();
                        if(old_end_node_index !== -1) {
                            DiagramModel.getDrawableByIndex(old_end_node_index).select('.nodeStateText').attr({
                                visibility: 'hidden',
                                text: ''
                            });
                        }

                        DiagramModel.setEndDiagramIndex(node_index);
                        node_state_text = 'end';
                    }

                    if(node_state_text !== null) {
                        DiagramModel.getDrawableByIndex(node_index).select('.nodeStateText').attr({
                            visibility: 'visible',
                            text: node_state_text
                        });
                    }
                    else {
                        let status_empty = false;
                        if(node_index === DiagramModel.getStartDiagramIndex()) {
                            DiagramModel.setStartDiagramIndex(-1);
                            status_empty = true;
                        }
                        else if(node_index === DiagramModel.getEndDiagramIndex()) {
                            DiagramModel.setEndDiagramIndex(-1);
                            status_empty = true;
                        }
                        if(status_empty) DiagramModel.getDrawableByIndex(node_index).select('.nodeStateText').attr({visibility: 'hidden', text: ''});
                    }

                    console.log('save: start_node: ' + DiagramModel.getStartDiagramIndex() + ' | end_node = ' + DiagramModel.getEndDiagramIndex());
                }
                node_index = null;
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
        conn_index = null;
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
        connection_info_text = null;

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