function DiscreteAuto() {

    this.outputs = [[]];
    this.states = [[]];

    this.transition_matrix = [{}];

    //this.alphabet = [];
    //this.outputText = [];
    this.input_vars = [];
    this.output_vars = [];

    this.currentState = -1;
    this.currentOutput = '';

    this.err_msg_list = [];

    this.is_started = false;

    this.init = function(graph_arr, connections_arr, input_variables, output_variables) {

        //console.log('graph_arr = ' + JSON.stringify(graph_arr));
        //console.log('connections_arr = ' + JSON.stringify(connections_arr));
        //console.log('input_variables = ' + JSON.stringify(input_variables));
        //console.log('output_variables = ' + JSON.stringify(output_variables));


        // Выполняем проверку графа дискретного автомата
        let is_miss_output = false; // Не указаны выходные переменные
        let is_miss_input = false; // Не указаны входные переменные
        let miss_outputs_err = '';
        let miss_inputs_err = '';
        // TO-DO проверку графа


        this.input_vars = input_variables;
        this.output_vars = output_variables;

        // Формируем матрицу переходов transition_matrix
        let nodes_count = 0;
        for(let key in graph_arr) {

            //console.log('key = ' + key);

            let conn_to_indexes = graph_arr[key].connectsToIndexes;

            //console.log('conn_to_indexes = ' + JSON.stringify(conn_to_indexes));

            for(let key2 in conn_to_indexes) {
                let conn_to_index = conn_to_indexes[key2];
                //console.log('conn_to_index = ' + conn_to_index);
                let conn_input_vars = connections_arr[conn_to_index].inputVariables;
                let conn_output_var = connections_arr[conn_to_index].outputVariables[0];
                let conn_new_state = connections_arr[conn_to_index].toDrawableIndex;

                //console.log('conn_input_vars = ' + JSON.stringify(conn_input_vars));

                for(let input_var_key in conn_input_vars) {
                    //console.log('input_var_key = ' + input_var_key);
                    let input_var  = conn_input_vars[input_var_key];
                    //console.log('input_var = ' + input_var);

                    if(!this.transition_matrix[nodes_count]) this.transition_matrix[nodes_count] = {};
                    this.transition_matrix[nodes_count][input_var] = [conn_new_state, conn_output_var];
                }
            }

            nodes_count++;

        }

        //console.log('transition_matrix = ' + JSON.stringify(this.transition_matrix));

        return true;
    };


    this.start = function() {
        this.currentState = 0;
        this.is_started = true;
    };

    this.stop = function() {
        this.currentState = -1;
        this.is_started = false;
    };

    this.sendInput = function(_input) {

        //console.log('sendInput: ' + _input);

        let input_var_key = null;
        for(let key in this.input_vars) {
            let input_var_value = this.input_vars[key];
            if(input_var_value === _input) {
                input_var_key = key;
            }
        }

        //console.log('input_var_key: ' + input_var_key);

        if(input_var_key === null) {
            this.err_msg_list.push("Отсутствует переменная равная значению: '" + _input + "' !");
            return false;
        }

        //console.log('this.lastState: ' + this.currentState);
        //console.log('this.transition_matrix['+this.currentState+']['+input_var_key+'][0] = ' + this.transition_matrix[this.currentState][input_var_key][0]);
        //console.log('this.transition_matrix['+this.currentState+']['+input_var_key+'][1] = ' + this.transition_matrix[this.currentState][input_var_key][1]);

        this.currentOutput = this.transition_matrix[this.currentState][input_var_key][1];
        this.currentState = this.transition_matrix[this.currentState][input_var_key][0];

        //console.log('this.currentState: ' + this.currentState);
        //console.log('this.currentOutput: ' + this.currentOutput);

        return true;
    };


    /* --------------------- ГЕТТЕРЫ --------------------- */
    this.getCurrentState = function() {
        return this.currentState;
    };

    this.getCurrentOutputKey = function() {
        return this.currentOutput;
    };

    this.getCurrentOutputValue = function() {
        return this.output_vars[this.currentOutput];
    };

    this.getErrorMsgs = function() {
        return this.err_msg_list;
    };

    this.clearErrorMsgs = function() {
        this.err_msg_list = [];
    }



}