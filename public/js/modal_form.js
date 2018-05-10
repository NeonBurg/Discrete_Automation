function ModalForm() {

    var diagramId = null;

    //console.log('title: ' + _data.title + ' content: ' + _data.content);

    //console.log('------------> X: ' + elem.matrix.e);
    //console.log('------------> Y: ' + elem.matrix.f);

    var last_modal_type = null;

    this.input_variables_modal = 1;
    this.output_variables_modal = 2;
    this.connection_modal = 3;

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
        }
        last_modal_type = modal_type;
    };


    // ----------- Сохраняем данные в модель после закрытия модального окна ------------
    function save_model_data() {
        //console.log('save_data: last_modal_type = ' + last_modal_type);
        switch(last_modal_type) {
            case modal_form.input_variables_modal:
                var input_variables = DiagramModel.getInputVariables();
                for(var key_name in input_variables) {
                    //console.log('----------------------');
                    //console.log('key_name = ' + key_name);
                    var v_name = document.getElementById('inptNameId_'+key_name).value;
                    var v_value = document.getElementById('inptValueId_'+key_name).value;
                    //console.log('inptNameId_'+key_name+' = ' + v_name);
                    //console.log('inptValueId_'+key_name+' = ' + v_value);
                    DiagramModel.setInputVariable(key_name, v_name, v_value);
                }
                break;

            case modal_form.output_variables_modal:
                var output_variables = DiagramModel.getOutputVariables();
                for(var key_name in output_variables) {
                    var v_name = document.getElementById('outputNameId_'+key_name).value;
                    var v_value = document.getElementById('outputValueId_'+key_name).value;
                    DiagramModel.setOutputVariable(key_name, v_name, v_value);
                }
                break;
        }
    };

    function create_conn_text() {
        console.log('create_conn_text');
        var connection_text = '';

        var input_variables = DiagramModel.getInputVariables();
        var input_count = 0;
        for(var key_name in input_variables) {
            //console.log('key_name = ' + key_name + ' | getInputVariable('+key_name+') = ' + key_name);
            var check_box = document.getElementById('inputCheckBoxId_'+key_name);
            if(check_box.checked) {
                connection_text += key_name + ', ';
                input_count++;
            }
        }
        if(input_count > 0) connection_text = connection_text.substring(0, connection_text.length - 2); // Удалим последнею запятую после переменной

        var output_variables = DiagramModel.getOutputVariables();
        var output_vars_text = '';
        var output_count = 0;
        for(var key_name in output_variables) {
            var check_box = document.getElementById('outputCheckBoxId_'+key_name);
            if(check_box.checked) {
                output_vars_text += key_name + ', ';
                output_count++;
            }
        }
        if(output_count > 0) {
            output_vars_text = output_vars_text.substring(0, output_vars_text.length - 2); // Удалим последнею запятую после переменной
            connection_text = connection_text + ' / ' + output_vars_text;
        }

        controller.getConnection(conn_index).text_element.attr({text: connection_text});
        controller.getConnection(conn_index).text = connection_text;
    }


    $('#modal_close, #overlay').click(function () { // лoвим клик пo крестику или пoдлoжке

        controller.selectTool(0);

        save_model_data();

        //console.log('modal_form.conn_index = ' + conn_index);

        if(conn_index !== null) {
            create_conn_text();
        }
        else {
            console.log('conn_index undifined!');
        }

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