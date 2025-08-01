import type { IStaticMethods } from 'flyonui/flyonui';

declare global {
  interface Window {
    // Optional plugins
    _;

    // FlyonUI
    HSStaticMethods: IStaticMethods;
  }
  namespace App {}
}

export {};
