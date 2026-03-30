import { Component, signal, ViewChild, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    Header,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  @ViewChild('drawer') drawer!: MatSidenav;

  protected readonly title = signal('Gestor Fichajes');
  protected isAuthPage = signal(false);
  private router = inject(Router);
  // private authService = inject(AuthService); // Removed to compile
  private breakpointObserver = inject(BreakpointObserver);
  isMobile = signal(false);

  ngOnInit() {
    // Detect mobile breakpoint
    this.breakpointObserver.observe('(max-width: 768px)').subscribe((result) => {
      this.isMobile.set(result.matches);
      if (result.matches && this.drawer?.opened) {
        this.drawer.close();
      }
    });

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkUrl(event.urlAfterRedirects);
        // Auto-close sidebar on navigation when mobile
        if (this.isMobile() && this.drawer?.opened) {
          this.drawer.close();
        }
      });

    // Initial check
    this.checkUrl(this.router.url);
  }

  private checkUrl(url: string) {
    // Check if the URL contains 'login' or 'register' or is root '/'
    // This simple check might need refinement if you have nested routes, but works for top-level
    this.isAuthPage.set(
      url.includes('/login') || url.includes('/register') || url === '/' || url === '',
    );
  }
}
