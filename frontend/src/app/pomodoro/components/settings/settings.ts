import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { StorageService } from "../../pomodoro.services";
import { Router, RouterLink } from "@angular/router";

@Component({
    templateUrl: "settings.html",
    styleUrl: "settings.scss",
    imports: [ReactiveFormsModule, RouterLink]
})
export class Settings implements OnInit {
    storageService = inject(StorageService);
    router = inject(Router);
    settings = this.storageService.getSettings();

    settingsForm = new FormGroup({
        workTime: new FormControl(0, [Validators.required, Validators.pattern("^[0-9]+(.[0-9]+)?$"), Validators.min(0)]),
        shortBreakTime: new FormControl(0, [Validators.required, Validators.pattern("^[0-9]+(.[0-9]+)?$"), Validators.min(0)]),
        longBreakTime: new FormControl(0, [Validators.required, Validators.pattern("^[0-9]+(.[0-9]+)?$"), Validators.min(0)]),
        numberOfCycles: new FormControl(0, [Validators.required, Validators.pattern("^[0-9]+(.[0-9]+)?$"), Validators.min(0)]),
        maxConfirmationTime: new FormControl(0, [Validators.required, Validators.pattern("^[0-9]+(.[0-9]+)?$"), Validators.min(0)]),
    })

    ngOnInit(): void 
    {
        this.settingsForm.touched;
        this.settingsForm.get('workTime')!.setValue(this.settings.workTime);
        this.settingsForm.get('shortBreakTime')!.setValue(this.settings.shortBreakTime);
        this.settingsForm.get('longBreakTime')!.setValue(this.settings.longBreakTime);
        this.settingsForm.get('numberOfCycles')!.setValue(this.settings.cyclesBeforeLongBreak);
        this.settingsForm.get('maxConfirmationTime')!.setValue(this.settings.maxConfirmationTime);
    }

    onSubmit(): void
    {
        let value = this.settingsForm.value;
        this.settings = {
            workTime: value.workTime!,
            shortBreakTime: value.shortBreakTime!,
            longBreakTime: value.longBreakTime!,
            cyclesBeforeLongBreak: value.numberOfCycles!,
            maxConfirmationTime: value.maxConfirmationTime!,
            type: 'pomodoro.settings',
        }

        this.storageService.setSettings(this.settings);
        this.router.navigateByUrl('/pomodoro');
    }
}
