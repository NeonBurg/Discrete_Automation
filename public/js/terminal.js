function Terminal() {

    this.ERROR_MSG_TYPE = 1;
    this.WARNING_MSG_TYPE = 2;
    this.SUCCESS_MSG_TYPE = 3;
    this.USER_MSG_TYPE= 4;

    this.sendToTerminal = function(text_row, msg_type) {
        console.log('send command: ' + text_row);
        //console.log('time: ' + get_curr_time());

        let new_text_element = document.createElement('div');
        let terminalScrollbar = $('#terminal-vertical-scrollbar');

        var text_msg_class = 'terminal-regular-text';
        switch (msg_type) {
            case this.ERROR_MSG_TYPE:
                text_msg_class = 'terminal-error-text';
                break;
            case this.WARNING_MSG_TYPE:
                text_msg_class = 'terminal-warning-text';
                break;
            case this.SUCCESS_MSG_TYPE:
                text_msg_class = 'terminal-success-text';
                break;
            case this.USER_MSG_TYPE:
                text_msg_class = 'terminal-user-text';
                break;
        }

        new_text_element.className = 'terminal-text-row';
        new_text_element.innerHTML = '<div class="terminal-time-row">' + get_curr_time() + '</div>' + '<div class="' + text_msg_class + '">' + text_row + '</div>';
        terminalScrollbar.append(new_text_element);

        this.scrollDown();
    };

    this.scrollDown = function() {
        var terminalScrollbar = $('#terminal-vertical-scrollbar');
        terminalScrollbar.scrollTop(terminalScrollbar[0].scrollHeight);
    };

    this.clearTerminal = function() {
        document.getElementById('terminal-vertical-scrollbar').textContent = '';
    };

    function get_curr_time() {
        var d = new Date();

        var hours = add_zero(d.getHours());
        var minutes = add_zero(d.getMinutes());
        var seconds = add_zero(d.getSeconds());

        return '[' + hours + ':' + minutes + ':' + seconds + ']: ';
    }

    function add_zero(time) {
        if(time < 10) {
            time = '0' + time;
        }
        return time;
    }

}