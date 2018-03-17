import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Système de coordonnées de la carte
const mapViewBox = '-1900 -750 4500 2430';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  pathData: string;
  countries: Array<any>;
  viewBox: string;
  animTo: string;
  animFrom: string;
  zoomed: boolean;
  pointX: number;
  pointY: number;

  constructor(private http: HttpClient) {
    this.zoomed = false;
    this.viewBox = mapViewBox;
    this.animTo = mapViewBox;
    this.pointX = 0; this.pointY = 0;
  }

  async ngOnInit() {
    this.pathData = await this.http.get('assets/earthpathdata.txt', { responseType: 'text' }).toPromise();
    this.countries = await this.http.get('assets/countriesdata.json').toPromise() as Array<any>;
  }

  public zoomOnCountry(animageElmIn: any, targetViewBox) {
    if (this.zoomed) {
      this.viewBox = targetViewBox;
      this.animFrom = targetViewBox;
      this.animTo = mapViewBox;
    } else {
      this.viewBox = mapViewBox;
      this.animFrom = mapViewBox;
      this.animTo = targetViewBox;
    }
    animageElmIn.beginElement();
    this.zoomed = !this.zoomed;
  }

  private viewBoxToObject(viewBox: string) {
    const coors = viewBox.split(' ');
    return {
      'left': parseInt(coors[0], 10),
      'top': parseInt(coors[1], 10),
      'right': parseInt(coors[2], 10),
      'bottom': parseInt(coors[3], 10)
    };
  }

  public updateGlassCoordinates(mouseEvent: MouseEvent, mapElement: SVGElement) {
    const rectsList = mapElement.getClientRects();
    const svgRect = rectsList[rectsList.length - 1];
    const relativeMouseX = mouseEvent.clientX - svgRect.left;
    const relativeMouseY = mouseEvent.clientY - svgRect.top;
    const viewPortRect = this.viewBoxToObject(mapElement.getAttribute('viewBox'));

    // transformation en coordonnées de la carte
    this.pointX = viewPortRect.left + relativeMouseX * ((viewPortRect.right) / (svgRect.width));
    this.pointY = viewPortRect.top + relativeMouseY * ((viewPortRect.bottom) / (svgRect.height));

    console.log(this.pointX , this.pointY);
  }
}
