import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import QrScanner from 'qr-scanner';
import { EventService } from '../../services/event.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.css'
})

export class QrScannerComponent implements OnInit, AfterViewInit {
  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef<HTMLCanvasElement>;

  private video!: HTMLVideoElement;
  private canvas!: CanvasRenderingContext2D;
  scanning: boolean = false;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.video = document.createElement('video');
  }

  ngAfterViewInit(): void {
    this.canvas = this.qrCanvas.nativeElement.getContext('2d')!;
  }

  public encenderCamara(): void {
    if(!this.qrCanvas) {
      console.error('El elemento canvas no esta disponible');
      return;
    }

    console.log('Intentando encender la cámara');
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        console.log('Cámara encendida');
        this.scanning = true;
        this.qrCanvas.nativeElement.hidden = false;
        this.video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
        this.video.srcObject = stream;
        this.video.play();
        this.video.addEventListener('loadedmetadata', () => {
          this.tick();
          this.scan();
        });
      })
      .catch(err => {
        console.error('Error al encender la cámara: ', err);
      });
  }

  public tick(): void {
    if(!this.canvas || !this.video) return;

    this.qrCanvas.nativeElement.height = this.video.videoHeight;
    this.qrCanvas.nativeElement.width = this.video.videoWidth;
    this.canvas.drawImage(this.video, 0, 0, this.qrCanvas.nativeElement.width, this.qrCanvas.nativeElement.height);

    if (this.scanning) {
      requestAnimationFrame(() => this.tick());
    }
  }

  public scan(): void {
    try {
      QrScanner.scanImage(this.qrCanvas.nativeElement, { returnDetailedScanResult: true })
        .then((result: any) => {
          console.log('Escaneado');

          if (result.data) {
            this.qrCodeScanned(result.data);
          }
        })
        .catch((err: Error) => {
          setTimeout(() => this.scan(), 2000);
        });
    } catch (e) {
      setTimeout(() => this.scan(), 2000);
    }
  }

  public cerrarCamara(): void {
    console.log('Apagando la cámara');
    if (this.video.srcObject instanceof MediaStream) {
      const mediaStream = this.video.srcObject as MediaStream;
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    this.qrCanvas.nativeElement.hidden = true;
    this.scanning = false;
  }
    
  public qrCodeScanned(result: number): void {
    const token = localStorage.getItem('token');

    console.log(result);

    this.cerrarCamara();

    this.eventService.scanQr(result, token).subscribe({
      next: (response: string) => {
        console.log('Escaneando');
      },
      error: (error: HttpErrorResponse) => {
        if(error.status !== 200) {
          Swal.fire('Id del registro: ' + result + ' ya fue escaneado anteriormente.');
        }
        else {
          Swal.fire('Id del registro: ' + result + ' escaneado exitosamente.');
        }
      },
      complete: () => {
        console.log('Evento editado exitosamente');
      }
    });
  }
}