function DiscreteAuto() {

    this.outputs = [[]];
    this.states = [[]];

    this.transition_matrix = [[[]]];

    this.alphabet = [];
    this.outputText = [];

    this.currentState = 0;
    this.currentOutput = 0;


    this.init = function(graph_arr, connections_arr, input_variables, output_variables) {

        console.log('graph_arr = ' + JSON.stringify(graph_arr));
        console.log('connections_arr = ' + JSON.stringify(graph_arr));
        //console.log('input_variables = ' + JSON.stringify(input_variables));
        //console.log('output_variables = ' + JSON.stringify(output_variables));

        return true;
    };


    this.sendInput = function(_input) {

        //this.outputs[0][1] = 420;
        //console.log('compute: ' + this.outputs[0][1] + ' | ' + _input);
    }

}