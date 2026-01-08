import { Component } from "@angular/core";
import { PersonalInfo } from "../personal-info/personal-info";
import { ButtonList } from "../button-list/button-list";

@Component({
    templateUrl: 'index.html',
    styleUrl: 'index.scss',
    imports: [PersonalInfo, ButtonList],
})
export class Index {

}
