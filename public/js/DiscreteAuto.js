function DiscreteAuto() {

    this.outputs = [[]];
    this.states = [[]];

    this.transition_matrix = [[[]]];

    this.alphabet = [];
    this.outputText = [];

    this.currentState = 0;
    this.currentOutput = 0;


    this.init = function(graph_arr, connections_arr, input_variables, output_variables) {



        return true;
    };


    this.sendInput = function(_input) {

        //this.outputs[0][1] = 420;
        //console.log('compute: ' + this.outputs[0][1] + ' | ' + _input);
    }

}