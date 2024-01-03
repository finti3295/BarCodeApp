import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../notification/notification.service';
import { FileUploadService } from '../services/fileUpload.service';
import { TokenStorageService } from '../services/TokenStorageService.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private fileUploadService: FileUploadService, private tokenStorageService: TokenStorageService, private router: Router,
    protected _notificationSvc: NotificationService) { }



  private _showcamera: boolean = true;
  private _showvideo: boolean = false
  private _showvideoRecorded: boolean = false;
  private _showCropper: boolean = false;
  private _showUpload: boolean = false;
  private _stopvideo:boolean = false;

  streaming: boolean = false;
  videoPlayer: HTMLVideoElement | null = null;
  videoLive: HTMLVideoElement | null = null;
  videoRecorded: HTMLVideoElement | null = null;
  mycanvas: HTMLCanvasElement  | null = null;
  myFilecanvas: HTMLImageElement | null = null;
  mediaDevices: MediaDeviceInfo[] = [] ;
  selectedDevice : MediaDeviceInfo| null = null;
  selectedDeviceIndex : number = 0;

  currentStream: MediaStream| null = null;
  mediaRecorder : MediaRecorder | null = null;
  myVideoBlob : Blob | null = null;

  fileToUpload: string = "";
  barcode:string = "";
  @Input() width: number = 0;
  @Output() widthChange = new EventEmitter<number>();
  @Input() height: number = 0;
  @Output() heightChange = new EventEmitter<number>();
   frameRate: number | undefined = 0;

   setWidth(delta: number) {
    this.width = delta;
    if(this.showcamera && this.videoPlayer){
      this.videoPlayer.width = this.width;
    }else if(this.showvideo && this.videoLive) {
      this.videoLive.width = this.width;
    }
    this.widthChange.emit(this.width);
  }

  setHeight(delta: number) {
    this.height = delta;
    if(this.showcamera && this.videoPlayer){
      this.videoPlayer.height = this.height;
    }else if(this.showvideo && this.videoLive) {
      this.videoLive.height = this.height;
    }
    this.heightChange.emit(this.height);
  }
   public get showCropper(){
    return this._showCropper;
   }

   public get stopvideo(){
    return this._stopvideo;
   }

  public get showcamera() {
    return this._showcamera;
  }

  public get showvideo() {
    return this._showvideo;
  }
  public get showvideoRecorded() {
    return this._showvideoRecorded;
  }

  public get showUpload() {
    return this._showUpload;
  }

  public set showCropper(theshowCropper: boolean){
if(theshowCropper){
  this.showcamera = false;
}
    this._showCropper = theshowCropper;
  }

  public set stopvideo(thestopvideo: boolean){
    if(thestopvideo)
        this.showvideo = false;
    this._stopvideo = thestopvideo;

  }

  public set showvideo(theshowvideo: boolean) {
    if(theshowvideo){
      this.showcamera = false;
      this.showvideoRecorded = false;
      this.showCropper = false;
      this.showUpload = false;
      this.stopvideo = false;
      //console.log("this.videoLive", this.videoLive);
      if (!this.videoLive) return;
    this.videoLive.srcObject = this.currentStream;
    if (!MediaRecorder.isTypeSupported('video/webm')) { // <2>
      this._notificationSvc.error('Errore', 'video/webm is not supported', environment.notificationTimeOut); 
    }
  
    }
    this._showvideo = theshowvideo;
  }

  public set showvideoRecorded(theshowvideoRecorded: boolean) {
    if(theshowvideoRecorded){
      this.stopvideo = false;
      this.showvideo = false;
  
    }
    //console.log("_showvideo %s", theshowvideo);
    this._showvideoRecorded = theshowvideoRecorded;
  }

  public set showcamera(theshowcamera: boolean) {
    //console.log("showcamera="+theshowcamera);
    if(theshowcamera){
      //console.log("showcamera");
      this.barcode = "";
      this.showCropper = false;
      this.showvideo = false;
      this.showvideoRecorded = false;
      this.showUpload = false;
      this.stopvideo = false;
      if (!this.videoPlayer) {
        //console.log("this.videoPlayer");
        return;
      }
      this.mediaRecorder?.stop();
      this.videoPlayer.srcObject = this.currentStream;
      this.videoPlayer.play();
      if(!this.videoPlayer.srcObject)
      {
        //console.log("this.videoPlayer.srcObject");
        return;
      }
      let track = this.videoPlayer.srcObject.getTracks()[0];
      if (track.getSettings) {
        let { width, height, frameRate } = track.getSettings();
        //console.log("width= "+width);
        //console.log("height= "+height);
        if (width)
          this.setWidth(width);
        if (height)
        this.setHeight(height)
          if(this.frameRate)
                  this.frameRate = frameRate;

        console.log(`${width}x${height}x${frameRate}`);
        // this.setWidth(this.width);
        // this.setHeight(this.height);
        console.log(this.videoPlayer);
      }
    }
    this._showcamera = theshowcamera;
  }

  public set showUpload(theshowUpload: boolean) {
    if(theshowUpload){
      this.barcode = "";
      this.showcamera = false;
      this.showCropper = false;
      this.showvideo = false;
      this.showvideoRecorded = false;
      this.stopvideo = false;
    }
    this._showUpload = theshowUpload;
  }
  
   gotDevices(mediaDevices: MediaDeviceInfo[]) {
    let count = 1;
    mediaDevices.forEach(mediaDevice  => {
      if (mediaDevice.kind === 'videoinput') {
        if( this.mediaDevices)
                this.mediaDevices.push(mediaDevice);
      }
      if(this.mediaDevices.length > 0)
            this.selectedDevice = this.mediaDevices[0];
    });
  }
  ngOnInit(): void {
    
    this.videoPlayer = <HTMLVideoElement>document.getElementById("video");
    this.videoRecorded =  <HTMLVideoElement>document.getElementById("videoRecorded");
    this.videoLive =  <HTMLVideoElement>document.getElementById("videoLive");
    this.mycanvas = <HTMLCanvasElement>document.getElementById("mycanvas");
    this.myFilecanvas = <HTMLImageElement>document.getElementById("myFilecanvas");

    var n = <any>navigator;
    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia;
    navigator.mediaDevices.enumerateDevices().then(c => this.gotDevices(c));
    n.getUserMedia({ video: true, audio: false }, (mystream: MediaStream) => {
      this.currentStream = mystream;
      if(!this.currentStream){
        //console.log("this.currentStream ")
      return;}
      
      this.showcamera = true;
       this.mediaRecorder = new MediaRecorder(this.currentStream, { // <3>
        mimeType: 'video/webm',
      })
    this.mediaRecorder.addEventListener('dataavailable', event => {
      if(this.videoRecorded)
         {
          this.videoRecorded.src = URL.createObjectURL(event.data) ;
          this.myVideoBlob = event.data;
         }
    })
    //this.allowVideo();
    //this.allowCamera();
    }, () => console.log("Fail"));
//this.allowCamera();
  }
  stopMediaTracks(stream: MediaStream) {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  switchCam(){
    if ( this.currentStream !== null) {
      this.stopMediaTracks(this.currentStream);
    }
    const videoConstraints: MediaTrackConstraints = {};
    this.selectedDeviceIndex = (this.selectedDeviceIndex+1) % this.mediaDevices.length;
    this.selectedDevice = this.mediaDevices[this.selectedDeviceIndex];
    if (this.selectedDevice === null) {
      console.log(this.selectedDevice);
      videoConstraints.facingMode = 'environment';
    } else {
      videoConstraints.deviceId = { exact: this.selectedDevice.deviceId };
    }
    const constraints = {
      video: videoConstraints,
      audio: false
    };
  
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        this.currentStream = stream;
        if(this.showvideo)
                this.showvideo = true
                else this.showcamera = true;
        // if(this.videoPlayer)
        //         this.videoPlayer.srcObject = stream;
        // return navigator.mediaDevices.enumerateDevices();
      })
      // .then(c => this.gotDevices(c))
      .catch(error => {
        this._notificationSvc.error('Errore', error, environment.notificationTimeOut); 
      });
  }

  allowCamera(){
    //console.log("allowCamera="+  this.showcamera);
    this.showcamera = true;
  }
  allowVideo(){
    this.showvideo = true;
  }

  AllowUpload(){
    this.showUpload = true;
  }


  takepicture() {
    if ( !this.videoPlayer || !this.mycanvas)
      return;
      //const canvas = document.createElement('canvas') as HTMLCanvasElement;
    var context = this.mycanvas.getContext('2d');
    if (!context)
      return;

    if (this.width && this.height) {
      this.mycanvas.width = this.width;
      this.mycanvas.height = this.height;
      context.drawImage(this.videoPlayer, 0, 0, this.width, this.height);     
    } 
    this.showCropper = true;
  }


  discardvideo(){
    this.showvideo = true;
  }
  discardpicture(){
    this.showcamera = true;
  }

  fileChangeEvent(event: any): void {
    this.fileToUpload = event.target.files[0];
    
    if(!this.myFilecanvas)return;
    this.myFilecanvas.src = window.URL.createObjectURL(event.target.files[0]);
  }

  ReadBarcode(){
    this.barcode = "";
    if(!this.mycanvas)
    return;
 var FILEURI = this.mycanvas.toDataURL('image/png');

 this.fileUploadService.GetBarCodeFromImage64(FILEURI).subscribe({
  next: (v) => this.barcode = v,
  error: (e) => {// this.barcode =e.message ;
    this._notificationSvc.error('Documentale','Errore di comunicazione di rete', environment.notificationTimeOut)
  },
  complete: () =>     this._notificationSvc.success('Documentale','Operazione terminata', environment.notificationTimeOut) 
}      
)     
  }

  startvideo(){
    this.stopvideo = true;
    if(this.mediaRecorder){
      if(this.mediaRecorder.state == "recording")this.mediaRecorder.stop();
            this.mediaRecorder.start() }
 
  }
  stopvideoRecording(){
    this.showvideoRecorded = true; 
    if(this.mediaRecorder)
    this.mediaRecorder.stop()    
  }

  uploadVideo(){
    this.fileUploadService.uploadVideo(this.myVideoBlob).subscribe({
      next: (v) => console.log(v),
      error: (e) => {
        console.log(e);
        this._notificationSvc.error('Documentale','Errore nella comunicazione di rete', environment.notificationTimeOut)
      },
      complete: () => {
        console.info('complete') ;
        this._notificationSvc.success('Documentale','Video caricato!', environment.notificationTimeOut);
      }
    }      
    )
  }

  ReadBarcodeFromImageFile(): void {
    this.barcode = "";
    this.fileUploadService.GetBarCodeFromImageFile(this.fileToUpload, "test").subscribe({
      next: (v) => this.barcode = v,
      error: (e) =>      this._notificationSvc.error('Documentale','Errore nella comunicazione di rete', environment.notificationTimeOut),
      complete: () =>  this._notificationSvc.success('Documentale','Operazione terminata!', environment.notificationTimeOut)
    }      
    )
  }

  logout(){
    //console.log("logout");
    this.tokenStorageService.signOut();
   
  }
}
