'use babel';

import postcss from 'postcss';

export default function focusSelector(index) {

    var editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
        return;
    }

    var cursor = editor.cursors[0];
    var cursorPosition = editor.getCursorBufferPosition();

    var css = editor.getText();
    postcss([]).process(css, { from: undefined }).then(function(res) {

        var currentNode = 0;
        for (var i = 0; i < res.root.nodes.length; i++) {
            var node = res.root.nodes[i];
            if (cursorPosition.row >= node.source.start.line && cursorPosition.row <= node.source.end.line) {
                currentNode = i;
                break;
            }
        }

        var focusNode = currentNode + index;

        if (typeof res.root.nodes[focusNode] !== 'undefined') {

            var node = res.root.nodes[focusNode];

            var dest = node.source.end.line;
            if (node.nodes[0]) {
                dest = node.nodes[0].source.start.line;
            }

            var diff = (dest - 1) - cursorPosition.row;
            if (diff > 0) {
                cursor.moveDown(diff);
            }
            else if (diff < 0) {
                cursor.moveUp(Math.abs(diff));
            }
            cursor.moveToEndOfLine();

        }

    });

};
