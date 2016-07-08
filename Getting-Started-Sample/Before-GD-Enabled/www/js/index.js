/* Copyright 2016 BlackBerry Ltd.
 Licensed under the Apache License, Version 2.0 (the 'License');
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an 'AS IS' BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 express or implied. See the License for the specific language
 governing permissions and limitations under the License.  */

// Application Constructor
var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        console.log('>> device ready');

        // which device are we running on?
        try {
            window.devicePlatform = device.platform;
        } catch (e) {
            window.devicePlatform = 'Android' // works in browser typically, used for sqlite example here
        }
        console.log('Running on >> ' + window.devicePlatform + ' <<');
    }
};


// start up the app
app.initialize();

// main output element
var outputEl = document.getElementsByClassName('text-area-output')[0];

// output string for the textarea
var outputString = '';


// file system
var fileTest = function() {
    console.log('>> File System');

    window.fileObject = {};

    // get handle on local filesystem
    window.resolveLocalFileSystemURL(
        cordova.file.dataDirectory,
        function(dir) {
            dir.getFile('gd.txt', { create: true }, function(file) {
                window.fileObject = file;
                var saveText = 'Hello World!!!';

                if (!window.fileObject) return;

                window.fileObject.createWriter(
                    function(fileWriter) {
                        outputString = 'File saved to: ' + cordova.file.dataDirectory + 'gd.txt\n\n';

                        var blob = new Blob(
                            [saveText], { type: 'text/plain' }
                        );
                        fileWriter.write(blob);
                        setOutput(outputString);
                        setTimeout(function() {
                            _readFile();
                        }, 2000);
                    },

                    function(error) {
                        console.log('Error: ' + error);
                    }
                );
            });
        }
    );

    // private - read file
    var _readFile = function() {
        window.fileObject.file(
            function(file) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    outputString = outputString + 'Read file: "' + this.result + '"';
                    setOutput(outputString);
                };
                reader.readAsText(file);
            },
            function(error) {
                console.log('Error: ' + error);
            }
        );
    };
};

// setup the database
window.db = window.openDatabase(
    'SampleDb4',
    '1.0',
    'Cordova Demo',
    200000,
    function() {
        console.log('opened db');
    },
    function(error) {
        console.log('error opening db', error);
    }
);

// sql insert/select
var sqlTest = function() {
    console.log('>> SQL Insert');

    // checkboxes
    var checkboxes = [{
        text: 'red',
        checked: true
    }, {
        text: 'green',
        checked: true
    }, {
        text: 'pink',
        checked: false
    }, {
        text: 'orange',
        checked: false
    }, {
        text: 'brown',
        checked: false
    }, {
        text: 'purple',
        checked: false
    }, {
        text: 'yellow',
        checked: true
    }];

    // output string for the textarea
    outputString = '';

    // save color checkboxes
    window.db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS FavoriteColors;');
        tx.executeSql('CREATE TABLE IF NOT EXISTS FavoriteColors(' + 'colorId VARCHAR(50), ' + 'isFavorite VARCHAR(50) );', [], null, null);

        var l = checkboxes.length;
        for (var x = 0; x < l; x++) {
            var box = checkboxes[x];
            outputString = outputString + '\nSQL INSERT: ' + box.text + ' : ' + box.checked;

            tx.executeSql('INSERT INTO FavoriteColors (colorId, isFavorite) VALUES ("' + box.text + '", "' + box.checked + '");', [],
                // success
                function() {},
                // fail
                function(error) {
                    console.log('insert error', error);
                },
                null
            );
        };

    }, function(error) {
        console.log('Can\'t complete SQL transaction', error);
    }, function() {
        console.log('Database ready, prepare to output in 2.5sec');
        setOutput(outputString);
        setTimeout(function() {
            _readSQL();
        }, 2000);
    });

    // private - read sql
    var _readSQL = function() {
        console.log('>> SQL Select');

        outputString = outputString + '\n';
        window.db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM FavoriteColors', [],
                // success
                function(tx, result) {
                    var l = result.rows.length;

                    // android
                    if (window.devicePlatform == 'Android') {
                        console.log('SQL > Android');
                        for (var x = 0; x < l; x++) {
                            var row = result.rows[x];
                            var obj = {
                                text: row.colorId,
                                checked: row.isFavorite
                            };
                            outputString = outputString + '\nSQL SELECT: ' + obj.text + ' : ' + obj.checked;
                            setOutput(outputString);
                        }

                        // ios
                    } else if (window.devicePlatform == 'iOS') {
                        console.log('SQL > iOS');
                        for (var x = 0; x < l; x++) {
                            var row = result.rows.item(x);
                            var obj = {
                                text: row.colorId,
                                checked: row.isFavorite
                            };
                            outputString = outputString + '\n\n\nSQL SELECT: ' + obj.text + ' : ' + obj.checked;
                            setOutput(outputString);
                        }
                    }
                },
                // fail
                function() {}
            );
        });
    }
};


// http
var httpTest = function() {
    console.log('>> HTTP')

    var url = 'http://developer.blackberry.com';
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var truncatedOutput = xhr.responseText.substring(0, 2000);
            setOutput(truncatedOutput);
        }
    }
    xhr.open('GET', url, true);
    xhr.send();
};


// socket
var socketTest = function() {
    console.log('>> Socket')

    var url = 'ws://echo.websocket.org'; // must be ws:// or wss://
    var ws = new WebSocket(url);

    ws.onopen = function() {
        var payload = 'GET https://developer.blackberry.com/ HTTP/1.1\r\n' +
            'Host: developer.blackberry.com:443\r\n' +
            'Connection: close\r\n' +
            '\r\n';

        ws.send(payload);
        ws.close();
    };

    ws.onmessage = function(event) {
        console.log(event.data);
        setOutput(event.data.substring(0, 1000));
    };

    ws.onclose = function() {
        // websocket is closed.
    };


};


// helper - sets output text in textarea
var setOutput = function(data) {
    outputEl.innerHTML = data;
};


// helper - clear output
var clearOutput = function(data) {
    outputEl.innerHTML = '';
};
