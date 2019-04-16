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

import { Component, OnInit } from '@angular/core';

import { Platform, NavParams, ModalController } from '@ionic/angular';

import { TransferFileService } from '../transfer-file/transfer-file.service';

@Component({
  selector: 'app-send-file-modal',
  templateUrl: './send-file-modal.component.html',
  styleUrls: ['./send-file-modal.component.scss']
})
export class SendFileModalComponent implements OnInit {

  constructor(
    private platform: Platform,
    private params: NavParams,
    private modalCtrl: ModalController,
    private transferFileService: TransferFileService
  ) {  }
  FILE_TRANSFER_SERVICE_NAME = 'com.good.gdservice.transfer-file';
  FILE_TRANSFER_SERVICE_VERSION = '1.0.0.0';
  APPLICATIONS_TO_DISMISS = ['com.good.gd.example.pg.appkinetics.client', 'com.blackberry.bbd.example.ion.secureicc'];
  selectedAppToSend;
  isAvailableAppToSendFile;
  availableApps;

  ngOnInit() {
    this.isAvailableAppToSendFile = true;

    this.platform.ready().then(readySource => {
      this.getListOfAppsToSendFilesTo();
    });
  }

  getListOfAppsToSendFilesTo() {
    const serviceId = this.FILE_TRANSFER_SERVICE_NAME;
    const serviceVersion = this.FILE_TRANSFER_SERVICE_VERSION;
    const applicationsToDismiss = [...this.APPLICATIONS_TO_DISMISS];

    this.transferFileService.getListOfAvailableGDApplications(serviceId, serviceVersion).then((applications: any) => {

      this.availableApps = applications.filter(application =>
        applicationsToDismiss.indexOf(application.address) === -1);

      if (this.availableApps && this.availableApps.length > 0) {
        this.selectedAppToSend = this.availableApps[0].address;
      } else {
        this.isAvailableAppToSendFile = false;
      }

    }, error => {
      alert('Error:' + error);
    });

  }

  submitSelectedAppToSendFiles() {
    this.transferFileService.sendFileToApp(this.params.data.filePath, this.selectedAppToSend).then(result => {
      console.log('File was successfully sent to ', this.selectedAppToSend);
      this.closeSendFileModal();
    }, error => {
      alert('Error:' + error);
    });

  }

  closeSendFileModal() {
    this.modalCtrl.dismiss();
  }

}
