import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslocoRootModule, TranslocoHttpLoader } from './transloco-root.module';
import { HttpClient } from '@angular/common/http';
import { TRANSLOCO_CONFIG, TRANSLOCO_LOADER } from '@jsverse/transloco';
import { Translation } from '@jsverse/transloco';
import { environment } from '../environments/environment';

describe('TranslocoRootModule', () => {
  describe('Module Configuration', () => {
    it('should provide TRANSLOCO_CONFIG with correct settings', () => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, TranslocoRootModule]
      });

      const config = TestBed.inject(TRANSLOCO_CONFIG);
      
      // Option 1: Check only the properties we explicitly set
      expect(config).toEqual(
        expect.objectContaining({
          availableLangs: ['de', 'en'],
          defaultLang: 'de',
          reRenderOnLangChange: true,
          prodMode: environment.production
        })
      );
      
      // Option 2: Alternatively, you could check the entire config
      // but this might break if the library changes its defaults
      /*
      expect(config).toEqual({
        availableLangs: ['de', 'en'],
        defaultLang: 'de',
        reRenderOnLangChange: true,
        prodMode: environment.production,
        failedRetries: 2,
        fallbackLang: [],
        flatten: { aot: false },
        interpolation: ['{{', '}}'],
        missingHandler: {
          allowEmpty: false,
          logMissingKey: true,
          useFallbackTranslation: false,
        },
        scopes: { keepCasing: false },
      });
      */
    });

    it('should provide TRANSLOCO_LOADER as TranslocoHttpLoader', () => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, TranslocoRootModule]
      });

      const loader = TestBed.inject(TRANSLOCO_LOADER);
      expect(loader).toBeInstanceOf(TranslocoHttpLoader);
    });
  });

  describe('TranslocoHttpLoader', () => {
    let loader: TranslocoHttpLoader;
    let httpMock: HttpTestingController;
    const mockTranslation = { key: 'value' };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [TranslocoHttpLoader]
      });

      loader = TestBed.inject(TranslocoHttpLoader);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should be created', () => {
      expect(loader).toBeTruthy();
    });

    it('should load translation for a language', () => {
      const lang = 'en';
      loader.getTranslation(lang).subscribe((translation) => {
        expect(translation).toEqual(mockTranslation);
      });

      const req = httpMock.expectOne(`/assets/i18n/${lang}.json`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTranslation);
    });

    it('should handle error when loading translation', () => {
      const lang = 'fr';
      loader.getTranslation(lang).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`/assets/i18n/${lang}.json`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});