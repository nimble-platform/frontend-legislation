import { Injectable } from '@angular/core';
import { UserInterface } from './interfaces/user.interface';
import { Router } from '@angular/router';
import { Globals } from './globals';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public user: UserInterface;
  public selectedLang: string;

  constructor(
    private router: Router,
  ) { 
    this.saveSelectedLanguage(Globals.defaultLanguage);
  }

  saveUser(user: UserInterface) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  getUser() {
    this.user = JSON.parse( localStorage.getItem("user") );
    return this.user;
  }

  saveSelectedLanguage(lang: string) {
    this.selectedLang = lang;
    localStorage.setItem("selectedLang", lang);
  }

  getSelectedLanguage() {
    this.selectedLang = localStorage.getItem("selectedLang");
    return this.selectedLang;
  }

  logout() {
    this.user = null;
    localStorage.setItem("user", null);
    this.router.navigate(['/login/']);
  }
}
