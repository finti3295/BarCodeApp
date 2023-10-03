import { Component } from '@angular/core';
import { FileUploadService } from './services/fileUpload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private fileUploadService: FileUploadService) { }

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
  width: number = 0;
   height: number = 0;
   frameRate: number | undefined = 0;

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
      console.log("this.videoLive", this.videoLive);
      if (!this.videoLive) return;
    this.videoLive.srcObject = this.currentStream;
    if (!MediaRecorder.isTypeSupported('video/webm')) { // <2>
      console.warn('video/webm is not supported')
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
    if(theshowcamera){
      this.barcode = "";
      this.showCropper = false;
      this.showvideo = false;
      this.showvideoRecorded = false;
      this.showUpload = false;
      this.stopvideo = false;
      if (!this.videoPlayer) return;
      this.mediaRecorder?.stop();
      this.videoPlayer.srcObject = this.currentStream;
      this.videoPlayer.play();
      if(!this.videoPlayer.srcObject)
            return;
      let track = this.videoPlayer.srcObject.getTracks()[0];
      if (track.getSettings) {
        let { width, height, frameRate } = track.getSettings();
        if (width)
          this.width = width;
        if (height)
          this.height = height;
          if(this.frameRate)
                  this.frameRate = frameRate;

        //console.log(`${width}x${height}x${frameRate}`);
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
        // const option = document.createElement('option');
        // option.value = mediaDevice.deviceId;
        // const label = mediaDevice.label || `Camera ${count++}`;
        // const textNode = document.createTextNode(label);
        // option.appendChild(textNode);
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
    //this.select = <HTMLSelectElement>document.getElementById('select');
   // console.log("this.videoLive init", this.videoLive);
    var n = <any>navigator;
    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia;
    navigator.mediaDevices.enumerateDevices().then(c => this.gotDevices(c));
    n.getUserMedia({ video: true, audio: false }, (mystream: MediaStream) => {
      this.currentStream = mystream;
      if(!this.currentStream)
      return;
      
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
    }, () => console.log("Fail"));

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
        console.error(error);
      });
  }

  allowCamera(){
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
    this.myFilecanvas.src = window.URL.createObjectURL(event.target.files[0]);// this.fileToUpload;
    // var context = this.myFilecanvas.getContext('2d');
    // if (!context)
    //   return;

    // if (this.width && this.height) {
    //   this.myFilecanvas.width = this.width;
    //   this.myFilecanvas.height = this.height;
    //   context.drawImage(this.videoPlayer, 0, 0, this.width, this.height);     
    // } 
  }

  ReadBarcode(){
    this.barcode = "";
    if(!this.mycanvas)
    return;
 var FILEURI = this.mycanvas.toDataURL('image/png');
      this.fileUploadService.GetBarCodeFromImage(FILEURI).subscribe(data => {
        this.barcode = data;
        //console.log( data)
    },
    error => {
      this.barcode =error.message ;
    });
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
    this.fileUploadService.uploadVideo(this.myVideoBlob).subscribe(data => {console.log("uploadVideo ", data)},
    error => {console.log("uploadVideo ", error);
    });
  }

  ReadBarcodeFromImageFile(): void {
    this.barcode = "";
    this.fileUploadService.GetBarCodeFromImageFile(this.fileToUpload, "test").subscribe(data => {
      this.barcode = data;
      console.log( data)
    },
    error => { 
      this.barcode =error.message ;
    });
  }
}
