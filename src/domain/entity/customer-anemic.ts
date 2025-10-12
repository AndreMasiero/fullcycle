// Esta é ume entidade anemica, para persistência de dados, ou seja,sem comportamentos, apenas atributos
class CustomerAnemic {
    _id: string;
    _name: string;
    _address: string;

    constructor(id: string, name: string, _address: string) {
        this._id = id;
        this._name = name;
        this._address = _address;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get address(): string {
        return this._address;
    }

    set id(id: string) {
        this._id = id;
    }

    set name(name: string) {
        this._name = name;
    }

    set address(address: string) {
        this._address = address;
    }
}