//Creamos la entidad user exportandola para hacerla visible por otros scripts
//al pasarle los parametros(atributos) de forma directa al contructor, estamos creando una property,
//creando sus respectivos getters and setters e inicializandolos --> this.propertie = propertie
export class User{
    constructor(
        public _id: string,
        public name: string,
        public lastname: string,
        public email: string,
        public password: string,
        public role: string,
        public image: string
    ){}
}