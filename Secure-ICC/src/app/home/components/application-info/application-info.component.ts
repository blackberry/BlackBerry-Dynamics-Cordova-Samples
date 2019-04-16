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
import { Platform } from '@ionic/angular';

import { ApplicationInfoService } from './application-info.service';

@Component({
  selector: 'app-application-info',
  templateUrl: './application-info.component.html',
  styleUrls: ['./application-info.component.scss']
})
export class ApplicationInfoComponent implements OnInit {

  constructor
  (
    private platform: Platform,
    private applicationInfoService: ApplicationInfoService
  ) { }
  platformName;
  bbdSDKVersion;
  applicationConfigInfo;

  ngOnInit() {
    this.platform.ready().then(readySource => {
      this.getPlatformName();
      this.getVersion();
      this.getApplicationConfig();
    });
  }

  getPlatformName() {
    this.platformName = this.platform.is('ios') ? 'iOS' : 'Android';
  }

  getVersion() {
    this.applicationInfoService.getVersion().then(version => {
      this.bbdSDKVersion = version;
    }, error => {
      alert('Error:' + error.code);
    });
  }

  getApplicationConfig() {
    this.applicationInfoService.getApplicationConfigInfo().then((configInfo: any) => {
      this.applicationConfigInfo = {
        ...configInfo,
        communicationProtocols: this.platform.is('ios') ?
          this.handleCommunicationProtocolsObjForiOS(configInfo.communicationProtocols) :
          this.handleCommunicationProtocolsObjForAndroid(configInfo.communicationProtocols)
      };
    }, error => {
      alert('Error:' + error.code);
    });
  }

  handleCommunicationProtocolsObjForiOS(communicationProtocols) {
    const communicationProtocolsArray = [];
    for (const protocolName in communicationProtocols) {
      if (communicationProtocols.hasOwnProperty(protocolName)) {
        communicationProtocolsArray.push(`${protocolName}=${communicationProtocols[protocolName]}`);
      }
    }
    return communicationProtocolsArray.join(', ');
  }

  handleCommunicationProtocolsObjForAndroid(communicationProtocols) {
    return communicationProtocols.toString().replace('{', '').replace('}', '');
  }

}
