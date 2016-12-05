'use babel';

export default function deleteLine() {

    var editor = atom.workspace.getActiveTextEditor();

    if (editor) {
        var cursor = editor.cursors[0];
        cursor.moveToEndOfLine();
        editor.deleteToBeginningOfLine();
        editor.delete();
        editor.moveLeft();
    }

};
