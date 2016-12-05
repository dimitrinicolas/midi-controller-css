'use babel';

export default function actions(message) {

    // console.log(message.data);

    // TODO
    // col 1 : @media with current media indicator
    // % / px
    // more px by line
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
            9: "absolute",
            17: "relative",
            1: "fixed"
        };
        var position = values[message.data[1]];
        if (position) {
            this.getFocusNode(function(node) {
                if (node && node.type === "decl" && node.prop === "position" && node.value.split(" ")[0] === position) {
                    this.addLine("position", function() { return position; });
                }
                else {
                    this.addLine("position", function(node) {
                        var value = "";
                        if (node) {
                            value = node.value.split(" ");
                            value.shift();
                            value = value.join(" ");
                        }
                        if (value) {
                            value = " " + value;
                        }
                        return position + value;
                    });
                }
            }.bind(this));
        }

    }
    if (message.data[0] === 225) {
        // COLUMN 2 SLIDER POSITION

        var px = Math.round(message.data[1] / 128 * 64);

        this.addLine("position", function(node) {
            var position = !node ? "relative" : node.value.split(" ")[0];
            px = px !== 0 ? px + "px" : px;
            return position + " " + px;
        });

    }

    if (message.data[0] === 144 && message.data[2] === 127) {
        // COLUMN 3 BUTTONS DISPLAY

        var values = {
            10: "block",
            18: "inline-block",
            2: "flex"
        };
        var display = values[message.data[1]];
        if (display) {
            this.addLine("display", function() { return display; });
        }

    }
    if (message.data[0] === 226) {
        // COLUMN 3 SLIDER DISPLAY

        var px = Math.round(message.data[1] / 128 * 64);
        this.addLine("size", function(node) {
            px = px !== 0 ? px + "px" : px;
            return px;
        });

    }

    if (message.data[0] === 144 && message.data[2] === 127) {
        // COLUMN 4 BUTTONS MARGIN/PADDING

        var props = {
            11: "margin",
            19: "padding"
        };
        var prop = props[message.data[1]];
        if (prop) {
            this.addLine(prop, function(node) {
                var value = !node ? "0" : node.value;
                return value;
            });
        }

    }
    if (message.data[0] === 227) {
        // COLUMN 4 SLIDER MARGIN/PADDING

        var px = Math.round(message.data[1] / 128 * 64);
        px = px !== 0 ? px + "px" : px;
        this.getFocusNode(function(node) {
            if (node && node.type === "decl") {
                if (node.prop === "margin" || node.prop === "padding") {
                    this.addLine(node.prop, function() { return px; });
                }
            }
        }.bind(this));

    }

    if (message.data[0] === 144 && message.data[2] === 127) {
        // COLUMN 5 BUTTONS FONTS WEIGHT

        var values = {
            12: "bold",
            20: "regular",
            4: "light"
        };
        var weight = values[message.data[1]];
        if (weight) {
            this.getFocusNode(function(node) {
                if (node && node.type === "decl" && node.prop === "position" && node.value.split(" ")[0] === position) {
                    this.addLine("font", function() { return "title, " + weight + " 16px"; });
                }
                else {
                    this.addLine("font", function(node) {
                        var px = "16px";
                        if (node) {
                            var splitted = node.value.split(" ");
                            px = splitted[splitted.length - 1];
                        }
                        return "title, " + weight + " " + px;
                    });
                }
            }.bind(this));
        }

    }
    if (message.data[0] === 228) {
        // COLUMN 5 SLIDER FONT SIZE

        var px = Math.round(message.data[1] / 128 * 20) + 8;
        if (px === 8) { px = 0; }

        px = px !== 0 ? px + "px" : px;
        this.addLine("font", function(node) {
            var font = ["title, regular", 0];
            if (node) {
                font = node.value.split(" ");
            }
            font[font.length - 1] = px;

            return font.join(" ");
        });

    }

    if (message.data[0] === 230) {
        // COLUMN 7 TRANSITION

        var sec = Math.round(message.data[1] / 128 * 1.5 / 10 * 100) * 10 / 100;
        sec = sec !== 0 ? sec + "s" : sec;
        this.addLine("transition", function(node) { return sec; });

    }

};
