export declare type IMicroTaskCallback = () => void;
export declare class MicroTaskScheduler {
    readonly messageName = "zero-timeout-message";
    private executionQueue;
    private stopped;
    start(): void;
    stop(): void;
    postTask(fn: IMicroTaskCallback): void;
    private handleMessage;
}
