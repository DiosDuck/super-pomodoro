import { Component, inject, OnInit, signal } from "@angular/core";
import { UserService } from "../../shared/services/user";
import { nullableUser } from "../../shared/models/user";

@Component({
    templateUrl: 'personal-info.html',
    styleUrl: 'personal-info.scss',
    selector: 'app-perosnal-info',
})
export class PersonalInfo implements OnInit {
    private _userService = inject(UserService);
    user = signal<nullableUser>(null);

    ngOnInit(): void {
        this._userService.user.subscribe(
            (user: nullableUser) => {
                this.user.set(user);
            }
        );
    }
}