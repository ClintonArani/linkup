import { Component, ViewChild, ElementRef } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-landing',
  standalone : true,
  imports: [HeaderComponent, CommonModule, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  // Reference all sections using ViewChild
  @ViewChild('home') homeSection!: ElementRef;
  @ViewChild('about') aboutSection!: ElementRef;
  @ViewChild('course') courseSection!: ElementRef;
  @ViewChild('service') serviceSection!: ElementRef;
  @ViewChild('event') eventSection!: ElementRef;
  @ViewChild('gallery') gallerySection!: ElementRef;
  @ViewChild('teachers') teachersSection!: ElementRef;
  @ViewChild('blogs') blogsSection!: ElementRef;
  @ViewChild('contact') contactSection!: ElementRef;

  // Handle emitted section name from header
  onScrollToSection(section: string) {
    const sectionMap: Record<string, ElementRef> = {
      'home': this.homeSection,
      'about': this.aboutSection,
      'course': this.courseSection,
      'service': this.serviceSection,
      'event': this.eventSection,
      'gallery': this.gallerySection,
      'teacher': this.teachersSection, // Note: Fix inconsistency (header uses 'teacher', HTML uses 'teachers')
      'blogs': this.blogsSection,
      'contact': this.contactSection
    };

    const targetSection = sectionMap[section];
    if (targetSection) {
      targetSection.nativeElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }
  
}