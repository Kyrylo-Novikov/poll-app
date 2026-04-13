import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Btn } from '../../shared/components/btn/btn';

@Component({
  selector: 'app-above-the-fold',
  imports: [NgOptimizedImage, Btn, RouterLink],
  templateUrl: './above-the-fold.html',
  styleUrl: './above-the-fold.scss',
})
export class AboveTheFoldComponent {
  // creatImgSrc: string = '/assets/imgs/icons/add_circle.svg';
}
