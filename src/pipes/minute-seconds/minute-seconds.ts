import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the MinuteSecondsPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'minuteSecondsPipe',
})
export class MinuteSecondsPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return minutes + ':' + Math.round(value - minutes * 60);
  }
}
