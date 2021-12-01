export default class GroupDto {
    name;
    user;

    constructor(model) {
        this.name = model.name;
        this.user = model.user;
    }
}
