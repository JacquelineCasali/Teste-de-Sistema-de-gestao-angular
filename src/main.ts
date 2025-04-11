import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideNgxMask } from 'ngx-mask';

bootstrapApplication(AppComponent,{

    ...appConfig,
    providers: [
      ...(appConfig.providers || []),
      provideNgxMask()
    ]
})
  .catch((err) => console.error(err));