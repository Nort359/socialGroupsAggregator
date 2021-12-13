export interface IGroup {
    id: string;
    name: string;
    user: string;
}

export default class GroupDto implements IGroup {
    id;
    name;
    user;

    constructor(model) {
        this.id = model._id;
        this.name = model.name;
        this.user = model.user;
    }
}
