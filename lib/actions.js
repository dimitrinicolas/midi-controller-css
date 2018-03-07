'use babel';

export default function actions(message) {

    // console.log(message);

    // TODO
    // col 1 : @media with current media indicator
    // % / px
    // col 6 : bg color img linear gradient
    // col 8 : all value

    if (message.data[0] === 144 && message.data[1] === 93 && message.data[2] === 127) {
        // STOP
        this.deleteLine();
    }
    if (message.data[0] === 144 && message.data[1] === 46 && message.data[2] === 127) {
        // LEFT
        this.focusSelector(-1);
    }
    if (message.data[0] === 144 && message.data[1] === 47 && message.data[2] === 127) {
        // RIGHT
        this.focusSelector(1);
    }


    if (message.data[0] === 144 && message.data[2] === 127) {
        // COLUMN 2 BUTTONS POSITION

        var values = {
            9: 'absolute',
            17: 'relative',
            1: 'absolute'
        };
        var position = values[message.data[1]];
        if (message.data[1] === 1) {
            this.addLine('position', function(node) {
                return 'absolute 50% auto auto 50%';
            }, { focus: true, cb: function() {
                this.addLine('transform', function(node) {
                    return 'translateX(-50%) translateY(-50%)';
                }, { focus: true });
            }.bind(this)});
        }
        else if (position) {
            this.getFocusNode(function(node) {
                if (node && node.type === 'decl' && node.prop === 'position' && node.value.split(' ')[0] === position) {
                    this.addLine('position', function() { return position; }, { focus: true });
                }
                else {
                    this.addLine('position', function(node) {
                        var value = '';
                        if (node) {
                            value = node.value.split(' ');
                            value.shift();
                            value = value.join(' ');
                        }
                        if (value) {
                            value = ' ' + value;
                        }
                        return position + value;
                    }, { focus: true });
                }
            }.bind(this));
        }

    }
    if (message.data[0] === 225) {
        // COLUMN 2 SLIDER POSITION

        var px = Math.round(message.data[1] / 127 * 64);

        this.addLine('position', function(node) {
            var position = !node ? 'relative' : node.value.split(' ')[0];
            px = px !== 0 ? px + 'px' : px;
            return position + ' ' + px;
        });

    }
    if (message.data[0] === 176 && message.data[1] === 17) {
        // COLUMN 2 ORIENTATION POSITION
        // TODO

        if (message.data[2] === 127) {
            // LEFT

            this.addLine('position', function(node) {
                var position = !node ? 'relative' : node.value.split(' ')[0];
                var value = '';
                if (node) {
                    value = node.value.split(' ');
                    value.shift();
                    if (value.length === 0) {
                        value = '0 0';
                    }
                    else if (value.length === 1) {
                        value = value[0] + ' ' + value[0];
                    }
                    else {
                        value = value[0] + ' ' + value[1];
                    }
                }
                if (value) {
                    value = ' ' + value;
                }
                return position + value;
            });
        }
        if (message.data[2] === 1 || message.data[2] === 65) {
            // MIDDLE

            this.addLine('position', function(node) {
                var position = !node ? 'relative' : node.value.split(' ')[0];
                var value = '';
                if (node) {
                    value = node.value.split(' ');
                    value.shift();
                    if (value.length === 0) {
                        value = '0';
                    }
                    else {
                        value = value[0];
                    }
                }
                if (value) {
                    value = ' ' + value;
                }
                return position + value;
            });
        }
        if (message.data[2] === 63) {
            // RIGHT

            this.addLine('position', function(node) {
                var position = !node ? 'relative' : node.value.split(' ')[0];
                var value = '';
                if (node) {
                    value = node.value.split(' ');
                    value.shift();
                    if (value.length === 0) {
                        value = '0 0';
                    }
                    else if (value.length === 1) {
                        value = value[0] + ' ' + value[0];
                    }
                    else {
                        value = value[0] + ' ' + value[1];
                    }
                }
                if (value) {
                    value = ' ' + value;
                }
                return position + value;
            });
        }

    }


    if (message.data[0] === 144 && message.data[2] === 127) {
        // COLUMN 3 BUTTONS DISPLAY

        var values = {
            10: 'block',
            18: 'inline-block',
            2: 'flex'
        };
        var display = values[message.data[1]];
        if (display) {
            this.addLine('display', function() { return display; }, { focus: true });
        }

    }
    if (message.data[0] === 226) {
        // COLUMN 3 SLIDER DISPLAY

        var px = Math.round(message.data[1] / 127 * 66);
        if (px >= 65) { px = '100%'; }
        else if (px !== 0) { px = px + 'px'; }
        this.addLine('size', function(node) { return px; });

    }


    if (message.data[0] === 144 && message.data[2] === 127) {
        // COLUMN 4 BUTTONS MARGIN/PADDING

        var props = {
            11: 'margin',
            19: 'padding'
        };
        var prop = props[message.data[1]];
        if (prop) {
            this.addLine(prop, function(node) {
                var value = !node ? '0' : node.value;
                return value;
            }, { focus: true });
        }

    }
    if (message.data[0] === 227) {
        // COLUMN 4 SLIDER MARGIN/PADDING

        var px = Math.round(message.data[1] / 127 * 64);
        px = px !== 0 ? px + 'px' : px;
        this.getFocusNode(function(node) {
            if (node && node.type === 'decl') {
                if (node.prop === 'margin' || node.prop === 'padding') {
                    this.addLine(node.prop, function() { return px; });
                }
            }
        }.bind(this));

    }


    if (message.data[0] === 144 && message.data[2] === 127) {
        // COLUMN 5 BUTTONS FONTS WEIGHT

        var values = {
            12: '500',
            20: '400',
            4: '300'
        };
        var weight = values[message.data[1]];
        if (weight) {
            this.getFocusNode(function(node) {
                if (node && node.type === 'decl' && node.prop === 'position' && node.value.split(' ')[0] === position) {
                    this.addLine('font', function() { return 'title ' + weight + ' 16px'; }, { focus: true });
                }
                else {
                    this.addLine('font', function(node) {
                        var px = '16px';
                        if (node) {
                            var splitted = node.value.split(' ');
                            px = splitted[splitted.length - 1];
                        }
                        return 'title ' + weight + ' ' + px;
                    }, { focus: true });
                }
            }.bind(this));
        }

    }
    if (message.data[0] === 228) {
        // COLUMN 5 SLIDER FONT SIZE

        var px = Math.round(message.data[1] / 127 * 10) + 12;

        px = px !== 0 ? px + 'px' : px;
        this.addLine('font', function(node) {
            var font = ['title', 'regular', 0];
            if (node) {
                font = node.value.split(' ');
            }
            font[font.length - 1] = px;

            return font.join(' ');
        });

    }

    if (message.data[0] === 144 && message.data[2] === 127) {
        // COLUMN 6 BUTTONS TRANSITION

        var values = {
            13: '0.1s',
            21: '0.2s',
            5: '0.3s'
        };
        var transition = values[message.data[1]];
        if (transition) {
            this.addLine('transition', function() { return transition; }, { focus: true });
        }

    }
    if (message.data[0] === 229) {
        // COLUMN 6 TRANSITION

        var sec = Math.round(Math.round(message.data[1] / 127 * 3 / 10 * 100) * 0.02 * 100) / 100;
        sec = sec !== 0 ? sec + 's' : sec;
        this.addLine('transition', function(node) { return sec; });

    }

};
