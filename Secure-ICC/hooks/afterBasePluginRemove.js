#!/usr/bin/env node

/*
* Copyright 2019 BlackBerry Ltd.
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

module.exports = function(context) {

    var fs = require('fs'),
        command = process.env.CORDOVA_BIN || 'cordova', // process.env.CORDOVA_BIN is used for internal purposes
        path = context.requireCordovaModule('path'),
        execSync = require('child_process').execSync,
        pluginsListStr = execSync(command + ' plugin', { encoding: 'utf8' }),
        pathToAndroidPlatform = path.join(context.opts.projectRoot, 'platforms', 'android'),
        pathToiOSPlatform = path.join(context.opts.projectRoot, 'platforms', 'ios');

    if (pluginsListStr.indexOf('cordova-plugin-bbd-base') < 0) {

        restoreConfigXml([
            '<preference name="android-minSdkVersion" value="23" />',
            '<preference name="android-targetSdkVersion" value="26" />'
        ]);

        if (fs.existsSync(pathToAndroidPlatform)) {
            var isAndroidBuilt = fs.existsSync(path.join(pathToAndroidPlatform, 'build'));
            execSync(command + ' platform rm android');
            execSync(command + ' platform add android');
            if (isAndroidBuilt) {
                execSync(command + ' prepare android');
                execSync(command + ' compile android');
            }
        }

        if (fs.existsSync(pathToiOSPlatform)) {
            var isiOSBuilt = fs.existsSync(path.join(pathToiOSPlatform, 'build'));
            execSync(command + ' platform rm ios');
            execSync(command + ' platform add ios');
            if (isiOSBuilt)
                execSync(command + ' prepare ios');
        }
    }

    if (pluginsListStr.indexOf('cordova-plugin-bbd-') < 0) {
        restoreConfigXml(['<hook src="hooks/afterBasePluginRemove.js" type="after_plugin_rm" />']);
        fs.unlinkSync(path.join(context.opts.projectRoot, 'hooks', 'afterBasePluginRemove.js'));
        console.log("No BBD Cordova plugins installed");
    }

    // removing properties from config.xml added by BBD Cordova plugins
    function restoreConfigXml(propertiesArrayToRestore) {
        var xmlContent = fs.readFileSync(path.join(context.opts.projectRoot, 'config.xml'), { encoding: 'utf8' });
        for (var i = 0; i < propertiesArrayToRestore.length; i++){
            xmlContent = xmlContent.replace(propertiesArrayToRestore[i], '');
        }
        xmlContent = xmlContent.replace(/^\s*$[\n\r]{1,}/gm, '');
        fs.writeFileSync(path.join(context.opts.projectRoot, 'config.xml'), xmlContent, 'utf8');
    }
}
