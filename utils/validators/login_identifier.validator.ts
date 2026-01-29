import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: "LoginIdentifier", async: false })
export class LoginIdentifierValidator implements ValidatorConstraintInterface{
    validate(_:any,args:ValidationArguments){
        const obj = args.object as any
        const hasEmail = !!obj.email
        const hasUsername = !!obj.username

        return hasEmail || hasUsername
    }

    defaultMessage(): string {
        return "Either email or username must be provided."
    }
}