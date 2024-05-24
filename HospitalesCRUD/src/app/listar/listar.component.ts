import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../services/hospital.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Hospital } from '../models/hospital';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarDialogComponent } from '../confirmar-dialog/confirmar-dialog.component';

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [HttpClientModule, MatDialogModule, CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatTableModule, MatCardModule, ConfirmarDialogComponent, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './listar.component.html',
  providers: [HttpClient, HospitalService],
  styleUrl: './listar.component.scss'
})
export class ListarComponent {
  ready = false;
  hospitales: Hospital[] = [];
  displayedColumns = ['id', 'nombre', 'direccion', 'acciones'];
  
  constructor(private hospitalService: HospitalService, private router: Router, public dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.hospitalService.getHospitales().subscribe({
      next: (data) => {
        this.hospitales = data;
        this.ready = true;
      },
      error: (error) => {
        console.error(error);
      }
    });
    // console.log(this.hospitales);
  }

  editarHospital(id: number) {
    // console.log('Editar hospital con id ' + id);
    this.router.navigate(['/editar', id]);
  }

  borrarHospital(id: number) {
    // console.log('Borrar hospital con id ' + id);
    const dialogRef = this.dialog.open(ConfirmarDialogComponent, {
      width: '250px',
      data: { message: 'Estas seguro de que quieres eliminar este hospital?' }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.hospitalService.deleteHospital(id).subscribe({
          next: (data) => {
            // console.log('Hospital eliminado');
            this.hospitales = this.hospitales.filter(hospital => hospital.id !== id);
          },
          error: (error) => {
            console.error(error);
          }
        });
      } else {
        // console.log('Eliminación cancelada');
      }
    });
  }
}