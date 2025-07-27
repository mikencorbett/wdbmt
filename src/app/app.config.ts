import {
  ApplicationConfig,
  inject, provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { LocalStorage } from './api/local-storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAppInitializer(initializeApp)
  ]
};

function initializeApp() {
  const localStorageService = inject(LocalStorage);
  return localStorageService.setSavedTiers();
}
