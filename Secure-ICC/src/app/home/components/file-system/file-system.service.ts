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

import { Injectable } from '@angular/core';

@Injectable()
export class FileSystemService {

  constructor() { }
  gdFileSystem;

  requestFileSystem() {
    return new Promise((resolve, reject) => {
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystem => {
        this.gdFileSystem = fileSystem;
        resolve(fileSystem);
      }, error => {
        reject(error);
      });
    });
  }

  createFile(filePath) {
    return new Promise((resolve, reject) => {
      const options = { create: true, exclusive: false };

      const createNewFile = () => {
        this.gdFileSystem.root.getFile(filePath, options, file => {
          resolve(file);
        }, error => {
          reject(error);
        });
      };

      this.getFile(filePath).then(file => {
        // DEVNOTE: if file exists - delete it and create new one
        this.removeFile(file).then(() => {
          createNewFile();
        }, error => {
          reject(error);
        });
      }, error => {
        // DEVNOTE: if file does not exist - create new one
        if (error.code === 1) {
          createNewFile();
        } else {
          reject(error);
        }
      });

    });
  }

  createDirectory(directoryPath) {
    return new Promise((resolve, reject) => {
      const options = { create: true, exclusive: false };
      this.gdFileSystem.root.getDirectory(directoryPath, options, directory => {
        resolve(directory);
      }, error => {
        reject(error);
      });
    });
  }

  getDirectory(directoryPath) {
    return new Promise((resolve, reject) => {
      const options = { create: false, exclusive: false };
      this.gdFileSystem.root.getDirectory(directoryPath, options, directory => {
        resolve(directory);
      }, error => {
        reject(error);
      });
    });
  }

  getParentDirectory(gdDirectoryEntry) {
    return new Promise((resolve, reject) => {
      gdDirectoryEntry.getParent(directoryEntry => {
        resolve(directoryEntry);
      }, error => {
        reject(error);
      });
    });
  }

  readDirectoryEntries(directoryPath) {
    return new Promise((resolve, reject) => {
      const directoryReader = new window.DirectoryReader(directoryPath);
      directoryReader.readEntries(entries => {
        resolve(entries);
      }, error => {
        reject(error);
      });
    });
  }

  getFile(filePath) {
    return new Promise((resolve, reject) => {
      const options = { create: false, exclusive: false };
      this.gdFileSystem.root.getFile(filePath, options, file => {
        resolve(file);
      }, error => {
        reject(error);
      });
    });
  }

  writeFile(dataToWrite, gdFileEntry) {
    return new Promise((resolve, reject) => {
      gdFileEntry.createWriter(fileWriter => {

        fileWriter.onwrite = () => {
          resolve();
        };

        fileWriter.onerror = error => {
          reject(error);
        };

        fileWriter.write(dataToWrite);
      });
    });
  }

  readFile(gdFileEntry) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        resolve(event.target.result);
      };

      reader.onerror = (event: any) => {
        reject(event.target.error);
      };

      reader.readAsText(gdFileEntry);
    });
  }

  removeFile(gdFileEntry) {
    return new Promise((resolve, reject) => {
      gdFileEntry.remove(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }

  removeDirectoryRecursively(gdDirectoryEntry) {
    return new Promise((resolve, reject) => {
      gdDirectoryEntry.removeRecursively(() => {
        resolve();
      }, error => {
        reject(error);
      });
    });
  }

}
