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

import { TransferFileComponent } from './transfer-file.component';
import { TransferFileService } from './transfer-file.service';

import { CreateFileFormModule } from '../create-file-form/create-file-form.module';
import { ShowFileModule } from '../show-file/show-file.module';

import { SendFileModalComponent } from '../send-file-modal/send-file-modal.component';

import { FileSystemService } from '../file-system/file-system.service';

@NgModule({
  declarations: [
    TransferFileComponent,
    SendFileModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    CreateFileFormModule,
    ShowFileModule
  ],
  exports: [
    TransferFileComponent
  ],
  providers: [
    TransferFileService,
    FileSystemService
  ],
  entryComponents: [
    SendFileModalComponent
  ]
})
export class TransferFileModule { }
