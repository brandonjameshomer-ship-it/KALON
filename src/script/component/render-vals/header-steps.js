    var activeStep = fin ? 3 : refine ? 2 : isStage ? 1 : 0;
    var chosenOk = haveDesigns && st.sel >= 0;
    var stepGo = [
      { can: activeStep > 0 && scr !== 'building', go: function () { self.setState({ screen: 'intake', drag: null, guideX: false }); }, tip: 'Back to the questions' },
      { can: haveDesigns && scr !== 'building' && (activeStep !== 1 || focus), go: function () { self.setState({ screen: 'options', drag: null, guideX: false }); }, tip: 'Back to the three designs' },
      { can: chosenOk && !refine && scr !== 'building', go: function () { if (st.refineMode === 'edit') self.startEdit(); else self.startGuided(); }, tip: 'Refine the chosen design' },
      { can: chosenOk && !fin && scr !== 'building', go: function () { self.goFinal(); }, tip: 'See it in place' }
    ];
    v.steps = ['Details', 'Designs', 'Refine', 'Finish'].map(function (lab, i) {
      var done = i < activeStep, on = i === activeStep, can = stepGo[i].can;
      return { n: done ? '✓' : String(i + 1), label: lab, current: on ? 'step' : 'false',
        numBg: on ? accent : done ? soft : '#ffffff', numFg: on ? '#ffffff' : done ? accent : '#5d584f', numBd: on || done ? accent : '#bdb6a8',
        fg: on || can ? '#1e1c19' : '#5d584f', weight: on ? '600' : '500', lineDisp: i < 3 ? 'block' : 'none',
        deco: can ? 'underline' : 'none', cursor: can ? 'pointer' : 'default', disabled: !can,
        go: function () { if (stepGo[i].can) stepGo[i].go(); },
        tip: can ? stepGo[i].tip : '', aria: 'Step ' + (i + 1) + ': ' + lab + (on ? ', current step' : can ? ', go to this step' : '') };
    });
    v.showRegen = scr === 'options';
    v.showUndo = refine;
    v.showToEditor = guided;
    v.showToGuided = edit;
    v.showThisOne = refine;
    v.undoDisabled = this.past.length === 0;
    v.undoOpacity = this.past.length === 0 ? 0.5 : 1;
    v.redoDisabled = this.future.length === 0;
    v.redoOpacity = this.future.length === 0 ? 0.5 : 1;
    v.redo = function () { self.redo(); };
    v.undoTitle = this.past.length ? 'Undo: ' + this.past[this.past.length - 1].label + ' (Ctrl+Z)' : 'Nothing to undo yet';
    v.redoTitle = this.future.length ? 'Redo: ' + this.future[this.future.length - 1].label + ' (Ctrl+Shift+Z)' : 'Nothing to redo';
    v.toAll = function () { self.setState({ screen: 'options', drag: null, guideX: false }); };
    v.regen = function () { self.showDesigns(st.variant + 1); };
    v.toEdit = function () { self.startEdit(); };
    v.toGuided = function () { self.startGuided(); };
    v.toFinal = function () { self.goFinal(); };
    v.undo = function () { self.undo(); };
    v.keepRefining = function () { if (st.refineMode === 'edit') self.startEdit(); else self.startGuided(); };

