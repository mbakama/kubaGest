import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-footer',
  templateUrl: './layout-footer.html',
  styleUrl: './layout-footer.scss',
})
export class LayoutFooter {
  readonly year = new Date().getFullYear();
}
