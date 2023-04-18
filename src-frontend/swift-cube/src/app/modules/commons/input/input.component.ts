import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() inputId: string = "";
  @Input() inputClass: string = "";
  @Input() inputName: string = "";
  @Input() inputPlaceholder: string = "";
  @Input() inputNgModel: any;
  @Input() isRequired: boolean = false;
  @Input() inputPattern: string = "";
  // @Input() formControl?: FormControl;
  @Input() inputType?: "text" | "password" | "checkbox" | "radio" | "submit" | "reset" | "file" |
    "hidden" | "image" | "number" | "color" | "range" | "date" | "datetime-local" | "month" |
    "time" | "week" | "email" | "search" | "tel" | "url";
  @Output() inputNgModelChange = new EventEmitter();
  @Output() inputChange = new EventEmitter();

  onValueChange() {
    this.inputNgModelChange.emit(this.inputNgModel);
  }

  // onInputChange(event: any) {
  //   this.inputChange.emit(event.target.value);
  // }
}
