'use strict';

export interface Material {
    count:number;
    material:string;
    dimensions:string;
    weight:number;
    total_weight:number;
}

export const arr_medals:string[]=[
    'blank.png', //single
    '1st-place-medal_1f947.png', //1st stop
    '2nd-place-medal_1f948.png', //2nd stop
    '3rd-place-medal_1f949.png', //3rd stop
    'sports-medal_1f3c5.png',    //4th stop
    'military-medal_1f396-fe0f.png' //5th stop
  ]