/*
 * Copyright 2021 BlackBerry Ltd.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const app = (() => {
    let inAppBrowserRef = null;
    let url = 'https://google.com/';
    const target = '_blank';
    const options = 'location=yes,beforeload=get';

    const jsPostMessage = "const message = 'this is the message';" +
        "const messageObj = {my_message: message};" +
        "const stringifiedMessageObj = JSON.stringify(messageObj);" +
        "webkit.messageHandlers.cordova_iab.postMessage(stringifiedMessageObj);";

    const inAppBrowserEvents = {
        beforeload: ({url}, callback) => {
            console.log('beforeload: event is triggered.');
            callback(url);
        },
        loadstart: () => {
            console.log('loadstart: loading please wait ...');
        },
        loadstop: () => {
            if (inAppBrowserRef) {
                inAppBrowserRef.insertCSS({ code: "body{font-size: 25px;}" });
                inAppBrowserRef.executeScript({ code: jsPostMessage });
                inAppBrowserRef.show();
            }
            console.log('loadstop: event is triggered.');
        },
        message: ({data}) => {
            console.log(`message received: ${data.my_message}`);
        },
        exit: () => {
            console.log('exit: event is triggered.');
        },
    };

    return () => {
        const elements = {
            go: null,
            search: null,
        };

        for (const id in elements) {
            elements[id] = document.getElementById(id);
        }

        const openInAppBrowserHandler = () => {
            url = elements.search.value.toLowerCase().trim();

            if (url === '') {
                alert('Please provide some value.');
                return;
            }

            inAppBrowserRef = cordova.InAppBrowser.open(
                encodeURI(url),
                target,
                options,
                inAppBrowserEvents
            );
        };

        elements.search.value = url;
        elements.go.addEventListener('click', openInAppBrowserHandler, false);
    };
})();

document.addEventListener('deviceready', app, false);
