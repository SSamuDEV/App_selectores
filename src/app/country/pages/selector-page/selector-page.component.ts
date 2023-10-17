import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/country.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required ],
    country: ['', Validators.required ],
    borders: ['', Validators.required] ,
  });


  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }


  get regions(): Region[] {
    return this.countriesService.regions;
  }


  onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('country')!.setValue('')),
      switchMap( (region) => this.countriesService.getCountriesByRegion(region) )
    )
    .subscribe( countries => {
      console.log({ countries })
      this.countriesByRegion = countries;
    });
  };

  onCountryChanged(): void {
    this.myForm.get('country')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('borders')!.setValue('')),
      filter( (value: string) => value.length > 0),
      switchMap( (alphaCode) => this.countriesService.getCountryByAlphaCode(alphaCode) ),
      switchMap( (country) => this.countriesService.getCountryBordersByCodes(country.borders) ),
    )
    .subscribe( country => {
      console.log({ borders: country })
      this.borders = country;
    });
  };
}
