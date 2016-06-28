/*
 * Copyright 2016 BlackBerry Ltd.
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

var policy = {

    // init
    init: function() {
        console.log('> init');

        // elements
        elCarName = document.getElementsByClassName("car-name")[0];
        elCarImage = document.getElementsByClassName("car-photo")[0];
        elCarDescription = document.getElementsByClassName("car-description")[0];
        elPolicyVersion = document.getElementsByClassName("policy-version")[0];
        elEngineButton = document.getElementsByClassName("engine-button")[0];

        // car sound
        carSound = new Audio("assets/car_sound.mp3");

        // start the app
        policy.getAppPolicy();
    },


    // update app policy
    updateAppPolicy: function(appPolicy) {
        console.log('> updateAppPolicy');

        // the car
        elCarName.innerHTML = appPolicy.carName;
        elCarDescription.innerHTML = appPolicy.carDescription;
        elPolicyVersion.innerHTML = "Policy v" + appPolicy.version;
        elCarImage.src = policy.getCar(appPolicy.exteriorColor, appPolicy.isConvertible);

        // auto-play engine sound?
        if (appPolicy.enableAutoPlaySound) {
            policy.playSound();
        }

        // setup 'start engine' button
        if (appPolicy.enableSound) {
            elEngineButton.disabled = false;
        } else {
            elEngineButton.disabled = true;
        }

        // setup visible elements
        var visibleElements = appPolicy.visibleElements;

        // name
        if (visibleElements.indexOf("name") != -1) {
            elCarName.style.visibility = "visible";
        } else {
            elCarName.style.visibility = "hidden";
        }

        // image
        if (visibleElements.indexOf("image") != -1) {
            elCarImage.style.visibility = "visible";
        } else {
            elCarImage.style.visibility = "hidden";
        }

        // description
        if (visibleElements.indexOf("description") != -1) {
            elCarDescription.style.visibility = "visible";
        } else {
            elCarDescription.style.visibility = "hidden";
        }
    },


    // build car photo uri
    getCar: function(id, isConvertible) {
        console.log('> getCarPhoto');

        var bodyType;
        var color;

        switch (id) {
            case 0:
                color = "black";
                break;

            case 1:
                color = "blue";
                break;

            case 2:
                color = "red";
                break;

            case 3:
                color = "silver";
                break;

            case 4:
                color = "turquoise";
                break;

            case 5:
                color = "yellow";
                break;
        }

        // body type
        switch (isConvertible) {
            case true:
                bodyType = "convertible";
                break;
            case false:
                bodyType = "coupe";
                break;
        }

        return "assets/" + color + "_" + bodyType + ".png";
    },


    // play engine sound
    playSound: function() {
        console.log('> playSound');
        carSound.play();
    },


    // update app policy
    getAppPolicy: function() {
        console.log('> getAppPolicy');

        window.plugins.GDSpecificPolicies.updatePolicy(
            function(appPolicy) {
                policy.updateAppPolicy(appPolicy);
            },
            function(error) {
                alert("Error getting app policy: " + error);
            }
        );

    }

};
