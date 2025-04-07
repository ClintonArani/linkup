import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UsersComponent } from './users/users.component';
import { HomeComponent } from './users/home/home.component';
import { MessagesComponent } from './users/messages/messages.component';
import { AttachmentsComponent } from './users/attachments/attachments.component';
import { ProfileComponent } from './users/profile/profile.component';
import { ResourcesComponent } from './users/resources/resources.component';
import { ConnectionsComponent } from './users/connections/connections.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { AttachmentComponent } from './admin/attachment/attachment.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { MynetworkComponent } from './users/mynetwork/mynetwork.component';
import { AuthGuard } from './auth.guard'; // Import the AuthGuard
import { BookComponent } from './admin/book/book.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChatbotsystemComponent } from './components/chatbotsystem/chatbotsystem.component';
import { LandingComponent } from './components/landing/landing.component';


export const routes: Routes = [
    {path: 'landing',component:LandingComponent},
    {path: '', redirectTo: '/landing', pathMatch: 'full'},
    { path: 'login', component: SignInComponent },
    { path: 'signup', component: SignUpComponent },
    {path: 'reset-password', component: ForgotPasswordComponent},
    {path: 'change-password', component: ChangepasswordComponent},
    {path: 'chatbot', component: ChatbotsystemComponent},
    
    {
      path: 'user',
      component: UsersComponent,
      canActivate: [AuthGuard],  // Main guard
      canActivateChild: [AuthGuard], // Protect child routes
      children: [
        { path: '', redirectTo: 'home', pathMatch: 'full' }, 
        { path: 'home', component: HomeComponent },
        { path: 'messages', component: MessagesComponent },
        { path: 'attachment', component: AttachmentsComponent },
        { path: 'connections', component: ConnectionsComponent },
        { path: 'profile', component: ProfileComponent },
        { path: 'resources', component: ResourcesComponent },
        { path: 'mynetwork', component: MynetworkComponent }
      ]
    },
  

    // Protected routes for admin users
    { 
        path: 'admin', 
        component: AdminComponent,
        canActivate: [AuthGuard], // Apply AuthGuard to the parent route
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redirects /admin to /admin/dashboard
            { path: 'dashboard', component: DashboardComponent },
            { path: 'users', component: ManageUsersComponent },
            { path: 'internships', component: AttachmentComponent },
            { path: 'reports', component: ReportsComponent },
            { path: 'books', component: BookComponent}
        ]
    },
    { path: '**', redirectTo: '/login' } , 
];