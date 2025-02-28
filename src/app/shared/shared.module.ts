import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { LoadingModule } from '../loading/loading.module';



import { PercentageDirective } from '../directive/percentage.directive';







@NgModule({
  declarations: [
    PercentageDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    LoadingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
  ],
  exports:[
    FormsModule,
    ReactiveFormsModule,
    LoadingModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,


    // directive
    PercentageDirective,
  ]
})
export class SharedModule { }
