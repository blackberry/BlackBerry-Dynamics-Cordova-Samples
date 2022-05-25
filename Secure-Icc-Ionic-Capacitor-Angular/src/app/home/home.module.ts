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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ReceiveFileModalComponent } from './components/receive-file-modal/receive-file-modal.component';

import { ApplicationInfoModule } from './components/application-info/application-info.module';
import { ShowFileModule } from './components/show-file/show-file.module';
import { TransferFileModule } from './components/transfer-file/transfer-file.module';
import { MailToModule } from './components/mail-to/mail-to.module';
import { FileSystemModule } from './components/file-system/file-system.module';

import { FileSystemService } from './components/file-system/file-system.service';
import { TransferFileService } from './components/transfer-file/transfer-file.service';
import { MailToService } from './components/mail-to/mail-to.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    ApplicationInfoModule,
    ShowFileModule,
    TransferFileModule,
    MailToModule,
    FileSystemModule
  ],
  declarations: [
    HomePage,
    ReceiveFileModalComponent
  ],
  providers: [
    FileSystemService,
    TransferFileService,
    MailToService
  ],
  entryComponents: [
    ReceiveFileModalComponent
  ]
})
export class HomePageModule {}
