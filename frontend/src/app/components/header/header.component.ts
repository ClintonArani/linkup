import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone : true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() scrollToSection = new EventEmitter<string>();
  activeSection: string = 'home';

  
  scrollTo(section: string) {
    console.log('Scrolling to:', section); // Debug log
    this.activeSection = section;
    this.scrollToSection.emit(section);
  }
}