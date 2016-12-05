'use babel';

import { CompositeDisposable } from 'atom';

import actions from './actions';
import getFocusNode from './get-focus-node';
import focusSelector from './focus-selector';
import addLine from './add-line';
import deleteLine from './delete-line';

export default {

    subscriptions: null,
    midi: null,

    activate(state) {

        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'midi:convert': () => this.convert()
        }));

        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess({
                sysex: false
            }).then(function(midiAccess) {

                var inputs = midiAccess.inputs.values();
                for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
                    input.value.onmidimessage = actions.bind(this);
                }

            }.bind(this), function() {
                console.error("No access to MIDI devices");
            });
        } else {
            console.error("No MIDI support.");
        }

    },

    getFocusNode: getFocusNode,
    focusSelector: focusSelector,
    addLine: addLine,
    deleteLine: deleteLine

};
