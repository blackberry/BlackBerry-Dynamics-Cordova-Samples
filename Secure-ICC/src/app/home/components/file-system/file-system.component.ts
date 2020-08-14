/*
* Copyright 2020 BlackBerry Ltd.
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
import { Platform, ModalController } from '@ionic/angular';

import { ShowFileModalComponent } from './show-file-modal/show-file-modal.component';
import { FileSystemService } from './file-system.service';

@Component({
  selector: 'app-file-system',
  templateUrl: './file-system.component.html',
  styleUrls: ['./file-system.component.scss']
})
export class FileSystemComponent implements OnInit {

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private fileSystemService: FileSystemService
  ) { }
  ROOT_PATH;
  readonlyDirectoriesPaths = ['//data', '//Inbox'];
  rootDirectoryEntriesPaths = [];
  currentDirectory;
  isRoot = true;
  currentDirectoryEntries;

  ngOnInit() {
    this.platform.ready().then(readySource => {
      this.ROOT_PATH = window.plugins.GDAppKineticsPlugin.storageLocation;
      this.getRootDirectoryEntries();
    });

    // DEVNOTE: root path directories begins with '/' on iOS and with '//' on Android
    if (this.platform.is('ios')) {
      this.readonlyDirectoriesPaths = this.readonlyDirectoriesPaths.map(entry => entry.substring(1));
    }
  }

  getRootDirectoryEntries() {
    this.fileSystemService.readDirectoryEntries(this.ROOT_PATH).then((directoryEntries: any) => {
      this.isRoot = true;
      this.currentDirectoryEntries = [...directoryEntries];

      this.rootDirectoryEntriesPaths = directoryEntries
        .filter(entry => entry.isDirectory)
        .map(entry => entry.fullPath);

    }, error => {
      alert('Error:' + error.code);
    });
  }

  handleParentDirectory() {
    const isRootEntry = this.rootDirectoryEntriesPaths.includes(this.currentDirectory.fullPath);

    if (isRootEntry) {
      // DEVNOTE: open root
      this.getRootDirectoryEntries();
    } else {
      // DEVNOTE: open other than root
      this.openParentDirectory();
    }
  }

  openParentDirectory() {
    this.fileSystemService.getParentDirectory(this.currentDirectory).then((parentDirectoryEntry: any) => {
      this.openDirectoryByDirectoryEntry(parentDirectoryEntry);
    }, error => {
      alert('Error:' + error.code);
    });
  }

  async openDirectoryByDirectoryEntry(directoryEntry) {
    try {
      this.currentDirectoryEntries = await this.fileSystemService.readDirectoryEntries(directoryEntry.nativeURL);
      this.currentDirectory = directoryEntry;
      this.isRoot = false;
    } catch (error) {
      alert('Error:' + error.code);
    }
  }

  showFile(fileEntry) {
    this.fileSystemService.readFile(fileEntry).then(fileEntryData => {
      this.presentFileModal(fileEntry, fileEntryData);
    }, error => {
      alert('Error:' + error.code);
    });
  }

  async presentFileModal(fileEntry, fileEntryData) {
    const newFileModal = await this.modalCtrl.create({
      component: ShowFileModalComponent,
      componentProps: {
        fileEntry,
        fileEntryData
      }
    });

    return await newFileModal.present();
  }

  createDirectory(directoryPath) {
    this.fileSystemService.createDirectory(directoryPath).then(() => {
      this.getRootDirectoryEntries();
    }, error => {
      alert('Error:' + error.code);
    });
  }

  removeFile(event, fileEntry) {
    event.stopPropagation();

    this.fileSystemService.removeFile(fileEntry).then(() => {
      this.currentDirectoryEntries = this.currentDirectoryEntries.filter(entry =>
        entry.fullPath !== fileEntry.fullPath);
    }, error => {
      alert('Error:' + error.code);
    });
  }

  removeDirectoryRecursively(event, directoryEntry) {
    event.stopPropagation();

    this.fileSystemService.removeDirectoryRecursively(directoryEntry).then(() => {
      this.currentDirectoryEntries = this.currentDirectoryEntries.filter(entry =>
        entry.fullPath !== directoryEntry.fullPath);
    }, error => {
      alert('Error:' + error.code);
    });
  }

  trackByPath(index, item) {
    return item.fullPath;
  }

}
