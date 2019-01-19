import { NgModule } from '@angular/core';
import { MinuteSecondsPipe } from './minute-seconds/minute-seconds';
@NgModule({
	declarations: [MinuteSecondsPipe],
	imports: [],
	exports: [MinuteSecondsPipe]
})
export class PipesModule {}
