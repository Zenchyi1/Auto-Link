export abstract class scanner {
    abstract setup(plugin: any): void;
    abstract search(plugin: any): void;
    abstract removeEvent(plugin: any): void;
} 
