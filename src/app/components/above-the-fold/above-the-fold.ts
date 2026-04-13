import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Btn } from '../../shared/components/btn/btn';

/**
 * This component displays the hero section without any code logic.
 */
@Component({
  selector: 'app-above-the-fold',
  imports: [NgOptimizedImage, Btn, RouterLink],
  templateUrl: './above-the-fold.html',
  styleUrl: './above-the-fold.scss',
})
export class AboveTheFoldComponent {}
