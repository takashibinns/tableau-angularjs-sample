import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tableau-embeded-viz',
  templateUrl: './tableau-embeded-viz.component.html',
  styleUrls: ['./tableau-embeded-viz.component.css']
})
export class TableauEmbededVizComponent implements OnInit {

  constructor() { }

  @Input() vizUrl = ''; //  Inherit from the top level component
  @Input() divId = ''; //  Inherit from the top level component

  ngOnInit(): void {
  }
}
