import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, RoutesRecognized } from '@angular/router';
import { LoginService } from './login.service';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from './globals';

@Component({
  selector: 'legislation-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public loading = false;
  availableLanguages = Globals.availableLanguages;

  title = 'frontend-legislation';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private translate: TranslateService
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
          this.loading = true;
      }
    });
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
          this.loading = false;
      }
    });
    router.events.subscribe(event => {
      if (event instanceof NavigationCancel) {
          this.loading = false;
      }
    });
    /*router.events.subscribe(event => {
      if (event instanceof RoutesRecognized) {
          this.checkState(event.url);
      }
    });*/
  }

  setLang(lang: string) {
    this.loginService.saveSelectedLanguage(lang);
    this.translate.use(this.loginService.getSelectedLanguage());
    console.log("selected language: " + this.loginService.getSelectedLanguage());
  }
}
