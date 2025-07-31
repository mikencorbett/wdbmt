import {
  ApplicationConfig,
  inject, provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { LocalStorage } from './api/local-storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideAppInitializer(initializeApp),
    provideAnimationsAsync()
  ]
};

function initializeApp() {
  const localStorageService = inject(LocalStorage);
  return localStorageService.setSavedTiers();
}
