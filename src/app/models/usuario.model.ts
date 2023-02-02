
export class Usuario {

  static fromFirestore( firestoreUser ) {
    return new Usuario( firestoreUser?.uid, firestoreUser?.nombre, firestoreUser?.email );
  }

  constructor(
    public uid: string,
    public nombre: string,
    public email: string
  ) {}
}
