import { Component } from "@angular/core";
import { PersonalInfo } from "../personal-info/personal-info";

@Component({
    templateUrl: 'index.html',
    styleUrl: 'index.scss',
    imports: [PersonalInfo],
})
export class Index {

}
