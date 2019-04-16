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

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-file-form',
  templateUrl: './create-file-form.component.html',
  styleUrls: ['./create-file-form.component.scss']
})
export class CreateFileFormComponent implements OnInit {
  @Input() location;
  @Output() submitForm = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder
  ) { }
  FILE_NAME = 'testfilename';
  FILE_TEXT = 'Test data for creating new text attachment in secure storage.';
  createFileForm: FormGroup;
  fileLocation = {
    value: '/',
    disabled: false
  };

  ngOnInit() {
    if (this.location.isSetCustomLocation) {
      this.fileLocation = {
        value: this.location.locationValue,
        disabled: true
      };
    }

    this.createFileForm = this.formBuilder.group({
      fileLocation: [this.fileLocation, [Validators.required]],
      fileName: [this.FILE_NAME, [Validators.required, Validators.pattern('^[\\w][ -\\w]*')]],
      fileText: [this.FILE_TEXT, [Validators.required]]
    });
  }

  onSubmit(form) {
    if (form.valid) {
      this.submitForm.emit({ ...form });
      this.onReset(form);
    }
  }

  onReset(form) {
    form.reset({ fileLocation: this.fileLocation.value });
  }

}
