export {};


declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: any) => void }) => void;
          disableAutoSelect: () => void;
          renderButton: (container: HTMLElement, options: any) => void;
          prompt: () => void;
        };
        oauth2: {
          revoke: (token:string, callback:(response:any)=>void) => void;
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string }) => void;
          }) => { requestAccessToken: () => void };
        }
      };
    };
  }
}

// untuk Google Login