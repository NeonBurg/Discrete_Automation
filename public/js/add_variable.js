var input_variables_counter = 0;
var output_variables_counter = 0;

// Добавляем строку с переменными в модальное окно
function addVariable(_key_name, _is_input, _is_connect) {
    var new_variable_row = document.createElement('div');
    new_variable_row.style.marginTop = "10px";
    new_variable_row.style.display = "block";

    var key_name = "";
    var nameId = "";
    var valueId = "";
    var checkBoxId = "";
    var modalContentId = "";

    if(_is_input) {
        key_name = "x" + input_variables_counter;
    }
    else {
        key_name = "y" + output_variables_counter;
    }

    if(_key_name !== null) { key_name = _key_name; }

    if(_is_input) {
        nameId = "inptNameId_" + key_name;
        valueId = "inptValueId_" + key_name;
        checkBoxId = "inputCheckBoxId_" + key_name;
        modalContentId = "input_variables_modal_content";
    }
    else {
        nameId = "outputNameId_" + key_name;
        valueId = "outputValueId_" + key_name;
        checkBoxId = "outputCheckBoxId_" + key_name;
        modalContentId = "output_variables_modal_content";
    }

    //console.log('addVariable: key_name = ' + key_name);

    new_variable_row.id = "variable_row_"+key_name;

    new_variable_row.innerHTML = '<div style="padding:0px; margin:0px; display:inline-block;">' +
        '<input type="checkbox" id="' + checkBoxId + '" name="check" style="width:0px; height:20px; display: inline-block; visibility:hidden;">' +
        '<input name="variableNameInput" id="' + nameId + '" style="width:120px; height:20px; display: inline-block; vertical-align: top;" value="' + key_name + '">' +
        '<div style="height:100%; margin-left:5px; margin-right:5px; padding-top:0px; display:inline-block; vertical-align: top;">=</div>' +
        '<input name="variableValueInput" id="' + valueId + '" style="width:150px; height:20px; display: inline-block; vertical-align: top;">' +
        '<input type="button" value="X" style="width:24px; height:24px; margin-left:10px; display:inline-block; vertical-align: top;" onclick="delVariable(' + '\'' + key_name + '\'' +','+_is_input+');">'+
        '</div>';

    document.getElementById(modalContentId).appendChild(new_variable_row);

    if(_is_connect) {
        var elemCheckBox = document.getElementById(checkBoxId);
        elemCheckBox.style.visibility = "visible";
        elemCheckBox.style.width = "20px";
        elemCheckBox.style.marignTop = "2px";
        elemCheckBox.style.marginRight = "10px";

        elemCheckBox.addEventListener('change', function() {
            if(this.checked) {
                if(_is_input) {
                    var input_variables = DiagramModel.getInputVariables();
                    for(var key_name in output_variables) {
                        var checkBoxId = 'inputCheckBoxId_'+key_name;
                        if(checkBoxId !== this.id) {
                            document.getElementById('inputCheckBoxId_'+key_name).checked = false;
                        }
                    }
                }
                else {
                    var output_variables = DiagramModel.getOutputVariables();
                    for(var key_name in output_variables) {
                        var checkBoxId = 'outputCheckBoxId_'+key_name;
                        if(checkBoxId !== this.id) {
                            document.getElementById('outputCheckBoxId_'+key_name).checked = false;
                        }
                    }
                }
            }
        });

        document.getElementById(valueId).style.width = "120px";
    }

    if(_key_name === null) {
        if(_is_input) DiagramModel.addInputVariable(key_name, "");
        else DiagramModel.addOutputVariable(key_name, "");
    }
    else {
        var variable_value;
        if(_is_input) { variable_value = DiagramModel.getInputVariableValue(key_name); }
        else { variable_value = DiagramModel.getOutputVariableValue(key_name); }

        if(variable_value)
            document.getElementById(valueId).value = variable_value;
    }

    if(_key_name === null) {
        if (_is_input) input_variables_counter++;
        else output_variables_counter++;
    }
}

// Удаляем строку с переменными
function delVariable(key_name, is_input) {
    //console.log('del_variable index: ' + key_name);
    document.getElementById("variable_row_" + key_name).remove();
    if(is_input) {
        DiagramModel.removeInputVariable(key_name);
        //console.log('v_inpt_count = ' + DiagramModel.getInputVariablesCount());
    }
    else {
        DiagramModel.removeOutputVariable(key_name);
        //console.log('v_output_count = ' + DiagramModel.getOutputVariablesCount());
    }
}