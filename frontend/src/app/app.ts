import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppDialogHostComponent } from './core/ui/dialog';
import { AppLoadingHostComponent } from './core/ui/loading';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppDialogHostComponent, AppLoadingHostComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
