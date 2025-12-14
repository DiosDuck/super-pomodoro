import { Pipe, PipeTransform } from "@angular/core";
import { NavItem } from "../models/nav-elems";
import { nullableUser } from "../../shared/models/user";

@Pipe({
    name: 'loggedIn',
})
export class LoggedInPipe implements PipeTransform {
    transform(value: NavItem[], user: nullableUser = null, onlyLoggedIn: boolean = false): NavItem[] {
        if (user === null) {
            return value.filter((navItem) => !navItem.loggedIn);
        }
        return value.filter((navItem) => (navItem.loggedIn && (!navItem.adminRequired || user.roles.includes("ROLE_ADMIN"))) || !onlyLoggedIn);
    }
}
