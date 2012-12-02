# $dialogProvider <small>(service in ui.bootstrap)</small>

## Description

Used for configuring global options for dialogs.

### Methods

#### `options(opts)`

Sets the default global options for your application. Options can be overridden when opening dialogs. Available options are:

*   `backdrop`: a boolean value indicating whether a backdrop should be used or not.
*   `modalClass`: the css class for the modal div, defaults to 'modal'
*   `backdropClass`: the css class for the backdrop, defaults to 'modal-backdrop'
*   `controller`: the controller to associate with the included partial view
*   `locals`: local variables shared with the scope of the dialog
*   `callback`: a function that is called with the result from the close method
*   `backdropFade`: a boolean value indicating whether the backdrop should fade in and out using a CSS transition, defaults to false
*   `modalFade`: a boolean value indicating whether the nodal should fade in and out using a CSS transition, defaults to false
*   `keyboard`: indicates whether the dialog should be closable by hitting the ESC key, defaults to true
*   `backdropClick`: indicates whether the dialog should be closable by clicking the backdrop area, defaults to true

Example:

    var app = angular.module('App', ['ui.bootstrap.dialog'] , function($dialogProvider){
        $dialogProvider.options({backdropClick: false, modalFade: true});
    });

# $dialog service

## Description

Allows you to open dialogs from within you controller.

### Methods

#### `open(include[, opts])`

Opens a dialog by including the specific `include` template. Default or globally set options can be overridden using the opts parameter.

Example:

    app.controller('MainCtrl', function($dialog, $scope) {
        $scope.openItemEditor = function(item){
            var d = $dialog.open({templateUrl: 'dialogs/item-editor.html', modalFade: false, locals: {item: item}});
        };
    });

#### `message(title, message, buttons[, opts])`

Opens a message box with the specified `title`, `message` ang  a series of `buttons` can be provided, every button can specify:

*   `label`: the label of the button
*   `result`: the result used to invoke the close method of the dialog
*   `cssClass`: optinal, the CSS class (e.g. btn-primary) to apply to the button

Example:

    app.controller('MainCtrl', function($dialog, $scope) {
        $scope.deleteItem = function(item){
            d = $dialog.message('Delete Item', 'Are you sure?', [{label:'Yes, I'm sure, result: 'yes'},{label:'Nope', result: 'no'}])
            .yes(deleteItem)
            .no(function(){});
        };
    });

## Dialog class

The dialog object returned by the `$dialog` service methods `open` and `message`.

### Methods

#### `open`

(Re)Opens the dialog.

#### `close([result])`

Closes the dialog. Optionally a result can be specified.
