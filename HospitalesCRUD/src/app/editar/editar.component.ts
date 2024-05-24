import { Component } from '@angular/core';
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
  selector: 'app-editar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatProgressSpinnerModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss'],
  providers: [HttpClient, HospitalService]
})
export class EditarComponent {
  ready = false;
  id = 0;
  hospital: Hospital = { id: 0, nombre: '', direccion: '' };
  formEdit: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hospitalService: HospitalService,
    private fb: FormBuilder
  ) {

    this.formEdit = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadHospitalData();
    });
  }

  loadHospitalData() {
    this.hospitalService.getHospital(this.id).subscribe({
      next: (data) => {
        this.hospital = data;
        this.updateForm();
        this.ready = true;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  updateForm() {
    if (this.formEdit) {
      this.formEdit.setValue({
        nombre: this.hospital.nombre,
        direccion: this.hospital.direccion
      });
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.hospital.id = this.id;
    this.hospital.nombre = this.formEdit.value.nombre;
    this.hospital.direccion = this.formEdit.value.direccion;

    // console.log(this.hospital);
    

    this.hospitalService.updateHospital(this.id, this.hospital).subscribe({
      next: (data) => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
