export class Resolver {
    private static readonly modules: Map<string, any> = new Map();

    static register<T>(name: string, instance: T): Resolver {
        this.modules.set(name, instance);
        return this;
    }

    static get(name: string): any {
        if(!this.modules.has(name)) {
            throw new Error('no declared instance of ' + name);
        }

        return this.modules.get(name);
    }

    static release(name: string): Resolver {
        this.modules.delete(name);
        return Resolver;
    }
}