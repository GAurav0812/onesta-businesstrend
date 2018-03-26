var app=angular.module('able-editable-table', ['xeditable','angularRipple']);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});