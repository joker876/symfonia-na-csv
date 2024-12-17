import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural',
  standalone: true
})
export class PluralPipe implements PipeTransform {

  transform(value: number, plurals: [string, string, string]): string {
    const [v1, v234, v5] = plurals;

    if (value === 1) return `${value} ${v1}`;
    if (value % 10 >= 2 && value % 10 <= 4 && value > 14) return `${value} ${v234}`;
    return `${value} ${v5}`;
  }

}
