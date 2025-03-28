import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// custom validator to check that two fields match
export function mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const control = formGroup.get(controlName);
        const matchingControl = formGroup.get(matchingControlName);

        if (!matchingControl) {
            return null;
        }

        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
            return null;
        }

        if (control?.value !== matchingControl.value) {
            matchingControl.setErrors({ 'mustMatch': true });
        } else {
            matchingControl.setErrors(null);
        }

        return null;
    };
}
