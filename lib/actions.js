'use babel';

import path from 'path';
import play from 'play';

let tickSound = path.resolve(__dirname, '../assets/sounds/1.wav');
let tickSound2 = path.resolve(__dirname, '../assets/sounds/2.wav');

let lastValue = null;
let lastTime = 0;
let tick = (value, accent) => {

    if (lastValue != value) {
        let now = Date.now();
        if (accent || now - lastTime > 50) {
            lastTime  = now;
            lastValue = value;
            if (accent) {
                play.sound(tickSound);
            }
            else {
                play.sound(tickSound2);
            }
        }
    }

};


export default function actions(message) {

    // console.log(message.data);

    // TODO
    // col 1 : @media with current media indicator
    // % / px
    // col 6 : bg color img linear gradient
    // col 8 : all value

    if (message.data[0] === 176 && message.data[1] === 42 && message.data[2] === 127) {
        // STOP
        this.deleteLine();
    }
    if (message.data[0] === 176 && message.data[1] === 58 && message.data[2] === 127) {
        // LEFT
        this.focusSelector(-1);
    }
    if (message.data[0] === 176 && message.data[1] === 59 && message.data[2] === 127) {
        // RIGHT
        this.focusSelector(1);
    }


    if (message.data[0] === 176 && message.data[2] === 127) {
        // COLUMN 2 BUTTONS POSITION

        var values = {
            33: 'absolute',
            49: 'relative',
            65: 'absolute'
        };
        var position = values[message.data[1]];
        if (message.data[1] === 65) {
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
    if (message.data[0] === 176 && message.data[1] === 1) {
        // COLUMN 2 SLIDER POSITION

        var px = Math.round(message.data[2] / 127 * 64);

        this.addLine('position', function(node) {
            var position = !node ? 'relative' : node.value.split(' ')[0];
            px = px !== 0 ? px + 'px' : px;
            tick(position + ' ' + px, px === 0);
            return position + ' ' + px;
        });

    }
    // if (message.data[0] === 176 && message.data[1] === 17) {
    //     // COLUMN 2 ORIENTATION POSITION
    //     // TODO
    //
    //     if (message.data[2] === 127) {
    //         // LEFT
    //
    //         this.addLine('position', function(node) {
    //             var position = !node ? 'relative' : node.value.split(' ')[0];
    //             var value = '';
    //             if (node) {
    //                 value = node.value.split(' ');
    //                 value.shift();
    //                 if (value.length === 0) {
    //                     value = '0 0';
    //                 }
    //                 else if (value.length === 1) {
    //                     value = value[0] + ' ' + value[0];
    //                 }
    //                 else {
    //                     value = value[0] + ' ' + value[1];
    //                 }
    //             }
    //             if (value) {
    //                 value = ' ' + value;
    //             }
    //             return position + value;
    //         });
    //     }
    //     if (message.data[2] === 1 || message.data[2] === 65) {
    //         // MIDDLE
    //
    //         this.addLine('position', function(node) {
    //             var position = !node ? 'relative' : node.value.split(' ')[0];
    //             var value = '';
    //             if (node) {
    //                 value = node.value.split(' ');
    //                 value.shift();
    //                 if (value.length === 0) {
    //                     value = '0';
    //                 }
    //                 else {
    //                     value = value[0];
    //                 }
    //             }
    //             if (value) {
    //                 value = ' ' + value;
    //             }
    //             return position + value;
    //         });
    //     }
    //     if (message.data[2] === 63) {
    //         // RIGHT
    //
    //         this.addLine('position', function(node) {
    //             var position = !node ? 'relative' : node.value.split(' ')[0];
    //             var value = '';
    //             if (node) {
    //                 value = node.value.split(' ');
    //                 value.shift();
    //                 if (value.length === 0) {
    //                     value = '0 0';
    //                 }
    //                 else if (value.length === 1) {
    //                     value = value[0] + ' ' + value[0];
    //                 }
    //                 else {
    //                     value = value[0] + ' ' + value[1];
    //                 }
    //             }
    //             if (value) {
    //                 value = ' ' + value;
    //             }
    //             return position + value;
    //         });
    //     }
    //
    // }


    if (message.data[0] === 176 && message.data[2] === 127) {
        // COLUMN 3 BUTTONS DISPLAY

        var values = {
            34: 'block',
            50: 'inline-block',
            66: 'flex'
        };
        var display = values[message.data[1]];
        if (display) {
            this.addLine('display', function() { return display; }, { focus: true });
        }

    }
    if (message.data[0] === 176 && message.data[1] === 2) {
        // COLUMN 3 SLIDER DISPLAY

        var px = Math.round(message.data[2] / 127 * 66);
        if (px >= 65) { px = '100%'; }
        else if (px !== 0) { px = px + 'px'; }
        tick(px, (px === 0 || px === '100%'));
        this.addLine('size', function(node) { return px; });

    }


    if (message.data[0] === 176 && message.data[2] === 127) {
        // COLUMN 4 BUTTONS MARGIN/PADDING

        var props = {
            35: 'margin',
            51: 'padding'
        };
        var prop = props[message.data[1]];
        if (prop) {
            this.addLine(prop, function(node) {
                var value = !node ? '0' : node.value;
                return value;
            }, { focus: true });
        }

    }
    if (message.data[0] === 176 && message.data[1] === 3) {
        // COLUMN 4 SLIDER MARGIN/PADDING

        var px = Math.round(message.data[2] / 127 * 64);
        px = px !== 0 ? px + 'px' : px;
        this.getFocusNode(function(node) {
            if (node && node.type === 'decl') {
                if (node.prop === 'margin' || node.prop === 'padding') {
                    tick(px, (px === 0));
                    this.addLine(node.prop, function() { return px; });
                }
            }
        }.bind(this));

    }


    if (message.data[0] === 176 && message.data[2] === 127) {
        // COLUMN 5 BUTTONS FONTS WEIGHT

        var values = {
            36: '500',
            52: '400',
            68: '300'
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
    if (message.data[0] === 176 && message.data[1] === 4) {
        // COLUMN 5 SLIDER FONT SIZE

        var px = Math.round(message.data[2] / 127 * 10) + 12;

        px = px !== 0 ? px + 'px' : px;
        this.addLine('font', function(node) {
            var font = ['title', 'regular', 0];
            if (node) {
                font = node.value.split(' ');
            }
            font[font.length - 1] = px;
            let result = font.join(' ');
            tick(result, (px === 0));
            return result;
        });

    }

    if (message.data[0] === 176 && message.data[2] === 127) {
        // COLUMN 6 BUTTONS TRANSITION

        var values = {
            37: '0.1s',
            53: '0.2s',
            69: '0.3s'
        };
        var transition = values[message.data[1]];
        if (transition) {
            this.addLine('transition', function() { return transition; }, { focus: true });
        }

    }
    if (message.data[0] === 176 && message.data[1] === 5) {
        // COLUMN 6 SLIDER TRANSITION

        var sec = Math.round(Math.round(message.data[2] / 127 * 3 / 10 * 100) * 0.02 * 100) / 100;
        sec = sec !== 0 ? sec + 's' : sec;
        tick(sec, (sec === 0));
        this.addLine('transition', function(node) { return sec; });

    }

};
