export class EmailError extends Error {
    public constructor(){
        super("Invalid email");
    }
}