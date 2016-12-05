'use babel';

import postcss from 'postcss';
import order from './order';

export default function focusSelector(prop, value) {

    var editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
        return;
    }

    var cursor = editor.cursors[0];
    var cursorPosition = editor.getCursorBufferPosition();

    var css = editor.getText();
    postcss([]).process(css).then(function(res) {

        var currentNode = 0;

        var propPos = [0, 0];
        for (var h = 0; h < order.length; h++) {
            var index = order[h].indexOf(prop);
            if (index > -1) {
                propPos = [h, index];
                break;
            }
        }
        var propDist = (propPos[0] * 100 + propPos[1]);

        for (var i = 0; i < res.root.nodes.length; i++) {

            var node = res.root.nodes[i];

            node.selectorHeight = node.selector.split("\n").length;

            if (node.nodes[0]) {
                node.startWhiteLine = node.nodes[0].source.start.line - (node.source.start.line + node.selectorHeight);
            }
            else {
                node.startWhiteLine = 0;
            }
            if (node.nodes[node.nodes.length - 1]) {
                node.endWhiteLine = (node.source.end.line - 1) - node.nodes[node.nodes.length - 1].source.end.line;
            }
            else {
                node.endWhiteLine = 0;
            }

            node.properties = {};

            for (var j = 0; j < node.nodes.length; j++) {
                if (node.nodes[j].type === "decl") {
                    node.properties[node.nodes[j].prop] = j;
                }
            }

            if (cursorPosition.row >= node.source.start.line && cursorPosition.row <= node.source.end.line) {
                currentNode = i;
            }

        }

        currentNode = res.root.nodes[currentNode];

        var dist = null;
        var dest = null;
        var toLine = 1;
        if (typeof currentNode.properties[prop] !== "undefined") {

            var node = currentNode.nodes[currentNode.properties[prop]];

            var diff = (node.source.end.line - 1) - cursorPosition.row;
            if (diff > 0) {
                cursor.moveDown(diff);
            }
            else if (diff < 0) {
                cursor.moveUp(Math.abs(diff));
            }
            cursor.moveToEndOfLine();
            editor.deleteToBeginningOfLine();

            var newCursorPosition = editor.getCursorBufferPosition();
            var tab = newCursorPosition.column === 0 ? "\t" : "";
            editor.insertText(tab + prop + ": " + value(node) + ";");
            editor.moveLeft();

        }
        else {

            for (var a = 0; a < order.length; a++) {
                for (var b = 0; b < order[a].length; b++) {
                    var item = order[a][b];
                    if (typeof currentNode.properties[item] !== "undefined") {

                        for (var h = 0; h < order.length; h++) {
                            var index = order[h].indexOf(item);
                            if (index > -1) {
                                var newDist = [h, index];
                                break;
                            }
                        }

                        if (dist === null || Math.abs(propDist - (dist[0] * 100 + dist[1])) > Math.abs(propDist - (newDist[0] * 100 + newDist[1]))) {
                            dist = [newDist[0], newDist[1]];
                            dest = item;
                        }

                    }
                }
            }

            if (dist) {
                if ((dist[0] * 100 + dist[1]) < propDist) {
                    toLine = 1;
                }
                else {
                    toLine = -1;
                }
                var insertLine = propPos[0] === dist[0] ? false : true;
            }
            else {
                toLine = 0;
            }

            var ref;
            if (dest) {
                var ref = currentNode.nodes[currentNode.properties[dest]];
            }
            else {
                ref = {
                    source: {
                        start: {
                            line: currentNode.source.start.line - 1
                        },
                        end: {
                            line: currentNode.source.start.line + 1
                        }
                    }
                };
            }

            var diff;
            if (toLine < 0) {
                diff = (ref.source.start.line - 2) - cursorPosition.row;
            }
            else {
                diff = (ref.source.end.line - 1) - cursorPosition.row;
            }

            if (diff > 0) {
                cursor.moveDown(diff);
            }
            else if (diff < 0) {
                cursor.moveUp(Math.abs(diff));
            }
            cursor.moveToEndOfLine();
            editor.insertNewlineBelow();
            if (insertLine && toLine < 0) {
                editor.insertNewlineBelow();
                cursor.moveUp();
            }
            if (insertLine && toLine > 0) {
                editor.insertNewlineBelow();
            }

            var newCursorPosition = editor.getCursorBufferPosition();
            var tab = newCursorPosition.column === 0 ? "\t" : "";

            editor.insertText(tab + prop + ": " + value(null) + ";");
            editor.moveLeft();

        }

    });

};
