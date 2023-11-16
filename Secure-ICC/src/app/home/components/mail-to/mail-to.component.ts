/*
* Copyright 2023 BlackBerry Ltd.
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
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Platform, ModalController, NavParams } from '@ionic/angular';

import { CreateFileModalComponent } from './create-file-modal/create-file-modal.component';
import { MailToService } from './mail-to.service';
import { FileSystemService } from '../file-system/file-system.service';

@Component({
  selector: 'app-mail-to',
  templateUrl: './mail-to.component.html',
  styleUrls: ['./mail-to.component.scss']
})
export class MailToComponent implements OnInit {

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private formBuilder: UntypedFormBuilder,
    private mailToService: MailToService,
    private fileSystemService: FileSystemService
  ) { }
  DATA_DIRECTORY_PATH;
  INBOX_PATH = '/Inbox/data';
  LOCATION_TO_CREATE_FILE = {
    isSetCustomLocation: true,
    locationValue: '/data'
  };
  mailToForm: UntypedFormGroup;
  bbdURLParams;
  dataDirectoryEntry;
  availableFileEntries;
  customSelectOptions;

  ngOnInit() {
    this.customSelectOptions = {
      header: 'Add Attachments',
    };

    this.platform.ready().then(readySource => {
      this.DATA_DIRECTORY_PATH = window.plugins.GDAppKineticsPlugin.storageLocation + this.LOCATION_TO_CREATE_FILE.locationValue;
      this.getFilesFromDataDirectory();
    });

    this.mailToForm = this.formBuilder.group({
      to: [''],
      cc: [''],
      bcc: [''],
      subject: [''],
      attachments: [''],
      body: [''],
    });

  }

  async presentNewFileModal() {
    const newFileModal = await this.modalCtrl.create({
      component: CreateFileModalComponent,
      componentProps: {
        fileLocation: this.LOCATION_TO_CREATE_FILE
       }
    });

    newFileModal.onDidDismiss().then((modal: any) => {
      const newFileModalData = {...modal.data};
      if (newFileModalData.isSubmit) {
        this.creatFileInDataDirectory(newFileModalData.newFileForm);
      }
    });

    return await newFileModal.present();
  }

  async creatFileInDataDirectory(fileForm) {
    try {
      const { fileLocation, fileName, fileText } = fileForm.value;
      const filePath = `${this.LOCATION_TO_CREATE_FILE.locationValue}/${fileName}.txt`;

      const createdFileEntry = await this.fileSystemService.createFile(filePath);

      await this.fileSystemService.writeFile(fileText, createdFileEntry);

      this.getFilesFromDataDirectory();

    } catch (error) {
      alert('Error:' + error.code);
    }
  }

  async getFilesFromDataDirectory() {
    try {
      const directoryEntries: any = await this.fileSystemService.readDirectoryEntries(this.DATA_DIRECTORY_PATH);
      this.availableFileEntries = directoryEntries.filter(entry => entry.isFile);
    } catch (error) {
      alert('Error:' + error.code);
    }
  }

  onSubmit(form) {
    const { to, cc, bcc, subject, attachments, body } = form.value;

    const attachmentPaths = attachments ?
      attachments.map(attachmentName => `${this.INBOX_PATH}/${attachmentName}`) : [];

    const [ firstToEmail, ...toEmails ] = this.normalizeEmails(to);
    const mailToURL = firstToEmail ? new URL('mailto:' + firstToEmail) : new URL('mailto:');

    this.bbdURLParams =
      `?to=${toEmails.join()}`
      + `&cc=${this.normalizeEmails(cc).join()}`
      + `&bcc=${this.normalizeEmails(bcc).join()}`
      + `&subject=${encodeURIComponent(subject)}`
      + `&attachment=${attachmentPaths.join()}`
      + `&body=${encodeURIComponent(body)}`;

    window.location.href = mailToURL.href + this.bbdURLParams;

    this.onReset(form);
  }

  normalizeEmails(emails) {
    return emails.trim().split(',').map(email => encodeURIComponent(email.trim()));
  }

  onReset(form) {
    form.setValue({
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      attachments: [],
      body: '',
    });
  }

  trackByPath(index, item) {
    return item.fullPath;
  }

}
