var input_variables_counter = 0;
var output_variables_counter = 0;
var program_variables_counter = 0;

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
        let elemCheckBox = document.getElementById(checkBoxId);
        elemCheckBox.style.visibility = "visible";
        elemCheckBox.style.width = "20px";
        elemCheckBox.style.marignTop = "2px";
        elemCheckBox.style.marginRight = "10px";

        elemCheckBox.addEventListener('change', function() {
            if(this.checked) {
                if(_is_input) {
                    let input_variables = DiagramModel.getInputVariables();
                    for(let key_name in output_variables) {
                        let checkBoxId = 'inputCheckBoxId_'+key_name;
                        if(checkBoxId !== this.id) {
                            document.getElementById('inputCheckBoxId_'+key_name).checked = false;
                        }
                    }
                }
                else {
                    let output_variables = DiagramModel.getOutputVariables();
                    for(let key_name in output_variables) {
                        let checkBoxId = 'outputCheckBoxId_'+key_name;
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


// Добавляем переменную в окне ввода программы
function add_input_variable(key_name, key_value) {

    var new_variable_row = document.createElement('div');
    new_variable_row.style.marginTop = "10px";
    new_variable_row.style.display = "block";

    new_variable_row.id = "variable_row_"+key_name;
    let nameId = "inptNameId_" + key_name;
    let valueId = "inptValueId_" + key_name;
    let modalContentId = "input_variables_program";

    new_variable_row.innerHTML = '<div style="padding:0px; margin:0px; display:inline-block;">' +
        '<input name="variableNameInput" id="' + nameId + '" style="width:120px; height:20px; display: inline-block; vertical-align: top;" value="' + key_name + '">' +
        '<div style="height:100%; margin-left:5px; margin-right:5px; padding-top:0px; display:inline-block; vertical-align: top;">=</div>' +
        '<input name="variableValueInput" id="' + valueId + '" style="width:150px; height:20px; display: inline-block; vertical-align: top;" value="'+key_value+'" readonly>' +
        '<input type="button" value="+" style="width:24px; height:24px; margin-left:10px; display:inline-block; vertical-align: top;" onclick="add_input_program_variable(' + '\'' + key_name + '\'' +',' + '\'' + key_value + '\',' + true +');">';

    document.getElementById(modalContentId).appendChild(new_variable_row);

}

function add_input_program_variable(key_name, key_value, add_to_model) {
    console.log('add_input_program_variable: ' + key_name + ' = ' + key_value);

    var program_variable_div = document.createElement('div');
    program_variable_div.style.display = "inline-element";
    program_variable_div.style.broder = "1px solid black";
    program_variable_div.style.width = "100%";
    let program_variable_id = "program_variable_" + program_variables_counter; // ! Не key_name, а count_program_variables+1; !!!! <<<<<<<<<<<<<<<<<<<<<<<<<
    program_variable_div.id = program_variable_id;
    //program_variable_div.onmouseover = 'mouse_over_input('+key_name+')';
    program_variable_div.addEventListener("mouseover", mouse_over_program_input, false);
    program_variable_div.addEventListener("mouseout", mouse_out_program_input, false);

    program_variable_div.innerHTML = key_name + ' = ' + key_value +
                                        '<input type="button" value="x" style="width:24px; height:24px; margin-left:10px; display:inline-block; vertical-align: top; float:right;" onclick="delete_program_input('+ '\'' + program_variable_id + '\'' + ',' + '\'' + program_variables_counter + '\'' +');">';

    document.getElementById("program_variables_block").appendChild(program_variable_div);
    //document.getElementById("program_variable_"+key_name).attr("onMouseOver", "mouse_over_input("+key_name+")");

    if(add_to_model) {
        DiagramModel.addProgramVariable(key_name);
        //program_variables_counter++;
    }

    program_variables_counter++;
}

function delete_program_input(program_input_row_id, index) {

    console.log('delete_program_input: index: ' + index + ' | size = ' + DiagramModel.getProgramVariableCount());
    document.getElementById(program_input_row_id).remove();
    DiagramModel.deleteProgramVariable(index);
    console.log('size = ' + DiagramModel.getProgramVariableCount());
}

function mouse_over_program_input() {
    //console.log("mouse_over_input = " + this.id);
    this.style.backgroundColor = "#e2e2e2";
}

function mouse_out_program_input() {
    this.style.backgroundColor = "#ffffff";
}
