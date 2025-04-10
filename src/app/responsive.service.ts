import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isTablet$ = this.breakpointObserver.observe([Breakpoints.Tablet])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isWeb$ = this.breakpointObserver.observe([Breakpoints.Web])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}