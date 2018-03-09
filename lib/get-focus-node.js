'use babel';

import postcss from 'postcss';

export default function getFocusNode(cb) {

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
        currentNode = res.root.nodes[currentNode];

        var focused = null;
        for (var i = 0; i < currentNode.nodes.length; i++) {
            var node = currentNode.nodes[i];
            if (cursorPosition.row + 1 >= node.source.start.line && cursorPosition.row + 1 <= node.source.end.line) {
                focused = node;
                break;
            }
        }
        cb(focused);

    });

};
