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
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-file-modal',
  templateUrl: './create-file-modal.component.html',
  styleUrls: ['./create-file-modal.component.scss']
})
export class CreateFileModalComponent implements OnInit {

  constructor(
    private params: NavParams,
    private modalCtrl: ModalController
  ) { }
  fileLocation;
  FORM_ACTIONS = {
    submit: true,
    cancel: false
  };

  ngOnInit() {
    this.fileLocation = this.params.data.fileLocation;
  }

  onSubmitCreateFileForm(newFileForm) {
    this.closeNewFileModal(this.FORM_ACTIONS.submit, newFileForm);
  }

  closeNewFileModal(isSubmit, newFileForm) {
    this.modalCtrl.dismiss({
      isSubmit,
      newFileForm
    });
  }

}
