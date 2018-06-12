function ModalFormDraggable() {

    this.enter_data_modal = 6;


    // -------------------- Отобразим модальное окно Содержимое диаграммы --------------------------
    this.showModalDialog = function (modal_type) {

        this.create_view(modal_type);

        event.preventDefault(); // выключaем стaндaртную рoль элементa
        $('#modal_form_draggable')
            .css('display', 'block') // убирaем у мoдaльнoгo oкнa display: none;
            .animate({opacity: 1, top: '40%'}, 100); // плaвнo прибaвляем прoзрaчнoсть oднoвременнo сo съезжaнием вниз

    };


    // Закрываем окно
    $('#modal_close_draggable').click(function () { // лoвим клик пo крестику или пoдлoжке

        controller.selectTool(0);

        remove_view();
        program_variables_counter = 0;

        $('#modal_form_draggable')
            .animate({opacity: 0, top: '45%'}, 200,  // плaвнo меняем прoзрaчнoсть нa 0 и oднoвременнo двигaем oкнo вверх
                function () { // пoсле aнимaции
                    $(this).css('display', 'none'); // делaем ему display: none;
                }
            );
    });


    // ------------------- Удаляем представление ---------------------
    function remove_view() {
        document.getElementById('modal_dynamic_content').remove();
    }


    // ------------------ Создаем модальное представление ----------------------
    this.create_view = function(modal_type) {
        console.log('create_view: ' + modal_type);
        let modal_dynamic_content = document.createElement('div');
        modal_dynamic_content.id = "modal_dynamic_content";

        switch (modal_type) {
            // --------- Представление для ввода ВХОДНЫХ переменных
            case this.enter_data_modal:
                modal_dynamic_content.innerHTML = 'Ввод программы:<br>' +
                                                    '<div id="input_variables_program" style="width:100%;"></div>' +
                                                    '<div style="min-height:40px; width:100%; margin-right:5px; margin-top:10px; border:1px solid gray; cursor:default;" id="program_variables_block"></div>' +
                                                    '<div style="width:100%; margin-top:10px; margin-right:10px;"><input type="button" id="start_program_button" onclick="controller.start_program(false)" value="Запустить" style="height:25px;">' +
                                                    '<div style="display:inline-block; float:right;">Интервал (сек): ' +
                                                    '<select id="launch_interval"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>' +
                                                    '</div></div>' +
                                                    '<input type="button" onclick="controller.start_program(true)" value="Быстрый запуск" style="height:25px; margin-top:10px;">' +
                                                    '<div style="margin-top:10px;">Состояние: <div id="state_num" style="display: inline-block;"></div></div>' +
                                                    '<div>Выход: <div id="state_status" style="display: inline-block;"></div></div>';

                document.getElementById('modal_form_draggable').appendChild(modal_dynamic_content);

                let input_variables = DiagramModel.getInputVariables();
                //console.log('input_variables.length = ' + DiagramModel.getInputVariablesCount());
                if(DiagramModel.getInputVariablesCount() === 0) document.getElementById('input_variables_program').innerHTML = '<div style="color:#868686">Список входных переменных пуст!</div>';
                else {

                    for(let key_name in input_variables) {
                        add_input_variable(key_name, input_variables[key_name]);
                    }

                }

                if(DiagramModel.getProgramVariableCount() !== 0) {
                    let program_variables = DiagramModel.getProgramVariablesData();
                    for(let index in program_variables) {
                        add_input_program_variable(program_variables[index], DiagramModel.getInputVariableValue(program_variables[index]), false);
                    }
                }

                break;
        }
    };

}