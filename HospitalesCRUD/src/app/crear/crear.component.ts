import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HospitalService } from '../services/hospital.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Hospital } from '../models/hospital';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatProgressSpinnerModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss'],
  providers: [HttpClient, HospitalService]
})
export class CrearComponent {
  ready = true;
  id = 0;
  hospital: Hospital = { id: 0, nombre: '', direccion: '' };
  formCreate: FormGroup;
  newId = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hospitalService: HospitalService,
    private fb: FormBuilder
  ) {

    this.formCreate = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }


  cancel() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.ready = false;

    this.hospitalService.getHospitales().subscribe({
      next: (data) => {
        this.newId = data.reduce((max, p) => p.id > max ? p.id : max, data[0].id);
        this.newId++;
        this.hospital.id = this.newId;
        this.ready = true;
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.hospital.nombre = this.formCreate.value.nombre;
    this.hospital.direccion = this.formCreate.value.direccion;

    console.log(this.hospital);

    this.hospitalService.createHospital(this.hospital).subscribe({
      next: (data) => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
