import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-show-file-modal',
  templateUrl: './show-file-modal.component.html',
  styleUrls: ['./show-file-modal.component.scss']
})
export class ShowFileModalComponent implements OnInit {

  constructor(
    private params: NavParams,
    private modalCtrl: ModalController
  ) { }
  fileEntry;
  fileEntryData;

  ngOnInit() {
    this.fileEntry = this.params.data.fileEntry;
    this.fileEntryData = this.params.data.fileEntryData;
  }

  closeShowFileModal() {
    this.modalCtrl.dismiss();
  }

}
