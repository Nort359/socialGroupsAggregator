export interface IUser {
    id: string;
    email: string;
    isActivated: string;
}

export default class UserDto implements IUser {
    id;
    email;
    isActivated;

    constructor(model) {
        this.id = model._id;
        this.email = model.email;
        this.isActivated = model.isActivated;
    }
}
