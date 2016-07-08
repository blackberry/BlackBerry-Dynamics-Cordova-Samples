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

    window.fs = {};

    // get filesystem
    var successCallbackToGetFileSystem = function(fileSystem) {
            fs.secureFileSystem = fileSystem;
            _writeFile();
        },
        errorCallback = function(error) {
            console.log('Error: ' + error);
        };

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, successCallbackToGetFileSystem, errorCallback);

    // private - write file
    var _writeFile = function() {
        var successCallbackToCreateFile = function(file) {
                var writer = file.createWriter(function(writer) {
                    var saveText = 'Hello World!!!';

                    writer.onwritestart = function() {
                        console.log('writing to secure file ' + file.name);
                    };

                    writer.onwriteend = function() {
                        outputString = 'File saved to: ' + cordova.file.dataDirectory + 'gd.txt\n\n';
                        setOutput(outputString);

                        setTimeout(function() {
                            console.log('reading file');
                            _readFile(file);
                        }, 2000);
                    };

                    writer.onerror = function(error) {
                        console.log('Error: ' + error);
                    };

                    writer.write(saveText);
                }, errorCallback);
            },
            errorCallback = function(error) {
                console.log('Error: ' + error);
            };

        fs.secureFileSystem.root.getFile('gd.txt', { create: true, exclusive: false }, successCallbackToCreateFile, errorCallback);
    };

    // private - read file
    var _readFile = function(file) {
        var successCallbackToReadFile = function(file) {
                file.file(
                    function(file) {
                        var reader = new FileReader();
                        reader.onloadend = function(evt) {
                            outputString = outputString + 'Read file: "' + this.result + '"';
                            setOutput(outputString);
                        };
                        reader.readAsText(file);
                    },
                    function(error) {
                        console.log('Error: ' + error);
                    }
                );
            },
            errorCallbackRead = function(error) {
                console.log('Error: ' + error);
            };
        fs.secureFileSystem.root.getFile('gd.txt', { create: false, exclusive: false }, successCallbackToReadFile, errorCallbackRead);
    };
};


// setup the database
window.db = window.openDatabase(
    'SampleDb6',
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

            tx.executeSql('INSERT INTO FavoriteColors (colorId, isFavorite) VALUES (?, ?);', [box.text, box.checked],
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
        console.log('Database ready, prepare to output in 2sec');
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
                    for (var x = 0; x < l; x++) {
                        var row = result.rows.item(x);
                        var obj = {
                            text: row.colorId,
                            checked: row.isFavorite
                        };
                        outputString = outputString + '\nSQL SELECT: ' + obj.text + ' : ' + obj.checked;
                    }
                    setOutput(outputString);
                },
                // fail
                function(error) {
                    console.log('Failed in SQL Read', error);
                }
            );
        });
    }
};


// http
var httpTest = function() {
    console.log('>> HTTP')

    var url = 'http://developer.blackberry.com';
    var xhr = window.plugins.GDHttpRequest.createRequest('GET', url, 30, true);
    xhr.send(
        function(response) {
            var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
            var truncatedOutput = responseObj.responseText.substring(0, 2000);
            setOutput(truncatedOutput);
        },
        function(error) {
            console.log('http fail ', error);
        }
    );
};


// socket
var socketTest = function() {
    console.log('>> Socket')

    var url = 'echo.websocket.org';
    var aSocket = window.plugins.GDSocket.createSocket(url, 80, false);

    aSocket.onSocketResponse = function(obj) {
        var socketResponse = window.plugins.GDSocket.parseSocketResponse(obj);

        switch (socketResponse.responseType) {
            case 'open':
                var payload = 'GET https://developer.blackberry.com/ HTTP/1.1\r\n' +
                    'Host: developer.blackberry.com:443\r\n' +
                    'Connection: close\r\n' +
                    '\r\n';

                setOutput('Sending then closing..\n\n' + payload);
                window.plugins.GDSocket.send(socketResponse.socketID, payload);
                window.plugins.GDSocket.close(socketResponse.socketID);
                break;

            case 'message':
                window.plugins.GDSocket.close(socketResponse.socketID);
                break;

            case 'error':
                console.log('Received an error status from the socket connection.');
                break;

            case 'close':
                console.log('Socket connection closed successfully.');
                break;

            default:
                console.log('Unknown Socket response type: ' + socketResponse.responseType);
        }
    };

    // error
    aSocket.onSocketError = function(error) {
        console.log('The socket connection failed: ' + error);
    };

    // connect!
    aSocket.connect();
};


// helper - sets output text in textarea
var setOutput = function(data) {
    outputEl.innerHTML = data;
};


// helper - clear output
var clearOutput = function(data) {
    outputEl.innerHTML = '';
};
