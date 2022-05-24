/*
* Copyright 2022 BlackBerry Ltd.
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

import { Component, OnInit } from '@angular/core';
import { Platform, ModalController, NavParams } from '@ionic/angular';

import { FileSystemService } from '../file-system/file-system.service';
import { SendFileModalComponent } from '../send-file-modal/send-file-modal.component';

@Component({
  selector: 'app-transfer-file',
  templateUrl: './transfer-file.component.html',
  styleUrls: ['./transfer-file.component.scss']
})
export class TransferFileComponent implements OnInit {

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private fileSystemService: FileSystemService
  ) { }
  ROOT_PATH;
  LOCATION_TO_CREATE_FILE = {
    isSetCustomLocation: false,
    locationValue: ''
  };
  createdFileEntry;
  showFileState;
  createdFileData;
  createFileButtonState;
  createFileFormState;
  onResumeSubscriber;
  fileEntries;

  ngOnInit() {
    this.showFileState = false;
    this.createFileButtonState = true;
    this.createFileFormState = false;
    this.fileEntries = [];

    this.platform.ready().then(readySource => {
      this.ROOT_PATH = window.plugins.GDAppKineticsPlugin.storageLocation;
      this.getDirectoryTreeFileEntries(this.ROOT_PATH);
    });
  }

  toogleCreateFileForm() {
    this.createFileButtonState = !this.createFileButtonState;
    this.createFileFormState = !this.createFileFormState;
  }

  async onSubmitCreateFileForm(fileForm) {
    try {
      const { fileLocation, fileName, fileText } = fileForm.value;

      const foldersToCreate = fileLocation
        .split('/')
        .map(folderName => folderName.trim());

      const filteredFolderToCreate = foldersToCreate.filter(entry => entry.length > 0);

      let currentFolderPath = '/';

      if (filteredFolderToCreate && filteredFolderToCreate.length > 0) {
        for (let i = 0; i < filteredFolderToCreate.length; i++) {
          currentFolderPath += `${filteredFolderToCreate[i]}/`;
          this.fileSystemService.createDirectory(currentFolderPath);
        }
      }

      const filePath = `${currentFolderPath}${fileName}.txt`;

      this.createdFileEntry = await this.fileSystemService.createFile(filePath);

      await this.fileSystemService.writeFile(fileText, this.createdFileEntry);

      this.createdFileData = await this.fileSystemService.readFile(this.createdFileEntry);

      this.getDirectoryTreeFileEntries(this.ROOT_PATH);
      this.toogleCreateFileForm();

      this.showFileState = true;
    } catch (error) {
      alert('Error:' + error);
    }
  }

  getDirectoryTreeFileEntries(directoryPath) {
    this.fileSystemService.readDirectoryEntries(directoryPath).then((directoryEntries: any) => {
      for (let i = 0; i < directoryEntries.length; i++) {
        if (directoryEntries[i].isDirectory) {
          this.getDirectoryTreeFileEntries(directoryEntries[i].nativeURL);
        } else {
          if (this.checkFileExistsInFilesToDisplayList(directoryEntries[i])) {
            continue;
          }

          this.fileEntries = [...this.fileEntries, directoryEntries[i]];
        }
      }
    }, error => {
      alert('Error:' + error.code);
    });
  }

  checkFileExistsInFilesToDisplayList(entry) {
    return this.fileEntries.filter(item => entry.fullPath === item.fullPath).length > 0;
  }

  async presentSendFileModal(filePath) {
    const sendModeModal = await this.modalCtrl.create({
      component: SendFileModalComponent,
      componentProps: {
        filePath
      }
    });

    return await sendModeModal.present();
  }

  hideShowFile() {
    this.showFileState = false;
  }

  trackByPath(index, filePath) {
    return filePath;
  }

}
