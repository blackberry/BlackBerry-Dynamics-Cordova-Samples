/**
 * Copyright (c) 2023 BlackBerry Limited. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import shell from 'shelljs';

(function() {
    const projectRoot = process.env.INIT_CWD,
        androidProjectRoot = path.join(projectRoot, 'android'),
        iosProjectRoot = path.join(projectRoot, 'ios'),
        projectDataPath = path.join(projectRoot, 'src', 'data'),
        isWindows = process.platform === 'win32';

    if (!fs.existsSync(projectDataPath)) return;

    // Copy "src/data" resources from Capacitor project to Android platform
    if (fs.existsSync(androidProjectRoot)) {

        copyDirRecursively(
            projectDataPath,
            path.join(androidProjectRoot, 'app', 'src', 'main', 'assets', 'www', 'data')
        );
    }

    // Copy and link "src/data" resources from Capacitor project to iOS platform
    if (fs.existsSync(iosProjectRoot)) {
        if (isWindows) { return; }

        copyDirRecursively(
            projectDataPath,
            path.join(iosProjectRoot, 'App', 'App', 'www', 'data')
        );

        shell.exec(path.join('.', 'hooks', 'update_ios_config.rb'));
    }

    function copyDirRecursively(sourceFolder, targetFolder) {
        fse.copySync(sourceFolder, targetFolder, { overwrite: true });
    };

})();
