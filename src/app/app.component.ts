import { Component, inject, Input, OnInit } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ApiService } from './api.service';
import { catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap } from 'rxjs';

interface MovieTitle {
  node: {
    entity: {
      titleText: {
        text: string;
      };
      primaryImage?: {
        url: string;
      };
      principalCredits: any[];
    };
  };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatCardModule,
    CommonModule,
    NgOptimizedImage
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  titleApiData = inject(ApiService);

  titleData: MovieTitle[] = [];

  @Input()
  color: string | null = 'primary';

  movie = new FormControl('');

  ngOnInit(): void {
    this.movie.valueChanges.pipe(
      debounceTime(500),
      map(value => value?.trim()),
      filter((value): value is string => value !== null && value !== undefined && value.length > 0), 
      distinctUntilChanged(),
      switchMap((searchTerm: string) => 
        this.titleApiData.getData(searchTerm).pipe(
          catchError(error => {
            console.error('Search error:', error);
            return of({ data: { mainSearch: { edges: [] } } });
          })
        )
      )
    ).subscribe((data: any) => {
      this.titleData = data?.data?.mainSearch?.edges ?? [];
    });
  }

  onSubmit() {
    const movieName = this.movie.value ?? '';
    this.titleApiData.getData(movieName).subscribe((data) => {
      this.titleData = data?.data?.mainSearch?.edges ?? [];
    });
  }

  getActorNames(principalCredits: any[]): string {
    if (!principalCredits || principalCredits.length === 0) {
      return 'No actors available';
    }
    return principalCredits
      .flatMap((credit) => credit.credits)
      .map((credit) => credit.name?.nameText?.text ?? 'Unknown')
      .join(', ');
  }
}
