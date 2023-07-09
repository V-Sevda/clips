import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'; //need to generate a valid URL

@Pipe({
  name: 'safeURL'
})
export class SafeURLPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer){}

  transform(value: string) {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }
}
