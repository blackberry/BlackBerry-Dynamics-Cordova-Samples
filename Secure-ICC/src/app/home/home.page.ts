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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, ModalController, NavParams } from '@ionic/angular';
import { ReceiveFileModalComponent } from './components/receive-file-modal/receive-file-modal.component';
import { TransferFileService } from './components/transfer-file/transfer-file.service';
import { FileSystemService } from './components/file-system/file-system.service';
import { MailToService } from './components/mail-to/mail-to.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private transferFileService: TransferFileService,
    private fileSystemService: FileSystemService,
    private mailToService: MailToService
  ) { }
  DEFAULT_TAB_VALUE = 'applicationInfo';
  activeTab;
  isFSReady;
  isFilesCopiedToSecureStorage;
  onResumeSubscriber;

  ngOnInit() {
    this.activeTab = this.DEFAULT_TAB_VALUE;
    this.isFSReady = false;
    this.isFilesCopiedToSecureStorage = false;

    this.platform.ready().then(readySource => {
      this.requestFileSystem();
      this.checkAvailableFileToReceive();

      this.onResumeSubscriber = this.platform.resume.subscribe(() => {
        this.checkAvailableFileToReceive();
      });
    });

  }

  ngOnDestroy() {
    this.onResumeSubscriber.unsubscribe();
  }

  requestFileSystem() {
    this.fileSystemService.requestFileSystem().then(gdFileSystem => {
      this.isFSReady = true;

      this.mailToService.copyFilesToSecureFileSystem().then(copiedFilesCount => {
        this.isFilesCopiedToSecureStorage = true;
      }, error => {
        alert('Error:' + error.code);
      });

    }, error => {
      alert('Error:' + error.code);
    });
  }

  checkAvailableFileToReceive() {
    this.transferFileService.retrieveFiles().then((filePaths: any) => {
      const firstFilePath = filePaths[0];
      this.handleReceivedFile(firstFilePath);
    }, error => {
      console.log('No files, waiting for receive...');
    });
  }

  async handleReceivedFile(filePath) {
    try {
      const receivedFileEntry = await this.fileSystemService.getFile(filePath);
      const receivedFileData = await this.fileSystemService.readFile(receivedFileEntry);

      this.presentReceiveFileModal(receivedFileEntry, receivedFileData);
    } catch (error) {
      alert('Error:' + error.code);
    }
  }

  async presentReceiveFileModal(receivedFile, receivedFileData) {
    const receiveFileModal = await this.modalCtrl.create({
      component: ReceiveFileModalComponent,
      componentProps: {
        receivedFile,
        receivedFileData
      }
    });

    receiveFileModal.onDidDismiss().then((modal: any) => {
      this.activeTab = 'fileSystem';
    });

    return await receiveFileModal.present();
  }

}

declare global {
  interface Window {
    requestFileSystem: any;
    plugins: any;
    DirectoryReader: any;
  }
  var LocalFileSystem: any;
}
