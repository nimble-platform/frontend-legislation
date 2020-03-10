import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    public loginService: LoginService
  ) { 
    translate.use(this.loginService.getSelectedLanguage());
  }

  ngOnInit() {
  }

}
