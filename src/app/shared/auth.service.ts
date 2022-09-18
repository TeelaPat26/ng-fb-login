import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private fireauth: AngularFireAuth,
    private router: Router
    ) { }

    // Login method
    login(email: string, password: string) {
      this.fireauth.signInWithEmailAndPassword(email, password).then( res => {
        localStorage.setItem('token', 'true');

        if(res.user?.emailVerified == true) {
          this.router.navigate(['/dashboard'])
        } else {
          this.router.navigate(['/verify-email'])
        }
      }, err => {
        alert('Something went wrong');
        this.router.navigate(['/login']);
      })
    }

    // register
    register(email: string, password: string) {
      this.fireauth.createUserWithEmailAndPassword(email, password).then( res => {
        alert('Register successful');
        this.router.navigate(['/login']);
        this.sendEmailForVerify(res.user);
      }, err => {
        alert(err.message);
        this.router.navigate(['/register'])
      })
    }

    // sign out
    logout(){
      this.fireauth.signOut().then( () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login'])
      }, err => {
        alert(err.message)
      })
    }

    // forget password
    forgotPassword(email: string){
      this.fireauth.sendPasswordResetEmail(email).then( () => {
        this.router.navigate(['/verify-email']);
      }, err => {
        alert('Something went wrong!')
      }
      )
    }

    // email verification
    sendEmailForVerify(user: any){
      user.sendEmailForVerify().then((res: any) => {
        this.router.navigate(['/verify-email']);
      }, (err : any) => {
        alert('Something went wrong! Cannot send verification')
      })
    }
}
